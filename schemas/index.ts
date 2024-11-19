import * as zod from "zod";

//exporting login schema
export const LoginSchema = zod.object({
    email: zod.string().email( {
        message: "Email is required"
    }),
    password: zod.string().min(1, {
        message: "Password is required"
    })
});

//exporting register schema
export const RegisterSchema = zod.object({
    email: zod.string().email( {
        message: "Email is required"
    }),
    password: zod.string().min(6, {
        message: "Minimum 6 characters required"
    }),
    name: zod.string().min(1, {
        message: "Name is required"
    })
});