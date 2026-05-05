import React, { useEffect, useState } from 'react';
import api from '../../core/data/api';
import Loading from '../../core/common/loader/Loading';

interface SelectCenterProps {
  selectedCenter: string;
  setName: string;
  handleSelect: (center: string) => void;
}

const SelectRecord: React.FC<SelectCenterProps> = ({ setName, selectedCenter, handleSelect }) => {
  const [loader, setLoader] = useState<boolean>(true);
  const [centers, setCenters] = useState<{ name: string; id: string }[]>([]);
 
  const getCenter = async () => {
    try {
      setLoader(true);
      const res = await api.post('/api/mssql-procedure/execute/get', {
        procedureName: 'RecordGetAll',
        parameters: [],
      });

      if (res.data.success) {
        const filteredCenters = res.data.centers.map((center: any) => ({
          name: center.Name,
          id: center.ID,
        }));

        setCenters(filteredCenters);
      }
    } catch (error: any) {
      console.log('Error fetching centers:', error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    getCenter();
  }, []);

  return (
    <>
      {loader ? (
        <Loading />
      ) : (
        <>
          <select
            name="selectedCenter"
            className="form-select"
            value={selectedCenter}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleSelect(e.target.value)}
            // disabled={!!setName} // 🔥 Disable if setName is truthy
          >
            <option value=" ">Select Template</option>
            {centers.map((center) => (
              <option key={center.id} value={center.name}>
                {center.name}
              </option>
            ))}
          </select>
        </>
      )}
    </>
  );
};

export default SelectRecord;
