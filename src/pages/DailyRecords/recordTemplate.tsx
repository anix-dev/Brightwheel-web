import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../feature-module/router/all_routes";
import SelectClass from "../Users/selectClass";
import * as Yup from "yup";
import { getIn } from "formik";
import { useFormik } from "formik";
import SelectCenter from "../Center/selectCenter";
import "./report.css";
import { useSelector } from "react-redux";
import TextField from "@mui/material/TextField";
import { toast } from "react-toastify";
import Loading from "../../core/common/loader/Loading";
import Swal from "sweetalert2";
import api from "../../core/data/api";
import SelectRecord from "./SelectRecord";
import SelectClassType from "../Users/SelectClassType";

interface Template {
  sample: string;
  name: string;
  selectedCenter: string;
  selectedClass: string;
  type: string;
}
interface question {
  category: string;
  questionType: string;
  questionText: string;
  options: {
    text: string;
  }[];
}

interface User {
  ID: number;
}
interface RootState {
  user: {
    user: User;
  };
}
const RecordTemplate = () => {
  const routes = all_routes;
  const [loading, setLoading] = useState(false);
  const [selectedName, setSelectedName] = useState<string>("");
  const [Name, setName] = useState<string>("");

  const [data, setData] = useState<[]>([]);
  const [selectedCenter, setSelectedCenter] = useState<string>("16");
  const [selectedClass, setSelectedClass] = useState<string>("1018");
  const user = localStorage.getItem("user");
  const [id, setId] = useState("");

  const GetData = async () => {
    setLoading(true);
    try {
      const res = await api.post("/api/mssql-procedure/execute/get", {
        procedureName: "RecordGetAll",
        parameters: [],
      });
      if (res.data.success) {
        setData(res.data.centers);
      }
    } catch (error: any) {
      setLoading(false);
      console.log("Error fetching centers:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    GetData();
  }, []);
  const formik = useFormik<Template>({
    initialValues: {
      sample: "",
      name: "",
      type: "",
      selectedCenter: "",
      selectedClass: "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      selectedCenter: Yup.string().required("Center is required"),
      selectedClass: Yup.string().required("Class is required"),
      sample: Yup.string().required("Please choose sample "),
      name: Yup.string().required("Template is required"),
      type: Yup.string().required("Please choose type "),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const parameters = [
          { name: "Name", type: "VarChar", value: values.name },
          { name: "Sample", type: "VarChar", value: values.sample },
          { name: "type", type: "VarChar", value: values.type },
          { name: "ClassId", type: "Int", value: values.selectedClass },
          { name: "CREATED_BY", type: "Int", value: user },
          { name: "CenterId", type: "Int", value: values.selectedCenter },
        ];
        const res = await api.post("/api/mssql-procedure/execute", {
          procedureName: "RecordInsert",
          parameters,
        });
        if (res.data.success) {
          document.getElementById("closeModal")?.click();
          toast.success(`Template added  successfully`);
          await GetData()
          setId("")

        }
      } catch (error) {
      }
    },
  });
  const formik2 = useFormik<question>({
    initialValues: {
      category: "",
      questionType: "",
      questionText: "",
      options: Array(5).fill({ text: ""}),
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      questionType: Yup.string().required("Question Type  is required"),
      category: Yup.string().required("Category is required"),
      questionText: Yup.string().required("Text is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const parameters = [
          { name: "Name", type: "VarChar", value: values.questionText },
          { name: "category", type: "VarChar", value: values.category },
          { name: "type", type: "VarChar", value: values.questionType },
          { name: "recordId", type: "Int", value: id },
          {name: "option",type: "VarChar", value: values.options.map((opt) => opt.text).join(",")},
          { name: "value", type: "VarChar", value: values.options.map((opt) => opt.text).join(",") },
        ];
        const res = await api.post("/api/mssql-procedure/execute", {
          procedureName: "QuestionInsert",
          parameters,
        });
        if (res.data.success) {
         
           document.getElementById("closeModal")?.click();

          toast.success(`Question added  successfully`);
          setId("")

        }
      } catch (error) {
      }
    },
  });
  const renderError2 = (fieldPath: string) => {
    const touched = getIn(formik2.touched, fieldPath);
    const error = getIn(formik2.errors, fieldPath);
    return touched && error ? <div className="text-danger">{error}</div> : null;
  };
  const handleSelect = useCallback(
    (item: string) => {
      setSelectedCenter(item);
      formik.setFieldValue("selectedCenter", item);
    },
    [formik]
  );
  const handleName = useCallback(
    (item: string) => {
      setSelectedName(item);
      formik.setFieldValue("sample", item);
      formik.setFieldValue("name", item);
    },
    [formik]
  );
  const handleData = useCallback(
    (item: string) => {
      setName(item);
      formik.setFieldValue("sample", item);
      formik.setFieldValue("name", item);
    },
    [formik]
  );
  const handleClass = useCallback(
    (item: string) => {
      setSelectedClass(item);
      formik.setFieldValue("selectedClass", item);
    },
    [formik]
  );
  const renderError = (field: keyof Template) => {
    return formik.touched[field] && formik.errors[field] ? (
      <div className="text-danger">{formik.errors[field]}</div>
    ) : null;
  };
  const handleDelete = async (id: any) => {
    setLoading(true);
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        const res = await api.post("/api/mssql-procedure/execute", {
          procedureName: "RecordDelete",
          parameters: [{ name: "ID", type: "Int", value: id }],
        });
        Swal.fire({
          title: "Deleted!",
          text: "Your record has been deleted.",
          icon: "success",
        });
        await GetData();
        setId("")
      }
    } catch (error) {
      console.log("Deletion error:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
  const modalEl = document.getElementById("edit_address_information");
  const handleModalClose = () => {
    formik.resetForm(); 
    setSelectedName("");
    setName("");
  };

  if (modalEl) {
    modalEl.addEventListener("hidden.bs.modal", handleModalClose);
  }

  return () => {
    if (modalEl) {
      modalEl.removeEventListener("hidden.bs.modal", handleModalClose);
    }
  };
}, [formik,setName,setSelectedName]);
  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Record Templates</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">Daily Reports</li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Record Templates
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content justify-content-end flex-wrap">
              <div className="mb-2">
                <Link
                  to=""
                  data-bs-toggle="modal"
                  data-bs-target="#edit_address_information"
                  className="btn btn-primary"
                >
                  <i className="ti ti-square-rounded-plus me-2" />
                  New Template
                </Link>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
              <h4 className="mb-3">Templates</h4>
            </div>
            <div className="card-body p-0 py-3">
              {loading ||
                (data.length == 0 && (
                  <p className="d-flex justify-content-center">
                    Data not Available
                  </p>
                ))}
              {loading ? (
                <Loading />
              ) : (
                <div className="row">
                  {data?.map((e: any, i: any) => {
                    return (
                      <>
                        <div className="col-12 col-md-6 col-xl-4 mb-4">
                          <div className="card">
                            <div
                              className="card-header"
                              style={{ background: "#f3e7e738" }}
                            >
                              <div className="d-flex align-items-center w-100">
                                <div className="">
                                  <div className="fs-17 fw-semibold">
                                    {e.Name}
                                  </div>
                                  <p className="mb-0 text-muted fs-15">
                                    {e.type} / 2 Questions
                                  </p>
                                </div>
                                <div className="dropdown ms-auto">
                                  <button
                                    className="btn btn-icon btn-sm btn-outline-secondary rounded-circle"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                  >
                                    <i className="fas fa-ellipsis-v" />
                                  </button>
                                  <ul className="dropdown-menu dropdown-menu-end">
                                    {/* <li>
                                      <button
                                        className="dropdown-item"
                                        data-bs-toggle="modal"
                                        data-bs-target="#edit_address_information"
                                      >
                                        <i className="fas fa-eye me-2"></i>
                                        View/Edit
                                      </button>
                                    </li> */}
                                    <li>
                                      <button
                                        className="dropdown-item text-danger"
                                        onClick={() => handleDelete(e.ID)}
                                      >
                                        <i className="fas fa-trash me-2"></i>
                                        Delete
                                      </button>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                            <div className="card-body">
                              <div className="mb-3">
                                <strong style={{ color: "#000000b0" }}>
                                  Schools :{" "}
                                </strong>{" "}
                                <span
                                  style={{
                                    paddingLeft: "110px",
                                    fontSize: "14px",
                                    fontWeight: " 500",
                                    color: "#000000ba ",
                                  }}
                                >
                                  {e.centername}
                                </span>
                              </div>
                              <p>
                                <strong style={{ color: "#000000b0" }}>
                                  Centers :{" "}
                                </strong>{" "}
                                <span
                                  style={{
                                    paddingLeft: "110px",
                                    fontSize: "14px",
                                    fontWeight: " 500",
                                    color: "#000000ba ",
                                  }}
                                >
                                  {e.centername}
                                </span>
                              </p>
                              <p>
                                <strong style={{ color: "#000000b0" }}>
                                  Classes :{" "}
                                </strong>{" "}
                                <span
                                  style={{
                                    paddingLeft: "110px",
                                    fontSize: "14px",
                                    fontWeight: " 500",
                                    color: "#000000ba ",
                                  }}
                                >
                                  {e.classname}
                                </span>
                              </p>
                            </div>
                            <div
                              className="card-footer"
                              style={{ background: "#a59b9b2b" }}
                            >
                              <div className="d-flex justify-content-center">
                                <div className="fs-semibold fs-14"></div>
                                <div className="fw-semibold text-white">
                                  <button
                                    className="btn btn-primary btn-sm"
                                    data-bs-toggle="modal"
                                    onClick={() => setId(e.ID)}
                                    data-bs-target="#question"
                                  >
                                    + Question
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="modal fade" id="edit_address_information">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">New Record Template</h4>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                   id="closeModal"
                >
                  <i className="ti ti-x" />
                </button>
              </div>
              <form onSubmit={formik.handleSubmit}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label">
                          Choose Sample Template
                        </label>
                        <SelectRecord
                          setName={Name}
                          selectedCenter={selectedName}
                          handleSelect={handleName}
                          {...formik.getFieldProps("sample")}
                        />
                        {renderError("sample")}
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Template Name*</label>
                        {
                          selectedName ?
                          <input
                          type="text"
                          disabled={!!selectedName}
                          style={{
                            cursor: selectedName ? "not-allowed" : "",
                          }}
                          value={selectedName}
                          className="form-control"
                          onChange={(e: any) => handleData(e.target.value)}
                          // {...formik.getFieldProps("name")}
                        />:
                        <input
                          type="text"
                          disabled={!!selectedName}
                          style={{
                            cursor: selectedName ? "not-allowed" : "",
                          }}
                          
                          className="form-control"
                          onChange={(e: any) => handleData(e.target.value)}
                          // {...formik.getFieldProps("name")}
                        />
                        }
                        
                        {renderError("name")}
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Record Type</label>
                        <select
                          className="form-control"
                          {...formik.getFieldProps("type")}
                        >
                          {["Select Type","daily", "weekly", "monthly", "as needed"].map(
                            (option, i) => (
                              <option key={i} value={option}>
                                {option}
                              </option>
                            )
                          )}
                        </select>
                        {renderError("type")}
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Centers*</label>
                        <SelectCenter
                          selectedCenter={selectedCenter}
                          handleSelect={handleSelect}
                          {...formik.getFieldProps("selectedCenter")}
                        />
                        {renderError("selectedCenter")}
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Class*</label>
                        <SelectClassType
                          selectedCenter={selectedCenter}
                          selectedClass={selectedClass}
                          type="classid"
                          handleSelect={(val:any) => handleClass(val)}
                          {...formik.getFieldProps("selectedClass")}
                        />
                        {renderError("selectedClass")}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                   type="submit" 
                   disabled={loading}
                   className="btn btn-primary me-2">
                    Add Template
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="modal fade" id="question">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">New Question Add</h4>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                   id="closeModal"
                >
                  <i className="ti ti-x" />
                </button>
              </div>
              <form onSubmit={formik2.handleSubmit}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label">
                          Choose Question Type*{" "}
                        </label>
                        <select
                          className="form-control"
                          {...formik2.getFieldProps("questionType")}
                        >
                          {["Remark", "Option"].map((option, i) => (
                            <option key={i} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                        {renderError2("questionType")}
                      </div>

                      <div className="mb-3">
                        <label className="form-label">
                          Choose Question Category *
                        </label>
                        <select
                          className="form-control"
                          {...formik2.getFieldProps("category")}
                        >
                          {[
                            "Health",
                            "Education",
                            "Learning Skills ",
                            "Physical Activity",
                            "Hygiene",
                            "Social Skills",
                            "Language",
                            "Behavioural",
                          ].map((option, i) => (
                            <option key={i} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                        {renderError2("category")}
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Question Text*</label>
                        <input
                          className="form-control"
                          type="text"
                          {...formik2.getFieldProps("questionText")}
                        />
                        {renderError2("questionText")}
                      </div>
                      {formik2.values.questionType === "Option" && (
                        <div className="mb-3">
                          <label className="form-label">Question Text*</label>
                          <div className="card-body">
                            {[...Array(5)].map((_, i) => (
                              <div className="row" key={i}>
                                <div className="col-12">
                                  <TextField
                                    id={`option-text-${i}`}
                                    name={`options[${i}].text`}
                                    label={`Option - ${i} *`}
                                    variant="standard"
                                    style={{width:'100%'}}
                                    value={formik2.values.options[i].text}
                                    onChange={formik2.handleChange}
                                    onBlur={formik2.handleBlur}
                                  />
                                </div>
                                
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="submit"
                    className="btn btn-primary me-2"
                    data-bs-dismiss="modal"
                    disabled={loading}
                  >
                    Add Question
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecordTemplate;
