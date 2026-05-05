import React from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../router/all_routes";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import { useSelector } from "react-redux";
import dayjs from "dayjs";

const TeacherDashboard = () => {
  const routes = all_routes;
  const { users } = useSelector((state: any) => state.user);

  // Current date
  const today = dayjs().format("dddd, MMMM D, YYYY");

  // Dynamic greeting based on time
  const currentHour = dayjs().hour();
  let greeting = "Hello";
  if (currentHour < 12) {
    greeting = "Good Morning";
  } else if (currentHour < 17) {
    greeting = "Good Afternoon";
  } else if (currentHour < 21) {
    greeting = "Good Evening";
  } else {
    greeting = "Good Night";
  }

  return (
    <div className="page-wrapper">
      <div className="content">
        {/* Header */}
        <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
          <div className="my-auto mb-2">
            <h3 className="page-title mb-1">Teacher Dashboard</h3>
            <nav>
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <Link to={routes.adminDashboard}>Dashboard</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Teacher Dashboard
                </li>
              </ol>
            </nav>
          </div>
        </div>

        {/* Greeting + Teacher Details */}
        <div className="row mb-4">
          <div className="col-md-12 d-flex">
            <div className="card flex-fill bg-dark shadow-lg border-0 rounded-4 position-relative">
              <div className="card-body d-flex flex-wrap align-items-center justify-content-between">
                {/* Greeting */}
                <div className="mb-3">
                  <h1 className="mb-1 fw-bold text-light">
                    👋 {greeting}, {users?.TeacherName}
                  </h1>
                  <p className="mb-1 text-primary">Today is {today}</p>
                  <p className="mb-0 text-light">
                    Wishing you a productive and inspiring day with your students.
                  </p>
                </div>

                {/* Teacher Profile */}
                <div className="d-flex align-items-center">
                  <div className="avatar avatar-xxl rounded-circle border border-3 border-white me-3">
                    <ImageWithBasePath
                      src={users?.Image}
                      alt="Teacher"
                      className="rounded-circle"
                    />
                  </div>
                  <div className="overflow-hidden">
                    <span className="badge bg-dark mb-1">#{users?.TeacherID}</span>
                    <h3 className="mb-1 fw-bold text-light">{users?.TeacherName}</h3>
                    <div className="d-flex align-items-center flex-wrap row-gap-2">
                      <span className="me-3 badge bg-success">
                        📚 Classes: {users?.ClassName}
                      </span>
                      <span className="badge bg-warning text-dark">
                        🎯 Subjects: {users?.Subjects}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Background shapes */}
              <div className="student-card-bg">
                <ImageWithBasePath src="assets/img/bg/circle-shape.png" alt="Bg" />
                <ImageWithBasePath src="assets/img/bg/blue-polygon.png" alt="Bg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
