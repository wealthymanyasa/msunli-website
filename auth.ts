import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import authConfig from "auth.config"
import { db } from "lib/db"
import { getUserById } from "data/user"

export const {
    auth, handlers, signIn, signOut
} = NextAuth({
    callbacks: {
        async session({ token, session }) {
            console.log({
                sessionToken: token,
                session
            })
            //set seesion user id to the token sub thus dependable
            if (token.sub && session.user) {
                session.user.id = token.sub;
            }
            return session;
        },
        //extract token
        async jwt({ token }) {
            //get existing user
            const existingUser = await getUserById(token.sub);
            ///return user if there is no existing user
            if (!existingUser) return token;
            //assign token role to the existing user
            token.role = existingUser.role;

            return token;
        }
    },
    adapter: PrismaAdapter(db),
    session: { strategy: "jwt" },
    ...authConfig
})