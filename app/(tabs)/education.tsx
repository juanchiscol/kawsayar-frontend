import { globalStyles } from "@/styles/global-styles";
import { homeStyles } from "@/styles/home-styles";
import { Ionicons } from "@expo/vector-icons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Stack } from "expo-router";
import React from "react";
import { ScrollView, Text, View } from "react-native";

import ComponentNewVidAll from "@/components/ComponentNewVidAll";

const Education = () => {
  const tabBarHeight = useBottomTabBarHeight();
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
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: tabBarHeight }}>
        <ComponentNewVidAll />
      </ScrollView>

    </View>
  );
};

export default Education;
