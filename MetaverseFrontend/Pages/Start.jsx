import React from "react";
import { Link } from "react-router-dom";

function Start() {
  return (
    <div className="flex  items-center justify-center h-screen bg-[#272E65]">
      <div className="flex flex-col gap-10">
        <div>
          <h3 className="text-white font-bold text-2xl">WelCome To Metaverse</h3>
          <p className="text-white mt-2">
            Lets SocialLize Noe need to go out size only OScial lize
          </p>
        </div>

        <div className="flex gap-3 flex-col justify-center items-center ">
          <Link
            to={"/register"}
            className="bg-white text-black px-40 py-2 rounded-lg  hover:bg-gray-800 transition"
          >
            Signup
          </Link>

          <Link
            to={"/login"}
            className="bg-white text-black px-40 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Start;
