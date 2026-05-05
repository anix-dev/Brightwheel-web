import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // Assuming you're using React Router
import { all_routes } from "../../../feature-module/router/all_routes";
import { Spinner } from "react-bootstrap";

const Loader = () => {
  const routes = all_routes
  const location = useLocation();
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
      

    if (location.pathname === routes.adminDashboard ) {
      setShowLoader(true);
      // Hide the loader after 2 seconds
      const timeoutId = setTimeout(() => {
        setShowLoader(false);
      }, 2000);

      return () => {
        clearTimeout(timeoutId); // Clear the timeout when component unmounts
      };
    }else {
      setShowLoader(false)
    }
  }, [location.pathname]);

  return (
    <>
      {showLoader && <Preloader />}
     
    </>
  );
};

const Preloader = () => {
  return (
     <div className="page-wrapper d-flex justify-content-center">
     <Spinner/>
    </div>
  );
};

export default Loader;
