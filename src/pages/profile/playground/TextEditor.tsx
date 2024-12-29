import { useState } from "react";
import { Item } from "./types";

interface TextEditorProps {
  onAddItem: (item: Item) => Promise<void>;
}

export const TextEditor = ({ onAddItem }: TextEditorProps) => {
  const [newText, setNewText] = useState("");
  const [selectedFont, setSelectedFont] = useState("Arial");
  const [selectedColor, setSelectedColor] = useState("#FFFFFF");
  const [selectedBgColor, setSelectedBgColor] = useState("#4B5563");
  const [fontSize, setFontSize] = useState("16");
  const [gradientStart, setGradientStart] = useState("#4B5563");
  const [gradientEnd, setGradientEnd] = useState("#1F2937");
  const [useGradient, setUseGradient] = useState(false);
  const [editingText, setEditingText] = useState(false);

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

  const handleAddText = async () => {
    if (!newText) return;
    const background = useGradient
      ? `linear-gradient(to right, ${gradientStart}, ${gradientEnd})`
      : selectedBgColor;

    const newItem: Item = {
      type: "text",
      content: newText,
      font: selectedFont,
      color: selectedColor,
      backgroundColor: background,
      position: { x: 20, y: 20 },
      size: { width: 200, height: parseInt(fontSize) * 2 },
    };
    await onAddItem(newItem);
    setNewText("");
  };

  return (
    <div className="p-4 rounded-lg space-y-4 bg-gray-800">
      <div className="flex flex-wrap gap-4 items-center">
        <div className="relative flex-grow">
          {editingText ? (
            <textarea
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              className="p-2 rounded w-full"
              style={{
                fontFamily: selectedFont,
                fontSize: `${fontSize}px`,
                color: selectedColor,
                background: useGradient
                  ? `linear-gradient(to right, ${gradientStart}, ${gradientEnd})`
                  : selectedBgColor,
              }}
              onBlur={() => setEditingText(false)}
              autoFocus
            />
          ) : (
            <div
              onClick={() => setEditingText(true)}
              className="p-2 rounded cursor-text min-h-[40px]"
              style={{
                fontFamily: selectedFont,
                fontSize: `${fontSize}px`,
                color: selectedColor,
                background: useGradient
                  ? `linear-gradient(to right, ${gradientStart}, ${gradientEnd})`
                  : selectedBgColor,
              }}
            >
              {newText || "Add text..."}
            </div>
          )}
        </div>
        <select
          value={selectedFont}
          onChange={(e) => setSelectedFont(e.target.value)}
          className="p-2 rounded bg-gray-700 text-white"
        >
          {fonts.map((font) => (
            <option key={font} value={font}>
              {font}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap gap-4 items-start">
        <div className="space-y-1">
          <label className="block text-sm text-gray-300">Text Color</label>
          <input
            type="color"
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            className="p-1 rounded h-8 w-16 bg-gray-700"
          />
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <label className="block text-sm text-gray-300">Background</label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={useGradient}
                onChange={(e) => setUseGradient(e.target.checked)}
                className="form-checkbox h-4 w-4"
              />
              <span className="ml-2 text-sm text-gray-300">Use Gradient</span>
            </label>
          </div>
          {useGradient ? (
            <div className="flex gap-2">
              <input
                type="color"
                value={gradientStart}
                onChange={(e) => setGradientStart(e.target.value)}
                className="p-1 rounded h-8 w-16 bg-gray-700"
                title="Gradient Start Color"
              />
              <input
                type="color"
                value={gradientEnd}
                onChange={(e) => setGradientEnd(e.target.value)}
                className="p-1 rounded h-8 w-16 bg-gray-700"
                title="Gradient End Color"
              />
            </div>
          ) : (
            <input
              type="color"
              value={selectedBgColor}
              onChange={(e) => setSelectedBgColor(e.target.value)}
              className="p-1 rounded h-8 w-16 bg-gray-700"
            />
          )}
        </div>

        <div className="space-y-1">
          <label className="block text-sm text-gray-300">Font Size</label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
              className="w-32"
              min="8"
              max="72"
            />
            <input
              type="number"
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
              className="p-2 rounded w-20 bg-gray-700 text-white"
              min="8"
              max="72"
            />
          </div>
        </div>

        <button
          onClick={handleAddText}
          className="bg-blue-600 px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors mt-auto ml-auto"
        >
          Add Text
        </button>
      </div>
    </div>
  );
};

export default TextEditor;
