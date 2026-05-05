import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from '../../../core/data/api';
import { all_routes } from "../../router/all_routes";
import { toast } from "react-toastify";
import Loader from "../../../core/common/loader";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../../core/data/redux/userSlice";

type PasswordField = "oldPassword" | "newPassword" | "confirmPassword" | "currentPassword";

const Profile = () => {
  const dispatch = useDispatch();
  const route = all_routes;
  const navigate = useNavigate()
  const user = localStorage.getItem("user");
  const RoleId = localStorage.getItem("Role");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [Teacher,setTeacher] = useState<any>({})
  const [newPassword, setNewPassword] = useState("");
  const [profileImage, setProfileImage] = useState("assets/images/default.png");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error,setError] = useState(false)
  const [passwordVisibility, setPasswordVisibility] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
    currentPassword: false,
  });

  const togglePasswordVisibility = (field: PasswordField) => {
    setPasswordVisibility(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };
  const handleImageUpload = async(e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.files,"filessss",e.target.files?.[0])
    const file = e.target.files?.[0];
     let imagedata;
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfileImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
      
       const formData = new FormData();
        formData.append("images", file);
        const response = await api.post("/upload", formData);
        imagedata =response.data.data[0].url;

    }
    let res;
    
    if(RoleId =="3"){
     let parameters = [
      { name: "TeacherID", type: "Int", value: user },
      { name: "Image", type: "VarChar", value: imagedata },
    
    ];
       res = await api.post("/api/mssql-procedure/execute", {
        procedureName: "TeacherUpdate",
        parameters,
      });
    }else{
   let parameters = [
      { name: "ID", type: "Int", value: user },
      { name: "Image", type: "VarChar", value: imagedata },
      { name: "RoleId", type: "Int", value: RoleId },
    
    ];
    console.log(parameters,"paramrnyd")
       res = await api.post("/api/mssql-procedure/execute", {
        procedureName: "UsersUpdate",
        parameters,
      });
    }
   
      if(res.data.record[0]){
          const updatedUser = res.data.record[0];
        localStorage.setItem("userData", JSON.stringify(updatedUser));
        dispatch(setUser({ user: updatedUser, token: localStorage.getItem("token") }));
      }
      if(res.data.success){
        toast.success("Profile updated successfully")
      }
  };
   const singleData = async () => {
        console.log("1111111111")
    try {
      setLoading(true);
      const res = await api.post("/api/mssql-procedure/execute", {
        procedureName: "TeacherGetbyID",
        parameters: [{ name: "id", type: "Int", value: user }],
      });
      if (res.data.success) {
        const filteredCenters = res.data.record[0];
        if(filteredCenters?.Image){
          setProfileImage(filteredCenters?.Image)
        }
        setTeacher(filteredCenters);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };
   const SingleData = async () => {

    try {
      console.log("singleafdfff")
      setLoading(true);
      const res = await api.post("/api/mssql-procedure/execute", {
        procedureName: "UsersGetRole",
       parameters: [
          { name: "ID", type: "Int", value: user },
          { name: "RoleId", type: "Int", value: RoleId === '1' ? 1 : 2 }
        ]
      });
      if (res.data.success) {
        const filteredCenters = res.data.record[0];
        if(filteredCenters?.Image){
          setProfileImage(filteredCenters?.Image)
        }
        setTeacher(filteredCenters);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };
  const handleDeleteImage = () => {
    setProfileImage("assets/images/default.png");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handlePassword = async () => {
    try {
      if(!password){
        return setError(true)
      }
       if(!newPassword){
        return setError(true)
      }
      setLoading(true);
      const inputs = {
        userId: user,
        password: password,
      };
      if(password != newPassword){
          toast.warning("Confirm Password does not matched with password")
      }else{
        let URL;
        if(RoleId =="3"){
            URL = "/api/user/reset-pass"
        }else{
          URL ="/api/user/reset"
        }
      const res = await api.post(URL, inputs); 
      if (res.data.success) {
        toast.success("Password Changed Successfully");
       
        singleData()
         const Routing = RoleId =="1" ? all_routes.login :(RoleId=="2")? all_routes.schoolLogin:all_routes.teacherLogin;
        navigate(Routing)
      }
      }
     
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
      
    }
  };
  useEffect(()=>{ 
    if(RoleId == "3"){
     singleData();
    }else{
      SingleData()
    } 
  },[]);

 if(loading ){
   return (
     <Loader/> 
   )
 }
const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setTeacher((prev:any) => ({
    ...prev,
    [name]: value,
  }));
};

  return (
    <div className="page-wrapper">
      <div className="content content-two">
        <div className="d-md-flex d-block align-items-center justify-content-between border-bottom pb-3">
          <div className="my-auto mb-2">
            <h3>Profile Settings</h3>
            <nav>
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <Link to={route.adminDashboard}>Dashboard</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Profile
                </li>
              </ol>
            </nav>
          </div>
        </div>
        <div className="d-md-flex d-block mt-4 gap-4">
          <div className="settings-right-sidebar" style={{ minWidth: '300px' }}>
            <div className="card shadow-sm">
              <div className="card-header bg-white">
                <h5 className="mb-0">Profile Picture</h5>
              </div>
              <div className="card-body text-center">
                <div className="profile-pic-container position-relative mx-auto mb-3">
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="rounded-circle border"
                    style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                  />
                 
                </div>
                
                <div className="d-flex justify-content-center gap-2 mb-3">
                  {/* <button 
                    className="btn btn-outline-danger btn-sm" 
                    onClick={handleDeleteImage}
                  >
                    <i className="ti ti-trash me-1"></i> Remove
                  </button> */}
                </div>

                <div className="border rounded p-3 bg-light">
                  <label htmlFor="image-upload" className="btn btn-outline-primary w-100">
                    <i className="ti ti-upload me-2"></i> Upload New Photo
                  </label>
                  <p className="small text-muted mt-2 mb-0">JPG or PNG (Max 2MB)</p>
                  <input
                    type="file"
                    id="image-upload"
                    className="d-none"
                    accept="image/*"
                    onChange={handleImageUpload}
                    ref={fileInputRef}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information Section */}
          <div className="flex-fill">
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Personal Information</h5>
   
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="mb-3">
                    <label className="form-label"> Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="John"
                      onChange={handleChange}
                      value={Teacher?.TeacherName? Teacher?.TeacherName : Teacher?.FirstName}
                      // readOnly
                    />
                  </div>
                 
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    onChange={handleChange}
                    value={Teacher?.Email }
                    // readOnly
                  />
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="+1 234 567 890"
                     onChange={handleChange}
                    value={Teacher?.MobileNumber? Teacher?.MobileNumber: Teacher?.Mobile}
                    // readOnly
                  />
                </div>
              </div>
            </div>
            
            <div className="card shadow-sm">
              <div className="card-header bg-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Password Settings</h5>
                <Link
                  to="#"
                  className="btn btn-primary btn-sm"
                  data-bs-toggle="modal"
                  data-bs-target="#change_password"
                >
                  <i className="ti ti-lock me-1"></i> Change
                </Link>
              </div>
              {/* <div className="card-body">
                <div className="alert alert-info">
                  <i className="ti ti-info-circle me-2"></i>
                  Last changed: 3 months ago
                </div>
              </div> */}
            </div>
          </div>
        </div>

      </div>
      {/* <div className="modal fade" id="edit_personal_information">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Edit Profile</h4>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <form>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="form-label">First Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter First Name"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Last Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Last Name"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Email</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Email"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Phone Number</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Phone Number"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-light"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  data-bs-dismiss="modal" 
                  onClick={handleSubmit}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div> */}
      <div className="modal fade" id="change_password">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Change Password</h4>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={()=>setError(false)}
              ></button>
            </div>
            <form>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-12">
                  
                    <div className="mb-3">
                      <label className="form-label">New Password</label>
                      <div className="input-group">
                        <input
                          type={passwordVisibility.newPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="form-control"
                          placeholder="Enter new password"
                        />
                        
                        <button 
                          className="btn btn-outline-secondary  pb-0 pt-0"
                          type="button"
                          onClick={() => togglePasswordVisibility("newPassword")}
                        >
                          <i className={`ti ${passwordVisibility.newPassword ? 'ti-eye' : 'ti-eye-off'}`}></i>
                        </button>
                      </div>
                      {error? <p className="text-danger">Please enter newpassword</p>:null}
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Confirm Password</label>
                      <div className="input-group">
                        <input
                          type={passwordVisibility.confirmPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="form-control"
                          placeholder="Confirm new password"
                        />
                        <button 
                          className="btn btn-outline-secondary pb-0 pt-0"
                          type="button"
                          onClick={() => togglePasswordVisibility("confirmPassword")}
                        >
                          <i className={`ti ${passwordVisibility.confirmPassword ? 'ti-eye' : 'ti-eye-off'}`}></i>
                        </button>
                        
                      </div>
                       {error? <p className="text-danger">Please enter confirmpassword</p>:null}

                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-light"
                  data-bs-dismiss="modal"
                   onClick={()=>setError(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handlePassword}
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Profile;