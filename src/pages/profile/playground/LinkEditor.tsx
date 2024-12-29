import { useState } from "react";
import { Item, OGData } from "./types";

interface LinkEditorProps {
  onAddItem: (item: Item) => Promise<void>;
}

export const LinkEditor = ({ onAddItem }: LinkEditorProps) => {
  const [linkUrl, setLinkUrl] = useState("");
  const [selectedBgColor, setSelectedBgColor] = useState(
    "rgba(167, 139, 250, 0.1)"
  );
  const [ogData, setOgData] = useState<OGData | null>(null);
  const [isFetchingOG, setIsFetchingOG] = useState(false);

  const fetchOGData = async (url: string) => {
    try {
      setIsFetchingOG(true);
      const response = await fetch(
        `https://api.microlink.io?url=${encodeURIComponent(url)}`
      );
      const data = await response.json();
      setOgData({
        title: data.data.title || "",
        description: data.data.description || "",
        image: data.data.image?.url || "",
      });
    } catch (error) {
      console.error("Error fetching OG data:", error);
      setOgData(null);
    } finally {
      setIsFetchingOG(false);
    }
  };

  const handleAddLink = async () => {
    if (!linkUrl || !ogData) return;
    const newItem: Item = {
      type: "link",
      content: linkUrl,
      backgroundColor: selectedBgColor,
      position: { x: 20, y: 20 },
      size: { width: 320, height: 180 },
      metadata: ogData,
    };
    await onAddItem(newItem);
    setLinkUrl("");
    setOgData(null);
  };

  return (
    <div className="p-6 rounded-2xl space-y-4 bg-white shadow-lg">
      <div className="flex flex-wrap gap-6 items-start">
        <div className="flex-grow space-y-2">
          <label className="block text-sm text-purple-700">URL</label>
          <input
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            className="p-3 rounded-xl w-full border border-purple-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition-all text-purple-800 placeholder-purple-300"
            placeholder="Enter URL..."
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm text-purple-700">
            Background Color
          </label>
          <input
            type="color"
            value={selectedBgColor}
            onChange={(e) => setSelectedBgColor(e.target.value)}
            className="p-1 rounded-lg h-10 w-20 border border-purple-200 bg-white cursor-pointer"
          />
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => fetchOGData(linkUrl)}
          className="bg-purple-600 px-8 py-3 rounded-xl text-white hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
        <button
          onClick={handleAddLink}
          className="bg-purple-600 px-8 py-3 rounded-xl text-white hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!ogData}
        >
          Add Link
        </button>
      </div>

      {ogData && (
        <div className="p-4 rounded-xl border border-purple-200 bg-purple-50 space-y-3">
          <h3 className="font-bold text-purple-900">{ogData.title}</h3>
          <p className="text-sm text-purple-600">{ogData.description}</p>
          {ogData.image && (
            <div className="relative rounded-lg overflow-hidden bg-purple-100">
              <img
                src={ogData.image}
                alt="Preview"
                className="w-full max-h-48 object-cover"
              />
            </div>
          )}
          <div className="text-sm text-purple-500 break-all">{linkUrl}</div>
        </div>
      )}
    </div>
  );
};

export default LinkEditor;
