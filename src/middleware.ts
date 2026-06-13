import { withAuth } from "next-auth/middleware";

export default withAuth({
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    "/((?!api/auth|login|_next/static|_next/image|favicon.ico|icon.svg|icons/|manifest.webmanifest|sw.js).*)",
  ],
};
