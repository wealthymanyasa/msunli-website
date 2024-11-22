import { db } from "lib/db";
//getVerificationToken by token
export const getVerificationTokenByToken = async (token: string) => {
    try {
        const verificationToken = await db.verificationToken.findFirst({
            where: { token }
        });
        return verificationToken;
        
    } catch {
        return null;
    }
}
//getVerificationTokenByEmail
export const getVerificationTokenByEmail = async (email: string) => {
    try {
        const verificationToken = await db.verificationToken.findFirst({
            where: { email }
        });
        return verificationToken;
        
    } catch {
        return null;
    }
}