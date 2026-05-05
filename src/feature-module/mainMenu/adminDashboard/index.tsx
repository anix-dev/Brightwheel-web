import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { Link } from "react-router-dom";
import CountUp from "react-countup";
import { Calendar } from "primereact/calendar";
import { Nullable } from "primereact/ts-helpers";
import "bootstrap-daterangepicker/daterangepicker.css";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import { all_routes } from "../../router/all_routes";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import AdminDashboardModal from "./adminDashboardModal";
import { useSelector, useDispatch } from "react-redux";
import api from "../../../core/data/api";
import TeacherDashboard from "./teacherDashboard";
const AdminDashboard = () => {
  const dispatch = useDispatch();
  const routes = all_routes;
  const [loader, setLoader] = useState(false);
   const user = localStorage.getItem('user');
  const RoleId = localStorage.getItem('Role')
  const [data, setData] = useState<any>({});
   const { users } = useSelector((state: any) => state.user);


  const getDashboardCount = async () => {
    try {
      console.log(RoleId,"RoleIdRoleId")
      let parameters;
      if(RoleId == "2" || RoleId =="1"){
        let userdata = RoleId == "2"? user:null
      parameters= [
          { name: "UserId" ,type: "Int" ,value: userdata}
        ];
      }else{
          parameters= [
           { name: "ClassId" ,type: "Int" ,value: users?.ClassID ?users.ClassID : null}
        ];
      }
      
      setLoader(true);
      const res = await api.post("/api/mssql-procedure/execute", {
        procedureName: "DashboardCount",
        parameters
      });
      if (res.data.success) {
        setData(res.data.record[0]);
      }
    } catch (error: any) {
      console.log("Error fetching centers:", error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    getDashboardCount();
  }, []);

  return (
    <>
    
          <>
           
            {RoleId == '3' ?
             <TeacherDashboard/>
             :
             <>
               <div className="page-wrapper">
           <div className="content">
              <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
              <div className="my-auto mb-2">
                <h3 className="page-title mb-1">
                 {RoleId === "2"
                ? "Center Dashboard"
                : RoleId === "1"
                ? "Admin Dashboard"
                : RoleId === "3"
                ? "Teacher Dashboard"
                : ""}
              </h3>
                <nav>
                  <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item">
                      <Link to={routes.adminDashboard}>Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                    {RoleId === "2"
                    ? "Center Dashboard"
                    : RoleId === "1"
                    ? "Admin Dashboard"
                    : RoleId === "3"
                    ? "Teacher Dashboard"
                    : ""}

                    </li>
                  </ol>
                </nav>
              </div>
            </div>
               <div className="row">
                <div className="col-md-12">
                  
                  {/* Dashboard Content */}
                  <div className="card bg-dark">
                    <div className="overlay-img">
                      <ImageWithBasePath
                        src="assets/img/bg/shape-04.png"
                        alt="img"
                        className="img-fluid shape-01"
                      />
                      <ImageWithBasePath
                        src="assets/img/bg/shape-01.png"
                        alt="img"
                        className="img-fluid shape-02"
                      />
                      <ImageWithBasePath
                        src="assets/img/bg/shape-02.png"
                        alt="img"
                        className="img-fluid shape-03"
                      />
                      <ImageWithBasePath
                        src="assets/img/bg/shape-03.png"
                        alt="img"
                        className="img-fluid shape-04"
                      />
                    </div>
                    <div className="card-body">
                      <div className="d-flex align-items-xl-center justify-content-xl-between flex-xl-row flex-column">
                        <div className="mb-3 mb-xl-0">
                          <div className="d-flex align-items-center flex-wrap mb-2">
                            <h1 className="text-white me-2">
                              Welcome Back, {users.UserName ||users.TeacherName}
                            </h1>
                            {/* <Link
                              to="profile"
                              className="avatar avatar-sm img-rounded bg-gray-800 dark-hover"
                            >
                              <i className="ti ti-edit text-white" />
                            </Link> */}
                          </div>
                          <p className="text-white">Have a Good day at work</p>
                        </div>
                        {/* <p className="text-white custom-text-white">
                          <i className="ti ti-refresh me-1" />
                          Updated Recently on 15 Jun 2024
                        </p> */}
                      </div>
                    </div>
                  </div>
                  {/* /Dashboard Content */}
                </div>
              </div>
              <div className="row">
                {
                  RoleId =="1" &&(
                    <>
                       <div className="col-xl-3 col-sm-6 d-flex">
                <div className="card  flex-fill animate-card border-0">
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <div className="avatar avatar-xl bg-danger-transparent me-2 p-1">
                        <ImageWithBasePath
                          src="assets/images/staff.svg"
                          alt="img"
                        />
                      </div>
                      <div className="overflow-hidden flex-fill">
                        <div className="d-flex align-items-center justify-content-between">
                          <h2 className="counter">
                            <CountUp end={data?.CenterCount} />
                          </h2>
                          {/* <span className="badge bg-danger">1.2%</span> */}
                        </div>
                        <p>Active Centers</p>
                      </div>
                    </div>
                    <div className="d-flex align-items-center justify-content-between border-top mt-3 pt-3">
                      <p className="mb-0">
                        Active :{" "}
                        <span className="text-dark fw-semibold">{data.CenterActiveCount}</span>
                      </p>
                      <span className="text-light">|</span>
                      <p>
                        Inactive :{" "}
                        <span className="text-dark fw-semibold">{data.CenterInActiveCount}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-sm-6 d-flex">
                <div className="card flex-fill animate-card border-0">
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <div className="avatar avatar-xl bg-danger-transparent me-2 p-1">
                        <ImageWithBasePath
                          src="assets/images/subject.svg"
                          alt="img"
                        />
                      </div>
                      <div className="overflow-hidden flex-fill">
                        <div className="d-flex align-items-center justify-content-between">
                          <div className="overflow-hidden flex-fill">
                            <div className="d-flex align-items-center justify-content-between">
                              <h2 className="counter">
                                <CountUp end={data?.ClassCount} />
                              </h2>
                              {/* <span className="badge bg-danger">1.2%</span> */}
                            </div>
                            <p>Total Classes</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex align-items-center justify-content-between border-top mt-3 pt-3">
                      <p className="mb-0">
                        Active :{" "}
                        <span className="text-dark fw-semibold">{data.ClassActiveCount}</span>
                      </p>
                      <span className="text-light">|</span>
                      <p>
                        Inactive :{" "}
                        <span className="text-dark fw-semibold">{data.ClassInActiveCount}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
                    </>
                  )
                }
           
              <div className="col-xl-3 col-sm-6 d-flex">
                <div className="card flex-fill animate-card border-0">
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <div className="avatar avatar-xl bg-danger-transparent me-2 p-1">
                        <ImageWithBasePath
                          src="assets/images/student.svg"
                          alt="img"
                        />
                      </div>
                      <div className="overflow-hidden flex-fill">
                        <div className="d-flex align-items-center justify-content-between">
                          <div className="overflow-hidden flex-fill">
                            <div className="d-flex align-items-center justify-content-between">
                              <h2 className="counter">
                                <CountUp end={data?.TotalStudents} />
                              </h2>
                              {/* <span className="badge bg-danger">1.2%</span> */}
                            </div>
                            <p>Total Students</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex align-items-center justify-content-between border-top mt-3 pt-3">
                      <p className="mb-0">
                        Active :{" "}
                        <span className="text-dark fw-semibold">{data.StudentActiveCount}</span>
                      </p>
                      <span className="text-light">|</span>
                      <p>
                        Inactive :{" "}
                        <span className="text-dark fw-semibold">{data.StudentInActiveCount}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-sm-6 d-flex">
                <div className="card flex-fill animate-card border-0">
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <div className="avatar avatar-xl bg-danger-transparent me-2 p-1">
                        <ImageWithBasePath
                          src="assets/images/teacher.svg"
                          alt="img"
                        />
                      </div>
                      <div className="overflow-hidden flex-fill">
                        <div className="d-flex align-items-center justify-content-between">
                          <div className="overflow-hidden flex-fill">
                            <div className="d-flex align-items-center justify-content-between">
                              <h2 className="counter">
                                <CountUp end={data?.TotalTeachers} />
                              </h2>
                              {/* <span className="badge bg-danger">1.2%</span> */}
                            </div>
                            <p>Total Teachers</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex align-items-center justify-content-between border-top mt-3 pt-3">
                      <p className="mb-0">
                        Active :{" "}
                        <span className="text-dark fw-semibold">{data.TeachersActiveCount}</span>
                      </p>
                      <span className="text-light">|</span>
                      <p>
                        Inactive :{" "}
                        <span className="text-dark fw-semibold">{data.TeachersInActiveCount}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </div>
      </div>
            </>
             }
           
          </>
        
    </>
  );
};

export default AdminDashboard;
