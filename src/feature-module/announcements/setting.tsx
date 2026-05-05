import React from 'react'

const Setting = () => {
  return (
    <div>
      
    </div>
  )
}

export default Setting









// import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { all_routes } from "../router/all_routes";
// import api from "../../core/data/api";
// import { useSelector } from "react-redux";
// import { toast } from "react-toastify";
// import axios from "axios";
// import { ChangeEvent } from 'react';
// const AddModal = ({
//     getMessage,
//     isModalOpen,
//     handleModal,
//     selected,
//     isUpdate,
// }: any) => {
//     const { user } = useSelector((state: any) => state.user);
//     const [options, setOptions] = useState<any>([]);
//     const [Message, setMessage] = useState({ Message: "", MessageOrder: "" });

//     useEffect(() => {
//         if (isUpdate) {
//             // When in update mode, set the Message state with the selected message data
//             setMessage({
//                 Message: selected.Message || "",
//                 MessageOrder: selected.MessageOrder || "",
//             });
//         } else {
//             // Reset the Message state when adding a new message
//             setMessage({ Message: "", MessageOrder: "" });
//         }
//     }, [isUpdate, selected]);

//     const notify = (message: string) => {
//         toast.success(message, {
//             autoClose: 3000,
//         });
//     };

//     const handleQChange = (e: any) => {
//         const name = e.target.name;
//         const value = e.target.value;
//         setMessage({ ...Message, [name]: value });
//     };

//     const updateMessage = async () => {
//         try {
//             if (Message.Message === "") return;
//             const procedureName = "Pg_AppMessage_Update";
//             const parameters = [
//                 { name: "ID", value: selected.ID },
//                 { name: "Message", value: Message.Message },
//                 { name: "Formid", value: 1 },
//                 { name: "CREATED_BY", value: user.ID },
//                 { name: "MessageOrder", value: Message.MessageOrder },
//             ];

//             const res = await api.post("/api/mssql-procedure/execute", {
//                 procedureName,
//                 parameters,
//             });

//             if (res.data.success) {
//                 getMessage();
//                 setOptions([]);
//                 notify("Update Added!");
//                 handleModal();
//             }
//         } catch (error) {
//             console.log("Error updating message:", error);
//         }
//     };

//     const createMessage = async () => {
//         try {
//             if (Message.Message === "") return;
//             const procedureName = "Pg_AppMessage_Insert";
//             const parameters = [
//                 { name: "Message", value: Message.Message },
//                 { name: "Formid", value: 1 },
//                 { name: "CREATED_BY", value: user.ID },
//                 { name: "MessageOrder", value: Message.MessageOrder },
//             ];

//             const res = await api.post("/api/mssql-procedure/execute", {
//                 procedureName,
//                 parameters,
//             });

//             if (res.data.success) {
//                 getMessage();
//                 setOptions([]);
//                 notify("Message Added!");
//                 handleModal();
//             }
//         } catch (error) {
//             console.log("Error creating message:", error);
//         }
//     };

//     const handleSubmitMessage = () => (isUpdate ? updateMessage() : createMessage());

//     return isModalOpen ? (
//         <>
//             <div className="custom-modal-overlay">
//                 <div className="custom-modal">
//                     <div className="custom-modal-body">
//                         <div className="modal-dialog modal-dialog-centered">
//                             <div className="modal-content">
//                                 <div className="modal-header">
//                                     {isUpdate ? (
//                                         <h4 className="modal-title mb-4">Edit Message</h4>
//                                     ) : (
//                                         <h4 className="modal-title mb-4">New Message</h4>
//                                     )}
//                                     <button
//                                         type="button"
//                                         className="btn-close custom-btn-close"
//                                         onClick={handleModal}
//                                     >
//                                         <i className="ti ti-x" />
//                                     </button>
//                                 </div>
//                                 <div className="modal-body">
//                                     <div className="row">
//                                         <div className="col-md-12">
//                                             <div className="mb-3">
//                                                 <label className="form-label">Message</label>
//                                                 <textarea
//                                                     className="form-control"
//                                                     placeholder="Type your Message"
//                                                     rows={4}
//                                                     value={Message.Message}
//                                                     name="Message"
//                                                     onChange={handleQChange}
//                                                 />
//                                                 <label className="form-label">Message Order</label>
//                                                 <input
//                                                     className="form-control"
//                                                     placeholder="Enter Message Order"
//                                                     value={Message.MessageOrder}
//                                                     name="MessageOrder"
//                                                     onChange={handleQChange}
//                                                 />
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                                 <div className="modal-footer">
//                                     <button className="btn btn-light me-2" onClick={handleModal}>
//                                         Cancel
//                                     </button>
//                                     <button
//                                         onClick={handleSubmitMessage}
//                                         className="btn btn-primary"
//                                     >
//                                         {isUpdate ? "Update" : "Add Message"}
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </>
//     ) : null;
// };


// const MessageBox = ({ q, getMessage }: any) => {
//     const { user } = useSelector((state: any) => state.user);
//     const [isEdit, setisEdit] = useState(false);
//     const [isDelete, setIsDelete] = useState(false);

//     const [selected, setselected] = useState({});

//     const notify = (message: String) => {
//         toast.success(message, {
//             autoClose: 3000,
//         });
//     };

//     const deleteMessage = async (ID: any) => {
//         try {
//             const procedureName = "Pg_AppMessages_Delete";
//             const parameters = [
//                 { name: "id", value: ID },
//                 { name: "CREATED_BY", value: user.ID },
//             ];

//             const res = await api.post("/api/mssql-procedure/execute", {
//                 procedureName,
//                 parameters,
//             });

//             if (res.data.success) {
//                 notify("Message Deleted!");
//                 getMessage();
//             }
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     const handleModal = () => setisEdit(!isEdit);

//     const handleEdit = () => {
//         setselected(q);

//         handleModal();

//     };


//     return (
//         <>
//             {isDelete && (
//                 <div className="custom-modal-overlay">
//                     <div className="custom-modal">
//                         <div className="custom-modal-body">
//                             <div className="modal-dialog modal-dialog-centered">
//                                 <div className="modal-content">
//                                     <div className="modal-header">
//                                         <h4>Confirm Deletion</h4>
//                                         <button
//                                             type="button"
//                                             className="btn-close custom-btn-close"
//                                             onClick={() => setIsDelete(!isDelete)}
//                                         >
//                                             <i className="ti ti-x" />
//                                         </button>
//                                     </div>

//                                     <div className="modal-body">
//                                         <div className="modal-body text-center">
//                                             <span className="delete-icon">
//                                                 <i className="ti ti-trash-x" />
//                                             </span>
//                                             <p>
//                                                 You want to delete all the marked items, this cant be
//                                                 undone once you delete.
//                                             </p>
//                                             <div className="d-flex justify-content-center">
//                                                 <button
//                                                     className="btn btn-light me-3"
//                                                     onClick={() => setIsDelete(!isDelete)}
//                                                 >
//                                                     Cancel
//                                                 </button>
//                                                 <button
//                                                     onClick={() => deleteMessage(q.ID)}
//                                                     className="btn btn-danger"
//                                                 >
//                                                     Yes, Delete
//                                                 </button>
                                                
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}
//             <AddModal
//                 isModalOpen={isEdit}
//                 selected={selected}
//                 isUpdate={true}
//                 getMessage={getMessage}
//                 handleModal={handleModal}
//             />
//             <div className="card board-hover mb-3">
//                 <div className="card-body d-md-flex align-items-start justify-content-between pb-1">
//                     <div className="d-flex align-items-start mb-3">
//                         <div>
//                             <h6 className="mb-1 fw-semibold">{q.Message}</h6>
//                             <p className="my-4 form-label">
//                                 <i className="ti ti-calendar me-1" />
//                                 Added on : {q.CREATED_Date}
//                             </p>

//                             <p className="my-4 form-label">
//                                 <i className="ti ti-calendar me-1" />
//                                 Message Order : {q.MessageOrder}
//                             </p>
//                         </div>
//                     </div>
//                     <div className="d-flex align-items-center board-action mb-3">
//                         <button
//                             onClick={() => setIsDelete(!isDelete)}
//                             className="text-primary border rounded p-1 badge me-1 primary-btn-hover"
//                         >
//                             <i className="ti ti-trash-x fs-16" />
//                         </button>

//                         <button
//                             onClick={handleEdit}
//                             className="text-danger border rounded p-1 badge danger-btn-hover"
//                         >
//                             <i className="ti ti-edit-circle fs-16" />
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// };

// const Setting = () => {
//     const routes = all_routes;
//     const [Messages, setMessages] = useState([]);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [isSwitchOn, setIsSwitchOn] = useState(false);
//     const [isSwitchOn1, setIsSwitchOn1] = useState(false);
//     const [file, setFile] = useState<File | null>(null)
//     const [pdfUrl, setPdfUrl] = useState("");
//     const [monthValue, setMonthValue] = useState<number>(0);
//     const getMessage = async () => {
//         try {
//             const res = await api.post("/api/mssql-procedure/execute/get", {
//                 procedureName: "Pg_AppMessages_GetAll",
//                 parameters: [],
//             });
//             if (res.data.success) {
//                 setMessages(res.data.data);
//             }
//         } catch (error) { }
//     };
//     useEffect(() => {
//         getMessage();
//     }, []);


//     const handleModal = () => setIsModalOpen(!isModalOpen);
//     const fetchInitialStates = async () => {
//         try {
//             const res = await api.post("/api/mssql-procedure/execute/get", {
//                 procedureName: "Pg_SysLogin_GetAll",
//                 parameters: [],
//             });

//             if (res.data.success) {
//                 const data = res.data.data;

//                 const switch1Value = data[0].Value;
//                 const switch2Value = data[1].Value;

//                 setIsSwitchOn(switch1Value === 1);
//                 setIsSwitchOn1(switch2Value === 1);

//             }
//         } catch (error) {
//         }
//     };

//     useEffect(() => {
//         fetchInitialStates();
//     }, []);

//     const toggleSwitch = () => {
//         const newSwitchState = !isSwitchOn;
//         setIsSwitchOn(newSwitchState);
//         logdisables(1, newSwitchState ? 1 : 0); // Send state update for switch 1
//     };

//     const toggleSwitch1 = () => {
//         const newSwitch1State = !isSwitchOn1;
//         setIsSwitchOn1(newSwitch1State);
//         logdisables(2, newSwitch1State ? 1 : 0); // Send state update for switch 2
//     };

//     // Log disable state change to server
//     const logdisables = async (ID: number, value: number) => {
//         try {
//             const procedureName = "pg_syslogin_Code_Update";
//             const parameters = [
//                 { name: "ID", value: ID },
//                 { name: "Value", value: value },
//             ];

//             const res = await api.post("/api/mssql-procedure/execute", {
//                 procedureName,
//                 parameters,
//             });

//             if (res.data.success) {

//             }
//         } catch (error) {

//         }
//     };

//     // Function to handle form submission
//     const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//         e.preventDefault(); // Prevent form from refreshing the page

//         if (!file) {
            
//             toast('Please select a file');
//             return;
//         }

//         // Call submitImage function with the selected file
//         await submitImage(file);
//     };

    

//     const submitImage = async (file: File) => {
//         const formData = new FormData();
//         const fixedFileName = 'tc.pdf'; // The fixed file name you want to use
//         formData.append('file', file, fixedFileName);
    
//         try {
//             const response = await api.post('/api/pdf/upload-pdf', formData);

//             toast("File uploaded successfully");
//         } catch (error) {
//             toast.error("Error uploading file");
        
//         }
//     };
//     // Function to handle file selection
//     const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         if (e.target.files && e.target.files.length > 0) {
//             setFile(e.target.files[0]);
            
//         }
//     };

//     const notify = (message: string) => {
//         toast.success(message, {
//             autoClose: 3000,
//         });
//     };

   
//     const expiryMonth = async (ID: number, value: number): Promise<void> => {
//         try {
//             const procedureName = "Pg_update_expirymonth";
//             const parameters = [
//                 { name: "month", value: value },
//             ];

//             const res = await api.post("/api/mssql-procedure/execute", {
//                 procedureName,
//                 parameters,
//             });

//             if (res.data.success) {
//                 notify("change Expiry Months")
//             } else {
//             }
//         } catch (error) {
//         }
//     };

//     const handleSubmit1 = (): void => {
//         expiryMonth(1, monthValue); // Replace '1' with the appropriate ID if needed
//     };

//     // Function to handle input change
//     const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
//         setMonthValue(Number(event.target.value));
//     };



//     return (
//         <>
//             <div className="page-wrapper">
//                 <div className="content content-two">

//                     <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
//                         <div className="my-auto mb-2">
//                             <h3 className="page-title mb-1">User Text</h3>
//                             <nav>
//                                 <ol className="breadcrumb mb-0">
//                                     <li className="breadcrumb-item">
//                                         <Link to={routes.adminDashboard}>Dashboard</Link>
//                                     </li>
//                                     <li className="breadcrumb-item">Configuration</li>
//                                     <li className="breadcrumb-item active" aria-current="page">
//                                         User Text
//                                     </li>
//                                 </ol>
//                             </nav>
//                         </div>
//                         <div className="d-flex my-xl-auto right-content align-items-center flex-wrap"
//                         style={{justifyContent:"end"}}
//                         >
//                             <div className="mb-2"  >
//                                 <button
                               
//                                     onClick={handleModal}
//                                     className="btn btn-primary d-flex align-items-center"
//                                 >
//                                     <i className="ti ti-square-rounded-plus me-2" />
//                                     Add Message
//                                 </button>
//                             </div>
//                         </div>
//                     </div>

//                     {Messages.map((q: any) => (
//                         <MessageBox q={q} key={q.ID} getMessage={getMessage} />


//                     ))}
//                     <AddModal
//                         getMessage={getMessage}
//                         isModalOpen={isModalOpen}
//                         handleModal={handleModal}
//                     />
//                     <div className="card board-hover mb-3">
//                     <div className="page-title mx-5 mt-3">
//             <style>
//                 {`
//                     .container {
//                         display: flex;
//                         align-items: center;
//                         padding: 10px;
//                     }

//                     .input {
//                         width: 55px;
//                         margin-left: 19px;
//                         text-align: right;
//                     }
//                 `}
//             </style>
// <div className="container">
//       <h2>Expiry Months:</h2>
//       <input
//         type="number"
//         className="input"
//         min="0"
//         step="1"
//         value={monthValue}
//         onChange={handleInputChange}
//       />
//       <button

//         className="submit-button"
//         onClick={handleSubmit1}
//         type="button"
//       >
//         Submit
//       </button>

//       {/* Internal CSS */}
//       <style >{`
//         .container {
    
//          margin-bottom: 10px;
//           display: flex;
//           flex-direction: row;
//           align-items: center;
//           justify-content: start;
     
        
       
        
//           margin: auto;
//         }

//         h2 {
//           font-size: 1.5rem;
//           color: #333;
//           margin-bottom: 10px;
//         }

//         .input {
        
//           padding: 6px;
//           font-size: 1rem;
//           border: 1px solid #ccc;
//           border-radius: 4px;
//           margin-bottom: 10px;
//           box-sizing: border-box;
//         }

//         .submit-button {
//           background-color: #00308F;
//           color: #fff;
//           border: none;
//           padding: 10px 10px;
//           font-size: 10px;
//           border-radius: 4px;
//           cursor: pointer;
//           margin-left: 10px;
//                    margin-bottom: 10px;

//           transition: background-color 0.3s, transform 0.3s;
//           box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
//         }

//         .submit-button:hover {
//           background-color: #001f4d;
//           transform: scale(1.05);
//         }
//       `}</style>
//     </div>



            
//         </div>
//                         <div className="page-title  mx-5">
//                             <div>
//                                 <h2>Term & Condition File</h2>
//                                 <form onSubmit={handleSubmit}>
//                                     <div
//                                     className="d-md-flex d-block align-items-center justify-content-between mb-3 mt-2  w-full"
                                        
//                                     >
//                                         <div style={{ display: "flex", alignItems: "center", width: "100%", }}>
//                                             <label htmlFor="fileInput" style={{ paddingRight: "10px" }}>Select file:</label>
//                                             <input
//                                                 type="file"
//                                                 id="fileInput"
//                                                 onChange={handleFileChange}
//                                                 accept="application/pdf" // Accept PDFs and images
//                                             />
//                                         </div>
//                                         <button
//                                             style={{
//                                                 backgroundColor: "transparent",
//                                                 fontSize: "12px",
//                                                 color: "#00308F",
//                                                 border: "1px solid green",
//                                                 padding: "8px 20px",  // Adjusted padding to fit the text comfortably on one line
//                                                 borderRadius: "10px",
//                                                 cursor: "pointer",
//                                                 transition: "0.3s",
//                                                 whiteSpace: "nowrap", // Prevents text wrapping
//                                             }}
//                                             type="submit"
//                                         >
//                                             Upload File
//                                         </button>
                                
//                                     </div>
//                                 </form>
//                             </div>
//                         </div>

//                         {/* <div className="page-title mb-4 mx-5 " > 
//     <div >
//       <h1 >Upload PDF</h1>
//       <form onSubmit={handleSubmit}>
//       <div style={{paddingTop:"10px",paddingBottom:"10px",display:"flex", alignItems: "center"}}>
//         <label htmlFor="fileInput" style={{paddingRight:"10px"}}>Select file:</label>
//         <input
//           type="file"
//           id="fileInput"
//           onChange={handleFileChange}
//           accept="application/pdf,image/*" // Accept PDFs and images
//         />
//             <button 
//       style={{
//         backgroundColor: "transparent",
//         margin: "1px 5px",
//         fontSize: "13px",
//         color: "#00308F",
//         marginLeft:"200px",
//         border: "1px solid tomato",
//         padding: "10px 30px",
//         borderRadius: "10px",
//         cursor: "pointer",
//         transition: "0.3s",
        
//       }}
//       type="submit">Upload File</button>
//       </div>
  
//     </form>
//     </div>
//     </div> */}
//                         <div>

//                         </div>
//                         <h3 className="page-title mb-1 mt-2 mx-5">Config</h3>

//                         <div className="d-md-flex d-block align-items-center justify-content-between mb-3 mt-2 m-5 w-full">

//                             <div
//                                 className="d-md-flex d-block gap-5 mb-3"
//                                 style={{
//                                     borderRadius: '12px',
//                                     boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
//                                     padding: '16px',
//                                     backgroundColor: '#fff',
//                                     alignItems: 'center',
//                                     justifyContent: 'space-between'
//                                 }}
//                             >
//                                 <div>
//                                     <h4 className="mx-0 mb-1 text-xl">Disable Login User</h4>
//                                 </div>
//                                 <div>
//                                     <label className="switch">
//                                         <input
//                                             type="checkbox"
//                                             checked={isSwitchOn}
//                                             onChange={toggleSwitch}
//                                         />
//                                         <span className="slider"></span>
//                                     </label>
//                                 </div>
//                             </div>

//                             <div
//                                 className="d-md-flex d-block gap-5 mb-3"
//                                 style={{
//                                     borderRadius: '12px',
//                                     boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
//                                     padding: '16px',
//                                     backgroundColor: '#fff',
//                                     alignItems: 'center',
//                                     justifyContent: 'space-between'
//                                 }}
//                             >
//                                 <div>
//                                     <h4 className="mx-0 mb-1 text-xl">Disable Content Review</h4>
//                                 </div>
//                                 <div>
//                                     <label className="switch">
//                                         <input
//                                             type="checkbox"
//                                             checked={isSwitchOn1}
//                                             onChange={toggleSwitch1}
//                                         />
//                                         <span className="slider"></span>
//                                     </label>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     <style>
//                         {`
//               .switch {
//                 position: relative;
//                 display: inline-block;
//                 width: 60px;
//                 height: 34px;
//               }

//               .switch input {
//                 opacity: 0;
//                 width: 0;
//                 height: 0;
//               }

//               .slider {
//                 position: absolute;
//                 cursor: pointer;
//                 top: 0;
//                 left: 0;
//                 right: 0;
//                 bottom: 0;
//                 background-color: #ccc;
//                 transition: .4s;
//                 border-radius: 34px;
//               }

//               .slider:before {
//                 position: absolute;
//                 content: "";
//                 height: 26px;
//                 width: 26px;
//                 border-radius: 50%;
//                 left: 4px;
//                 bottom: 4px;
//                 background-color: white;
//                 transition: .4s;
//               }

//               input:checked + .slider {
//                 background-color: #2196F3;
//               }

//               input:checked + .slider:before {
//                 transform: translateX(26px);
//               }
//             `}
//                     </style>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default Setting;
