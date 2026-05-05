import React, { useState, useEffect, useMemo } from 'react';
import Select, { MultiValue } from "react-select";

interface Service {
  label: string;
  value: string;
  IsAdditionalService: boolean;
}

interface SelectServicesProps {
  selectedValues: string[];
  defaultValue: string[];
  handleInputChange: (value: string[]) => void;
  services: Service[];
  loading: boolean;
}
interface SelectOption {
  value: string | number;
  label: string;
}
const SelectServices: React.FC<SelectServicesProps> = ({ 
  selectedValues, 
  defaultValue, 
  handleInputChange, 
  services, 
  loading 
}) => {
   const [selectedOptions, setSelectedOptions] = useState<SelectOption[]>([]);

  useEffect(() => {
    if (services.length && selectedValues.length) {
      const options = services
        .filter((service) => service.IsAdditionalService == false)
        .filter((service) =>
          selectedValues.includes(service.value.toString())
        )
        .map((service) => ({
          value: service.value,
          label: service.label,
        }));
      setSelectedOptions(options);
    }
  }, [services, selectedValues]);

  const handleChange = (selected: MultiValue<SelectOption>) => {
    const values = selected
      ? selected.map((item) => item.value.toString())
      : [];
    handleInputChange(values);
  };

  const options = services
    .filter((service) => service.IsAdditionalService == false)
    .map((service) => ({
      value: service.value,
      label: service.label,
    }));

  return (
    <Select
      isMulti
      options={options}
      value={selectedOptions}
      onChange={handleChange}
      isLoading={loading}
      placeholder="Select  Services"
    />
  );
};
export default SelectServices;