import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { all_routes } from "../../router/all_routes";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import api from "../../../core/data/api";
import { useDispatch } from "react-redux";
import { setUser } from "../../../core/data/redux/userSlice";
import { toast } from "react-toastify";

type passwordField = "password" | "confirmpassword";

const IsAnonymous = ({ setAanonymous }: any) => {
  const dispatch = useDispatch();
  const routes = all_routes;
  const navigation = useNavigate();
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [selected, setSelected] = useState<{ id: number } | null>(null);

  const getPDF = async () => {
    try {
      const res = await api.post("/api/mssql-procedure/execute/get", {
        procedureName: "Pg_pdfGet",
        parameters: [],
      });

      if (res.data.success) {
        const pdfData = res.data.data;
        const pdfId = res.data.id;
        setSelected({ id: pdfId });

        // Assuming the URL is available in pdfData[0].url
        if (pdfData.length > 0) {
          setPdfUrl(pdfData[0].url);
        }
      }
    } catch (error) {
      console.log("Error fetching PDF:", error);
    }
  };

  useEffect(() => {
    getPDF();
  }, []);
  





  const navigationPath = () => {
    navigation(routes.login);
  };

  const [passwordVisibility, setpasswordVisibility] = useState({
    password: false,
    confirmpassword: false,
  });

  const notify = (message: String) => {
    toast.error(message, {
      autoClose: 3000,
    });
  };

  const togglepasswordVisibility = (field: passwordField) => {
    setpasswordVisibility((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const [inputs, setinputs] = useState({
    TeacherName: "0",
    isAnonymous: 0,
    MobileNumber: "",
    Email: "",
    password: "",
    newpassword: "",
  });

  const handleChange = (e: any) => {
    const name = e.target.name;
    const value = e.target.value;
    setinputs({ ...inputs, [name]: value });
  };

  
  const registerUser = async (inputs: any) => {
    
    try {
      if (inputs.password != inputs.newpassword) {
        notify("password doesn't match");
        return;
      }
      if (!inputs.password) {
        notify("Please Enter Passsword");
        return;
      }

      if (!inputs.newpassword) {
        notify("Please Confirm Passsword");
        return;
      }

      const res = await api.post("/api/user/register", inputs);

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);

        dispatch(setUser(res.data.user));
        navigation(all_routes.user);
      }
    } catch (error: any) {
      notify(error?.response?.data?.message);
    }
  };






















  return (
    <div className="card">
      <div className="card-body p-4">
        <div className=" mb-4">
          <h2 className="mb-2">Register as Guest</h2>
          <p className="mb-0">Please enter your password</p>
        </div>
        <div className="mt-4">
          <div className="mb-3 ">
            <label className="form-label">password</label>
            <div className="pass-group mb-3">
              <input
                type={passwordVisibility.password ? "text" : "password"}
                value={inputs.password}
                onChange={handleChange}
                name="password"
                className="pass-input form-control"
              />
              <span
                className={`ti toggle-passwords ${passwordVisibility.password ? "ti-eye" : "ti-eye-off"
                  }`}
                onClick={() => togglepasswordVisibility("password")}
              ></span>
            </div>
            <label className="form-label">Confirm password</label>
            <div className="pass-group">
              <input
                type={passwordVisibility.confirmpassword ? "text" : "password"}
                value={inputs.newpassword}
                onChange={handleChange}
                name="newpassword"
                className="pass-input form-control"
              />
              <span
                className={`ti toggle-passwords ${passwordVisibility.confirmpassword ? "ti-eye" : "ti-eye-off"
                  }`}
                onClick={() => togglepasswordVisibility("confirmpassword")}
              ></span>
            </div>
          </div>

          <div className="form-wrap form-wrap-checkbox mb-3">
            <div className="d-flex align-items-center">
              <div className="form-check form-check-md mb-0 me-2">
                <input className="form-check-input mt-0" type="checkbox" />
              </div>
              <h6 className="fw-normal text-dark mb-0">
                I Agree to
                <Link to="#" className="hover-a ">
                  {" "}
                  Terms &amp; Privacy
                </Link>
              </h6>
            </div>
          </div>
        </div>
        <div className="mb-3">
          <button
            onClick={() => registerUser(inputs)}
            className="btn btn-primary w-100"
          >
            Sign Up
          </button>
        </div>

        <div className="mb-3">
          <button
            className="btn btn-primary w-100"
            onClick={() => setAanonymous(false)}
          >
            Continue to normal register
          </button>
        </div>

        <div className="text-center">
          <h6 className="fw-normal text-dark mb-0"
      
          >
            Already have an account?
            <Link to={routes.login} className="hover-a ">
              {" "}
              Sign In
            </Link>
          </h6>
        </div>
      </div>
    </div>
  );
};

const NoneAnonymous = ({ setAanonymous }: any) => {
  const dispatch = useDispatch();
  const routes = all_routes;
  const navigation = useNavigate();
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [selected, setSelected] = useState<{ id: number } | null>(null);
  const [switch1Value, setSwitch1Value] = useState(0);
  const [isChecked, setIsChecked] = useState(false);
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);

  const fetchPdfUrl = async () => {
    try {
      const res = await api.post("/api/mssql-procedure/execute/get", {
        procedureName: "pg_get_pdf_file",
        parameters: [],
      });
      if (res.data.success) {
        const fileName = res.data.data[0].filename;
        const url = `https://pgapp.anixinventive.comassets/files/${fileName}`;
        setPdfUrl(url);
        window.open(url, '_blank');
      }
    } catch (error) {
      console.log("Error fetching PDF:", error);
    }
  };

  const handleButtonClick = () => {
    fetchPdfUrl();
  };

  const navigationPath = () => {
    navigation(routes.login);
  };

  const [passwordVisibility, setpasswordVisibility] = useState({
    password: false,
    confirmpassword: false,
  });

  const notify = (message: String) => {
    toast.error(message, {
      autoClose: 3000,
    });
  };

  const togglepasswordVisibility = (field: passwordField) => {
    setpasswordVisibility((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const [inputs, setInputs] = useState({
    TeacherName:"",
  
    MobileNumber: "",
    Email: "",
    password: "",
    newpassword: "",
  });

  const [errors, setErrors] = useState({
    MobileNumber: "",
    TeacherName:"",
    Email: "",
    password: "",
    newpassword: "",
  });

  const validateInputs = () => {
    const newErrors: any = {};

    // MobileNumber/Email validation
    if (!inputs.Email) {
      newErrors.Email = "Email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputs.Email) &&
      !/^\d{10}$/.test(inputs.Email)
    ) {
      newErrors.Email = "Invalid Email address";
    }
    if (!inputs.MobileNumber) {
      newErrors.MobileNumber = "MobileNumber is required.";
    } else if (inputs.MobileNumber.length < 10) {
      newErrors.MobileNumber = "MobileNumber must be at least 10 characters.";
    } else if (inputs.MobileNumber.length > 10) {
      newErrors.MobileNumber = "MobileNumber must be exactly 10 characters.";
    }
    // password validation
    if (!inputs.password) {
      newErrors.password = "password is required.";
    } else if (inputs.password.length < 6) {
      newErrors.password = "password must be at least 6 characters.";
    }
    if (!inputs.newpassword) {
      newErrors.newpassword = "Confirm password is required.";
    } else if (inputs.newpassword.length < 6) {
      newErrors.newpassword = "Confirm password must be at least 6 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: any) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs({ ...inputs, [name]: value });
  };



  const registerUser = async (inputs: any) => {
    try {
      if (!isCheckboxChecked) {
        notify("You must agree to the Terms and Privacy.");
        return;
      }
      if (inputs.password !== inputs.newpassword) {
        notify("password doesn't match");
        return;
      }
      if (!inputs.password) {
        notify("Please Enter password");
        return;
      }
      if (!inputs.newpassword) {
        notify("Please Confirm password");
        return;
      }
      const res = await api.post("/api/user/registerTeacher", inputs);
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        dispatch(setUser(res.data.user));
        if (switch1Value === 1) {
          alert("This website is not available at the moment, please try again later.");
        } else {
          navigation(all_routes.user);
        }
      }
    } catch (error: any) {
      notify(error?.response?.data?.message);
    }
  };

  return (
    <div className="card">
      <div className="card-body p-4">
        <div className="mb-4">
          <h2 className="mb-2">Register</h2>
          <p className="mb-0">Please enter your details to sign up</p>
        </div>
        <div className="mt-4">
          <div className="mb-3">
              <div className="input-icon mb-1 mt-2 position-relative">
              <label className="form-label">Name</label>
              <span className="input-icon-addon mt-4">
                <i className="ti ti-phone" />
              </span>
              <input
                type="text"
                value={inputs.TeacherName}
                onChange={handleChange}
                name="TeacherName"
                className="form-control"
              />
            </div>
            {errors.TeacherName && (
              <span className="text-danger">{errors.TeacherName}</span>
            )}
            <label className="form-label">Email Address</label>
            <div className="input-icon mb-1 position-relative">
              <span className="input-icon-addon">
                <i className="ti ti-mail" />
              </span>
              <input
                type="text"
                value={inputs.Email}
                onChange={handleChange}
                name="Email"
                className="form-control"
              />
            </div>
            {errors.Email && (
              <span className="text-danger">{errors.Email}</span>
            )}

            <div className="input-icon mb-1 mt-2 position-relative">
              <label className="form-label">MobileNumber</label>
              <span className="input-icon-addon mt-4">
                <i className="ti ti-phone" />
              </span>
              <input
                type="text"
                value={inputs.MobileNumber}
                onChange={handleChange}
                name="MobileNumber"
                className="form-control"
              />
            </div>
            {errors.MobileNumber && (
              <span className="text-danger">{errors.MobileNumber}</span>
            )}

            <div className="pass-group mb-1 mt-2">
              <label className="form-label">password</label>
              <input
                type={passwordVisibility.password ? "text" : "password"}
                value={inputs.password}
                onChange={handleChange}
                name="password"
                className="pass-input form-control"
              />
              <span
                className={`ti toggle-passwords ${passwordVisibility.password ? "ti-eye" : "ti-eye-off"}`}
                onClick={() => togglepasswordVisibility("password")}
              ></span>
            </div>
            {errors.password && (
              <span className="text-danger">{errors.password}</span>
            )}

            <div className="pass-group mt-3">
              <label className="form-label">Confirm password</label>
              <input
                type={passwordVisibility.confirmpassword ? "text" : "password"}
                value={inputs.newpassword}
                onChange={handleChange}
                name="newpassword"
                className="pass-input form-control"
              />
              <span
                style={{ marginTop: "15px" }}
                className={`ti toggle-passwords ${passwordVisibility.confirmpassword ? "ti-eye" : "ti-eye-off"}`}
                onClick={() => togglepasswordVisibility("confirmpassword")}
              ></span>
            </div>
            {errors.newpassword && (
              <span className="text-danger">{errors.newpassword}</span>
            )}
          </div>

          <div className="form-wrap form-wrap-checkbox mb-3">
            <div className="d-flex align-items-center">
              <div className="form-check form-check-md mb-0 me-2">
                <input
                  className="form-check-input mt-0 required"
                  type="checkbox"
                  checked={isCheckboxChecked}
                  onChange={() => setIsCheckboxChecked(!isCheckboxChecked)}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <h6 className="fw-normal text-dark mb-0">I Agree to</h6>
                <text
                  onClick={handleButtonClick}
                  style={{
                    backgroundColor: "transparent",
                    margin: "1px 5px",
                    fontSize: "13px",
                    color: "#00308F",
                    border: "1px solid white",
                    borderRadius: "10px",
                    cursor: "pointer",
                    transition: "0.3s",
                  }}
                >
                  Terms and Privacy
                </text>
              </div>
            </div>
          </div>
        </div>
        <div className="mb-3">
          <button
            onClick={() => {
              if (validateInputs()) {
                registerUser(inputs);
              }
            }}
            className="btn btn-primary w-100"
          >
            Sign Up
          </button>
        </div>
        <div className="text-center">
          <h6 className="fw-normal text-dark mb-0">
            Already have an account?
            <Link to={routes.login} className="hover-a">
              {" "}Sign In
            </Link>
          </h6>
        </div>
      </div>
    </div>
  );
};

const Register = () => {
  const [Aanonymous, setAanonymous] = useState(false);

  return (
    <>
      <div className="container-fuild">
        <div className="login-wrapper w-100 overflow-hidden position-relative flex-wrap d-block vh-100">
          <div className="row">
            <div className="col-lg-6">
              <div className="login-background position-relative d-lg-flex align-items-center justify-content-center d-lg-block d-none flex-wrap vh-100 overflowy-auto">
                <div>
                
                </div>
                <div className="authen-overlay-item  w-100 p-4">
                  <ImageWithBasePath
                    src="/assets/images/logo2.jpg"
                    alt=""
                    className="rounded"
                  />
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-12 col-sm-12">
              <div className="row justify-content-center align-items-center vh-100 overflow-auto flex-wrap ">
                <div className="col-md-8 mx-auto p-4">
                  <div>
                    <div className=" mx-auto mb-5 text-center">
                   
                    </div>

                    {Aanonymous ? (
                      <IsAnonymous setAanonymous={setAanonymous} />
                    ) : (
                      <NoneAnonymous setAanonymous={setAanonymous} />
                    )}

                    <div className="mt-5 text-center">
                      <p className="mb-0 ">Copyright © 2024 -AnixInventive</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
