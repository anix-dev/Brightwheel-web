import React, { useEffect, useState } from "react";
import api from "../../core/data/api";
import { toast } from "react-toastify";
import SelectCenter from "../Center/selectCenter";
import { useNavigate, useParams } from "react-router-dom";
import { all_routes } from "../../feature-module/router/all_routes";

export default function AddWish() {
  const { ids } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}")?.id || 0;
  const [wishTypes, setWishTypes] = useState<{ id: number; name: string }[]>(
    []
  );
  const [newWishType, setNewWishType] = useState("");
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState<any>("");

  const [formData, setFormData] = useState({
    wishType: "",
    name: "",
    message: "",
    date: "",
  });

  const handleSelect = (centerId: number | string) => {
    setSelectedCenter(centerId);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddWishType = async () => {
    if (!newWishType.trim()) return;

    try {
      const res = await api.post("/api/mssql-procedure/execute", {
        procedureName: "WishTypesInsert",
        parameters: [
          { name: "name", type: "VarChar", value: newWishType },
          { name: "CREATED_BY", type: "Int", value: user },
          { name: "ACTIVE", type: "Int", value: 1 },
        ],
      });

      if (res.data.success) {
        toast.success("Wish type added successfully");
        getWishesData();
        setNewWishType("");
      }
    } catch (error) {
      // toast.error("Failed to add wish type");
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { wishType, message, date } = formData;

    if (!wishType || !message || !selectedCenter) {
      toast.warning("Please fill all required fields");
      setLoading(false);
      return;
    }

    const parameters = [
      ...(ids !== ":ids" ? [{ name: "ID", type: "Int", value: ids }] : []),
      { name: "CenterID", type: "Int", value: Number(selectedCenter) },
      { name: "WishTypeID", type: "VarChar", value: wishType },
      { name: "ACTIVE", type: "VarChar", value: "1" },
      { name: "Messsage", type: "VarChar", value: message },
      { name: "DueDate", type: "VarChar", value: date },
      { name: "CREATED_BY", type: "Int", value: user },
    ];
    const procedureName = ids == ":ids" ? "WishListInsert" : "WishListUpdate";
    try {
      const res = await api.post("/api/mssql-procedure/execute", {
        procedureName,
        parameters,
      });

      if (res.data.success) {
        toast.success("Wish saved successfully!");
        navigate(all_routes.wish);
      } else {
        // toast.error("Failed to save wish");
      }
    } catch (error) {
      // toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const getWishesData = async () => {
    try {
      const res = await api.post("/api/mssql-procedure/execute/get", {
        procedureName: "WishTypesGetAll",
        parameters: [],
      });

      if (res.data.success) {
        const wishTypeList = res.data.centers.map((center: any) => ({
          id: center.ID,
          name: center.Name,
        }));
        setWishTypes(wishTypeList);
      }
    } catch (error) {
      // toast.error("Error loading wish types");
    }
  };

  const fetchWishById = async () => {
    if (!ids) return;

    setFormLoading(true);
    try {
      const res = await api.post("/api/mssql-procedure/execute", {
        procedureName: "WishListbyId",
        parameters: [{ name: "ID", type: "Int", value: ids }],
      });

      if (res.data.success && res.data.record.length > 0) {
        const record = res.data.record[0];
        setFormData({
          wishType: record.WishTypeID?.toString() || "",
          name: record.Name || "",
          message: record.Messsage || "", // Fixed typo
          date: record.DueDate?.split("T")[0] || "",
        });
        setSelectedCenter(record.CenterID);
      }
    } catch (error) {
    } finally {
      setFormLoading(false);
    }
  };
  useEffect(() => {
    getWishesData();
  }, []);

  useEffect(() => {
    if (ids) {
      fetchWishById();
    }
  }, [ids]);

  return (
    <div className="page-wrapper">
      <div className="content content-two">
        <div className="card board-hover mb-3 mt-3">
          {formLoading ? (
            <div className="text-center py-5">Loading wish details...</div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="row justify-content-center">
                <div className="col-lg-8">
                  <h4 className="text-dark mt-0 mb-3 text-center">
                    Wish Details
                  </h4>

                  <div className="mb-3 text-center wishtype-section">
                    <label className="form-label">Select Wish Type</label>
                    <select
                      name="wishType"
                      className="form-select text-center mx-auto"
                      value={formData.wishType}
                      onChange={handleChange}
                    >
                      <option value="">Select a type</option>
                      {wishTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.name}
                        </option>
                      ))}
                    </select>

                    <div className="mt-3">
                      <label className="form-label">Or Add New Wish Type</label>
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control"
                          value={newWishType}
                          onChange={(e) => setNewWishType(e.target.value)}
                          placeholder="Enter new wish type"
                        />
                        <button
                          type="button"
                          className="btn btn-outline-primary"
                          onClick={handleAddWishType}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label>Select Center</label>
                    <SelectCenter
                      selectedCenter={selectedCenter}
                      handleSelect={handleSelect}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Your Message</label>
                    <textarea
                      name="message"
                      className="form-control"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Write your wish message here"
                      rows={4}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Due Date</label>
                    <input
                      type="date"
                      name="date"
                      className="form-control"
                      value={formData.date}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="row mt-3 mb-3">
                <div className="col-12 text-center">
                  <button
                    type="submit"
                    className="btn btn-primary px-4 py-2"
                    disabled={loading}
                  >
                    {loading
                      ? "Submitting..."
                      : ids !== ":ids"
                      ? "Update Wish"
                      : "Add Wish"}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
