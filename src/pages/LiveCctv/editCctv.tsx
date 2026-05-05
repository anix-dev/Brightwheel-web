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
import SelectClassType from "../Users/SelectClassType";

interface StudentFormValues {
  username: string;
  password: string;
  camera: string;
  CenterId: string;
  ClassId:string;
  domainIp:string;
  port:string;
  alias:string;
  brand:string;
  rtspUrl:string;
  fromTime:any;
  toTime:any;
  slots:any;
}

const EditCctv = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const user = localStorage.getItem('user');
    const [show,setShow] = useState(false);
    const [data,setData] = useState([]);
    const [loading,setLoading] = useState<boolean>(false);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [timeSlots, setTimeSlots] = useState<{ from: string; to: string }[]>([
    { from: "", to: "" },
  ]);
  const [formData, setFormData] = useState<Partial<StudentFormValues>>({});
  const [selectedCenter, setSelectedCenter] = useState<string>("");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [cameraUpdated, setCameraUpdated] = useState<boolean>(false);
  const [cameraId, setCameraId] = useState<string | null>(null);
  
  const formik = useFormik<StudentFormValues>({
    initialValues: {
      username: formData?.username || "",
      alias: formData?.alias || "",
      password: formData?.password || "",
      camera: formData?.camera || "",
      CenterId: formData?.CenterId || selectedCenter|| "",
      ClassId: formData?.ClassId || selectedClass || "",
      port: formData?.port || "",
      domainIp: formData?.domainIp || "",
      brand:formData?.brand || "",
      rtspUrl:formData?.rtspUrl || '',
      fromTime:formData?.fromTime || '',
      toTime:formData?.toTime || '',
      slots:formData?.slots || '',
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      username: Yup.string().required("username is required."),
      alias: Yup.string().required("alias is required."),
      password: Yup.string().required("Password is required."),
      camera: Yup.string().required("Channel Name is required."),
      brand: Yup.string().required("Camera Brand is required."),
      CenterId: Yup.string().required("Please choose a center."),
      port:  Yup.string()
        .required("Port is required.")
        .matches(/^[0-9]{3}$/, "Enter a valid port number"),
      domainIp: Yup.string().required("Please enter a Public IP .")
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const parameters = [
          { name: "ID", type: "Int", value: id },
          { name: "username", type: "VarChar", value: values.username },
          { name: "ClassId", type: "Int", value: selectedClass },
          { name: "alias", type: "VarChar", value: values.alias },
          { name: "password", type: "VarChar", value: values.password },
          { name: "camera", type: "VarChar", value: values.camera },
          { name: "port", type: "VarChar", value: values.port.toString() },
          { name: "domainIp", type: "VarChar", value: values.domainIp },
          { name: "brand", type: "VarChar", value: values.brand},
          { name: "rtspUrl", type: "VarChar", value: values.rtspUrl},
          { name: "MODIFIED_BY", type: "Int", value: user },
          { name: "CenterId", type: "Int", value: values.CenterId },
        ];
        const procedureName = "ChannelUpdate";
        const res = await api.post("/api/mssql-procedure/execute", {
          procedureName,
          parameters,
        });        
        if (res.data.success) {
          toast.success(`Channel updated successfully`);
          setCameraUpdated(true);
          setCameraId(id || null);
          getUserDetails();
        }
      } catch (error) {
        console.log("Error submitting student:", error);
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

  // Enhanced handler with toggle behavior for multi-select
  const handleClass = (selectedOptions: any) => {
    // Get current selected classes as array
    const currentSelected = selectedClass ? selectedClass.split(',').filter(Boolean) : [];

    let newSelected: string[] = [];

    if (Array.isArray(selectedOptions)) {
      // For standard multi-select - use all selected values
      newSelected = selectedOptions.map(option => option.value.toString());
    } else if (selectedOptions && selectedOptions.value) {
      // For custom toggle behavior - find what changed
      const changedValue = selectedOptions.value.toString();

      if (currentSelected.includes(changedValue)) {
        // Remove the changed value
        newSelected = currentSelected.filter(item => item !== changedValue);
      } else {
        // Add the changed value
        newSelected = [...currentSelected, changedValue];
      }
    } else {
      // No selection
      newSelected = [];
    }

    // Remove duplicates, empty values, and sort
    const uniqueSelected = Array.from(new Set(newSelected.filter(Boolean))).sort();
    const classIdsString = uniqueSelected.join(',');

    console.log("Selected Classes:", classIdsString);

    setSelectedClass(classIdsString);
    formik.setFieldValue("ClassId", classIdsString);
  };
  const handleSubmit= async (e:any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        days: selectedDays,
        slots: timeSlots.filter(slot => slot.from && slot.to), // only valid ones
      };
      const from = payload.slots[0].from;
      const to = payload.slots[0].to;
      
      const res = await api.post("/api/mssql-procedure/execute", {
        procedureName: "CamTiming",
        parameters: [
          { name: "CameraId", type: "Int", value: cameraId || id },
          { name: "slots", type: "VarChar", value: JSON.stringify(selectedDays) },
          { name: "fromTime", type: "VarChar", value: from },
          { name: "toTime", type: "VarChar", value: to },
          { name: "CREATED_BY", type: "VarChar", value: user },
        ],
      });
      
      if (res.data.success) {
        toast.success("Camera timing updated successfully");
        // Optionally navigate away or reset form
        // navigate(all_routes.channelList);
      }
    } catch (error) {
      console.log("Error updating camera timing:", error);
      toast.error("Failed to update camera timing");
    } finally {
      setLoading(false);
    }
  };

  const renderError = (field: keyof StudentFormValues) => {
    const error = formik.errors[field];
    return formik.touched[field] && typeof error === "string" ? (
      <div className="text-danger">{error}</div>
    ) : null;
  };

  const getUserDetails = async () => {
    setIsLoading(true);
    try {
      const res = await api.post("/api/mssql-procedure/execute", {
        procedureName: "ChannelById",
        parameters: [
          { name: "ID", type: "Int", value: id },
        ],
      });
      const filteredCenters = res.data.record[0];
      console.log(filteredCenters,"centerrrrrrrrrrr detaillsssssssss")
      setFormData(filteredCenters || []);
      setSelectedCenter(filteredCenters.CenterId);
          // Set the ClassId directly as string (it's already comma-separated)
      setSelectedClass(filteredCenters.ClassId || "");
    
      // If camera already has timing data, show the timing section
      if (filteredCenters.slots || filteredCenters.toTime) {
        setCameraUpdated(true);
        setCameraId(id || null);
      }
    } catch (error) {
      // console.log("Failed to fetch attendance:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(()=>{
    getUserDetails()
  },[]);
  
  useEffect(() => {
    if (formData.slots) {
      setSelectedDays(JSON.parse(formData.slots)); // convert string → array
    }
    if (formData.toTime) {
      setTimeSlots([{ from: formData.fromTime, to: formData.toTime }]);
    }
  }, [formData]);
  
  return (
    <div className="page-wrapper">
      <div className="content content-two">
        <div className="card board-hover mb-3 mt-3">
          <h2 className="m-3 mb-1" style={{ marginLeft: "10px" }}>
            Edit Camera
          </h2>
          <div style={{ margin: "20px" }}>
            <div className="modal-body">
              <form onSubmit={formik.handleSubmit}>
                <div className="row d-flex justify-content-center">
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label>Select Center</label>
                      <SelectCenter
                        selectedCenter={selectedCenter}
                        handleSelect={handleSelect}
                        {...formik.getFieldProps("CenterId")}
                      />
                      {renderError("CenterId")}
                    </div>
                  </div>
                </div>
                  <div className="row d-flex justify-content-center">
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold">Select Class</label>
                      <SelectClassType
                        selectedClass={selectedClass ? selectedClass.split(',') : []} // Convert to array for multi-select
                        selectedCenter={selectedCenter}
                        handleSelect={handleClass}
                        type=""
                        
                        {...formik.getFieldProps("ClassId")}
                      />
                      {renderError("ClassId")}
                      {/* Display selected classes as comma-separated */}
                      {selectedClass && (
                        <div className="mt-2">
                          <small className="text-muted">
                            Selected Classes: {selectedClass}
                          </small>
                        </div>
                      )}
                    </div>
                  </div>
                  </div>
               <div className="row d-flex justify-content-center">
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">Alias *</label>
                      <input
                        type="text"
                        className="form-control"
                        {...formik.getFieldProps("alias")}
                      />
                      {renderError("alias")}
                    </div>
                  </div>

                </div>
                <div className="row d-flex justify-content-center">
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">Username *</label>
                      <input
                        type="text"
                        className="form-control"
                        {...formik.getFieldProps("username")}
                      />
                      {renderError("username")}
                    </div>
                  </div>

                </div>
                 <div className="row d-flex justify-content-center">
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">Public IP *</label>
                      <input
                        type="text"
                        className="form-control"
                        {...formik.getFieldProps("domainIp")}
                      />
                      {renderError("domainIp")}
                    </div>
                  </div>
                </div>
                 <div className="row d-flex justify-content-center">
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">Enabled Port *</label>
                      <input
                        type="Number"
                        className="form-control"
                        {...formik.getFieldProps("port")}
                      />
                      {renderError("port")}
                    </div>
                  </div>
                </div>
                <div className="row d-flex justify-content-center">
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">Password *</label>
                      <input
                        type="text"
                        className="form-control"
                        {...formik.getFieldProps("password")}
                      />
                      {renderError("password")}
                    </div>
                  </div>
                </div>
                <div className="row d-flex justify-content-center">
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">Channel Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        {...formik.getFieldProps("camera")}
                      />
                      {renderError("camera")}
                    </div>
                  </div>
                </div>
                  <div className="row d-flex justify-content-center">
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">Camera Brand *</label>
                      <input
                        type="text"
                        className="form-control"
                        {...formik.getFieldProps("brand")}
                      />
                      {renderError("brand")}
                    </div>
                  </div>
                </div>
                <div className="row d-flex justify-content-center">
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">Camera Url *</label>
                      <input
                        type="text"
                        className="form-control"
                          disabled = {formData?.rtspUrl ? true :false}
                        {...formik.getFieldProps("rtspUrl")}
                      />
                      {renderError("rtspUrl")}
                    </div>
                  </div>
                </div>
                <div className="modal-footer gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? "Processing..." : "Update Camera"}
                  </button>
                </div>
              </form>
            </div>
            
            {/* Show camera timing section only after camera is updated or if it already has timing data */}
            {selectedCenter && (
              <div className="modal-body">
                <h2 className="m-3 mb-1" style={{ marginLeft: "10px" }}>
                  Update Camera Slot
                </h2>
                <form onSubmit={(e)=>handleSubmit(e)}>
                  <div className="row d-flex justify-content-center">
                    <div className="col-lg-6">
                      <div className="mb-3">
                        <label>Select Days</label>
                        <select
                          multiple
                          className="form-select"
                          value={selectedDays}
                          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                            const values = Array.from(e.target.selectedOptions, (opt) => opt.value);
                            setSelectedDays(values);
                          }}
                        >
                          <option value="Monday">Monday</option>
                          <option value="Tuesday">Tuesday</option>
                          <option value="Wednesday">Wednesday</option>
                          <option value="Thursday">Thursday</option>
                          <option value="Friday">Friday</option>
                          <option value="Saturday">Saturday</option>
                          <option value="Sunday">Sunday</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="row d-flex justify-content-center">
                    <div className="col-lg-6">
                      <div className="mt-3">
                        <label>Camera Time Slots</label>
                        {timeSlots.map((slot, index) => (
                          <div key={index} className="d-flex align-items-center gap-2 mb-2">
                            <input
                              type="time"
                              className="form-control"
                              value={slot.from}
                              onChange={(e) => {
                                const newSlots = [...timeSlots];
                                newSlots[index].from = e.target.value;
                                setTimeSlots(newSlots);
                              }}
                            />
                            <span>to</span>
                            <input
                              type="time"
                              className="form-control"
                              value={slot.to}
                              onChange={(e) => {
                                const newSlots = [...timeSlots];
                                newSlots[index].to = e.target.value;
                                setTimeSlots(newSlots);
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div> 
                  
                  <div className="modal-footer gap-2">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? "Processing..." : "Update Camera Timing"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCctv;