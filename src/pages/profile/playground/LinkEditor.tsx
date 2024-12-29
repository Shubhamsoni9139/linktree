import { useState } from "react";
import { Item, OGData } from "./types";

interface LinkEditorProps {
  onAddItem: (item: Item) => Promise<void>;
}

export const LinkEditor = ({ onAddItem }: LinkEditorProps) => {
  const [linkUrl, setLinkUrl] = useState("");
  const [selectedBgColor, setSelectedBgColor] = useState("#4B5563");
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
    <div className="p-4 rounded-lg space-y-4">
      <div className="flex flex-wrap gap-4 items-center">
        <input
          type="url"
          value={linkUrl}
          onChange={(e) => setLinkUrl(e.target.value)}
          className="p-2 rounded flex-grow"
          placeholder="Enter URL..."
        />
        <div className="space-y-1">
          <label className="block text-sm">Background Color</label>
          <input
            type="color"
            value={selectedBgColor}
            onChange={(e) => setSelectedBgColor(e.target.value)}
            className="p-1 rounded h-8 w-16"
          />
        </div>
      </div>
      <div className="flex gap-4">
        <button
          onClick={() => fetchOGData(linkUrl)}
          className="bg-blue-600 px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          disabled={!linkUrl || isFetchingOG}
        >
          {isFetchingOG ? "Fetching..." : "Fetch Metadata"}
        </button>
        <button
          onClick={handleAddLink}
          className="bg-blue-600 px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          disabled={!ogData}
        >
          Add Link
        </button>
      </div>
      {ogData && (
        <div className="p-3 rounded">
          <h3 className="font-bold">{ogData.title}</h3>
          <p className="text-sm text-gray-300 mt-1">{ogData.description}</p>
          {ogData.image && (
            <img
              src={ogData.image}
              alt="Preview"
              className="rounded mt-2 max-h-32 w-full object-cover"
            />
          )}
        </div>
      )}
    </div>
  );
};
