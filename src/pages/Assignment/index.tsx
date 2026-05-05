import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Input,
  Table,
  Button,
  Form,
  Select,
  DatePicker,
  notification,
} from "antd";
import { Spinner } from "react-bootstrap";
import moment from "moment";
import { toast } from "react-toastify";
import { all_routes } from "../../feature-module/router/all_routes";
import api from "../../core/data/api";
import { TableData } from "../../core/data/interface";
import SelectCenter from "../Center/selectCenter";
import SelectClassType from "../Users/SelectClassType";

const { Option } = Select;

const Assignment = () => {
  const routes = all_routes;
  const navigate = useNavigate();
  const user = Number(localStorage.getItem("user"));

  const [assignments, setAssignments] = useState<any[]>([]);
  const [selectedCenter, setSelectedCenter] = useState<string>("");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedId, setSelectedId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getAssignments = async () => {
    setIsLoading(true);
    try {
      const res = await api.post("/api/mssql-procedure/execute", {
        procedureName: "AssignmentGetAll",
        parameters: [
          { name: "CenterId", type: "Int", value: selectedCenter },
          { name: "ClassId", type: "Int", value: selectedClass },
        ],
      });

      if (res.data.success) {
        const mapped = res.data.record.map((item: any, index: number) => ({
          key: index + 1,
          SNO: index + 1,
          name: item.Subject,
          message: item.notes,
          date: moment(item.CREATED_DATE).format("DD-MM-YYYY"),
          id: item.ID,
          center: item.CenterId,
        }));
        setAssignments(mapped);
      }
    } catch (error) {
      console.log("Error fetching assignments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const res = await api.post("/api/mssql-procedure/execute", {
        procedureName: "SubjectDelete",
        parameters: [
          { name: "ID", type: "Int", value: selectedId },
          { name: "CREATED_BY", type: "Int", value: user },
        ],
      });
      if (res.data.success) {
        toast.success("Assignment deleted successfully");
        getAssignments();
      }
    } catch (error) {
      console.log("Error deleting assignment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCenter && selectedClass) {
      getAssignments();
    } else {
      setAssignments([]);
    }
  }, [selectedCenter, selectedClass]);

  const columns = [
    {
      title: "Sr.No.",
      dataIndex: "SNO",
    },
    {
      title: "Subject",
      dataIndex: "name",
      sorter: (a: TableData, b: TableData) => a.name.localeCompare(b.name),
    },
    {
      title: "Description",
      dataIndex: "message",
      sorter: (a: TableData, b: TableData) => a.message.localeCompare(b.message),
    },
    {
      title: "Date",
      dataIndex: "date",
      sorter: (a: TableData, b: TableData) =>
        moment(a.date, "DD-MM-YYYY").unix() - moment(b.date, "DD-MM-YYYY").unix(),
    },
    {
      title: "Action",
      render: (_: any, record: any) => (
        <Link
          to="#"
          data-bs-toggle="modal"
          data-bs-target="#delete-modal"
          onClick={() => setSelectedId(record.id)}
        >
          <i className="fas fa-trash" />
        </Link>
      ),
    },
  ];

  return (
    <div className="page-wrapper">
      <div className="content content-two">
        <div className="d-md-flex justify-content-between align-items-center mb-3">
          <div>
            <h3>Assignments</h3>
            <nav>
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <Link to={routes.adminDashboard}>Dashboard</Link>
                </li>
                <li className="breadcrumb-item active">Assignments</li>
              </ol>
            </nav>
          </div>

          <div className="mb-2">
            <Link to={routes.addSubjects}>
              <button className="btn btn-primary d-flex align-items-center">
                <i className="ti ti-square-rounded-plus me-2" />
                Add Assignment
              </button>
            </Link>
          </div>
        </div>

        <div className="card mb-3">
          <div className="card-header d-flex justify-content-between flex-wrap">
            <h4>Assignment List</h4>
            <div className="d-flex">
              <SelectCenter
                selectedCenter={selectedCenter}
                handleSelect={setSelectedCenter}
              />
              <SelectClassType
                type="classid"
                selectedCenter={selectedCenter}
                selectedClass={selectedClass}
                handleSelect={setSelectedClass}
              />
            </div>
          </div>

          <div className="card-body p-0 py-3">
            {isLoading ? (
              <div className="w-100 text-center py-5">
                <Spinner animation="border" />
              </div>
            ) : selectedCenter && selectedClass && assignments.length === 0 ? (
              <div className="text-center py-5">
                <h6>No assignments found for selected filters.</h6>
              </div>
            ) : !selectedCenter || !selectedClass ? (
              <div className="text-center py-5">
                <h6>Please select a center and class to view assignments.</h6>
              </div>
            ) : (
              <Table dataSource={assignments} columns={columns} />
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <div className="modal fade" id="delete-modal">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body text-center">
              <span className="delete-icon">
                <i className="ti ti-trash-x" />
              </span>
              <h4>Confirm Deletion</h4>
              <p>This action cannot be undone.</p>
              <div className="d-flex justify-content-center gap-3">
                <button className="btn btn-light" data-bs-dismiss="modal">
                  Cancel
                </button>
                <button
                  className="btn btn-danger"
                  onClick={handleDelete}
                  data-bs-dismiss="modal"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assignment;
