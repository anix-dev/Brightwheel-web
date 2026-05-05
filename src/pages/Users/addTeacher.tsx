import React, { useEffect, useState, useCallback } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router";
import SelectCenter from "../Center/selectCenter";
import api from "../../core/data/api";
import { toast } from "react-toastify";
import { all_routes } from "../../feature-module/router/all_routes";
import moment from "moment";
import SelectClassType from "./SelectClassType";
import { useSelector } from "react-redux";
type SelectedClass = {
  id: number;
  name: string;
};

const AddTeacher = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const resolvedIdNullable = id ? parseInt(id, 10) : null;
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [files, setFiles] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const  user =localStorage.getItem("user")
  const {users} = useSelector((state:any)=>state.user)
  const [selectedCenter, setSelectedCenter] = useState<string>(users.centerId);
  const [singledata, setSingleData] = useState<any>({});
  const [classes, setClasses] = useState<any>([]);
  const [selectedClass, setSelectedClass] = useState<string>("");

  const singleData = async () => {
    try {
      setLoading(true);
      const res = await api.post("/api/mssql-procedure/execute", {
        procedureName: "TeacherGetbyID",
        parameters: [{ name: "id", type: "Int", value: id }],
      });
      if (res.data.success) {
        const filteredCenters = res.data.record[0];
        setSingleData(filteredCenters);
        setSelectedClass(res.data.record[0]?.ClassID)
        setSelectedCenter(res.data.record[0]?.CenterID);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };
  const formik = useFormik<any>({
    initialValues: {
      Image: singledata?.Image || "",
      center: singledata.CenterID ||selectedCenter|| "",
      className: singledata.ClassID|| selectedClass || "",
      teacherName: singledata.TeacherName || "",
      rfid: singledata.Tag || "",
      dateOfJoining:moment(singledata.DateOfJoining).format("YYYY-MM-DD") || "",
      mobileNumber: singledata.MobileNumber || "",
      userMobileNumber: singledata.UserMobileNumber || "",
      learningLevel: singledata.LearningLevel || "",
      gender: singledata.Gender || "",
      email: singledata.Email || "",
      dateOfBirth: moment(singledata.DateOfBirth).format("YYYY-MM-DD") || "",
      subject: singledata.Subjects || "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      // center: Yup.string().required("Center is required."),
      className: Yup.string().required("Class is required"),
      teacherName: Yup.string().required("Teacher Name is required"),
      // rfid: Yup.string().required("RFID Tag is required"),
      dateOfJoining: Yup.date().required("Date of Joining is required"),
      subject: Yup.string(),
      mobileNumber: Yup.string()
        .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits")
        .required("Mobile Number is required"),
      userMobileNumber: Yup.string().matches(
        /^[0-9]{10}$/,
        "Mobile number must be 10 digits"
      ),
      learningLevel: Yup.string().required("Learning Level is required"),
      gender: Yup.string().required("Gender is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      dateOfBirth: Yup.date()
        .required("Date of Birth is required")
        .test("age", "You must be at least 18 years old", function (value) {
          if (!value) return false; // If no date is provided
          const today = new Date();
          const birthDate = new Date(value);
          const age = today.getFullYear() - birthDate.getFullYear();
          const m = today.getMonth() - birthDate.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            return age - 1 >= 18;
          }
          return age >= 18;
        }),
    }),
    onSubmit: async (values) => {
      try {
        let imagedata;
        if (files && files.length > 0) {
          const formData = new FormData();
          formData.append("images", files[0]);
          const response = await api.post("/upload", formData);
           imagedata =response.data.data[0].url;
        }else{
        imagedata= singledata.Image
      }
        
        if (id != ":id") {
          let parameters;
          parameters = [
            { name: "TeacherID", type: "Int", value: id },
            { name: "ClassName", type: "Int", value: selectedClass },
            { name: "TeacherName", type: "VarChar", value: values.teacherName },
            { name: "Tag", type: "VarChar", value: values.rfid },
            { name: "DateOfJoining", type: "Date", value: values.dateOfJoining },
            { name: "Image", type: "VarChar", value: imagedata },
            { name: "MobileNumber", type: "VarChar", value: values.mobileNumber },
            { name: "UserMobileNumber", type: "VarChar", value: values.userMobileNumber || null },
            { name: "LearningLevel", type: "VarChar", value: values.learningLevel },
            { name: "Gender", type: "VarChar", value: values.gender },
            { name: "Email", type: "VarChar", value: values.email },
            { name: "CenterID", type: "Int", value: selectedCenter },
            { name: "ClassID", type: "Int", value: selectedClass },
            { name: "DateOfBirth", type: "Date", value: values.dateOfBirth },
            { name: "CreatedBy", type: "Int", value: user },

          ];
          const res = await api.post("/api/mssql-procedure/execute", {
            procedureName: "TeacherUpdate",
            parameters,
          });
          if (res.data.success) {
            toast.success("Teacher updated successfully");
            navigate(all_routes.allTeacher);
          }
        } else {
          const res = await api.post("/api/mssql-procedure/execute", {
            procedureName: "TeacherInsert",
            parameters: [
              { name: "ClassName", type: "Int", value: selectedClass },
              { name: "Tag", type: "VarChar", value: values.rfid },
              { name: "TeacherName", type: "VarChar", value: values.teacherName },
              { name: "Image", type: "VarChar", value: imagedata },
              { name: "DateOfJoining", type: "Date", value: values.dateOfJoining },
              { name: "MobileNumber", type: "VarChar", value: values.mobileNumber },
              { name: "UserMobileNumber", type: "VarChar", value: values.userMobileNumber || null },
              { name: "LearningLevel", type: "VarChar", value: values.learningLevel },
              { name: "ClassID", type: "Int", value: selectedClass },
              { name: "Gender", type: "VarChar", value: values.gender },
              { name: "Email", type: "VarChar", value: values.email },
              { name: "CenterID", type: "Int", value: selectedCenter },
              { name: "DateOfBirth", type: "Date", value: values.dateOfBirth },
              { name: "Subjects", type: "VarChar", value: values.subject },
              { name: "CreatedBy", type: "Int", value: user },
            ],
          });

          if (res.data.success) {
            toast.success("Teacher added successfully! ");
            navigate(all_routes.allTeacher);
          }
        }
      } catch (error) {
        console.log("Error inserting teacher:", error);
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
  useEffect(() => {
    const getCenter = async () => {
      try {
        setLoading(true);

        const res = await api.post("/api/mssql-procedure/execute/get", {
          procedureName: "ClassesGetAll",
          parameters: [],
        });

        if (res.data?.centers && Array.isArray(res.data.centers)) {
          const filteredCenters = res.data.centers
            .filter((center: any) => selectedCenter == center?.CenterID)
            .map((center: any) => ({
              ClassName: center.ClassName,
              id: center.ID,
            }));

          setClasses(filteredCenters);
        } else {
          console.warn("No centers found in response.");
          setClasses([]);
        }
      } catch (error: any) {
        console.log("Error fetching centers:", error);
      } finally {
        setLoading(false);
      }
    };

    if (selectedCenter?.length) {
      getCenter();
    }
  }, [selectedCenter]);

  useEffect(() => {
    if (id!=':id') {
      singleData();
      setIsEdit(true);
    }
    setIsEdit(!resolvedIdNullable === false);
  }, [id!=':id']);

 
  return (
    <div>
      <div className="page-wrapper">
        <div className="content content-two">
          <div className="card board-hover mb-3 mt-3">
            <h2 className="m-3 mb-1" style={{ marginLeft: "10px" }}>
              {id !== ":id" ? "Edit" : "Add"} Teacher
            </h2>
            <div className="" style={{ margin: "20px" }}>
              <div className="modal-content">
                <div className="modal-body">
                  <form onSubmit={formik.handleSubmit}>
                    <div className="row">
                      {/* <div className="col-lg-6">
                        <div className="mb-3">
                          <SelectCenter
                            selectedCenter={selectedCenter}
                            handleSelect={handleSelect}
                            {...formik.getFieldProps("center")}
                          />
                          {formik.touched.center &&
                          typeof formik.errors.center === "string" ? (
                            <div className="text-danger">
                              {formik.errors.center}
                            </div>
                          ) : null}
                        </div>
                      </div> */}
                      <div className="col-lg-6">
                        <div className="mb-3">
                          <label className="form-label">Upload Image *</label>
                          <input
                            type="file"
                            accept="image/*"
                            className="form-control"
                            onChange={(e: any) => setFiles(e.target.files)}
                            // {...formik.getFieldProps("Image")}
                          />
                        </div>
                      </div>
                       <div className="col-lg-6">
                        <div className="mb-3">
                          <label className="form-label">Date of Birth *</label>
                          <input
                            type="date"
                            className="form-control"
                            {...formik.getFieldProps("dateOfBirth")}
                          />
                          {formik.touched.dateOfBirth &&
                          typeof formik.errors.dateOfBirth === "string" ? (
                            <div className="text-danger">
                              {formik.errors.dateOfBirth}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                    <div className="row">
                     
                   <div className="col-lg-6">
                    <div className="mb-3">
                      <label>Select Class</label>
                      <SelectClassType
                        selectedClass={selectedClass}
                        selectedCenter={selectedCenter}
                          handleSelect={handleClass}
                          type="classId"
                           {...formik.getFieldProps("className")}
                          />
                        {formik.touched.className &&
                          typeof formik.errors.className === "string" ? (
                            <div className="text-danger">
                              {formik.errors.className}
                            </div>
                          ) : null}
                     
                    </div>
                  </div>
                      {/* Name of Teacher */}
                      <div className="col-lg-6">
                        <div className="mb-3">
                          <label className="form-label">
                            Name of Teacher *
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            {...formik.getFieldProps("teacherName")}
                          />
                          {formik.touched.teacherName &&
                          typeof formik.errors.teacherName === "string" ? (
                            <div className="text-danger">
                              {formik.errors.teacherName}
                            </div>
                          ) : null}
                        </div>
                      </div>

                      {/* Date of Joining */}
                      <div className="col-lg-6">
                        <div className="mb-3">
                          <label className="form-label">
                            Date of Joining *
                          </label>
                          <input
                            type="date"
                            className="form-control"
                            {...formik.getFieldProps("dateOfJoining")}
                          />
                          {formik.touched.dateOfJoining &&
                          typeof formik.errors.dateOfJoining === "string" ? (
                            <div className="text-danger">
                              {formik.errors.dateOfJoining}
                            </div>
                          ) : null}
                        </div>
                      </div>

                      {/* Mobile Number */}
                      <div className="col-lg-6">
                        <div className="mb-3">
                          <label className="form-label">Mobile Number *</label>
                          <input
                            type="tel"
                            className="form-control"
                            {...formik.getFieldProps("mobileNumber")}
                          />
                          {formik.touched.mobileNumber &&
                          typeof formik.errors.mobileNumber === "string" ? (
                            <div className="text-danger">
                              {formik.errors.mobileNumber}
                            </div>
                          ) : null}
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="mb-3">
                          <label className="form-label">RFID Tag *</label>
                          <input
                            type="tel"
                            className="form-control"
                            {...formik.getFieldProps("rfid")}
                          />
                          {formik.touched.rfid &&
                          typeof formik.errors.rfid === "string" ? (
                            <div className="text-danger">
                              {formik.errors.rfid}
                            </div>
                          ) : null}
                        </div>
                      </div>
                      {/* User Mobile Number */}
                      <div className="col-lg-6">
                        <div className="mb-3">
                          <label className="form-label">
                            Mobile Number for User
                          </label>
                          <input
                            type="tel"
                            className="form-control"
                            {...formik.getFieldProps("userMobileNumber")}
                          />
                          {formik.touched.userMobileNumber &&
                          typeof formik.errors.userMobileNumber === "string" ? (
                            <div className="text-danger">
                              {formik.errors.userMobileNumber}
                            </div>
                          ) : null}
                        </div>
                      </div>

                      {/* Learning Level */}
                      <div className="col-lg-6">
                        <div className="mb-3">
                          <label className="form-label">
                            Choose Learning Level *
                          </label>
                          <select
                            className="form-select"
                            {...formik.getFieldProps("learningLevel")}
                          >
                            <option>Select Learning Level</option>
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                          </select>
                          {formik.touched.learningLevel &&
                          typeof formik.errors.learningLevel === "string" ? (
                            <div className="text-danger">
                              {formik.errors.learningLevel}
                            </div>
                          ) : null}
                        </div>
                      </div>

                      <div className="col-lg-6">
                        <div className="mb-3">
                          <label className="form-label">Subject *</label>
                          <input
                            type="text"
                            className="form-control"
                            {...formik.getFieldProps("subject")}
                          />
                          {formik.touched.subject &&
                          typeof formik.errors.subject === "string" ? (
                            <div className="text-danger">
                              {formik.errors.subject}
                            </div>
                          ) : null}
                        </div>
                      </div>
                      {/* Gender */}
                      <div className="col-lg-6">
                        <div className="mb-3">
                          <label className="form-label">Gender *</label>
                          <select
                            className="form-select"
                            {...formik.getFieldProps("gender")}
                          >
                            <option>Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                          {formik.touched.gender &&
                          typeof formik.errors.gender === "string" ? (
                            <div className="text-danger">
                              {formik.errors.gender}
                            </div>
                          ) : null}
                        </div>
                      </div>

                      {/* Email */}
                      <div className="col-lg-6">
                        <div className="mb-3">
                          <label className="form-label">Email *</label>
                          <input
                            type="email"
                            className="form-control"
                            {...formik.getFieldProps("email")}
                          />
                          {formik.touched.email &&
                          typeof formik.errors.email === "string" ? (
                            <div className="text-danger">
                              {formik.errors.email}
                            </div>
                          ) : null}
                        </div>
                      </div>

                      {/* Date of Birth */}
                     
                    </div>
                    <div className="modal-footer">
                      <button type="submit" className="btn btn-primary">
                        {id !== ":id" ? "Update" : "Add Teacher"}{" "}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTeacher;
