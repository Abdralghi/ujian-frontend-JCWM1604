import React from "react";
import Loader from "react-loader-spinner";

function Loading() {
  return (
    <div
      style={{ height: "90vh" }}
      className="d-flex justify-content-center align-items-center"
    >
      <Loader type="Oval" color="black" />
    </div>
  );
}

export default Loading;
