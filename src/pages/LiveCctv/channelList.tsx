import React, { useEffect, useRef, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import api from "../../core/data/api";
import { all_routes } from "../../feature-module/router/all_routes";
import SelectCenters from "../Center/selectCenters";
import { TableData } from "../../core/data/interface";
import Table from "../../core/common/dataTable/index";
import { toast } from "react-toastify";
import Loading from "../../core/common/loader/Loading";
import Switch from "react-switch";
import "./VideoPlayer.css";
import { ClassNames } from "@emotion/react";

interface Single {
  fees: any;
  Amount: any;
}
const ChannelList = () => {
  const routes = all_routes;
  const [loading, setLoading] = useState(false);
  const user = localStorage.getItem("user");
  const [edit, setEdit] = useState("");
  const [selectedCenter, setSelectedCenter] = useState<string>("");
  const [checked, setChecked] = useState<{ [key: string]: boolean }>({});
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [singledata, setSingleData] = useState<Single>();
  const [userId, setId] = useState<string>("");
  const [feesdetail, setFees] = useState<[]>([]);
  const [data, setData] = useState<any[]>([]);

  const totalAmount = useMemo(() => {
    return feesdetail.reduce((sum: number, fee: any) => {
      return checked[fee.ID] ? sum + Number(fee.amount) : sum;
    }, 0);
  }, [checked, feesdetail]);

  const handleSelect = (item: string) => {
    setSelectedCenter(item);
  };



  const columns = [
    {
      title: "Sr.No.",
      dataIndex: "SNO",
      sorter: (a: TableData, b: TableData) => a.id.length - b.id.length,
    },
     {
      title: "ClassName",
      dataIndex: "ClassName",
      sorter: (a: TableData, b: TableData) => a.id.length - b.id.length,
    },
    {
      title: "Channel Name",
      dataIndex: "camera",
      sorter: (a: TableData, b: TableData) => a.id.length - b.id.length,
    },
    {
      title: "Username",
      dataIndex: "username",
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
      title: "Domain Ip",
      dataIndex: "domainIp",
      sorter: (a: TableData, b: TableData) => a.class.length - b.class.length,
    },
    {
      title: "Port",
      dataIndex: "port",
      sorter: (a: TableData, b: TableData) => a.class.length - b.class.length,
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
                to={`/Livecctv/edit-channel/${record.id}`} 
               
              >
                <i className="ti ti-edit-circle me-2" />
                View
              </Link>
            </li>

            <li>
             
               <Link 
                  to="#"
                  className="dropdown-item rounded-1"
                  data-bs-toggle="modal"
                  data-bs-target="#delete-modal"
                  onClick={() => setId(record.id)}
                >
                  <i className="ti ti-trash me-2"></i>Delete
                </Link>
            </li>
          </div>
        </>
      ),
    },
  ];

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await api.post("/api/mssql-procedure/execute", {
        procedureName: "channelDelete",
        parameters: [
          { name: "ID", type: "Int", value: userId },
        ],
      });
      if (res.data.success) {
        toast.success("channel deleted successfully");
        getCLasses()
      }
    } catch (error) {
      // console.log("Error inserting teacher:", error);
    } finally {
      setLoading(false);
    }
  };
  const getCLasses = async () => {
    setLoading(true);
    try {
      const res = await api.post("/api/mssql-procedure/execute", {
        procedureName: "ChannelsGetALL",
        parameters: [
          { name: "CenterId", type: "Int", value: selectedCenter },
        ],
      });
      console.log(res.data.record,"recrdsswdsdxresfedrfrdsvfsf")
       const filteredCenters = res.data.record.map((center: any, index: number) => ({
          key: index + 1,
          SNO: index + 1,
          Lock: (index % 2 === 0),
          username: center.username,
          password: center.password,
          camera:center.camera,
          domainIp: center.domainIp,
          ClassName:center.ClassName,
          CREATED_DATE:center.CREATED_DATE,
          id:center.ID,
          port:center.port,
          ACTIVE:center.ACTIVE,
          VisibleToUsers:center.VisibleToUsers
        }));
      setData(filteredCenters);
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  const getData = async () => {
    setLoading(true);
    try {
      const res = await api.post("/api/mssql-procedure/execute", {
        procedureName: "FeeGetbyID",
        parameters: [{ name: "ClassId", type: "Int", value: selectedClass }],
      });
      setFees(res.data.record);
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);
  useEffect(() => {
    if(selectedCenter){
        getCLasses();
      }
  }, [selectedCenter]);



  useEffect(() => {
  if ( singledata?.fees && feesdetail.length > 0) {
    let selectedFeeIds: string[] = [];

    if (typeof singledata.fees === "string") {
      selectedFeeIds = singledata.fees.split(",").map((id: string) => id.trim());
    } else {
      selectedFeeIds = [singledata.fees.toString()];
    }

    const newChecked: { [key: string]: boolean } = {};
    feesdetail.forEach((fee: any) => {
      
      newChecked[fee.ID] = selectedFeeIds.includes(fee.ID.toString());
    });
    setChecked(newChecked);
  }
}, [singledata, feesdetail]);

  const handleSubmit = async (e: React.FormEvent) => {
      setLoading(true);
    try {
      e.preventDefault();
      const selectedFees = feesdetail.filter((fee: any) => checked[fee.ID]);
      const selectedFeeIds = selectedFees.map((fee: any) => fee.ID);
      const feesParam = selectedFeeIds.join(",");

      const res = await api.post("/api/mssql-procedure/execute", {
        procedureName: "FeeDataInsert",
        parameters: [
          { name: "StudentId", type: "Int", value: userId },
          { name: "fees", type: "VarChar", value: feesParam },
          { name: "ClassId", type: "Int", value: selectedClass },
          { name: "CenterId", type: "Int", value: selectedCenter },
          { name: "Amount", type: "VarChar", value: totalAmount.toString() },
          { name: "ACTIVE", type: "VarChar", value: "1" },
          { name: "CREATED_BY", type: "Int", value: user },
        ],
      });
      if (res.data.success) {
        setId("");
        const resetChecked = Object.fromEntries(
          feesdetail.map((fee: any) => [fee.ID, false])
        );
        setChecked(resetChecked);
        if (totalAmount) {
          toast.success("Fee Updation done");
          await getCLasses()
        }
      }
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Live CCTV List</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">Live CCTV</li>
                  <li
                    className="breadcrumb-item active"
                    style={{ color: "text-primary" }}
                    aria-current="page"
                  >
                    ChannelList
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content justify-content-end flex-wrap">
              <div className="mb-2">
                <Link
                  to={routes.addCctv}
                  className="btn btn-primary"
                >
                  <i className="ti ti-square-rounded-plus me-2" />
                 Add Channel
                </Link>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
              <h4 className="mb-3">ChannelList</h4>
              <div className="d-flex align-items-center flex-wrap">
                <div className="input-icon-start mb-3 me-2 position-relative"></div>
                <div className="dropdown mb-3 me-2">
                  <SelectCenters
                    selectedCenter={selectedCenter}
                    handleSelect={handleSelect}
                  />
                </div>
              </div> 
            </div>
            <div className="card-body p-0 py-3">
              {loading ? (
                <Loading/>
              ) 
              : !selectedCenter ? (
                <div className="text-center">
                  Please select Center  to get data
                </div>
              ) 
              : data.length==0 ?(
               <div className="text-center">
                 Data not found
                </div>
              ):
               (
                <Table dataSource={data} columns={columns} />
              )}
            </div>
          </div>
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
                    id="closeModal"
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
      <div className="modal fade" id="edit-modal">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h4 className="modal-title">
                Fee Summary{" "}
                <span className="badge bg-light text-primary">
                  Total: INR {totalAmount || singledata?.Amount}
                </span>
              </h4>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                id="closeModal"
                onClick={()=>setId("")}
                aria-label="Close"
              ></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                { 
                feesdetail.length > 0 &&
                feesdetail?.map((e: any, i: number) => (
                  <div key={e.ID} className="fee-item mb-3 p-3 border rounded">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <div className="d-flex align-items-center">
                       <Switch
                          checked={
                            checked[e.ID] !== undefined
                              ? checked[e.ID]
                              : (() => {
                                  if (!singledata?.fees) return false;

                                  let feeIds: string[] = [];

                                  if (typeof singledata.fees === "string") {
                                    feeIds = singledata.fees.split(",").map((id: string) => id.trim());
                                  } else {
                                    feeIds = [singledata.fees.toString()];
                                  }

                                  return feeIds.includes(e.ID.toString());
                                })()
                          }
                          onChange={(value) =>
                            setChecked((prev) => ({
                              ...prev,
                              [e.ID]: value,
                            }))
                          }
                          className="me-3"
                          handleDiameter={24}
                          height={28}
                          width={48}
                          onColor="#0d6efd"
                          offColor="#dddddd"
                        />

                        <span className="label fw-bold">{e.Name}</span>
                      </div>

                      <span className="fee-amount badge bg-opacity-10 text-primary fs-4.5">
                        INR {e.amount} ({e.Frequency})
                      </span>
                    </div>
                    <div className="fee-description text-muted ps-5">
                      {e.Type}
                    </div>
                  </div>
                ))}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  data-bs-dismiss="modal"
                  id="closeModal"
                  onClick={()=>setId("")}
                  aria-label="Close"
                >
                  Cancel
                </button>
                <Link to="#" onClick={handleSubmit} className="btn btn-primary">
                  Save Changes
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChannelList;
