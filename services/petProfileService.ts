import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/firebase"; // Adjust path as per your project structure
import { PetProfile } from "@/types/petProfile";

const petProfilesRef = collection(db, "petProfiles");

// Retry logic for Firestore operations
const withRetry = async <T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      console.error(`Retry ${i + 1}/${retries} failed:`, error);
      if (i === retries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw new Error("Retry limit reached");
};

export const createPetProfile = async (petProfile: PetProfile) => {
  try {
    console.log("Creating pet profile:", petProfile);
    const docRef = await withRetry(() => addDoc(petProfilesRef, petProfile));
    console.log("Created document with ID:", docRef.id);
    return docRef.id;
  } catch (error: any) {
    console.error("Create error:", error.message, error.code);
    throw error;
  }
};

export const getAllPetProfiles = async () => {
  try {
    const querySnapshot = await withRetry(() => getDocs(petProfilesRef));
    const petProfiles: PetProfile[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as PetProfile[];
    console.log(
      "Fetched pet profiles:",
      petProfiles.map((p) => ({ id: p.id, name: p.name }))
    );
    return petProfiles;
  } catch (error: any) {
    console.error("Get all error:", error.message, error.code);
    throw error;
  }
};

/**
 * ✅ Get a single pet profile by Firestore ID
 */
export const getPetProfileById = async (id: string) => {
  try {
    console.log("Fetching pet profile with ID:", id);
    const docRef = doc(db, "petProfiles", id);
    const docSnap = await withRetry(() => getDoc(docRef));
    if (!docSnap.exists()) {
      throw new Error(`Document with ID ${id} does not exist`);
    }
    const petProfile = { id: docSnap.id, ...docSnap.data() } as PetProfile;
    console.log("Fetched pet profile:", {
      id: petProfile.id,
      name: petProfile.name,
    });
    return petProfile;
  } catch (error: any) {
    console.error("Get by ID error:", error.message, error.code);
    throw error;
  }
};

export const updatePetProfile = async (
  id: string,
  petProfile: Partial<PetProfile>
) => {
  try {
    console.log("Updating pet ID:", id, petProfile);
    const docRef = doc(db, "petProfiles", id);
    await withRetry(() => updateDoc(docRef, petProfile));
    console.log("Updated document with ID:", id);
  } catch (error: any) {
    console.error("Update error:", error.message, error.code);
    throw error;
  }
};

export const deletePetProfile = async (id: string) => {
  try {
    console.log("Attempting to delete pet profile with ID:", id);
    const docRef = doc(db, "petProfiles", id);
    await withRetry(() => deleteDoc(docRef));
    console.log("Successfully deleted document with ID:", id);
  } catch (error: any) {
    console.error("Delete error:", error.message, error.code);
    throw error;
  }
};
