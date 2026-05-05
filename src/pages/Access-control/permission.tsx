import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Table from "../../core/common/dataTable/index";
import { permission } from "../../core/data/json/permission";
import { all_routes } from "../../feature-module/router/all_routes";
import api from "../../core/data/api";
import Loading from "../../core/common/loader/Loading";
import { toast } from "react-toastify";

interface Permission {
  create: boolean;
  view: boolean;
  edit: boolean;
  delete: boolean;
  allowAll: boolean;
}

interface ModulePermission {
  [module: string]: Permission;
}

interface RoleData {
  key: number;
  SNO: number;
  Lock: boolean;
  ROLE_ID: string;
  PERMISSION: string | ModulePermission;
  CREATED_DATE: string;
  ACTIVE: boolean;
  id: string;
}

interface TableDataItem {
  key: number;
  modules: string;
  create: boolean;
  view: boolean;
  edit: boolean;
  delete: boolean;
  allowAll: boolean;
}

const Permission = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const user = parseInt(localStorage.getItem("user") || "0", 10);

  const [loading, setLoading] = useState(false);
  const [datas, setData] = useState<RoleData[]>([]);
  const [modulePermissions, setModulePermissions] = useState<ModulePermission>({});
  const [roleName, setRoleName] = useState("");

  const routes = all_routes;

  const initializeDefaultPermissions = useCallback(() => {
    const initialPermissions: ModulePermission = {};
    permission.forEach((mod: any) => {
      initialPermissions[mod.modules] = {
        create: false,
        view: false,
        edit: false,
        delete: false,
        allowAll: false,
      };
    });
    return initialPermissions;
  }, []);

  const handleCheckboxChange = (module: string, permType: keyof Permission) => {
    setModulePermissions((prev) => {
      const currentModule = prev[module] || initializeDefaultPermissions()[module];
      const updated: Permission = { ...currentModule };
      if (permType === "allowAll") {
        const newVal = !currentModule.allowAll;
        updated.create = newVal;
        updated.view = newVal;
        updated.edit = newVal;
        updated.delete = newVal;
        updated.allowAll = newVal;
      } else {
        updated[permType] = !currentModule[permType];
        updated.allowAll = updated.create && updated.view && updated.edit && updated.delete;
      }

      return {
        ...prev,
        [module]: updated,
      };
    });
  };

const parsePermissionData = (permissionData: string | ModulePermission): ModulePermission => {
  try {
    if (typeof permissionData === "string") {
      // First, remove any escaping from the string
      let sanitized = permissionData
        .trim()
        .replace(/\\"/g, '"')  // Unescape quotes
        .replace(/,\s*}/g, '}')  // Remove trailing commas
        .replace(/,\s*]/g, ']');

      // Ensure we have proper JSON delimiters
      if (!sanitized.startsWith('{') || !sanitized.endsWith('}')) {
        // Try adding missing delimiters if they're not present
        if (!sanitized.startsWith('{') && !sanitized.endsWith('}')) {
          sanitized = `{${sanitized}}`;
        } else {
          throw new Error("Invalid JSON format");
        }
      }

      return JSON.parse(sanitized);
    }
    return permissionData;
  } catch (error) {
    console.error("Failed to parse permission data:", error);
    console.error("Original data:", permissionData);
    return initializeDefaultPermissions();
  }
};

  const getData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.post("/api/mssql-procedure/execute", {
        procedureName: "access_controlGetAll",
        parameters: [{ name: "Id", type: "Int", value: id }],
      });

      const record = res.data.record?.[0];
      setRoleName(record?.ROLE_ID || "");

      const filterData: RoleData[] = res.data.record.map((center: any, index: number) => ({
        key: index + 1,
        SNO: index + 1,
        Lock: index % 2 === 0,
        ROLE_ID: center.ROLE_ID,
        PERMISSION: center.PERMISSION,
        CREATED_DATE: center.CREATED_DATE,
        ACTIVE: center.ACTIVE,
        id: center.ID,
      }));

      setData(filterData);

      if (record?.PERMISSION) {
        const parsedPermissions = parsePermissionData(record.PERMISSION);
        setModulePermissions(parsedPermissions);
      } else {
        setModulePermissions(initializeDefaultPermissions());
      }
    } catch (error) {
      console.error("Error loading permissions:", error);
      toast.error("Failed to load permissions");
      setModulePermissions(initializeDefaultPermissions());
    } finally {
      setLoading(false);
    }
  }, [id, initializeDefaultPermissions]);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  try {
    const filteredPermissions: ModulePermission = Object.fromEntries(
      Object.entries(modulePermissions).filter(([_, perms]) =>
        perms.create || perms.view || perms.edit || perms.delete || perms.allowAll
      )
    );

    const permissionPayload = JSON.stringify(filteredPermissions);

    const hasExistingRecord = datas.length > 0;
    const existingRecord = datas[0];

    if (hasExistingRecord) {
      // Update existing record
      const res = await api.post("/api/mssql-procedure/execute", {
        procedureName: "accesscontrolUpdate",
        parameters: [
          { name: "ID", type: "Int", value: existingRecord.id }, // Use real record ID
          { name: "PageID", type: "Int", value: existingRecord.key }, // Or whatever PageID is
          { name: "ROLE_ID", type: "Int", value: existingRecord.ROLE_ID },
          { name: "PERMISSION", type: "VarChar", value: permissionPayload },
          { name: "Active", type: "Int", value: 1 },
          { name: "MODIFIED_BY", type: "Int", value: user },
        ],
      });

      if (res.data.success) {
        toast.success("Permissions updated successfully");
        await getData();
      } else {
        toast.error("Failed to update permissions");
      }
    } else {
      // Insert new record
      const res = await api.post("/api/mssql-procedure/execute", {
        procedureName: "accesscontrolINSERT",
        parameters: [
          { name: "PageID", type: "Int", value: id },
          { name: "ROLE_ID", type: "Int", value: roleName || id },
          { name: "PERMISSION", type: "VarChar", value: permissionPayload },
          { name: "Active", type: "Int", value: 1 },
          { name: "CREATED_BY", type: "Int", value: user },
        ],
      });

      if (res.data.success) {
        toast.success("Permissions created successfully");
        await getData();
      } else {
        toast.error("Failed to create permissions");
      }
    }
  } catch (error) {
    console.error("Error updating permissions:", error);
    toast.error("An error occurred while saving permissions");
  } finally {
    setLoading(false);
  }
};


  const tableData: TableDataItem[] = permission.map((item: any, index: number) => ({
    key: index,
    modules: item.modules,
    ...(modulePermissions[item.modules] || {
      create: false,
      view: false,
      edit: false,
      delete: false,
      allowAll: false,
    }),
  }));

  const columns = [
    {
      title: "Modules",
      dataIndex: "modules",
      key: "modules",
    },
    ...(["create", "view", "edit", "delete", "allowAll"] as const).map((permType) => ({
      title: permType.charAt(0).toUpperCase() + permType.slice(1),
      dataIndex: permType,
      render: (_: any, record: TableDataItem) => (
        <label className="checkboxs">
          <input
            type="checkbox"
            checked={modulePermissions[record.modules]?.[permType] || false}
            onChange={() => handleCheckboxChange(record.modules, permType)}
          />
          <span className="checkmarks" />
        </label>
      ),
    })),
  ];

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
          <div className="my-auto mb-2">
            <h3 className="page-title mb-1">Roles & Permissions</h3>
            <nav>
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <Link to={routes.adminDashboard}>Dashboard</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="#">AccessControl Management</Link>
                </li>
                <li className="breadcrumb-item active">Roles & Permissions</li>
              </ol>
            </nav>
          </div>
          {/* <div className="d-flex my-xl-auto right-content align-items-center justify-content-end flex-wrap">
            <div className="mb-2">
              <Link
                to="#"
                className="btn btn-primary d-flex align-items-center"
                data-bs-toggle="modal"
                data-bs-target="#add_role"
              >
                <i className="ti ti-square-rounded-plus me-2" />
                Add Role
              </Link>
            </div>
          </div> */}
        </div>

        <div className="card">
          <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
            <h4 className="mb-3">Roles & Permissions List</h4>
          </div>
          <div className="card-body p-0 py-3">
            {loading ? (
              <Loading />
            ) : (
              <>
                <Table columns={columns} dataSource={tableData} />
                <div className="text-end mt-3 pe-3">
                  <button
                    className="btn btn-primary"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save Permissions"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Permission;
