// app/context/AuthContext.tsx
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { 
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User 
} from "firebase/auth";
import { auth, googleProvider } from "../firebase/config";
import AuthModal from "../components/AuthModal"; // Import the modal here

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isModalOpen: boolean; // Add this
  setIsModalOpen: (isOpen: boolean) => void; // Add this
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  signupWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // Add state for the modal

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
      if (firebaseUser) {
        setIsModalOpen(false); // Close modal if user logs in
      }
    });
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const loginWithEmail = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signupWithEmail = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        isModalOpen,      // Provide the state
        setIsModalOpen,   // Provide the function
        loginWithGoogle, 
        loginWithEmail, 
        signupWithEmail, 
        logout 
      }}
    >
      {children}
      {/* Conditionally render the modal here */}
      {isModalOpen && !user && <AuthModal />}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};