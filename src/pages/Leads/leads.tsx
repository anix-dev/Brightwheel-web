import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import SelectCenter from "../Center/selectCenter";
import { all_routes } from "../../feature-module/router/all_routes";
import { Input, Button, Form, Select, DatePicker, notification } from "antd";
import Table from "../../core/data/datatable/index";
import { DownOutlined } from "@ant-design/icons"; // Import antd arrow icon
import "./leadcss.css";
import dayjs, { Dayjs } from "dayjs"; // Import Dayjs
import TextArea from "antd/es/input/TextArea";
import api from "../../core/data/api";
import { useSelector } from "react-redux";
import DeleteAccountPopup from "./deleteLeadsPopup";
import EditLeadPopup from "./editLeadsPopup";
import Loading from "../../core/common/loader/Loading";
import { WhatsappShareButton, WhatsappIcon } from "react-share";
import { toast } from "react-toastify";
import ReminderPopup from "./reminderLeadsPopup";
import TimelinePopup from "./timelinePopup";

const { Option } = Select;

const { RangePicker } = DatePicker;
const Leads = () => {
  const routes = all_routes;
  const [loader, setLoader] = useState<boolean>(true);
  const { user } = useSelector((state: any) => state.user);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [selectedId, setSelectedId] = useState<any>(null);
  const [isOpen, setOpen] = useState(false);
  const [Id, setId] = useState<any>(null);
  const [isTimeOpen, setTimeOpen] = useState(false);

  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any>(null); // Adjust type as needed
  const [selectedCenter, setSelectedCenter] = useState<string>("");
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    leadGeneratedFrom: "",
    leadDetails: "",
  });
  const [allSchool, setAllSchool] = useState<any[]>([]);
  const [LeadSource, setLeadSource] = useState<any[]>([]);
  const [getAllLeadAdd, setAllLaed] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [last7Days, setLast7Days] = useState("7");
  const [next7Days, setNext7Days] = useState("");

  const handleEditSave = async (id: number, updatedData: any) => {
    try {
      const res = await api.post("/api/mssql-procedure/execute", {
        procedureName: "LeadsUpdate",
        parameters: [
          { name: "ID", type: "Int", value: id },
          { name: "CenterID", type: "Int", value: updatedData.centerId },
          { name: "LName", type: "VarChar", value: updatedData.name },
          { name: "Mobile", type: "VarChar", value: updatedData.mobile },
          {
            name: "LeadSourceID",
            type: "Int",
            value: selectedLead.leadSourceId,
          },
          { name: "Detail", type: "VarChar", value: selectedLead.detail },
          {
            name: "IsInvited",
            type: "Bit",
            value: selectedLead.IsInvited == true ? 0 : 1,
          },
          { name: "StatusID", type: "Int", value: selectedLead.statusId },
          { name: "CREATED_BY", type: "Int", value: user },
        ],
      });
      if (res.data.success) {
        notification.success({
          message: "Successfully Saved",
          description: res.data.message,
        });
        getAllLead();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelect = useCallback((item: string) => {
    setSelectedCenter(item);
  }, []);

  const handleSelect1 = useCallback((item: string) => {
    setLast7Days(item);
  }, []);

  const handleDelete = () => {
    if (selectedRecord) {
      deleteLead(selectedRecord.id);
      setIsPopupOpen(false);
    }
  };

  const handleReminder = () => {
    console.log("reminder part run");
  };
  const leadInsert = async () => {
    try {
       if (!selectedCenter) {
        toast.error("Please select a center before inviting a user");
        return;
      }
      if (!/^\d{10}$/.test(formData.phone)) {
        toast.error("Please enter a valid 10-digit mobile number");
        return;
      }

      if (!formData.name.trim()) {
        toast.error("Name is required");
        return;
      }
      if(!formData.leadGeneratedFrom){
         toast.error("Please select leadGeneratedform");
        return;
      }
      const res = await api.post("/api/mssql-procedure/execute", {
        procedureName: "LeadsInsert",
        parameters: [
          { name: "CenterID", type: "Int", value: selectedCenter },
          { name: "LName", type: "VarChar", value: formData.name },
          { name: "Mobile", type: "VarChar", value: formData.phone },
          { name: "LeadSourceID", type: "Int", value: formData.leadGeneratedFrom},
          { name: "Detail", type: "VarChar", value: formData.leadDetails },
          { name: "IsInvited", type: "Int", value: 0 },
          { name: "StatusID", type: "Int", value: 3 },
          { name: "CREATED_BY", type: "Int", value: user },
        ],
      });
      if(res.data.success){
       toast.success("User invited successfully");
      setFormData({
      name: "",
      phone: "",
      leadGeneratedFrom: "",
      leadDetails: "",
    })
      getAllLead();
      getAllSchool();
      }
     
    } catch (error: any) {
      console.log(error, "error");
    }
  };

  const getAllSchool = async () => {
    try {
      setLoader(true);
      const res = await api.post("/api/mssql-procedure/execute/get", {
        procedureName: "SchoolGetAll",
        parameters: [],
      });
      if (res.data.success) {
        const allSchool = res.data.centers.map(
          (center: any, index: number) => ({
            SchoolName: center.SchoolName,
            id: center.ID,
          })
        );
        setAllSchool(allSchool);
        setLoader(false);
      }
    } catch (error: any) {
      setLoader(false);
    }
  };

  const getleadSources = async () => {
    try {
      const res = await api.post("/api/mssql-procedure/execute/get", {
        procedureName: "LeadSourcesGetAll",
        parameters: [],
      });
      if (res.data.success) {
        const AllLeadSources = [
          { LeadSource: "Select Lead Source", id: "" },
          ...res.data.centers.map((ls: any) => ({
            LeadSource: ls.LName,
            id: ls.ID,
          })),
        ];
        setLeadSource(AllLeadSources);
      }
    } catch (error: any) {}
  };

  const deleteLead = async (id: number) => {
    try {
      const res = await api.post("/api/mssql-procedure/execute/", {
        procedureName: "LeadsDelete",
        parameters: [
          { name: "ID", type: "Int", value: id },
          { name: "CREATED_BY", type: "Int", value: user },
        ],
      });
      if (res.data.success) {
        toast.success("User deleted successfully");
        getAllLead();
      }
    } catch (error: any) {}
  };
  const handleDateRangeChange = (
    dates: [Dayjs | null, Dayjs | null] | null,
    dateStrings: [string, string]
  ) => {
    if (dates) {
      setStartDate(dateStrings[0]);
      setEndDate(dateStrings[1]);
    } else {
      setStartDate(null);
      setEndDate(null);
    }
  };
  const getAllLead = async () => {
    try {
      setLoading(true);
      const res = await api.post("/api/mssql-procedure/execute", {
        procedureName: "LeadsGetAll",
        parameters: [
          { name: "CenterID", type: "Int", value: selectedCenter },
          { name: "lastDay", type: "Int", value: last7Days },
          { name: "fromDate", type: "VarChar", value: startDate },
          { name: "toDate", type: "VarChar", value: endDate },
        ],
      });
      if (res.data.success) {
        const allSchool = res.data.record.map((center: any, index: number) => ({
          sd: index + 1,
          id: center.ID,
          date: dayjs(center.CREATED_DATE).format("DD-MM-YYYY"),
          name: center.LName,
          mobile: center.Mobile,
          status: "Active",
          centerId: center.CenterID,
          statusId: center.StatusID,
          leadSourceId: center.LeadSourceID,
          detail: center.Detail,
          isInvited: center.IsInvited,
        }));
        setAllLaed(allSchool);
      }
    } catch (error: any) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(name, value, "name ---value");
    setFormData({ ...formData, [name]: value });
  };

  const handleInputChange1 = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (selectedCenter  && last7Days) {
      getAllLead();
    }

    getAllSchool();
    getleadSources();
  }, [selectedCenter]);

  const columns = [
    {
      title: "Sr No.",
      dataIndex: "sd",
      key: "sd",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Mobile",
      dataIndex: "mobile",
      key: "mobile",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text: any, record: any) => (
        <div className="d-flex align-items-center">
          <Link
            to="#"
            title="Edit"
            onClick={() => {
              setSelectedLead({
                id: record.id,
                date: record.date,
                name: record.name,
                mobile: record.mobile,
                status: record.status,
                centerId: record.centerId,
                statusId: record.statusId,
                leadSourceId: record.leadSourceId,
                detail: record.detail,
                isInvited: record.isInvited,
              });
              setIsEditPopupOpen(true);
            }}
            className="btn btn-outline-light bg-white btn-icon d-flex align-items-center justify-content-center rounded-circle p-0 me-2"
          >
            <i className="fas fa-edit" style={{ color: "#1890ff" }} />
          </Link>

          <WhatsappShareButton
            url={`https://your-website.com/leads/${record.id}`}
            title={`Check out this lead: Name - ${record.name}, Mobile - ${record.mobile}`}
            className="btn btn-outline-light bg-white btn-icon d-flex align-items-center justify-content-center rounded-circle p-0 me-2"
          >
            <i
              className="fas fa-share-alt"
              title="Share"
              style={{ color: "#25D366" }}
            />
          </WhatsappShareButton>

          <Link
            to="#"
            title="Delete"
            onClick={() => {
              setSelectedRecord(record);
              setIsPopupOpen(true);
            }}
            className="btn btn-outline-light bg-white btn-icon d-flex align-items-center justify-content-center rounded-circle p-0 me-2"
          >
            <i className="fas fa-trash" style={{ color: "#ff4d4f" }} />
          </Link>

          <Link
            to="#"
            onClick={() => {
              setSelectedId(record);
              setOpen(true);
            }}
            title="Time"
            className="btn btn-outline-light bg-white btn-icon d-flex align-items-center justify-content-center rounded-circle p-0 me-2"
          >
            <i className="fas fa-clock" style={{ color: "#faad14" }} />
          </Link>
          <Link
            to="#"
            onClick={() => {
              setId(record);
              setTimeOpen(true);
            }}
            title="Timeline"
            className="btn btn-outline-light bg-white btn-icon d-flex align-items-center justify-content-center rounded-circle p-0 me-3"
          >
            <i className="fas fa-sticky-note" style={{ color: "#52c41a" }} />
          </Link>
        </div>
      ),
    },
  ];
  return (
    <div>
      <div className="page-wrapper ">
        <div className="content content-two">
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="">Leads</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Leads
                  </li>
                </ol>
              </nav>
            </div>
          </div>

          <div className="card mb-3">
            <div className="filter-row-container">
              <div className="filter-row">
                <div className="filter-item">
                  <select
                    name="selectedCenter"
                    className="form-select"
                    value={last7Days}
                    onChange={(e) => handleSelect1(e.target.value)}
                  >
                    <option value="7">Last 7 Days</option>
                    <option value="10">Last 10 Days</option>
                    <option value="30">Last 30 Days</option>
                    <option value="60">Last 60 Days</option>
                    <option value="90">Last 90 Days</option>
                  </select>
                </div>
                <div className="filter-item">
                  <SelectCenter
                    selectedCenter={selectedCenter}
                    handleSelect={handleSelect}
                  />
                </div>
                <div className="filter-item date-range">
                  <RangePicker
                    value={[
                      startDate ? dayjs(startDate) : null,
                      endDate ? dayjs(endDate) : null,
                    ]}
                    onChange={handleDateRangeChange}
                    style={{
                      width: "100%",
                      height: "46px",
                      border: "1px solid black",
                      borderRadius: "5px",
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="card mb-3" style={{ margin: "20px" }}>
              <div style={{ padding: "20px" }}>
                <Form>
                  <div className="row justify-content-center">
                    <div className="col-12 col-md-6 mb-3">
                      <label className="form-label"> Name</label>
                      <input
                        name="name"
                        type="text"
                        className="form-control"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter name"
                      />
                    </div>
                    <div className="col-12 col-md-6 mb-3">
                      <label className="form-label"> Mobile Number</label>
                      <input
                        name="phone"
                        className="form-control"
                        value={formData.phone}
                        pattern="\d{10}"
                        type="text"
                        inputMode="numeric"
                        maxLength={10}
                        title="Please enter a valid 10-digit mobile number"
                        onChange={handleInputChange}
                        placeholder="Enter mobile number"
                        required
                      />
                    </div>
                    <div className="col-12 col-md-6 mb-3">
                      <label className="form-label"> Lead Generated From</label>
                      <select
                        value={formData.leadGeneratedFrom}
                        onChange={(e: any) => handleInputChange(e)}
                        name="leadGeneratedFrom"
                        style={{
                          width: "100%",
                          height: "40px",
                          border: "1px solid black",
                          borderRadius: "5px",
                        }}
                      >
                        {LeadSource.map((ls, index) => {
                          return (
                            <option key={index} value={ls.id}>
                              {ls.LeadSource}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                    <div className="col-12 col-md-6 mb-3">
                      <label className="form-label">
                        Lead Details (Campaign Id / Reference Name)
                      </label>
                      <TextArea
                        name="leadDetails"
                        value={formData.leadDetails}
                        onChange={handleInputChange1}
                        placeholder="Enter lead details"
                        autoSize={{ minRows: 2, maxRows: 2 }}
                      />
                    </div>
                    <div className="col-12 col-md-2">
                      <Form.Item>
                        <Button
                          type="primary"
                          className="mb-3"
                          onClick={leadInsert}
                          disabled={!selectedCenter}
                          block
                        >
                          Invite User
                        </Button>
                      </Form.Item>
                    </div>
                  </div>
                </Form>
              </div>
            </div>

            {loader || loading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100vh",
                }}
              >
                <Loading />
              </div>
            ) : (
              <div className="card card-body p-0 " style={{ margin: "20px" }}>
                <Table dataSource={getAllLeadAdd} columns={columns} />
              </div>
            )}
          </div>

          <div></div>
        </div>
      </div>
      <ReminderPopup
        id={selectedId}
        isOpen={isOpen}
        onClose={() => setOpen(false)}
        onReminder={handleReminder}
      />
      <TimelinePopup  
       id={Id}
       isOpen={isTimeOpen} 
       onClose={() => setTimeOpen(false)} />
      <DeleteAccountPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onDelete={handleDelete}
      />
      <EditLeadPopup
        isOpen={isEditPopupOpen}
        onClose={() => setIsEditPopupOpen(false)}
        onSave={handleEditSave}
        leadData={selectedLead}
      />
    </div>
  );
};

export default Leads;
