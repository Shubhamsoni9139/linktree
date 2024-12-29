import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { auth, db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import toast from "react-hot-toast";
import ProfileImage from "./profileimage";
import { FiEdit2 as Edit2 } from "react-icons/fi";
import Playground from "./playground";
import { motion } from "framer-motion";

interface UserProfile {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  caption?: string;
  photoURL?: string;
  bio?: string;
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bio, setBio] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/login");
        return;
      }
      try {
        const userQuery = query(
          collection(db, "usernames"),
          where("email", "==", user.email)
        );
        const querySnapshot = await getDocs(userQuery);
        if (querySnapshot.empty) {
          throw new Error("Profile not found");
        }
        const userData = querySnapshot.docs[0].data() as UserProfile;
        setProfile(userData);
        setBio(userData.bio || "Trying to find the flow 💭");
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem("username");
      navigate("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error signing out");
    }
  };

  const handleSaveBio = async () => {
    if (!profile) return;

    try {
      const docRef = doc(db, "usernames", profile.username);
      await updateDoc(docRef, { bio });
      setProfile({ ...profile, bio });
      setIsEditingBio(false);
      toast.success("Bio updated successfully");
    } catch {
      toast.error("Failed to update bio");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-900 flex items-center justify-center p-4">
        <div className="w-full max-w-5xl">
          <div className="flex flex-col items-center">
            {/* Skeleton Loading Animation */}
            <motion.div
              initial={{ opacity: 0.5 }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-32 h-32 rounded-full bg-zinc-800"
            />
            <motion.div
              initial={{ opacity: 0.5 }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
              className="h-6 w-48 bg-zinc-800 rounded-lg mt-4"
            />
            <motion.div
              initial={{ opacity: 0.5 }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
              className="h-4 w-64 bg-zinc-800 rounded-lg mt-4"
            />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-900 flex items-center justify-center p-4">
        <div className="text-red-400 bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-900 p-4 sm:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto flex flex-col gap-8"
      >
        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full backdrop-blur-xl bg-zinc-900/50 rounded-2xl border border-zinc-800 p-8"
        >
          <div className="flex flex-col items-center">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <ProfileImage
                photoURL={profile?.photoURL}
                username={profile?.username || ""}
              />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xl font-semibold mt-4 text-white"
            >
              {profile?.firstName} {profile?.lastName}
            </motion.h2>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-4"
            >
              <div className="flex items-center gap-2">
                {isEditingBio ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="px-4 py-2 bg-zinc-800/50 border border-zinc-700 rounded-lg focus:outline-none focus:border-purple-500 text-white placeholder-zinc-500 transition-colors"
                      placeholder="Enter your bio"
                    />
                    <button
                      onClick={handleSaveBio}
                      className="px-4 py-2 text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="text-zinc-400">{bio}</p>
                    <button
                      onClick={() => setIsEditingBio(true)}
                      className="text-zinc-500 hover:text-purple-400 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </motion.div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              onClick={handleSignOut}
              className="mt-6 px-4 py-2 text-zinc-400 hover:text-white rounded-lg border border-zinc-700 hover:bg-zinc-800 transition-all"
            >
              Sign Out
            </motion.button>
          </div>
        </motion.div>

        {/* Playground Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="backdrop-blur-xl bg-zinc-900/50 rounded-2xl border border-zinc-800"
        >
          <Playground />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Profile;
