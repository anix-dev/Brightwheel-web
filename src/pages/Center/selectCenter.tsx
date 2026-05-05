import React, { useEffect, useState } from 'react';
import api from '../../core/data/api';
import Loading from '../../core/common/loader/Loading';
import { useSelector } from "react-redux";
interface SelectCenterProps {
  selectedCenter: string;
  handleSelect: (center: string) => void;
}

const SelectCenter: React.FC<SelectCenterProps> = ({ selectedCenter, handleSelect }) => {
  const [loader, setLoader] = useState<boolean>(true);
  const {users} = useSelector((state: any) => state.user);
  const RoleId = localStorage.getItem('Role')
  const [centers, setCenters] = useState<{ CenterName: string; id: string }[]>([]);

  const getCenter = async () => {
    try {
      setLoader(true);
      const res = await api.post('/api/mssql-procedure/execute/get', {
        procedureName: 'CenterGetAll',
        parameters: [],
      });

      if (res.data.success) {
        const filteredCenters = res.data.centers.map((center: any) => ({
          CenterName: center.Center,
          id: center.CenterID,
           CREATED_BY:center.CREATED_BY,
        }));
        //   if (!selectedCenter && filteredCenters.length > 0) {
        //   handleSelect(filteredCenters[0].id);
        // }
          if(RoleId == "2" || RoleId =="3"){
          const filter = filteredCenters.filter((item:any)=>
            item.id == users.centerId || item.id == users.CenterID
          );
          setCenters(filter);
        }else{
        setCenters(filteredCenters);
        }
     } 
    }catch (error: any) {
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
          {/* <label className="form-label">Select Center *</label> */}
          <select
            name="selectedCenter"
            className="form-select"
            value={selectedCenter}
            onChange={(e:any) => handleSelect(e.target.value)}
          >
            <option value=" ">Select Center</option>
            {centers.map((center) => (
              <option key={center.id} value={center.id}>
                {center.CenterName}
              </option>
            ))}
          </select>
        </>
      )}
    </>
  );
};

export default SelectCenter;
