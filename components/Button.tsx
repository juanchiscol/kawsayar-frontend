import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

interface ButtonProps {
  onPress: () => void;
  title: string;
  backgroundColor: string;
  textColor: string;
  style?: object;
  icon?: React.ReactNode; // Nueva prop para íconos
  disabled?: boolean; // Prop para deshabilitar el botón
  width?: string | number; // Nueva prop para el ancho, por defecto 100%
  marginTop?: string | number; // Nueva prop para el margen superior
  marginBottom?: string | number; // Nueva prop para el margen inferior
  marginLeft?: string | number; // Nueva prop para el margen izquierdo
  marginRight?: string | number; // Nueva prop para el margen derecho
}

const Button: React.FC<ButtonProps> = ({ onPress, title, backgroundColor, textColor, style, icon, disabled, width = '100%', marginTop= '15', marginBottom= '0', marginLeft= '0', marginRight= '0',  }) => (
  <TouchableOpacity
    style={[styles.button, { backgroundColor, width, marginTop, marginBottom, marginLeft, marginRight}, disabled && styles.disabledButton, style]}
    onPress={disabled ? undefined : onPress} // Si está deshabilitado, no ejecuta la acción
    disabled={disabled} // Deshabilita el botón
  >
    <View style={styles.content}>
      {icon && <View style={styles.icon}>{icon}</View>}
      <Text style={[styles.buttonText, { color: textColor }]}>{title}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  content: {
    flexDirection: 'row', // Para alinear el texto y el ícono horizontalmente
    alignItems: 'center',
  },
  icon: {
    marginRight: 10, // Espaciado entre el ícono y el texto
  },
  button: {
    height: 45,
    borderRadius: 20, // Bordes más redondeados
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    fontFamily: 'ArvoRegular',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'ArvoRegular',
  },
  disabledButton: {
    backgroundColor: '#d3d3d3', // Color de fondo para el botón deshabilitado
    shadowOpacity: 0, // Eliminar sombra para deshabilitado
  },
});

export default Button;
