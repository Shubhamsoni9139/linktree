import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  signInWithPopup,
  GoogleAuthProvider,
  UserCredential,
} from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
} from "firebase/firestore";
import { auth, db } from "../firebase";

interface UserData {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
}

const AuthPage: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [showUsernameInput, setShowUsernameInput] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();

  useEffect(() => {
    const cachedUsername = localStorage.getItem("username");
    if (cachedUsername) {
      navigate("/");
    }
  }, [navigate]);

  const checkUsername = async (username: string): Promise<void> => {
    if (!username.match(/^[a-z0-9]+$/)) {
      throw new Error(
        "Username must contain only lowercase letters and numbers"
      );
    }

    const usernameQuery = query(
      collection(db, "usernames"),
      where("username", "==", username.toLowerCase())
    );

    const querySnapshot = await getDocs(usernameQuery);
    if (!querySnapshot.empty) {
      throw new Error("Username already taken");
    }
  };

  const saveUserData = async (
    userCredential: UserCredential,
    username: string
  ): Promise<void> => {
    const userData: UserData = {
      username: username.toLowerCase(),
      email: userCredential.user.email || "",
      firstName: userCredential.user.displayName?.split(" ")[0] || "",
      lastName: userCredential.user.displayName?.split(" ")[1] || "",
      createdAt: new Date().toISOString(),
    };

    await setDoc(doc(db, "usernames", username), userData);
    localStorage.setItem("username", username);
  };

  const handleGoogleAuth = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError("");
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const email = user.email || "";

      const usernameQuery = query(
        collection(db, "usernames"),
        where("email", "==", email)
      );

      const querySnapshot = await getDocs(usernameQuery);

      if (querySnapshot.empty) {
        setShowUsernameInput(true);
      } else {
        const existingUsername = querySnapshot.docs[0].data().username;
        localStorage.setItem("username", existingUsername);
        navigate("/");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUsernameSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await checkUsername(username);
      const user = auth.currentUser;
      if (!user) throw new Error("No user found");

      await saveUserData({ user } as UserCredential, username);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Background animation variants
  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.5,
      },
    },
  };

  const circleVariants = {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: [0.3, 0.6, 0.3],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background circles */}
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="absolute inset-0 z-0"
      >
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            variants={circleVariants}
            className="absolute rounded-full bg-purple-600/20 blur-3xl"
            style={{
              width: Math.random() * 400 + 100,
              height: Math.random() * 400 + 100,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full backdrop-blur-xl bg-zinc-900/50 rounded-2xl shadow-xl border border-zinc-800 p-8 relative z-10"
      >
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-center text-white mb-8"
        >
          {showUsernameInput ? "Choose Username" : "Welcome to LinkMe"}
        </motion.h1>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm"
          >
            {error}
          </motion.div>
        )}

        {showUsernameInput ? (
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            onSubmit={handleUsernameSubmit}
            className="space-y-4"
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-lg focus:outline-none focus:border-purple-500 text-white placeholder-zinc-500 transition-colors"
                disabled={isLoading}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-zinc-500">linkme/</span>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg transition-colors disabled:opacity-50 disabled:hover:bg-purple-600"
              disabled={isLoading}
            >
              {isLoading ? "Setting up your profile..." : "Complete Sign Up"}
            </button>
          </motion.form>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <p className="text-zinc-400 text-center mb-6">
              Join thousands of creators who share their content with a single
              link
            </p>
            <button
              onClick={handleGoogleAuth}
              className="w-full bg-zinc-800 hover:bg-zinc-700 text-white py-3 px-4 rounded-lg transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-3 border border-zinc-700"
              disabled={isLoading}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {isLoading ? "Connecting..." : "Continue with Google"}
            </button>
          </motion.div>
        )}

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 text-center text-zinc-500 text-sm"
        >
          By continuing, you agree to our{" "}
          <a href="/terms" className="text-purple-400 hover:text-purple-300">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="text-purple-400 hover:text-purple-300">
            Privacy Policy
          </a>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default AuthPage;
