import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/store";

//To allow access to the /profile route only when the user has valid token
export const AuthorizeUser  = ({ children })=>{
    const token = localStorage.getItem('token');

    if(!token){
        return <Navigate to={'/'}></Navigate>
    }

    return children;
}

//To allow access to the /password route only when the user has a valid username
export const ProtectRoute = ({children})=>{
    const username = useAuthStore.getState().auth.username;
    if(!username) {
        return <Navigate to={'/'}></Navigate>
    }
    return children;
}