import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator, Alert, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getAllPetProfiles, deletePetProfile, updatePetProfile } from "@/services/petProfileService";
import { PetProfile } from "@/types/petProfile";
import { PawPrint, Trash2, Edit, Save, X, ChevronLeft } from "lucide-react-native";

const PetDetailsScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [pet, setPet] = useState<PetProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [tempGender, setTempGender] = useState("");
  const [tempBirthdate, setTempBirthdate] = useState("");
  const [tempAdoptionDate, setTempAdoptionDate] = useState("");

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const pets = await getAllPetProfiles();
        const foundPet = pets.find((p) => p.id === id);
        setPet(foundPet || null);
        if (foundPet) {
          setTempGender(foundPet.gender || "");
          setTempBirthdate(foundPet.birthdate || "");
          setTempAdoptionDate(foundPet.adoptionDate || "");
        }
      } catch (e) {
        console.error("Failed to load pet details", e);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchPet();
  }, [id]);

  const handleEditToggle = () => {
    if (editing) {
      if (pet) {
        setTempGender(pet.gender || "");
        setTempBirthdate(pet.birthdate || "");
        setTempAdoptionDate(pet.adoptionDate || "");
      }
    }
    setEditing(!editing);
  };

  const handleSave = async () => {
    if (!pet) return;
    try {
      const updatedPetData: Partial<PetProfile> = {
        gender: tempGender,
        birthdate: tempBirthdate,
        adoptionDate: tempAdoptionDate,
      };
      await updatePetProfile(pet.id, updatedPetData);
      setPet({ ...pet, ...updatedPetData });
      setEditing(false);
      Alert.alert("Success", "Pet details updated successfully!");
    } catch (e) {
      console.error("Failed to update pet", e);
      Alert.alert("Error", "Failed to update pet details.");
    }
  };

  const handleDelete = async () => {
    if (!pet) return;
    Alert.alert(
      "Confirm Delete",
      `Are you sure you want to delete ${pet.name}'s profile?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deletePetProfile(pet.id);
              router.back();
            } catch (e) {
              console.error("Failed to delete pet", e);
              Alert.alert("Error", "Failed to delete pet profile.");
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#0891b2" />
        <Text className="mt-4 text-gray-600">Loading pet details...</Text>
      </View>
    );
  }

  if (!pet) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <Text className="text-lg text-red-500 font-semibold">Pet not found! 😞</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Custom Back Button */}
      <TouchableOpacity
        onPress={() => router.back()}
        className="absolute top-10 left-6 z-10 bg-white p-2 rounded-full shadow-lg"
      >
        <ChevronLeft size={24} color="#0891b2" />
      </TouchableOpacity>

      <View className="bg-white rounded-b-[40px] shadow-lg pb-8">
        {/* Pet Photo Section */}
        {pet.photo ? (
          <Image
            source={{ uri: pet.photo }}
            className="w-40 h-40 rounded-full self-center border-4 border-cyan-400 mt-20"
            resizeMode="cover"
          />
        ) : (
          <View className="w-40 h-40 rounded-full bg-cyan-100 self-center justify-center items-center mt-20">
            <PawPrint size={60} color="#0891b2" />
          </View>
        )}
        <Text className="text-4xl font-extrabold text-cyan-700 text-center mt-4">{pet.name}</Text>
        <Text className="text-xl text-gray-600 text-center mb-6">
          {pet.breed || "Unknown Breed"} • {pet.age || "N/A"} years
        </Text>
      </View>

      <View className="p-6">
        {/* About Section */}
        <View className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
          <Text className="text-lg font-bold text-gray-800 mb-3">About {pet.name}</Text>
          {editing ? (
            <View>
              <TextInput
                placeholder="Gender"
                className="bg-gray-100 p-3 rounded-lg mb-3 border border-gray-300 text-gray-800"
                value={tempGender}
                onChangeText={setTempGender}
              />
              <TextInput
                placeholder="Birthdate"
                className="bg-gray-100 p-3 rounded-lg mb-3 border border-gray-300 text-gray-800"
                value={tempBirthdate}
                onChangeText={setTempBirthdate}
              />
              <TextInput
                placeholder="Adoption Date"
                className="bg-gray-100 p-3 rounded-lg mb-3 border border-gray-300 text-gray-800"
                value={tempAdoptionDate}
                onChangeText={setTempAdoptionDate}
              />
            </View>
          ) : (
            <View>
              <Text className="text-gray-600 mb-2"><Text className="font-semibold">Gender:</Text> {pet.gender || "Not specified"}</Text>
              <Text className="text-gray-600 mb-2"><Text className="font-semibold">Birthdate:</Text> {pet.birthdate || "Not specified"}</Text>
              <Text className="text-gray-600"><Text className="font-semibold">Adoption Date:</Text> {pet.adoptionDate || "Not specified"}</Text>
            </View>
          )}
        </View>

        {/* Emergency Info */}
        {pet.emergencyInfo && (
          <View className="bg-red-50 p-6 rounded-xl shadow-sm border border-red-200 mb-6">
            <Text className="text-lg font-bold text-red-700 mb-2">Emergency Information</Text>
            <Text className="text-gray-700">{pet.emergencyInfo}</Text>
          </View>
        )}

        {/* Action Buttons */}
        <View className="flex-row justify-center space-x-4 mb-6">
          {editing ? (
            <View className="flex-row">
              <TouchableOpacity
                className="bg-cyan-600 px-6 py-3 rounded-full shadow-md flex-row items-center mr-2"
                onPress={handleSave}
              >
                <Save color="white" size={18} />
                <Text className="text-white text-base font-semibold ml-2">Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-gray-400 px-6 py-3 rounded-full shadow-md flex-row items-center ml-2"
                onPress={handleEditToggle}
              >
                <X color="white" size={18} />
                <Text className="text-white text-base font-semibold ml-2">Cancel</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View className="flex-row">
              <TouchableOpacity
                className="bg-cyan-600 px-6 py-3 rounded-full shadow-md flex-row items-center mr-2"
                onPress={handleEditToggle}
              >
                <Edit color="white" size={18} />
                <Text className="text-white text-base font-semibold ml-2">Edit Info</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-red-500 px-6 py-3 rounded-full shadow-md flex-row items-center ml-2"
                onPress={handleDelete}
              >
                <Trash2 color="white" size={18} />
                <Text className="text-white text-base font-semibold ml-2">Delete Pet</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Quick Access Buttons */}
        <Text className="text-lg font-bold text-gray-800 mb-4">Actions</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 1 }}>
          <View className="flex-row flex-nowrap">
            {["Health Records", "Vet Visits", "Gallery", "Weight Graph", "Training Log", "Expenses"].map((section) => (
              <TouchableOpacity
                key={section}
                className="bg-white p-4 rounded-xl w-36 mr-4 mb-2 border border-gray-200 shadow-sm items-center justify-center"
                onPress={() => router.push(`/pets/${pet.id}/${section.replace(/\s/g, '').toLowerCase()}`)}
              >
                <Text className="text-cyan-800 text-center font-semibold">{section}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </ScrollView>
  );
};

export default PetDetailsScreen;