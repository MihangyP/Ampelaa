import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { auth, database } from "@/services/firebaseConfig";
import { AuthContext } from "@/hooks/AuthContext";
import { COLORS } from "@/constants";
import { useSelector } from "@legendapp/state/react";
import { preferenceState } from "@/services/AmpelaStates";

const EditPost = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const { postId } = params;
  const { userProfile } = useContext(AuthContext);
  const { theme } = useSelector(() => preferenceState.get());

  useEffect(() => {
    const fetchPost = async () => {
      if (postId) {
        try {
          const docRef = doc(database, "posts", postId);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const post = docSnap.data();
            setTitle(post.title || "");
            setDescription(post.description || "");
            setPhotos(post.photos || null);
          }
        } catch (error) {
          
        }
      }
    };

    fetchPost();
  }, [postId]);

  const selectPhotos = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPhotos(result.assets[0].uri);
    }
  };

  const submitPost = async () => {
    setLoading(true);
    try {
      const data = {
        title,
        description,
        photos,
        authorId: auth.currentUser.uid,
        authorName: userProfile.username,
        authorAvatar: auth.currentUser.photoURL,
        updatedAt: new Date(),
      };

      const docRef = doc(database, "posts", postId);
      await updateDoc(docRef, data);

      setTitle("");
      setDescription("");
      setPhotos(null);

      navigation.goBack();
    } catch (error) {
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.label} className="mt-5">
        Titre
      </Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="cycle menstruel..."
        editable={!loading}
      />
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder="Quel est la durée normale d'un cycle menstruel ..?"
        multiline
        editable={!loading}
      />
      {/* <Button title="Add Photos" onPress={selectPhotos} disabled={loading} /> */}
      {photos && <Image source={{ uri: photos }} style={styles.photo} />}
      <TouchableOpacity
        style={[
          styles.submitButton,
          {
            backgroundColor:
              theme === "pink" ? COLORS.accent500 : COLORS.accent800,
          },
        ]}
        onPress={submitPost}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Mettre à jour</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 8,
    marginBottom: 16,
  },
  photo: {
    width: 100,
    height: 100,
    marginRight: 8,
    marginTop: 16,
  },
  submitButton: {
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 16,
    marginBottom: 80,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
  },
});

export default EditPost;
