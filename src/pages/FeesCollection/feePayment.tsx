import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../feature-module/router/all_routes";
import SelectClass from "../Users/selectClass";
import { TableData } from "../../core/data/interface";
import ReactApexChart from "react-apexcharts";
import Table from "../../core/common/dataTable/index";
import SelectCenter from "../Center/selectCenter";
import * as XLSX from "xlsx";
import {toast} from "react-toastify"
import Loading from "../../core/common/loader/Loading";
const data = [
  {
    id: 1,
    classId: "PreSchool",
    name: "manik",
    fee: "1500",
    status: "Due",
  },
  {
    id: 2,
    classId: "LKG",
    name: "Prashant",
    fee: "1235",
    status: "Due",
  },
  {
    id: 3,
    classId: "PreSchool",
    name: "Gautam",
    fee: "1200",
    status: "Due",
  },
  {
    id: 4,
    classId: "LKG",
    name: "Kunal",
    fee: "1345",
    status: "Due",
  },
];
const FeePayment = () => {
  const routes = all_routes;
  const [loading, setLoading] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState<string>("");
  const [id, setId] = useState("");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const handleSelect = (item: string) => {
    setSelectedCenter(item);
  };
  const handleClass = (item: string) => {
    setSelectedClass(item);
  };
  const exportAsExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "data.xlsx");
  };

  const exportAsPDF = () => {
    try {
    } catch (error) {
    }
  };
  const [pieChart] = useState<any>({
    chart: {
      height: 250,
      type: "pie",
      toolbar: {
        show: true,
      },
    },
    colors: ["#2aa6aa", "#d53a35"],
    labels: ["Fee Due", "Fee Received"],
    series: [44, 55],
    legend: {
      position: "left",
      horizontalAlign: "left",
      align: "left",
      fontSize: "14px",
      labels: {
        colors: "#000",
        useSeriesColors: false,
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  });
  const columns = [
    {
      title: "Sr.No.",
      dataIndex: "id",
      sorter: (a: TableData, b: TableData) => a.id.length - b.id.length,
    },
    {
      title: "Name",
      dataIndex: "name",
      render: (text: string, record: any) => (
        <div className="d-flex align-items-center">
          <div className="ms-2">
            <p className="text-dark mb-0">
              <Link to="#">{text}</Link>
            </p>
          </div>
        </div>
      ),
      sorter: (a: TableData, b: TableData) => a.name.length - b.name.length,
    },
    {
      title: "Class",
      dataIndex: "classId",
      sorter: (a: TableData, b: TableData) => a.class.length - b.class.length,
    },
    {
      title: "Fees",
      dataIndex: "fee",
      render: (text: string, record: any) => <div>{text}</div>,
      sorter: (a: TableData, b: TableData) => a.notes.length - b.notes.length,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text: string, record: any) => (
        <div className="text-danger">{text}</div>
      ),
      sorter: (a: TableData, b: TableData) => a.notes.length - b.notes.length,
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text: any, record: any) => (
        <>
          <div className="d-flex align-items-center">
            <Link
              to={`/addTeacher/${record.id}`}
              className="btn btn-outline-light bg-white btn-icon d-flex align-items-center justify-content-center rounded-circle p-0 me-2"
            >
              <i className="ti ti-edit-circle" />
            </Link>

            <Link
              onClick={() => setId(record.id)}
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
  

  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Fee Received</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">Fee Collection</li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Fee Received
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content justify-content-end flex-wrap">
              <div className="dropdown me-2 mb-2">
                <Link
                  to="#"
                  className="dropdown-toggle btn btn-light fw-medium d-inline-flex align-items-center"
                  data-bs-toggle="dropdown"
                >
                  <i className="ti ti-file-export me-2" />
                  Export
                </Link>
                <ul className="dropdown-menu dropdown-menu-end p-3">
                  <li>
                    <Link
                      to="#"
                      className="dropdown-item rounded-1"
                      onClick={exportAsPDF}
                    >
                      <i className="ti ti-file-type-pdf me-1" />
                      Export as PDF
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="#"
                      className="dropdown-item rounded-1"
                      onClick={exportAsExcel}
                    >
                      <i className="ti ti-file-type-xls me-1" />
                      Export as Excel
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
              <h4 className="mb-3">Fee Received</h4>
              <div className="d-flex align-items-center flex-wrap">
                <div className="input-icon-start mb-3 me-2 position-relative"></div>
                <div className="dropdown mb-3 me-2">
                  <SelectCenter
                    selectedCenter={selectedCenter}
                    handleSelect={handleSelect}
                  />
                </div>
                <div className="dropdown mb-3">
                  <SelectClass
                    selectedClass={selectedClass}
                    selectedCenter={selectedCenter}
                    handleSelect={(val:any) => setSelectedClass(val)}
                  />
                </div>
              </div>
            </div>
            <div className="card-body p-0 py-3">
              {loading ? (
                <Loading />
              ) : !selectedCenter || !selectedClass ? (
                <div className="text-center">
                  Please select Center and classes to get data
                </div>
              ) : (
                <div className="card-body w-74">
                 
                
                  <Table dataSource={data} columns={columns} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id="edit_address_information">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <form>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="form-label">Fee Raise On-</label>
                      <select className="form-control">
                        {[...Array(24)].map((_, i) => (
                          <option key={i} value={i}>
                            {i}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Receipt Prefix</label>
                      <input type="text" />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Current Fees</label>
                      <select className="form-control">
                        {[...Array(24)].map((_, i) => (
                          <option key={i} value={i}>
                            {i}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </form>
            <div className="modal-header">
              <h4 className="modal-title">Add Fee</h4>
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
                <p>
                  <span className="text-danger">Imp:</span> Fee will be made for
                  next month of Creation month (for ex. in Jan, Fee for Feb will
                  be raised)
                </p>
                <div className="row">
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="form-label">For Class </label>
                      <select className="form-control">
                        {[...Array(24)].map((_, i) => (
                          <option key={i} value={i}>
                            {i}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Fee Name</label>
                      <select className="form-control">
                        {[...Array(60)].map((_, i) => (
                          <option key={i} value={i}>
                            {i}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Fee Type</label>
                      <select className="form-control">
                        {[...Array(24)].map((_, i) => (
                          <option key={i} value={i}>
                            {i}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Default Status</label>
                      <select className="form-control">
                        {[...Array(60)].map((_, i) => (
                          <option key={i} value={i}>
                            {i}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Fee Frequency</label>
                      <select className="form-control">
                        {[...Array(24)].map((_, i) => (
                          <option key={i} value={i}>
                            {i}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Fee Creation Month</label>
                      <select className="form-control">
                        {[...Array(24)].map((_, i) => (
                          <option key={i} value={i}>
                            {i}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Fee Charge</label>
                      <select className="form-control">
                        {[...Array(24)].map((_, i) => (
                          <option key={i} value={i}>
                            {i}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">
                        Variable Fee Unit (Hours,Km etc.)
                      </label>
                      <select className="form-control">
                        {[...Array(24)].map((_, i) => (
                          <option key={i} value={i}>
                            {i}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Fee Amount</label>
                      <select className="form-control">
                        {[...Array(24)].map((_, i) => (
                          <option key={i} value={i}>
                            {i}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Tax% *</label>
                      <select className="form-control">
                        {[...Array(24)].map((_, i) => (
                          <option key={i} value={i}>
                            {i}
                          </option>
                        ))}
                      </select>
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
                  Submit
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
     
    </div>
  );
};

export default FeePayment;

