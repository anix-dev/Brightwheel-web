import React, { useEffect, useState } from "react";
import Select, { MultiValue } from "react-select";

interface Service {
  value: number | string;
  label: string;
  IsAdditionalService: boolean;
}

interface SelectAddinalServicesProps {
  additionalServices: string[];
  defaultValue?: string[];
  handleAdditionalServices: (values: string[]) => void;
  services: Service[];
  loading: boolean;
}

interface SelectOption {
  value: string | number;
  label: string;
}

const SelectAddinalServices: React.FC<SelectAddinalServicesProps> = ({
  additionalServices,
  defaultValue,
  handleAdditionalServices,
  services,
  loading,
}) => {
  const [selectedOptions, setSelectedOptions] = useState<SelectOption[]>([]);

  useEffect(() => {
    if (services.length && additionalServices.length) {
      const options = services
        .filter((service) => service.IsAdditionalService)
        .filter((service) =>
          additionalServices.includes(service.value.toString())
        )
        .map((service) => ({
          value: service.value,
          label: service.label,
        }));
      setSelectedOptions(options);
    }
  }, [services, additionalServices]);

  const handleChange = (selected: MultiValue<SelectOption>) => {
    const values = selected
      ? selected.map((item) => item.value.toString())
      : [];
    handleAdditionalServices(values);
  };

  const options = services
    .filter((service) => service.IsAdditionalService)
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
      placeholder="Select Additional Services"
    />
  );
};

export default SelectAddinalServices;