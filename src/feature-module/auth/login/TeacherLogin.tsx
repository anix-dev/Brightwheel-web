import React, { useState } from "react";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import { Link } from "react-router-dom";
import { all_routes } from "../../router/all_routes";
import { useNavigate } from "react-router-dom";
import { setUser } from "../../../core/data/redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import api from "../../../core/data/api";
import "./login.css";
import { toast } from "react-toastify";

const TeacherLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const routes = all_routes;
  const { isAuthenticated } = useSelector((state: any) => state.user);
  const [loading, setLoading] = useState(false);
  const [ispasswordVisible, setpasswordVisible] = useState(false);
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  // State to store the switch value
  const [switch1Value, setSwitch1Value] = useState(0);

  const togglepasswordVisibility = () => {
    setpasswordVisible((prevState) => !prevState);
  };

  // Handle input changes
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs((prevInputs) => ({ ...prevInputs, [name]: value }));
  };
  const notify = (message: String) => {
    toast.error(message, {
      autoClose: 3000,
      style: {
        alignItems: "center",
        backgroundColor: "#BEBEBE",
        color: "#ffffff",
        fontSize: "16px", // Larger font size
        borderRadius: "8px", // Rounded corners
        padding: "12px", // Padding inside the toast
        textAlign: "center", // Center-align text
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Subtle shadow
      },
    });
  };

  // Login user and handle conditional navigation
  const loginUser = async (inputs: any) => {
    try {
      setLoading(true);
      const res = await api.post("/api/user/teacher-login", inputs);
        if (res.data.success) {
         dispatch(setUser({ user: res.data.user, token: res.data.token }));
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("Role","3");
          localStorage.setItem("user", res.data.user.TeacherID);
          localStorage.setItem("userData", JSON.stringify(res.data.user));

          setLoading(false);
          navigate(all_routes.adminDashboard);
        
      } else {
        notify("You are not eligible to  access this account");
      }
    } catch (error) {
      setLoading(false);
      toast.error("Invalid credentials. Please check your email and password.");
      navigate(all_routes.teacherLogin);
    }
  };

  const validateInputs = () => {
    const newErrors: any = {};

    // email/Email validation
    if (!inputs.email) {
      newErrors.email = " Email is required.";
    }

    // password validation
    if (!inputs.password) {
      newErrors.password = "password is required.";
    } else if (inputs.password.length < 6) {
      newErrors.password = "password must be at least 6 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateInputs()) {
      loginUser(inputs);
    }
  };

  const getCurrentYear = () => {
    return new Date().getFullYear();
  };

  return (
    <div className="container-fuild">
      <div className="w-100 overflow-hidden position-relative flex-wrap d-block vh-100">
        <div className="row">
          <div className="col-lg-6">
            <div className="login-background d-lg-flex align-items-center justify-content-center d-lg-block d-none flex-wrap vh-100 overflow-auto">
              <div></div>
              <div className="authen-overlay-item w-100 p-4">
                <ImageWithBasePath
                  src="/assets/images/logo3.png"
                  alt=""
                  className="rounded"
                />
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-md-12 col-sm-12">
            <div className="row justify-content-center align-items-center vh-100 overflow-auto flex-wrap">
              <div className="col-md-8 mx-auto p-4">
                <form onSubmit={handleSubmit}>
                  <div>
                    <div className="card">
                      <div className="card-body pb-3">
                        <div className="mb-4">
                          <h2 className="mb-2">Welcome</h2>
                          <p className="mb-0">
                            Please enter your details to sign in
                          </p>
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Email</label>
                          <div className="input-icon mb-3 position-relative">
                            <span className="input-icon-addon"></span>
                            <input
                              type="text"
                              className="form-control"
                              name="email"
                              value={inputs.email}
                              onChange={handleInput}
                            />
                            {errors.email && (
                              <span className="text-danger">
                                {errors.email}
                              </span>
                            )}
                          </div>
                          <label className="form-label">Password</label>
                          <div className="pass-group">
                            <input
                              type={ispasswordVisible ? "text" : "password"}
                              name="password"
                              value={inputs.password}
                              onChange={handleInput}
                              className="pass-input form-control"
                            />
                            <span
                              className={`ti toggle-password ${
                                ispasswordVisible ? "ti-eye" : "ti-eye-off"
                              }`}
                              onClick={togglepasswordVisibility}
                            />
                          </div>
                          {errors.password && (
                            <span className="text-danger">
                              {errors.password}
                            </span>
                          )}
                        </div>
                        <div className="form-wrap form-wrap-checkbox">
                          <div className="d-flex align-items-center">
                            <div className="form-check form-check-md mb-0">
                            
                            </div>
                            <p className="ms-1 mb-0"></p>
                          </div>
                          <Link  to={routes.forgotPassword}  className="text-end" >
                            Forgot password?
                          </Link>
                        </div>
                      </div>
                      <div className="p-4 pt-0">
                        <div className="mb-3">
                          <button
                            className="btn btn-primary w-100"
                            type="submit"
                          >
                            {loading ? "Loading..." : "Sign In"}
                          </button>
                        </div>

                        {/* <div className="text-center">
                          <h6 className="fw-normal text-dark mb-0">
                            Don’t have an account?{" "}
                            <Link to={routes.register} className="hover-a">
                              Create Account
                            </Link>
                          </h6>
                        </div> */}
                      </div>
                    </div>
                  
                  </div>
                </form>
                <div style={{display:'flex',justifyContent:'space-between',marginTop:"15%"}}>
                     <button
                      className="btn w-40 text-white"
                      onClick={()=>navigate("/")}
                      style={{backgroundColor:"#A5CD39"}}
                    >
                       Super admin
                    </button>

                    <button
                      className="btn w-40 text-white"
                      onClick={()=>navigate("/admin/login")}
                      style={{backgroundColor:"#EC1651"}}
                    >
                       Login as Center
                    </button>
                  </div>

                  <div className="mt-3 text-center">
                    <p className="mb-0">
                      Copyright © {getCurrentYear()} -Bright Wheels
                    </p>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherLogin;
