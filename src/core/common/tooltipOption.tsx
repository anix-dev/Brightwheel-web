import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";

type TooltipOptionProps = {
  setLoading: (loading: boolean) => void;
  data: any[]; 
};

const TooltipOption: React.FC<TooltipOptionProps> = ({ setLoading, data }) => {
  const handleRefresh = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 2000); // Simulated async
  };

  const exportAsExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "data.xlsx");
  };

  const exportAsPDF = () => {
    try{
      
    }
    catch(error){
    }
  };

  return (
    <>
      <div className="pe-1 mb-2">
        <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-top">Refresh</Tooltip>}>
          <Link to="#" onClick={handleRefresh} className="btn btn-outline-light bg-white btn-icon me-1">
            <i className="ti ti-refresh" />
          </Link>
        </OverlayTrigger>
      </div>

      <div className="pe-1 mb-2">
        <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-top">Print</Tooltip>}>
          <button type="button" className="btn btn-outline-light bg-white btn-icon me-1">
            <i className="ti ti-printer" />
          </button>
        </OverlayTrigger>
      </div>

      <div className="dropdown me-2 mb-2">
        <Link
          to="#"
          className="dropdown-toggle btn btn-light fw-medium d-inline-flex align-items-center"
          data-bs-toggle="dropdown"
        >
          <i className="ti ti-file-export me-2" />
          Export
        </Link>
        <ul className="dropdown-menu dropdown-menu-end p-3">
          <li>
            <Link to="#" className="dropdown-item rounded-1" onClick={exportAsPDF}>
              <i className="ti ti-file-type-pdf me-1" />
              Export as PDF
            </Link>
          </li>
          <li>
            <Link to="#" className="dropdown-item rounded-1" onClick={exportAsExcel}>
              <i className="ti ti-file-type-xls me-1" />
              Export as Excel
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default TooltipOption;
