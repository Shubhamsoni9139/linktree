import { useState, useEffect } from "react";
import { db } from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Draggable from "react-draggable";
import { Resizable } from "re-resizable";
import { Tab } from "@headlessui/react";

interface Item {
  type: "text" | "link";
  content: string;
  font?: string;
  color?: string;
  backgroundColor?: string;
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
  const [selectedBgColor, setSelectedBgColor] = useState("#4B5563");
  const [fontSize, setFontSize] = useState("16");
  const [linkUrl, setLinkUrl] = useState("");
  const [selectedTab, setSelectedTab] = useState(0);

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
      backgroundColor: selectedBgColor,
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
      backgroundColor: selectedBgColor,
      position: { x: 20, y: 20 },
      size: { width: 320, height: 180 },
      metadata: ogData,
    };

    await updateUserData({ items: [...(userData?.items || []), newItem] });
    setLinkUrl("");
    setOgData(null);
  };

  return (
    <div className="min-h-screen text-white p-4">
      <div className="mb-6 bg-black">
        <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
          <Tab.List className="flex space-x-2  p-1 rounded-lg mb-4">
            <Tab
              className={({ selected }) =>
                `px-4 py-2 rounded-md ${selected ? "bg-blue-600" : " hover:"}`
              }
            >
              Add Text
            </Tab>
            <Tab
              className={({ selected }) =>
                `px-4 py-2 rounded-md ${selected ? "bg-blue-600" : " hover:"}`
              }
            >
              Add Link
            </Tab>
          </Tab.List>

          <Tab.Panels>
            <Tab.Panel>
              <div className=" p-4 rounded-lg space-y-4">
                <div className="flex flex-wrap gap-4 items-center">
                  <input
                    type="text"
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                    className=" p-2 rounded flex-grow"
                    placeholder="Add text..."
                  />
                  <select
                    value={selectedFont}
                    onChange={(e) => setSelectedFont(e.target.value)}
                    className=" p-2 rounded"
                  >
                    {fonts.map((font) => (
                      <option key={font} value={font}>
                        {font}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="space-y-1">
                    <label className="block text-sm">Text Color</label>
                    <input
                      type="color"
                      value={selectedColor}
                      onChange={(e) => setSelectedColor(e.target.value)}
                      className=" p-1 rounded h-8 w-16"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm">Background Color</label>
                    <input
                      type="color"
                      value={selectedBgColor}
                      onChange={(e) => setSelectedBgColor(e.target.value)}
                      className=" p-1 rounded h-8 w-16"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm">Font Size</label>
                    <input
                      type="number"
                      value={fontSize}
                      onChange={(e) => setFontSize(e.target.value)}
                      className=" p-2 rounded w-20"
                      min="8"
                      max="72"
                    />
                  </div>
                  <button
                    onClick={addTextItem}
                    className="bg-blue-600 px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors mt-auto"
                  >
                    Add Text
                  </button>
                </div>
              </div>
            </Tab.Panel>

            <Tab.Panel>
              <div className=" p-4 rounded-lg space-y-4">
                <div className="flex flex-wrap gap-4 items-center">
                  <input
                    type="url"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    className=" p-2 rounded flex-grow"
                    placeholder="Enter URL..."
                  />
                  <div className="space-y-1">
                    <label className="block text-sm">Background Color</label>
                    <input
                      type="color"
                      value={selectedBgColor}
                      onChange={(e) => setSelectedBgColor(e.target.value)}
                      className=" p-1 rounded h-8 w-16"
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
                    onClick={addLinkItem}
                    className="bg-blue-600 px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    disabled={!ogData}
                  >
                    Add Link
                  </button>
                </div>
                {ogData && (
                  <div className=" p-3 rounded">
                    <h3 className="font-bold">{ogData.title}</h3>
                    <p className="text-sm text-gray-300 mt-1">
                      {ogData.description}
                    </p>
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
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>

      <div className="relative w-full h-[600px]  rounded-lg">
        {userData?.items.map((item, index) => (
          <Draggable
            key={index}
            position={item.position}
            onStop={(_e, data) => {
              const newItems = [...(userData?.items || [])];
              newItems[index] = { ...item, position: { x: data.x, y: data.y } };
              updateUserData({ items: newItems });
            }}
          >
            <div className="absolute">
              <Resizable
                size={item.size}
                onResizeStop={(_e, _direction, _ref, d) => {
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
                <div className="h-full relative group">
                  {item.type === "text" ? (
                    <div
                      style={{
                        fontFamily: item.font,
                        color: item.color,
                        backgroundColor: item.backgroundColor,
                        fontSize: `${fontSize}px`,
                      }}
                      className="p-3 rounded h-full"
                    >
                      {item.content}
                    </div>
                  ) : (
                    <div
                      style={{ backgroundColor: item.backgroundColor }}
                      className="p-3 rounded h-full flex flex-col"
                    >
                      <h3 className="font-bold text-white">
                        {item.metadata?.title}
                      </h3>
                      <p className="text-sm text-gray-300 mt-1">
                        {item.metadata?.description}
                      </p>
                      {item.metadata?.image && (
                        <div className="flex-grow mt-2 relative">
                          <img
                            src={item.metadata.image}
                            alt="OG"
                            className="rounded w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <a
                        href={item.content}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 text-sm mt-2 break-all"
                      >
                        {item.content}
                      </a>
                    </div>
                  )}
                  <button
                    onClick={() => {
                      const newItems =
                        userData?.items.filter((_, i) => i !== index) || [];
                      updateUserData({ items: newItems });
                    }}
                    className="absolute top-1 right-1 bg-red-500 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
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
