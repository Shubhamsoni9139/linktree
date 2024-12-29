import { useState } from "react";
import { Item } from "./types";

interface TextEditorProps {
  onAddItem: (item: Item) => Promise<void>;
}

export const TextEditor = ({ onAddItem }: TextEditorProps) => {
  const [newText, setNewText] = useState("");
  const [selectedFont, setSelectedFont] = useState("Arial");
  const [selectedColor, setSelectedColor] = useState("#FFFFFF");
  const [selectedBgColor, setSelectedBgColor] = useState(
    "rgba(167, 139, 250, 0.1)"
  );
  const [fontSize, setFontSize] = useState("16");
  const [gradientStart, setGradientStart] = useState("#A78BFA");
  const [gradientEnd, setGradientEnd] = useState("#8B5CF6");
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
    <div className="p-6 rounded-2xl space-y-4 bg-white shadow-lg">
      <div className="flex flex-wrap gap-4 items-center">
        <div className="relative flex-grow">
          {editingText ? (
            <textarea
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              className="p-3 rounded-xl w-full border border-purple-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
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
              className="p-3 rounded-xl cursor-text min-h-[48px] border border-purple-200"
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
          className="p-3 rounded-xl bg-white border border-purple-200 text-purple-800 hover:border-purple-400 transition-colors"
        >
          {fonts.map((font) => (
            <option key={font} value={font}>
              {font}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap gap-6 items-start">
        <div className="space-y-2">
          <label className="block text-sm text-purple-700">Text Color</label>
          <input
            type="color"
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            className="p-1 rounded-lg h-10 w-20 border border-purple-200 bg-white cursor-pointer"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <label className="block text-sm text-purple-700">Background</label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={useGradient}
                onChange={(e) => setUseGradient(e.target.checked)}
                className="form-checkbox h-4 w-4 text-purple-600 rounded border-purple-300"
              />
              <span className="ml-2 text-sm text-purple-600">Use Gradient</span>
            </label>
          </div>
          {useGradient ? (
            <div className="flex gap-2">
              <input
                type="color"
                value={gradientStart}
                onChange={(e) => setGradientStart(e.target.value)}
                className="p-1 rounded-lg h-10 w-20 border border-purple-200 bg-white cursor-pointer"
                title="Gradient Start Color"
              />
              <input
                type="color"
                value={gradientEnd}
                onChange={(e) => setGradientEnd(e.target.value)}
                className="p-1 rounded-lg h-10 w-20 border border-purple-200 bg-white cursor-pointer"
                title="Gradient End Color"
              />
            </div>
          ) : (
            <input
              type="color"
              value={selectedBgColor}
              onChange={(e) => setSelectedBgColor(e.target.value)}
              className="p-1 rounded-lg h-10 w-20 border border-purple-200 bg-white cursor-pointer"
            />
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm text-purple-700">Font Size</label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
              className="w-32 accent-purple-600"
              min="8"
              max="72"
            />
            <input
              type="number"
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
              className="p-2 rounded-xl w-20 border border-purple-200 text-purple-800"
              min="8"
              max="72"
            />
          </div>
        </div>

        <button
          onClick={handleAddText}
          className="bg-purple-600 px-8 py-3 rounded-xl text-white hover:bg-purple-700 transition-colors mt-auto ml-auto"
        >
          Add Text
        </button>
      </div>
    </div>
  );
};

export default TextEditor;
