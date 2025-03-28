import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");

  const navigation = useNavigate();

  const onLogin = async (e) => {
    e.preventDefault(); // Add the ()


    const userData = {
      username: email,
      password: password,
    };

    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/login",
        userData
      );
     console.log(response.status);
     
      if (response.status == 200) {
        const data = response.data;
        localStorage.setItem('token',data.token);
        navigation("/space");
      }

      setemail("");
      setpassword("");
    } catch (err) {
      console.log(err + "this is error");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-center h-screen bg-[#272E65]">
        <form
          onSubmit={(e) => {
            onLogin(e);
          }}
          action=""
          className="flex flex-col gap-6 bg-white p-10 rounded-2xl"
        >
          <input
            required
            value={email}
            onChange={(e) => {
              setemail(e.target.value);
            }}
            type="email"
            placeholder="enter email"
            className="border rounded p-3"
          />
          <input
            required
            value={password}
            onChange={(e) => {
              setpassword(e.target.value);
            }}
            type="text"
            placeholder="enter password"
            className="border rounded p-3"
          />
          <button className="bg-[#06D6A0]  p-3 rounded-xl">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
