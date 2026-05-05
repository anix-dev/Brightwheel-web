import React from 'react';
import { Modal } from 'antd';
import './style.css'
interface PopOverProps {
  open: boolean;
  onOk: () => void;
  onCancel: () => void;
}

const PopOver: React.FC<PopOverProps> = ({ open, onOk, onCancel }) => {
  return (
    <Modal
      open={open}
      title="Confirm Deletion"
      onOk={onOk}
      onCancel={onCancel}
      footer={null}
    >
      <p>Are you sure you want to delete this item?</p>
      <div className='delete-popup' style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button className="btn btn-danger" onClick={onOk} style={{ marginLeft: '10px' }}>
          Delete
        </button>   
      </div>
    </Modal>
  );
};

export default PopOver;
