import React, { useEffect, useState } from 'react';
import api from '../../core/data/api';
import Loading from '../../core/common/loader/Loading';

interface SelectClassProps {
  selectedClass: any;
  selectedCenter:any;
  handleSelect: (center: string,item:string) => void;
  type:string;
}

const SelectClassType: React.FC<SelectClassProps> = ({ selectedClass,selectedCenter, handleSelect ,type}) => {
  const [loader, setLoader] = useState<boolean>(false);
  const [centers, setCenters] = useState<{ ClassName: string; id: string }[]>([]);

useEffect(() => {
  const getCenter = async () => {
    try {
      setLoader(true);
      const res = await api.post('/api/mssql-procedure/execute/get', {
        procedureName: 'ClassesGetAll',
        parameters: [],
      });
      if (res.data?.centers && Array.isArray(res.data.centers)) {
        const filteredCenters = res.data.centers
          .filter((center: any) => 
           selectedCenter == center?.CenterID
          )
          .map((center: any) => ({
            ClassName: center.ClassName,
            centerId:center.CenterID,
            id: center.ID,
          }));
      // if (!selectedClass&& filteredCenters.length > 0) {
      //     handleSelect(filteredCenters[0].id,type);
      //   }
        setCenters(filteredCenters);
        
      } else {
        console.warn("No centers found in response.");
        setCenters([]);
      }

    } catch (error: any) {
      console.log('Error fetching centers:', error);
    } finally {
      setLoader(false);
    }
  };
 
  if (selectedCenter) {
    getCenter();
   }
}, [selectedCenter]);

  return (
    <>
      {loader ? (
        <Loading />
      ) : (
        <>
      
          <select
            name="selectedClass"
            className="form-select"
            value={selectedClass}
            onChange={(e:any) => handleSelect(e.target.value,type)}
            >
            <option value=" ">Select Class</option>
            {centers.map((center) => (
              <option key={center.id} value={center.id}>
                {center.ClassName}
              </option>
            ))}
          </select>
        </>
      )}
    </>
  );
};

export default SelectClassType;
