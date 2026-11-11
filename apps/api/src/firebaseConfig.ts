import path from "path";
import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config();

const serviceAccountPath = path.resolve(
  process.cwd(),
  "serviceAccountKey.json",
);

admin.initializeApp({
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  credential: admin.credential.cert(require(serviceAccountPath)),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

const db = admin.firestore();

export { admin, db };
