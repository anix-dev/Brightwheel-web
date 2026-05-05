import React, { useState, useCallback } from 'react';
import Cropper, { Area } from 'react-easy-crop';
import { getCroppedImg } from '../utils/cropImage';
import { Modal, Slider, Select } from 'antd';

const { Option } = Select;

interface CropModalProps {
  file: File;
  onCropComplete: (croppedFile: File) => void;
  onClose: () => void;
}

const CropModal: React.FC<CropModalProps> = ({ file, onCropComplete, onClose }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState<number | undefined>(1); // Default to square
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const imageURL = URL.createObjectURL(file);

  const handleCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleDone = async () => {
    if (!croppedAreaPixels) return;
    const croppedFile = await getCroppedImg(imageURL, croppedAreaPixels, file.name);
    onCropComplete(croppedFile);
    onClose();
  };

  return (
    <Modal
      open
      onCancel={onClose}
      onOk={handleDone}
      okText="Crop & Upload"
      width={600}
      styles={{
        body: {
          backgroundColor: '#131022',
          paddingBottom: 0,
        },
        content: {
          backgroundColor: '#131022',
        },
      }}
      okButtonProps={{
        style: {
          backgroundColor: '#D4AF37',
          borderColor: '#D4AF37',
          color: 'white',
        },
      }}
    >
      <div style={{ position: 'relative', width: '100%', height: 400 }}>
        <Cropper
          image={imageURL}
          crop={crop}
          zoom={zoom}
          aspect={aspect}
          onCropChange={setCrop}
          onCropComplete={handleCropComplete}
          onZoomChange={setZoom}
        />
      </div>

      <div style={{ marginTop: 16 , color:"white"}}>
        <label>Zoom:</label>
        <Slider
          min={1}
          max={3}
          step={0.1}
          value={zoom}
          onChange={(val) => setZoom(val)}
        />
      </div>

    </Modal>
  );
};

export default CropModal;
