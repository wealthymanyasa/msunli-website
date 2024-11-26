import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import authConfig from "@/auth.config"
import { db } from "lib/db"
import { getUserById } from "data/user"
import { UserRole } from "@prisma/client"

export const {
    auth, handlers, signIn, signOut
} = NextAuth({
    //nectauth pages
    pages: {
        signIn: '/signin',
        error: '/signup-error'
    },
    //next auth events
    events: {
        // link account event that populates the emailVerified field oin signup
        async linkAccount({ user }) {
            await db.user.update({
                where: { id: user.id },
                data: { emailVerified: new Date() }
            })
        }
    },
    //next auth callbacks
    callbacks: {
        //sign in callback
        async signIn({ user, account }) {
            // allow OAuth witout amail verification
            if (account?.provider !== "credentials") return true;
            //get existing user
            const existingUser = await getUserById(user.id);
            //prevent sign in without email verification
            if (!existingUser.emailVerified) { return false; }

            //TODO: Add 2FA check


            //finally  return true
            return true;
        },

        //session callback
        async session({ token, session }) {
            console.log({
                sessionToken: token,
                session
            })
            //set seesion user id to the token sub thus dependable
            if (token.sub && session.user) {
                session.user.id = token.sub;
            }
            //set user role to the custom value thus extend the role
            if (token.role && session.user) {
                session.user.role = token.role as UserRole;
            }
            //finally return session
            return session;
        },
        //extract token
        async jwt({ token }) {
            //return token if token sub or id is null
            if (!token.sub) return token;
            //get existing user
            const existingUser = await getUserById(token.sub);
            ///return user if there is no existing user
            if (!existingUser) return token;
            //assign token role to the existing user
            token.role = existingUser.role;
            //finally return token
            return token;
        }
    },

    adapter: PrismaAdapter(db),
    session: { strategy: "jwt" },
    ...authConfig
})