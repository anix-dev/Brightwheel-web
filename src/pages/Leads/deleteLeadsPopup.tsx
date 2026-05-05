import React from 'react';
import { Modal, Button } from 'react-bootstrap';

interface DeleteAccountPopupProps {
    isOpen: boolean;
    onClose: () => void;
    onDelete: () => void;
}

const DeleteAccountPopup: React.FC<DeleteAccountPopupProps> = ({ isOpen, onClose, onDelete }) => {
    return (
        <Modal show={isOpen} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Delete Lead</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Are you sure you want to delete lead? This action cannot be undone.
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose} style={{marginRight:"5px"}}>
                    Cancel
                </Button>
                <Button variant="danger" onClick={onDelete}>
                    Delete
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DeleteAccountPopup;
