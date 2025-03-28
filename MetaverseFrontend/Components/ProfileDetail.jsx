import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

function ProfileDetail() {
  const [email, setemail] = useState();
  const [username, setusername] = useState();

  useEffect(() => {
    const token = localStorage.getItem("token");

    const details = jwtDecode(token);

    console.log(details);

    const username = details.username.split("@")[0];
    const email = details.username;

    setemail(email);
    setusername(username);
  }, []);

  return (
    <div className="bg-[#333A64] h-150 w-100 flex flex-wrap flex-col   rounded-2xl ">
      <div className="p-6 flex flex-col gap-5 ">
        <div>
          <img src="/public/image.png" alt="" className="w-20" />
        </div>
        <h3>{username}</h3>
        <h3>{email}</h3>
        <h3>lasted Joined: 12</h3>
        <h3>total played: 12</h3>
      </div>

      <div className="px-6">
        <button
          className="bg-amber-200 rounded-xl  p-3"
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/";
          }}
        >
          LogOut
        </button>
      </div>
    </div>
  );
}

export default ProfileDetail;
