import React from "react";
import { Input } from "antd";
import Table from "../../core/data/datatable/index";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../feature-module/router/all_routes";
import api from "../../core/data/api";
import Switch from "@mui/material/Switch";
import SelectCenter from "../Center/selectCenter";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { Spinner } from "react-bootstrap";
import moment from "moment";
const label = { inputProps: { "aria-label": "Color switch demo" } };
const AllClasss = () => {
  const routes = all_routes;
  const [id, setId] = useState<string>("");
  const RoleId = localStorage.getItem('Role')
  const { users } = useSelector((state: any) => state.user);
  const [searchText, setSearchText] = useState<string>("");
  const [classes, setClasses] = useState<any[]>([]);
  const [loader, setLoader] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedCenter, setSelectedCenter] = useState<string>("");
  const handleSelect = (item: string) => {
    setSelectedCenter(item);
  };
  console.log(users,"userssss")
  // ClassesGetALL
  const getClass = async () => {
    try {
      setLoader(true);
      const res = await api.post("/api/mssql-procedure/execute", {
        procedureName: "ClassesGetALL",
        parameters: [
          { name: "CenterID", type: "Int", value: users?.centerId ? users.centerId : null },
        ],
      });
      console.log(res,"responseddd")
      if (res.data.success) {
        const filteredCenters = res.data.record.map(
          (center: any, index: number) => ({
            key: index + 1,
            SNO: index + 1,
            Lock: index % 2 == 0,
            Name: center.ClassName,
            CenterName: center.CenterName,
            id: center.ID,
            createdAt:moment(center.CREATED_DATE).format('DD/MM/YYYY'),
            centerId:center.CenterID,
            active: center.ACTIVE,
            imgSrc: "assets/images/logo3.png",
          })
        );

        setClasses(filteredCenters);
        setLoader(false);
      }
    } catch (error: any) {
      setLoader(false);
      console.log("Error fetching centers:", error);
      console.log("Error fetching centers:", error);
    }
  };
  const handleStatusToggle = async (isActive: boolean, id: string) => {
    setLoading(true);
    try {
      const actionText = isActive ? "Activate" : "Suspend";
      const data = isActive ? "Activation" : "Suspension";
      const confirmButtonText = `Yes, ${actionText} it!`;
      const icon = isActive ? "success" : "error";
      const result = await Swal.fire({
        title: `Confirm ${data}`,
        text: `You want to be ${actionText} this user, this won't to be revert it.`,
        icon: icon,
        showCancelButton: true,
        confirmButtonColor: "#d4af37",
        cancelButtonColor: "#333",
        confirmButtonText,
        // theme: "dark",
      });

      if (!result.isConfirmed) return;

      const payload = { ACTIVE: isActive };
      //   const response = await api.patch(`/v1/api/users/${id}`, payload);

      toast.success("Status Update Successfully");
      await getClass();
    } catch (error) {
      console.log("Status update error:", error);
      toast.error("Failed to update status");
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async () => {
    try {
      setLoader(true);
      const res = await api.post("/api/mssql-procedure/execute", {
        procedureName: "ClassesDelete",
        parameters: [
          { name: "ID", type: "Int", value: id },
          { name: "MODIFIED_BY", type: "Int", value: users.ID },
        ],
      });
      if (res.data.success) {
        toast.success("Class deleted successfully");
        await getClass();
        setLoader(false);
      }
    } catch (error: any) {
      setLoader(false);
      console.log("Error Deleting Students:", error);
    }
  };
  useEffect(() => {
    getClass();
  }, []);

  const columns = [
    {
      title: "S.No",
      dataIndex: "SNO",
    },
    {
      title: "Class Name",
      dataIndex: "Name",
    },

    {
      title: "Center Name",
      dataIndex: "CenterName",
    },
    {
      title: "Created Date",
      dataIndex: "createdAt",
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text: any, record: any) => (
        <>
          <div className="d-flex align-items-center">
            <Link
              to={RoleId =="1" ?`/addClass/${record.centerId}?classId=${record.id}`:`/editClass/${record.centerId}?classId=${record.id}`}
              className="btn btn-outline-light bg-white btn-icon d-flex align-items-center justify-content-center rounded-circle p-0 me-2"
            >
              <i className="ti ti-edit-circle" />
            </Link>

            <Link
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#delete-modal"
              onClick={() => setId(record.id)}
              title="Delete"
              className="btn btn-outline-light bg-white btn-icon d-flex align-items-center justify-content-center rounded-circle p-0 me-2"
            >
              <i className="fas fa-trash" />
            </Link>
          </div>
        </>
      ),
    },
  ];
  return (
    <>
      <div className="page-wrapper">
        <div className="content content-two">
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="">All Classes</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    All Class
                  </li>
                </ol>
              </nav>
            </div>
            <div
              className="d-flex my-xl-auto right-content align-items-center flex-wrap"
              style={{ justifyContent: "end" }}
            >
              {
                RoleId == '2' &&(
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
                    to={all_routes.editClass}
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    Add Class
                  </Link>
                </button>
              </div>
                )
              }
             
            </div>
          </div>
          <div className="row">
            <div className="col-lg-6">
              <div className="mb-3">
               
              </div>
            </div>
          </div>
          <div className="card mb-3">
           
            {
                loading || loader || classes.length === 0?
                 <div className="w-100 text-center py-5">
                    <Spinner animation="border" />
                 </div>
                  :
                 <div className="card-body p-0 py-3">
              <Table dataSource={classes} columns={columns} />
            </div>
            }
           
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

export default AllClasss;
