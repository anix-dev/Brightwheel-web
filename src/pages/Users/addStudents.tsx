import React, { useEffect, useState, useCallback } from "react";
import api from "../../core/data/api";
import { useFormik } from "formik";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import SelectCenter from "../Center/selectCenter";
import { all_routes } from "../../feature-module/router/all_routes";
import SelectClass from "./selectClass";
import SelectClassType from "./SelectClassType";

interface StudentFormValues {
  Image: string;
  center: string;
  enrollmentNumber: string;
  selectedClass: string;
  studentName: string;
  studentMobile: string;
  StudentEmail: string;
  gender: string;
  dob: string;
  Tag:string;
  motherName: string;
  motherEmail: string;
  motherPhone: string;
  fatherName: string;
  fatherPhone: string;
  fatherEmail: string;
}

interface User {
  ID: number;
}

interface RootState {
  user: {
    user: User;
  };
}

const AddStudents = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const user = localStorage.getItem('user');
  const {users} = useSelector((state:any)=>state.user)
  const [formData, setFormData] = useState<Partial<StudentFormValues>>({});
  const [selectedCenter, setSelectedCenter] = useState<string>(users.centerId);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [files, setFiles] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isEditMode = id !== ":id";
  const [imagePath, setImagePath] = useState('');
  console.log(users,"users")
  const formik = useFormik<StudentFormValues>({
    initialValues: {
      Image: formData?.Image || "",
      center: formData?.center || "",
      enrollmentNumber: formData?.enrollmentNumber || "",
      selectedClass: formData?.selectedClass || "",
      studentName: formData?.studentName || "",
      studentMobile: formData?.studentMobile || "",
      StudentEmail: formData?.StudentEmail || "",
      gender: formData?.gender || "",
      dob: formData?.dob || "",
      Tag:formData?.Tag || "",
      motherName: formData?.motherName || "",
      motherEmail: formData?.motherEmail || "",
      motherPhone: formData?.motherPhone || "",
      fatherName: formData?.fatherName || "",
      fatherPhone: formData?.fatherPhone || "",
      fatherEmail: formData?.fatherEmail || "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      // center: Yup.string().required("Center is required."),
      enrollmentNumber: Yup.string().required("Enrollment Number is required."),
      selectedClass: Yup.string().required("Please choose a class."),
      studentName: Yup.string().required("Student Name is required."),
      studentMobile: Yup.string()
        .matches(/^[0-9]{10}$/, "Enter a valid 10-digit mobile number")
        .nullable(),
      // Tag: Yup.string()
      //   .required(" Tag is required")
      //   .nullable(),
      StudentEmail: Yup.string()
        .required("Enter a valid email address")
        .nullable(),
      gender: Yup.string().required("Please select a gender."),
      dob: Yup.string()
        .required("Date of Birth is required")
        // .test("age", "You must be at least 4 years old", function (value) {
        //   if (!value) return false; // No date provided
        //   const birthDate = new Date(value);
        //   const today = new Date();

        //   let age = today.getFullYear() - birthDate.getFullYear();
        //   const hasBirthdayPassedThisYear =
        //     today.getMonth() > birthDate.getMonth() ||
        //     (today.getMonth() === birthDate.getMonth() &&
        //       today.getDate() >= birthDate.getDate());

        //   if (!hasBirthdayPassedThisYear) {
        //     age--;
        //   }

        //   return age >= 4;
        // }),
,
      motherName: Yup.string().required("Mother Name is required."),
      motherEmail: Yup.string()
        .required("Mother Email is required.")
        .email("Enter a valid email address."),
      motherPhone: Yup.string()
        .required("Mother Phone Number is required.")
        .matches(/^[0-9]{10}$/, "Enter a valid 10-digit phone number."),
      fatherName: Yup.string().required("Father Name is required."),
      fatherPhone: Yup.string()
        .matches(/^[0-9]{10}$/, "Enter a valid 10-digit phone number.")
        .nullable(),
      fatherEmail: Yup.string().email("Enter a valid email address").nullable(),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
       
        let imagedata;
        if (files && files.length > 0) {
        const formData = new FormData();
        formData.append('images', files[0]); 
        const response = await api.post("/upload", formData);
        console.log(response,"responseresponseresponseresponseresponse")
         imagedata =response.data.data[0].url;
          setImagePath(imagedata); // store to state
      }else{
        imagedata=formData?.Image
      }
        const parameters = [
          ...(isEditMode ? [{ name: "ID", type: "Int", value: id }] : []),
          {
            name: "EnrolmentNo",
            type: "VarChar",
            value: values.enrollmentNumber,
          },
          { name: "Image", type: "VarChar", value: imagedata },
          { name: "Name", type: "VarChar", value: values.studentName },
          { name: "Gender", type: "VarChar", value: values.gender },
          { name: "DOB", type: "VarChar", value: values.dob },
          { name: "Mobile", type: "VarChar", value: values.studentMobile },
          { name: "Email", type: "VarChar", value: values.StudentEmail },
          { name: "MotherName", type: "VarChar", value: values.motherName },
          { name: "MotherMobile", type: "VarChar", value: values.motherPhone },
          { name: "MotherEmail", type: "VarChar", value: values.motherEmail },
          { name: "FatherName", type: "VarChar", value: values.fatherName },
          { name: "FatherMobile", type: "VarChar", value: values.fatherPhone },
          { name: "Tag", type: "VarChar", value: values.Tag },
          { name: "FatherEmail", type: "VarChar", value: values.fatherEmail },
          { name: "CenterClassesID", type: "Int", value: values.selectedClass },
          { name: "CREATED_BY", type: "Int", value: user },
          { name: "CenterID", type: "Int", value: users.centerId },
          !isEditMode &&{ name: "ParentPassword",type:"VarChar",value:"Parent@123"}
        ].filter(Boolean);;
        
        const procedureName = isEditMode ? "StudentUpdate" : "StudentInsert";
        const res = await api.post("/api/mssql-procedure/execute", {
          procedureName,
          parameters,
        });

        if (res.data.success) {
          toast.success(
            `Student ${isEditMode ? "updated" : "added"} successfully`
          );
          navigate(all_routes.allStudens);
        }
      } catch (error) {
        console.log("Error submitting student:", error);
        toast.error(`Failed to ${isEditMode ? "update" : "add"} student`);
      } finally {
        setIsLoading(false);
      }
    },
  });
  const handleSelect = useCallback(
    (item: string) => {
      setSelectedCenter(item);
      formik.setFieldValue("center", item);
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

  const getData = useCallback(async () => {
    if (!isEditMode) return;

    try {
      const res = await api.post("/api/mssql-procedure/execute", {
        procedureName: "StudentGetbyID",
        parameters: [{ name: "id", type: "Int", value: id }],
      });
      
      if (res.data.success && res.data.record[0]) {
        const record = res.data.record[0];
        setImagePath(record.Image)
        setFormData({
          Image: record.Image || "",
          Tag:record.Tag || "",
          center: record.CenterID || "",
          enrollmentNumber: record.EnrolmentNo || "",
          selectedClass: record.CenterClassesID || "",
          studentName: record.Name || "",
          studentMobile: record.Mobile || "",
          StudentEmail: record.Email || "",
          gender: record.Gender || "",
          dob: record.DOB || "",
          motherName: record.MotherName || "",
          motherEmail: record.MotherEmail || "",
          motherPhone: record.MotherMobile || "",
          fatherName: record.FatherName || "",
          fatherPhone: record.FatherMobile || "",
          fatherEmail: record.FatherEmail || "",
        });
        setSelectedCenter(record.CenterID || "");
        setSelectedClass(record.CenterClassesID || "");
      }
    } catch (error) {
      console.log("Error fetching student data:", error);
      toast.error("Failed to load student data");
    }
  }, [id, isEditMode]);

  useEffect(() => {
    if (isEditMode) {
      getData();
    }
  }, [isEditMode, getData]);

  const renderError = (field: keyof StudentFormValues) => {
    return formik.touched[field] && formik.errors[field] ? (
      <div className="text-danger">{formik.errors[field]}</div>
    ) : null;
  };
  return (
    <div className="page-wrapper">
      <div className="content content-two">
        <div className="card board-hover mb-3 mt-3">
          <h2 className="m-3 mb-1" style={{ marginLeft: "10px" }}>
            {isEditMode ? "Edit" : "Add"} Student
          </h2>
          <div style={{ margin: "20px" }}>
            <div className="modal-body">
              <form onSubmit={formik.handleSubmit}>

                <div className="row">
                 
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">Enrollment Number *</label>
                      <input
                        type="text"
                        className="form-control"
                        {...formik.getFieldProps("enrollmentNumber")}
                      />
                      {renderError("enrollmentNumber")}
                    </div>
                  </div>
                 <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">Upload Image *</label>
                      <input
                        type="file"
                        accept="image/*"
                        className="form-control"
                        onChange={(e:any)=>setFiles(e.target.files)}
                        // {...formik.getFieldProps("Image")}
                      />
                      {renderError("Image")}
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label>Select Class</label>
                      <SelectClassType
                        selectedClass={selectedClass}
                        selectedCenter={selectedCenter}
                          handleSelect={handleClass}
                          type="classId"

                        {...formik.getFieldProps("selectedClass")}
                      />
                      {renderError("selectedClass")}
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">Student Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        {...formik.getFieldProps("studentName")}
                      />
                      {renderError("studentName")}
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">Gender *</label>
                      <select
                        className="form-select"
                        {...formik.getFieldProps("gender")}
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                      {renderError("gender")}
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">Date Of Birth *</label>
                      <input
                        type="date"
                        className="form-control"
                        {...formik.getFieldProps("dob")}
                      />
                      {renderError("dob")}
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">RFID Tag</label>
                      <input
                        type="text"
                        className="form-control"
                        {...formik.getFieldProps("Tag")}
                      />
                      {renderError("Tag")}
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">Student Mobile</label>
                      <input
                        type="tel"
                        className="form-control"
                        {...formik.getFieldProps("studentMobile")}
                      />
                      {renderError("studentMobile")}
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label"> Parent Communication Email*</label>
                      <input
                        type="email"
                        className="form-control"
                        {...formik.getFieldProps("StudentEmail")}
                      />
                      {renderError("StudentEmail")}
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">Mother Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        {...formik.getFieldProps("motherName")}
                      />
                      {renderError("motherName")}
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">
                        Mother Phone Number *
                      </label>
                      <input
                        type="tel"
                        className="form-control"
                        {...formik.getFieldProps("motherPhone")}
                      />
                      {renderError("motherPhone")}
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">Mother Email *</label>
                      <input
                        type="email"
                        className="form-control"
                        {...formik.getFieldProps("motherEmail")}
                      />
                      {renderError("motherEmail")}
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">Father Name</label>
                      <input
                        type="text"
                        {...formik.getFieldProps("fatherName")}
                        className="form-control"
                        placeholder="Enter Father's Name"
                      />
                      {renderError("fatherName")}
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">
                        Father Mobile Numbers
                      </label>
                      <input
                        type="tel"
                        {...formik.getFieldProps("fatherPhone")}
                        className="form-control"
                        placeholder="Enter Father's Mobile Number"
                      />
                      {renderError("fatherPhone")}
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">Father Email Id</label>
                      <input
                        type="email"
                        {...formik.getFieldProps("fatherEmail")}
                        className="form-control"
                        placeholder="Enter Father's Email"
                      />
                      {renderError("fatherEmail")}
                    </div>
                  </div>

                  <div className="col-lg-12">
                    <p className="text-muted">
                      * Mobile Number should be as Country Code + Mobile
                      (Example - 919876543210)
                      <br />
                      * Account password would be student first name(first
                      letter capital) followed by year of birth. Ex: - for
                      student Nitin Gupta with year of birth 2015 password would
                      be Nitin2015.
                      <br />* Email Id is must for one parent (mother), Father
                      details will be added only if father email id provided.
                    </p>
                  </div>

                  <div className="modal-footer gap-2">
                    {/* <button
                      type="submit"
                      //  className="btn btn-primary btn-sm"
                      data-bs-toggle="modal"
                      data-bs-target="#edit_address_information"
                      className="btn btn-primary"
                      disabled={isLoading}
                    >
                      {isLoading ? "Processing..." : "Cam Timing"}
                    </button> */}
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isLoading}
                    >
                      {isLoading
                        ? "Processing..."
                        : isEditMode
                        ? "Update"
                        : "Add Student"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id="edit_address_information">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">User Live CCTV Access Time</h4>
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
                <p>User Live Cam = All Cam Slots</p>

                <div className="row">
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="form-label">From Hour </label>
                      <select className="form-control">
                        {[...Array(24)].map((_, i) => (
                          <option key={i} value={i}>
                            {i}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">From Minute</label>
                      <select className="form-control">
                        {[...Array(60)].map((_, i) => (
                          <option key={i} value={i}>
                            {i}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">To Hour</label>
                      <select className="form-control">
                        {[...Array(24)].map((_, i) => (
                          <option key={i} value={i}>
                            {i}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">To Minute</label>
                      <select className="form-control">
                        {[...Array(60)].map((_, i) => (
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
                  Add Slot
                </Link>
                <Link
                  to="#"
                  className="btn btn-primary"
                  data-bs-dismiss="modal"
                >
                  Remove Slot
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddStudents;
