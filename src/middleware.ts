import { NextRequest, NextResponse } from "next/server";
export { default } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
	const token = await getToken({
		req: req,
		secret: process.env.NEXTAUTH_SECRET_KEY,
		raw: true,
	});

	const url = req.nextUrl;

	if (
		token &&
		(url.pathname.startsWith("/signin") ||
			url.pathname.startsWith("/signup") ||
			url.pathname.startsWith("/verify") ||
			url.pathname === "/")
	) {
		return NextResponse.redirect(new URL("/dashboard", req.url));
	}

	if (!token && url.pathname.startsWith("/dashboard")) {
		return NextResponse.redirect(new URL("/signin", req.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/", "/signup", "/signin", "/dashboard/:path*", "/verify/:path*"],
};
