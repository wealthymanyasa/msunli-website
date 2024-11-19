import { db } from "lib/db";

export const getUserByEmail = async (email: string) => {
  try {
    //get user
    const user = await db.user.findUnique({ where: { email } });
    return user;

  } catch {
    return null;
  }
}

export const getUserById = async (id: string) => {
  try {
    //get user
    const user = await db.user.findUnique({ where: { id } });
    return user;

  } catch {
    return null;
  }
}