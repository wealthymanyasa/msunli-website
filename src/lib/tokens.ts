import { getVerificationTokenByEmail } from "data/verification-token";
import { v4 as uuidv4 } from "uuid"
import { db } from "lib/db";


/**
 * All kinds of tokens to be generated
*/
export const generateVerificationToken = async (email: string) => {
    //ensure uniqui token
    const token = uuidv4();
    //set expires 
    const expires = new Date(new Date().getTime() + 3600 * 1000);

    const existingToken = await getVerificationTokenByEmail(email);
    //check db for verification token and delete
    if (existingToken) {
        await db.verificationToken.delete({
            where: {
                id: existingToken.id
            }
        });
    }

    // generate new verificationToken
    const verificationToken = await db.verificationToken.create({
        data: {
            email,
            token,
            expires
        }
    });

    return verificationToken;

};