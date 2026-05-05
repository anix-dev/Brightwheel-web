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
  username: string;
  password: string;
  camera: string;
  CenterId: string;
  ClassId: string[];
  domainIp: string;
  alias: string;
  port: string;
  brand: string;
}

interface User {
  ID: number;
}

const AddCctv = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const user = localStorage.getItem('user');
  const [show, setShow] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<Partial<StudentFormValues>>({});
  const [selectedCenter, setSelectedCenter] = useState<string>("");
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]); // Changed to array
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [timeSlots, setTimeSlots] = useState<{ from: string; to: string }[]>([
    { from: "", to: "" },
  ]);
  const [cameraId, setCameraId] = useState<number | null>(null);
  const [showTimingSection, setShowTimingSection] = useState(false);
console.log(selectedClasses,"selectedClasses")
  const formik = useFormik<StudentFormValues>({
    initialValues: {
      username: formData?.username || "",
      password: formData?.password || "",
      camera: formData?.alias || "",
      alias: formData?.alias || "",
      CenterId: formData?.CenterId || selectedCenter || "",
      ClassId: formData?.ClassId || selectedClasses || [], // Changed to array
      port: formData?.port || "",
      domainIp: formData?.domainIp || "",
      brand: formData?.brand || ""
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      username: Yup.string().required("username is required."),
      alias: Yup.string().required("alias is required."),
      password: Yup.string().required("Password is required."),
      brand: Yup.string().required("Camera Brand is required."),
      CenterId: Yup.string().required("Please choose a center."),
      ClassId: Yup.array().min(1, "Please select at least one class."), // Updated validation
      port: Yup.string()
        .required("Port is required.")
        .matches(/^[0-9]{3}$/, "Enter a valid port number"),
      domainIp: Yup.string().required("Please enter a Public IP .")
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        // Convert ClassId array to comma-separated string for database
        const classIdsString = selectedClasses.join(',');
        
        const parameters = [
          { name: "username", type: "VarChar", value: values.username },
          { name: "password", type: "VarChar", value: values.password },
          { name: "alias", type: "VarChar", value: values.alias },
          { name: "camera", type: "VarChar", value: values.alias },
          { name: "port", type: "VarChar", value: values.port.toString() },
          { name: "domainIp", type: "VarChar", value: values.domainIp },
          { name: "brand", type: "VarChar", value: values.brand },
          { name: "CREATED_BY", type: "Int", value: user },
          { name: "CenterId", type: "Int", value: values.CenterId },
          { name: "ClassId", type: "VarChar", value: classIdsString }, // Updated to string
        ];

        const procedureName = "ChannelInsert";
        const res = await api.post("/api/mssql-procedure/execute", {
          procedureName,
          parameters,
        });

        if (res.data.success) {
          setData(res.data);
          // Extract the camera ID from the response
          const newCameraId = res.data.record?.[0]?.ID;
          if (newCameraId) {
            setCameraId(newCameraId);
            setShowTimingSection(true);
          }
          
          toast.success(`Channel added successfully`);
          // Scroll to timing section
          setTimeout(() => {
            const timingSection = document.getElementById('timing-section');
            if (timingSection) {
              timingSection.scrollIntoView({ behavior: 'smooth' });
            }
          }, 300);
        }
      } catch (error) {
        console.log("Error submitting student:", error);
        toast.error("Failed to add channel");
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleSelect = useCallback(
    (item: string) => {
      setSelectedCenter(item);
      formik.setFieldValue("CenterId", item);
      // Clear selected classes when center changes
      setSelectedClasses([]);
      formik.setFieldValue("ClassId", []);
    },
    [formik]
  );

  const handleClass = useCallback(
    (item: string) => {
      // Toggle class selection
      setSelectedClasses(prev => {
        const newSelection = prev.includes(item) 
          ? prev.filter(cls => cls !== item) // Remove if already selected
          : [...prev, item]; // Add if not selected
        
        formik.setFieldValue("ClassId", newSelection);
        return newSelection;
      });
    },
    [formik]
  );

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const payload = {
        days: selectedDays,
        slots: timeSlots.filter(slot => slot.from && slot.to), // only valid ones
      };
      
      if (payload.slots.length === 0) {
        toast.error("Please add at least one valid time slot");
        return;
      }
      
      if (selectedDays.length === 0) {
        toast.error("Please select at least one day");
        return;
      }
      
      const from = payload.slots[0].from;
      const to = payload.slots[0].to;
      
      const res = await api.post("/api/mssql-procedure/execute", {
        procedureName: "CamTiming",
        parameters: [
          { name: "CameraId", type: "Int", value: cameraId },
          { name: "slots", type: "VarChar", value: JSON.stringify(selectedDays) },
          { name: "fromTime", type: "VarChar", value: from },
          { name: "toTime", type: "VarChar", value: to },
          { name: "CREATED_BY", type: "VarChar", value: user },
        ],
      });
      
      if (res.data.success) {
        toast.success("Camera timing added successfully");
        // Optionally navigate to channel list or reset form
        setTimeout(() => {
          navigate(all_routes.channelList);
        }, 1500);
      }
    } catch (error) {
      console.log("Error adding camera timing:", error);
      toast.error("Failed to add camera timing");
    } finally {
      setLoading(false);
    }
  };

  const addTimeSlot = () => {
    setTimeSlots([...timeSlots, { from: "", to: "" }]);
  };

  const removeTimeSlot = (index: number) => {
    if (timeSlots.length > 1) {
      const newSlots = [...timeSlots];
      newSlots.splice(index, 1);
      setTimeSlots(newSlots);
    }
  };

  const renderError = (field: keyof StudentFormValues) => {
    const error = formik.errors[field];
    return formik.touched[field] && typeof error === "string" ? (
      <div className="text-danger">{error}</div>
    ) : null;
  };

  return (
    <div className="page-wrapper">
      <div className="content content-two">
        <div className="card board-hover mb-3 mt-3">
          <div className="card-header bg-primary text-white">
            <h2 className="m-0 text-white">Add Camera</h2>
          </div>
          <div className="card-body" style={{ margin: "20px" }}>
            <div className="modal-body">
              <form onSubmit={formik.handleSubmit}>
                <div className="row d-flex justify-content-center">
                  <div className="col-lg-8">
                    <div className="mb-3">
                      <label className="form-label fw-bold">Select Center</label>
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
                  <div className="col-lg-8">
                    <div className="mb-3">
                      <label className="form-label fw-bold">Select Classes (Multiple)</label>
                      <SelectClassType
                        selectedClass={selectedClasses}
                        selectedCenter={selectedCenter}
                        handleSelect={handleClass}
                        type=""
                        multiple={true} // Add this prop for multiple selection
                        {...formik.getFieldProps("ClassId")}
                      />
                      {formik.touched.ClassId && formik.errors.ClassId && (
                        <div className="text-danger">{formik.errors.ClassId}</div>
                      )}
                      <div className="form-text">
                        Selected classes: {selectedClasses.join(", ") || "None"}
                      </div>
                    </div>
                  </div>
                  
                </div>

                <div className="row d-flex justify-content-center">
                  <div className="col-lg-8">
                    <div className="mb-3">
                      <label className="form-label fw-bold">Alias * (for identification of the camera)</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter camera alias"
                        {...formik.getFieldProps("alias")}
                      />
                      {renderError("alias")}
                    </div>
                  </div>
                </div>
                <div className="row d-flex justify-content-center">
                  <div className="col-lg-8">
                    <div className="mb-3">
                      <label className="form-label fw-bold">Username *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter username"
                        {...formik.getFieldProps("username")}
                      />
                      {renderError("username")}
                    </div>
                  </div>
                </div>
                <div className="row d-flex justify-content-center">
                  <div className="col-lg-8">
                    <div className="mb-3">
                      <label className="form-label fw-bold">Public IP *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter public IP address"
                        {...formik.getFieldProps("domainIp")}
                      />
                      {renderError("domainIp")}
                    </div>
                  </div>
                </div>
                <div className="row d-flex justify-content-center">
                  <div className="col-lg-8">
                    <div className="mb-3">
                      <label className="form-label fw-bold">Enabled Port *</label>
                      <input
                        type="Number"
                        className="form-control"
                        placeholder="Enter port number"
                        {...formik.getFieldProps("port")}
                      />
                      {renderError("port")}
                    </div>
                  </div>
                </div>
                <div className="row d-flex justify-content-center">
                  <div className="col-lg-8">
                    <div className="mb-3">
                      <label className="form-label fw-bold">Password *</label>
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Enter password"
                        {...formik.getFieldProps("password")}
                      />
                      {renderError("password")}
                    </div>
                  </div>
                </div>
                <div className="row d-flex justify-content-center">
                  <div className="col-lg-8">
                    <div className="mb-3">
                      <label className="form-label fw-bold">Camera Brand *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter camera brand"
                        {...formik.getFieldProps("brand")}
                      />
                      {renderError("brand")}
                    </div>
                  </div>
                </div>
                <div className="row d-flex justify-content-center mt-4">
                  <div className="col-lg-8 text-center">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg px-5"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Processing...
                        </>
                      ) : (
                        "Add Camera"
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {showTimingSection && (
              <div id="timing-section" className="modal-body mt-5 pt-4 border-top">
                <div className="alert alert-success">
                  <i className="fas fa-check-circle me-2"></i>
                  Channel added successfully! Now you can configure camera timing.
                </div>
                
                <h3 className="mb-4 text-primary">
                  <i className="fas fa-clock me-2"></i>
                  Add Camera Timing
                </h3>
                
                <form onSubmit={handleSubmit}>
                  <div className="row d-flex justify-content-center">
                    <div className="col-lg-8">
                      <div className="mb-4">
                        <label className="form-label fw-bold">Select Days (Hold Ctrl to select multiple)</label>
                        <select
                          multiple
                          className="form-select p-3"
                          size={7}
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
                        <div className="form-text">Selected days: {selectedDays.join(", ") || "None"}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="row d-flex justify-content-center">
                    <div className="col-lg-8">
                      <div className="mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <label className="form-label fw-bold">Camera Time Slots</label>
                        </div>
                        
                        {timeSlots.map((slot, index) => (
                          <div key={index} className="d-flex align-items-center gap-2 mb-3 p-3 bg-light rounded">
                            <div className="flex-grow-1">
                              <label className="form-label small">From</label>
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
                            </div>
                            <div className="mt-4 pt-2">
                              <span className="fw-bold">to</span>
                            </div>
                            <div className="flex-grow-1">
                              <label className="form-label small">To</label>
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
                            {timeSlots.length > 1 && (
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-danger mt-4"
                                onClick={() => removeTimeSlot(index)}
                              >
                                <i className="fas fa-times"></i>
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="row d-flex justify-content-center mt-4">
                    <div className="col-lg-8 text-center">
                      <button
                        type="submit"
                        className="btn btn-success btn-lg px-5"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Processing...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-save me-2"></i>
                            Save Camera Timing
                          </>
                        )}
                      </button>
                      
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-lg px-5 ms-3"
                        onClick={() => navigate(all_routes.channelList)}
                      >
                        Skip for Now
                      </button>
                    </div>
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

export default AddCctv;