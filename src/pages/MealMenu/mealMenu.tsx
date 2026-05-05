import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { all_routes } from "../../feature-module/router/all_routes";
import { Input, Table, Button, Form, Select, DatePicker, notification } from 'antd';
import api from "../../core/data/api";
import dayjs, { Dayjs } from 'dayjs';
import { DownOutlined } from "@ant-design/icons";
import AddFoodItemPopup from "./addFoodItemPopup";
import TodayFoodchart from './todayFoodchart';
import SelectCenter from '../Center/selectCenter';

const { Option } = Select;

const MealMenu = () => {
  const routes = all_routes;
  const [last7Days, setLast7Days] = useState("Last 7 Days");
  const [next7Days, setNext7Days] = useState('');
  const [isAddFoodItmePopupOpen, setIsAddFoodItmePopupOpen] = useState(false);
  const [isTodayFoodChart, setIsTodayFoodChart] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [centerId, setCenterId] = useState<string | undefined>(undefined);
  const [allCenter, setCenters] = useState<any[]>([]);
  const [last7DaysRange, setLast7DaysRange] = useState<[Dayjs | null, Dayjs | null]>([null, null]);
  const [selectedCenterId, setSelectedCenterId] =  useState<string>("");

  const handleSelect = (value: any) => {
    setSelectedCenterId(value);
  };

  useEffect(() => {
    getCenter();
  }, []);

  const getCenter = async () => {
    try {
      const res = await api.post("/api/mssql-procedure/execute/get", {
        procedureName: "CenterGetAll",
        parameters: []
      });

      if (res.data.success) {
        const filteredCenters = res.data.centers.map((center: any, index: number) => ({
          key: index + 1,
          SNO: index + 1,
          Lock: (index % 2 === 0),
          CenterName: center.Center,
          Profile: center.CenterName,
          id: center.CenterID,
        }));
        setCenters(filteredCenters);
      }
    } catch (error: any) {
      console.log("Error fetching centers:", error);
    }
  };
  
  const handleAddFoodItme = () => {
    setIsAddFoodItmePopupOpen(true);
    setIsTodayFoodChart(true);
  };

  return (
    <div className="page-wrapper">
      <div className="content content-two">
        <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
          <div className="my-auto mb-2">
            <h3 className="">Meal Menu</h3>
            <nav>
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <Link to={routes.adminDashboard}>Dashboard</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Meal Menu
                </li>
              </ol>
            </nav>
          </div>
        </div>

        <div className="card mb-3">
          <div style={{
            padding: "20px",
            display: "flex",
            gap: "10px",
            flexDirection: "row"
          }}>
            <div >
                  <SelectCenter
                    selectedCenter={selectedCenterId}
                    handleSelect={handleSelect}
                  />

            </div>

            <Button className="btn btn-primary" style={{height:"47px"}}
              onClick={() => setIsAddFoodItmePopupOpen(true)}
            >
              Food Item
            </Button>
            <Button onClick={() => setIsTodayFoodChart(true)}
            className="btn btn-primary" style={{height:"47px"}}  >
              Today's Food Chart
            </Button>
          </div>
        </div>
      </div>
      {selectedCenterId && (
        <AddFoodItemPopup
          isOpen={isAddFoodItmePopupOpen}
          onClose={() => setIsAddFoodItmePopupOpen(false)}
          leadData={selectedLead}
          selectedCenterId={selectedCenterId}
        />
      ) }

      {selectedCenterId ? (
       <TodayFoodchart
        isOpen={isTodayFoodChart}
        onClose={() => setIsTodayFoodChart(false)}
        leadData={selectedLead}
        selectedCenterId={selectedCenterId}  
      />) : (
        <p className='d-flex justify-content-center'>Please Select School</p>
      )}
      
    </div>
    
  );
};

export default MealMenu;
