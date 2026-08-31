import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

const tiles = [
  "#ff2d95",
  "#2de2ff",
  "#ffd84d",
  "#2de2ff",
  "#c6ff4d",
  "#ff2d95",
  "#ffd84d",
  "#ff2d95",
  "#2de2ff",
];

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#100d18",
          display: "flex",
          flexWrap: "wrap",
          padding: 3,
          gap: 2,
        }}
      >
        {tiles.map((color, index) => (
          <div
            key={index}
            style={{
              width: 8,
              height: 8,
              background: color,
            }}
          />
        ))}
      </div>
    ),
    { ...size },
  );
}
