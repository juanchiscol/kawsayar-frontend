import { globalStyles } from "@/styles/global-styles";
import { homeStyles } from "@/styles/home-styles";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import { Stack } from "expo-router";

import ComponentNewVidAll from "@/components/ComponentNewVidAll";

const Education = () => {
  return (
    <View style={homeStyles.screen}>
                <Stack.Screen
              options={{
                title: "Educación",
                headerShown: false,
              }}
            />  
      <View style={globalStyles.headerContainer}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons name="person" size={24} color="#AAAAAA" />
          <Text style={[globalStyles.titleapp, { marginLeft: 10 }]}>
            Educación
          </Text>
        </View>

      </View>
      <ComponentNewVidAll />

    </View>
  );
};

export default Education;
