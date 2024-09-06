import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth,  realtimeDatabase } from "@/services/firebaseConfig";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useNetInfo } from "@react-native-community/netinfo";
import { get, onValue, ref } from "firebase/database";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { isConnected, isInternetReachable } = useNetInfo();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsAuthenticated(true);
        if (isConnected && isInternetReachable) {
          // 
          try {
            const userRef = ref( realtimeDatabase, `users/${user.uid}`);
            onValue(
              userRef,
              (snapshot) => {
                const data = snapshot.val();
                
                if (data) {
                  setUserProfile(data.user);
                }
              },
              {
                onlyOnce: true,
              }
            );
          } catch (error) {
            
          }
        }
        setUser(user);
      } else {
        setIsAuthenticated(false);
        setUser(null);
        setUserProfile(null);
      }
    });
    return unsub;
  }, [isConnected, isInternetReachable]);

  return (
    <AuthContext.Provider value={{ user, userProfile, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }
  return context;
};
