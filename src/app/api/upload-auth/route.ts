import { NextResponse } from "next/server";
import { getImageKitAuthParameters } from "@/lib/imagekit/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    const authenticationParameters = getImageKitAuthParameters();
    return NextResponse.json(authenticationParameters);
  } catch (error) {
    console.error("[upload-auth] Failed to generate auth parameters:", error);
    return NextResponse.json(
      { error: "Failed to generate ImageKit authentication parameters" },
      { status: 500 }
    );
  }
}
