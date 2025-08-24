// app/context/AuthContext.tsx
"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth } from '@/app/firebase/config';
import { onAuthStateChanged, User } from 'firebase/auth';
import AuthModal from '@/app/components/AuthModal';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    isModalOpen: boolean;
    setIsModalOpen: (isOpen: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
            // We no longer automatically open the modal here.
            // It will only open on user action (clicking "Sign In").
        });

        return () => unsubscribe(); // Cleanup subscription on unmount
    }, []);

    const value = { user, loading, isModalOpen, setIsModalOpen };

    return (
        <AuthContext.Provider value={value}>
            {children}
            {isModalOpen && !user && <AuthModal onClose={() => setIsModalOpen(false)} />}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};