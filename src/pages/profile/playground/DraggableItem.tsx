import Draggable from "react-draggable";
import { Resizable } from "re-resizable";
import { Item } from "./types";

interface DraggableItemProps {
  item: Item;
  index: number;
  fontSize: string;
  onPositionChange: (index: number, position: { x: number; y: number }) => void;
  onSizeChange: (
    index: number,
    size: { width: number; height: number }
  ) => void;
  onDelete: (index: number) => void;
  onEdit?: (index: number) => void;
}

export const DraggableItem = ({
  item,
  index,
  fontSize,
  onPositionChange,
  onSizeChange,
  onDelete,
  onEdit,
}: DraggableItemProps) => {
  const isGradient = item.backgroundColor?.includes("linear-gradient");

  return (
    <Draggable
      position={item.position}
      onStop={(_e, data) => {
        onPositionChange(index, { x: data.x, y: data.y });
      }}
      handle=".drag-handle"
    >
      <div className="absolute">
        <Resizable
          size={item.size}
          onResizeStop={(_e, _direction, _ref, d) => {
            onSizeChange(index, {
              width: item.size.width + d.width,
              height: item.size.height + d.height,
            });
          }}
          minWidth={100}
          minHeight={50}
          handleStyles={{
            bottomRight: {
              background: "#4A5568",
              borderRadius: "4px",
              width: "12px",
              height: "12px",
            },
          }}
          handleClasses={{
            bottomRight: "hover:bg-blue-500 transition-colors",
          }}
        >
          <div className="h-full relative group">
            {item.type === "text" ? (
              <div
                style={{
                  fontFamily: item.font,
                  color: item.color,
                  background: item.backgroundColor,
                  fontSize: `${fontSize}px`,
                }}
                className="p-3 rounded h-full drag-handle cursor-move"
                onClick={() => onEdit?.(index)}
              >
                {item.content}
              </div>
            ) : (
              <div
                style={{
                  background: isGradient
                    ? item.backgroundColor
                    : `${item.backgroundColor}`,
                }}
                className="p-3 rounded h-full flex flex-col drag-handle cursor-move"
              >
                <h3
                  className="font-bold text-white"
                  style={{ fontSize: `${fontSize}px` }}
                >
                  {item.metadata?.title}
                </h3>
                <p
                  className="text-sm text-gray-300 mt-1"
                  style={{ fontSize: `${parseInt(fontSize) * 0.875}px` }}
                >
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
                  className="text-blue-400 text-sm mt-2 break-all hover:text-blue-300 transition-colors"
                  style={{ fontSize: `${parseInt(fontSize) * 0.875}px` }}
                >
                  {item.content}
                </a>
              </div>
            )}
            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
              {item.type === "text" && (
                <button
                  onClick={() => onEdit?.(index)}
                  className="bg-blue-500 p-1 rounded hover:bg-blue-600 transition-colors"
                  title="Edit Text"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
              )}
              <button
                onClick={() => onDelete(index)}
                className="bg-red-500 p-1 rounded hover:bg-red-600 transition-colors"
                title="Delete"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        </Resizable>
      </div>
    </Draggable>
  );
};

export default DraggableItem;
