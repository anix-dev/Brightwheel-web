import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { all_routes } from "../../feature-module/router/all_routes";
import { Input, Table, Button, Form, Select, DatePicker, notification } from 'antd';
import api from "../../core/data/api";
import { TableData } from "../../core/data/interface";
import dayjs, { Dayjs } from 'dayjs';
import { DownOutlined } from "@ant-design/icons";
import moment from "moment";
import { toast } from "react-toastify";
import  {useNavigate} from "react-router-dom";
import SelectCenter from '../Center/selectCenter';
const { Option } = Select;

const Wish = () => {
  const routes = all_routes;
  const user = localStorage.getItem('user')
  const [type,setType] = useState<any[]>([]);
  const [id,setId] = useState("")
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCenter, setSelectedCenter] = useState<string>("");
  const handleSelect = (item: string) => {
    setSelectedCenter(item);
  };
  const getWishes =async()=>{
    try{
      setLoading(true)
        const procedureName = "WishListGetAll";
        const res = await api.post("/api/mssql-procedure/execute", {
          procedureName,
          parameters:[
             { name: "CenterId", type: "Int", value: selectedCenter || 0 },
          ]
        }); 
        if(res.data.success){
           const filteredCenters = res.data.record.map((center: any, index: number) => ({
          key: index + 1,
          SNO: index + 1,
          Lock: (index % 2 === 0),
          name: center.Name,
          message:center.Messsage,
          date:moment(center.DueDate).format("DD-MM-YYYY"),
          id: center.ID,
          center:center.CenterID
        }));
          setType(filteredCenters);
          setLoading(false)
        }  
    }
    catch(error){
    }
  }

  const handleDelete = async () => {
    try {
      setLoading(true);
      const res = await api.post("/api/mssql-procedure/execute", {
        procedureName: "WishListDelete",
        parameters: [
          { name: "ID", type: "Int", value: id },
          { name: "CREATED_BY", type: "Int", value: user},
        ],
      });
      if (res.data.success) {
        toast.success("Wish deleted successfully");
        await getWishes();
        setLoading(false);
      }
    } catch (error: any) {
      setLoading(false);
      console.log("Error Deleting Students:", error);
    }
  };
  const columns = [
    {
      title: "Sr.No.",
      dataIndex: "SNO",
      sorter: (a: TableData, b: TableData) => a.id.length - b.id.length,
    },
   
    {
      title: "Message",
      dataIndex: "message",
      render: (text: string, record: any) => (
        <div className="d-flex align-items-center">
          <div className="ms-2">
            <p className="text-dark mb-0">{text}</p>
          </div>
        </div>
      ),
      sorter: (a: TableData, b: TableData) => a.name.length - b.name.length,
    },
    {
      title: "Due Date",
      dataIndex: "date",
      render: (text: string, record: any) => (
        <div className="d-flex align-items-center">
          <div className="ms-2">
            <p className="text-dark mb-0">{text}</p>
          </div>
        </div>
      ),
      sorter: (a: TableData, b: TableData) => a.name.length - b.name.length,
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text: any, record: any) => (
        <>
          <div className="d-flex align-items-center">
            <li>
              <Link
                className="dropdown-item rounded-1"
                to={`/wish/Add/${record.id}`} 
                
              >
                <i className="ti ti-edit-circle me-2" />
                
              </Link>
            </li>
            <li>
             <Link
              className="dropdown-item rounded-1"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#delete-modal"
              onClick={() => setId(record.id)}
            >
              <i className="fas fa-trash"></i>
            </Link>
            </li>
          </div>
        </>
      ),
    },
  ];

  useEffect(() => {
    if (selectedCenter) {
      getWishes();
    }
  }, [selectedCenter]);


  return (
    <div className="page-wrapper">
      <div className="content content-two">
        <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
          <div className="my-auto mb-2">
            <h3 className="">Wish</h3>
            <nav>
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <Link to={routes.adminDashboard}>Dashboard</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Wish
                </li>
              </ol>
            </nav>
          </div>
           <div
              className="d-flex my-xl-auto right-content align-items-center flex-wrap"
              style={{ justifyContent: "end" }}
            >
              <div className="mb-2">
                <button
                  className="btn btn-primary d-flex align-items-center"
                  style={{
                    backgroundColor: "white",
                    borderRadius: "1px",
                    border: "1px solid #B0B0B0",
                    color: "black",
                    padding: "8px 16px",
                  }}
                >
                  <i className="ti ti-square-rounded-plus me-2" />
                  <Link
                    to={all_routes.wishAdd}
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    Add Wish
                  </Link>
                </button>
              </div>
          </div>
        </div>
         <div className="mb-3 border  p-2">
            <SelectCenter
              selectedCenter={selectedCenter}
              handleSelect={handleSelect}
            />
          </div>

          <div className="card  mb-3">
            {loading? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100vh",
                }}
              >
                <div className="text-center">
                  <h6>Please select the center to get data </h6>
                </div>
              </div>
            ) : (
              <div className="card-body p-0 py-3">
                <Table
                  dataSource={type}
                  columns={columns}
                />
              </div>
            )}
          </div>
      </div>
      
       <div className="modal fade" id="delete-modal">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <form>
                <div className="modal-body text-center">
                  <span className="delete-icon">
                    <i className="ti ti-trash-x" />
                  </span>
                  <h4>Confirm Deletion</h4>
                  <p>
                    You want to delete the marked item, this cant be undone once
                    you delete.
                  </p>
                  <div className="d-flex justify-content-center">
                    <Link
                      to="#"
                      className="btn btn-light me-3"
                      data-bs-dismiss="modal"
                    >
                      Cancel
                    </Link>
                    <Link
                      to="#"
                      onClick={handleDelete}
                      className="btn btn-danger"
                      data-bs-dismiss="modal"
                    >
                      Yes, Delete
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

export default Wish;
