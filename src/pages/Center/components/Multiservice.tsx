import React, { useEffect } from "react";
import Select, { MultiValue } from "react-select";

interface ServiceOption {
  value: string;
  label: string;
  IsAdditionalService: boolean;
}

interface SelectServicesProps {
  services: ServiceOption[];
  loading: boolean;
  selectedOptions: MultiValue<ServiceOption>;
  setSelectedOptions: (selected: MultiValue<ServiceOption>) => void;
  defaultSelected?: string[]; // Array of service IDs that should be selected by default
}

const SelectServices: React.FC<SelectServicesProps> = ({
  services,
  loading,
  selectedOptions,
  setSelectedOptions,
  defaultSelected = [],
}) => {
  // Filter out additional services (we only want regular services here)
  const regularServices = services.filter(service => !service.IsAdditionalService);

  // Set default selected values on first render
  useEffect(() => {
    if (defaultSelected.length > 0 && selectedOptions.length === 0) {
      const defaultOptions = regularServices.filter(service => 
        defaultSelected.includes(service.value)
      );
      setSelectedOptions(defaultOptions);
    }
  }, [defaultSelected, regularServices, selectedOptions.length, setSelectedOptions]);

  const handleChange = (selected: MultiValue<ServiceOption>) => {
    setSelectedOptions(selected);
  };

  if (loading) {
    return <div>Loading services...</div>;
  }

  return (
    <div className="services-select">
      <Select
        isMulti
        options={regularServices}
        value={selectedOptions}
        onChange={handleChange}
        placeholder="Select services"
        closeMenuOnSelect={false}
        isLoading={loading}
      />
    </div>
  );
};

export default SelectServices;