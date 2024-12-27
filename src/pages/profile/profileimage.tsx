import React, { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { Camera } from "lucide-react";
import toast from "react-hot-toast";
import { db } from "../../firebase";

interface ProfileImageProps {
  photoURL?: string;
  username: string;
}

const ProfileImage: React.FC<ProfileImageProps> = ({ photoURL, username }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewURL, setPreviewURL] = useState(
    photoURL || "/api/placeholder/200/200"
  );

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    if (!selectedFile) {
      return toast.error("Please select an image");
    }

    // Update preview with the selected file
    const fileReader = new FileReader();
    fileReader.onload = () => {
      if (fileReader.result) {
        setPreviewURL(fileReader.result.toString());
      }
    };
    fileReader.readAsDataURL(selectedFile);

    setIsUploading(true);

    const data = new FormData();
    data.append("file", selectedFile);
    data.append("upload_preset", "MyCloud");
    data.append("cloud_name", "dt8emxboh");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dt8emxboh/image/upload",
        {
          method: "POST",
          body: data,
        }
      );
      const cloudData = await res.json();

      if (cloudData.url && username) {
        const userRef = doc(db, "usernames", username);
        await updateDoc(userRef, { photoURL: cloudData.url });
        setPreviewURL(cloudData.url); // Update preview with the uploaded image URL
        toast.success("Profile picture updated");
      }
    } catch {
      toast.error("Failed to update profile picture");
      setPreviewURL(photoURL || "/api/placeholder/200/200"); // Reset preview in case of error
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative w-32 h-32 rounded-full bg-[#8b7cff] overflow-hidden group">
      <img
        src={previewURL}
        alt={username}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <input
          id="file-upload"
          className="hidden"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={isUploading}
        />
        <label htmlFor="file-upload" className="cursor-pointer text-white">
          <Camera className="w-6 h-6" />
        </label>
      </div>
    </div>
  );
};

export default ProfileImage;
