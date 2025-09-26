import React, { createContext, ReactNode, useContext, useState } from 'react';

interface ProfileContextType {
  profile: Profile | null;
  setProfile: (profile: Profile) => void;
  user: any;
  setUser: (user: any) => void;
}

interface Profile {
  id: number;
  nombres: string;
  apellido_paterno: string;
  apellido_materno: string;
  dni: string;
  ft_perfil: string;
  edad: string;
  fecha_nacimiento: string;
  sexo: string;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [user, setUser] = useState<any>(null);

  return (
    <ProfileContext.Provider value={{ profile, setProfile, user, setUser }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = (): ProfileContextType => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

// Exportación por defecto para cumplir con el requisito de expo-router
export default ProfileProvider;

