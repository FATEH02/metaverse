import { Navigate } from "react-router-dom";


const AuthRedirected = ({element})=>{

    const token = localStorage.getItem("token")

    return token?<Navigate to ="/space" replace/> : element;
}

export default AuthRedirected