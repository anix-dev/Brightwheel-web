import React,{useEffect} from 'react';
import { Select, Space } from 'antd';
import '../center.css'
import { defaultValues } from '../../../core/common/selectoption/selectoption';

interface School {
  id: string;
  CenterName: string;
}

interface SelectExistingSchoolProps {
  schools: School[];
  defaultValue?: string; // <-- fixed
  handleChange: (value: string) => void;
}


const SelectExistingSchool: React.FC<SelectExistingSchoolProps> = ({
  schools,
  defaultValue,
  handleChange,
}) => {
  const options = schools.map((school) => ({
    value: school.CenterName,
    label: school.CenterName,
  }));
 
  return (
    <Space wrap>
      <Select
        className="select-hover"
        placeholder="Select a school"
        style={{ width: 260, height: '39px' }}
        onChange={handleChange}
        options={options}
        value={defaultValue} // <-- default selected value
      />
    </Space>
  );
};

export default SelectExistingSchool;
