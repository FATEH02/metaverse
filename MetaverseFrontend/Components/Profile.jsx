import React, { useState, useEffect, useRef } from "react";
import ProfileDetail from "./ProfileDetail";
import gsap from "gsap";
import { jwtDecode } from "jwt-decode";

function Profile() {
  const [isOpen, setIsOpen] = useState(false);
  const profileRef = useRef(null);
  const [username, setusername] = useState();

  useEffect(() => {
    if (isOpen) {
      // Show & Slide In
      gsap.to(profileRef.current, {
        x: -100,
        opacity: 1,
        display: "block",
        duration: 0.5,
        ease: "power3.out",
      });
    } else {
      // Slide Out & Hide
      gsap.to(profileRef.current, {
        x: 150,
        opacity: 0,
        duration: 0.5,
        ease: "power3.in",
        onComplete: () => {
          profileRef.current.style.display = "none"; // Hide after animation
        },
      });
    }

    const token = localStorage.getItem("token");
    const details = jwtDecode(token);
    const username = details.username.split("@")[0];
    setusername(username);
  }, [isOpen]);

  return (
    <div className="relative">
      {/* Profile Button */}
      <div
        className="flex items-center justify-center gap-2 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <img
          src="/public/image.png"
          className="w-10 rounded-xl"
          alt="Profile"
        />
        <h3>{username}</h3>
      </div>

      {/* Profile Detail (Initially Hidden) */}
      <div className="absolute top-30 left-[100px] text-xl font-bold">
        <div
          ref={profileRef}
          className="transform  shadow-lg rounded-lg "
          style={{
            transform: "translateX(150px)",
            opacity: 0,
            display: "none", // Initially hidden
          }}
        >
          <ProfileDetail />
          {/* Close Button */}
        </div>
      </div>
    </div>
  );
}

export default Profile;
