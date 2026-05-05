import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../feature-module/router/all_routes";
import api from "../../core/data/api";
import "../Center/center.css";
import { Input } from "antd";
import Table from "../../core/data/datatable/index";
import Loading from "../../core/common/loader/Loading";
import {toast} from 'react-toastify';

const Center = () => {
  const routes = all_routes;
  const [searchText, setSearchText] = useState<string>("");
  const [loader, setLoader] = useState<boolean>(false);
  const user = localStorage.getItem('user');
  const RoleId = localStorage.getItem('Role')
  const [centers, setCenters] = useState<any[]>([]);
  const [filteredCenter, setFilteredCenter] = useState<any[]>([]);
  const [id,setId] =useState("")
  const filtered: any = centers.filter(
    (item: any) =>
      item.CenterName.toLowerCase().includes(searchText.toLowerCase()) ||
      item.CenterChargeName.toLowerCase().includes(
        searchText.toLowerCase() ||
          item.City.toLowerCase().includes(searchText.toLowerCase()) ||
          item.State.toLowerCase().includes(searchText.toLowerCase())
      )
  );
  useEffect(() => {
    setFilteredCenter(filtered);
  }, [setSearchText, searchText]);

  const getCenter = async () => {
    try {
      setLoader(true);
      const res = await api.post("/api/mssql-procedure/execute/get", {
        procedureName: "CenterGetAll",
        parameters: [
        ],
      });
      if (res.data.success) {
 
        const filteredCenters = res.data.centers
        .map(
          (center: any, index: number) => ({
            key: index + 1,
            SNO: index + 1,
            Lock: index % 2 == 0,
            CenterName: center.Center,
            Profile: center.CenterName,
            Position:center.InchargePosition,
            City: center.City,
            status: center.ACTIVE,
            State: center.State,
            id: center.CenterID,
            CREATED_BY:center.CREATED_BY,
            CenterChargeName: center.InchargeName,
            imgSrc: center.Image ? center.Image: "assets/images/logo3.png" ,
          })
        );
        if(RoleId == "2"){
          const filter = filteredCenters.filter((item:any)=>
            item.CREATED_BY == user
          );
          setCenters(filter);
        }else{
        setCenters(filteredCenters);
        }
        setLoader(false);
      }
    } catch (error: any) {
      setLoader(false);
    }
  };

  useEffect(() => {
    getCenter();
  }, []);

  const columns = [
    {
      title: "S.No",
      dataIndex: "SNO",
    },
   {
  title: "Center Name",
  dataIndex: "CenterName",
  render: (text: any, record: any) => (
    <div className="center-name-container">
      <img className="image-rounded" src={record.imgSrc || 'assets/images/default.png'} />
      <span className="center-name-text" title={text}>{text}</span>
    </div>
  ),
},
{
  title: "City",
  dataIndex: "City",
  className: "city-column", // Optional: Add if you need specific styling
},

    {
      title: "State",
      dataIndex: "State",
    },
    {
      title: "Incharge Name",
      dataIndex: "CenterChargeName",
    },
    {
      title: "Incharge designation",
      dataIndex: "Position",
    },
    // {
    //   title: "Status",
    //   dataIndex: "State",
    //   render: (text: any) => <>{text === 1 ? "ACTIVE" : "PENDING"}</>,
    // },
    {
      title: "Action",
      dataIndex: "action",
      render: (text: any, record: any) => (
        <>
          <div className="d-flex align-items-center">
        {RoleId == "2" ?
            <>
              <Link
                to={routes.addStudents}
                title="Users"
                className="btn btn-outline-light bg-white btn-icon d-flex align-items-center justify-content-center rounded-circle  p-0 me-2"
              >
                <i className="fas fa-users" />
              </Link>
              <Link
                to={`/addClass/${record.id}`}
                title="Class"
                // data-bs-toggle="modal"
                // data-bs-target="#add_remove_class_modal"
                className="btn btn-outline-light bg-white btn-icon d-flex align-items-center justify-content-center rounded-circle  p-0 me-2"
              >
                <i className="fas fa-school" />
              </Link>
              <Link
                to={routes.addTeacher}
                title="Teacher"
                className="btn btn-outline-light bg-white btn-icon d-flex align-items-center justify-content-center rounded-circle p-0 me-3"
              >
                <i className="fas fa-chalkboard-teacher" />
              </Link>
            </>:
            <>
             <Link
                to={`/addClass/${record.id}`}
                title="Class"
                // data-bs-toggle="modal"
                // data-bs-target="#add_remove_class_modal"
                className="btn btn-outline-light bg-white btn-icon d-flex align-items-center justify-content-center rounded-circle  p-0 me-2"
              >
                <i className="fas fa-school" />
              </Link>
            </>
        }
            <div className="dropdown">
              <Link
                to="#"
                className="btn btn-white btn-icon btn-sm d-flex align-items-center justify-content-center rounded-circle p-0"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="ti ti-dots-vertical fs-14" />
              </Link>
              <ul className="dropdown-menu dropdown-menu-right p-3">
                <li>
                  <Link
                    className="dropdown-item rounded-1"
                    to={`/center/addcenter/${record.id}`}
                  >
                    <i className="ti ti-edit-circle me-2" />
                    Edit
                  </Link>
                </li>

                <li>
                  <Link
                    className="dropdown-item rounded-1"
                    to="#"
                    onClick={()=>setId(record.id)}
                    data-bs-toggle="modal"
                    data-bs-target="#delete-modal"
                  >
                    <i className="fas fa-trash me-2" />
                    Delete
                  </Link>
                </li>
              </ul>
            </div>

            <Link
              to="#"
              title={Lock ? "Unlock" : "Lock"}
              data-bs-toggle="modal"
              data-bs-target="#unlock-modal"
              className="btn btn-outline-light bg-white btn-icon d-flex align-items-center justify-content-center rounded-circle mx-3 p-0 me-3"
            >
              <i className={`fas fa-${Lock ? "unlock" : "lock"}`} />
            </Link>
          </div>
        </>
      ),
    },
  ];

  const handleDelete = async () => {
    try {
      setLoader(true);
      const res = await api.post("/api/mssql-procedure/execute", {
        procedureName: "CenterDelete",
        parameters: [
          { name: "ID", type: "Int", value: id },
          { name: "MODIFIED_BY", type: "VarChar", value: user }
        ],
      });
      if (res.data.success) {
        toast.success("Center deleted successfully");
        await getCenter();
      }
    } catch (error) {
    } finally {
      setLoader(false);
    }
  };
  return (
    <>
      <div className="page-wrapper">
        <div className="content content-two">
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="">Center Management</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Center Management
                  </li>
                </ol>
              </nav>
            </div>
            <div
              className="d-flex my-xl-auto right-content align-items-center flex-wrap"
              style={{ justifyContent: "end" }}
            >
              <div className="mb-2">
                <button
                  className="btn btn-primary d-flex align-items-center"
                  style={{
                    backgroundColor: "white",
                    borderRadius: "1px",
                    border: "1px solid #B0B0B0",
                    color: "black",
                    padding: "8px 16px",
                  }}
                >
                  <i className="ti ti-square-rounded-plus me-2" />
                  <Link
                    to={all_routes.CenterAdd}
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    Add Center
                  </Link>
                </button>
              </div>
            </div>
          </div>
          <div className="card mb-3">
            {loader ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100vh",
                }}
              >
                <Loading />
              </div>
            ) : (
              <div className="card-body p-0 py-3">
                <Table
                  dataSource={!filteredCenter.length ? centers : filteredCenter}
                  columns={columns}
                />
              </div>
            )}
          </div>
        </div>
        <div className="modal fade" id="delete-modal">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <form>
                <div className="modal-body text-center">
                  <span className="delete-icon">
                    <i className="ti ti-trash-x" />
                  </span>
                  <h4>Confirm Deletion</h4>
                  <p>
                    You want to delete the marked item, this cant be undone once
                    you delete.
                  </p>
                  <div className="d-flex justify-content-center">
                    <Link
                      to="#"
                      className="btn btn-light me-3"
                      data-bs-dismiss="modal"
                    >
                      Cancel
                    </Link>
                    <Link
                      to="#"
                      onClick={handleDelete}
                      className="btn btn-danger"
                      data-bs-dismiss="modal"
                    >
                      Yes, Delete
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="modal fade" id="unlock-modal">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="card border-0">
              <div className="card-header  text-white">
                <h5 className="card-title mb-0">Center Yearly Payment</h5>
              </div>
              <div className="card-body p-4">
                <ul className="nav nav-pills nav-fill mb-4" role="tablist">
                  <li className="nav-item">
                    <Link
                      className="nav-link active"
                      data-bs-toggle="tab"
                      role="tab"
                      to="#home-center"
                    >
                      <i className="fas fa-cubes me-2"></i>ERP Solution
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      data-bs-toggle="tab"
                      role="tab"
                      to="#about-center"
                    >
                      <i className="fas fa-video me-2"></i>Only Live CCTV
                    </Link>
                  </li>
                </ul>
                
                <div className="tab-content">
                  <div className="tab-pane fade show active" id="home-center" role="tabpanel">
                    <div className="pricing-features">
                      <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
                        <span className="fw-semibold text-muted">School ERP Annual Cost</span>
                        <span className="badge bg-light text-dark fs-9.5">₹21,000</span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
                        <span className="fw-semibold text-muted">Additional Discount</span>
                        <span className="badge bg-light text-dark fs-9.5">₹5,000</span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
                        <span className="fw-semibold text-muted">Payable Amount</span>
                        <span className="badge bg-light text-dark fs-9.5">₹3,000</span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
                        <span className="fw-semibold text-muted">GST (18%)</span>
                        <span className="badge bg-light text-dark fs-9.5">₹7,000</span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center py-2">
                        <span className="fw-semibold text-muted">Taxes & Charges</span>
                        <span className="badge bg-light text-dark fs-9.5">₹2,500</span>
                      </div>
                      
                      <div className="total-section mt-4 p-3 bg-light rounded">
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="fw-bold fs-12">Total Amount</span>
                          <span className="fw-bold fs-3 text-primary">₹38,500</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 d-grid">
                        <button className="btn btn-primary btn-lg">
                          <i className="fas fa-lock me-2"></i>Proceed to Payment
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="tab-pane fade" id="about-center" role="tabpanel">
                    <div className="text-center py-4">
                      <i className="fas fa-video fa-3x text-secondary mb-3"></i>
                      <h5 className="mb-3">Live CCTV Package</h5>
                      <div className="pricing-features">
                        <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
                          <span className="fw-semibold text-muted">Live CCTV Implementation Charges</span>
                          <span className="badge bg-light text-dark fs-9.5">₹15,000</span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
                          <span className="fw-semibold text-muted">Payable Amount</span>
                          <span className="badge bg-light text-dark fs-9.5">₹3,000</span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center py-2">
                          <span className="fw-semibold text-muted">GST (18%)</span>
                          <span className="badge bg-light text-dark fs-9.5">₹2,000</span>
                        </div>
                        
                        <div className="total-section mt-4 p-3 bg-light rounded">
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="fw-bold fs-12">Total Amount</span>
                            <span className="fw-bold fs-4 text-primary">₹20,000</span>
                          </div>
                        </div>
                        
                        <div className="mt-4 d-grid">
                          <button className="btn btn-primary btn-lg">
                            <i className="fas fa-lock me-2"></i>Subscribe Now
                          </button>
                        </div>
                      </div>
                    </div>
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

export default Center;
