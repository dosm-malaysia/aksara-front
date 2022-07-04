import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    /** Blocks GraphQL playground in production */
    if (request.nextUrl.pathname.startsWith("/graphql")) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
}

export const config = {
  matcher: "/graphql",
};
