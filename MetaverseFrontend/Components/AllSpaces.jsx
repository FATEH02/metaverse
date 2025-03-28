import axios from "axios";
import React, { useEffect, useState, useRef } from "react";

function AllSpaces() {
  const [maps, setmaps] = useState([]);
  const [mapname, setmapname] = useState("");
  const [isopen, setisopen] = useState(false);
  const modalRef = useRef(null);

  // Function to get token dynamically
  const getAuthToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  useEffect(() => {
    console.log("isopen:", isopen);

    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setisopen(false);
      }
    }

    if (isopen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isopen]);

  // API Call for Creating a New Space
  const createSpace = async (mapData) => {
    try {
      const token = getAuthToken();
      if (!token) {
        console.error("No auth token found!");
        return;
      }

      const response = await axios.post(
        "http://localhost:4000/api/v1/space/",
        mapData,
        {
          headers: {
            Authorization: `Bearer ${token.trim()}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error creating space:", error);
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    const mapData = {
      name: mapname,
      dimensions: "400x500",
      mapId: "cm8leby1r0000u12xnsv2fyp2",
    };

    await createSpace(mapData);

    console.log("Map Data Sent:", mapData);
    setmapname("");
    setisopen(false);

    window.location.reload(); // Refresh the page after submission
  };

  return (
    <div>
      {/* First Component (Clickable) */}
      <div
        className="fixed inset-0 flex justify-center items-center bg-black/50"
        onClick={() => setisopen(true)}
      >
        <div className="bg-[#333A64] w-[400px] p-5 shadow-lg rounded-lg">
          <div className="max-h-[300px] overflow-y-auto space-y-4">
            {/* List Items */}
            <div className="flex border bg-[#545C8F] rounded p-3 gap-3 cursor-pointer">
              <img
                src="/public/map.png"
                alt=""
                className="w-20 h-20 object-cover"
              />
              <p>Click here to open the input box.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Second Component (Input Form) */}
      {isopen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/50">
          <div
            ref={modalRef}
            className="bg-[#333A64] w-[400px] p-5 shadow-lg rounded-lg"
          >
            <div className="flex border bg-[#545C8F] rounded p-3 gap-3">
              <form onSubmit={onSubmitHandler}>
                <input
                  required
                  type="text"
                  placeholder="Enter Map Name"
                  value={mapname}
                  onChange={(e) => setmapname(e.target.value)}
                  className="p-2 rounded"
                />
                <button
                  type="submit"
                  className="border rounded p-2 bg-[#51E2BD]"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AllSpaces;
