import React, { useEffect, useState, useCallback } from "react";
import api from "../../core/data/api";
import CommonSelect from "../../core/common/commonSelect";
import { TableData } from "../../core/data/interface";
import Table from "../../core/common/dataTable/index";
import { Link } from "react-router-dom";
import { all_routes } from "../../feature-module/router/all_routes";
import TooltipOption from "../../core/common/toolkit";
import SelectClassType from "../Users/SelectClassType";
import SelectCenters from "../Center/selectCenter";
import Loading from "../../core/common/loader/Loading";
import { toast } from "react-toastify";
import PredefinedDateRanges from "../../core/common/datePicker";
import moment from "moment";
import * as XLSX from "xlsx";

export interface TableDatas {
  admissionNo: string;
  rollNo: number;
  name: string;
  class: string;
  section: string;
  notes: string;
  attendance: string;
  present: string;
  Late: string;
  Absent: string;
  Holiday: string;
  Halfday: string;
  key: number;
}

const StudentAttendance = () => {
  const routes = all_routes;
  const user = localStorage.getItem("user");
  const [data, setData] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [startDate, setDate] = useState<string>("");
  const [showData, setShowData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showImportOptions, setShowImportOptions] = useState(false);

  const [selectedCenter, setSelectedCenter] = useState<string>("Center");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const handleSelect = (item: string) => setSelectedCenter(item);

  const columns = [
    {
      title: "SR No.",
      dataIndex: "SNO",
      sorter: (a: TableData, b: TableData) =>
        a.admissionNo.length - b.admissionNo.length,
    },
    {
      title: "RFID No",
      dataIndex: "StudentTag",
      render: (text: string, record: any) =>
        record.StudentTag || "NOT available",
      sorter: (a: TableData, b: TableData) => a.rollNo.length - b.rollNo.length,
    },
    {
      title: "Name",
      dataIndex: "StudentName",
      render: (text: string) => (
        <div className="d-flex align-items-center">
          <p className="text-dark mb-0">
            <Link to="#">{text}</Link>
          </p>
        </div>
      ),
      sorter: (a: TableData, b: TableData) => a.name.length - b.name.length,
    },
    {
      title: "Center",
      dataIndex: "Center",
      sorter: (a: TableData, b: TableData) => a.class.length - b.class.length,
    },
    {
      title: "Class",
      dataIndex: "ClassName",
      sorter: (a: TableData, b: TableData) => a.class.length - b.class.length,
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text: any, record: any) => (
        <>
          <div className="d-flex align-items-center">
            <li>
              <Link
                className="dropdown-item rounded-1"
                to={`/studentAttendence/studentdetail/${record.id}`}
              >
                <i className="ti ti-edit-circle me-2" />
                View
              </Link>
            </li>
          </div>
        </>
      ),
    },
  ];

  const handleStatus = async (id: string, value: number) => {
    try {
      const res = await api.post("/api/mssql-procedure/execute", {
        procedureName: "StudentAttendenceUpdate",
        parameters: [
          { name: "ID", type: "Int", value: id },
          { name: "IsPresent", type: "Int", value: value },
          { name: "MODIFIED_BY", type: "Int", value: user },
        ],
      });
      toast.success("Status updated successfully");
    } catch (error) {
      console.log("Error updating status", error);
      toast.error("Failed to update status");
    }
  };

  const getUserDetails = async (showAfterFetch = true) => {
    setLoading(true);
    try {
      const res = await api.post("/api/mssql-procedure/execute", {
        procedureName: "StudentGetAll",
        parameters: [
          { name: "ClassId", type: "Int", value: selectedClass || null },
          { name: "CenterId", type: "Int", value: selectedCenter },
        ],
      });
      const filteredCenters = res.data.record.map(
        (center: any, index: number) => ({
          key: index + 1,
          SNO: index + 1,
          Lock: index % 2 === 0,
          StudentTag: center.Tag,
          StudentName: center.Name,
          ClassName: center.ClassName,
          CREATED_DATE: center.CREATED_DATE,
          id: center.ID,
          studentId: center.StudentID,
          Center: center.CenterName,
          StudentNo: center.ID,
          ClassID: center.CenterClassesID,
        })
      );
      setUsers(filteredCenters || []);
      if (showAfterFetch) {
        setShowData(true);
      }
    } catch (error) {
      console.log("Failed to fetch attendance:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleImportExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const binaryStr = event.target?.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      setData(jsonData);
    };
    reader.readAsBinaryString(file);
  };

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const workbook = XLSX.read(text, { type: "string" });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      setData(jsonData);
    };
    reader.readAsText(file);
  };

  useEffect(() => {
    setShowData(false);
  }, [selectedClass]);

  const getStudent = async () => {
    try {
      setLoading(true);
      const res = await api.post("/api/mssql-procedure/execute/get", {
        procedureName: "StudentGetAll",
        parameters: [{ name: "CenterId", type: "Int", value: null }],
      });
      if (res.data.success) {
        setStudents(res.data.centers);
      }
    } catch (error) {
      console.log("Failed to fetch students:", error);
    } finally {
      setLoading(false);
    }
  };
  const downloadCSVTemplate = () => {
    const csvContent = `tagId\n`;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "attendance_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // const insertAllData = async () => {
  //   if (!data || data.length === 0 || students.length === 0) return;
  //   setLoading(true);
  //   try {
  //     const filteredStudents = students?.filter(
  //       (student) =>
  //         student.CenterClassesID.toString() === selectedClass &&
  //         student.CenterID.toString() === selectedCenter
  //     );
  //     const insertPromises = filteredStudents.map((student) => {
  //       let studentTag = student.Tag.toString();
  //       if (studentTag.startsWith("00") || studentTag.startsWith("000") ) {
  //         studentTag = studentTag.slice(2);
  //         console.log(studentTag,"studentTag")
  //       }
  //       console.log(studentTag,"studentTagstudentTag")
  //       const isPresent = data.some((item) => {
  //         const dataTag = item.tagId.toString();

  //         return studentTag === dataTag;
  //       })
  //         ? 1
  //         : 0;
  //         console.log(isPresent,"isPresentisPresentisPresent");return

  //       return api.post("/api/mssql-procedure/execute", {
  //         procedureName: "StudentAttendenceInsert",
  //         parameters: [
  //           { name: "StudentID", type: "Int", value: student.ID },
  //           { name: "Class", type: "Int", value: selectedClass },
  //           { name: "Center", type: "Int", value:selectedCenter },
  //           { name: "IsPresent", type: "Int", value: isPresent },
  //           { name: "ACTIVE", type: "Int", value: 1 },
  //           { name:'type', type: "VarChar", value: 'file'},
  //           { name: "CREATED_BY", type: "Int", value: user },
  //           { name: "CREATED_DATE", type: "Date", value: startDate },
  //         ],
  //       });
  //     });
  //     await Promise.all(insertPromises);
  //     toast.success("Attendance data imported successfully!");
  //     setData([]);
  //     setDate("");
  //     setShowImportOptions(false);
  //     getUserDetails();
  //   } catch (error) {
  //     console.log("Insertion failed:", error);
  //     // toast.error("Failed to import attendance data");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
const insertAllData = async () => {
  if (!data || data.length === 0 || students.length === 0) return;
  setLoading(true);
  try {
    const filteredStudents = students?.filter(
      (student) =>
        student.CenterClassesID.toString() === selectedClass &&
        student.CenterID.toString() === selectedCenter
    );

    const insertPromises = filteredStudents.map((student) => {
      let studentTag = student.Tag?.toString().trim();
      if (!studentTag) return null;
      const tagVariations = [
        studentTag,
        studentTag.replace(/^0+/, ""),    
        `0${studentTag}`,
        `00${studentTag}`,
        `000${studentTag}`,
        studentTag.padStart(10, "0"),        
      ];
      const isPresent = data.some((item) => {
        const dataTag = item.tagId?.toString().trim();
        if (!dataTag) return false;

        return tagVariations.some(
          (variant) => dataTag.toLowerCase() === variant.toLowerCase()
        );
      })
        ? 1
        : 0;

      console.log(studentTag, "→ Tag Variants:", tagVariations, "| Present:", isPresent);

      // Call the stored procedure for attendance
      return api.post("/api/mssql-procedure/execute", {
        procedureName: "StudentAttendenceInsert",
        parameters: [
          { name: "StudentID", type: "Int", value: student.ID },
          { name: "Class", type: "Int", value: selectedClass },
          { name: "Center", type: "Int", value: selectedCenter },
          { name: "IsPresent", type: "Int", value: isPresent },
          { name: "ACTIVE", type: "Int", value: 1 },
          { name: "type", type: "VarChar", value: "file" },
          { name: "CREATED_BY", type: "Int", value: user },
          { name: "CREATED_DATE", type: "Date", value: startDate },
        ],
      });
    }).filter(Boolean);

    await Promise.all(insertPromises);
    toast.success("Attendance data imported successfully!");
    setData([]);
    setDate("");
    setShowImportOptions(false);
    getUserDetails();
  } catch (error) {
    console.log("Insertion failed:", error);
    toast.error("Failed to import attendance data");
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    getStudent();
  }, []);

  useEffect(() => {
    if (data.length > 0 && students.length > 0) {
      insertAllData();
    }
  }, [data, selectedClass, students]);

  const toggleImportOptions = () => {
    setShowImportOptions(!showImportOptions);
  };
  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
          <div className="my-auto mb-2">
            <h3 className="page-title mb-1">Student Attendance</h3>
            <nav>
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <Link to={routes.adminDashboard}>Dashboard</Link>
                </li>
                <li className="breadcrumb-item">Attendance</li>
                <li className="breadcrumb-item active" aria-current="page">
                  Student Attendance
                </li>
              </ol>
            </nav>
          </div>

          <div className="d-flex my-xl-auto right-content align-items-center justify-content-end flex-wrap">
            <button
              className="btn btn-outline-primary"
              onClick={downloadCSVTemplate}
            >
              Download CSV Template
            </button>
          </div>
        </div>

        <div className="card">
          <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
            <h4 className="mb-3">Student Attendance List</h4>
            <div className="d-flex align-items-center flex-wrap">
              <div className="dropdown mb-3">
                <SelectCenters
                  selectedCenter={selectedCenter}
                  handleSelect={handleSelect}
                />
              </div>
              <div className="dropdown mb-3">
                <SelectClassType
                  type="classid"
                  selectedClass={selectedClass}
                  selectedCenter={selectedCenter}
                  handleSelect={(val: any) => setSelectedClass(val)}
                />
              </div>
            </div>
          </div>
          {(selectedClass?.trim() && !showData) && (
            <div className="card-body p-0 px-3 pt-3">
              <div className="d-flex mb-3 flex-wrap gap-2">
                <button
                  className="btn btn-primary me-2"
                  onClick={() => getUserDetails(true)}
                >
                  <i className="fas fa-eye me-2"></i>
                  View Attendance
                </button>

                <div className="dropdown">
                  <button
                    className="btn btn-light fw-medium d-inline-flex align-items-center dropdown-toggle"
                    onClick={toggleImportOptions}
                  >
                    <i className="ti ti-file-import me-2" />
                    Import Attendance
                  </button>

                  {showImportOptions && (
                    <div
                      className="dropdown-menu show p-3"
                      style={{ width: "300px" }}
                    >
                      <div className="mb-3">
                        <label className="form-label">Select Date</label>
                        <input
                          type="date"
                          className="form-control"
                          value={startDate}
                          onChange={(e) => setDate(e.target.value)}
                        />
                      </div>
                      <div className="d-flex flex-column gap-2">
                        <label
                          htmlFor="importExcel"
                          className="btn btn-outline-primary d-flex align-items-center justify-content-start"
                          style={{ cursor: "pointer" }}
                        >
                          <i className="ti ti-file-type-xls me-2 fs-5" />
                          Import Excel
                          <input
                            type="file"
                            id="importExcel"
                            accept=".xlsx, .xls"
                            onChange={handleImportExcel}
                            style={{ display: "none" }}
                          />
                        </label>
                        <label
                          htmlFor="importCSV"
                          className="btn btn-outline-secondary d-flex align-items-center justify-content-start"
                          style={{ cursor: "pointer" }}
                        >
                          <i className="ti ti-file-type-csv me-2 fs-5" />
                          Import CSV
                          <input
                            type="file"
                            id="importCSV"
                            accept=".csv"
                            onChange={handleImportCSV}
                            style={{ display: "none" }}
                          />
                        </label>
                      </div>
                      <div className="mt-2 text-muted small">
                        <i className="ti ti-info-circle me-1"></i>
                        Please select date before importing files
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="card-body p-0 py-3">
            {loading ? (
              <Loading />
            ) : showData ? (
              users.length === 0 ? (
                <div className="text-center py-4">
                  No attendance records found for the selected criteria
                </div>
              ) : (
                <Table dataSource={users} columns={columns} />
              )
            ) : 
            (
               <div className="text-center py-4">
                {(selectedCenter && selectedClass?.trim() )
                  ? "Please click 'View Attendance' to see the data"
                  : "Please select both center and class to view options"}
              </div>
            )
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAttendance;
