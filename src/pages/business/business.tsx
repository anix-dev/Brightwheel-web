import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Table, Select, notification } from "antd";
import { DownOutlined } from "@ant-design/icons";
import moment from "moment";
import PredefinedDateRanges from "../../core/common/datePicker";
import api from "../../core/data/api";
import { useSelector } from "react-redux";
import { all_routes } from "../../feature-module/router/all_routes";

const { Option } = Select;

interface Expense {
  ID: number;
  CREATED_DATE: string;
  ExpenseHeadID: string;
  ModeOfPayment: string;
  Value: string;
  TransactionNumber: string;
}

interface School {
  Center: string;
  ID: number;
}

interface User {
  id: number;
}

interface RootState {
  user: {
    user: User;
  };
}

const Business = () => {
  const routes = all_routes;
  const { user } = useSelector((state: RootState) => state.user);
  const [allSchool, setAllSchool] = useState<School[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [centerId, setCenterId] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [last7Days, setLast7Days] = useState<string>("Last 7 Days");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const expenseHeadMap: Record<string, string> = {
    "0": "Rent",
    "1": "Salary",
    "2": "Electricity",
    "3": "Internet",
    "4": "Phone",
    "5": "Stationary",
    "6": "Marketing",
  };

  const paymentModeMap: Record<string, string> = {
    "0": "Cash",
    "1": "Cheque",
    "2": "Net-Banking",
    "3": "UPI",
    "4": "Debit/Credit Card",
    "5": "Any Other",
  };

  const fetchExpenses = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.post("/api/mssql-procedure/execute/get", {
        procedureName: "ExpensesGetALL",
        parameters: [
          { name: "StartDate", type: "VarChar", value: startDate },
          { name: "EndDate", type: "VarChar", value: endDate },
          { name: "SchoolId", type: "VarChar", value: centerId },
        ],
      });

      if (res.data.success) {
        setExpenses(res.data.centers);
      }
    } catch (error) {
      console.log("Error fetching expenses:", error);
      notification.error({
        message: "Error",
        description: "Failed to fetch expenses",
      });
    } finally {
      setIsLoading(false);
    }
  }, [centerId, startDate, endDate]);

  const fetchSchools = useCallback(async () => {
    try {
      const res = await api.post("/api/mssql-procedure/execute/get", {
        procedureName: "CenterGetAll",
        parameters: [],
      });

      if (res.data.success) {
        setAllSchool(res.data.centers);
      }
    } catch (error) {
      console.log("Error fetching schools:", error);
    }
  }, []);

  const handleDateChange = useCallback((start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
  }, []);

  const handleLast7DaysChange = useCallback((value: string) => {
    setLast7Days(value);
  }, []);

  const handleCenterChange = useCallback((value: string) => {
    setCenterId(value);
  }, []);

  useEffect(() => {
    fetchSchools();
  }, [fetchSchools]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const columns = [
    {
      title: "Sr NO",
      dataIndex: "sr",
      key: "ExpensesDate",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Expense Date",
      dataIndex: "ExpensesDate",
      key: "ExpensesDate",
      render: (date: string) => moment(date).format("DD-MMM-YYYY"),
    },
    {
      title: "Head",
      dataIndex: "ExpenseHeadID",
      key: "ExpenseHeadID",
      render: (value: string) => expenseHeadMap[value] || "Unknown",
    },
    {
      title: "Amount",
      dataIndex: "Value",
      key: "Value",
    },
    {
      title: "Payment Mode",
      dataIndex: "ModeOfPayment",
      key: "ModeOfPayment",
      render: (value: string) => paymentModeMap[value] || "Unknown",
    },
    {
      title: "Transaction Number",
      dataIndex: "TransactionNumber",
      key: "TransactionNumber",
    },
  ];

  return (
    <div>
      <div className="page-wrapper ">
        <div className="content content-two">
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="">Business Management</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Business Management
                  </li>
                </ol>
              </nav>
            </div>
          </div>

          <div className="card mb-3">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  padding: "20px",
                  display: "flex",
                  gap: "10px",
                  flexDirection: "row",
                }}
              >
              
               
              
              </div>
              <Link
                to={"/expense"}
                className="btn"
                style={{
                  backgroundColor: "lightblue",
                  padding: "12px",
                  marginRight: "5px",
                }}
              >
                Add New Expense
              </Link>
            </div>

            <div className="card card-body p-0 " style={{ margin: "20px" }}>
              <Table
                dataSource={expenses}
                columns={columns}
                loading={isLoading}
                rowKey="ID"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Business;