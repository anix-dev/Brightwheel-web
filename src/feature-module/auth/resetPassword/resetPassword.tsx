import React, { useState } from "react";
import { useNavigate, useLocation ,Link} from "react-router-dom";
import api from "../../../core/data/api"; // Ensure this import path is correct
import { all_routes } from "../../router/all_routes";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";

const ResetPassword = () => {
  const routes = all_routes;
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission behavior

    setLoading(true);
    setError(null);
    setSuccess(null);

    if (newPassword !== confirmPassword) {
      setError("New Password and Confirm Password do not match.");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/api/user/reset-password', {
        OTP: otp,
        NEW_PASSWORD: newPassword,
      });

      if (response.status === 200) {
        setSuccess("Password changed successfully");
        navigate(routes.resetPasswordSuccess);
      } else {
        throw new Error("Failed to reset password");
      }
    } catch (error) {
      console.log("Error changing password", error);
      setError("Error changing password. Please try again.");
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
              <div className="authen-overlay-item w-100 p-4">
                <ImageWithBasePath
                  src="/assets/images/logo2.jpg"
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
                  <div className="card">
                    <div className="card-body p-4">
                      <div className="mb-4">
                        <h2 className="mb-2">Reset Password</h2>
                        <p className="mb-0">
                          Enter your OTP and new password to reset it.
                        </p>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">OTP</label>
                        <input
                          type="text"
                          className="form-control"
                          value={otp}
                          onChange={handleOtpChange}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">New Password</label>
                        <input
                          type="password"
                          className="form-control"
                          value={newPassword}
                          onChange={handleNewPasswordChange}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Confirm New Password</label>
                        <input
                          type="password"
                          className="form-control"
                          value={confirmPassword}
                          onChange={handleConfirmPasswordChange}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <button
                          type="submit"
                          className="btn btn-primary w-100"
                          disabled={loading}
                        >
                          {loading ? "Processing..." : "Change Password"}
                        </button>
                      </div>
                      {error && <div className="alert alert-danger">{error}</div>}
                      {success && <div className="alert alert-success">{success}</div>}
                      <div className="text-center">
                        <h6 className="fw-normal text-dark mb-0">
                          Return to
                          <Link to={routes.login} className="hover-a"> Login</Link>
                        </h6>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 text-center">
                    <p className="mb-0">Copyright © 2025- Anixinventive</p>
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

export default ResetPassword;
