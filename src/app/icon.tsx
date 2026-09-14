import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 18,
          background: "#09090b",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#f59e0b",
          fontWeight: 700,
          borderRadius: 8,
          border: "1px solid rgba(245, 158, 11, 0.4)",
          letterSpacing: "-0.05em",
        }}
      >
        AH
      </div>
    ),
    {
      ...size,
    }
  );
}
