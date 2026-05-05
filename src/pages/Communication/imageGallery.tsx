import React, { useState, useEffect } from "react";
import ImageWithBasePath from "../../core/common/imageWithBasePath";
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
  FaImage,
  FaDownload,
} from "react-icons/fa";
import SelectClassType from "../Users/SelectClassType";
import SelectCenter from "../Center/selectCenter";

const Images = () => {
  const [selectedId, setSelectedId] = useState<string>("");
  const [selectedCenter, setSelectedCenter] = useState<string>("Center");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxImages, setLightboxImages] = useState<{ src: string }[]>([]);
  const [message, setMessage] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const [notify, setImages] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const user = localStorage.getItem("user");

  const handleClass = (item: string) => {
    setSelectedClass(item);
  };

  const getData = async () => {
    setLoading(true);
    try {
      const res = await api.post("/api/mssql-procedure/execute/get", {
        procedureName: "ImagesGetAll",
        parameters: [],
      });
      setImages(res.data.centers);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setFiles(filesArray);
      const previews = filesArray.map((file) => URL.createObjectURL(file));
      setPreviewImages(previews);
    }
  };

  const handleImage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedClass) {
      toast.error("Please select a class");
      return;
    }
    if (!message) {
      toast.error("Please enter the description");
      return;
    }
    if (!date) {
      toast.error("Please select the event date");
      return;
    }
    if (files.length === 0) {
      toast.error("Please select at least one image");
      return;
    }

    setLoading(true);
    try {
      let imageBuffer: string[] = [];

      if (files.length > 0) {
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
          formData.append("files", files[i]);
        }

        const res = await api.post("/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        imageBuffer = res.data.data.map((e: any) => e.url);
      }

      const images = imageBuffer.join(", ");

      const userId = user ? parseInt(user) : 0;

      const response = await api.post("/api/mssql-procedure/execute", {
        procedureName: "ImageInsert",
        parameters: [
          { name: "Image", type: "VarChar", value: images },
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
        toast.success("Images shared successfully");
        setMessage("");
        setFiles([]);
        setSelectedCenter("")
        setPreviewImages([]);
        setSelectedClass("");
        getData();
      }
    } catch (error) {
      console.log("Error sending Image:", error);
      toast.error("Failed to share images");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    
    setLoading(true);
    try {
      const res = await api.post("/api/mssql-procedure/execute", {
        procedureName: "ImageDelete",
        parameters: [
          { name: "ID", type: "Int", value: selectedId },
          { name: "CREATED_BY", type: "Int", value: user },
        ],
      });

      if (res.data) {
        toast.success("Image deleted successfully");
        getData();
      }
    } catch (error) {
      toast.error("Failed to delete image");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    return () => {
      previewImages.forEach((image) => URL.revokeObjectURL(image));
    };
  }, [previewImages]);

  const chunkArray = (arr: string[], size: number) => {
    const chunked: string[][] = [];
    for (let i = 0; i < arr.length; i += size) {
      chunked.push(arr.slice(i, i + size));
    }
    return chunked;
  };

  const downloadImage = async (url: string) => {
    try {
      const secureUrl = url.replace(/^http:\/\//i, "https://");
      const resp = await fetch(url);
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
      toast.error("Failed to download image");
    }
  };

  // Download all images one by one
  const downloadAllImages = (urls: string[]) => {
    if (urls.length === 0) {
      toast.info("No images to download");
      return;
    }
    urls.forEach((url) => downloadImage(url));
    return toast.success("Image downloaded");
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="card">
          <div className="card-header pb-1">
            <div className="d-flex align-items-center justify-content-between flex-wrap">
              <div className="mb-3">
                <h4 className="text-primary">
                  <FaImage className="me-2" />
                  ImageGallery
                </h4>
                <p className="text-muted mb-0">Share and view images with your class</p>
              </div>
              <div className="d-flex align-items-center mb-3">
                <button
                  className="btn btn-primary me-2 d-flex align-items-center"
                  data-bs-target="#sendImage"
                  data-bs-toggle="modal"
                >
                  <FaShare className="me-2" />
                  Share Images
                </button>
              </div>
            </div>
          </div>

          <div className="card-body">
            {loading && notify.length === 0 ? (
              <div className="d-flex justify-content-center py-5">
                <Loading />
              </div>
            ) : notify && notify.length > 0 ? (
              <div className="row">
                {notify.map((e: any, i: number) => {
                  let imageStr = e?.Image || "";
                  let images: string[] = [];

                  if (imageStr.includes("<img")) {
                    const srcMatch = imageStr.match(/src="([^"]+)"/);
                    if (srcMatch && srcMatch[1]) {
                      images = srcMatch[1].split(",").map((url: any) => url.trim());
                    }
                  } else if (typeof imageStr === "string") {
                    images = imageStr.split(",").map((url) => url.trim());
                  }

                  if (images.length === 0) {
                    images = ["assets/images/peo (6).jpg"];
                  }

                  const imageChunks = chunkArray(images, 4);

                  return (
                    <div key={i} className="col-12 mb-4">
                      <div className="card shadow-sm">
                        <div className="card-header bg-light d-flex justify-content-between align-items-center">
                          <div>
                            <h5>Class : {e?.ClassName || 'UnKnown Class'}</h5>
                            <p className="mb-1">
                              <FaCalendarAlt className="me-1" />
                              {moment(e?.EventDate).format("LL")}
                            </p>
                            <p>{e?.Message}</p>
                          </div>
                          <div>
                            <button
                               data-bs-toggle="modal"
                        data-bs-target="#delete-modal"
                        onClick={() => setSelectedId(e.ID)}
                              className="btn btn-sm btn-danger me-2"
                            >
                              <FaTrash />
                            </button>
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => downloadAllImages(images)}
                            >
                              <FaDownload className="me-1" />
                              Download All
                            </button>
                          </div>
                        </div>
                        <div className="card-body">
                          {imageChunks.map((chunk, idx) => (
                            <div
                              className="row mb-3"
                              key={idx}
                            >
                              {chunk.map((img, index) => (
                                <div
                                  className="col-md-3 mb-2 position-relative"
                                  key={index}
                                >
                                  <img
                                    src={img}
                                    alt={`img-${index}`}
                                    className="img-fluid rounded"
                                    style={{ cursor: "pointer", maxHeight: 150, objectFit: "cover" }}
                                    onClick={() => {
                                      setLightboxImages(images.map((src) => ({ src })));
                                      setCurrentIndex(i * 4 + idx * 4 + index);
                                      setLightboxOpen(true);
                                    }}
                                  />
                                  <button
                                    className="btn btn-sm btn-dark position-absolute top-0 end-0 m-1"
                                    onClick={(ev) => {
                                      ev.stopPropagation();
                                      downloadImage(img);
                                    }}
                                  >
                                    <FaDownload />
                                  </button>
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div>No images found</div>
            )}
          </div>
        </div>

        {/* Lightbox */}
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          slides={lightboxImages}
          index={currentIndex}
        />
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
        {/* Modal for sharing images */}
        <div
          className="modal fade"
          id="sendImage"
          tabIndex={-1}
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered ">
              <div className="modal-content">
                <div className="modal-header bg-primary text-white">
                  <h5 className="modal-title">
                    <FaShare className="me-2" />
                    Share Images
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    id="closeModal"
                    onClick={() => {
                      setMessage("");
                      setFiles([]);
                      setPreviewImages([]);
                      setSelectedClass("");
                      setDate("");
                    }}
                  ></button>
                </div>
               <form onSubmit={handleImage}>

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
                    <label htmlFor="dateInput" className="form-label">
                      Event Date
                    </label>
                    <input
                      type="date"
                      id="dateInput"
                      className="form-control"
                      value={date}
                     min={new Date().toISOString().split("T")[0]}             
                     onChange={(e) => setDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="messageInput" className="form-label">
                      Description
                    </label>
                    <textarea
                      id="messageInput"
                      className="form-control"
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="fileInput" className="form-label">
                      Select Images
                    </label>
                    <input
                      type="file"
                      id="fileInput"
                      className="form-control"
                      onChange={handleFile}
                      multiple
                      accept="image/*"
                      required
                    />
                  </div>
                  {previewImages.length > 0 && (
                    <div className="row">
                      {previewImages.map((src, idx) => (
                        <div className="col-3 mb-3" key={idx}>
                          <img
                            src={src}
                            alt={`preview-${idx}`}
                            className="img-fluid rounded"
                            style={{ maxHeight: 120, objectFit: "cover" }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                    onClick={() => {
                      setMessage("");
                      setFiles([]);
                      setPreviewImages([]);
                      setSelectedClass("");
                      setDate("");
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Sharing..." : "Share"}
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

export default Images;
