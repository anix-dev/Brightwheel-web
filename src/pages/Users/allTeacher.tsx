import React, { useEffect } from "react";
import { Input } from "antd";
import Table from "../../core/data/datatable/index";
import { useState } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../feature-module/router/all_routes";
import api from "../../core/data/api";
import SelectCenter from "../Center/selectCenters";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { Spinner } from "react-bootstrap";

const AllTeacher = () => {
  const routes = all_routes;
  const [loader, setLoading] = useState(false);
  const [id, setId] = useState("");
  const { users } = useSelector((state: any) => state.user);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [selectedCenter, setSelectedCenter] = useState<string>(users.centerId);
  const handleSelect = (item: string) => {
    setSelectedCenter(item);
  };
  const columns = [
    {
      title: "S.No",
      dataIndex: "SNO",
    },
    {
      title: "Teacher Name",
      dataIndex: "TeacherName",
       render: (text: any, record: any) => {
        return (
          <>
            <img className="image-rounded" src={record.Image || 'assets/images/default.png'}/>
            <span>{text}</span>
          </>
        );
      },
    },

    {
      title: "Mobile No",
      dataIndex: "MobileNumber",
    },
    {
      title: "Email",
      dataIndex: "Email",
    },
    {
      title: "Gender",
      dataIndex: "Gender",
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text: any, record: any) => (
        <>
          <div className="d-flex align-items-center">
            <Link
              to={`/addTeacher/${record.TeacherID}`}
              className="btn btn-outline-light bg-white btn-icon d-flex align-items-center justify-content-center rounded-circle p-0 me-2"
            >
              <i className="ti ti-edit-circle" />
            </Link>

            <Link
              onClick={() => setId(record.TeacherID)}
              className="dropdown-item rounded-1"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#delete-modal"
            >
              <i className="fas fa-trash" />
            </Link>
          </div>
        </>
      ),
    },
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.post("/api/mssql-procedure/execute", {
        procedureName: "TeacherGetAll",
        parameters: [
          { name: "CenterId", type: "Int", value: selectedCenter  },
        ],
      });
      if (res.data.success) {
        const filteredCenters = res.data.record.map(
          (center: any, index: number) => ({
            key: index + 1,
            SNO: index + 1,
            Lock: index % 2 == 0,
            TeacherID: center.TeacherID,
            Image:center.Image,
            TeacherName: center.TeacherName,
            MobileNumber: center.MobileNumber,
            Email: center.Email,
            Gender: center.Gender,
            createdAt: center.createdAt,
          })
        );
        setTeachers(filteredCenters);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async () => {
    try {
      setLoading(true);
      const res = await api.post("/api/mssql-procedure/execute", {
        procedureName: "TeacherDelete",
        parameters: [
          { name: "TeacherID", type: "Int", value: id },
          { name: "CREATED_BY", type: "Int", value: users.TeacherID },
        ],
      });
      if (res.data.success) {
        toast.success("Teacher deleted successfully");
        await fetchData();
        setLoading(false);
      }
    } catch (error: any) {
      setLoading(false);
      console.log("Error Deleting Students:", error);
    }
  };

  useEffect(() => {
    if (selectedCenter) {
      fetchData();
    }
  }, [selectedCenter]);
  return (
    <>
      <div className="page-wrapper">
        <div className="content content-two">
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="">All Teachers</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    All Teachers
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
                    to={all_routes.addTeacher}
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    Add Teacher
                  </Link>
                </button>
              </div>
            </div>
          </div>
          {/* <div className="mb-3 border  p-2">
            <SelectCenter
              selectedCenter={selectedCenter}
              handleSelect={handleSelect}
            />
          </div> */}
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
                <div className="text-center">
                 <Spinner animation="border" />
                </div>
              </div>
            ) : (
              <div className="card-body p-0 py-3">
                <Table dataSource={teachers} columns={columns} />
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
      </div>
    </>
  );
};

export default AllTeacher;
