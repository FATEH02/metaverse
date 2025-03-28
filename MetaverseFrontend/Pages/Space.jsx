import React from "react";
import Navigation from "../Components/spacxe/Naigation";
import "remixicon/fonts/remixicon.css";
import SpaceCard from "../Components/SpaceCard";



function Space() {
  return (
    <div className="bg-[#282D4E] h-screen">

      <Navigation />
      <div className="p-10">
      <SpaceCard/>

      </div>
    </div>
  );
}

export default Space;
