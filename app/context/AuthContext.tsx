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
import AuthModal from "../components/AuthModal";

// --- THIS IS THE FIX ---
// Add isCreator and isSuperAdmin to the context type
interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  isCreator: boolean; // Add creator role status
  isSuperAdmin: boolean; // Add superAdmin role status
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  signupWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCreator, setIsCreator] = useState(false); // Add state for creator role
  const [isSuperAdmin, setIsSuperAdmin] = useState(false); // Add state for superAdmin role
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // Force token refresh to get updated claims for all roles
        const idTokenResult = await firebaseUser.getIdTokenResult(true);
        setIsAdmin(!!idTokenResult.claims.admin);
        setIsCreator(!!idTokenResult.claims.creator); // Check for creator claim
        setIsSuperAdmin(!!idTokenResult.claims.superAdmin); // Check for superAdmin claim
        setIsModalOpen(false);
      } else {
        // If no user, reset all roles to false
        setIsAdmin(false);
        setIsCreator(false);
        setIsSuperAdmin(false);
      }
      setLoading(false);
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

  // Provide all roles and functions through the context value
  const value = { 
    user, 
    loading, 
    isAdmin,
    isCreator,
    isSuperAdmin,
    isModalOpen,
    setIsModalOpen,
    loginWithGoogle, 
    loginWithEmail, 
    signupWithEmail, 
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      {isModalOpen && !user && <AuthModal />}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};