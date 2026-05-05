import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import api from "../../core/data/api";
import { toast } from 'react-toastify';

interface ReminderPopupProps {
    id: any;
    isOpen: boolean;
    onClose: () => void;
    onReminder: () => void;
}

const ReminderPopup: React.FC<ReminderPopupProps> = ({ id, isOpen, onClose, onReminder }) => {
    const [date, setDate] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const user = localStorage.getItem("user");

    const handleSubmit = async () => {
        if (!date) {
            toast.error('Please select a date');
            return;
        }

        setIsSubmitting(true);
        
        try {
            const parameters = [
                { name: "ID", type: "Int", value: id.id },
                { name: "setTimer", type: "VarChar", value: date },
                { name: "CREATED_BY", type: "Int", value: user },
            ];

            const res = await api.post("/api/mssql-procedure/execute", {
                procedureName: 'LeadUpdate',
                parameters,
            });

            if (res.data.success) {
                toast.success('Reminder set successfully');
                onClose();
                onReminder();
            }
        } catch (error) {
            console.log('Error setting reminder:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setDate("");
        onClose();
    };

    return (
        <Modal show={isOpen} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>
                    <i className="fas fa-bell me-2" />
                    Set Reminder
                </Modal.Title>
            </Modal.Header>
            
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">
                            <i className="fas fa-calendar-alt me-2" />
                            Date *
                        </Form.Label>
                        <Form.Control
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="form-control-lg"
                            min={new Date().toISOString().split('T')[0]} // Prevent past dates
                            disabled={isSubmitting}
                        />
                        <Form.Text className="text-muted">
                            Select a date for your reminder
                        </Form.Text>
                    </Form.Group>
                </Form>
            </Modal.Body>
            
            <Modal.Footer>
                <Button 
                    variant="outline-secondary" 
                    onClick={handleClose}
                    disabled={isSubmitting}
                >
                    Cancel
                </Button>
                <Button 
                    variant="primary" 
                    onClick={handleSubmit}
                    disabled={!date || isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" />
                            Setting...
                        </>
                    ) : (
                        <>
                            <i className="fas fa-bell me-2" />
                            Set Reminder
                        </>
                    )}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ReminderPopup;