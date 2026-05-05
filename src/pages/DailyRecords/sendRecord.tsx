import React, { useEffect, useState } from "react";
import api from "../../core/data/api";
import { Link } from "react-router-dom";
import { all_routes } from "../../feature-module/router/all_routes";
import Table from "../../core/common/dataTable";
import Loading from "../../core/common/loader/Loading";
import SelectRecord from "./SelectRecord";
import { toast } from "react-toastify";

type SelectedClass = {
  id: number;
  name: string;
  centerID: number;
};

const SendReport = () => {
  const routes = all_routes;
  const [students, setStudents] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<SelectedClass | null>(null);
  const [loader, setLoader] = useState<boolean>(false);
  const [record, setRecord] = useState<string>("");
  const [centers, setCenters] = useState<{ ClassName: string; centerId: any; id: string }[]>([]);

  useEffect(() => {
    const getCenters = async () => {
      try {
        setLoader(true);
        const res = await api.post("/api/mssql-procedure/execute/get", {
          procedureName: "ClassesGetAll",
          parameters: [],
        });

        if (res.data?.centers && Array.isArray(res.data.centers)) {
          const filtered = res.data.centers.map((center: any) => ({
            ClassName: center.ClassName,
            centerId: center.CenterID,
            id: center.ID,
          }));
          setCenters(filtered);
        } else {
          setCenters([]);
        }
      } catch (error) {
        console.log("Error loading centers", error);
      } finally {
        setLoader(false);
      }
    };

    getCenters();
  }, []);

  const getStudents = async (selected: SelectedClass) => {
    try {
      setLoader(true);
      const res = await api.post("/api/mssql-procedure/execute", {
        procedureName: "StudentGetAll",
        parameters: [
          { name: "CenterId", type: "Int", value: selected.centerID },
           { name: "ClassId", type: "Int", value: selected.id }
        ]
      });

      if (res.data.success) {
        setStudents(res.data.record || []);
      } else {
        setStudents([]);
      }
    } catch (error) {
      console.log("Error loading students", error);
      setStudents([]);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    if (selectedClass) {
      getStudents(selectedClass);
    }
  }, [selectedClass]);

  const handleClassSelect = (value: string) => {
    const parsed = JSON.parse(value);
    setSelectedClass({
      id: parsed.id,
      name: parsed.name,
      centerID: parsed.centerId, // centerID is passed as `name` in the value
    });
  };

  const handleRecordSelect = (value: string) => setRecord(value);

  const handleSend = (id: any) => toast.success("Record sent successfully");
  const columns = [
    {
      title: "Sr.No.",
      dataIndex: "ID",
      sorter: (a: any, b: any) => a.ID - b.ID,
    },
    {
      title: "Name",
      dataIndex: "Name",
      render: (text: string,record:any) => (
        <div className="d-flex align-items-center">
              <img className="image-rounded" src={record.Image || 'assets/images/default.png'}/>
            <Link to="#">{text}</Link>
        </div>
      ),
      sorter: (a: any, b: any) => a.name.localeCompare(b.name),
    },
    {
      title: "Center",
      dataIndex: "CenterName",
      sorter: (a: any, b: any) => String(a.CenterName).localeCompare(String(b.CenterName)),
    },
    {
      title: "Class",
      dataIndex: "ClassName",
      sorter: (a: any, b: any) => String(a.ClassName).localeCompare(String(b.ClassName)),
    },
    {
      title: "Fees",
      dataIndex: "Mobile",
      render: (text: string) => <div>{text.slice(6)}</div>,
      sorter: (a: any, b: any) => parseFloat(a.Mobile) - parseFloat(b.Mobile),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (_: string, record: any) => (
        <button
          className="btn btn-success-light btn-sm"
          onClick={() => handleSend(record.id)}
        >
          Send
        </button>
      ),
    },
  ];

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
          <div className="my-auto mb-2">
            <h3 className="page-title mb-1">Records</h3>
            <nav>
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <Link to={routes.adminDashboard}>Dashboard</Link>
                </li>
                <li className="breadcrumb-item">Daily Records</li>
                <li className="breadcrumb-item active">Records</li>
              </ol>
            </nav>
          </div>
        </div>

        <div className="card">
          <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
            <h4 className="mb-3">Send Records</h4>
            <div className="d-flex align-items-center flex-wrap">
              <div className="dropdown mb-3 me-2">
                <SelectRecord
                  setName={record}
                  selectedCenter={record}
                  handleSelect={handleRecordSelect}
                />
              </div>
              <div className="dropdown mb-3">
                <select
                  className="form-select"
                  value={selectedClass ? JSON.stringify(selectedClass) : ""}
                  onChange={(e) => handleClassSelect(e.target.value)}
                >
                  <option value="">Select Class</option>
                  {centers.map((center) => {
                    return(
                    <option
                      key={center.id}
                      value={JSON.stringify({ id: center.id, name:center.ClassName,centerId: center.centerId })}
                    >
                     {center.ClassName}
                    </option>
                  )})}
                </select>
              </div>
            </div>
          </div>

          <div className="card-body p-0 py-3">
            {loader ? (
              <Loading />
            ) : !selectedClass ? (
              <div className="text-center py-4">Please select a class to view data.</div>
            ) : (
              <div className="card-body">
                <Table dataSource={students} columns={columns} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendReport;
