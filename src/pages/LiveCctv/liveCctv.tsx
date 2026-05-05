import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import api from "../../core/data/api";
import Loading from "../../core/common/loader/Loading";
import SelectCenters from '../Center/selectCenters';
import { FaPlay, FaPause, FaExpand, FaCog, FaVideo, FaExclamationTriangle, FaSync } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import "./VideoPlayer.css";
import SelectClassType from "../Users/SelectClassType";

const VideoPlayer: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedCenter, setSelectedCenter] = useState<string>("");
  const [selectClass, setSelectClass] = useState<string>("");
  const [formData, setFormData] = useState<any>({});
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [loader, setLoader] = useState<boolean>(false);
  const [centers, setCenters] = useState<{ ClassName: string; id: string }[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [videoInfo, setVideoInfo] = useState<any>(null);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [popupMessage, setPopupMessage] = useState<string>("");
  const [connectionStatus, setConnectionStatus] = useState<string>("idle");
  const [retryCount, setRetryCount] = useState<number>(0);

  // Get centers when center and class are selected
  useEffect(() => {
    const getCenter = async () => {
      try {
        setLoader(true);
        const res = await api.post("/api/mssql-procedure/execute/get", {
          procedureName: "ChannelsGetAll",
          parameters: [
             { name: "CenterID", type: "Int", value: selectedCenter },
             { name: "ClassId", type: "Int", value: selectClass },
          ],
        });
        if (res.data?.centers && Array.isArray(res.data.centers)) {
          const filteredCenters = res.data.centers
            .filter((center: any) => selectedCenter == center?.CenterID && selectClass == center?.ClassId )
            .map((center: any) => ({
              ClassName: center.alias,
              centerId: center.CenterID,
              id: center.ID,
            }));
          setCenters(filteredCenters);
        } else {
          setCenters([]);
        }
      } catch (error) {
        console.log("Error fetching centers:", error);
      } finally {
        setLoader(false);
      }
    };

    if (selectedCenter && selectClass) {
      getCenter();
    } else {
      setCenters([]);
      setSelectedClass("");
    }
  }, [selectedCenter , selectClass]);

  // Get camera details when channel is selected
  useEffect(() => {
    if (selectedClass && selectedCenter) {
      const getCameraDetails = async () => {
        try {
          setLoader(true);
          const res = await api.post("/api/mssql-procedure/execute", {
            procedureName: "ChannelGetbyID",
            parameters: [
              { name: "camera", type: "VarChar", value: selectedClass },
              { name: "CenterID", type: "Int", value: selectedCenter },
              { name: "ClassId", type: "Int", value: selectClass },
            ],
          });

          const record = res.data?.record?.[0];
          if (record) {
            setFormData(record);
            setVideoInfo({
              name: record?.camera,
              ip: record?.domainIp,
              status: "Connecting..."
            });
          } else {
            setPopupMessage("No camera configuration found");
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 3000);
          }
        } catch (error) {
          console.log("Error fetching camera details:", error);
          setPopupMessage("Error loading camera configuration");
          setShowPopup(true);
          setTimeout(() => setShowPopup(false), 3000);
        } finally {
          setLoader(false);
        }
      };
      getCameraDetails();
    }
  }, [selectedClass, selectedCenter]);

  const createRtspUrl = (data: any) => {
    if (!data || !data.camera || !data.domainIp || !data.username || !data.password) {
      throw new Error("Missing required camera configuration data");
    }

    const channelMatch = data.camera.match(/\d+/);
    const number = channelMatch ? parseInt(channelMatch[0]) : 1;
    if(!data.rtspUrl){
      return `rtsp://${encodeURIComponent(data.username)}:${encodeURIComponent(data.password)}@${data.domainIp}/cam/realmonitor?channel=${number}&subtype=1`;
    } else {
      return data.rtspUrl;
    }
  };

  const startStreamWithRetry = async (rtspUrl: string, maxRetries = 2) => {
    setConnectionStatus("connecting");
    setRetryCount(0);

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        setRetryCount(attempt);
        console.log(`Stream attempt ${attempt}/${maxRetries}`);
        
        const res = await api.post("/api/start-stream", 
          { rtspUrl, quality: "low" }
        );

        if (res.data?.hlsUrl) {
          setConnectionStatus("connected");
          return res.data.hlsUrl;
        } else {
          throw new Error("No HLS URL returned");
        }
      } catch (error: any) {
        console.log(`Attempt ${attempt} failed:`, error.message);
        
        if (attempt === maxRetries) {
          throw error;
        }
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    throw new Error("All connection attempts failed");
  };

  // Setup stream when formData changes
  useEffect(() => {
    const setupStream = async () => {
      if (!formData?.domainIp) return;

      setVideoInfo((prev: any) => ({ ...prev, status: "Connecting..." }));
      setVideoUrl("");

      try {
        const rtspUrl = createRtspUrl(formData);
        console.log("Starting stream with RTSP URL:", rtspUrl);
        
        const hlsUrl = await startStreamWithRetry(rtspUrl, 2);
        setVideoUrl(hlsUrl);
        setVideoInfo((prev: any) => ({
          ...prev,
          status: "Connected",
          error: null,
        }));
      } catch (error: any) {
        console.error("Stream setup failed:", error);
        setConnectionStatus("error");
        setVideoInfo((prev: any) => ({
          ...prev,
          status: "Error",
          error: error?.message || "Failed to start stream",
        }));
        setPopupMessage("Connection failed: " + (error?.message || "Check camera configuration"));
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 5000);
      }
    };

    setupStream();
  }, [formData]);

  const handleSelect1 = (value: string) => {
    setSelectedCenter(value);
    setSelectedClass("");
    setVideoUrl("");
    setIsPlaying(false);
    setConnectionStatus("idle");
  };

  const handleSelect2 = (value: any) => {
    setSelectClass(value);
    setSelectedClass("");
    setVideoUrl("");
    setConnectionStatus("idle");
  };

  const handleSelect = (value: string) => {
    if (!selectedCenter) {
      setPopupMessage("Please select a center first");
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
      return;
    }
    if (!selectClass) {
      setPopupMessage("Please select a class type first");
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
      return;
    }
    setSelectedClass(value);
    setVideoUrl("");
    setIsPlaying(false);
    setConnectionStatus("idle");
  };

  const retryConnection = () => {
    if (formData) {
      setVideoUrl("");
      setConnectionStatus("idle");
      // Re-trigger the stream setup
      setFormData({...formData});
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(e => console.log("Play failed:", e));
      }
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      videoRef.current?.requestFullscreen().catch(e => console.log("Fullscreen error:", e));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // HLS setup
  useEffect(() => {
    let hls: Hls | null = null;
    console.log(videoUrl,"videoUrl")
    if (videoUrl && videoRef.current) {
      const video = videoRef.current;

      const handlePlay = () => {
        setIsPlaying(true);
        setConnectionStatus("connected");
      };
      const handlePause = () => setIsPlaying(false);
      const handleWaiting = () => setConnectionStatus("buffering");
      const handlePlaying = () => setConnectionStatus("connected");
      const handleError = (e: any) => {
        console.error("Video error:", e);
        setConnectionStatus("error");
      };

      video.addEventListener('play', handlePlay);
      video.addEventListener('pause', handlePause);
      video.addEventListener('waiting', handleWaiting);
      video.addEventListener('playing', handlePlaying);
      video.addEventListener('error', handleError);

      if (Hls.isSupported()) {
        hls = new Hls({
          enableWorker: false, // Disable worker for better compatibility
          lowLatencyMode: true,
          backBufferLength: 30,
        });
        
        hls.loadSource(videoUrl);
        hls.attachMedia(video);
        
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          console.log("HLS manifest parsed, starting playback");
          video.play().catch(e => {
            console.log("Auto-play failed, user interaction required:", e);
          });
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error("HLS error:", data);
          if (data.fatal) {
            setConnectionStatus("error");
          }
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        // Native HLS support (Safari)
        video.src = videoUrl;
        video.addEventListener('loadedmetadata', () => {
          video.play().catch(e => console.log("Auto-play failed:", e));
        });
      }

      return () => {
        if (hls) {
          hls.destroy();
        }
        video.removeEventListener('play', handlePlay);
        video.removeEventListener('pause', handlePause);
        video.removeEventListener('waiting', handleWaiting);
        video.removeEventListener('playing', handlePlaying);
        video.removeEventListener('error', handleError);
      };
    }
  }, [videoUrl]);
console.log(connectionStatus,"connectionStatus")
  return (
    <div className="page-wrapper">
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="notification-popup"
          >
            <FaExclamationTriangle className="popup-icon" />
            <span>{popupMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="video-player-container">
        <div className="video-player-header">
          <h2>Live Camera Feed</h2>
          <div className="channel-selector">
            <div className="select-wrapper gap-2">
              <SelectCenters selectedCenter={selectedCenter} handleSelect={handleSelect1} />
              <SelectClassType selectedClass={selectClass} type="" selectedCenter={selectedCenter} handleSelect={handleSelect2} />
              <motion.select
                name="selectChannel"
                className="form-select"
                value={selectedClass}
                onChange={(e: any) => handleSelect(e.target.value)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={!selectedCenter || !selectClass}
              >
                <option value="">Select Channel</option>
                {centers.map((center) => (
                  <option key={center.id} value={center.ClassName}>
                    {center.ClassName}
                  </option>
                ))}
              </motion.select>
            </div>
          </div>
        </div>

        {loader ? (
          <div className="loading-overlay">
            <Loading />
            <p>Loading camera details...</p>
          </div>
        ) : (
          <div className="video-content">
            {videoInfo && (
              <div className="video-info-card">
                <div className="info-header">
                  <h3>{videoInfo.name}</h3>
                  {connectionStatus === "error" && (
                    <motion.button 
                      onClick={retryConnection}
                      className="retry-button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaSync /> Retry
                    </motion.button>
                  )}
                </div>
                <div className="info-grid">
                  <div>
                    <span className="info-label">Status:</span>
                    <span >
                      {connectionStatus == "connecting" && `Connecting... (${retryCount})`}
                      {connectionStatus == "buffering" && "Buffering..."}
                      {connectionStatus == "connected" && "Connected"}
                      {connectionStatus == "error" && "Connection Failed"}
                      {connectionStatus == "idle" && "Ready to Connect"}
                    </span>
                  </div>
                  <div>
                    <span className="info-label">IP Address:</span>
                    <span>{videoInfo.ip}</span>
                  </div>
                </div>
              </div>
            )}

            {videoUrl ? (
              <div className="video-wrapper">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  muted
                  playsInline
                  controls
                  className="video-element" 
                />
                <div className="video-controls">
                  <motion.button onClick={togglePlayPause} className="control-button" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    {isPlaying ? <FaPause /> : <FaPlay />}
                  </motion.button>
                  <motion.button onClick={toggleFullscreen} className="control-button" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <FaExpand />
                  </motion.button>
                </div>
              </div>
            ) : (
              <div className="video-placeholder">
                {selectedClass ? (
                  <div className="connecting-message">
                    <FaCog className="spinner-icon" />
                    <p>Establishing connection to {selectedClass}...</p>
                    {connectionStatus === "connecting" && (
                      <p className="retry-count">Attempt {retryCount} of 2</p>
                    )}
                    {connectionStatus === "error" && (
                      <button onClick={retryConnection} className="btn btn-primary mt-2">
                        <FaSync /> Try Again
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="select-message">
                    <FaVideo className="video-icon" />
                    <p>
                      {!selectedCenter ? "Please select a center first" : 
                       !selectClass ? "Please select a class type" : 
                       "Please select a channel to view the live feed"}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;