import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

import ImageWithBasePath from "../../core/common/imageWithBasePath";
import Loading from "../../core/common/loader/Loading";
import SelectCenter from "../Center/selectCenter";
import SelectClassType from "../Users/SelectClassType";
import api from "../../core/data/api";

const Notices = () => {
  const [selectedCenter, setSelectedCenter] = useState<string>("");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [selectedId, setSelectedId] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const userId = Number(localStorage.getItem("user"));

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const res = await api.post("/api/mssql-procedure/execute/get", {
        procedureName: "NoticeGetAll",
        parameters: [],
      });
      setNotifications(res.data.centers || []);
    } catch (error) {
      console.log("Fetch error:", error);
      toast.error("Failed to fetch notifications.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      let uploadedImageUrls: string[] = [];

      if (files.length > 0) {
        const formData = new FormData();
        files.forEach((file) => formData.append("files", file));

        const uploadRes = await api.post("/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        uploadedImageUrls = uploadRes.data.data.map((file: any) => file.url);
      } else {
        uploadedImageUrls = [
          "https://cdn-icons-png.flaticon.com/512/1827/1827392.png",
        ];
      }

      const response = await api.post("/api/mssql-procedure/execute", {
        procedureName: "NoticeInsert",
        parameters: [
          {
            name: "Image",
            type: "VarChar",
            value: uploadedImageUrls.join(", "),
          },
          { name: "Message", type: "VarChar", value: message },
          { name: "CenterID", type: "Int", value: selectedCenter },
          { name: "ClassID", type: "Int", value: selectedClass },
          { name: "ACTIVE", type: "Int", value: 1 },
          { name: "CREATED_BY", type: "Int", value: userId },
        ],
      });

      if (response.data.success) {
        toast.success("Notification created successfully");
        setMessage("");
        setSelectedClass("");
        setSelectedCenter("")
        setFiles([]);

        // Reset input field
        if (fileInputRef.current) fileInputRef.current.value = "";

        document.getElementById("closeModal")?.click();
        fetchNotices();
      }
    } catch (error) {
      console.log("Notification send error:", error);
      toast.error("Failed to send notification.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await api.post("/api/mssql-procedure/execute", {
        procedureName: "NoticeDelete",
        parameters: [
          { name: "ID", type: "Int", value: selectedId },
          { name: "CREATED_BY", type: "Int", value: userId },
        ],
      });

      if (res.data.success) {
        toast.success("Notification deleted successfully");
        fetchNotices();
      }
    } catch (error) {
      console.log("Delete error:", error);
      toast.error("Failed to delete notification.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="card">
          <div className="card-header pb-1 d-flex justify-content-between align-items-center flex-wrap">
            <h4 className="mb-3">Notifications</h4>
            <Link
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#sendNotice"
              className="btn btn-primary mb-3"
            >
              <i className="ti ti-check me-2" /> Send Notice
            </Link>
          </div>

          <div className="card-body pb-1">
            {loading ? (
              <Loading />
            ) : notifications.length > 0 ? (
              notifications.map((notice, index) => {
                const imageSrc =
                  notice?.Image?.split(",")[0]?.trim() ||
                  "assets/images/download (4).jfif";
                return (
                  <div
                    key={index}
                    className="d-flex align-items-center justify-content-between flex-wrap shadow-sm border p-3 pb-0 rounded mb-3 noti-hover"
                  >
                    <div className="d-flex align-items-start flex-fill">
                      <div className="avatar avatar-lg flex-shrink-0 me-2 mb-3">
                        <ImageWithBasePath
                          src={imageSrc}
                          alt="Notification"
                          className="img-fluid"
                        />
                      </div>
                      <div className="mb-3">
                        <p className="mb-0 fw-medium text-dark">
                          {notice?.Message || "No message"}
                        </p>
                        <small>{moment(notice?.CREATED_DATE).fromNow()}</small>
                      </div>
                    </div>
                    <div className="mb-3">
                      <button
                        className="btn btn-danger btn-sm"
                        data-bs-toggle="modal"
                        data-bs-target="#delete-modal"
                        onClick={() => setSelectedId(notice.ID)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-muted">
                No notifications available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal: Send Notification */}
      <div className="modal fade" id="sendNotice">
        <div className="modal-dialog">
          <div className="modal-content bottom-5">
            <div className="modal-header">
              <h4 className="modal-title text-primary">Send Notifications</h4>
              <button
                type="button"
                className="btn-close custom-btn-close"
                data-bs-dismiss="modal"
                id="closeModal"
              >
                <i className="ti ti-x" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="mb-2">
                  <SelectCenter
                    selectedCenter={selectedCenter}
                    handleSelect={setSelectedCenter}
                  />
                </div>
                <div className="mb-2">
                  <SelectClassType
                    selectedClass={selectedClass}
                    selectedCenter={selectedCenter}
                    type=""
                    handleSelect={setSelectedClass}
                  />
                </div>
                <div className="mb-2">
                  <textarea
                    className="form-control"
                    rows={4}
                    value={message}
                    required
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your notification message here..."
                  />
                </div>
                <div className="mb-2">
                  <input
                    type="file"
                    accept="image/*"
                    className="form-control"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="submit" className="btn btn-primary" disabled={loading?true:false}>
                  {loading ? "Processing..." : "Send"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="modal fade" id="delete-modal">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body text-center">
              <span className="delete-icon">
                <i className="ti ti-trash-x" />
              </span>
              <h4>Confirm Deletion</h4>
              <p>This action cannot be undone.</p>
              <div className="d-flex justify-content-center gap-3">
                <button className="btn btn-light" data-bs-dismiss="modal">
                  Cancel
                </button>
                <button
                  className="btn btn-danger"
                  onClick={handleDelete}
                  data-bs-dismiss="modal"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notices;
