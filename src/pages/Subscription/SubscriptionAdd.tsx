import React, { useState } from "react";
import { useFormik } from "formik";
import "./subscription.css";
import * as Yup from "yup";
import { useNavigate } from "react-router";
import api from "../../core/data/api";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { all_routes } from "../../feature-module/router/all_routes";

interface SubscriptionFormValues {
  plans: string;
  amount: string;
  expiresIn: string;
  description: string;
  descriptions: string[];
  charges?: string;
  price1?: string;
  discount1?: string;
  gst1?: string;
  schoolcost?: string;
  price2?: string;
  discount2?: string;
  gst2?: string;
}

const SubscriptionAdd = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"epr" | "cctv">("epr");
  const [descriptions, setDescriptions] = useState<string[]>([""]);

  const handleInputChange = (index: number, value: string) => {
    const updated = [...descriptions];
    updated[index] = value;
    setDescriptions(updated);
    formik.setFieldValue("descriptions", updated);
  };

  const addDescription = () => {
    const updated = [...descriptions, ""];
    setDescriptions(updated);
    formik.setFieldValue("descriptions", updated);
  };

  const removeDescription = (index: number) => {
    const updated = descriptions.filter((_, i) => i !== index);
    setDescriptions(updated);
    formik.setFieldValue("descriptions", updated);
  };

  const formik = useFormik<SubscriptionFormValues>({
    initialValues: {
      plans: "",
      amount: "",
      price1: '',
      price2: '',
      charges:'',
      discount1: '',
       discount2:'',
      gst1: '',
      schoolcost:'',
       gst2: '',
      expiresIn: "",
      description: "",
      descriptions: [""],
    },
    validationSchema: Yup.object({
      plans: Yup.string().required("Please select a plan"),
      amount: Yup.string().required("Please enter amount"),
      descriptions: Yup.array()
        .of(Yup.string().required("Description is required"))
        .min(1, "Please enter at least one description")
        .required("Please enter description"),
      ...(activeTab === "epr" ? {
        charges: Yup.string().required("Implementation charges required"),
        price1: Yup.number().required('Price is required'),
        discount1: Yup.number().required('Discount amount is required'),
        gst1: Yup.number().required('GST is required'),
      } : {
        schoolcost: Yup.string().required("Annual cost required"),
        price2: Yup.number().required('Price is required'),
        discount2: Yup.number().required('Discount amount is required'),
        gst2: Yup.number().required('GST is required'),
      })
    }),
    onSubmit: async (values) => {
      try {
        const formattedDescriptions = descriptions.join(",");
        const res = await api.post("/api/mssql-procedure/execute", {
          procedureName: "SubscriptionInsert",
          parameters: [
            { name: "PLANS", type: "VarChar", value: values.plans },
            { name: "AMOUNT", type: "Int", value: values.amount },
            { name: "description", type: "VarChar", value: formattedDescriptions },
          ],
        });

        if (res.data.success) {
          toast.success("Subscription added successfully");
          navigate(all_routes.subscription);
        }
      } catch (error) {
        console.log("Error adding subscription:", error);
        toast.error("Failed to add subscription");
      }
    },
  });

  return (
    <div className="page-wrapper">
      <div className="content content-two">
        <div className="card board-hover mb-3 mt-3">
          <div className="card-header border-0 pb-0">
            <div className="bg-light-gray p-3 rounded">
              <h4>Add Subscription</h4>
              <p>Add Subscription details</p>
            </div>
          </div>
          <div className="card-body">
            <form onSubmit={formik.handleSubmit}>
              <div className="row">
                <div className="col-lg-6">
                  <div className="card smoky-border mb-3">
                      <h4 className="text-dark mt-0 mb-1">Subscription Details</h4>
                      <div className="mb-3">
                        <label className="form-label">Plans</label>
                        <select
                          className={`form-select ${
                            formik.touched.plans && formik.errors.plans ? "is-invalid" : ""
                          }`}
                          {...formik.getFieldProps("plans")}
                        >
                          <option value="">Select Plan</option>
                          <option value="monthly">Monthly</option>
                          <option value="yearly">Yearly</option>
                        </select>
                        {formik.touched.plans && formik.errors.plans && (
                          <div className="invalid-feedback">
                            {formik.errors.plans}
                          </div>
                        )}
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Amount</label>
                        <input
                          type="text"
                          className={`form-control ${
                            formik.touched.amount && formik.errors.amount ? "is-invalid" : ""
                          }`}
                          {...formik.getFieldProps("amount")}
                        />
                        {formik.touched.amount && formik.errors.amount && (
                          <div className="invalid-feedback">
                            {formik.errors.amount}
                          </div>
                        )}
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Description</label>
                        {descriptions.map((desc, index) => (
                          <div
                            key={index}
                            className="mb-2 d-flex align-items-center"
                          >
                            <input
                              type="text"
                              className={`form-control me-2 ${
                                formik.touched.descriptions && 
                                formik.errors.descriptions ? "is-invalid" : ""
                              }`}
                              value={desc}
                              onChange={(e) =>
                                handleInputChange(index, e.target.value)
                              }
                              placeholder={`Description ${index + 1}`}
                            />
                            {descriptions.length > 1 && (
                              <button
                                type="button"
                                className="btn btn-danger btn-sm"
                                onClick={() => removeDescription(index)}
                                aria-label="Remove description"
                              >
                                ×
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          className="btn btn-primary btn-sm mt-2 p-2"
                          onClick={addDescription}
                        >
                          + Add Description
                        </button>
                        {formik.touched.descriptions &&
                        typeof formik.errors.descriptions === "string" ? (
                          <div className="text-danger small mt-1">
                            {formik.errors.descriptions}
                          </div>
                        ) : null}
                      </div>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="card smoky-border">
                      <ul className="nav nav-tabs mb-2">
                        <li className="nav-item">
                          <button
                            type="button"
                            className={`nav-link ${
                              activeTab === "epr" ? "active" : ""
                            }`}
                            onClick={() => setActiveTab("epr")}
                            style={{
                              backgroundColor:
                                activeTab === "epr" ? "#506ee44a" : "transparent",
                              color: activeTab === "epr" ? "#3555d3" : "#506ee4",
                              borderBottomColor: "#506ee4",
                              borderRadius: "5px",
                              marginTop:"-15px"
                            }}
                          >
                            EPR Solution
                          </button>
                        </li>
                        <li className="nav-item">
                          <button
                            type="button"
                            className={`nav-link ${
                              activeTab === "cctv" ? "active" : ""
                            }`}
                            style={{
                              backgroundColor:
                                activeTab === "cctv" ? "#506ee44a" : "transparent",
                              color: activeTab === "cctv" ? "#3555d3" : "#506ee4",
                              borderBottomColor: "#506ee4",
                              borderRadius: "5px",
                              marginTop:"-15px"

                            }}
                            onClick={() => setActiveTab("cctv")}
                          >
                            Only Live CCTV
                          </button>
                        </li>
                      </ul>
                      {activeTab === "epr" && (
                        <div>
                          <div className="mb-3">
                            <label className="form-label">
                              Live CCTV Implementation Charges
                            </label>
                            <input
                              type="text"
                              className={`form-control ${
                                formik.touched.charges && formik.errors.charges ? "is-invalid" : ""
                              }`}
                              {...formik.getFieldProps("charges")}
                            />
                            {formik.touched.charges && formik.errors.charges && (
                              <div className="invalid-feedback">
                                {formik.errors.charges}
                              </div>
                            )}
                          </div>
                          <div className="mb-3">
                            <label className="form-label">Price</label>
                            <input
                              type="text"
                              className={`form-control ${
                                formik.touched.price1 && formik.errors.price1 ? "is-invalid" : ""
                              }`}
                              {...formik.getFieldProps("price1")}
                            />
                            {formik.touched.price1 && formik.errors.price1 && (
                              <div className="invalid-feedback">
                                {formik.errors.price1}
                              </div>
                            )}
                          </div>
                          <div className="mb-3">
                            <label className="form-label">
                              Additional Discount
                            </label>
                            <input
                              type="text"
                              className={`form-control ${
                                formik.touched.discount1 && formik.errors.discount1 ? "is-invalid" : ""
                              }`}
                              {...formik.getFieldProps("discount1")}
                            />
                            {formik.touched.discount1 && formik.errors.discount1 && (
                              <div className="invalid-feedback">
                                {formik.errors.discount1}
                              </div>
                            )}
                          </div>
                          <div className="mb-3">
                            <label className="form-label">GST (in percentage)</label>
                            <input
                              type="text"
                              className={`form-control ${
                                formik.touched.gst1 && formik.errors.gst1 ? "is-invalid" : ""
                              }`}
                              {...formik.getFieldProps("gst1")}
                            />
                            {formik.touched.gst1 && formik.errors.gst1 && (
                              <div className="invalid-feedback">
                                {formik.errors.gst1}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      {activeTab === "cctv" && (
                        <div>
                          <div className="mb-3">
                            <label className="form-label">
                              School ERP Annual Cost
                            </label>
                            <input
                              type="text"
                              className={`form-control ${
                                formik.touched.schoolcost && formik.errors.schoolcost ? "is-invalid" : ""
                              }`}
                              {...formik.getFieldProps("schoolcost")}
                            />
                            {formik.touched.schoolcost && formik.errors.schoolcost && (
                              <div className="invalid-feedback">
                                {formik.errors.schoolcost}
                              </div>
                            )}
                          </div>
                          <div className="mb-3">
                            <label className="form-label">Price</label>
                            <input
                              type="text"
                              className={`form-control ${
                                formik.touched.price2 && formik.errors.price2 ? "is-invalid" : ""
                              }`}
                              {...formik.getFieldProps("price2")}
                            />
                            {formik.touched.price2 && formik.errors.price2 && (
                              <div className="invalid-feedback">
                                {formik.errors.price2}
                              </div>
                            )}
                          </div>
                          <div className="mb-3">
                            <label className="form-label">
                              Additional Discount
                            </label>
                            <input
                              type="text"
                              className={`form-control ${
                                formik.touched.discount2 && formik.errors.discount2 ? "is-invalid" : ""
                              }`}
                              {...formik.getFieldProps("discount2")}
                            />
                            {formik.touched.discount2 && formik.errors.discount2 && (
                              <div className="invalid-feedback">
                                {formik.errors.discount2}
                              </div>
                            )}
                          </div>
                          <div className="mb-3">
                            <label className="form-label">GST (in percentage)</label>
                            <input
                              type="text"
                              className={`form-control ${
                                formik.touched.gst2 && formik.errors.gst2 ? "is-invalid" : ""
                              }`}
                              {...formik.getFieldProps("gst2")}
                            />
                            {formik.touched.gst2 && formik.errors.gst2 && (
                              <div className="invalid-feedback">
                                {formik.errors.gst2}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              </div>

              <div className="row mt-3">
                <div className="col-12 d-flex justify-content-end">
                  <button
                    type="submit"
                    className="btn btn-primary me-2"
                    disabled={formik.isSubmitting}
                  >
                    {formik.isSubmitting ? "Submitting..." : "Submit"}
                  </button>
                  <Link
                    to={all_routes.subscription}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionAdd;