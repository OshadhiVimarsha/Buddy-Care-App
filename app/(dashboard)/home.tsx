import { View, Text, TouchableOpacity, Image, ScrollView, TextInput, Dimensions } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Bell, Search, Plus, PawPrint } from "lucide-react-native";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withRepeat,
} from 'react-native-reanimated';
import { getAllPetProfiles } from "@/services/petProfileService";
import { PetProfile } from "@/types/petProfile";

const { width } = Dimensions.get('window');
// Increased card width to take up more screen space
const CARD_WIDTH = width * 0.9;
const SPACING = width * 0.05;
const CAROUSEL_WIDTH = CARD_WIDTH + SPACING;
// Increased card height for better content display
const CARD_HEIGHT = 200;

const Home = () => {
  const [pets, setPets] = useState<PetProfile[]>([]);
  const scrollViewRef = useRef(null);

  const fetchPets = async () => {
    try {
      const petProfiles = await getAllPetProfiles();
      setPets(petProfiles);
    } catch (error) {
      console.error("Failed to fetch pets:", error);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  useEffect(() => {
    if (pets.length > 1 && scrollViewRef.current) {
      let currentIndex = 0;
      const interval = setInterval(() => {
        currentIndex = (currentIndex + 1) % pets.length;
        scrollViewRef.current?.scrollTo({
          x: currentIndex * CAROUSEL_WIDTH,
          animated: true,
        });
      }, 5000); // Scrolls every 5 seconds

      return () => clearInterval(interval);
    }
  }, [pets]);

  return (
    <LinearGradient
      colors={["#ffffffff", "#ffffffff"]}
      className="flex-1"
    >
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {/* Greeting */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-cyan-600">👋 Hello, User</Text>
          <Text className="text-lg text-gray-800">Welcome back to Buddy Care!</Text>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center justify-between bg-white rounded-full px-5 py-1 mb-6 border border-cyan-600">
          <TextInput
            placeholder="Search reminders..."
            placeholderTextColor="#3c3c3cff"
            className="flex-1 text-base text-gray-800"
            style={{ outlineWidth: 0, borderWidth: 0 }}
            underlineColorAndroid="transparent"
          />
          <TouchableOpacity className="ml-3 p-2 bg-cyan-600 rounded-full">
            <Search size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Dynamic Pet Cards */}
        <Text className="text-xl font-semibold text-gray-800 mb-3 ml-2">Your Pets</Text>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          contentContainerStyle={{ paddingHorizontal: SPACING / 2 }}
        >
          {pets.length > 0 ? pets.map((pet, index) => (
            <View key={pet.id} className="bg-white rounded border-cyan-600 p-10 shadow-xl mr-4 flex-row items-center border" style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}>
              {pet.photo ? (
                <Image
                  source={{ uri: pet.photo }}
                  className="w-24 h-24 rounded-full mr-4"
                />
              ) : (
                <View className="w-24 h-24 rounded-full mr-4 bg-gray-200 justify-center items-center">
                  <PawPrint color="#22d3ee" size={40} />
                </View>
              )}
              <View>
                <Text className="text-2xl font-semibold text-cyan-600 mb-1">{pet.name} {pet.breed ? `(${pet.breed})` : ''}</Text>
                <Text className="text-gray-600 text-lg">{pet.age} years</Text>
                <Text className="text-gray-600 text-sm mt-1">Next vaccine in 10 days</Text>
              </View>
            </View>
          )) : (
            <View className="bg-white rounded-2xl p-6 mr-4 flex-row items-center justify-center border border-gray-300" style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}>
              <Text className="text-gray-500 text-center">No pets added yet 🐕🐈</Text>
            </View>
          )}
        </ScrollView>

        {/* Upcoming Reminders */}
        <View className="mt-8 mb-6">
          <Text className="text-xl font-semibold text-gray-800 mb-3">Upcoming Reminders</Text>

          <View className="bg-white rounded-xl p-4 shadow-md flex-row items-center mb-3 border border-gray-300">
            <Bell color="#4b5563" size={22} />
            <View className="ml-3">
              <Text className="text-gray-800 font-medium">Vet Appointment</Text>
              <Text className="text-gray-600">Sep 20, 10:00 AM</Text>
            </View>
          </View>

          <View className="bg-white rounded-xl p-4 shadow-md flex-row items-center border border-gray-300">
            <Bell color="#4b5563" size={22} />
            <View className="ml-3">
              <Text className="text-gray-800 font-medium">Medicine Reminder</Text>
              <Text className="text-gray-600">Today, 6:00 PM</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default Home;