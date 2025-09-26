import React, { useState } from "react";
import { View, Text, TouchableOpacity, Platform, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

interface DateInputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
}

const DateInput: React.FC<DateInputProps> = ({ label, value, onChangeText }) => {
  const [showPicker, setShowPicker] = useState(false);
  const [date, setDate] = useState(new Date());

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (event.type === "dismissed") {
      // Si el usuario cancela, cerramos el picker
      setShowPicker(false);
      return;
    }

    // Si se selecciona una fecha
    if (selectedDate) {
      setDate(selectedDate);
      const formattedDate = selectedDate.toLocaleDateString("es-ES"); // Formato dd/mm/yyyy
      onChangeText(formattedDate); // Actualiza el valor en el formulario
    }

    // Cierra el picker solo si se selecciona una fecha
    if (event.type === "set") {
      setShowPicker(false);
    }
  };

  return (
    <View style={styles.formGroup}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.inputWrapper}>
        <Text style={styles.input}>{value || ""}</Text>
      </TouchableOpacity>

      {showPicker && Platform.OS === "ios" ? (
        <DateTimePicker
          mode="date"
          display="inline"
          value={date}
          onChange={handleDateChange}
        />
      ) : (
        showPicker &&
        Platform.OS === "android" && (
          <DateTimePicker
            mode="date"
            display="default"
            value={date}
            onChange={handleDateChange} // Pasamos el mismo manejador de cambio
          />
        )
      )}
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
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 50,
    backgroundColor: "rgb(251, 250, 250)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 10,
    justifyContent: "space-between",
  },
  input: {
    fontSize: 17,
    color: "#333",
    fontFamily: "ArvoRegular",
  },
});

export default DateInput;
