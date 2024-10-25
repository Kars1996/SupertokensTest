import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SessionContainer } from "supertokens-node/recipe/session";
import { withSession } from "supertokens-node/nextjs";
import { ensureSuperTokensInit } from "@/config/backend";

ensureSuperTokensInit();

export async function middleware(
    request: NextRequest & { session?: SessionContainer }
) {
    if (request.headers.has("x-user-id")) {
        console.warn(
            "The FE tried to pass x-user-id, which is only supposed to be a backend internal header. Ignoring."
        );
        request.headers.delete("x-user-id");
    }

    if (request.nextUrl.pathname.startsWith("/api/auth")) {
        return NextResponse.next();
    }

    return withSession(request, async (err, session) => {
        if (err) {
            return NextResponse.json(err, { status: 500 });
        }

        const currentUser = session?.getUserId();

        // Redirect if user is already logged in
        if (currentUser && request.nextUrl.pathname.startsWith("/auth")) {
            return NextResponse.redirect(new URL("/dash", request.url));
        }

        // Redirect to login if user is not logged in and trying to access /dash
        if (!currentUser && request.nextUrl.pathname.startsWith("/dash")) {
            return NextResponse.redirect(
                new URL(
                    `/auth?redirect=${encodeURIComponent(
                        request.nextUrl.pathname
                    )}`,
                    request.url
                )
            );
        }

        // Pass session user ID as a header
        return NextResponse.next({
            headers: currentUser ? { "x-user-id": currentUser } : {},
        });
    });
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|.*\\.png$|favicon.ico).*)"],
};
