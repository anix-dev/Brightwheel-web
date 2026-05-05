import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { driverName, PickupPoint2, routesList, VehicleNumber } from "../../core/common/selectoption/selectoption";
import CommonSelect from "../../core/common/commonSelect";
import ImageWithBasePath from "../../core/common/imageWithBasePath";
import dayjs from "dayjs";
import { DatePicker } from "antd";
import SelectCenter from "../Center/selectCenter";
import api from "../../core/data/api";
import { toast } from 'react-toastify';

interface formdetail {
  Name: string;
  address: string;
  phone: string;
  image: File | string | null;
  license: string;
}

interface SelectCenterProps {
  Id: any;
}

const TransportModal: React.FC<SelectCenterProps> = ({ Id }) => {
  const today = new Date();
  const user = localStorage.getItem('user');
  const year = today.getFullYear();
  const [loading, setLoading] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState<string>("");
  const [detail, setDetails] = useState<any>(null);
  const [formData, setformData] = useState<formdetail>({
    Name: "",
    address: "",
    phone: "",
    image: null,
    license: "",
  });

  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const formattedDate = `${month}-${day}-${year}`;
  const defaultValue = dayjs(formattedDate);

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let imagedata = formData.image;
      
   
      if (formData.image instanceof File) {
        const formDatas = new FormData();
        formDatas.append("images", formData.image);
        const resp = await api.post("/upload", formDatas);
        imagedata = resp.data?.data?.[0]?.url || "";
      }

      const procedureName = Id ? "VehicleDriverUpdate" : "VehicleDriverInsert";
      const parameters = Id
        ? [
            { name: "ID", type: "Int", value: Id },
            { name: "phone", type: "VarChar", value: formData.phone },
            { name: "address", type: "VarChar", value: formData.address },
            { name: "license", type: "VarChar", value: formData.license },
            { name: "Name", type: "VarChar", value: formData.Name },
            { name: "image", type: "VarChar", value: imagedata },
            { name: "Center", type: "VarChar", value: selectedCenter },
            { name: "CREATED_BY", type: "Int", value: user },
          ]
        : [
            { name: "phone", type: "VarChar", value: formData.phone },
            { name: "address", type: "VarChar", value: formData.address },
            { name: "license", type: "VarChar", value: formData.license },
            { name: "Name", type: "VarChar", value: formData.Name },
            { name: "image", type: "VarChar", value: imagedata },
            { name: "Center", type: "VarChar", value: selectedCenter },
            { name: "Class", type: "VarChar", value: "0" },
            { name: "ACTIVE", type: "Int", value: 1 },
            { name: "CREATED_BY", type: "Int", value: user },
          ];

      const response = await api.post("/api/mssql-procedure/execute", {
        procedureName,
        parameters,
      });

      if (response.data.success) {
        toast.success(`Driver ${Id ? 'updated' : 'added'} successfully`);
            setformData({
            Name:  "",
            address:  "",
            phone: "",
            license: "",
            image: null,
          });
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const res = await api.post("/api/mssql-procedure/execute", {
          procedureName: "VehicleDriverGetById",
          parameters: [
            { name: "ID", type: "Int", value: Id },
          ],
        });
        
        if (res.data.record && res.data.record.length > 0) {
          const driverData = res.data.record[0];
          setDetails(driverData);
          setformData({
            Name: driverData.Name || "",
            address: driverData.address || "",
            phone: driverData.phone || "",
            license: driverData.license || "",
            image: driverData.image || null,
          });
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    
    if (Id!=undefined) {
      getData();
    }
  }, [Id]);

  return (
    <>
      {/* Add Driver Modal */}
      <div className="modal fade" id="add_driver">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Add New Driver</h4>
              <button
                type="button"
                className="btn-close custom-btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-12">
                    <div className="mb-3">
                      {formData.image && (
                        <img
                          src={
                            typeof formData.image === 'string' 
                              ? formData.image 
                              : URL.createObjectURL(formData.image)
                          }
                          alt="Preview"
                          width={150}
                          height={150}
                          style={{ marginTop: 10 }}
                        />
                      )}
                      <label className="form-label">Upload Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        className="form-control"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setformData({
                              ...formData,
                              image: file,
                            });
                          }
                        }}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Select Center</label>
                      <SelectCenter
                        selectedCenter={selectedCenter}
                        handleSelect={setSelectedCenter}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Name</label>
                      <input 
                        type="text" 
                        value={formData.Name}
                        onChange={(e) => setformData({...formData, Name: e.target.value})}
                        className="form-control" 
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Phone Number</label>
                      <input 
                        type="text" 
                        value={formData.phone}
                        onChange={(e) => setformData({...formData, phone: e.target.value})}
                        className="form-control" 
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Driving License Number</label>
                      <input
                        type="text"
                        value={formData.license}
                        className="form-control"
                        onChange={(e) => setformData({...formData, license: e.target.value})}
                        placeholder="Enter Driving License Number"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Address</label>
                      <input 
                        type="text"
                        value={formData.address}
                        onChange={(e) => setformData({...formData, address: e.target.value})}
                        className="form-control" 
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <Link
                  to="#"
                  className="btn btn-light me-2"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                >
                  {loading ? 'Saving...' : 'Add Driver'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Edit Driver Modal */}
      <div className="modal fade" id="edit_driver">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Edit Driver</h4>
              <button
                type="button"
                className="btn-close custom-btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-12">
                    <div className="mb-3">
                      {formData.image && (
                        <img
                          src={
                            typeof formData.image === 'string' 
                              ? formData.image 
                              : URL.createObjectURL(formData.image)
                          }
                          alt="Preview"
                          width={150}
                          height={150}
                          style={{ marginTop: 10 }}
                        />
                      )}
                      <label className="form-label">Upload Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        className="form-control"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setformData({
                              ...formData,
                              image: file,
                            });
                          }
                        }}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Name"
                        value={formData.Name}
                        onChange={(e) => setformData({...formData, Name: e.target.value})}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Phone Number</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.phone}
                        placeholder="Enter Phone Number"
                        onChange={(e) => setformData({...formData, phone: e.target.value})}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Driving License Number</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.license}
                        placeholder="Enter Driving License Number"
                        onChange={(e) => setformData({...formData, license: e.target.value})}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Address</label>
                      <input
                        type="text"
                        value={formData.address}
                        className="form-control"
                        placeholder="Enter Address"
                        onChange={(e) => setformData({...formData, address: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <Link
                  to="#"
                  className="btn btn-light me-2"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Other modals remain the same */}
      {/* ... */}
    </>
  );
};

export default TransportModal;