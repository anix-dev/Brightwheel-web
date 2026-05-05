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
import SelectClass from "../Users/selectClass";
import SelectClassType from "../Users/SelectClassType";

interface StudentFormValues {
  Image: string;
  center: string;
  Subject: string;
  selectedClass: string;
  notes: string;
}

interface User {
  ID: number;
}

interface RootState {
  user: {
    user: User;
  };
}

const AddAssignments = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const user = localStorage.getItem('user')
  const [formData, setFormData] = useState<Partial<StudentFormValues>>({});
  const [selectedCenter, setSelectedCenter] = useState<string>("");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [files, setFiles] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isEditMode = id !== ":id";
  const formik = useFormik<StudentFormValues>({
    initialValues: {
      Image: formData?.Image || "",
      center: formData?.center || "",
      Subject: formData?.Subject || "",
      selectedClass: formData?.selectedClass || "",
      notes: formData?.notes || ""
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      center: Yup.string().required("Center is required."),
      selectedClass: Yup.string().required("Please choose a class."),
      Subject: Yup.string().required("Subject is required."),
      notes: Yup.string()
        .required("description is required")
        .nullable()
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      try { 
        let imagedata;
        if (files && files.length > 0) {
        const formData = new FormData();
        formData.append('images', files[0]); 
        const response = await api.post("/uploads", formData);
         imagedata =response.data.data[0].url;
        }
        const parameters = [
          ...(isEditMode ? [{ name: "ID", type: "Int", value: id }] : []),
          { name: "Image", type: "VarChar", value: imagedata },
          { name: "TeacherId", type: "VarChar", value: user },
          { name: "notes", type: "VarChar", value: values.notes },
          { name: "Subject", type: "VarChar", value: values.Subject },
          { name: "ClassId", type: "Int", value: values.selectedClass },
          { name: "CREATED_BY", type: "Int", value: user },
          { name: "ACTIVE", type: "Int", value: "1"},
          { name: "CenterId", type: "Int", value: values.center },
        ];
        
        const procedureName = isEditMode ? "AssignmentUpdate" : "AssignmentInsert";
        const res = await api.post("/api/mssql-procedure/execute", {
          procedureName,
          parameters,
        });

        if (res.data.success) {
          toast.success(
            `Assignment ${isEditMode ? "updated" : "added"} successfully`
          );
          navigate(all_routes.Assignment);
        }
      } catch (error) {
        console.log("Error submitting student:", error);
        // toast.error(`Failed to ${isEditMode ? "update" : "add"} assignment`);
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
        setFormData({
          Image: record.Image || "",
          center: record.CenterId || "",
          selectedClass: record.ClassId || "",
          notes: record.notes || "",
          Subject: record.Subject || ""
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
            {isEditMode ? "Edit" : "Add"} Assignment
          </h2>
          <div style={{ margin: "20px" }}>
            <div className="modal-body">
              <form onSubmit={formik.handleSubmit}>

                <div className="row">
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label>Select Center</label>
                      <SelectCenter
                        selectedCenter={selectedCenter}
                        handleSelect={handleSelect}
                        {...formik.getFieldProps("center")}
                      />
                      {renderError("center")}
                    </div>
                  </div>
                
                 <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">Upload Media *</label>
                      <input
                        type="file"
                        accept=".pdf,.ppt,.pptx,image/*,video/*"
                        className="form-control"
                        onChange={(e:any)=>setFiles(e.target.files)}
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
                            type="classid"
                        {...formik.getFieldProps("selectedClass")}
                      />
                      {renderError("selectedClass")}
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">Subject *</label>
                      <input
                        type="text"
                        className="form-control"
                        {...formik.getFieldProps("Subject")}
                      />
                      {renderError("Subject")}
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">Description *</label>
                         <textarea
                        className="form-control"
                        rows={4}
                         {...formik.getFieldProps("notes")}
                        defaultValue={
                        "Meeting with Staffs on the Quality Improvement s and completion of syllabus before the August,  enhance the students health issue"
                        }
                    />
                      {renderError("notes")}
                    </div>
                  </div>

                  <div className="modal-footer gap-2">
                  
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isLoading}
                    >
                      {isLoading
                        ? "Processing..."
                        : isEditMode
                        ? "Update"
                        : "Add Assigment"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    
    </div>
  );
};

export default AddAssignments;
