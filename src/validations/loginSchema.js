import * as yup from 'yup';

export const loginSchema = yup.object().shape({
    email: yup.string().email().trim().required("Please enter your email"),
    password: yup.string().trim().required("Please enter your password")
});