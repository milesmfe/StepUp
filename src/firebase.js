import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { FacebookAuthProvider, GithubAuthProvider } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";

const {
  REACT_APP_FIREBASE_API_KEY,
  REACT_APP_FIREBASE__AUTH_DOMAIN,
  REACT_APP_PROJECT_ID,
  REACT_APP_FIREBASE_STORAGE_BUCKET,
  REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  REACT_APP_FIREBASE_APP_ID,
  REACT_APP_FIREBASE_MEASUREMENT_ID,
  REACT_APP_FIREBASE_DATABASE_URL,
  REACT_APP_FIREBASE_SERVICE_ACCOUNT,
} = process.env;

const app = firebase.initializeApp({
  apiKey: REACT_APP_FIREBASE_API_KEY,
  authDomain: REACT_APP_FIREBASE__AUTH_DOMAIN,
  projectId: REACT_APP_PROJECT_ID,
  storageBucket: REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: REACT_APP_FIREBASE_APP_ID,
  measurementId: REACT_APP_FIREBASE_MEASUREMENT_ID,
  databaseURL: REACT_APP_FIREBASE_DATABASE_URL,
  credential: REACT_APP_FIREBASE_SERVICE_ACCOUNT,
});

// Exports  -------------------------------------------------------------- //

export const GitHub = new GithubAuthProvider();
export const Google = new GoogleAuthProvider();
export const Facebook = new FacebookAuthProvider();
export const auth = () => app.auth();
export default app;

// ----------------------------------------------------------------------- //
