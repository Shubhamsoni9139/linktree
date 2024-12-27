import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

  return (
    <div className="min-h-screen bg-[#222831] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#393E46] rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center text-[#EEEEEE] mb-6">
          {showUsernameInput
            ? "Choose Username"
            : "Login / Sign Up with Google"}
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
            {error}
          </div>
        )}

        {showUsernameInput ? (
          <form onSubmit={handleUsernameSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00ADB5]"
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#00ADB5] text-[#EEEEEE] py-2 rounded-md hover:bg-[#00A1A8] focus:outline-none focus:ring-2 focus:ring-[#00ADB5] focus:ring-offset-2 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Complete Sign Up"}
            </button>
          </form>
        ) : (
          <button
            onClick={handleGoogleAuth}
            className="w-full bg-white border border-gray-300 text-[#222831] py-2 px-4 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#00ADB5] focus:ring-offset-2 disabled:opacity-50 flex items-center justify-center gap-2"
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
            {isLoading ? "Loading..." : "Continue with Google"}
          </button>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
