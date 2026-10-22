import { useEffect, useState } from 'react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  where,
  type QueryConstraint,
} from 'firebase/firestore';
import { useAuth } from './auth-context';
import { db, firebaseConfigured } from './firebase';

export type IdentifiedRecord = { id: string };

export function useSchoolCollection<T extends IdentifiedRecord>(
  collectionName: string,
  demoRecords: T[],
) {
  const { status, profile } = useAuth();
  const [records, setRecords] = useState<T[]>(demoRecords);
  const [loading, setLoading] = useState(firebaseConfigured);
  const [error, setError] = useState('');
  const assignedClasses = profile?.assignedClassIds ?? [];
  const assignedKey = assignedClasses.join('|');

  useEffect(() => {
    if (!firebaseConfigured) {
      setRecords(demoRecords);
      setLoading(false);
      setError('');
      return;
    }

    if (status === 'loading') {
      setLoading(true);
      return;
    }

    if (status !== 'authorized' || !db) {
      setRecords([]);
      setLoading(false);
      setError('');
      return;
    }

    const constraints: QueryConstraint[] = [];
    if (
      profile?.role === 'teacher' &&
      (collectionName === 'students' || collectionName === 'results')
    ) {
      if (assignedClasses.length === 0) {
        setRecords([]);
        setLoading(false);
        setError('');
        return;
      }
      constraints.push(where('classId', 'in', assignedClasses));
    }

    setLoading(true);
    setError('');
    const source = query(collection(db, collectionName), ...constraints);
    return onSnapshot(
      source,
      (snapshot) => {
        setRecords(
          snapshot.docs.map(
            (item) => ({ id: item.id, ...item.data() }) as T,
          ),
        );
        setLoading(false);
      },
      (snapshotError) => {
        setRecords([]);
        setError(snapshotError.message);
        setLoading(false);
      },
    );
  }, [
    assignedKey,
    collectionName,
    profile?.role,
    profile?.uid,
    status,
  ]);

  return {
    records,
    loading,
    error,
    isDemo: !firebaseConfigured,
  };
}

export type AdmissionApplication = {
  childName: string;
  guardianName: string;
  phone: string;
  email: string;
  classApplying: string;
  startTerm: string;
  notes: string;
};

export async function submitAdmissionApplication(
  application: AdmissionApplication,
) {
  if (!db || !firebaseConfigured) {
    throw new Error('Firebase is not configured. No application was saved.');
  }

  await addDoc(collection(db, 'admissionApplications'), {
    ...application,
    status: 'new',
    createdAt: serverTimestamp(),
  });
}

export type StudentInput = {
  name: string;
  code: string;
  classId: string;
  className: string;
  guardian: string;
  status: string;
};

export async function createStudentRecord(student: StudentInput) {
  if (!db) throw new Error('Firebase is not configured.');
  await addDoc(collection(db, 'students'), student);
}

export async function deleteStudentRecord(id: string) {
  if (!db) throw new Error('Firebase is not configured.');
  await deleteDoc(doc(db, 'students', id));
}
