import { useState, useEffect } from "react";
import { Tab } from "@headlessui/react";
import { db } from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { TextEditor } from "./playground/TextEditor";
import { LinkEditor } from "./playground/LinkEditor";
import { DraggableItem } from "./playground/DraggableItem";
import { UserData, Item } from "./playground/types";

const Playground = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [fontSize] = useState("16");

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

  const handleAddItem = async (newItem: Item) => {
    await updateUserData({ items: [...(userData?.items || []), newItem] });
  };

  const handlePositionChange = (
    index: number,
    position: { x: number; y: number }
  ) => {
    const newItems = [...(userData?.items || [])];
    newItems[index] = { ...newItems[index], position };
    updateUserData({ items: newItems });
  };

  const handleSizeChange = (
    index: number,
    size: { width: number; height: number }
  ) => {
    const newItems = [...(userData?.items || [])];
    newItems[index] = { ...newItems[index], size };
    updateUserData({ items: newItems });
  };

  const handleDeleteItem = (index: number) => {
    const newItems = userData?.items.filter((_, i) => i !== index) || [];
    updateUserData({ items: newItems });
  };

  return (
    <div className="min-h-screen text-white p-4">
      <div className="mb-6 bg-black">
        <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
          <Tab.List className="flex space-x-2 p-1 rounded-lg mb-4">
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
              <TextEditor onAddItem={handleAddItem} />
            </Tab.Panel>
            <Tab.Panel>
              <LinkEditor onAddItem={handleAddItem} />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>

      <div className="relative w-full h-[600px] rounded-lg">
        {userData?.items.map((item, index) => (
          <DraggableItem
            key={index}
            item={item}
            index={index}
            fontSize={fontSize}
            onPositionChange={handlePositionChange}
            onSizeChange={handleSizeChange}
            onDelete={handleDeleteItem}
          />
        ))}
      </div>
    </div>
  );
};

export default Playground;
