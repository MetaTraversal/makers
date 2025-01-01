import React from "react";

import "@styles/style.scss";

export const AppLoader = () => {
  return (
    <div className="appLoader">
      <div className="loaderCircle"></div>
       <span className="loaderText">Loading...</span>
    </div>
  );
};

