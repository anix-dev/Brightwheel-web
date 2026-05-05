import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { all_routes } from "../../router/all_routes";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import api from "../../../core/data/api";

const ForgotPassword: React.FC = () => {
  const routes = all_routes;
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const forgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent the default form submission behavior

    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/api/user/forgot-password', { EMAIL: email });
      // Navigate to reset password page
      navigate(routes.resetPassword);
    } catch (error) {
      console.error("Error sending OTP", error);
      setError("There was an error sending the OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fuild">
      <div className="login-wrapper w-100 overflow-hidden position-relative flex-wrap d-block vh-100">
        <div className="row">
          <div className="col-lg-6">
            <div className="login-background position-relative d-lg-flex align-items-center justify-content-center d-lg-block d-none flex-wrap vh-100 overflowy-auto">
              <div>
                <ImageWithBasePath
                  src="/assets/images/logo3.png"
                  alt="Img"
                />
              </div>
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
                <form onSubmit={forgotPassword}>
                  <div>
                    <div className="card">
                      <div className="card-body p-4">
                        <div className="mb-4">
                          <h2 className="mb-2">Forgot Password?</h2>
                          <p className="mb-0">
                            If you forgot your password, we’ll email you instructions to reset it.
                          </p>
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Email Address</label>
                          <div className="input-icon mb-3 position-relative">
                            <span className="input-icon-addon">
                              <i className="ti ti-mail" />
                            </span>
                            <input
                              type="email"
                              className="form-control"
                              value={email}
                              onChange={handleEmailChange}
                              required
                            />
                          </div>

                          <div className="mb-3">
                            <button 
                              type="submit" 
                              className="btn btn-primary w-100"
                              disabled={loading}
                            >
                              {loading ? "Sending..." : "Send Link"}
                            </button>
                          </div>

                          {error && (
                            <div className="alert alert-danger">
                              {error}
                            </div>
                          )}
                        </div>

                        <div className="text-center">
                          <h6 className="fw-normal text-dark mb-0">
                            Return to{" "}
                            <Link to={routes.login} className="hover-a">
                              Login
                            </Link>
                          </h6>
                        </div>
                      </div>
                    </div>
                    <div className="mt-5 text-center">
                      <p className="mb-0">Copyright © 2025- Anixinventive</p>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
