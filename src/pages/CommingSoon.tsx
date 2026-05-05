import React from "react";
import { Link } from "react-router-dom";

const CommingSoon = () => {
  return (
    <div
      className=" home-page d-flex flex-column justify-content-center align-items-center w-100"
      style={{ height: "100vh" }}
    >
      <h2 style={{ color: "#fff" }}>Page comming soon</h2>
      <br />
      <div>
        <Link to="/" className="text-success">
          <i className="fas fa-chevron-left"></i>
          <i className="fas fa-chevron-left"></i>
          Go back
        </Link>
      </div>
    </div>
  );
};

export default CommingSoon;
