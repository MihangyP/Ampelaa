import { observable } from "@legendapp/state";
import {
  configureObservablePersistence,
  persistObservable,
} from "@legendapp/state/persist";
import { ObservablePersistFirebase } from "@legendapp/state/persist-plugins/firebase";
import { ObservablePersistAsyncStorage } from "@legendapp/state/persist-plugins/async-storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { firebaseConfig } from "@/services/firebaseConfig";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, remove } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);
const storage = getStorage(app);

configureObservablePersistence({
  pluginLocal: ObservablePersistAsyncStorage,
  localOptions: {
    asyncStorage: {
      AsyncStorage,
    },
  },
  pluginRemote: ObservablePersistFirebase,
});

const cycleMenstruelState = observable({
  id: null,
  lastMenstruationDate: null,
  cycleDuration: null,
  menstruationDuration: null,
  cyclesData: [],
});

const preferenceState = observable({
  theme: "",
  language: "",
});

const userState = observable({
  userId: null,
  username: "",
  lastMenstruationDate: null,
  durationMenstruation: null,
  cycleDuration: null,
  email: "",
  profileImage: null,
  onlineImage: null,
});

const doctorsState = observable([]);

const configurePersistenceForUser = (userId) => {
  const configurePersist = (state, localKey, refPath) => {
    persistObservable(state, {
      local: localKey,
      pluginRemote: ObservablePersistFirebase,
      remote: userId
        ? {
            firebase: {
              refPath: () => refPath,
              mode: "realtime",
            },
          }
        : null,
    });
  };

  configurePersist(
    cycleMenstruelState,
    "cycleMenstruel",
    `users/${userId}/cycleMenstruel`
  );
  configurePersist(preferenceState, "preference", `users/${userId}/preference`);
  configurePersist(userState, "user", `users/${userId}/user`);
};

onAuthStateChanged(auth, (user) => {
  if (user) {
    configurePersistenceForUser(user.uid);
    // fetchUserData(user.uid);
  } else {
    configurePersistenceForUser(null);
  }
});

export const updateCycleMenstruelData = (data) => {
  // if (!auth.currentUser) {
  //
  //   return;
  // }
  cycleMenstruelState.set((prevState) => ({
    ...prevState,
    ...data,
  }));
};

export const updatePreference = (data) => {
  // if (!auth.currentUser) {
  //
  //   return;
  // }
  preferenceState.set((prevState) => ({
    ...prevState,
    ...data,
  }));
};

export const updateUser = async (data) => {
  // if (!auth.currentUser) {
  //
  //   return;
  // }

  userState.set((prevState) => ({
    ...prevState,
    ...data,
  }));

  if (data.profileImage && userState.get().profileImage && auth.currentUser) {
    const oldImageUrl = userState.get().onlineImage;

    try {
      const storagePath = `Avatar/${auth.currentUser.uid}/${Date.now()}`;
      const imageRef = storageRef(storage, storagePath);
      const response = await fetch(data.profileImage);
      const blob = await response.blob();
      await uploadBytes(imageRef, blob);
      const newImageUrl = await getDownloadURL(imageRef);

      //
      userState.set((prevState) => ({
        ...prevState,
        profileImage: data.profileImage,
        onlineImage: newImageUrl,
      }));

      const userRef = ref(database, `users/${auth.currentUser.uid}/user`);
      await set(userRef, { ...userState.get(), onlineImage: newImageUrl });

      if (oldImageUrl) {
        const oldImageRef = storageRef(storage, oldImageUrl);
        await deleteObject(oldImageRef);
      }
    } catch (error) {}
  }
};

export const clearAsyncStorage = async () => {
  try {
    await AsyncStorage.clear();
  } catch (error) {}
};

export const fetchUserData = async (userId) => {
  try {
    if (userId) {
      const userRef = ref(database, `users/${userId}`);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        userState.set(snapshot.val());
      } else {
      }
    }
  } catch (error) {}
};

export const fetchDoctorsData = async () => {
  try {
    const querySnapshot = await getDocs(collection(firestore, "doctors"));
    const doctors = querySnapshot.docs.map((doc) => doc.data());
    doctorsState.set(doctors);
  } catch (error) {}
};

export { cycleMenstruelState, preferenceState, userState, doctorsState };

// import { observable } from "@legendapp/state";
// import {
//   configureObservablePersistence,
//   persistObservable,
// } from "@legendapp/state/persist";
// import { ObservablePersistFirebase } from "@legendapp/state/persist-plugins/firebase";
// import { ObservablePersistAsyncStorage } from "@legendapp/state/persist-plugins/async-storage";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { firebaseConfig } from "@/services/firebaseConfig";
// import { initializeApp } from "firebase/app";
// import { getDatabase, ref, set, get, remove } from "firebase/database";
// import { getAuth, onAuthStateChanged } from "firebase/auth";
// import {
//   getStorage,
//   ref as storageRef,
//   uploadBytes,
//   getDownloadURL,
//   deleteObject,
// } from "firebase/storage";
// import debounce from "lodash.debounce";

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const database = getDatabase(app);
// const auth = getAuth(app);
// const storage = getStorage(app);

// // Configure persistence plugins
// configureObservablePersistence({
//   pluginLocal: ObservablePersistAsyncStorage,
//   localOptions: {
//     asyncStorage: {
//       AsyncStorage,
//     },
//   },
//   pluginRemote: ObservablePersistFirebase,
// });

// const cycleMenstruelState = observable({
//   id: null,
//   lastMenstruationDate: null,
//   cycleDuration: null,
//   menstruationDuration: null,
//   cyclesData: [],
// });

// const preferenceState = observable({
//   theme: "",
//   language: "",
// });

// const userState = observable({
//   userId: null,
//   username: "",
//   lastMenstruationDate: null,
//   durationMenstruation: null,
//   cycleDuration: null,
//   email: "",
//   profileImage: null,
//   onlineImage: null,
// });

// const doctorsState = observable([]);

// // Debounce function to limit updates
// const debounceUpdate = debounce(async (userId, data) => {
//   try {
//     const userRef = ref(database, `users/${userId}/user`);
//     await set(userRef, data);
//
//   } catch (error) {
//
//   }
// }, 1000); // Adjust the debounce delay as needed

// const configurePersistenceForUser = (userId) => {
//   const configurePersist = (state, localKey, refPath) => {
//     persistObservable(state, {
//       local: localKey,
//       pluginRemote: ObservablePersistFirebase,
//       remote: userId
//         ? {
//             onSetError: (err) =>
//             firebase: {
//               refPath: () => refPath,
//               mode: "realtime",
//             },
//           }
//         : null,
//     });
//   };

//   configurePersist(
//     cycleMenstruelState,
//     "cycleMenstruel",
//     `users/${userId}/cycleMenstruel`
//   );
//   configurePersist(preferenceState, "preference", `users/${userId}/preference`);
//   configurePersist(userState, "user", `users/${userId}/user`);
// };

// // Listen for authentication state changes
// onAuthStateChanged(auth, (user) => {
//
//   if (user) {
//     configurePersistenceForUser(user.uid);
//     fetchUserData(user.uid); // Fetch and synchronize user data from the database
//   } else {
//     configurePersistenceForUser(null);
//
//   }
// });

// // Functions to update the states
// export const updateCycleMenstruelData = (data) => {
//   cycleMenstruelState.set((prevState) => ({
//     ...prevState,
//     ...data,
//   }));
//   debounceUpdate(auth.currentUser?.uid, cycleMenstruelState.get());
// };

// export const updatePreference = (data) => {
//   preferenceState.set((prevState) => ({
//     ...prevState,
//     ...data,
//   }));
//   debounceUpdate(auth.currentUser?.uid, preferenceState.get());
// };

// export const updateUser = async (data) => {
//   userState.set((prevState) => ({
//     ...prevState,
//     ...data,
//   }));

//   if (data.profileImage && auth.currentUser) {
//     const oldImageUrl = userState.get().onlineImage;

//     try {
//       const storagePath = `Avatar/${auth.currentUser.uid}/${Date.now()}`;
//       const imageRef = storageRef(storage, storagePath);
//       const response = await fetch(data.profileImage);
//       const blob = await response.blob();
//       await uploadBytes(imageRef, blob);
//       const newImageUrl = await getDownloadURL(imageRef);

//

//       // Update user state with the new image URL
//       userState.set((prevState) => ({
//         ...prevState,
//         profileImage: data.profileImage,
//         onlineImage: newImageUrl,
//       }));

//       // Debounce the update to Firebase Realtime Database
//       debounceUpdate(auth.currentUser.uid, {
//         ...userState.get(),
//         onlineImage: newImageUrl,
//       });

//       // Optionally delete the old image
//       if (oldImageUrl) {
//         const oldImageRef = storageRef(storage, oldImageUrl);
//         await deleteObject(oldImageRef);
//       }
//     } catch (error) {
//
//     }
//   } else {
//     debounceUpdate(auth.currentUser?.uid, userState.get());
//   }
// };

// // Function to clear AsyncStorage
// export const clearAsyncStorage = async () => {
//   try {
//     await AsyncStorage.clear();
//
//   } catch (error) {
//
//   }
// };

// export const fetchUserData = async (userId) => {
//   try {
//     if (userId) {
//       const userRef = ref(database, `users/${userId}`);
//       const snapshot = await get(userRef);
//       if (snapshot.exists()) {
//         userState.set(snapshot.val());
//       } else {
//
//       }
//     }
//   } catch (error) {
//
//   }
// };

// export const fetchDoctorsData = async () => {
//   try {
//     const querySnapshot = await getDocs(collection(firestore, "doctors"));
//     const doctors = querySnapshot.docs.map((doc) => doc.data());
//     doctorsState.set(doctors);
//   } catch (error) {
//
//   }
// };

// // Export states
// export { cycleMenstruelState, preferenceState, userState, doctorsState };
