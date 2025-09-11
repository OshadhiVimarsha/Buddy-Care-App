import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import AwesomeAlert from "react-native-awesome-alerts";
import { login } from "@/services/authService";
import Triangle from "./Triangle";

const { width } = Dimensions.get("window");

const Login = () => {
  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [emailFocused, setEmailFocused] = useState<boolean>(false);
  const [passwordFocused, setPasswordFocused] = useState<boolean>(false);

  const [showErrorAlert, setShowErrorAlert] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [showSuccessAlert, setShowSuccessAlert] = useState<boolean>(false);

  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleLogin = async () => {
    // Validation
    if (!email.trim()) {
      setErrorMessage("Please enter your email address");
      setShowErrorAlert(true);
      return;
    }

    if (!validateEmail(email.trim())) {
      setErrorMessage("Please enter a valid email address");
      setShowErrorAlert(true);
      return;
    }

    if (!password.trim()) {
      setErrorMessage("Please enter your password");
      setShowErrorAlert(true);
      return;
    }

    if (isLoading) return;
    setIsLoading(true);

    try {
      await login(email.trim(), password);
      setShowSuccessAlert(true); // Success alert
    } catch (err) {
      console.error(err);
      setErrorMessage("Incorrect email or password.");
      setShowErrorAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        className="flex-1 bg-black"
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Decorative Triangle */}
        <View
          style={{
            position: "absolute",
            top: -240,
            left: -200,
            right: 110,
            zIndex: -1,
            transform: [{ rotate: "45deg" }],
          }}
        >
          <Triangle size={600} color="black" direction="down" />
        </View>

        <View className="flex-1 justify-center px-8 py-10">
          {/* Header */}
          <View className="items-start mb-12">
            <Text className="text-5xl font-black text-cyan-600 mb-7 tracking-tight">
              Login
            </Text>
            <Text className="text-white text-base font-medium">
              Enter your credentials to
            </Text>
            <Text className="text-white text-base font-medium">
              access your account
            </Text>
          </View>

          {/* Form */}
          <View className="space-y-6 py-12">
            {/* Email */}
            <View className="relative">
              <Text className="text-cyan-500 text-sm font-semibold mb-3 ml-2">
                EMAIL ADDRESS
              </Text>
              <View
                className={`bg-white rounded-xl border-2 ${
                  emailFocused ? "border-gray-400" : "border-gray-200"
                }`}
              >
                <TextInput
                  placeholder="your@email.com"
                  className="px-6 py-2 text-gray-800 text-lg"
                  placeholderTextColor="#717474ff"
                  value={email}
                  onChangeText={setEmail}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Password */}
            <View className="relative py-10">
              <Text className="text-cyan-500 text-sm font-semibold mb-3 ml-2">
                PASSWORD
              </Text>
              <View
                className={`bg-white rounded-xl border-2 ${
                  passwordFocused ? "border-gray-400" : "border-gray-200"
                }`}
              >
                <TextInput
                  placeholder="••••••••"
                  className="px-6 py-2 text-gray-800 text-lg"
                  placeholderTextColor="#717474ff"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                />
              </View>
            </View>

            {/* Forgot Password */}
            <View className="items-end ">
              <Pressable className="mr-2" onPress={() => router.push("/(auth)/ForgotPassword")}>
                <Text className="text-cyan-500 text-sm font-semibold">Forgot Password?</Text>
              </Pressable>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              className={`mt-8 bg-cyan-500 rounded-xl py-5 ${
                isLoading ? "opacity-70" : ""
              }`}
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.9}
            >
              <View className="relative z-10">
                {isLoading ? (
                  <View className="flex-row items-center justify-center">
                    <ActivityIndicator color="#fff" size="small" />
                    <Text className="text-white text-xl font-bold ml-3">
                      Signing In...
                    </Text>
                  </View>
                ) : (
                  <Text className="text-center text-xl font-bold text-white">
                    Sign In →
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View className="-mt-6">
            <Pressable
              onPress={() => router.push("/register")}
              className="py-4"
            >
              <Text className="text-center text-cyan-400 text-base">
                Don't have an account?{" "}
                <Text className="text-cyan-600 font-bold">Sign Up</Text>
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Error Alert */}
        <AwesomeAlert
          show={showErrorAlert}
          showProgress={false}
          title="Error"
          message={errorMessage}
          closeOnTouchOutside={true}
          showConfirmButton={true}
          confirmText="OK"
          confirmButtonColor="#74daeaff"
          onConfirmPressed={() => setShowErrorAlert(false)}
        />

        {/* Success Alert */}
        <AwesomeAlert
          show={showSuccessAlert}
          showProgress={false}
          title="Success!"
          message="Login successful."
          closeOnTouchOutside={false}
          showConfirmButton={true}
          confirmText="OK"
          confirmButtonColor="#4CAF50"
          onConfirmPressed={() => {
            setShowSuccessAlert(false);
            router.push("/home");
          }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;
