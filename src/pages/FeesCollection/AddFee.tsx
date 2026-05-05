import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import api from "../../core/data/api";
import { all_routes } from "../../feature-module/router/all_routes";
import SelectClass from "../Users/selectClass";
import { TableData } from "../../core/data/interface";
import Table from "../../core/common/dataTable/index";
import SelectCenter from "../Center/selectCenter";
import { toast } from "react-toastify";
import Loading from "../../core/common/loader/Loading";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Switch from "react-switch";
import "./fee.css";
import SelectClassType from "../Users/SelectClassType";

const AddFee = () => {
  const routes = all_routes;
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const user = localStorage.getItem("user");
  const [edit, setEdit] = useState("");
  const [searchParams] = useSearchParams();
  const centerId = searchParams.get("centerId");
  const classId = searchParams.get("classId");
  const [selectedCenter, setSelectedCenter] = useState<any>(classId);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [feesdetail, setFees] = useState<[]>([]);
  const [data, setData] = useState<[]>([]);
  const handleClassType = (item: string, type: string) => {
    setSelectedCenter(item);
  };
  const handleType = (item: string) => {
    setSelectedClass(item);
  };
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const initialValues = {
    feeName: "",
    feeType: "",
    defaultStatus: "On For All",
    frequency: "Monthly",
    creationMonth: "",
    feeCharge: "",
    feeAmount: "",
    tax: "",
    feeRaise: "",
    variableUnit: "",
    receiptPrefix: "",
  };
  const validationSchema = Yup.object().shape({
    feeName: Yup.string().required("Fee Name is required"),
    feeRaise: Yup.string().required("Fee Raise is required"),
    receiptPrefix: Yup.string().required("Add Receipt"),
    creationMonth: Yup.array()
      .min(1, "Select at least one month")
      .of(Yup.string())
      .required("Fee Creation Month is required"),
    feeCharge: Yup.string().required("Fee Charge type is required"),
    feeAmount: Yup.number()
      .typeError("Fee Amount must be a number")
      .required("Fee Amount is required"),
    tax: Yup.number()
      .typeError("Tax must be a number")
      .required("Tax is required"),
  });
  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      if(!selectedClass){
        return toast.error('Please select class')
      }
      const res = await api.post("/api/mssql-procedure/execute", {
        procedureName: "paymentModesInsert",
        parameters: [
          { name: "Name", type: "VarChar", value: values.feeName },
          { name: "TYPE", type: "VarChar", value: values.feeType },
          { name: "raise", type: "VarChar", value: values.feeRaise },
          { name: "receipt", type: "VarChar", value: values.receiptPrefix },
          { name: "Frequency", type: "VarChar", value: values.frequency },
          {
            name: "Month",
            type: "VarChar",
            value: values.creationMonth.toString(),
          },
          { name: "Unit", type: "VarChar", value: values.variableUnit },
          { name: "Charge", type: "VarChar", value: values.feeCharge },
          { name: "Tax", type: "VarChar", value: values.tax },
          { name: "amount", type: "VarChar", value: values.feeAmount },
          { name: "status", type: "VarChar", value: values.defaultStatus },
          { name: "paymentmethod", type: "VarChar", value: "Cash" },
          { name: "CenterId", type: "Int", value: selectedCenter },
          { name: "ClassId", type: "Int", value: selectedClass },
          { name: "CREATED_BY", type: "Int", value: user },
          { name: "ACTIVE", type: "Int", value: 1 },
        ],
      });
      if (res.data.success) {
        document.getElementById("closeModel")?.click();
        toast.success("Fee added successfully");
        navigate(`/${routes.feeSetup}`);
        setEdit("");
      }
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  const getData = async () => {
    setLoading(true);
    try {
      const res = await api.post("/api/mssql-procedure/execute", {
        procedureName: "FeeGetbyID",
        parameters: [{ name: "ClassId", type: "Int", value: selectedCenter }],
      });
      setFees(res.data.record);
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [selectedCenter]);

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Add Fee</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">Fee Collection</li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Add Fee
                  </li>
                </ol>
              </nav>
            </div>
          </div>
          <div className="card">
            <div className="card-body ">
              <div className="alert alert-danger mb-4">
                <i className="ti ti-alert-circle me-2"></i>
                <strong>Important:</strong> Fee will be made for next month of
                Creation month (for ex. in Jan, Fee for Feb will be raised)
              </div>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {() => (
                  <Form>
                    <div className="row g-3">
                      <div className="col-md-4">
                        <div className="card h-100 border-light shadow-sm">
                          <div className="card-body">
                            <h5 className="card-title text-primary mb-3">
                              Basic Information
                            </h5>
                            <div className="mb-3">
                              <label className="form-label fw-bold">
                                Fee Raise On
                              </label>
                              <Field name="feeRaise" className="form-control" />
                              <ErrorMessage
                                name="feeRaise"
                                component="div"
                                className="text-danger"
                              />
                            </div>
                            <div className="mb-3">
                              <label className="form-label fw-bold">
                                Receipt Prefix
                              </label>
                              <Field
                                name="receiptPrefix"
                                className="form-control"
                              />
                              <ErrorMessage
                                name="receiptPrefix"
                                component="div"
                                className="text-danger"
                              />
                              <button
                                type="submit"
                                className="btn btn-success btn-sm"
                              >
                                Save
                              </button>
                            </div>
                            <p style={{ fontSize: "10px" }}>
                              - number will be issued in sequence, by system /
                              changing prefix will reset number
                            </p>
                            <div className="row">
                              <div className="col-12">
                                <label>Current Fees</label>
                                <SelectClassType
                                  selectedClass={selectedCenter}
                                  selectedCenter={centerId}
                                  handleSelect={handleClassType}
                                  type="classid"
                                />
                              </div>
                            </div>

                            {feesdetail?.map((e: any, i) => {
                              return (
                                <>
                                  <div className="mt-1">
                                    <div className="d-flex text-align-center gap-2 text-primary">
                                      <label
                                        key={i}
                                        className="form-label text-primary"
                                      >
                                        {e.Name}
                                      </label>
                                      <Link
                                        to="#"
                                        onClick={() => setEdit(e.ID)}
                                        className="text-primary"
                                      >
                                        <i className="fa fa-edit" />
                                      </Link>
                                      <Link
                                        to="#"
                                        onClick={() => setEdit(e.ID)}
                                        data-bs-toggle="modal"
                                        className="text-primary"
                                        data-bs-target="#delete-modal"
                                      >
                                        {" "}
                                        <i className="fa fa-trash" />
                                      </Link>
                                    </div>
                                  </div>
                                </>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                      <div className="col-md-8">
                        <div className="card border-light shadow-sm">
                          <div className="card-body">
                            <h5 className="card-title text-primary mb-3">
                              Fee Details
                            </h5>
                            <div className="row">
                              <div className="col-6 mb-3">
                                <label className="form-label fw-bold">
                                  Select Class
                                </label>
                                <SelectClass
                                  selectedClass={selectedClass}
                                  selectedCenter={centerId}
                                  handleSelect={(val:any) => setSelectedClass(val)}
                                  // type="Class"
                                />
                                <ErrorMessage
                                  name="ClassId"
                                  component="div"
                                  className="text-danger"
                                />
                              </div>
                              <div className="col-6 mb-3">
                                <label className="form-label fw-bold">
                                  Fee Name
                                </label>
                                <Field
                                  name="feeName"
                                  className="form-control"
                                />
                                <ErrorMessage
                                  name="feeName"
                                  component="div"
                                  className="text-danger"
                                />
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-6 mb-3">
                                <label className="form-label fw-bold">
                                  Fee Type
                                </label>
                                <Field
                                  as="select"
                                  name="feeType"
                                  className="form-select"
                                >
                                  <option value="">Select Option</option>
                                  <option value="Class Fee">Class Fee</option>
                                  <option value="Additional Services Fee">
                                    Additional Services Fee
                                  </option>
                                </Field>
                              </div>
                              <div className="col-6 mb-3">
                                <label className="form-label fw-bold">
                                  Default Status
                                </label>
                                <Field
                                  as="select"
                                  name="defaultStatus"
                                  className="form-select"
                                >
                                  <option value="">Select Option</option>
                                  <option value="On For All">On For All</option>
                                  <option value="Off For All">
                                    Off For All
                                  </option>
                                </Field>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-6 mb-3">
                                <label className="form-label fw-bold">
                                  Fee Frequency
                                </label>
                                <Field
                                  as="select"
                                  name="frequency"
                                  className="form-select"
                                >
                                  <option value="">Select Option</option>
                                  <option value="Monthly">Monthly</option>
                                  <option value="Quarterly">Quarterly</option>
                                  <option value="Six Monthly">
                                    Six Monthly
                                  </option>
                                  <option value="Yearly">Yearly</option>
                                  <option value="One Time Free">
                                    One Time Free
                                  </option>
                                </Field>
                              </div>
                              <div className="col-6 mb-3">
                                <label className="form-label fw-bold">
                                  Fee Creation Month
                                </label>
                                <Field
                                  as="select"
                                  multiple={true}
                                  name="creationMonth"
                                  style={{height:'60px'}}
                                  className="form-select"
                                >
                                  {monthNames.map((month, i) => (
                                    <option key={i} value={month}>
                                      {month}
                                    </option>
                                  ))}
                                </Field>
                                <ErrorMessage
                                  name="creationMonth"
                                  component="div"
                                  className="text-danger"
                                />
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-6 mb-3">
                                <label className="form-label fw-bold">
                                  Fee Charge
                                </label>
                                <Field
                                  as="select"
                                  name="feeCharge"
                                  className="form-select"
                                >
                                  <option value="">Select</option>
                                  <option value="Fixed">Fixed</option>
                                  <option value="Variable">Variable</option>
                                </Field>
                                <ErrorMessage
                                  name="feeCharge"
                                  component="div"
                                  className="text-danger"
                                />
                              </div>
                              <div className="col-6 mb-3">
                                <label className="form-label fw-bold">
                                  Variable Fee Unit (Hours, Km etc.)
                                </label>
                                <Field
                                  name="variableUnit"
                                  className="form-control"
                                />
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-6 mb-3">
                                <label className="form-label fw-bold">
                                  Fee Amount
                                </label>
                                <Field
                                  name="feeAmount"
                                  className="form-control"
                                />
                                <ErrorMessage
                                  name="feeAmount"
                                  component="div"
                                  className="text-danger"
                                />
                              </div>
                              <div className="col-6 mb-3">
                                <label className="form-label fw-bold">
                                  Tax %
                                </label>
                                <Field name="tax" className="form-control" />
                                <ErrorMessage
                                  name="tax"
                                  component="div"
                                  className="text-danger"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="modal-footer bg-light mt-4">
                     
                      <button type="submit" className="btn btn-primary">
                        Submit
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddFee;
