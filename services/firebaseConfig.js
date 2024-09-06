
import { collection, getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getDatabase } from "firebase/database";  
import { initializeApp } from "firebase/app";

export const firebaseConfig = {
  apiKey: "AIzaSyAOOnBDrFpofaRucEeuxDoxMWMF793HXkQ",
  authDomain: "ampela-3b6c3.firebaseapp.com",
  databaseURL: "https://ampela-3b6c3-default-rtdb.firebaseio.com/", 
  projectId: "ampela-3b6c3",
  storageBucket: "ampela-3b6c3.appspot.com",
  messagingSenderId: "868282996846",
  appId: "1:868282996846:web:9a193de7425106bf7eae7f",
};

const app = initializeApp(firebaseConfig);

export const database = getFirestore(app);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const usersRef = collection(database, "users");
export const roomsRef = collection(database, "rooms");
export const storage = getStorage(app);
export const realtimeDatabase = getDatabase(app);
