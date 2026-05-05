import React, { useEffect, useState } from "react";
import api from "../../core/data/api";
import { Link } from "react-router-dom";
import { all_routes } from "../../feature-module/router/all_routes";
import SelectClass from "../Users/selectClass";
import { TableData } from "../../core/data/interface";
import ReactApexChart from "react-apexcharts";
import Table from "../../core/common/dataTable/Table";
import SelectCenter from "../Center/selectCenter";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import Loading from "../../core/common/loader/Loading";
const data = [
  {
    id: 1,
    Service: "ERP",
    Number: "LSTM/2024-25/016",
    fee: "1500",
    status: "paid",
    date:'May-2025'
  },
  {
    id: 2,
    Service: "ERP",
    Number: "LSTM/2024-25/015",
    fee: "1235",
    status: "paid",
    date:'Apr-2025'
  },
  {
    id: 3,
    Service: "ERP",
    Number: "LSTM/2024-25/014",
    fee: "1200",
    status: "paid",
    date:'Mar-2025'
  },
  {
    id: 4,
    Service: "ERP",
    Number: "LSTM/2024-25/013",
    fee: "1345",
    status: "paid",
    date:'Feb-2025'
  },
];
const data1 = [
  {
    id: "13c3pz00fmnciphd8i7RG4ttt",
    date:'May-2025'
  },
  {
    id: "c3pz00fmnciphd8i7RGBlGFh2",
    date:'Apr-2025'
  },
  {
    id: "3c3pz00fmnciphd8i7RGBlGFh",
    date:'Mar-2025'
  },
  {
    id: "c3pz00fmnciphd8i7RGBlGFh",
    date:'Feb-2025'
  },
];
const Invoice = () => {
  const routes = all_routes;
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [loader, setLoader] = useState<boolean>(false);
  const [centers, setCenters] = useState<{ ClassName: string; id: string }[]>(
    []
  );

  useEffect(() => {
    const getCenter = async () => {
      try {
        setLoader(true);

        const res = await api.post("/api/mssql-procedure/execute/get", {
          procedureName: "ClassesGetAll",
          parameters: [],
        });

        if (res.data?.centers && Array.isArray(res.data.centers)) {
          const seenClassNames = new Set();
          const filteredCenters = res.data.centers
            .filter((center: any) => {
              if (seenClassNames.has(center.ClassName)) {
                return false;
              }
              seenClassNames.add(center.ClassName);
              return true;
            })
            .map((center: any) => ({
              ClassName: center.ClassName,
              centerId: center.CenterID,
              id: center.ID,
            }));
          setCenters(filteredCenters);
        } else {
          console.warn("No centers found in response.");
          setCenters([]);
        }
      } catch (error: any) {
        console.log("Error fetching centers:", error);
      } finally {
        setLoader(false);
      }
    };
    getCenter();
  }, []);

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

  const columns = [
    {
      title: "Sr.No.",
      dataIndex: "id",
      sorter: (a: TableData, b: TableData) => a.id.length - b.id.length,
    },
    {
      title: "Month",
      dataIndex: "date",
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
      title: "Invoice Number",
      dataIndex: "Number",
       render: (text: string, record: any) => (
        <div className="d-flex align-items-center text-black">
          <div className="ms-2">
            <p className=" mb-0" style={{color:"#2196ff",fontWeight:'500'}}>
              {text}
            </p>
          </div>
        </div>),
      sorter: (a: TableData, b: TableData) => a.class.length - b.class.length,
    },
    {
      title: "Service",
      dataIndex: "Service",
      render: (text: string, record: any) => <div>{text}</div>,
      sorter: (a: TableData, b: TableData) => a.notes.length - b.notes.length,
    },
       {
      title: "Amount",
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
  ];
  const columns1 = [
   
    {
      title: "Date",
      dataIndex: "date",
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
      title: "Transaction Id",
      dataIndex: "id",
       render: (text: string, record: any) => (
        <div className="d-flex align-items-center text-black">
          <div className="ms-2">
            <p className=" mb-0" style={{color:"#2196ff",fontWeight:'500'}}>
              {text}
            </p>
          </div>
        </div>),
      sorter: (a: TableData, b: TableData) => a.class.length - b.class.length,
    },
   
  ];
  const handleSelect = (item: string) => {
    setSelectedClass(item);
  };

  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Invoices</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  {/* <li className="breadcrumb-item">Invoices</li> */}
                  <li className="breadcrumb-item active" aria-current="page">
                    Invoices
                  </li>
                </ol>
              </nav>
            </div> 
          </div>
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
              <h4 className="mb-3">Invoices</h4>
              <div className="d-flex align-items-center flex-wrap">
                <div className="input-icon-start mb-3 me-2 position-relative"></div>
              </div>
            </div>
            <div className="card-body p-0 py-3">
              {loader ? (
                <Loading />
              ) :(
                  <div className="row">
                  <div className="card-body col-7">
                  <Table label="Invoices" dataSource={data} columns={columns} />
                  </div>
                  <div className=" card-body justify-content-between col-5">
                  <Table label="Transactions" dataSource={data1} columns={columns1} />
                </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default Invoice;
