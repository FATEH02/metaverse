import React, { useState } from "react";
import { Link,Navigate,useNavigate } from "react-router-dom";
import axios from "axios"



function Register() {
  // const [username, setusername] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");

  const navigate = useNavigate()


  const submithandler = async (e)=>{
   e.preventDefault();

   const newUser = {
        username:email,
        password:password
   }

   try {

    console.log(newUser);
    

    const response = await axios.post(
      "http://localhost:4000/api/v1/signup",
     newUser
    )
     console.log(response.status);
     
     if(response.status==200)
     {
      const data = response.data;
      localStorage.setItem('token',data.token)
      navigate("/space")
     }
    //  setusername("");
     setemail("");
     setpassword("");

   }catch(err)
   {
     console.log(err+"regiseration is not sucessfull");
     
   }
  }

  return (
    <div className="flex items-center justify-center gap-10 h-screen bg-[#272E65]">

      <div className="bg-white p-10 rounded-xl">
  
       <div>
        <h3 className="font-bold mb-3">Signup To Get This </h3>

       </div>
        
        <form
        onSubmit={(e)=>{
          submithandler(e)
        }}
          action=""
          className="flex flex-col items-center justify-center gap-10"
        >
          {/* <input
            required
            value={username}
            onChange={(e) => {
              setusername(e.target.value);
            }}
            type="text"
            placeholder="Enter Your name"
            className="border-2 rounded px-5 py-2"
            
          /> */}
          <input
            required
            value={email}
            onChange={(e) => {
              setemail(e.target.value);
            }}
            type="email"
            placeholder="Enter Your email"
            className="border-2 px-5 py-2 rounded "
          />
          <input
            required
            value={password}
            onChange={(e) => {
              setpassword(e.target.value);
            }}
            type="password"
            placeholder="Enter Your password"
            className="border-2 px-5 py-2 rounded"
          />
          <button className="bg-[#5FE5C2] rounded p-2 px-25 ">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default Register;
