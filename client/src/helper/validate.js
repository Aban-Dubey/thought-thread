import toast from "react-hot-toast";
import { authenticate } from "./helper.js";

//validate login page username
export async function usernameValidate(values) {
    const errors = usernameVerify({}, values);

    if(values.username){
        //check the user existence in the db
        try {
            const { status } = await authenticate(values.username);
        
            if(status !== 200) {
                errors.exist = toast.error("User does not exist!");
            } 
        } catch (error) {
            // console.log("Cannot validate username at login page!");
            errors.exist = toast.error("User does not exist!");
        }
       
    }

    return errors;
}

//Validate login page password
export async function passwordValidate(values) {
    const errors = passwordVerify({}, values);

    return errors;
}

//Validate reset passwords
export async function resetPasswordValidate(values) {
    const errors = passwordVerify({}, values);
    if(values.password!==values.confirm_pwd){
        errors.exist = toast.error("Password does not match!");
    }

    return errors;
}

//Validate register form
export async function registerFormValidate(values) {
    const errors = usernameVerify({}, values);
    passwordVerify(errors, values);
    emailVerify(errors, values);

    return errors;
}

//Validate profile
export async function profileValidate(values) {
    const errors = emailVerify({}, values);

    return errors;
}

//**************************************************************************************************************** */

//Verify username
function usernameVerify(error={}, values) {
    if(!values.username){
        error.username = toast.error('Username Required!');
    }else if(values.username.includes(" ")){
        error.username = toast.error("Invalid Username!");
    }

    return error;
}

//Verify Password
function passwordVerify(error={}, values) {
    const specialChars = /[-!$%^&*()_+|~=`{}[\]:/;<>?,.@#]/;
    if(!values.password){
        error.password = toast.error('Password Required!');
    }else if(values.password.includes(" ")){
        error.password = toast.error("Invalid Password!");
    }else if(values.password.length<4){
        error.password = toast.error("Password cannot be of less than 4 characters");
    }else if(!specialChars.test(values.password)){
        error.password = toast.error("Password must contain a special character!");
    }

    return error;
}

//Verify Email
function emailVerify(error={}, values) {
    if(!values.email){
        error.email = toast.error('Email Required!');
    }else if(values.email.includes(" ")){
        error.email = toast.error("Invalid Email!");
    }else if(!/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/i.test(values.email)){
        error.email = toast.error("Invalid Email address format!");
    }

    return error;
}