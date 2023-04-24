import { registerAs } from '@nestjs/config';

export default registerAs('firebase', () => ({
  projectId: process.env.FIREBASE_PID,
  appId: process.env.FIREBASE_AID,
  databaseURL: process.env.FIREBASE_DB,
  storageBucket: process.env.FIREBASE_STORAGE,
  locationId: process.env.FIREBASE_LID,
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  messagingSenderId: process.env.FIREBASE_SID,
  measurementId: process.env.FIREBASE_MID,
}));
