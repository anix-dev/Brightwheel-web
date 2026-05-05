import React, { useEffect, useState, useCallback } from "react";
import { rolesPermissionsData } from "../../core/data/json/rolesPermissions";
import Table from "../../core/common/dataTable/index";
import { TableData } from "../../core/data/interface";
import PredefinedDateRanges from "../../core/common/datePicker";
import { Link } from "react-router-dom";
import { all_routes } from "../../feature-module/router/all_routes";
import TooltipOption from "../../core/common/tooltipOption";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import api from "../../core/data/api";
import Loading from "../../core/common/loader/Loading";
import moment from "moment";

interface RoleData {
  RoleName: string;
  CREATED_BY: any;
}
const RolesPermissions = () => {
  const routes = all_routes;
  const [role, setRoles] = useState("");
  const user = localStorage.getItem("user");
  const [singleData, setSingleData] = useState<any>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [id, setId] = useState<string>("1");
  const [datas, setData] = useState<RoleData[]>([]);
  const [endDate, setEndDate] = useState<string>("");
  const handleEditRole = async () => {
    setLoading(true);
    try {
      const res = await api.post("/api/mssql-procedure/execute", {
        procedureName: "RoleUpdate",
        parameters: [
          { name: "ID", type: "Int", value: id },
          { name: "RoleName", type: "VarChar", value: role },
          { name: "Description", type: "VarChar", value: `this is ${role}` },
          { name: "ACTIVE", type: "Int", value: 1 },
          { name: "CREATED_BY", type: "Int", value: user },
        ],
      });
      if (res.data.success) {
        toast.success("Role updated successfully");
        getData()
      }
    } catch (error) {
      console.log("Error inserting teacher:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await api.post("/api/mssql-procedure/execute", {
        procedureName: "RoleDelete",
        parameters: [
          { name: "ID", type: "Int", value: id },
          { name: "CREATED_BY", type: "Int", value: user },
        ],
      });
      if (res.data.success) {
        toast.success("Role deleted successfully");
      }
    } catch (error) {
      console.log("Error inserting teacher:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleRoleSubmit = async () => {
    setLoading(true);
    try {
      const res = await api.post("/api/mssql-procedure/execute", {
        procedureName: "RoleInsert",
        parameters: [
          { name: "RoleName", type: "VarChar", value: role },
          { name: "Description", type: "VarChar", value: `this is${role}` },
          { name: "Active", type: "Int", value: 1 },
          { name: "CreatedBy", type: "Int", value: user },
        ],
      });
      if (res.data.success) {
        toast.success("Role added successfully");
      }
    } catch (error) {
      console.log("Error inserting teacher:", error);
    } finally {
      setLoading(false);
    }
  };
  const getData = async () => {
    const res = await api.post("/api/mssql-procedure/execute/get", {
      procedureName: "RoleGetAll",
      parameters: [],
    });
    const filterData = res.data.centers.map((center: any, index: number) => ({
      key: index + 1,
      SNO: index + 1,
      Lock: index % 2 == 0,
      RoleName: center.RoleName,
      Description: center.Description,
      CREATED_DATE: center.CREATED_DATE,
      ACTIVE: center.ACTIVE,
      id: center.ID,
    }));
    setData(filterData);
  };
  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
     if (!id || isNaN(Number(id))) return;
    const getSingleData = async () => {
      const res = await api.post("/api/mssql-procedure/execute", {
        procedureName: "RoleGetbyID",
        parameters: [{ name: "ID", type: "Int", value: id }],
      });
      if(res.data.success){
       const filterData = res.data.record[0];
      setSingleData(filterData);
      getData()
      }
      
    };
    getSingleData();
  }, [id]);
 
  const columns = [
    {
      title: "Sr No.",
      dataIndex: "SNO",
      sorter: (a: TableData, b: TableData) =>
        a.RoleName.length - b.RoleName.length,
    },
    {
      title: "Role Name",
      dataIndex: "RoleName",
      sorter: (a: TableData, b: TableData) =>
        a.RoleName.length - b.RoleName.length,
    },

    {
      title: "Created On",
      dataIndex: "CREATED_DATE",
      render: (text: any, record: any) => {
        return moment(record.CREATED_DATE).format("DD/MMM/YYYY");
      },
      sorter: (a: TableData, b: TableData) =>
        a.CREATED_DATE.length - b.CREATED_DATE.length,
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text: any, record: any) => (
        <>
          <div className="d-flex align-items-center">
            <Link
              to="#"
              className="btn btn-outline-light bg-white btn-icon d-flex align-items-center justify-content-center rounded-circle  p-0 me-2"
              data-bs-toggle="modal"
              onClick={() => setId(record.id)}
              data-bs-target="#edit_role"
            >
              <i className="ti ti-edit-circle text-primary" />
            </Link>
            <Link
              to={{
                pathname: routes.permissions,
                search: `?id=${record.id}`,
              }}
              className="btn btn-outline-light bg-white btn-icon d-flex align-items-center justify-content-center rounded-circle p-0 me-2"
            >
              <i className="ti ti-shield text-skyblue" />
            </Link>
            <Link
              to="#"
              className="btn btn-outline-light bg-white btn-icon d-flex align-items-center justify-content-center rounded-circle p-0 me-3"
              data-bs-toggle="modal"
              onClick={() => setId(record.id)}
              data-bs-target="#delete-modal"
            >
              <i className="ti ti-trash-x text-danger" />
            </Link>
          </div>
        </>
      ),
    },
  ];
  return (
    <div>
      <>
        <div className="page-wrapper">
          <div className="content">
            <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
              <div className="my-auto mb-2">
                <h3 className="page-title mb-1">Roles &amp; Permissions</h3>
                <nav>
                  <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item">
                      <Link to={routes.adminDashboard}>Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item">
                      <Link to="#">AccessControl Management</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Roles &amp; Permissions
                    </li>
                  </ol>
                </nav>
              </div>
              <div className="d-flex my-xl-auto right-content align-items-center justify-content-end  flex-wrap">
                <div className="mb-2">
                  <Link
                    to="#"
                    className="btn btn-primary d-flex align-items-center"
                    data-bs-toggle="modal"
                    data-bs-target="#add_role"
                  >
                    <i className="ti ti-square-rounded-plus me-2" />
                    Add Role
                  </Link>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
                <h4 className="mb-3">Roles &amp; Permissions List</h4>
                <div className="d-flex align-items-center flex-wrap"></div>
              </div>
              <div className="card-body p-0 py-3">
                {loading ? (
                  <Loading />
                ) : datas.length == 0 ? (
                  <p style={{ textAlign: "center" }}>Data not available</p>
                ) : (
                  <Table columns={columns} dataSource={datas} />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="add_role">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Add Role</h4>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="ti ti-x" />
                </button>
              </div>
              <form>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="mb-0">
                        <label className="form-label">Role Name</label>
                        <input
                          type="text"
                          value={role}
                          onChange={(e: any) => setRoles(e.target.value)}
                          className="form-control"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <Link
                    to="#"
                    className="btn btn-light me-2"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </Link>
                  <Link
                    to="#"
                    onClick={handleRoleSubmit}
                    className="btn btn-primary"
                    data-bs-dismiss="modal"
                  >
                    Add Role
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="modal fade" id="edit_role">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Edit Role</h4>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="ti ti-x" />
                </button>
              </div>
              <form>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="mb-0">
                        <label className="col-form-label">Role Name</label>
                        <input
                          type="text"
                          value={role?role:singleData.RoleName}
                          onChange={(e: any) => setRoles(e.target.value)}
                          className="form-control"
                          defaultValue={singleData.RoleName}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <Link
                    to="#"
                    className="btn btn-light me-2"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </Link>
                  <Link
                    to="#"
                    onClick={handleEditRole}
                    className="btn btn-primary"
                    data-bs-dismiss="modal"
                  >
                    Save Changes
                  </Link>
                </div>
              </form>
            </div>
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
                    You want to delete all the marked items, this cant be undone
                    once you delete.
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
      </>
    </div>
  );
};

export default RolesPermissions;
