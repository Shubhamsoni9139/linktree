import { useState } from "react";
import { Item, OGData } from "./types";

interface LinkEditorProps {
  onAddItem: (item: Item) => Promise<void>;
}

export const LinkEditor = ({ onAddItem }: LinkEditorProps) => {
  const [linkUrl, setLinkUrl] = useState("");
  const [selectedBgColor, setSelectedBgColor] = useState(
    "rgba(167, 139, 250, 0.2)"
  );
  const [ogData, setOgData] = useState<OGData | null>(null);
  const [editableOgData, setEditableOgData] = useState<OGData | null>(null);
  const [isFetchingOG, setIsFetchingOG] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const fetchOGData = async (url: string) => {
    try {
      setIsFetchingOG(true);
      const response = await fetch(
        `https://api.microlink.io?url=${encodeURIComponent(url)}`
      );
      const data = await response.json();
      const newOgData = {
        title: data.data.title || "",
        description: data.data.description || "",
        image: data.data.image?.url || "",
      };
      setOgData(newOgData);
      setEditableOgData(newOgData);
      setIsEditing(true);
    } catch (error) {
      console.error("Error fetching OG data:", error);
      setOgData(null);
      setEditableOgData(null);
    } finally {
      setIsFetchingOG(false);
    }
  };

  const handleAddLink = async () => {
    if (!linkUrl || !editableOgData) return;
    const newItem: Item = {
      type: "link",
      content: linkUrl,
      backgroundColor: selectedBgColor,
      position: { x: 20, y: 20 },
      size: { width: 320, height: 180 },
      metadata: editableOgData,
    };
    await onAddItem(newItem);
    setLinkUrl("");
    setOgData(null);
    setEditableOgData(null);
    setIsEditing(false);
  };

  const handleSaveEdit = () => {
    setOgData(editableOgData);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditableOgData(ogData);
    setIsEditing(false);
  };

  return (
    <div className="p-6 rounded-2xl space-y-4 bg-gray-900 shadow-lg border border-gray-800">
      <div className="flex flex-wrap gap-6 items-start">
        <div className="flex-grow space-y-2">
          <label className="block text-sm text-purple-400">URL</label>
          <input
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            className="p-3 rounded-xl w-full bg-gray-800 border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all text-gray-100 placeholder-gray-500"
            placeholder="Enter URL..."
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm text-purple-400">
            Background Color
          </label>
          <input
            type="color"
            value={selectedBgColor}
            onChange={(e) => setSelectedBgColor(e.target.value)}
            className="p-1 rounded-lg h-10 w-20 border border-gray-700 bg-gray-800 cursor-pointer"
          />
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => fetchOGData(linkUrl)}
          className="bg-purple-700 px-8 py-3 rounded-xl text-white hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!linkUrl || isFetchingOG}
        >
          {isFetchingOG ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Fetching...
            </span>
          ) : (
            "Fetch Metadata"
          )}
        </button>
        {!isEditing && ogData && (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-purple-700 px-8 py-3 rounded-xl text-white hover:bg-purple-600 transition-colors"
          >
            Edit Metadata
          </button>
        )}
        {!isEditing && ogData && (
          <button
            onClick={handleAddLink}
            className="bg-purple-700 px-8 py-3 rounded-xl text-white hover:bg-purple-600 transition-colors"
          >
            Add Link
          </button>
        )}
      </div>

      {editableOgData && isEditing ? (
        <div className="p-4 rounded-xl border border-gray-700 bg-gray-800 space-y-4">
          <div className="space-y-2">
            <label className="block text-sm text-purple-400">Title</label>
            <input
              type="text"
              value={editableOgData.title}
              onChange={(e) =>
                setEditableOgData({ ...editableOgData, title: e.target.value })
              }
              className="p-3 rounded-xl w-full bg-gray-800 border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all text-gray-100"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm text-purple-400">Description</label>
            <textarea
              value={editableOgData.description}
              onChange={(e) =>
                setEditableOgData({
                  ...editableOgData,
                  description: e.target.value,
                })
              }
              className="p-3 rounded-xl w-full bg-gray-800 border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all text-gray-100 min-h-[100px]"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm text-purple-400">Image URL</label>
            <input
              type="url"
              value={editableOgData.image}
              onChange={(e) =>
                setEditableOgData({ ...editableOgData, image: e.target.value })
              }
              className="p-3 rounded-xl w-full bg-gray-800 border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all text-gray-100"
            />
          </div>
          {editableOgData.image && (
            <div className="relative rounded-lg overflow-hidden bg-gray-700">
              <img
                src={editableOgData.image}
                alt="Preview"
                className="w-full max-h-48 object-cover"
              />
            </div>
          )}
          <div className="flex gap-4">
            <button
              onClick={handleSaveEdit}
              className="bg-green-600 px-8 py-3 rounded-xl text-white hover:bg-green-500 transition-colors"
            >
              Save Changes
            </button>
            <button
              onClick={handleCancelEdit}
              className="bg-gray-700 px-8 py-3 rounded-xl text-white hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        ogData && (
          <div className="p-4 rounded-xl border border-gray-700 bg-gray-800 space-y-3">
            <h3 className="font-bold text-gray-100">{ogData.title}</h3>
            <p className="text-sm text-gray-300">{ogData.description}</p>
            {ogData.image && (
              <div className="relative rounded-lg overflow-hidden bg-gray-700">
                <img
                  src={ogData.image}
                  alt="Preview"
                  className="w-full max-h-48 object-cover"
                />
              </div>
            )}
            <div className="text-sm text-gray-400 break-all">{linkUrl}</div>
          </div>
        )
      )}
    </div>
  );
};

export default LinkEditor;
