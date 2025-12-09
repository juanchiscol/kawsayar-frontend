import * as FileSystem from "expo-file-system/legacy";
import { RefObject } from 'react';
import { View } from 'react-native';
import { captureRef } from 'react-native-view-shot';

const ip = "0.0.0.0"; // Reemplaza con la IP de tu servidor backend
export const handleEmailVerification = async (email: string, dni: string) => {
  try {
    const response = await fetch(`http://${ip}:3000/users/forgot_validate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, dni }),
    });
    const data = await response.json();
    return data;
  } catch {
    throw new Error("Error al verificar el correo. Inténtalo de nuevo.");
  }
}

export const handleVerifyEmailCode = async (email: string, code: string) => {
  try {
    const response = await fetch(`http://${ip}:3000/users/verify_email_code`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });
    const data = await response.json();
    return data;
  } catch {
    throw new Error("Error al verificar el código. Inténtalo de nuevo.");
  }
}

export const fetchControlesPorPerfil = async (idPerfil: number) => {
  try {
    const response = await fetch(`http://${ip}:3000/profiles/controlesporperfil`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_perfil: idPerfil }),
      }
    );
    const { controles } = await response.json();
    return controles;
  } catch (error) {
    console.error("Error al obtener los controles:", error);
    throw error; // Lanza el error para manejarlo en el componente
  }
};

export const handleRecoverPassword = async (email: string) => {
  try {
    const response = await fetch(`http://${ip}:3000/users/forgot_password_recuperar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    return data;

  } catch (error) {
    throw new Error(error instanceof Error ? error.message : ".");
  }
};

export const handleVerifyResetCode = async (email: string, code: string) => {
  try {
    const response = await fetch(`http://${ip}:3000/users/verify_reset_code`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });
    const data = await response.json();
    return data;
  } catch {
    throw new Error("Error al verificar el código. Inténtalo de nuevo.");
  }
};

export const handleResetPassword = async (email: string, new_password: string) => {
  try {
    const response = await fetch(`http://${ip}:3000/users/reset_password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, new_password }), // Asegúrate de que newPassword tenga un valor válido
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw new Error(error instanceof Error ? error.message : ".");
  }
};

export const predictAnemia = async (selectedImage: string | null) => {
  if (!selectedImage) {
    throw new Error("Por favor, selecciona o toma una imagen primero.");
  }

  try {
    const formData = new FormData();

    // Configuración de la imagen en FormData
    formData.append("file", {
      uri: selectedImage,
      type: "image/jpeg",
      name: "image.jpg",
    } as any);

    const response = await fetch(`http://${ip}:3000/predict/`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Error en la respuesta del servidor.");
    }

    const data = await response.json();

    if (data) {
      return data;
    } else {
      throw new Error("Error al realizar la predicción.");
    }
  } catch (error) {
    console.error("Error al comunicarse con el servidor:", error);
    throw error;
  }
};

export const validateConjuntiva = async (selectedImage: string | null) => {
  if (!selectedImage) {
    throw new Error("Por favor, selecciona o toma una imagen primero.");
  }

  try {
    const formData = new FormData();

    // Configuración de la imagen en FormData
    formData.append("file", {
      uri: selectedImage,
      type: "image/jpeg",
      name: "image.jpg",
    } as any);

    const response = await fetch(`http://${ip}:3000/validate/validate`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.result || "Error en la respuesta del servidor.");
    }

    const data = await response.json();

    if (data.result !== undefined) {
      return data.result;
    } else {
      throw new Error("Error al realizar la predicción.");
    }
  } catch (error) {
    console.error("Error al comunicarse con el servidor:", error);
    throw error;
  }
};

export const fetchAllProfiles = async (id: number) => {
  try {
    const response = await fetch(`http://${ip}:3000/profiles/perfilesporusers`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_usuario: id }),
      }
    );
    const { profiles } = await response.json();
    return profiles;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const insertarControl = async (newControl: any) => {
  try {
    const response = await fetch(`http://${ip}:3000/predict/insertarControl`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newControl),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error("Error al insertar el control");
    }

    return data;
  } catch {
    throw new Error("Error al insertr el control. Inténtalo de nuevo.");
  }
}

export const registerProfile = async (newProfile: any) => {
  try {
    const response = await fetch(`http://${ip}:3000/profiles/registrarperfil`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProfile),
    });

    const data = await response.json();
    console.log("Respuesta del backenasdasdasdasdasdasddadasdasddasd:", data);
    if (!response.ok) {
      throw new Error("Error al crear el perfil");
    }

    return data.perfil;
  } catch {
    throw new Error("Error al registrar el perfil. Inténtalo de nuevo.");
  }
};

export const deleteProfile = async (id: number) => {
  try {
    const response = await fetch(`http://${ip}:3000/profiles/eliminarperfil`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error("Error al eliminar el perfil");
    }

    return data;
  } catch {
    throw new Error("Error al eliminar el perfil. Inténtalo de nuevo.");
  }
}

export const registerUser = async (newUser: any) => {
  try {
    const response = await fetch(`http://${ip}:3000/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });
    const data = await response.json();
    return data;
  } catch {
    throw new Error("Error al registrar el usuario. Inténtalo de nuevo.");
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await fetch(`http://${ip}:3000/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    // Si la respuesta no es ok, se lanza un error
    const data = await response.json();

    return data; // Retorna la data si la respuesta es exitosa
  } catch {
    // Si ocurre un error de conexión o de cualquier tipo en la solicitud
    throw new Error("Error al iniciar sesión. Inténtalo de nuevo.");
  }
};

export const logoutUser = async () => {
  try {
    const response = await fetch(`http://${ip}:3000/users/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },

    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error("Error al cerrar sesión");
    }

    return data;
  } catch {
    throw new Error("Error al cerrar sesión. Inténtalo de nuevo.");
  }
}

export const recortarImagen = async (imageContainerRef: RefObject<View>) => {

  try {
    const uri = await captureRef(imageContainerRef, {
      format: 'png',
      quality: 1,
    });

    const base64Image = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const backendResponse = await fetch(`http://${ip}:3000/crop/crop`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image: base64Image }),
    });

    const result = await backendResponse.json();
    console.log("Recorte de imagen:", result);

    if (!backendResponse.ok) {
      throw new Error("Error en la respuesta del backend");
    }
    return result;
  } catch (error) {
    console.error("Error al recortar la imagen:", error);
    throw error;
  }

}

