import { ImageResponse } from "next/og";

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

export function generatePixelMark(size: number) {
  const pad = Math.round(size * 0.1);
  const gap = Math.max(2, Math.round(size * 0.05));
  const inner = size - pad * 2;
  const tile = Math.floor((inner - gap * 2) / 3);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#100d18",
          display: "flex",
          flexWrap: "wrap",
          alignContent: "center",
          justifyContent: "center",
          padding: pad,
          gap,
        }}
      >
        {tiles.map((color, index) => (
          <div
            key={index}
            style={{
              width: tile,
              height: tile,
              background: color,
            }}
          />
        ))}
      </div>
    ),
    { width: size, height: size },
  );
}
