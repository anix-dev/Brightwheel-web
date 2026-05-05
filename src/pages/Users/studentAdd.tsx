import React, { useEffect, useState } from 'react';
import api from "../../core/data/api";
import { toast } from "react-toastify";
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import SelectCenter from '../Center/selectCenter';

interface FormData {
    center:string,
    enrollmentNumber: string;
    selectedClass: string;
    studentName: string;
    // studentMobile:String;
    // StudentEmail:String;
    gender: string;
    dob: string;
    motherName: string;
    motherEmail: string;
    motherPhone: string;
    fatherName?: string;
    fatherPhone?: string;
    fatherEmail?: string;
}
const AddStudents = () => {
    const { id } = useParams<{ id?: string }>();
    const resolvedIdNullable = id ? parseInt(id, 10) : null;
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [selectedCenter, setSelectedCenter] = useState<string>('');
    const handleSelect =(item:string)=>{
        setSelectedCenter(item)
    }
    const [formData, setFormData] = useState({
        center:'',
        enrollmentNumber: '',
        selectedClass: '',
        studentName: '',
        studentMobile:'',
        StudentEmail:'',
        gender: '',
        dob: '',
        motherName: '',
        motherEmail: '', 
        motherPhone: '',
        fatherName: '',
        fatherPhone: '',
        fatherEmail: '',
    });

    const navigate= useNavigate()
   

    const [errors, setErrors] = useState<Partial<FormData>>({}); // Handle errors
    const { user } = useSelector((state: any) => state.user);

    const getData = async () => {
        try {
            const res = await api.post("/api/mssql-procedure/execute", {
                procedureName: "StudentGetbyID",
                parameters: [ 
                  { "name": "id", "type": "Int", "value": id },
                ],
            });
            if (res.data.success) {
                setFormData(res.data.record[0])
                const record = res.data.record[0];
                setFormData((prev)=>({
                 ...prev,
                 enrollmentNumber: record.EnrolmentNo || formData.enrollmentNumber,
                 studentName: record.Name || formData.studentName,
                 studentMobile:record.Mobile || formData.studentMobile,
                 StudentEmail : record.Email || formData.StudentEmail,
                 selectedClass: record.CenterClassesID || formData.selectedClass,
                 gender :record.Gender || formData.gender,
                 dob : record.DOB || formData.dob,
                 motherName: record.MotherName || formData.motherName,
                 motherEmail: record.MotherEmail || formData.motherEmail,
                 motherPhone: record.MotherMobile || formData.motherPhone,
                 fatherName: record.FatherName || formData.fatherName,
                 fatherPhone: record.FatherMobile || formData.fatherPhone,
                 fatherEmail: record.FatherEmail || formData.fatherEmail,
                 
                }))
            }
        } catch (error) {
        }
    };
    
    useEffect(() => {
        getData()
    }, []);
        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    const notify = (message: string) => {
        toast.success(message, {
            autoClose: 3000,
        });
    };
    const notifyError = (message: string) => {
        toast.error(message, {
            autoClose: 3000,
        });
    };
    const validateForm = () => {
        let formErrors: Partial<FormData> = {};
        if (!formData.center.trim()) {
            formErrors.center = 'Center is required.';
        }
        if (!formData.enrollmentNumber.trim()) {
            formErrors.enrollmentNumber = 'Enrollment Number is required.';
        }
        if (!formData.selectedClass) {
            formErrors.selectedClass = 'Please choose a class.';
        }
        if (!formData.studentName.trim()) {
            formErrors.studentName = 'Student Name is required.';
        }
      
        if (!formData.gender) {
            formErrors.gender = 'Please select a gender.';
        }
        if (!formData.dob) {
            formErrors.dob = 'Date of Birth is required.';
        }
        if (!formData.motherName.trim()) {
            formErrors.motherName = 'Mother Name is required.';
        }
        if (!formData.motherEmail.trim()) {
            formErrors.motherEmail = 'Mother Email is required.';
        } else if (!/\S+@\S+\.\S+/.test(formData.motherEmail)) {
            formErrors.motherEmail = 'Mother Email is invalid.';
        }
        if (!formData.motherPhone.trim()) {
            formErrors.motherPhone = 'Mother Phone Number is required.';
        } else if (!/^\d{10}$/.test(formData.motherPhone)) {
            formErrors.motherPhone = 'Mother Phone Number is invalid.';
        }
        setErrors(formErrors)
        return formErrors;
    };
  const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formErrors = validateForm();

        if (Object.keys(formErrors).length === 0) {
            let formErrors: Partial<FormData> = {};

        } else {
            setErrors(formErrors);
        }
    };
  
    const handleSubmitApi = async (e: React.FormEvent) => {
        e.preventDefault();
        const isUpdate = !!resolvedIdNullable;
        if (!validateForm()){
            return;
        }else{

        
        let parameters = [];
  
        if (!isUpdate) {
          parameters = [
            { "name": "EnrolmentNo", "type": "VarChar", "value": formData.enrollmentNumber },
            { "name": "Name", "type": "VarChar", "value": formData.studentName },
            { "name": "Gender", "type": "VarChar", "value": formData.gender },
            { "name": "DOB", "type": "VarChar", "value": formData.dob },
            { "name": "Mobile", "type": "VarChar", "value": formData.studentMobile },
            { "name": "Email", "type": "VarChar", "value": formData.StudentEmail },
            { "name": "MotherName", "type": "VarChar", "value": formData.motherName },
            { "name": "MotherMobile", "type": "VarChar", "value": formData.motherPhone },
            { "name": "MotherEmail", "type": "VarChar", "value": formData.motherEmail },
            { "name": "FatherName", "type": "VarChar", "value": formData.fatherName},
            { "name": "FatherMobile", "type": "VarChar", "value": formData.fatherPhone},
            { "name": "FatherEmail", "type": "VarChar", "value": formData.fatherEmail  },
            { "name": "CenterClassesID", "type": "Int", "value": 1 },
            { "name": "CREATED_BY", "type": "Int", "value": user.ID },     
            { "name": "CenterID", "type": "Int", "value": formData.center },    
          ];
        } 
        else {
          parameters = [
            { "name": "ID", "type": "Int", "value": resolvedIdNullable },  
            { "name": "EnrolmentNo", "type": "VarChar", "value": formData.enrollmentNumber },
            { "name": "Name", "type": "VarChar", "value": formData.studentName },
            { "name": "Gender", "type": "VarChar", "value": formData.gender },
            { "name": "DOB", "type": "VarChar", "value": formData.dob },
            { "name": "Mobile", "type": "VarChar", "value": formData.studentMobile },
            { "name": "Email", "type": "VarChar", "value": formData.StudentEmail },
            { "name": "MotherName", "type": "VarChar", "value": formData.motherName },
            { "name": "MotherMobile", "type": "VarChar", "value": formData.motherPhone },
            { "name": "MotherEmail", "type": "VarChar", "value": formData.motherEmail },
            { "name": "FatherName", "type": "VarChar", "value": formData.fatherName},
            { "name": "FatherMobile", "type": "VarChar", "value": formData.fatherPhone},
            { "name": "FatherEmail", "type": "VarChar", "value": formData.fatherEmail  },
            { "name": "CenterClassesID", "type": "Int", "value": 1 },
            { "name": "CREATED_BY", "type": "Int", "value": user.ID }, 
            { "name": "CenterID", "type": "Int", "value": formData.center }, 
          ];
        }
      
       
            try {
            let res;

            if(isUpdate){
                res = await api.post("/api/mssql-procedure/execute", {
                    procedureName: "StudentUpdate",
                    parameters 
                  });
            }
            else{
                res = await api.post("/api/mssql-procedure/execute", {
                   procedureName: "StudentInsert",
                   parameters
               });
            }

            if (res.data.success) {
                const insertedID = res.data.result?.InsertedID;  
  
                notify(isUpdate ? "Student updated successfully!" : "Student added successfully! ")
                navigate("/allStudents")
            }
        } catch (error) {
            console.log("Error inserting student:", error);
            notifyError("OOps Error inserting student");
        }
    // } else {
    //     setErrors(formErrors);
    // }
    };
}

    useEffect(() => {
        if(selectedCenter){
            setFormData((prev)=>({
                ...prev,
                center:selectedCenter
            }))
        }
        if (id) {
          setIsEdit(true)
        }
        setIsEdit(!resolvedIdNullable===false)
      }, [id,selectedCenter]);

    //  clear formData when redirect edit  to add 
      useEffect(()=>{
        if(!isEdit){
            setFormData((prev)=>({...prev,
                enrollmentNumber: '',
                selectedClass: '',
                studentName: '',
                studentMobile:'',
                StudentEmail:'',
                gender: '',
                dob: '',
                motherName: '',
                motherEmail: '', 
                motherPhone: '',
                fatherName: '',
                fatherPhone: '',
                fatherEmail: '',
            }))
        }
      },[isEdit])

    return (
        <div>
            <div className="page-wrapper">
                <div className="content content-two">
                    <div className="card board-hover mb-3 mt-3">
                        <h2 className="m-3 mb-1" style={{ marginLeft: "10px" }}>{isEdit ? "Edit" : "Add"} Student</h2>
                        <div className="" style={{ margin: "20px" }}>
                            <div className="" >
                                <div className="modal-body">
                               
                                    <form>
                                        <div className="row">
                                            <div className="col-lg-6">
                                                    <div className="mb-3">
                                                        {/* <SelectCenter selectedCenter={selectedCenter} handleSelect={handleSelect} /> */}
                                                        {errors.center && <span className="text-danger">{errors.center}</span>}
                                                    </div>
                                                </div>

                                                <div className="col-lg-6"></div>

                                            {/* Enrollment Number */}
                                            <div className="col-lg-6">
                                                <div className="mb-3">
                                                    <label className="form-label">Enrollment Number *</label>
                                                    <input
                                                        type="text"
                                                        name="enrollmentNumber"
                                                        className="form-control"
                                                        placeholder="Enter Enrollment Number"
                                                        value={formData.enrollmentNumber}
                                                        onChange={handleInputChange}
                                                    />
                                                    {errors.enrollmentNumber && <span className="text-danger">{errors.enrollmentNumber}</span>}
                                                </div>
                                            </div>

                                            {/* Choose Class to Add Users */}
                                            <div className="col-lg-6">
                                                <div className="mb-3">
                                                    <label className="form-label">Choose Class to Add Users *</label>
                                                    <select
                                                        name="selectedClass"
                                                        className="form-select"
                                                        value={formData.selectedClass}
                                                        onChange={handleInputChange}
                                                    >
                                                        <option value="">Select Class</option>
                                                        <option value="class1">Class 1</option>
                                                        <option value="class2">Class 2</option>
                                                    </select>
                                                    {errors.selectedClass && <span className="text-danger">{errors.selectedClass}</span>}
                                                </div>
                                            </div>

                                            {/* Student Name */}
                                            <div className="col-lg-6">
                                                <div className="mb-3">
                                                    <label className="form-label">Student Name *</label>
                                                    <input
                                                        type="text"
                                                        name="studentName"
                                                        className="form-control"
                                                        placeholder="Enter Student Name"
                                                        value={formData.studentName}
                                                        onChange={handleInputChange}
                                                    />
                                                    {errors.studentName && <span className="text-danger">{errors.studentName}</span>}
                                                </div>
                                            </div>

                                            {/* Gender */}

                                            <div className="col-lg-6">
                                                <div className="mb-3">
                                                    <label className="form-label">Gender *</label>
                                                    <select
                                                        name="gender"
                                                        className="form-select"
                                                        value={formData.gender}
                                                        onChange={handleInputChange}
                                                    >
                                                        <option value="">Select Gender</option>
                                                        <option value="male">Male</option>
                                                        <option value="female">Female</option>
                                                        <option value="other">Other</option>
                                                    </select>
                                                    {errors.gender && <span className="text-danger">{errors.gender}</span>}
                                                </div>
                                            </div>

                                            {/* Date of Birth */}
                                            <div className="col-lg-6">
                                                <div className="mb-3">
                                                    <label className="form-label">Date Of Birth *</label>
                                                    <input
                                                        type="date"
                                                        name="dob"
                                                        className="form-control"
                                                        value={formData.dob}
                                                        onChange={handleInputChange}
                                                    />
                                                    {errors.dob && <span className="text-danger">{errors.dob}</span>}
                                                </div>
                                            </div>

                                            {/* Student Mobile */}
                                            <div className="col-lg-6">
                                                <div className="mb-3">
                                                    <label className="form-label">Student Mobile </label>
                                                    <input type="tel"  name="studentMobile" value={formData.studentMobile} onChange={handleInputChange} className="form-control" placeholder="Enter Student Mobile Number" />
                                                    {/* {errors.studentMobile && <span className="text-danger">{errors.studentMobile}</span>} */}
                                                </div>
                                            </div>

                                            {/* Student Email */}
                                            <div className="col-lg-6">
                                                <div className="mb-3">
                                                    <label className="form-label">Student Email</label>
                                                    <input type="email" name="StudentEmail" value={formData.StudentEmail} onChange={handleInputChange} className="form-control" placeholder="Enter Student Email" />
                                                    {/* {errors.StudentEmail && <span className="text-danger">{errors.StudentEmail}</span>} */}

                                                </div>
                                            </div>

                                            {/* Mother Name */}
                                            <div className="col-lg-6">
                                                <div className="mb-3">
                                                    <label className="form-label">Mother Name *</label>
                                                    <input
                                                        type="text"
                                                        name="motherName"
                                                        className="form-control"
                                                        placeholder="Enter Mother's Name"
                                                        value={formData.motherName}
                                                        onChange={handleInputChange}
                                                    />
                                                    {errors.motherName && <span className="text-danger">{errors.motherName}</span>}
                                                </div>
                                            </div>

                                            {/* Mother Mobile Numbers */}
                                            <div className="col-lg-6">
                                                <div className="mb-3">
                                                    <label className="form-label">Mother Phone Number *</label>
                                                    <input
                                                        type="number"
                                                        name="motherPhone"
                                                        className="form-control"
                                                        placeholder="Enter Mother's Phone Number"
                                                        value={formData.motherPhone}
                                                        onChange={handleInputChange}
                                                    />
                                                    {errors.motherPhone && <span className="text-danger">{errors.motherPhone}</span>}
                                                </div>
                                            </div>

                                            {/* Mother Email Id */}
                                            <div className="col-lg-6">
                                                <div className="mb-3">
                                                    <label className="form-label">Mother Email *</label>
                                                    <input
                                                        type="email"
                                                        name="motherEmail"
                                                        className="form-control"
                                                        placeholder="Enter Mother's Email"
                                                        value={formData.motherEmail}
                                                        onChange={handleInputChange}
                                                    />
                                                    {errors.motherEmail && <span className="text-danger">{errors.motherEmail}</span>}
                                                </div>
                                            </div>

                                            {/* Father Name */}
                                            <div className="col-lg-6">
                                                <div className="mb-3">
                                                    <label className="form-label">Father Name</label>
                                                    <input type="text" name="fatherName" value={formData.fatherName}  onChange={handleInputChange}  className="form-control" placeholder="Enter Father's Name" />
                                                </div>
                                            </div>

                                            {/* Father Mobile Numbers */}
                                            <div className="col-lg-6">
                                                <div className="mb-3">
                                                    <label className="form-label">Father Mobile Numbers</label>
                                                    <input type="tel" name="fatherPhone" value={formData.fatherPhone}  onChange={handleInputChange} className="form-control" placeholder="Enter Father's Mobile Number" />
                                                </div>
                                            </div>

                                            {/* Father Email Id */}
                                            <div className="col-lg-6">
                                                <div className="mb-3">
                                                    <label className="form-label">Father Email Id</label>
                                                    <input type="email" name="fatherEmail" value={formData.fatherEmail}  onChange={handleInputChange} className="form-control" placeholder="Enter Father's Email" />
                                                </div>
                                            </div>

                                            {/* Instruction */}
                                            <div className="col-lg-12">
                                                <p className="text-muted">
                                                    * Mobile Number should be as Country Code + Mobile (Example - 919876543210)<br />
                                                    * Account password would be student first name(first letter capital) followed by year of birth. Ex: - for student Nitin Gupta with year of birth 2015 password would be Nitin2015.<br />
                                                    * Email Id is must for one parent (mother), Father details will be added only if father email id provided.
                                                </p>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-primary" onClick={handleSubmitApi}>{isEdit ? "Update": "Add Student"}</button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default AddStudents