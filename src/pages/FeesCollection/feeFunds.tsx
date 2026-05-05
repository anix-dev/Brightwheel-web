import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../feature-module/router/all_routes";
import { Select, notification } from "antd";
import { DownOutlined } from "@ant-design/icons";
import moment from "moment";
import PredefinedDateRanges from "../../core/common/datePicker";
import { TableData } from "../../core/data/interface";
import ReactApexChart from "react-apexcharts";
import Table from "../../core/common/dataTable/index";
import SelectCenter from "../Center/selectCenter";
import * as XLSX from "xlsx";
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
const { Option } = Select;

const FeeFunds = () => {
  const routes = all_routes;
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [last7Days, setLast7Days] = useState<string>("Last 7 Days");
  const [selectedCenter, setSelectedCenter] = useState<string>("");
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
  const handleDateChange = useCallback((start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
  }, []);

  const handleLast7DaysChange = useCallback((value: string) => {
    setLast7Days(value);
  }, []);
  const exportAsPDF = () => {
    try {
    } catch (error) {
    }
  };
  const [polarChart] = useState<any>({
    chart: {
      height: 250,
      type: "pie",
      toolbar: {
        show: true,
      },
    },
    colors: ["#2aa6aa", "#d53a35"],
    labels: ["Payments Online", "Payments Offline"],
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
            <div
              className="card-header d-flex align-items-center justify-content-between flex-nowrap pb-0"
              style={{ flexWrap: "nowrap", overflowX: "auto" }}
            >
              <h4 className="mb-0 me-3">Fee Received</h4>

              <div
                className="d-flex align-items-center"
                style={{ flexWrap: "nowrap", gap: "10px" }}
              >
                <div style={{}}>
                  <Select
                    value={last7Days}
                    onChange={handleLast7DaysChange}
                    dropdownRender={(menu) => <div>{menu}</div>}
                    style={{
                      width: "100%",
                      border: "none",
                      color: "black",
                      padding: "0px 9px",
                    }}
                    suffixIcon={
                      <DownOutlined
                        style={{ fontSize: "16px", color: "black" }}
                      />
                    }
                  >
                    <Option value="Last 7 Days">Last 7 Days</Option>
                    <Option value="Last 10 Days">Last 10 Days</Option>
                    <Option value="Last 30 Days">Last 30 Days</Option>
                    <Option value="Last 60 Days">Last 60 Days</Option>
                    <Option value="Last 90 Days">Last 90 Days</Option>
                  </Select>
                </div>
                <div>
                  <PredefinedDateRanges
                    onDateChange={(start: string, end: string) =>
                      handleDateChange(start, end)
                    }
                  />
                </div>
                <div style={{ width: "160px" }}>
                  <SelectCenter
                    selectedCenter={selectedCenter}
                    handleSelect={handleSelect}
                  />
                </div>
              </div>
            </div>

            <div className="card-body p-0 py-3">
              {loading ? (
                <Loading />
              ) : !selectedCenter ? (
                <div className="text-center">
                  Please select Center to get data
                </div>
              ) : (
                <div className="card-body w-75">
                  <h3 className="d-flex justify-content-center p-2">
                    Payment Share Received
                  </h3>
                  <div id="polar-chart" />
                  <ReactApexChart
                    options={polarChart}
                    series={polarChart.series}
                    type="pie"
                    height={350}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeeFunds;
