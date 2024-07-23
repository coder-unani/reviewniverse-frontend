import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { settings } from "/src/config/settings";

const firebaseConfig = {
  apiKey: settings.FIREBASE_API_KEY,
  authDomain: settings.FIREBASE_AUTH_DOMAIN,
  projectId: settings.FIREBASE_PROJECT_ID,
  storageBucket: settings.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: settings.FIREBASE_MESSAGING_SENDER_ID,
  appId: settings.FIREBASE_APP_ID,
  measurementId: settings.FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

provider.addScope("openid");
provider.addScope("https://www.googleapis.com/auth/userinfo.profile");
provider.addScope("https://www.googleapis.com/auth/userinfo.email");

export { auth, provider };
