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
      <div className="min-h-screen bg-[#f8f5ff] flex items-center justify-center">
        <div className="text-[#8b7cff]">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f8f5ff] flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f5ff] p-8">
      <div className="max-w-5xl mx-auto flex flex-col gap-8">
        {/* Top Panel (Previously Left Panel) */}
        <div className="w-full  p-8">
          <div className="flex flex-col items-center">
            <ProfileImage
              photoURL={profile?.photoURL}
              username={profile?.username || ""}
            />
            <h2 className="text-xl font-semibold mt-4">
              {profile?.firstName} {profile?.lastName}
            </h2>
            <div className="mt-4">
              <div className="flex items-center gap-2">
                {isEditingBio ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="px-3 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b7cff]"
                      placeholder="Enter your bio"
                    />
                    <button
                      onClick={handleSaveBio}
                      className="text-[#8b7cff] hover:text-[#7a6be0]"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="text-gray-600">{bio}</p>
                    <button
                      onClick={() => setIsEditingBio(true)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Panel (Previously Right Panel) */}
        <div className="">
          <Playground />
        </div>
      </div>
    </div>
  );
};

export default Profile;
