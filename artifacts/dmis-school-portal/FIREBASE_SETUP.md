# DMIS Firebase setup

The site runs in an explicitly labeled sample-data preview until Firebase is
configured. Do not enter real student or staff information while the preview
banner says Firebase is not connected.

## 1. Create a Firebase project

1. Open the Firebase Console and create a project for Darul Muttaqeen
   International School.
2. Add a Web app in Project settings.
3. Copy its web-app configuration values. The Firebase web API key is a
   browser identifier, not an administrator credential; never put a service
   account JSON file or private key in the browser app.

## 2. Enable sign-in

1. In **Authentication → Sign-in method**, enable **Email/Password**.
2. In **Authentication → Users**, create the first administrator account.
3. Keep public account creation disabled. This site only signs in accounts
   created by the school administrator.

## 3. Create Firestore and apply rules

1. Create a Cloud Firestore database in the Firebase Console.
2. Open **Firestore Database → Rules**.
3. Replace the initial rules with the contents of `firestore.rules` in this
   folder, then publish the rules.
4. In **Authentication → Users**, copy the administrator's UID.
5. In Firestore, create a document at `staffProfiles/{ADMIN_UID}` with:

   ```json
   {
     "displayName": "School Administrator",
     "role": "admin",
     "assignedClassIds": []
   }
   ```

   Replace `{ADMIN_UID}` in the document path with the actual UID. Creating
   this first profile through the Firebase Console is the bootstrap step;
   client-side requests cannot grant themselves a role.
6. Add teacher accounts in Authentication, then create a matching
   `staffProfiles/{TEACHER_UID}` document for each one with `role: "teacher"`
   and an `assignedClassIds` array containing the exact `classId` values they
   may teach.

## 4. Add the web configuration to Replit

In the Replit project, add these non-secret environment values from the Firebase
web-app configuration. The `VITE_` prefix means they are included in the public
browser bundle, so they must never contain private keys or service-account data.

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_APP_ID`

Optional values:

- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`

Restart the school website after saving the values. The sign-in screen and portal
will then require Firebase Authentication and an approved `staffProfiles`
document. The school portal has no demo login or role bypass when Firebase is
configured.

## 5. Add the first records

The current portal screens read these Firestore collections:

- `students`: `name`, `code`, `classId`, `className`, `guardian`, `status`
- `teachers`: `name`, `initials`, `subject`, `classes`, `status`
- `classes`: `name`, `subjectCount`
- `subjects`: `name`, `group`
- `results`: `student`, `className`, `classId`, `scores` (number array)
- `fees`: `name`, `className`, `classId`, `amount`, `paid`
- `admissionApplications`: created by the public admissions form; visible to
  administrators only

Use a Firestore document ID as the `classId` in each student's, result's, and
teacher's assignment data. Fee balances and report-card totals are calculated
from the stored amounts and scores in the interface. Confirm the real grading
bands, terms, subject list, fee structure, and school policies with DMIS before
using the portal for official records.

## Before collecting real admissions

The admissions form writes only when Firebase is configured. Public submissions
are validated by Firestore rules and cannot be read back by an unauthenticated
visitor. Before advertising the form publicly, enable Firebase App Check and
review privacy/retention requirements for student and guardian information.
