import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

axios.defaults.baseURL = "https://thought-thread-server.vercel.app/";

//Make API requests

//Authentication function
export async function authenticate(username){
    try {
        return axios.post('/api/authenticate', { username });
    } catch (error) {
        return { error: "Username does not exist!"}
    }
};

//Get user details
export async function getUser({username}) {
    try {
        const { data } = await axios.get(`/api/user/${username}`);
        return {data};
    } catch (error) {
        return {error: "Password does not match!"};
    }
};

// Register user
export async function registerUser(credentials) {
    try {
      const response = await axios.post(`/api/register`, credentials);
      const { data: { msg }, status } = response;
      let { username, email } = credentials;
  
      // Send email
      if (status === 201) {
        await axios.post('/api/registerMail', { username, userEmail: email, text: msg });
      }
  
      return Promise.resolve(msg);
    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data.error === 'Duplicate field value entered') {
        // Handle duplicate key error
        return Promise.reject({ error: 'Username or email is already in use. Please choose a different one.' });
      } else {
        // Handle other errors
        return Promise.reject({ error: 'An error occurred during registration. Please try again later.' });
      }
    }
  }
  

//login function
export async function verifyPassword({username, password}){
    try {
        if(username){
            const { data } = await axios.post('/api/login', { username, password });
            return Promise.resolve({data});
        }
    } catch (error) {
        return Promise.reject({error: "Password does not match!"});
    }
};

//update function
export async function updateUser(response){
    try {
        const token = await localStorage.getItem('token');
        const data = await axios.put('/api/updateUser', response, { headers: { "Authorization": `Bearer ${token}`}});
        console.log('data updated successfully!');
        return Promise.resolve({data});
    } catch (error) {
        return Promise.reject({ error: "Could not update profile!"});
    }
};

//Generate OTP
export async function generateOTP(username) {
    try {
        const {data: {code}, status} = await axios.get('/api/generateOTP', { params: { username }});

        //send mail with the OTP
        if(status === 201){
            let {data: {email}} = await getUser({username});
            let text = `Your password recovery OTP is ${code}. Verify and recover your password.`;
            await axios.post('/api/registerMail', { username, userEmail: email, text, subject: "Password Recovery"});
        }
        return Promise.resolve(code);
    } catch (error) {
        return Promise.reject({error : "Cannot generate OTP"});
    }
}

//Verify OTP
export async function verifyOTP({ username, code }){
    try {
        const { data, status } = await axios.get('/api/verifyOTP', {params: { username, code }});
        return { data, status };
    } catch (error) {
        return Promise.reject({error: "Cannot verify OTP!"});
    }
}

//Reset Password
export async function resetPassword({ username, password }){
    try {
        const { data, status } = await axios.put('/api/resetPassword', { username, password });
        return Promise.resolve({ data, status });
    } catch (error) {
        return Promise.reject({error: "Cannot reset password!"});
    }
};

//Get username from token
export async function getUsername(){
    const token = localStorage.getItem('token');
    if(!token) return Promise.reject("Cannot find Token");
    let decode = jwtDecode(token);
    
    return(decode);
}

