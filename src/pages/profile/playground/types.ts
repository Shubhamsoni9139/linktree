export interface Item {
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
  
  export interface UserData {
    items: Item[];
  }
  
  export interface OGData {
    title: string;
    description: string;
    image: string;
  }
  