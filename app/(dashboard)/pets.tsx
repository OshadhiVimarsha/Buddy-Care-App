import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { PawPrint, Plus, Trash2, Edit2, Search, Eye } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  createPetProfile,
  getAllPetProfiles,
  deletePetProfile,
  updatePetProfile,
} from "@/services/petProfileService";
import { PetProfile } from "@/types/petProfile";

const PetsScreen = () => {
  const [pets, setPets] = useState<PetProfile[]>([]);
  const [search, setSearch] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentPet, setCurrentPet] = useState<PetProfile | null>(null);
  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [ageYears, setAgeYears] = useState("");
  const [ageMonths, setAgeMonths] = useState("");
  const [photo, setPhoto] = useState("");
  const [gender, setGender] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [adoptionDate, setAdoptionDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const fetchPets = async () => {
    setIsLoading(true);
    try {
      const data = await getAllPetProfiles();
      setPets(data);
    } catch {
      Alert.alert("Error", "Failed to fetch pets.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  const resetForm = () => {
    setName("");
    setBreed("");
    setAgeYears("");
    setAgeMonths("");
    setPhoto("");
    setGender("");
    setBirthdate("");
    setAdoptionDate("");
    setCurrentPet(null);
    setModalVisible(false);
    setIsEditMode(false);
  };

  const handleAddPet = async () => {
    if (!name || !breed) {
      Alert.alert("Warning", "Name and Breed are required!");
      return;
    }

    const years = parseInt(ageYears) || 0;
    const months = parseInt(ageMonths) || 0;

    if ((isNaN(years) || years < 0) || (isNaN(months) || months < 0 || months > 11)) {
      Alert.alert("Warning", "Enter a valid age (years and months).");
      return;
    }

    const newPet: PetProfile = {
      name,
      breed,
      age: years + (months / 12),
      photo: photo || undefined,
      gender: gender || undefined,
      birthdate: birthdate || undefined,
      adoptionDate: adoptionDate || undefined,
      healthInfo: { weightHistory: [], allergies: [], conditions: [] },
      vetVisits: [],
      trainingLog: [],
      reminders: [],
    };

    try {
      setIsLoading(true);
      await createPetProfile(newPet);
      Alert.alert("Success", "Pet added successfully!");
      resetForm();
      fetchPets();
    } catch {
      Alert.alert("Error", "Failed to add pet.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePet = async () => {
    if (!currentPet || !name || !breed) return;

    const years = parseInt(ageYears) || 0;
    const months = parseInt(ageMonths) || 0;

    if ((isNaN(years) || years < 0) || (isNaN(months) || months < 0 || months > 11)) {
      Alert.alert("Warning", "Enter a valid age (years and months).");
      return;
    }

    try {
      setIsLoading(true);
      await updatePetProfile(currentPet.id!, {
        name,
        breed,
        age: years + (months / 12),
        photo,
        gender,
        birthdate,
        adoptionDate,
      });
      Alert.alert("Success", "Pet updated successfully!");
      resetForm();
      fetchPets();
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Failed to update pet.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePet = (id?: string) => {
    if (!id) return;
    Alert.alert("Confirm Delete", "Are you sure you want to delete this pet?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes",
        style: "destructive",
        onPress: async () => {
          try {
            setIsLoading(true);
            await deletePetProfile(id);
            Alert.alert("Success", "Pet deleted successfully!");
            fetchPets();
          } catch {
            Alert.alert("Error", "Failed to delete pet.");
          } finally {
            setIsLoading(false);
          }
        },
      },
    ]);
  };

  const filteredPets = pets.filter(
    (pet) =>
      pet.name.toLowerCase().includes(search.toLowerCase()) ||
      pet.breed?.toLowerCase().includes(search.toLowerCase())
  );

  const getDisplayAge = (age: number | undefined) => {
    if (age === undefined || isNaN(age)) {
      return "? yrs";
    }
    const years = Math.floor(age);
    const months = Math.round((age - years) * 12);
    let display = "";
    if (years > 0) {
      display += `${years} yr${years > 1 ? 's' : ''}`;
    }
    if (months > 0) {
      if (display.length > 0) display += " ";
      display += `${months} mo${months > 1 ? 's' : ''}`;
    }
    return display.trim() || "0 mos";
  };

  return (
    <LinearGradient colors={["#ffffff", "#ffffff"]} className="flex-1">
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View className="mb-6">
          <Text className="text-3xl font-bold text-cyan-600 mt-8">My Pets</Text>
          <Text className="text-gray-600">Manage your lovely pets 🐾</Text>
        </View>

        {/* Search bar */}
        <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-2 mb-6 border border-gray-300">
          <Search size={20} color="#6b7280" />
          <TextInput
            placeholder="Search pets..."
            placeholderTextColor="#9ca3af"
            className="flex-1 ml-2 text-gray-800"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {isLoading ? (
          <Text className="text-center text-gray-500 mt-10">Loading pets...</Text>
        ) : filteredPets.length > 0 ? (
          filteredPets.map((pet) => (
            <View
              key={pet.id}
              className="bg-white rounded-xl p-4 mb-4 border border-cyan-200 shadow-sm flex-row items-center"
            >
              {pet.photo ? (
                <Image
                  source={{ uri: pet.photo }}
                  className="w-16 h-16 rounded-full mr-4 border border-cyan-400"
                />
              ) : (
                <View className="w-16 h-16 rounded-full bg-cyan-100 flex items-center justify-center mr-4">
                  <PawPrint color="#0891b2" size={32} />
                </View>
              )}

              <View className="flex-1">
                <Text className="text-lg font-semibold text-gray-800">{pet.name}</Text>
                <Text className="text-gray-500 text-sm">
                  {pet.breed || "Unknown Breed"} • {getDisplayAge(pet.age)}
                </Text>
              </View>

              {/* Actions */}
              <View className="flex-row">
                {pet.id && (
                  <TouchableOpacity
                    onPress={() => router.push(`/petDetails/${pet.id}`)}
                    className="p-2"
                  >
                    <Eye color="#0891b2" size={20} />
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={() => {
                    setCurrentPet(pet);
                    setName(pet.name);
                    setBreed(pet.breed || "");
                    const years = Math.floor(pet.age || 0);
                    const months = Math.round(((pet.age || 0) - years) * 12);
                    setAgeYears(years.toString());
                    setAgeMonths(months.toString());
                    setPhoto(pet.photo || "");
                    setGender(pet.gender || "");
                    setBirthdate(pet.birthdate || "");
                    setAdoptionDate(pet.adoptionDate || "");
                    setIsEditMode(true);
                    setModalVisible(true);
                  }}
                  className="p-2"
                >
                  <Edit2 color="#1d4ed8" size={20} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeletePet(pet.id)} className="p-2">
                  <Trash2 color="#ef4444" size={20} />
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <Text className="text-center text-gray-500 mt-10">No pets found.</Text>
        )}
      </ScrollView>

      {/* Add new pet button */}
      <TouchableOpacity
        onPress={() => {
          resetForm();
          setModalVisible(true);
        }}
        className="absolute bottom-6 right-6 bg-cyan-600 rounded-full p-4 shadow-lg"
      >
        <Plus color="white" size={24} />
      </TouchableOpacity>

      {/* Add/Edit Pet Modal */}
      <Modal animationType="slide" transparent visible={modalVisible} onRequestClose={resetForm}>
        <View className="flex-1 justify-center items-center bg-black/40 p-4">
          <View className="w-full max-w-sm bg-white rounded-xl p-6 shadow-xl border border-cyan-300">
            <Text className="text-2xl font-bold text-center mb-6 text-gray-800">
              {isEditMode ? "Edit Pet" : "Add New Pet"}
            </Text>

            <TextInput
              placeholder="Name"
              value={name}
              onChangeText={setName}
              className="bg-gray-100 rounded-lg px-4 py-3 mb-4 border border-gray-300 text-gray-800"
            />
            <TextInput
              placeholder="Breed"
              value={breed}
              onChangeText={setBreed}
              className="bg-gray-100 rounded-lg px-4 py-3 mb-4 border border-gray-300 text-gray-800"
            />
            
            <View className="flex-row justify-between mb-4">
              <View className="flex-1 mr-2">
                <TextInput
                  placeholder="Age (Years)"
                  value={ageYears}
                  onChangeText={setAgeYears}
                  keyboardType="numeric"
                  className="bg-gray-100 rounded-lg px-4 py-3 border border-gray-300 text-gray-800"
                />
              </View>
              <View className="flex-1 ml-2">
                <TextInput
                  placeholder="Age (Months)"
                  value={ageMonths}
                  onChangeText={setAgeMonths}
                  keyboardType="numeric"
                  className="bg-gray-100 rounded-lg px-4 py-3 border border-gray-300 text-gray-800"
                />
              </View>
            </View>
            
            {/* New fields for Gender, Birthdate, and Adoption Date */}
            <TextInput
              placeholder="Gender"
              value={gender}
              onChangeText={setGender}
              className="bg-gray-100 rounded-lg px-4 py-3 mb-4 border border-gray-300 text-gray-800"
            />
            <TextInput
              placeholder="Birthdate (YYYY-MM-DD)"
              value={birthdate}
              onChangeText={setBirthdate}
              className="bg-gray-100 rounded-lg px-4 py-3 mb-4 border border-gray-300 text-gray-800"
            />
            <TextInput
              placeholder="Adoption Date (YYYY-MM-DD)"
              value={adoptionDate}
              onChangeText={setAdoptionDate}
              className="bg-gray-100 rounded-lg px-4 py-3 mb-4 border border-gray-300 text-gray-800"
            />

            <TextInput
              placeholder="Photo URL"
              value={photo}
              onChangeText={setPhoto}
              className="bg-gray-100 rounded-lg px-4 py-3 mb-4 border border-gray-300 text-gray-800"
            />

            <View className="flex-row justify-between mt-4">
              <TouchableOpacity
                onPress={resetForm}
                className="flex-1 bg-gray-300 rounded-full py-3 mr-2"
              >
                <Text className="text-center text-gray-800 font-semibold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={isEditMode ? handleUpdatePet : handleAddPet}
                disabled={isLoading}
                className={`flex-1 rounded-full py-3 ml-2 ${isLoading ? "bg-cyan-400" : "bg-cyan-600"}`}
              >
                <Text className="text-center text-white font-semibold">
                  {isLoading ? "Saving..." : isEditMode ? "Update Pet" : "Save"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

export default PetsScreen;