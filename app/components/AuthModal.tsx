// app/components/AuthModal.tsx
"use client";

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { X, Mail, Key } from "lucide-react";
import { FirebaseError } from "firebase/app"; // Import the specific error type

export default function AuthModal() {
  const { loginWithGoogle, loginWithEmail, signupWithEmail, setIsModalOpen } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        await loginWithEmail(email, password);
      } else {
        await signupWithEmail(email, password);
      }
    } catch (err) {
      // Use the specific FirebaseError type for better error handling
      if (err instanceof FirebaseError) {
        if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
            setError("Invalid email or password.");
        } else if (err.code === 'auth/email-already-in-use') {
            setError("An account with this email already exists.");
        } else {
            setError("An error occurred. Please try again.");
        }
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
        setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);
    try {
      await loginWithGoogle();
    } catch (err) {
      setError("Could not sign in with Google. Please try again.");
    } finally {
        setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center backdrop-blur-sm">
      <div className="bg-[#181818] p-8 rounded-2xl shadow-lg w-full max-w-sm relative border border-white/10">
        <button
          onClick={() => setIsModalOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X />
        </button>
        {/* The rest of your modal's JSX remains the same */}
         <h2 className="text-2xl font-bold text-center mb-2 text-white">
          {mode === "login" ? "Welcome Back" : "Create Account"}
        </h2>
        <p className="text-center text-gray-400 text-sm mb-6">
          Sign in to continue to Airena
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20}/>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 pl-10"
              required
            />
          </div>
          <div className="relative">
            <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20}/>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 pl-10"
              required
            />
          </div>
          {error && <p className="text-red-500 text-xs text-center pt-1">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 text-white py-3 rounded-lg font-semibold hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Loading..." : (mode === "login" ? "Login" : "Create Account")}
          </button>
        </form>
        <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-700"></span></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#181818] px-2 text-gray-500">Or continue with</span></div>
        </div>
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 border border-gray-700 disabled:opacity-50"
        >
            <svg className="w-5 h-5" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.986,36.681,44,30.886,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path></svg>
            Continue with Google
        </button>
        <p className="text-sm text-center text-gray-400 mt-6">
          {mode === "login"
            ? "Don't have an account?"
            : "Already have an account?"}
            <button
                className="font-semibold text-emerald-400 hover:text-emerald-500 ml-1"
                onClick={() => setMode(mode === "login" ? "signup" : "login")}
            >
                {mode === "login" ? "Sign Up" : "Login"}
            </button>
        </p>
      </div>
    </div>
  );
}