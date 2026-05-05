import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import './subscription.css';
import * as Yup from "yup";
import { Route, useNavigate, useParams } from "react-router";
import api from "../../core/data/api";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { all_routes } from "../../feature-module/router/all_routes";


const SubscriptionEdit = () => {
  const navigate = useNavigate()
  const {id} = useParams()
const { user } = useSelector((state: any) => state.user);
const [options, setOptions] = useState<any>({});
const [loading, setIsLoading] = useState<boolean>(true);
const [descriptions, setDescriptions] = useState(['']);
const handleInputChange = (index: number, value: string) => {
  const updated = [...descriptions];
  updated[index] = value;
  setDescriptions(updated);
  formik.setFieldValue('descriptions', updated);
};

const addDescription = () => {
  const updated = [...descriptions, ''];
  setDescriptions(updated);
  formik.setFieldValue('descriptions', updated);
};

const removeDescription = (index: number) => {
  const updated = descriptions.filter((_, i) => i !== index);
  setDescriptions(updated);
  formik.setFieldValue('descriptions', updated);
};
const formik = useFormik({
  initialValues: {
    plans: options.PLANS || '', // fallback to empty string
    amount: options.AMOUNT || '',
    descriptions: options.description || [''],
  },
  enableReinitialize:true,
  validationSchema: Yup.object({
    plans: Yup.string().required("Please select plans"),
    amount: Yup.string().required("Please enter amount "),
    descriptions: Yup.array().of(Yup.string()).min(1, "Please enter at least one description"),
  }),
  onSubmit: async (plans) => {
    try {
      const formattedDescriptions = descriptions.join(',');
      const res = await api.post("/api/mssql-procedure/execute", {
        procedureName: "SubscriptionUpdate",
        parameters: [
        { "name": "ID", "type": "Int", "value": id },
          { "name": "PLANS", "type": "VarChar", value: plans.plans },
          { "name": "AMOUNT", "type": "Int", value: plans.amount },
          { "name": "description", "type": "VarChar", value: formattedDescriptions },
        ],
      });
      if (res.data.success) {
        toast.success('Subscription Update successfully')
        navigate(all_routes.subscription)

      }
    } catch (error) {
      console.log("Error inserting teacher:", error);
    }
  },
});

const fetchPlan =async()=>{
    try{
        setIsLoading(true)
        const res = await api.post("/api/mssql-procedure/execute", {
            procedureName: "SubscriptionGetbyID",
            parameters: [ 
              { "name": "id", "type": "Int", "value": id },
            ],
        });
        if (res.data.success) {
          setOptions(res.data.record[0])
        }
    }
    catch(error){
        setIsLoading(false)
    }
}
useEffect(()=>{
    fetchPlan()
},[])
useEffect(() => {
    if (options?.description) {
      const descriptionArray = Array.isArray(options.description)
        ? options.description
        : options.description.split(',');
  
      setDescriptions(descriptionArray);
      formik.setFieldValue('descriptions', descriptionArray);
    }
  }, [options?.description]);

  return (
    <div>
      <div className="page-wrapper">
        <div className="content content-two">
          <div className="card board-hover mb-3 mt-3">
          <div className="card-header border-0 pb-0">
            <div className="bg-light-gray p-3 rounded">
              <h4>Edit Subscription</h4>
              <p>Update Subscription details </p>
            </div>
          </div>
            <div className="">
              <form onSubmit={formik.handleSubmit}>
              <div className="row">
                  <div className="col-md-12">
                    <div className="card smoky-border ">
                      <div className="card-body pb-1">
                        <div className="row d-block">
                        <div className="col-xxl col-xl-6 col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Plans</label>
                             <select
                              className="form-select" 
                              {...formik.getFieldProps("plans")} 
                            >
                              <option>Select</option>
                              <option value="monthly">Monthly</option>
                              <option value="yearly">Yearly</option>                         
                            </select>
                          
                            </div>
                        </div>
                        <div className="col-xxl col-xl-6 col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Amount</label>
                              <input 
                              type="text" 
                              className="form-control"
                               {...formik.getFieldProps("amount")}

                            /> 
                             
                            </div>
                        </div>
                        <div className="col-xxl col-xl-6 col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Description</label>
                              {descriptions?.map((desc, index) => (
                                <div key={index} className="mb-2 d-flex align-items-center">
                                  <input
                                    type="text"
                                    className="form-control me-2"
                                    value={desc}
                                    onChange={(e) => handleInputChange(index, e.target.value)}
                                    placeholder={`Description ${index + 1}`}
                                  />
                                  <button
                                    type="button"
                                    className="btn btn-danger btn-sm"
                                    onClick={() => removeDescription(index)}
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                              <button
                                type="button"
                                className="btn btn-primary btn-sm mt-2"
                                onClick={addDescription}
                              >
                                + Add Description
                              </button>               
                                
                            </div>
                        </div>
                       
                        </div>
                        <div className="row">
                          <div className="col-12 d-flex justify-content-end">
                            <button type="submit" className="btn btn-primary me-2">Submit</button>
                            <button type="button" className="btn btn-secondary">
                            <Link to={all_routes.subscription} className="text-white">
                              Cancel
                            </Link>
                          </button>
                          </div>
                        </div>
                      </div>
                      </div>
                    </div>
              </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionEdit;

