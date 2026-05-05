import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  setDataLayout,
  setDataTheme,
} from "../../data/redux/themeSettingSlice";
import ImageWithBasePath from "../imageWithBasePath";
import {
  setExpandMenu,
  setMobileSidebar,
  toggleMiniSidebar,
} from "../../data/redux/sidebarSlice";
import { useState } from "react";
import { all_routes } from "../../../feature-module/router/all_routes";
import api from "../../data/api";
import { removeUser } from "../../data/redux/userSlice";

const Header = () => {
  const routes = all_routes;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {users} = useSelector((state: any) => state.user);
  const RoleId = localStorage.getItem("Role");
  const dataTheme = useSelector((state: any) => state.themeSetting.dataTheme);
  const dataLayout = useSelector((state: any) => state.themeSetting.dataLayout);
  const [notificationVisible, setNotificationVisible] = useState(false);
 
  const mobileSidebar = useSelector(
    (state: any) => state.sidebarSlice.mobileSidebar
  );

  const toggleMobileSidebar = () => {
    dispatch(setMobileSidebar(!mobileSidebar));
  };

  const onMouseEnter = () => {
    dispatch(setExpandMenu(true));
  };
  const onMouseLeave = () => {
    dispatch(setExpandMenu(false));
  };
  const handleToggleMiniSidebar = () => {
    if (dataLayout === "mini_layout") {
      dispatch(setDataLayout("default_layout"));
      localStorage.setItem("dataLayout", "default_layout");
    } else {
      dispatch(toggleMiniSidebar());
    }
  };
  const handleToggleClick = () => {
    if (dataTheme === "default_data_theme") {
      dispatch(setDataTheme("dark_data_theme"));
      // localStorage.setItem(dataTheme,"dark_data_theme")
    } else {
      dispatch(setDataTheme("default_data_theme"));
      // localStorage.removeItem(dataTheme)
    }
  };
  const location = useLocation();
  const toggleNotification = () => {
    setNotificationVisible(!notificationVisible);
  };

  const [isFullscreen, setIsFullscreen] = useState(false);
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch((err) => {});
        setIsFullscreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        if (document.fullscreenElement) {
          document.exitFullscreen().catch((err) => {});
        }
        setIsFullscreen(false);
      }
    }
  };
  const handleLogout = async () => {
    
    if(RoleId == "1"){
      console.log("role -1")
      localStorage.clear();
      navigate(routes.login);
    }else if(RoleId == "2"){
      console.log("role -2")
      localStorage.clear();
      navigate(routes.schoolLogin);
    }else{
     console.log("role -3")
      localStorage.clear();
     navigate(routes.teacherLogin);
    }
        localStorage.clear();
  };

  return (
    <>
      <div className="header" style={{ height: "55px", alignItems: "center" }}>
        <div
          className="header-left active"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <Link
            to={routes.adminDashboard}
            className="logo logo-normal"
            style={{
              height: "40px",
              width: "110px",
              marginTop: "37x",
              marginLeft: "30px",
            }}
          >
            <ImageWithBasePath src="/assets/images/logo3.png" alt="Logo" />
          </Link>

          <Link
            to={routes.adminDashboard}
            className="logo-small"
            style={{
              height: "40px",
              width: "110px",
              marginTop: "37x",
              marginLeft: "30px",
            }}
          >
            <ImageWithBasePath src="/assets/images/logo3.png" alt="Logo" />
          </Link>

          <Link
            to={routes.adminDashboard}
            className="dark-logo"
            style={{
              height: "40px",
              width: "110px",
              marginTop: "37x",
              marginLeft: "30px",
            }}
          >
            <ImageWithBasePath src={users.Image?users.Image :"/assets/images/logo3.png"} alt="Logo" />
          </Link>

          <Link id="toggle_btn" to="#" onClick={handleToggleMiniSidebar}>
            <i className="ti ti-menu-deep" />
          </Link>
        </div>
        {/* /Logo */}
        <Link
          id="mobile_btn"
          className="mobile_btn"
          to="#sidebar"
          onClick={toggleMobileSidebar}
        >
          <span className="bar-icon">
            <span />
            <span />
            <span />
          </span>
        </Link>
        <div className="header-user">
          <div className="nav user-menu align-items-end justify-content-end">
            <div
              className="d-flex align-items-center"
              style={{ marginBottom: "10px" }}
            >
              <div className="pe-1">
              </div>
              <div className="pe-1">
                {!location.pathname.includes("layout-dark") && (
                  <Link
                    onClick={handleToggleClick}
                    to="#"
                    id="dark-mode-toggle"
                    className="dark-mode-toggle activate btn btn-outline-light bg-white btn-icon me-1"
                  >
                    <i
                      className={
                        dataTheme === "default_data_theme"
                          ? "ti ti-moon"
                          : "ti ti-brightness-up"
                      }
                    />
                  </Link>
                )}
              </div>
              <div className="pe-1">
                <Link
                  onClick={toggleFullscreen}
                  to="#"
                  className="btn btn-outline-light bg-white btn-icon me-1"
                  id="btnFullscreen"
                >
                  <i className="ti ti-maximize" />
                </Link>
              </div>
              <div className="dropdown ms-1">
                <Link
                  to="#"
                  className="dropdown-toggle d-flex align-items-center"
                  data-bs-toggle="dropdown"
                >
                  <span className="avatar avatar-md rounded">
                     <ImageWithBasePath
                      src={users?.Image!= null ? users.Image : <i
                    className="ti ti-user-circle" />} 
                      alt="Img"
                      className="img-fluid"
                    />
                  </span>
                </Link>
                <div className="dropdown-menu">
                  <div className="d-block">
                     <div className="d-flex align-items-center p-2">
                      <span className="avatar avatar-md me-2 online avatar-rounded">
                        <ImageWithBasePath
                          src={users?.Image!= null ? users.Image : <i
                    className="ti ti-user-circle" />} 
                          alt="img"
                        />
                      </span>
                      <div>
                        <h6>{users.UserName||users.TeacherName || users.FirstName}</h6>
                        <p className="text-primary mb-0">{RoleId=='1'? 'Administrator' :(RoleId=='2'? 'Center Admin' :'Teacher Admin')}</p>
                      </div>
                    </div>
                    <hr className="m-0" />
                    <Link
                      className="dropdown-item d-inline-flex align-items-center p-2"
                      to={all_routes.adminDashboard}
                    >
                      <i className="ti ti-home me-2" />
                      Home
                    </Link>
                     <Link
                      className="dropdown-item d-inline-flex align-items-center p-2"
                      to={all_routes.profile}
                    >
                      <i className="ti ti-user me-2" />
                      Profile
                    </Link>
                    <hr className="m-0" />
                    <button
                      className="dropdown-item d-inline-flex align-items-center p-2"
                      onClick={handleLogout}
                    >
                      <i className="ti ti-login me-2" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Mobile Menu */}
        <div className="dropdown mobile-user-menu bor">
          <Link
            to="#"
            className="nav-link dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="fa fa-ellipsis-v" />
          </Link>
          <div className="dropdown-menu dropdown-menu-end">
            <Link className="dropdown-item" to={routes.login}>
              Logout
            </Link>
          </div>
        </div>
        {/* /Mobile Menu */}
      </div>
      {/* /Header */}
    </>
  );
};

export default Header;
