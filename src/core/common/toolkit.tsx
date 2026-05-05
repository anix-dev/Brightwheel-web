import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";

type TooltipOptionProps = {
  setLoading: (loading: boolean) => void;
  data: any[];
  setData: (data: any[]) => void; // To update state after import
};

const TooltipOption: React.FC<TooltipOptionProps> = ({ setLoading, data, setData }) => {
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
    try {
      
    } catch (error) {
      console.log("PDF export failed:", error);
    }
  };

  const handleImportExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const binaryStr = event.target?.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
     setData(jsonData)
    };
    reader.readAsBinaryString(file);
  };

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const workbook = XLSX.read(text, { type: "string" });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      setData(jsonData);
    };
    reader.readAsText(file);
  };

  return (
    <>
      <div className="pe-1 mb-2">
        <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-refresh">Refresh</Tooltip>}>
          <Link to="#" onClick={handleRefresh} className="btn btn-outline-light bg-white btn-icon me-1">
            <i className="ti ti-refresh" />
          </Link>
        </OverlayTrigger>
      </div>

     
      <div className="d-flex flex-wrap">
        {/* Export Dropdown */}
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
              <Link to="#" className="dropdown-item rounded-1" onClick={exportAsExcel}>
                <i className="ti ti-file-type-xls me-1" />
                Export as Excel
              </Link>
            </li>
          </ul>
        </div>

        <div className="dropdown mb-2">
          <Link
            to="#"
            className="dropdown-toggle btn btn-light fw-medium d-inline-flex align-items-center"
            data-bs-toggle="dropdown"
          >
            <i className="ti ti-file-import me-2" />
            Import
          </Link>
          <ul className="dropdown-menu dropdown-menu-end p-3">
            <li>
              <label htmlFor="importExcel" className="dropdown-item rounded-1" style={{ cursor: "pointer" }}>
                <i className="ti ti-file-type-xls me-1" />
                Import from Excel
              </label>
              <input
                type="file"
                id="importExcel"
                accept=".xlsx, .xls"
                onChange={handleImportExcel}
                style={{ display: "none" }}
              />
            </li>
            <li>
              <label htmlFor="importCSV" className="dropdown-item rounded-1" style={{ cursor: "pointer" }}>
                <i className="ti ti-file-type-csv me-1" />
                Import from CSV
              </label>
              <input
                type="file"
                id="importCSV"
                accept=".csv"
                onChange={handleImportCSV}
                style={{ display: "none" }}
              />
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default TooltipOption;
