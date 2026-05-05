// index.tsx
import React, { useEffect, useState } from "react";
import { Table } from "antd";

export interface DatatableProps {
  columns: any[]; // You can replace `any[]` with the specific type of columns you expect
  dataSource: any[]; // You can replace `any[]` with the specific type of dataSource you expect
  Selection?: boolean | undefined;
  label:string;
}
const Datatable: React.FC<DatatableProps> = ({ columns, dataSource ,label, Selection }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [Selections, setSelections] = useState<any>(true);
  const [filteredDataSource, setFilteredDataSource] = useState(dataSource);

  const onSelectChange = (newSelectedRowKeys: any[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };



  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  
  useEffect(() => {
    return setSelections(Selection);
  }, [Selection])
  
  
  return (
    <>
     <div className="table-top-data d-flex px-3 ">
        <h3 className="mt-4">{label}</h3>
     </div>
      <Table
      className="table datanew dataTable no-footer"
      columns={columns}
      rowHoverable={false}
      dataSource={filteredDataSource}
      pagination={{
        locale: { items_per_page: "" },
        nextIcon: <span>Next</span>,
        prevIcon: <span>Prev</span>,
        defaultPageSize: 5,
        showSizeChanger: true,
        pageSizeOptions: ["5", "10", "15"],
      }}
    /> 
      
    </>
  );
};

export default Datatable;
