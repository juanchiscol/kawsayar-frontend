import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

interface SelectInputProps {
  label?: string;
  value: string;
  onChangeText: (value: string) => void;
  data: string[];
}

const SelectInput: React.FC<SelectInputProps> = ({ label, value, onChangeText, data }) => {
  return (
    <View style={styles.formGroup}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={value}
          onValueChange={(itemValue) => onChangeText(itemValue)}
          style={styles.picker}
          dropdownIconColor="#000"
        >
          <Picker.Item label="Seleccionar..." value="" /> {/* Opción por defecto */}
          {data.map((item, index) => (
            <Picker.Item key={index} label={item} value={item} />
          ))}
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  formGroup: {
    width: "100%",
    marginBottom: 10,
  },
  label: {
    fontSize: 15,
    color: "rgb(202, 202, 202)",
    marginBottom: 5,
    fontFamily: "ArvoBold",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    backgroundColor: "rgb(251, 250, 250)",
  },
  picker: {
    height: 50,
    width: "100%",
    color: "#333",
  },
});

export default SelectInput;