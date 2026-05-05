import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Spin } from "antd";
import { useState, useEffect } from "react";
import api from "../../core/data/api";
import notifyError from "../../core/common/notify/notifyError";
import { useSelector } from "react-redux";
import notifySuccess from "../../core/common/notify/notifySuccess";
import SelectServices from "../Center/components/selectServices";
import { all_routes } from "../../feature-module/router/all_routes";
import {toast} from "react-toastify";

const EditClass = () => {
  const navigate = useNavigate();
  const { users } = useSelector((state: any) => state.user);
  const [schools, setSchools] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const { id } = useParams<{ id?: string }>();
  const [selectedCenter, setSelectedCenter] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    className: "",
    schoolSegment: "",
  });
  const [errors, setErrors] = useState({
    className: "",
    schoolSegment: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors: any = {};
    let isValid = true;

    if (!formData.className.trim()) {
      newErrors.className = "Class name is required";
      isValid = false;
    }

    if (selectedValues.length === 0) {
      newErrors.schoolSegment = "School segment is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

 const CreateClass = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!validate()) return;

  try {
    const servicesString = selectedValues.join(",");
    const isUpdate = id != ':id';
    const procedureName = isUpdate ? "ClassesUpdate" : "ClassesInsert";
    let parameters;
    // Base parameters for both insert and update
     parameters = [
      { name: "CenterID", type: "Int", value: users.centerId },
      { name: "Name", type: "VarChar", value: servicesString },
      { name: "CREATED_BY", type: "Int", value: users?.ID },
      { name: "ClassName", type: "VarChar", value: formData.className },
    ];

    // Add ID only for update
    if (id!=':id') {
          parameters = [
      { name: "ID", type: "Int", value:id },
      { name: "ACTIVE", type: "Int", value:1 },
      { name: "Name", type: "VarChar", value: formData.className},
      { name: "CREATED_BY", type: "Int", value: users?.ID },
    ];
      
    }

    const res = await api.post("/api/mssql-procedure/execute", {
      procedureName,
      parameters,
    });

    if (res.data.record[0].message === 0) {
      toast.error("Classname already exists");
    } else {
      toast.success(isUpdate ? "Class updated successfully" : "Class added successfully");
      navigate(all_routes.allClass);
      setFormData({
        className: "",
        schoolSegment: "",
      });
    }
  } catch (error) {
    console.log("Error processing class:", error);
    notifyError("Error processing class");
  }
};


  const handleServiceSelectionChange = (value: string[]) => {
    setSelectedValues(value);
    setErrors((prev) => ({ ...prev, schoolSegment: "" }));
  };

  const singleCenterDetails = async () => {
    try {
      setLoading(true);
      const res = await api.post("/api/mssql-procedure/execute", {
        procedureName: "CenterGetbyID",
        parameters: [{ name: "ID", type: "Int", value: users.centerId }],
      });
      if (res.data.success) {
        setServices(res.data.record[0].ServiceID);
      }
    } catch (error: any) {
      console.log("Error fetching centers:", error);
    } finally {
      setLoading(false);
    }
  };

  const getServices = async () => {
    try {
      setLoading(true);
      const res = await api.post("/api/mssql-procedure/execute/get", {
        procedureName: "ServicesGetAll",
        parameters: [],
      });
      if (res.data) {
        const options = res.data.centers
          .filter((center: any) => services?.includes(center.ID))
          .map((center: any) => ({
            label: center.Name,
            value: center.ID,
            IsAdditionalService: center.IsAdditionalService,
          }));
        setSchools(options);
      }
    } catch (error: any) {
      console.log("Error fetching centers:", error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (id) {
      singleCenterDetails();
    }
  }, [id]);

  useEffect(() => {
    if (services) {
      getServices();
    }
  }, [services]);

useEffect(() => {
  const getData = async () => {
    try {
      const res = await api.post("/api/mssql-procedure/execute", {
        procedureName: "ClassGetbyID",
        parameters: [{ name: "ID", type: "Int", value: id }],
      });
      if (res.data.success && res.data.record.length > 0) {
        const classData = res.data.record[0];
        setFormData({
          className: classData.ClassName || "",
          schoolSegment: "",
        });
        setSelectedCenter(res.data.record[0].Name[0]);
      }
    } catch (error) {
      console.log("Error fetching class details:", error);
    }
  };

  if (id) getData();
}, [id]);

  return (
    <div className="page-wrapper">
      <div className="content content-two">
        <div className="">
          <div
            className=""
            style={{
              justifyContent: "space-between",
              display: "flex",
              margin: "10px",
            }}
          >
            <h2 className="mb-1">{ id != ":id" ?'Edit Class' :'Add Class'}</h2>
          </div>

          <div className="row" style={{ justifyContent: "space-evenly" }}>
            <div
              className="col-lg-8"
              style={{
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                padding: "20px",
                backgroundColor: "white",
                borderRadius: "8px",
                marginTop: "20px",
              }}
            >
              <form onSubmit={CreateClass}>
                
                <div className="col-lg-12">
                  <div className="mb-3">
                    <label className="form-label">
                      Choose School Segment *
                    </label>
                    {schools ? (
                      <SelectServices
                        selectedValues={selectedValues}
                        defaultValue={selectedValues}
                        handleInputChange={handleServiceSelectionChange}
                        services={schools}
                        loading={loading}
                      />
                    ) : (
                      <Spin />
                    )}
                    {errors.schoolSegment && (
                      <span style={{ color: "red" }}>
                        {errors.schoolSegment}
                      </span>
                    )}
                  </div>
                </div>

                <div className="col-lg-12">
                  <div className="mb-3">
                    <label className="form-label">
                      Class Name (Class & Section) *
                    </label>
                    <input
                      type="text"
                      name="className"
                      value={formData.className}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Enter Class Name and Section"
                      required
                    />
                    {errors.className && (
                      <span style={{ color: "red" }}>{errors.className}</span>
                    )}
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "20px",
                  }}
                >
                  <Link to={all_routes.center} className="btn btn-primary">
                    Back
                  </Link>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading?true:false}
                  >
                    {loading
                      ? "Processing..."
                      : id != ":id"
                      ? "Edit Class"
                      : "Add Class"}
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

export default EditClass;
