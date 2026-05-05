import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../core/common/imageWithBasePath";
import SelectClass from "../Users/selectClass";
import api from "../../core/data/api";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { toast } from "react-toastify";
import moment from "moment";
import Loading from "../../core/common/loader/Loading";
import Swal from "sweetalert2";
import {
  FaTrash,
  FaShare,
  FaClock,
  FaCalendarAlt,
  FaVideo,
  FaDownload,
} from "react-icons/fa";
import SelectCenter from "../Center/selectCenter";
import SelectClassType from "../Users/SelectClassType";

const VideoGallery = () => {
  const [selectedCenter, setSelectedCenter] = useState<string>("Center");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedId, setSelectedId] = useState<string>("");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [date, setDate] = useState<string>("");
  const [lightboxVideo, setLightboxVideo] = useState<{ src: string }[]>([]);
  const [message, setMessage] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const [videos, setVideos] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [previewVideo, setPreviewVideo] = useState<string[]>([]);
  const user = localStorage.getItem("user");
  const handleClass = (item: string) => {
    setSelectedClass(item);
  };

  const getData = async () => {
    setLoading(true);
    try {
      const res = await api.post("/api/mssql-procedure/execute/get", {
        procedureName: "VideoGetAll",
        parameters: [],
      });
      setVideos(res.data.centers);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const invalidFiles = filesArray.filter(
        (file) =>
          !file.type.includes("video/") &&
          !file.name.match(/\.(mp4|mov|avi|wmv|flv|mkv|webm)$/i)
      );

      if (invalidFiles.length > 0) {
        toast.error(
          `Invalid file type: ${invalidFiles
            .map((f) => f.name)
            .join(", ")}. Please upload video files only.`
        );
        return;
      }

      setFiles(filesArray);

      const previews = filesArray.map((file) => URL.createObjectURL(file));
      setPreviewVideo(previews);
    }
  };

  const handleVideoUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedClass) {
      toast.error("Please select a class");
      return;
    }

    if (files.length === 0) {
      toast.error("Please select at least one video");
      return;
    }

    setLoading(true);
    try {
      let videoPaths = [];

      if (files.length > 0) {
        const formData = new FormData();

        for (let i = 0; i < files.length; i++) {
          formData.append("files", files[i]); // 👈 Use "files" — not "images"
        }

        const res = await api.post("/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        videoPaths = res.data.data.map((e: any) => e.url);
      }
      const videoPathString = videoPaths.join(", ");

      const userId = user ? parseInt(user) : 0;
      const classId = parseInt(selectedClass);

      const response = await api.post("/api/mssql-procedure/execute", {
        procedureName: "VideoInsert",
        parameters: [
          { name: "Image", type: "VarChar", value: videoPathString },
          { name: "Message", type: "VarChar", value: message },
          { name: "ClassID", type: "Int", value: selectedClass },
          { name: "CenterID", type: "Int", value: selectedCenter },
          { name: "ACTIVE", type: "Int", value: 1 },
          { name: "EventDate", type: "VarChar", value: date },
          { name: "CREATED_BY", type: "Int", value: userId },
        ],
      });

      if (response.data.success) {
        document.getElementById("closeModal")?.click();
        toast.success("Videos shared successfully");
        setMessage("");
        setFiles([]);
        setPreviewVideo([]);
        setSelectedClass("");
        getData();
      }
    } catch (error) {
      console.log("Error sending videos:", error);
      toast.error("Failed to share videos");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await api.post("/api/mssql-procedure/execute", {
        procedureName: "VideoDelete",
        parameters: [
          { name: "ID", type: "Int", value: selectedId },
          { name: "CREATED_BY", type: "Int", value: user },
        ],
      });

      if (res.data) {
        toast.success("Video deleted successfully");
        getData();
      }
    } catch (error) {
      toast.error("Failed to delete video");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // Clean up preview URLs
  useEffect(() => {
    return () => {
      previewVideo.forEach((video) => URL.revokeObjectURL(video));
    };
  }, [previewVideo]);

  const chunkArray = (arr: string[], size: number) => {
    const chunked: string[][] = [];
    for (let i = 0; i < arr.length; i += size) {
      chunked.push(arr.slice(i, i + size));
    }
    return chunked;
  };

  const downloadVideo = async (url: string) => {
      try {
        const secureUrl = url.replace(/^http:\/\//i, "https://");
        const resp = await fetch(secureUrl);
        if (!resp.ok) throw new Error("Network response was not ok");
        const blob = await resp.blob();
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = url.split("/").pop() || "image.jpg";
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(blobUrl);
        
      } catch (err) {
        console.log("Download failed", err);
        toast.error("Failed to download Video");
      }
    };
  
    // Download all images one by one
    const downloadAllVideos = (urls: string[]) => {
      if (urls.length === 0) {
        toast.info("No Video to download");
        return;
      }
      urls.forEach((url) => downloadVideo(url));
      return toast.success("Videos downloaded");
    };

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="card">
          <div className="card-header pb-1">
            <div className="d-flex align-items-center justify-content-between flex-wrap">
              <div className="mb-3">
                <h4 className="text-primary">
                  <FaVideo className="me-2" />
                  Video Gallery
                </h4>
                <p className="text-muted mb-0">
                  Share and view videos with your class
                </p>
              </div>
              <div className="d-flex align-items-center mb-3">
                <button
                  className="btn btn-primary me-2 d-flex align-items-center"
                  data-bs-target="#sendVideo"
                  data-bs-toggle="modal"
                >
                  <FaShare className="me-2" />
                  Share Video
                </button>
              </div>
            </div>
          </div>

          <div className="card-body">
            {loading && videos.length === 0 ? (
              <div className="d-flex justify-content-center py-5">
                <Loading />
              </div>
            ) : videos && videos.length > 0 ? (
              <div className="row">
                {videos.map((video: any, i: number) => {
                  let videoStr = video?.Image || "";
                  let videoUrls: string[] = [];
                  if (typeof videoStr === "string") {
                    videoUrls = videoStr.split(",").map((url) => url.trim());
                  }
                  if (videoUrls.length === 0) {
                    videoUrls = ["assets/videos/default.mp4"];
                  }
                  const videoChunks = chunkArray(videoUrls, 4);
                  const isVideo = video?.Image.match(/\.(mp4|webm|ogg)$/i);
                  return (
                    <div key={i} className="col-12 mb-4">
                      <div className="card shadow-sm">
                        <div className="card-header bg-light d-flex justify-content-between align-items-center">
                          <div className="d-flex align-items-center">
                            <div
                              className="video-thumbnail me-3"
                              style={{
                                width: "40px",
                                height: "40px",
                                backgroundColor: "#f0f0f0",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: "50%",
                              }}
                            >
                              <FaVideo className="text-muted" />
                            </div>
                            <div>
                              <h6 className="mb-0">
                                {video?.ClassName || "Unknown Class"}
                              </h6>
                              <small className="text-muted d-flex align-items-center">
                                <FaCalendarAlt className="me-1" />
                                {moment(video?.CREATED_DATE).format(
                                  "MMM D, YYYY"
                                )}
                                <FaClock className="ms-2 me-1" />
                                {moment(video?.CREATED_DATE).format("h:mm A")}
                              </small>
                            </div>
                          </div>
                          <div style={{display:'flex',gap:"20px"}}> 
                            <button
                              className="btn btn-sm btn-outline-danger"
                              data-bs-toggle="modal"
                              data-bs-target="#delete-modal"
                              onClick={() => setSelectedId(video.ID)}
                            >
                              <FaTrash />
                            </button>

                            <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => downloadAllVideos(videoUrls)}
                              >
                                <FaDownload className="me-1" />
                                Download All
                            </button>
                          </div>
                        </div>
                        <div className="card-body">
                          {video?.Message && (
                            <div className="mb-3 p-3 bg-light rounded">
                              <p className="mb-0">{video.Message}</p>
                            </div>
                          )}
                          <div className="gallery-container">
                            {videoChunks.map((chunk: any, chunkIndex: any) => (
                              <div className="row g-2 mb-2" key={chunkIndex}>
                                {chunk?.map((videoUrl: any, idx: any) => {
                                  return (
                                    <div className="col-md-3 col-6" key={idx}>
                                      <div className="video-item position-relative">
                                        <video
                                          src={videoUrl}
                                          controls
                                          className="img-fluid rounded"
                                          style={{
                                            height: "180px",
                                            objectFit: "cover",
                                            width: "100%",
                                            cursor: "pointer",
                                          }}
                                          onClick={() => {
                                            setLightboxVideo(
                                              videoUrls?.map((url: any) => ({
                                                src: url,
                                              }))
                                            );
                                            setCurrentIndex(
                                              chunkIndex * 4 + idx
                                            );
                                            setLightboxOpen(true);
                                          }}
                                        >
                                          <source
                                            src={videoUrl}
                                            // type={`video/${isVideo[1]}`}
                                          />
                                          Your browser does not support the
                                          video tag.
                                        </video>
                                        <div className="video-overlay rounded d-flex align-items-center justify-content-center">
                                          <FaVideo
                                            size={24}
                                            className="text-white"
                                          />
                                           <button
                                            className="btn btn-sm btn-dark position-absolute top-0 end-0 m-1"
                                            onClick={(ev) => {
                                              ev.stopPropagation();
                                              downloadVideo(videoUrl);
                                            }}
                                          >
                                            <FaDownload />
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-state text-center py-5">
                <div className="empty-state-icon">
                  <FaVideo size={48} className="text-muted" />
                </div>
                <h4 className="mt-3">No Videos Available</h4>
                <p className="text-muted">
                  Share your first video to get started
                </p>
                <button
                  className="btn btn-primary mt-3"
                  data-bs-target="#sendVideo"
                  data-bs-toggle="modal"
                >
                  <FaShare className="me-2" />
                  Share Video
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Share Video Modal */}
      <div
        className="modal fade"
        id="sendVideo"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title">
                <FaShare className="me-2" />
                Share Video
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                id="closeModal"
                aria-label="Close"
                 onClick={() => {
                      setMessage("");
                      setFiles([]);
                      setSelectedClass("");
                      setDate("");
                    }}
              ></button>
            </div>
            <form onSubmit={handleVideoUpload}>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Select Center</label>
                  <SelectCenter
                    selectedCenter={selectedCenter}
                    handleSelect={(val: any) => setSelectedCenter(val)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Select Class</label>
                  <SelectClassType
                    type=""
                    selectedClass={selectedClass}
                    selectedCenter={selectedCenter}
                    handleSelect={(val: any) => setSelectedClass(val)}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Add a description for these videos..."
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Event Date</label>
                  <input
                    className="form-control"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Select Videos</label>
                  <input
                    className="form-control"
                    type="file"
                    onChange={handleFile}
                    accept="video/*"
                    multiple
                  />
                  <small className="text-muted">
                    You can select multiple videos (MP4, MOV, AVI, etc.)
                  </small>
                </div>

                {previewVideo.length > 0 && (
                  <div className="mb-3">
                    <label className="form-label">Preview</label>
                    <div className="row g-2">
                      {previewVideo.map((preview, index) => (
                        <div className="col-4" key={index}>
                          <video
                            src={preview}
                            className="img-thumbnail"
                            style={{
                              height: "100px",
                              objectFit: "cover",
                              width: "100%",
                            }}
                            controls
                          />
                        </div>
                      ))}
                    </div>
                    <small className="text-muted">
                      {previewVideo.length} video(s) selected
                    </small>
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Sharing...
                    </>
                  ) : (
                    <>
                      <FaShare className="me-2" />
                      Share Videos
                    </>
                  )}
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
      {lightboxOpen && (
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          slides={lightboxVideo}
          index={currentIndex}
          on={{ view: ({ index }) => setCurrentIndex(index) }}
          render={{
            slide: ({ slide }) => {
              return (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "black",
                  }}
                >
                  <video
                    controls
                    autoPlay
                    style={{
                      maxWidth: "75%",
                      maxHeight: "75%",
                    }}
                  >
                    <source src={slide.src} type={slide.type || "video/mp4"} />
                    Your browser does not support the video tag.
                  </video>
                </div>
              );
            },
          }}
        />
      )}
    </div>
  );
};

export default VideoGallery;
