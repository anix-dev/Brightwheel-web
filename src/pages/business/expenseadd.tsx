import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Route, useNavigate, useParams } from "react-router";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import api from "../../core/data/api";
import { route } from "../../core/common/selectoption/selectoption";
import { all_routes } from "../../feature-module/router/all_routes";

const Expenseadd = () => {
  const navigate = useNavigate()
  const user = localStorage.getItem('user')
  const { id } = useParams<{ id?: string }>();
  const resolvedIdNullable = id ? parseInt(id, 10) : null;
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const formik = useFormik({
    initialValues: {
      ExpensesDate: "",
      ExpenseHeadID: "",
      Value: "",
      ReviewedBy: "",
      TransactionNumber: "",
      Details: "",
      ModeOfPayment: "",
      ExpenseBy: "",
      CREATED_BY: "",
    },
    validationSchema: Yup.object({
      ExpensesDate: Yup.string().required("Please select Expense Date"),
      ExpenseHeadID: Yup.string().required("Please select any "),
      Value: Yup.date().required("Expense Value is Needed"),
      ReviewedBy: Yup.string().required("who received this payment"),
      Details: Yup.string().required("Expense Head  is required"),
      ModeOfPayment: Yup.string().required("Please select payment mode "),
      ExpenseBy: Yup.string().required("Add who made this expense"),
      CREATED_BY: Yup.string()
    }),
    onSubmit: async (values) => {
      try {
        const res = await api.post("/api/mssql-procedure/execute", {
          procedureName: "ExpensesInsert",
          parameters: [
            { "name": "ExpensesDate", "type": "Date", value: values.ExpensesDate },
            { "name": "ExpenseHeadID", "type": "Int", value: values.ExpenseHeadID },
            { "name": "Value", "type": "Int", value: values.Value },
            { "name": "ReviewedBy", "type": "VarChar", value: values.ReviewedBy },
            { "name": "Details", "type": "VarChar", value: values.Details},
            { "name": "ModeOfPayment", "type": "Int", value: values.ModeOfPayment },
            { "name": "TransactionNumber", "type": "VarChar", value: values.TransactionNumber },
            { "name": "ExpenseBy", "type": "VarChar", value: values.ExpenseBy },
            { "name": "CREATED_BY", "type": "Int", value:user },
            { "name": "SchoolId", "type": "Int", value:user },
          ],
        });

        if (res.data.success) {
          toast.success('Expense added successfully')
          navigate(all_routes.noticeBoardTwo)

          // Handle success (e.g., display success message or reset form)
        }
      } catch (error) {
        console.log("Error inserting teacher:", error);
        // Handle error (e.g., display error message)
      }
    },
  });
  useEffect(() => {
    if (id) {
      setIsEdit(true)
    }
    setIsEdit(!resolvedIdNullable===false)
  }, [id]);

  return (
    <div>
      <div className="page-wrapper">
        <div className="content content-two">
          <div className="card board-hover mb-3 mt-3">
            <h2 className="m-3 mb-1" style={{ marginLeft: "10px" }}>{isEdit ? "Edit" :"Add"} Expense</h2>
            <div className="" style={{ margin: "20px" }}>
              <div className="modal-content">
                <div className="modal-body">
                  <form onSubmit={formik.handleSubmit}>
                    <div className="row">
                      {/* Choose Class */}
                      <div className="col-lg-6">
                        <div className="mb-3">
                          <label className="form-label">Choose Date*</label>
                          <input
                            type="date"
                            className="form-control"
                            {...formik.getFieldProps("ExpensesDate")}

                          />
                          {formik.touched.ExpensesDate && formik.errors.ExpensesDate ? (
                            <div className="text-danger">{formik.errors.ExpensesDate}</div>
                          ) : null}
                        </div>
                      </div>

                      <div className="col-lg-6">
                        <div className="mb-3">
                          <label className="form-label">Mode Of Payment*</label>
                          <select
                            className="form-select"
                            {...formik.getFieldProps("ModeOfPayment")}
                          >
                            <option>Select</option>
                            <option value="0">Cash</option>
                            <option value="1">Cheque</option>
                            <option value="2">Net-Banking</option>
                            <option value="3">UPI</option>
                            <option value="4">Debit/Credit Card</option>
                            <option value="5">Any Other</option>
                            
                          </select>
                          {formik.touched.ModeOfPayment && formik.errors.ModeOfPayment ? (
                            <div className="text-danger">{formik.errors.ModeOfPayment}</div>
                          ) : null}
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="mb-3">
                          <label className="form-label">Choose from previous Expense Head*</label>
                         <select
                            className="form-select"
                            {...formik.getFieldProps("ExpenseHeadID")}
                          >
                            <option>Select</option>
                            <option value="0">Rent</option>
                            <option value="1">Salary</option>
                            <option value="2">Electricity</option>
                            <option value="3">Internet</option>
                            <option value="4">Phone</option>
                            <option value="5">Stationary</option>
                            <option value="6">Marketing</option>

                          </select>
                          {formik.touched.ExpenseHeadID && formik.errors.ExpenseHeadID ? (
                            <div className="text-danger">{formik.errors.ExpenseHeadID}</div>
                          ) : null}
                        </div>
                      </div>

                    
                      <div className="col-lg-6">
                        <div className="mb-3">
                          <label className="form-label">Expense Head(Add New Here) *</label>
                          <input
                            type="text"
                            className="form-control"
                            {...formik.getFieldProps("Details")}
                          />
                          {formik.touched.Details && formik.errors.Details ? (
                            <div className="text-danger">{formik.errors.Details}</div>
                          ) : null}
                        </div>
                      </div>

                      
                      <div className="col-lg-6">
                        <div className="mb-3">
                          <label className="form-label">Expense Value(Inc. Tax)*</label>
                          <input
                            type="number"
                            className="form-control"
                            {...formik.getFieldProps("Value")}
                          />
                          {formik.touched.Value && formik.errors.Value ? (
                            <div className="text-danger">{formik.errors.Value}</div>
                          ) : null}
                        </div>
                      </div>

                      
                      <div className="col-lg-6">
                        <div className="mb-3">
                          <label className="form-label">Transaction Number</label>
                          <input
                            type="text"
                            className="form-control"
                            {...formik.getFieldProps("TransactionNumber")}
                          />
                          {formik.touched.TransactionNumber && formik.errors.TransactionNumber ? (
                            <div className="text-danger">{formik.errors.TransactionNumber}</div>
                          ) : null}
                        </div>
                      </div>

                
                      <div className="col-lg-6">
                        <div className="mb-3">
                          <label className="form-label">Expense Received By (Person/Business) *</label>
                          <input
                            type="text"
                            className="form-control"
                            {...formik.getFieldProps("ReviewedBy")}
                           
                          />
                          {formik.touched.ReviewedBy && formik.errors.ReviewedBy ? (
                            <div className="text-danger">{formik.errors.ReviewedBy}</div>
                          ) : null}
                        </div>
                      </div>

                      
                      <div className="col-lg-6">
                        <div className="mb-3">
                          <label className="form-label">Expense Done By*</label>
                          <input
                            type="text"
                            className="form-control"
                            {...formik.getFieldProps("ExpenseBy")}

                          />
                          {formik.touched.ExpenseBy && formik.errors.ExpenseBy ? (
                            <div className="text-danger">{formik.errors.ExpenseBy}</div>
                          ) : null}
                        </div>
                      </div>
                      {/* <div className="col-lg-12">
                        <div className="mb-3">
                          <label className="form-label">Expense Details</label>
                          <input
                            type="text"
                            className="form-control"
                            {...formik.getFieldProps("Details")}
                          />
                          {formik.touched.Details && formik.errors.Details ? (
                            <div className="text-danger">{formik.errors.Details}</div>
                          ) : null}
                        </div>
                      </div> */}
                    </div>
                    <div className="modal-footer">
                      <button type="submit" className="btn btn-primary">Add Expense</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Expenseadd;
