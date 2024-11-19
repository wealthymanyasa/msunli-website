"use server";

import { RegisterSchema } from "schemas";
import * as zod from "zod";
import bcrypt from "bcrypt";
import { db } from "lib/db";
import { getUserByEmail } from "data/user";

export const register = async (values: zod.infer<typeof RegisterSchema>) => {
   const validatedFields = RegisterSchema.safeParse(values);

   if (!validatedFields.success) {
      return { error: "Invalid Fields" };
   }
   //get actual values 
   const { email, password, name } = validatedFields.data;
   const hashedPassword = await bcrypt.hash(password, 10);

   //check if user already exist
   const existingUser = await getUserByEmail(email);
   //create user
   await db.user.create({
      data: {
         name,
         email,
         password: hashedPassword
      }
   });

   //TODO SEND verification token email

   //return success message
   return { success: "User Created" }
};