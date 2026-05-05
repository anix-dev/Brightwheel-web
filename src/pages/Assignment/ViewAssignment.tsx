import React from "react";
import ImageWithBasePath from "../../core/common/imageWithBasePath";
import { Link } from "react-router-dom";
import { all_routes } from "../../feature-module/router/all_routes";
import { TableData } from "../../core/data/interface";
import Table from "../../core/common/dataTable/index";

const ViewAttendence = () => {
  const routes = all_routes;
  
  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            {/* Page Header */}
            <div className="col-md-12">
              <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
                <div className="my-auto mb-2">
                  <h3 className="page-title mb-1">Assignment Details</h3>
                  <nav>
                    <ol className="breadcrumb mb-0">
                      <li className="breadcrumb-item">
                        <Link to={routes.adminDashboard}>Dashboard</Link>
                      </li>
                      <li className="breadcrumb-item">
                        <Link to={routes.Assignment}>Assignments</Link>
                      </li>
                      <li
                        className="breadcrumb-item active"
                        aria-current="page"
                      >
                        Assignment Details
                      </li>
                    </ol>
                  </nav>
                </div>
              
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xxl-12 col-lg-12 theiaStickySidebar">
              <div className="stickybar">
                <div className="card border-white">
                
                  <div className="card-body">
                    <h5 className="mb-3">Basic Information</h5>
                    <dl className="row mb-0">
                      <dt className="col-12 fw-medium text-dark mb-3">
                        Subject
                      </dt>
                      <dd className="col-6  mb-3">35013</dd>
                      <dt className="col-6 fw-medium text-dark mb-3">No</dt>
                      <dd className="col-6  mb-3">Male</dd>
                      <dt className="col-6 fw-medium text-dark mb-3">
                        Designation
                      </dt>
                      <dd className="col-6  mb-3">25 Jan 2008</dd>
                      <dt className="col-6 fw-medium text-dark mb-3">
                        Department
                      </dt>
                      <dd className="col-6  mb-3">Technical Lead</dd>
                      <dt className="col-6 fw-medium text-dark mb-3">
                        Date Of Birth
                      </dt>
                      <dd className="col-6  mb-3">Admin</dd>
                      <dt className="col-6 fw-medium text-dark mb-3">
                        Blood Group
                      </dt>
                      <dd className="col-6  mb-3">15 Aug 1987</dd>
                      <dt className="col-6 fw-medium text-dark mb-3">
                        Blood Group
                      </dt>
                      <dd className="col-6  mb-3">O+</dd>
                      <dt className="col-6 fw-medium text-dark mb-3">
                        Mother tongue
                      </dt>
                      <dd className="col-6  mb-3">English</dd>
                      <dt className="col-6 fw-medium text-dark mb-0">
                        Language
                      </dt>
                      <dd className="col-6 text-dark mb-0">
                        <span className="badge badge-light text-dark me-2">
                          English
                        </span>
                        <span className="badge badge-light text-dark">
                          Spanish
                        </span>
                      </dd>
                    </dl>
                  </div>
                </div>
              
              </div>
            </div>
          
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAttendence ;
