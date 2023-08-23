import * as yup from "yup";

export const SignInSchema = yup.object({
    email: yup.string().email("Please enter valid email").required("Please Enter Your Email"),
    password: yup.string().min(8).required("Password is Required"),
});