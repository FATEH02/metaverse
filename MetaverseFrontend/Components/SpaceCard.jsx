import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function SpaceCard() {
  const [spaces, setSpaces] = useState([]);

  // Function to get token from localStorage or sessionStorage
  const getAuthToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          console.error("No auth token found!");
          return;
        }

        const response = await axios.get(
          "http://localhost:4000/api/v1/space/all",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Use token dynamically
            },
          }
        );

        setSpaces(response.data.spaces); // Store response data in state
      } catch (error) {
        console.error("Error fetching spaces:", error);
      }
    };

    fetchSpaces();
  }, []);

  const deleteSpace = async (id) => {
    try {
      const token = getAuthToken();
      if (!token) {
        console.error("No auth token found!");
        return;
      }

      await axios.delete(`http://localhost:4000/api/v1/space/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Use token dynamically
        },
      });

      console.log("Space Deleted:", id);
      setSpaces((prevSpaces) => prevSpaces.filter((space) => space.id !== id)); // Remove the deleted space from UI
    } catch (error) {
      console.error("Error deleting space:", error);
    }
  };

  const copyToClipboard = (id) => {
    navigator.clipboard.writeText(id);
    alert("Space ID copied: " + id);
  };

  return (
    <div className="flex flex-wrap gap-7 ">
      {spaces.map((space) => (
        <div key={space.id} className="w-70 bg-[#282D4E] p-3 rounded-lg">
          {/* Space ID Display with Copy Button */}
          <div className="flex justify-between items-center bg-[#333A64] text-white px-3 py-1 rounded-t-lg">
            <span className="text-sm font-bold">{space.id}</span>
            <i 
              onClick={() => copyToClipboard(space.id)}
              className="ri-file-copy-line cursor-pointer text-lg"
              title="Copy Space ID"
            ></i>
          </div>

          {/* Space Image & Link */}
          <Link to={"/game"}>
            <img src="/public/map.png" className="rounded mt-2" alt="Space Map" />
          </Link>

          {/* Space Name & Delete Button */}
          <div className="flex justify-between px-2 mt-2">
            <h3 className="text-white">{space.name}</h3>
            <i
              onClick={() => deleteSpace(space.id)}
              className="ri-delete-bin-6-line cursor-pointer text-red-500"
              title="Delete Space"
            ></i>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SpaceCard;
