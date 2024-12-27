import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Draggable from "react-draggable";
import { Resizable } from "re-resizable";

interface Item {
  type: "text" | "link";
  content: string;
  font?: string;
  color?: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  metadata?: {
    title: string;
    description: string;
    image: string;
  };
}

interface UserData {
  items: Item[];
}

const Playground = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [newText, setNewText] = useState("");
  const [selectedFont, setSelectedFont] = useState("Arial");
  const [selectedColor, setSelectedColor] = useState("#FFFFFF");
  const [fontSize, setFontSize] = useState("16");
  const [linkUrl, setLinkUrl] = useState("");
  interface OGData {
    title: string;
    description: string;
    image: string;
  }

  const [ogData, setOgData] = useState<OGData | null>(null);
  const [isFetchingOG, setIsFetchingOG] = useState(false);

  const fonts = [
    "Arial",
    "Times New Roman",
    "Courier New",
    "Georgia",
    "Verdana",
    "Helvetica",
    "Comic Sans MS",
    "Impact",
  ];

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const userDoc = await getDoc(doc(db, "usernames", "shubhamsoni"));
    const data = userDoc.data();
    setUserData(data ? { items: data.items || [] } : { items: [] });
  };

  const updateUserData = async (newData: UserData) => {
    const userRef = doc(db, "usernames", "shubhamsoni");
    await updateDoc(userRef, { items: newData.items });
    setUserData(newData);
  };

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

  const addTextItem = async () => {
    if (!newText) return;

    const newItem: Item = {
      type: "text",
      content: newText,
      font: selectedFont,
      color: selectedColor,
      position: { x: 20, y: 20 },
      size: { width: 200, height: parseInt(fontSize) * 2 },
    };

    await updateUserData({ items: [...(userData?.items || []), newItem] });
    setNewText("");
  };

  const addLinkItem = async () => {
    if (!linkUrl || !ogData) return;

    const newItem: Item = {
      type: "link",
      content: linkUrl,
      position: { x: 20, y: 20 },
      size: { width: 320, height: 180 },
      metadata: ogData,
    };

    await updateUserData({ items: [...(userData?.items || []), newItem] });
    setLinkUrl("");
    setOgData(null);
  };

  return (
    <div className="min-h-screen  text-white p-4">
      <div className="mb-6 space-y-4">
        {/* Text Controls */}
        <div className="flex flex-wrap gap-4 items-center bg-gray-800 p-4 rounded">
          <input
            type="text"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            className="bg-gray-700 p-2 rounded"
            placeholder="Add text..."
          />
          <select
            value={selectedFont}
            onChange={(e) => setSelectedFont(e.target.value)}
            className="bg-gray-700 p-2 rounded"
          >
            {fonts.map((font) => (
              <option key={font} value={font}>
                {font}
              </option>
            ))}
          </select>
          <input
            type="color"
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            className="bg-gray-700 p-1 rounded h-10 w-16"
          />
          <input
            type="number"
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value)}
            className="bg-gray-700 p-2 rounded w-20"
            placeholder="Size"
            min="8"
            max="72"
          />
          <button
            onClick={addTextItem}
            className="bg-blue-600 px-4 py-2 rounded"
          >
            Add Text
          </button>
        </div>

        {/* Link Controls */}
        <div className="flex flex-wrap gap-4 items-center bg-gray-800 p-4 rounded">
          <input
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            className="bg-gray-700 p-2 rounded flex-grow"
            placeholder="Enter URL..."
          />
          <button
            onClick={() => fetchOGData(linkUrl)}
            className="bg-blue-600 px-4 py-2 rounded"
            disabled={!linkUrl || isFetchingOG}
          >
            {isFetchingOG ? "Fetching..." : "Fetch Metadata"}
          </button>
          <button
            onClick={addLinkItem}
            className="bg-blue-600 px-4 py-2 rounded"
            disabled={!ogData}
          >
            Add Link
          </button>
        </div>
      </div>

      <div className="relative w-full h-[600px]  rounded-lg">
        {userData?.items.map((item, index) => (
          <Draggable
            key={index}
            position={item.position}
            onStop={(e, data) => {
              const newItems = [...(userData?.items || [])];
              newItems[index] = { ...item, position: { x: data.x, y: data.y } };
              updateUserData({ items: newItems });
            }}
          >
            <div className="absolute">
              <Resizable
                size={{ width: item.size.width, height: item.size.height }}
                onResizeStop={(e, direction, ref, d) => {
                  const newItems = [...(userData?.items || [])];
                  newItems[index] = {
                    ...item,
                    size: {
                      width: item.size.width + d.width,
                      height: item.size.height + d.height,
                    },
                  };
                  updateUserData({ items: newItems });
                }}
                minWidth={100}
                minHeight={50}
                handleStyles={{
                  bottomRight: { background: "#4A5568" },
                }}
              >
                <div className="h-full">
                  {item.type === "text" ? (
                    <div
                      style={{
                        fontFamily: item.font,
                        color: item.color,
                        fontSize: `${fontSize}px`,
                      }}
                      className="bg-gray-700/50 p-3 rounded"
                    >
                      {item.content}
                    </div>
                  ) : (
                    <div className="bg-gray-700/50 p-3 rounded h-full">
                      <h3 className="font-bold">{item.metadata?.title}</h3>
                      <a
                        href={item.content}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 text-sm break-all"
                      >
                        {item.content}
                      </a>
                      {item.metadata?.image && (
                        <img
                          src={item.metadata.image}
                          alt="OG"
                          className="rounded mt-2 max-h-32 object-cover"
                        />
                      )}
                    </div>
                  )}
                  <button
                    onClick={() => {
                      const newItems =
                        userData?.items.filter((_, i) => i !== index) || [];
                      updateUserData({ items: newItems });
                    }}
                    className="absolute top-1 right-1 bg-red-500 p-1 rounded"
                  >
                    ×
                  </button>
                </div>
              </Resizable>
            </div>
          </Draggable>
        ))}
      </div>
    </div>
  );
};

export default Playground;
