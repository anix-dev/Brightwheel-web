import React, { useEffect, useState } from 'react';
import api from '../../core/data/api';
import Loading from '../../core/common/loader/Loading';

interface SelectClassProps {
  selectedClass: string | string[];
  selectedCenter: any;
  handleSelect: any;
  isMultiple?: boolean; // optional
}

const SelectClass: React.FC<SelectClassProps> = ({ selectedClass,selectedCenter, handleSelect,isMultiple }) => {
  const [loader, setLoader] = useState<boolean>(false);
  const [centers, setCenters] = useState<{ ClassName: string; id: string }[]>([]);
  const user = localStorage.getItem('user');
  const RoleId = localStorage.getItem('Role')
useEffect(() => {
  const getCenter = async () => {
    try {
      setLoader(true);
      let filteredCenters;
      const res = await api.post('/api/mssql-procedure/execute/get', {
        procedureName: 'ClassesGetAll',
        parameters: [],
      });
      if (res.data?.centers && Array.isArray(res.data.centers)) {
        if(selectedCenter == "Center"){
          filteredCenters = res.data.centers
          .map((center: any) => ({
            ClassName: center.ClassName,
            centerId:center.CenterID,
             CREATED_BY:center.CREATED_BY,
            id: center.ID,
          }));
        }
        else{
        filteredCenters = res.data.centers
          .filter((center: any) => 
           selectedCenter == center?.CenterID
          )
          .map((center: any) => ({
            ClassName: center.ClassName,
            centerId:center.CenterID,
             CREATED_BY:center.CREATED_BY,
            id: center.ID,
          }));
        }
       
      if (!selectedClass&& selectedCenter!="Center"&& filteredCenters.length > 0) {
          handleSelect(filteredCenters[0].id);
        }
        if(RoleId == "2"){
          const filter = filteredCenters.filter((item:any)=>
            item.CREATED_BY == user
          );
          setCenters(filter);
        }else{
        setCenters(filteredCenters);
        }
        
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
  multiple={isMultiple} // enables multi-select if true
  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
    if (isMultiple) {
      const selectedValues = Array.from(e.target.selectedOptions, (option) => option.value);
      handleSelect(selectedValues);
    } else {
      handleSelect(e.target.value);
    }
  }}
>
  {!isMultiple && <option value=" ">Select Class</option>}
  {centers.map((center) => (
    <option key={center.id} value={center.ClassName}>
      {center.ClassName}
    </option>
  ))}
</select>
          {/* <select
            name="selectedClass"
            className="form-select"
            value={selectedClass}
            onChange={(e:any) => handleSelect(e.target.value)}
            >
            <option value=" ">Select Class</option>
            {centers.map((center) => (
              <option key={center.id} value={center.ClassName}>
                {center.ClassName}
              </option>
            ))}
          </select> */}
        </>
      )}
    </>
  );
};

export default SelectClass;
