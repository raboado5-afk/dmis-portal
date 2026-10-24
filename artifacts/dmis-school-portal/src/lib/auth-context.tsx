import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, firebaseConfigured } from './firebase';

export type StaffRole = 'admin' | 'teacher';

export type StaffProfile = {
  uid: string;
  displayName: string;
  email: string;
  role: StaffRole;
  assignedClassIds: string[];
};

type AuthStatus =
  | 'demo'
  | 'loading'
  | 'signed-out'
  | 'authorized'
  | 'unauthorized';

export type StaffProfileIssue =
  | 'missing-profile'
  | 'invalid-role'
  | `firestore-read:${string}`;

type AuthContextValue = {
  configured: boolean;
  status: AuthStatus;
  profile: StaffProfile | null;
  profileIssue: StaffProfileIssue | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function profileFromData(
  uid: string,
  user: User,
  value: Record<string, unknown>,
): StaffProfile | null {
  if (value.role !== 'admin' && value.role !== 'teacher') return null;
  return {
    uid,
    displayName:
      typeof value.displayName === 'string'
        ? value.displayName
        : user.displayName ?? user.email ?? 'DMIS staff',
    email: user.email ?? '',
    role: value.role,
    assignedClassIds: Array.isArray(value.assignedClassIds)
      ? value.assignedClassIds.filter(
          (item): item is string => typeof item === 'string',
        )
      : [],
  };
}

function firestoreErrorCode(error: unknown): string {
  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof error.code === 'string' &&
    /^[a-z0-9-]+(?:\/[a-z0-9-]+)?$/i.test(error.code)
  ) {
    return error.code;
  }
  return 'unknown';
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>(
    firebaseConfigured ? 'loading' : 'demo',
  );
  const [profile, setProfile] = useState<StaffProfile | null>(null);
  const [profileIssue, setProfileIssue] = useState<StaffProfileIssue | null>(null);
  const deniedUser = useRef(false);

  useEffect(() => {
    const currentAuth = auth;
    const currentDb = db;
    if (!currentAuth || !currentDb) {
      setStatus('demo');
      return;
    }

    return onAuthStateChanged(currentAuth, async (user) => {
      if (!user) {
        setProfile(null);
        setStatus(deniedUser.current ? 'unauthorized' : 'signed-out');
        if (!deniedUser.current) setProfileIssue(null);
        deniedUser.current = false;
        return;
      }

      setStatus('loading');
      setProfileIssue(null);
      try {
        const profileDoc = await getDoc(doc(currentDb, 'staffProfiles', user.uid));
        if (!profileDoc.exists()) {
          deniedUser.current = true;
          setProfileIssue('missing-profile');
          setProfile(null);
          await firebaseSignOut(currentAuth);
          return;
        }

        const staffProfile = profileFromData(
          user.uid,
          user,
          profileDoc.data() as Record<string, unknown>,
        );
        if (!staffProfile) {
          deniedUser.current = true;
          setProfileIssue('invalid-role');
          setProfile(null);
          await firebaseSignOut(currentAuth);
          return;
        }

        setProfile(staffProfile);
        setStatus('authorized');
      } catch (error) {
        deniedUser.current = true;
        setProfileIssue(`firestore-read:${firestoreErrorCode(error)}`);
        setProfile(null);
        await firebaseSignOut(currentAuth);
      }
    });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      configured: firebaseConfigured,
      status,
      profile,
      profileIssue,
      signIn: async (email, password) => {
        if (!auth) throw new Error('Firebase Authentication is not configured.');
        await signInWithEmailAndPassword(auth, email, password);
      },
      signOut: async () => {
        if (auth) await firebaseSignOut(auth);
      },
    }),
    [profile, profileIssue, status],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside AuthProvider.');
  return value;
}
