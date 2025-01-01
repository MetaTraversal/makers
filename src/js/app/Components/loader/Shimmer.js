import React from "react";
import ShimmerImg from "./../../assets/images/ShimmerImg.jpeg";

export const Shimmer = () => {
  return (
    <>
      <div className="img-container">
        <img src={ShimmerImg} className="img-shimmer" alt="Shimmer Image" />
      </div>
    </>
  );
};
