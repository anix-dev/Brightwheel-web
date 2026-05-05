import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

interface EditLeadPopupProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (id: number, updatedData: any) => void;
    leadData: { id: number; name: string; mobile: string; status: string; detail: string } | null; // Adjust fields as needed
}

const EditLeadPopup: React.FC<EditLeadPopupProps> = ({ isOpen, onClose, onSave, leadData }) => {
    const [name, setName] = useState<string>('');
    const [mobile, setMobile] = useState<string>('');
    const [status, setStatus] = useState<string>('');
    const [leadName, setLeadName] = useState<string>('');

    useEffect(() => {
        if (leadData) {
            setName(leadData.name);
            setMobile(leadData.mobile);
            setStatus(leadData.status);
            setLeadName(leadData.detail)
        }
    }, [leadData]);

    const handleSubmit = () => {
        if (leadData) {
            const updatedData = { name, mobile, status };
            onSave(leadData.id, updatedData);
            onClose();
        }
    };

    const leadSources = [
        { value: 'Facebook', label: 'Facebook' },
        { value: 'Google Ads', label: 'Google Ads' },
        { value: 'Reference', label: 'Reference' },
        { value: 'Walkin', label: 'Walkin' },
        { value: 'Marketing Campaign', label: 'Marketing Campaign' },
        { value: 'Web Listing', label: 'Web Listing' },
        { value: 'News Paper', label: 'News Paper' },
        { value: 'Cold Calling', label: 'Cold Calling' },
        { value: 'Any Other', label: 'Any Other' },
    ];
    
    return (
        <Modal show={isOpen} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Lead</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="formLeadName" style={{marginBottom:"10px"}}>
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="formLeadMobile" style={{marginBottom:"10px"}}>
                        <Form.Label>Mobile</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter mobile number"
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="formLeadStatus" style={{marginBottom:"10px"}}>
                        <Form.Label>Lead Generated From</Form.Label>
                        <Form.Select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="">Select Lead Source</option>
                            {leadSources.map((source) => (
                                <option key={source.value} value={source.value}>
                                    {source.label}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group controlId="formLeadName">
                        <Form.Label>Lead Details (Campaign Id / Reference Name)
                        </Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter Lead Details (Campaign Id / Reference Name)"
                            value={leadName}
                            onChange={(e) => setLeadName(e.target.value)}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose} style={{marginRight:"5px"}}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditLeadPopup;
