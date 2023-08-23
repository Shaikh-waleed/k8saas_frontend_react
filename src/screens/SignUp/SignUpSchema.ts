import * as yup from "yup";

export const SignUpSchema = yup.object({
    fullName: yup.string().min(3).max(20).required("Please Enter your Name"),
    email: yup.string().email().required("Please Enter Your Email"),
    password: yup.string().min(8).required("Password is Required"),
    confirmPass: yup.string().required("Please Re-Enter Your Password").oneOf([yup.ref("password"), null], "Password Must Match"),
});
