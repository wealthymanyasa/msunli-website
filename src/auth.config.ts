
import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { LoginSchema } from "schemas"
import { getUserByEmail } from "data/user"
import bcrypt from "bcryptjs";

export default {
  providers: [
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