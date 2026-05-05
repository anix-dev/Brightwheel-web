import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../core/common/imageWithBasePath";
import SelectClass from "../Users/selectClass";
import api from "../../core/data/api";
import { toast } from "react-toastify";
import moment from "moment";
import Loading from "../../core/common/loader/Loading";
import Swal from "sweetalert2"
const DirectMessage = () => {
  const [selectedCenter, setSelectedCenter] = useState<string>("Center");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const [notify, setNotifications] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const user = localStorage.getItem("user");
  const handleClass = (item: string) => {
    setSelectedClass(item);
  };

  const getData = async () => {
    setLoading(true);
    try {
      const res = await api.post("/api/mssql-procedure/execute/get", {
        procedureName: "NoticeGetAll",
        parameters: [],
      });
      setNotifications(res.data.centers);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files)); // Convert FileList to File[]
    }
  };

  const handleNotification = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageBuffer;
      if (files.length > 0) {
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
          formData.append("images", files[i]);
        }
        const res = await api.post("/upload", formData);

        imageBuffer = res.data.files.map((e: any) => e.path);
      }
      const images = imageBuffer.join(", ");

      const userId = user ? parseInt(user) : 0;
      const classId = parseInt(selectedClass);

      const response = await api.post("/api/mssql-procedure/execute", {
        procedureName: "NoticeInsert",
        parameters: [
          { name: "Image", type: "VarChar", value: images },
          { name: "Message", type: "VarChar", value: message },
          { name: "ClassID", type: "Int", value: classId },
          { name: "ACTIVE", type: "Int", value: 1 },
          { name: "CREATED_BY", type: "Int", value: userId },
        ],
      });

      if (response.data.success) {
        document.getElementById("closeModal")?.click();
        toast.success("Notfication created successfully");
        setMessage("");
        setFiles([]);
        setSelectedClass("")
        getData();
      }
    } catch (error) {
      console.log("Error sending notification:", error);
    } finally {
      setLoading(false);
    }
  };

const handleDelete = async (id: string) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
  });

  if (!result.isConfirmed) return;

  setLoading(true);
  try {
    const res = await api.post("/api/mssql-procedure/execute", {
      procedureName: "NoticeDelete",
      parameters: [
        { name: "ID", type: "Int", value: id },
        { name: "CREATED_BY", type: "Int", value: user },
      ],
    });

    if (res.data) {
      Swal.fire({
        title: "Deleted!",
        text: "Your file has been deleted.",
        icon: "success"
      });
      toast.success("Notification deleted successfully");
      getData()
    }
  } catch (error) {
    toast.error("Failed to delete notification.");
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="card">
            <div className="card-header pb-1">
              <div className="d-flex align-items-center justify-content-between flex-wrap">
                <div className="mb-3">
                  <h4>Notifications</h4>
                </div>
                <div className="d-flex align-items-center mb-3">
                  <Link
                    to="#"
                    data-bs-target="#sendNotice"
                    data-bs-toggle="modal"
                    className="btn btn-primary me-2"
                  >
                    <i className="ti ti-check me-2" />
                    Send Notice
                  </Link>
                  {/* <Link to="#" className="btn btn-danger">
                    <i className="ti ti-trash me-2" />
                    Delete all
                  </Link> */}
                </div>
              </div>
            </div>
            <div className="card-body pb-1">
              <div className="d-block">
                {loading ? (
                  <Loading />
                ) : notify && notify.length > 0 ? (
                  notify.map((e: any, i: number) => {
                    const imageSrc = e?.Image
                      ? e.Image.split(",")[0].trim()
                      : "assets/images/peo (6).jpg";
                    return (
                      <div
                        key={i}
                        className="d-flex align-items-center justify-content-between flex-wrap shadow-sm noti-hover border p-3 pb-0 rounded mb-3"
                      >
                        <div className="d-flex align-items-start flex-fill">
                          <Link
                            to="#"
                            className="avatar avatar-lg flex-shrink-0 me-2 mb-3"
                          >
                            <ImageWithBasePath
                              alt="Notification Image"
                              src={imageSrc}
                              className="img-fluid"
                            />
                          </Link>
                          <div className="mb-3">
                            <p className="mb-0 text-dark fw-medium">
                              {e?.Message || "No message available"}
                            </p>
                            <span>{moment(e?.CREATED_DATE).fromNow()}</span>
                          </div>
                        </div>
                        <div className="noti-delete mb-3">
                          <Link
                            to="#"
                            data-bs-toggle="#delete-modal"
                            data-bs-target="modal"
                            className="btn btn-danger btn-sm text-white"
                            onClick={()=>handleDelete(e.ID)}
                          >
                            Delete
                          </Link>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="card-body" style={{ textAlign:"center",fontSize:'16px',color:"#202C4B"}}>No Notification available </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="modal fade" id="sendNotice">
          <div className="modal-dialog modal-dialog">
            <div
              className="modal-content bottom-5  "
              style={{ position: "relative" }}
            >
              <div className="modal-header ">
                <h4 className="modal-title text-primary">Send Notifications</h4>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  id="closeModal"
                  aria-label="Close"
                >
                  {" "}
                  <i className="ti ti-x" />
                </button>
              </div>
              <form onSubmit={handleNotification}>
                <div className="modal-body">
                  <div className="mb-2">
                    <SelectClass
                      selectedClass={selectedClass}
                      selectedCenter={selectedCenter}
                        handleSelect={(valArray:any) => setSelectedClass(valArray)}
                      isMultiple={true}
                    />
                  </div>
                  <div className="mb-2">
                    <textarea
                      className="form-control"
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      defaultValue={
                        "Meeting with Staffs on the Quality Improvement s and completion of syllabus before the August,  enhance the students health issue"
                      }
                    />
                  </div>
                  <div className="mb-2">
                    <input
                      className="form-control"
                      type="file"
                      onChange={handleFile}
                      accept="image/*"
                      multiple
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    id="closeModal"
                    aria-label="Close"
                  >
                    {loading ? "Processing..." : "Send"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      
      </div>
    </>
  );
};

export default DirectMessage;
