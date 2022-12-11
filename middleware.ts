import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  //   console.log(request.headers);
  // if (request.headers.authorization !== `Bearer ${process.env.REVALIDATE_TOKEN}`) {
  //     return res.status(401).json({ revalidated: false, message: "Invalid bearer token" });
  //   }
}

export const config = {
  matcher: "/api/:path*",
};
