import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Select from 'react-select';
import api from "../../core/data/api";
import {toast} from 'react-toastify'

interface AddFoodItemPopupProps {
    isOpen: boolean;
    onClose: () => void;
    leadData: { id: number; } | null; 
    selectedCenterId: any;  
}

const AddFoodItemPopup: React.FC<AddFoodItemPopupProps> = ({ isOpen, onClose, leadData,selectedCenterId  }) => {
    const [status, setStatus] = useState<string>('');
    const [foodName, setFoodName] = useState<string>('');
    const [foodType, setFoodType] = useState<string>('');
    const [selectedValues, setSelectedValues] = useState<{ value: string; label: string }[]>([]);
    const [isFormValid, setIsFormValid] = useState<boolean>(false);

    const leadSources = [
        { value: 'Number', label: 'Number' },
        { value: 'ML', label: 'ML' },
        { value: 'Grams', label: 'Grams' },
        { value: 'Ltr', label: 'Ltr' },
        { value: 'Glass', label: 'Glass' },
        { value: 'Bowl', label: 'Bowl' }, 
    ];

    const numberOptions = [
        { value: "1/4", label: "1/4" },
        { value: "1/2", label: "1/2" },
        { value: "1", label: "1" },
        { value: "1.5", label: "1.5" },
        { value: "2", label: "2" },
        { value: "2.5", label: "2.5" },
        { value: "3", label: "3" },
        { value: "3.5", label: "3.5" },
        { value: "4", label: "4" },
        { value: "4.5", label: "4.5" }
    ];

    const mlOptions = [
        { value: "50", label: "50" },
        { value: "100", label: "100" },
        { value: "150", label: "150" },
        { value: "200", label: "200" },
        { value: "250", label: "250" },
        { value: "300", label: "300" },
        { value: "350", label: "350" },
        { value: "400", label: "400" },
        { value: "450", label: "450" },
        { value: "500", label: "500" },
    ];

    const handleMultiSelectChange = (selectedOptions: any) => {
        setSelectedValues(selectedOptions);
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setStatus(e.target.value);
        setSelectedValues([]); // Clear selected values when changing the measurement unit
    };

    useEffect(() => {
        setIsFormValid(
            foodName.trim() !== '' &&
            foodType.trim() !== '' &&
            status.trim() !== '' &&
            selectedValues.length > 0
        );
    }, [foodName, foodType, status, selectedValues]);

    // API call function
    const handleAddFoodItem = async () => {
        if (!isFormValid) return;

        try {
            const res = await api.post("/api/mssql-procedure/execute", {
                procedureName: "FoodItemInsert",
                parameters: [
                    { name: "Name", type: "VarChar", value: foodName },
                    { name: "Alias", type: "VarChar", value: foodType },
                    { name: "CREATED_BY", type: "Int", value: leadData?.id || 0 },
                    { name: "MeasurementUnit", type: "VarChar", value: status },
                    { name: "MeasurementValue", type: "VarChar", value: selectedValues.map((item) => item.value).join(',') },
                    { name: "CenterId", type: "Int", value:  selectedCenterId },

                ]
            });
            toast.success( 'Food Item Added Successfully');
            onClose();

        } catch (error) {
            console.log("Error adding food item:", error);

        }
    };

    return (
        <Modal show={isOpen} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add Food Item</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="formFoodName" style={{ marginBottom: "10px" }}>
                        <Form.Label>Food Item Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter Food Item Name"
                            value={foodName}
                            onChange={(e) => setFoodName(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="formFoodType" style={{ marginBottom: "10px" }}>
                        <Form.Label>Food Item Type</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter Food Item Type"
                            value={foodType}
                            onChange={(e) => setFoodType(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="formMeasurementUnit" style={{ marginBottom: "10px" }}>
                        <Form.Label>Choose Measurement Unit</Form.Label>
                        <Form.Select
                            value={status}
                            onChange={handleStatusChange}
                        >
                            <option value="">Select Measurement Unit</option>
                            {leadSources.map((source) => (
                                <option key={source.value} value={source.value}>
                                    {source.label}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group controlId="formMeasurementValue">
                        <Form.Label>Choose Measurement Value</Form.Label>
                        <Select
                            options={status === 'ML' || status === "Grams" ? mlOptions : numberOptions}
                            isMulti
                            value={selectedValues}
                            onChange={handleMultiSelectChange}
                            placeholder="Select values"
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                {/* <Button variant="secondary" onClick={onClose} style={{ marginRight: "5px" }}>
                    Cancel
                </Button> */}
                <Button
                    variant="primary"
                    style={{ backgroundColor: isFormValid ? "green" : "grey" }}
                    disabled={!isFormValid}
                    onClick={handleAddFoodItem}
                >
                    Add Food Item
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AddFoodItemPopup;
