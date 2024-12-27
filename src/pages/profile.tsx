import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { Edit2, Save } from "lucide-react";

interface UserProfile {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  caption?: string;
  photoURL?: string;
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [isEditingCaption, setIsEditingCaption] = useState(false);
  const [caption, setCaption] = useState("");
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
        setCaption(userData.caption || "");
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

  const handleSaveCaption = async () => {
    if (!profile) return;

    try {
      const docRef = doc(db, "usernames", profile.username);
      await updateDoc(docRef, { caption });
      setProfile({ ...profile, caption });
      setIsEditingCaption(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error saving caption");
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
    <div className="min-h-screen bg-[#f8f5ff]">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#8b7cff]">LinkMe</h1>
          <div className="flex gap-4">
            <button className="text-[#8b7cff] hover:text-[#7b6bff]">
              Dashboard
            </button>
            <button
              onClick={handleSignOut}
              className="text-[#8b7cff] hover:text-[#7b6bff]"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {profile && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center">
              <div className="w-48 h-48 rounded-full bg-[#8b7cff] mb-6 overflow-hidden">
                <img
                  src={profile.photoURL || "/api/placeholder/200/200"}
                  alt={profile.username}
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-2xl font-bold text-[#8b7cff] mb-4">
                {`${profile.firstName} ${profile.lastName}`}
              </h2>
              <div className="w-full">
                {isEditingCaption ? (
                  <div className="flex flex-col gap-2">
                    <textarea
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      className="w-full p-3 rounded-xl border border-[#e0d9ff] text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-[#8b7cff]"
                      rows={3}
                      placeholder="Write something about yourself..."
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setIsEditingCaption(false)}
                        className="px-4 py-2 text-sm text-[#8b7cff] hover:bg-[#f8f5ff] rounded-xl"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveCaption}
                        className="px-4 py-2 text-sm bg-[#8b7cff] text-white rounded-xl hover:bg-[#7b6bff] flex items-center gap-1"
                      >
                        <Save size={16} /> Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="relative group">
                    <p className="text-gray-600 text-center">
                      {profile.caption || "No caption yet"}
                    </p>
                    <button
                      onClick={() => setIsEditingCaption(true)}
                      className="absolute -right-6 top-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Edit2 size={16} className="text-[#8b7cff]" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Username", value: profile.username },
                { label: "Email", value: profile.email },
                {
                  label: "Member Since",
                  value: new Date(profile.createdAt).toLocaleDateString(),
                },
                { label: "Account Type", value: "Standard" },
              ].map((item, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-[#8b7cff] text-sm font-medium mb-2">
                    {item.label}
                  </h3>
                  <p className="text-gray-700 text-lg">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
