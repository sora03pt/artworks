export type Artwork = {
  type: "artwork";
  id: string;
  title: string;
  image: string;
  width: number;
  height: number;
  year: string;
  medium: string;
  description: string;
};

export type HeadingPanel = {
  type: "heading";
  id: string;
  title: string;
  subtitle: string;
  description: string;
  backgroundColor: string;
  textColor: string;
  aspectRatio: number;
};

export type GalleryItem = Artwork | HeadingPanel;

export const galleryItems: GalleryItem[] = [
  {
    type: "heading",
    id: "drawings-heading",
    title: "DRAWINGS",
    subtitle: "01 / 顔と素描",
    description: "",
    backgroundColor: "#dfd2bd",
    textColor: "#302b25",
    aspectRatio: 3.1,
  },
  {
    type: "artwork",
    id: "portrait-2143",
    title: "人物像",
    image: "/artworks/2143.webp",
    width: 927,
    height: 1280,
    year: "未登録",
    medium: "未登録",
    description: "古い紙に描かれた人物の肖像。",
  },
  {
    type: "artwork",
    id: "hands-2144",
    title: "手の習作",
    image: "/artworks/2144.webp",
    width: 897,
    height: 1280,
    year: "未登録",
    medium: "未登録",
    description: "青い紙に描かれた手の素描。",
  },
  {
    type: "heading",
    id: "geometry-heading",
    title: "GEOMETRY",
    subtitle: "02 / 図形",
    description: "",
    backgroundColor: "#e4e8df",
    textColor: "#294137",
    aspectRatio: 3.1,
  },
  {
    type: "artwork",
    id: "composition-2142",
    title: "色と形 I",
    image: "/artworks/2142.webp",
    width: 1037,
    height: 1280,
    year: "未登録",
    medium: "未登録",
    description: "幾何学的な色と形を組み合わせた作品。",
  },
  {
    type: "artwork",
    id: "composition-2146",
    title: "色と形 II",
    image: "/artworks/2146.webp",
    width: 1057,
    height: 1280,
    year: "未登録",
    medium: "未登録",
    description: "三角形や円がリズミカルに並ぶ作品。",
  },
];

export const artworks = galleryItems.filter((item): item is Artwork => item.type === "artwork");
