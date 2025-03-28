import React, { useEffect, useRef, useState } from "react";
import Profile from "../Profile";
import AllSpaces from "../AllSpaces";
import gsap from "gsap";
import { Navigate, useNavigate } from "react-router-dom";

function Navigation() {
  const [allspaces, setAllSpaces] = useState(false);
  const [showJoinSpace, setShowJoinSpace] = useState(false);
  const [spaceid, setSpaceId] = useState("");
  const spaceRef = useRef(null);
  const joinSpaceRef = useRef(null);
  const navigate = useNavigate()

  useEffect(() => {
    if (allspaces) {
      gsap.to(spaceRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: "power3.out",
        display: "block",
      });
    } else {
      gsap.to(spaceRef.current, {
        opacity: 0,
        scale: 0.8,
        duration: 0.5,
        ease: "power3.in",
        onComplete: () => {
          if (spaceRef.current) spaceRef.current.style.display = "none";
        },
      });
    }
  }, [allspaces]);

  useEffect(() => {
    if (showJoinSpace) {
      gsap.to(joinSpaceRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: "power3.out",
        display: "block",
      });
    } else {
      gsap.to(joinSpaceRef.current, {
        opacity: 0,
        scale: 0.8,
        duration: 0.5,
        ease: "power3.in",
        onComplete: () => {
          if (joinSpaceRef.current) joinSpaceRef.current.style.display = "none";
        },
      });
    }
  }, [showJoinSpace]);

  const handleJoinSpace = () => {
    console.log("Joined space ID:", spaceid);
    localStorage.setItem("spaceid", spaceid); // Store spaceid
    navigate("/game")
    setShowJoinSpace(false); // Close the input box after saving
  };
  

  return (
    <div>
      <div className="bg-[#333A64] flex gap-10 h-15 items-center justify-between">
        <div className="flex gap-4 m-5">
          <h3 className="text-white">
            <i className="ri-meta-fill text-4xl pl-3"></i>
          </h3>
          <button className="p-2 rounded text-white bg-[#282D4E] font-bold">
            <i className="ri-bard-fill pr-2"></i>
            My Space
          </button>
        </div>

        <div className="flex gap-4 mx-7">
          <Profile />

          {/* Create Space Button */}
          <button
            onClick={() => setAllSpaces(true)}
            className="bg-[#51E2BD] rounded-xl px-4 py-2 text-white font-bold"
          >
            <i className="ri-add-line"></i> Create Space
          </button>

          {/* Join Space Button */}
          <button
            onClick={() => setShowJoinSpace(true)}
            className="bg-[#51E2BD] rounded-xl px-4 py-2 text-white font-bold"
          >
            <i className="ri-add-line"></i> Join Space
          </button>
        </div>
      </div>

      {/* AllSpaces Popup */}
      <div
        ref={spaceRef}
        className="fixed inset-0 flex justify-center items-center bg-black/50 opacity-0 scale-0 "
      >
        <AllSpaces />
        <button
          onClick={() => setAllSpaces(false)}
          className="absolute top-5 right-5 text-white text-2xl"
        >
          ✖
        </button>
      </div>

      {/* Join Space Input Popup */}
      <div
        ref={joinSpaceRef}
        className="fixed inset-0 flex justify-center items-center bg-black/50 opacity-0 scale-0"
      >
        <div className="bg-white p-5 rounded-lg shadow-lg">
          <h2 className="text-lg font-bold mb-2">Enter Space ID:</h2>
          <input
            type="text"
            value={spaceid}
            onChange={(e) => setSpaceId(e.target.value)}
            className="border p-2 rounded w-full"
            placeholder="Enter space ID"
          />
          <div className="flex justify-end gap-2 mt-3">
            <button
              onClick={handleJoinSpace}
              className="bg-[#51E2BD] px-4 py-2 rounded text-white font-bold"
            >
              Join
            </button>
            <button
              onClick={() => setShowJoinSpace(false)}
              className="bg-gray-400 px-4 py-2 rounded text-white font-bold"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navigation;
