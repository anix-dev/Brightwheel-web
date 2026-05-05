import React from "react";
import { Input } from "antd";
import Table from "../../core/data/datatable/index";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { all_routes } from "../../feature-module/router/all_routes";
import api from "../../core/data/api";
import Loading from "../../core/common/loader/Loading";
import SelectCenter from "../Center/selectCenters";
import PopOver from "../../core/common/PopOver";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import "../Center/center.css";
import { Spinner } from "react-bootstrap";

const AllStudens = () => {
  const routes = all_routes;
  const { users } = useSelector((state: any) => state.user);
  const [id, setId] = useState<string>("");
  const [searchText, setSearchText] = useState<string>("");
  const [loader, setLoader] = useState<boolean>(false);
  const [students, setStudents] = useState<any[]>([]);
  const [filteredstudents, setfilteredstudents] = useState<any[]>([]);
  const [selectedCenter, setSelectedCenter] = useState<string>(users.centerId);
  const filtered: any = students.filter(
    (item: any) =>
      item.EnrolmentNo.toLowerCase().includes(searchText.toLowerCase()) ||
      item.Name.toLowerCase().includes(
        searchText.toLowerCase() ||
          item.FatherName.toLowerCase().includes(searchText.toLowerCase()) ||
          item.Email.toLowerCase().includes(searchText.toLowerCase()) ||
          item.Mobile.toLowerCase().includes(searchText.toLowerCase()) ||
          item.Gender.toLowerCase().includes(searchText.toLowerCase())
      )
  );
  const handleSelect = (item: string) => {
    setSelectedCenter(item);
  };
  const notify = (message: string) => {
    toast.success(message, {
      autoClose: 3000,
    });
  };
  const getStudent = async () => {
    try {
      setLoader(true);
      const res = await api.post("/api/mssql-procedure/execute", {
        procedureName: "StudentGetAll",
        parameters: [
          { name: "CenterId", type: "Int", value: selectedCenter || 0 },
        ],
      });
      if (res.data.success) {
        const filteredCenters = res.data.record;
       const mapped =filteredCenters.map((item: any, index: number) => ({
          key: index + 1,
          SNO: index + 1,
          Name: item.Name,
          FatherName: item.FatherName,
          Image:item.Image,
          EnrolmentNo: item.EnrolmentNo,
          Gender: item.Gender,
          DOB: item.DOB,
          Email: item.Email,
          Mobile: item.Mobile,
          ID: item.ID
        }));
        setStudents(mapped);
        setLoader(false);
      }
    } catch (error: any) {
      setLoader(false);
    }
  };

  useEffect(() => {
      getStudent();
  }, []);

  const handleDelete = async () => {
    try {
      setLoader(true);
      const res = await api.post("/api/mssql-procedure/execute", {
        procedureName: "StudentDelete",
        parameters: [
          { name: "ID", type: "Int", value: id },
          { name: "CREATED_BY", type: "Int", value: users.ID },
        ],
      });
      if (res.data.success) {
        toast.success("Student deleted successfully");
        await getStudent();
        setLoader(false);
      }
    } catch (error: any) {
      setLoader(false);
      notify("Failed to delete student!");
      console.log("Error Deleting Students:", error);
    }
  };

  const columns = [
    {
      title: "Sr No",
      dataIndex: "SNO",
    },
    {
      title: "Enrolment No",
      dataIndex: "EnrolmentNo",
    },
    {
      title: "Students Name",
      dataIndex: "Name",
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
      title: "Gender",
      dataIndex: "Gender",
    },
    {
      title: "DOB",
      dataIndex: "DOB",
    },
    {
      title: "Email",
      dataIndex: "Email",
    },
    {
      title: "Mobile No",
      dataIndex: "Mobile",
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text: any, record: any) => {
        return (
          <>
            <div className="d-flex align-items-center">
              <Link
                to={`/addStudents/${record.ID}`}
                className="btn btn-outline-light bg-white btn-icon d-flex align-items-center justify-content-center rounded-circle p-0 me-2"
              >
                <i className="ti ti-edit-circle" />
              </Link>
               <Link
                to={`/addStudents/${record.ID}`}
                className="btn btn-outline-light bg-white btn-icon d-flex align-items-center justify-content-center rounded-circle p-0 me-2"
              >
                <i className="ti ti-camera" />
              </Link>
              <Link
                className="dropdown-item rounded-1"
                to="#"
                data-bs-toggle="modal"
                data-bs-target="#delete-modal"
                onClick={() => setId(record.ID)}
              >
                <i className="fas fa-trash"></i>
              </Link>
            </div>
          </>
        );
      },
    },
  ];

  return (
    <>
      <div className="page-wrapper">
        <div className="content content-two">
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="">All Students</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    All Students
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
                    to={all_routes.addStudents}
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    Add Student
                  </Link>
                </button>
              </div>
            </div>
          </div>

          {/* <div className="mb-3 border  p-2"> */}
            {/* <SelectCenter
              selectedCenter={selectedCenter}
              handleSelect={handleSelect}
            /> */}
          {/* </div> */}

          <div className="card  mb-3">
           {loader ? (
              <div className="w-100 text-center py-5">
                <Spinner animation="border" />
              </div>
            // )
            //  : selectedCenter  && students.length === 0 ? (
            //   <div className="text-center py-5">
            //     <h6>No students found for selected filters.</h6>
            //   </div>
            ) : students.length == 0  ? (
              <div className="text-center py-5">
                <h6>No Data Available</h6>
              </div>
            ) : (
              <Table dataSource={students} columns={columns} />
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

export default AllStudens;
