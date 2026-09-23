import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "./lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  providers: [Credentials({ credentials: { email: {}, password: {} }, async authorize(credentials) {
    const email = String(credentials.email ?? "").trim().toLowerCase(); const password = String(credentials.password ?? "");
    if (!email || !password) return null;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await compare(password, user.passwordHash))) return null;
    return { id: String(user.id), name: `${user.firstName} ${user.lastName}`, email: user.email, role: user.role };
  } })],
  pages: { signIn: "/login" },
  callbacks: {
    jwt({ token, user }) { if (user && "role" in user) token.role = user.role; return token; },
    session({ session, token }) { if (session.user) { session.user.id = String(token.sub); session.user.role = String(token.role ?? "CUSTOMER"); } return session; }
  }
});
