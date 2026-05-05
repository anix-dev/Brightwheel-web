import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { DatePicker, notification } from 'antd';
import api from "../../core/data/api";
import dayjs from 'dayjs'; 
import { useSelector } from "react-redux";
import Loading from "../../core/common/loader/Loading";
import {toast} from 'react-toastify'
interface AddFoodItemPopupProps {
    isOpen: boolean;
    onClose: () => void;
    leadData: { id: number; } | null; 
    selectedCenterId: any;  
}
const TodayFoodchart: React.FC<AddFoodItemPopupProps> = ({ isOpen, onClose, leadData, selectedCenterId }) => {
    const user = localStorage.getItem('user');
    const [sessionData, setSessionData] = useState<{ Sessionall: string; id: number }[]>([]);
    const [food, setFood] = useState<{ ID: number; Name: string; Alias: string; }[]>([]);
    const [selectedDate, setSelectedDate] = useState(dayjs()); 
    const [selectedItems, setSelectedItems] = useState<{ [key: number]: number[] }>({})
    const [loader,setLoader] = useState<boolean>(true)


    useEffect(() => {
        if (isOpen) {
            FoodSessionsGetAll();
            FoodGetAll();
        }
    }, [isOpen]);

    const FoodSessionsGetAll = async () => {
        try {
            const res = await api.post("/api/mssql-procedure/execute/get", {
                procedureName: "[FoodSessionsGetAll]",
                parameters: [],
            });
            if (res.data.success) {
                const allSession = res.data.centers.map((center: any) => ({
                    Sessionall: center.FSName,
                    id: center.ID
                }));
                setSessionData(allSession);
            }
        } catch (error: any) {
            notification.error({ message: 'Failed to load food sessions' });
        }
    };

    const FoodGetAll = async () => {
        try {
            setLoader(true)
            const res = await api.post("/api/mssql-procedure/execute/get", {
                procedureName: "FoodItemGetbyCenterId",
                parameters: [],
            });
            if (res.data.success) {
                const allFood = res.data.centers;
                setFood(allFood);
                setLoader(false)
            }
        } catch (error: any) {
            setLoader(false)
            notification.error({ message: 'Failed to load food items' });
        }
    };

    const handleDateChange = (date: any) => {
        setSelectedDate(date);
    };

    const handleCheckboxChange = (sessionId: number, itemId: number) => {
        setSelectedItems(prev => {
            const currentItems = prev[sessionId] || [];
            if (currentItems.includes(itemId)) {
                return { ...prev, [sessionId]: currentItems.filter(id => id !== itemId) }; // Uncheck
            } else {
                return { ...prev, [sessionId]: [...currentItems, itemId] }; // Check
            }
        });
    };

    const handleAddFoodItem = async () => {
        try {
            setLoader(true)
            for (const sessionId in selectedItems) {
                for (const foodItemId of selectedItems[sessionId]) {
                   const res= await api.post("/api/mssql-procedure/execute", {
                        procedureName: "MenuInsert",
                        parameters: [
                            { name: "CenterId", type: "Int", value: selectedCenterId },
                            { name: "menuDate", type: "VarChar", value: selectedDate.format("YYYY-MM-DD") }, 
                            { name: "FoodItemID", type: "Int", value: foodItemId },
                            { name: "SessionID", type: "Int", value: sessionId }, 
                            { name: "CREATED_BY", type: "Int", value: user },
                        ]
                    });
                }
            }
            toast.success('Food Item Added Successfully');
            setLoader(false)

            setSelectedItems({});
            onClose();
        } catch (error) {
            setLoader(false)
            notification.error({
                message: 'Error',
                description: 'An error occurred while adding the food items.',
            });
        }
    };
    

    return (
        <Modal show={isOpen} onHide={onClose} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Today's Foodchart</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div style={{ display: "flex", alignItems: "center", gap: "330px" }}>
                    {/* <Button variant="outline-primary"

                     className="mb-3">Show Today's Foodchart</Button> */}
                    <div style={{ flex: "0 1 200px" }}>
                        <DatePicker
                            className="form-control"
                            style={{ width: "100%" }}
                            format="DD-MM-YYYY"
                            value={selectedDate}
                            onChange={handleDateChange}
                        />
                    </div>
                </div>
                { 
                        loader ? <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100vh', 
                        }}>
                        <Loading />
                    </div>
                        :
                         <div className="foodchart-container">
                    {sessionData.map((session) => (
                        <div key={session.id} className="meal-section mb-3 p-3 rounded border">
                            <h6>{session.Sessionall}</h6>
                            <Form>
                                {food.map((item) => (
                                    <Form.Check
                                        inline
                                        key={item.ID}
                                        type="checkbox"
                                        label={<>{item.Name} <a href="#" className="text-primary">({item.Alias})</a></>}
                                        checked={(selectedItems[session.id] || []).includes(item.ID)}
                                        onChange={() => handleCheckboxChange(session.id, item.ID)}
                                        className="me-3"
                                    />
                                ))}
                            </Form>
                        </div>
                    ))}
                </div>}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="success" onClick={handleAddFoodItem}>Add Today's Foodchart</Button>
            </Modal.Footer>
            <style>{`
                .foodchart-container {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }
                .meal-section {
                    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
                }
            `}</style>
        </Modal>
    );
};

export default TodayFoodchart;
