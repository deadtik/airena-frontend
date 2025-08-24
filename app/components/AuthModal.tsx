// app/components/AuthModal.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { auth, db } from '@/app/firebase/config';
import {
    RecaptchaVerifier,
    signInWithPhoneNumber,
    GoogleAuthProvider,
    signInWithPopup,
    ConfirmationResult
} from "firebase/auth";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { X, Phone, ShieldCheck } from 'lucide-react';
import PhoneInput from 'react-phone-number-input';

declare global {
    interface Window {
        recaptchaVerifier?: RecaptchaVerifier;
        confirmationResult?: ConfirmationResult;
    }
}

interface AuthModalProps {
    onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
    const [phone, setPhone] = useState<string | undefined>('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState<'enter-phone' | 'enter-otp'>('enter-phone');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // This ensures the reCAPTCHA container is ready before initializing
        if (document.getElementById('recaptcha-container')) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                'size': 'invisible',
                'callback': (response: any) => {}
            });
        }
    }, []);

    const handlePhoneSignIn = async () => {
        setError('');
        setLoading(true);
        if (!phone || phone.length < 10) {
            setError("Please enter a valid phone number.");
            setLoading(false);
            return;
        }
        try {
            const appVerifier = window.recaptchaVerifier!;
            const confirmationResult = await signInWithPhoneNumber(auth, phone, appVerifier);
            window.confirmationResult = confirmationResult;
            setStep('enter-otp');
        } catch (err: any) {
            console.error("SMS Error:", err);
            setError("Failed to send OTP. Please try again or refresh the page.");
        } finally {
            setLoading(false);
        }
    };

    const handleOtpVerify = async () => {
        setError('');
        setLoading(true);
        if (!otp || otp.length !== 6) {
            setError("Please enter a valid 6-digit OTP.");
            setLoading(false);
            return;
        }
        try {
            const confirmationResult = window.confirmationResult!;
            const userCredential = await confirmationResult.confirm(otp);
            const user = userCredential.user;
            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);
            if (!userDoc.exists()) {
                 await setDoc(userDocRef, { uid: user.uid, phoneNumber: user.phoneNumber, createdAt: new Date() });
            }
            onClose();
        } catch (err: any) {
             console.error("OTP Error:", err);
            setError("Invalid OTP or request expired. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setError('');
        setLoading(true);
        const provider = new GoogleAuthProvider();
        try {
            const userCredential = await signInWithPopup(auth, provider);
            const user = userCredential.user;
            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);
            if (!userDoc.exists()) {
                await setDoc(userDocRef, { uid: user.uid, email: user.email, displayName: user.displayName, photoURL: user.photoURL, createdAt: new Date() });
            }
            onClose();
        } catch (err: any) {
            console.error("Google Sign-In Error:", err);
            setError("Could not sign in with Google. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center backdrop-blur-sm">
            <div className="bg-[#181818] p-8 rounded-2xl shadow-lg w-full max-w-sm relative border border-white/10">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"><X /></button>
                <div id="recaptcha-container"></div>
                <h2 className="text-2xl font-bold text-center mb-2">Welcome to Airena</h2>
                <p className="text-center text-gray-400 text-sm mb-6">Sign in or create an account to continue</p>
                {step === 'enter-phone' && (
                    <div className="space-y-4">
                        <PhoneInput placeholder="Enter phone number" value={phone} onChange={setPhone} international countryCallingCodeEditable={false} defaultCountry="IN" className="phone-input" />
                        <button onClick={handlePhoneSignIn} disabled={loading} className="w-full mt-2 bg-emerald-500 text-white py-2.5 rounded-lg font-semibold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">{loading ? 'Sending...' : <><Phone size={16}/> Send OTP</>}</button>
                    </div>
                )}
                {step === 'enter-otp' && (
                    <div className="space-y-4">
                        <p className="text-center text-sm text-gray-400">Enter the OTP sent to {phone}</p>
                        <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="6-Digit OTP" maxLength={6} className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-center tracking-[0.5em]" />
                        <button onClick={handleOtpVerify} disabled={loading} className="w-full mt-2 bg-emerald-500 text-white py-2.5 rounded-lg font-semibold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">{loading ? 'Verifying...' : <><ShieldCheck size={16}/> Verify OTP</>}</button>
                        <button onClick={() => setStep('enter-phone')} className="text-sm text-gray-400 hover:text-white text-center w-full mt-2">Change number</button>
                    </div>
                )}
                {error && <p className="text-red-500 text-xs text-center mt-4">{error}</p>}
                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-700"></span></div>
                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#181818] px-2 text-gray-500">Or continue with</span></div>
                </div>
                <button onClick={handleGoogleSignIn} disabled={loading} className="w-full bg-gray-800 text-white py-2.5 rounded-lg font-semibold hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 border border-gray-700 disabled:opacity-50">
                    <svg className="w-5 h-5" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.986,36.681,44,30.886,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path></svg>
                    Sign in with Google
                </button>
            </div>
            <style jsx>{`
                .phone-input .PhoneInputInput { background-color: #2d3748; border: 1px solid #4a5568; color: white; padding: 0.5rem 1rem; border-radius: 0.5rem; width: 100%; }
                .phone-input .PhoneInputCountry { background-color: #2d3748; border: 1px solid #4a5568; border-radius: 0.5rem 0 0 0.5rem; padding: 0 0.5rem; }
            `}</style>
        </div>
    );
};

export default AuthModal;