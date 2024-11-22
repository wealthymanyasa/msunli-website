
import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { LoginSchema } from "schemas"
import { getUserByEmail } from "data/user"
import bcrypt from "bcryptjs";
import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github";

export default {
  providers: [
    Github({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,

    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),


    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          //destructure email and password form validated fields
          const { email, password } = validatedFields.data;
          //get user by e,ail
          const user = await getUserByEmail(email);
          //check if not buser and user has no password
          if (!user || !user.password) return null;
          // check if the passwords match
          const passwordMatch = await bcrypt.compare(
            password,
            user.password
          );
          //if passwords match return the user
          if (passwordMatch) return user;

        }
        return null;
      }
    })
  ]
} satisfies NextAuthConfig