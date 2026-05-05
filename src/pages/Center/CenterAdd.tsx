import React, { useEffect, useState, useCallback, useRef } from "react";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import "./center.css";
import api from "../../core/data/api";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { all_routes } from "../../feature-module/router/all_routes";
import Select from "react-select";
import { useParams } from "react-router-dom";
import { MultiValue } from "react-select";
import SelectServices from "./components/selectServices";
import SelectAddinalServices from "./components/SelectAddinalServices";
import SelectExistingSchool from "./components/SelectExistingSchool";
import CropModal from "../../core/CropModal";
import { LifeStyleOptions, preferencesOptions } from "../../style/Constant";
interface CenterDetails {
  centerName: string;
  services: string[];
  additionalServices: string[];
  Image: string;
  dateOfEstablishment: dayjs.Dayjs | null;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
  inchargeName: string;
  inchargeEmail: string;
  mobile: string;
  inchargePosition: string;
  SchoolName: string;
  manageCenter: boolean;
  monthlyBill: boolean;
  schoolName: string;
}

interface Errors {
  [key: string]: string;
}
interface Preference {
  value: string;
  label: string;
}

interface ServiceOption {
  value: string;
  label: string;
  IsAdditionalService: boolean;
}

const CenterAdd = () => {
  const user = localStorage.getItem("user");
  const navigate = useNavigate();
  const preferencesOption: Preference[] = preferencesOptions;
  const { id } = useParams<{ id?: string }>();
  const resolvedIdNullable = id ? parseInt(id, 10) : null;
  const isEdit = !!resolvedIdNullable;
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showCrop, setShowCrop] = useState(false);
  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [singledata, setSingleData] = useState<any>({});
  const [selectedSchool, setSelectedSchool] = useState<string>("");
  const [schools, setSchools] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [selectedValues, setSelectedValues] = useState<any[]>([]);
  const [selectedAdditionalServices, setSelectedAdditionalServices] = useState<
    any[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loader, setLoader] = useState<boolean>(true);
  const [preview, setPreview] = useState<string>("/assets/images/default.png");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initialCenterDetails: CenterDetails = {
    centerName: "",
    services: [],
    additionalServices: [],
    Image: "",
    dateOfEstablishment: null,
    address: "",
    city: "",
    state: "",
    pinCode: "",
    country: "",
    inchargeName: "",
    inchargeEmail: "",
    mobile: "",
    inchargePosition: "",
    SchoolName: "",
    manageCenter: false,
    monthlyBill: false,
    schoolName: selectedSchool || "",
  };

  const initialErrors: Errors = {
    schoolName: "",
    centerName: "",
    Image: "",
    dateOfEstablishment: "",
    services: "",
    additionalServices: "",
    address: "",
    city: "",
    state: "",
    pinCode: "",
    country: "",
    inchargeName: "",
    inchargeEmail: "",
    mobile: "",
    inchargePosition: "",
  };

  const [centerDetails, setCenterDetails] =
    useState<CenterDetails>(initialCenterDetails);
  const [errors, setErrors] = useState<Errors>(initialErrors);

  const countryOptions = React.useMemo(
    () =>
      countries.map((country) => ({
        value: country.ID,
        label: country.NAME,
        NAME: country.NAME,
      })),
    [countries]
  );

  const stateOptions = React.useMemo(
    () =>
      states.map((state) => ({
        value: state.ID,
        label: state.NAME,
        NAME: state.NAME,
      })),
    [states]
  );

  const fetchData = useCallback(
    async (procedureName: string, parameters: any[] = []) => {
      try {
        const res = await api.post("/api/mssql-procedure/execute/get", {
          procedureName,
          parameters,
        });
        return res.data.success ? res.data.centers : [];
      } catch (error) {
        console.log(`Error fetching ${procedureName}:`, error);
        return [];
      }
    },
    []
  );

  const getServices = useCallback(async () => {
    setLoading(true);
    const data = await fetchData("ServicesGetAll");
    if (data.length) {
      setServices(
        data.map((service: any) => ({
          label: service.Name,
          value: service.ID.toString(), // Ensure value is string
          IsAdditionalService: service.IsAdditionalService,
        }))
      );
    }
    setLoading(false);
  }, [fetchData]);

  const getData = useCallback(async () => {
    if (!resolvedIdNullable) return;

    const data = await api.post("/api/mssql-procedure/execute", {
      procedureName: "CenterGetbyID",
      parameters: [{ name: "id", type: "Int", value: resolvedIdNullable }],
    });

    if (data) {
      const record = data.data.record[0];
      setSingleData(record);
      // Initialize services and additional services as strings
      const serviceIds = record.ServiceID;

      const additionalServiceIds = record.AddionalServiceID;
      setSelectedValues(serviceIds);
      setSelectedAdditionalServices(additionalServiceIds);
      setCenterDetails((prev) => ({
        ...prev,
        centerName: record.Center || "",
        address: record.Address || "",
        Image: record.Image || "assets/images/default.png",
        city: record.City || "",
        schoolName: (schools?.find((e: any) => e.id === record.SchoolID) as any)
          ?.CenterName,
        services: serviceIds,
        additionalServices: additionalServiceIds,
        state: record.StateID || "",
        pinCode: record.PinCode || "",
        country: record.CountryID || "",
        inchargeName: record.InchargeName || "",
        inchargeEmail: record.InchargeEmail || "",
        mobile: record.Mobile || "",
        inchargePosition: record.InchargePosition || "",
        SchoolName: record.SchoolID || "",
        manageCenter: !!record.IManageThisCenter,
        monthlyBill: !!record.MonthlyBillToCenterOwner,
        dateOfEstablishment: record.DateOfEstablishment
          ? dayjs(record.DateOfEstablishment)
          : null,
      }));

      if (record.Image) {
        setPreview(record.Image);
      }
    }
  }, [resolvedIdNullable]);

  const getExistingSchool = useCallback(async () => {
    setLoader(true);
    const data = await fetchData("SchoolGetAll");
    if (data.length) {
      setSchools(
        data.map((center: any, index: number) => ({
          key: index + 1,
          CenterName: center.SchoolName,
          id: center.ID,
        }))
      );
    }
    setLoader(false);
  }, [fetchData]);

  useEffect(() => {
    const loadInitialData = async () => {
      const [countriesData, statesData] = await Promise.all([
        fetchData("CountriesGetAll"),
        fetchData("StatesGetAll"),
      ]);

      setCountries(countriesData);
      setStates(statesData);
      await getServices();
      await getExistingSchool();

      if (isEdit) {
        await getData();
      }
    };

    loadInitialData();
  }, [fetchData, getData, getServices, getExistingSchool, isEdit]);

  useEffect(() => {
    if (selectedSchool) {
      setCenterDetails((prev) => ({
        ...prev,
        schoolName: selectedSchool,
      }));
    }
  }, [selectedSchool]);

  const handleCountrySelectChange = (selectedOption: any) => {
    setCenterDetails((prev) => ({
      ...prev,
      country: selectedOption ? selectedOption.value : "",
    }));
    setErrors((prev) => ({ ...prev, country: "" }));
  };

  const handleStateSelectChange = (selectedOption: any) => {
    setCenterDetails((prev) => ({
      ...prev,
      state: selectedOption ? selectedOption.value : "",
    }));
    setErrors((prev) => ({ ...prev, state: "" }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "schoolName") {
      setSelectedSchool(""); // Clear dropdown selection when typing manually
    }

    setCenterDetails((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setCenterDetails((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleDateChange = (date: dayjs.Dayjs | null) => {
    setCenterDetails((prev) => ({
      ...prev,
      dateOfEstablishment: date,
    }));
    setErrors((prev) => ({ ...prev, dateOfEstablishment: "" }));
  };

  const handleServiceSelectionChange = (value: string[]) => {
    setSelectedValues(value);
    setCenterDetails((prev) => ({
      ...prev,
      services: value,
    }));
    setErrors((prev) => ({ ...prev, services: "" }));
  };

  const handleAddinalService = (value: string[]) => {
    setSelectedAdditionalServices(value);
    setCenterDetails((prev) => ({
      ...prev,
      additionalServices: value,
    }));
    setErrors((prev) => ({ ...prev, additionalServices: "" }));
  };

  const handleChange = (value: string) => {
    setSelectedSchool(value);
    setCenterDetails((prev) => ({
      ...prev,
      schoolName: value,
    }));
    setErrors((prev) => ({ ...prev, schoolName: "" }));
  };

  const validate = (): boolean => {
    const newErrors: Errors = {};
    let isValid = true;

    if (!centerDetails.centerName.trim()) {
      newErrors.centerName = "Center name is required";
      isValid = false;
    }

    if (!centerDetails.dateOfEstablishment) {
      newErrors.dateOfEstablishment = "Date of Establishment is required";
      isValid = false;
    }
    if (!selectedValues.length) {
      newErrors.services = "Services field is required";
      isValid = false;
    }

    if (!selectedAdditionalServices.length) {
      newErrors.additionalServices = "Additional Services field is required";
      isValid = false;
    }

    if (!centerDetails.address.trim()) {
      newErrors.address = "Address is required";
      isValid = false;
    }

    if (!centerDetails.city.trim()) {
      newErrors.city = "City is required";
      isValid = false;
    }

    if (!centerDetails.state) {
      newErrors.state = "State is required";
      isValid = false;
    }

    if (!/^\d{6}$/.test(centerDetails?.pinCode)) {
      newErrors.pinCode = "Valid pin code is required (6 digits)";
      isValid = false;
    }

    if (!centerDetails.country) {
      newErrors.country = "Country is required";
      isValid = false;
    }

    if (!centerDetails.inchargeName.trim()) {
      newErrors.inchargeName = "Incharge Name is required";
      isValid = false;
    }

    if (
      !centerDetails.inchargeEmail.trim() ||
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
        centerDetails.inchargeEmail
      )
    ) {
      newErrors.inchargeEmail = "Valid email address is required";
      isValid = false;
    }

    if (
      !centerDetails.mobile.trim() ||
      !/^\d{10}$/.test(centerDetails.mobile)
    ) {
      newErrors.mobile = "Valid mobile number is required (10 digits)";
      isValid = false;
    }

    if (!centerDetails.inchargePosition.trim()) {
      newErrors.inchargePosition = "Incharge Position is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      uploadProfile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadProfile = async (croppedFile: File) => {
    const formData = new FormData();
    formData.append("images", croppedFile);

    try {
      const response = await api.post("/upload", formData);
      const imageUrl = response.data.files[0].url;

      setCenterDetails((prev) => ({
        ...prev,
        Image: imageUrl,
      }));

      setPreview(imageUrl);
      setShowCrop(false);
    } catch (error: any) {
      console.log("Error:", error.response?.data || error.message);
    }
  };

  const notify = (message: string) => {
    toast.success(message, { autoClose: 3000 });
  };

  const resetForm = () => {
    setCenterDetails(initialCenterDetails);
    setSelectedAdditionalServices([]);
    setSelectedValues([]);
    setSelectedSchool("");
    setPreview("assets/images/default.png");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    // Ensure service IDs are properly formatted as strings
    const servicesString = Array.isArray(selectedValues)
      ? selectedValues
          .map((id: any) => id.toString().trim())
          .filter((id) => id)
          .join(",")
      : "";

    const additionalServiceString = Array.isArray(selectedAdditionalServices)
      ? selectedAdditionalServices
          .map((id: any) => id.toString().trim())
          .filter((id) => id)
          .join(",")
      : "";

    const baseParameters = [
      { name: "Name", type: "VarChar", value: centerDetails.centerName },
      { name: "Image", type: "VarChar", value: centerDetails.Image || preview },
      {
        name: "DateOfEstablishment",
        type: "Date",
        value: centerDetails.dateOfEstablishment?.format("YYYY-MM-DD") || null,
      },
      { name: "Address", type: "VarChar", value: centerDetails.address },
      { name: "City", type: "VarChar", value: centerDetails.city },
      { name: "State", type: "Int", value: centerDetails.state },
      { name: "PinCode", type: "Int", value: centerDetails.pinCode },
      { name: "CountryID", type: "Int", value: centerDetails.country },
      {
        name: "InchargeName",
        type: "VarChar",
        value: centerDetails.inchargeName,
      },
      {
        name: "InchargeEmail",
        type: "VarChar",
        value: centerDetails.inchargeEmail,
      },
      { name: "Mobile", type: "VarChar", value: centerDetails.mobile },
      {
        name: "InchargePosition",
        type: "VarChar",
        value: centerDetails.inchargePosition,
      },
      {
        name: "SchoolID",
        type: "Int",
        value: centerDetails.SchoolName || null,
      },
      {
        name: "IManageThisCenter",
        type: "Bit",
        value: centerDetails.manageCenter ? 1 : 0,
      },
      {
        name: "ManageBy",
        type: "Int",
        value: centerDetails.manageCenter ? user : null,
      },
      {
        name: "MonthlyBillToCenterOwner",
        type: "Bit",
        value: centerDetails.monthlyBill ? 1 : 0,
      },
      { name: "CREATED_BY", type: "Int", value: user },
      { name: "ServiceID", type: "VarChar", value: servicesString },
      {
        name: "AddionalServiceID",
        type: "VarChar",
        value: additionalServiceString,
      },
    ];

    const parameters = isEdit
      ? [
          { name: "ID", type: "Int", value: resolvedIdNullable },
          ...baseParameters,
        ]
      : [
          {
            name: "SchoolName",
            type: "VarChar",
            value: centerDetails.schoolName,
          },
          ...baseParameters,
        ];

    try {
          setLoading(true)
      const procedureName = isEdit ? "CenterUpdate" : "CenterInsert";
      const res = await api.post("/api/mssql-procedure/execute", {
        procedureName,
        parameters,
      });
      if (res.data.success) {
        notify(
          isEdit ? "Center updated successfully" : "Center added successfully"
        );
        resetForm();
        navigate(all_routes.center);
      } else {
        notify(isEdit ? "Failed to update center" : "Failed to add center");
      }
    } catch (error) {
      console.log("Error processing center:", error);
      notify(
        "An error occurred while processing the center. Check the console for details."
      );
      setLoading(false)
    }
    finally{
      setLoading(false)
    }
  };

  return (
    <div className="page-wrapper">
      <div className="content content-two">
        <div className="card board-hover mb-3 mt-3">
          <h2 className="m-3 mb-1" style={{ marginLeft: "10px" }}>
            {isEdit ? "Edit" : "Add"} Center
          </h2>
          <div>
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-12">
                  <div className="card smoky-border">
                    <div className="card-body pb-1">
                      <h4 className="text-dark mt-0">Center Details</h4>
                      <div className="card-body">
                        <div className="settings-profile-upload">
                          <span
                            className="profile-pic"
                            onClick={handleClick}
                            style={{ cursor: "pointer" }}
                          >
                            <img
                              src={
                                centerDetails.Image
                                  ? centerDetails.Image
                                  : preview
                              }
                              alt="Profile"
                              style={{
                                width: "100px",
                                height: "100px",
                                objectFit: "cover",
                                borderRadius: "50%",
                                border: "2px solid #ccc",
                              }}
                            />
                            <div className="add-butn">+</div>
                            <input
                              type="file"
                              accept="image/*"
                              ref={fileInputRef}
                              onChange={handleFileChange}
                              style={{ display: "none" }}
                            />
                          </span>
                          {showCrop && selectedFile && (
                            <CropModal
                              file={selectedFile}
                              onCropComplete={uploadProfile}
                              onClose={() => setShowCrop(false)}
                            />
                          )}
                        </div>
                      </div>
                      <div className="row mt-2">
                        <div className="col-xxl col-xl-4 col-md-6">
                          {loader ? (
                            "Loading Schools...."
                          ) : (
                            <div className="mb-3">
                              <label className="form-label">
                                Choose Existing School (If Any)
                              </label>
                              <SelectExistingSchool
                                schools={schools}
                                defaultValue={
                                  (
                                    selectedSchool ||
                                    centerDetails.schoolName ||
                                    (schools?.find(
                                      (e: any) => e.id === singledata.SchoolID
                                    ) as any)
                                  )?.CenterName
                                }
                                handleChange={handleChange}
                              />
                            </div>
                          )}
                        </div>
                        <div className="col-xxl col-xl-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">School Name</label>
                            <input
                              type="text"
                              className="form-control"
                              disabled={!!selectedSchool}
                              style={{
                                cursor: selectedSchool ? "not-allowed" : "",
                              }}
                              name="schoolName"
                              value={
                                selectedSchool ||
                                centerDetails.schoolName ||
                                (
                                  schools?.find(
                                    (e: any) => e.id === singledata.SchoolID
                                  ) as any
                                )?.CenterName ||
                                ""
                              }
                              onChange={handleInputChange}
                              placeholder="Enter School Name"
                            />
                            {errors.schoolName && (
                              <span className="text-danger">
                                {errors.schoolName}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="col-xxl col-xl-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Center Name</label>
                            <input
                              type="text"
                              className="form-control"
                              name="centerName"
                              value={centerDetails.centerName}
                              defaultValue={
                                centerDetails.centerName || singledata.Center
                              }
                              onChange={handleInputChange}
                              placeholder="Enter Center Name"
                            />
                            {errors.centerName && (
                              <span className="text-danger">
                                {errors.centerName}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-xxl col-xl-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">
                              Date Of Establishment
                            </label>
                            <DatePicker
                              className="form-control"
                              format="DD-MM-YYYY"
                              placeholder="Select Date"
                              value={centerDetails.dateOfEstablishment}
                              onChange={handleDateChange}
                            />
                            {errors.dateOfEstablishment && (
                              <span className="text-danger">
                                {errors.dateOfEstablishment}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="col-xxl col-xl-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Services</label>
                            <SelectServices
                              selectedValues={selectedValues}
                              defaultValue={selectedValues}
                              handleInputChange={handleServiceSelectionChange}
                              services={services}
                              loading={loading}
                            />
                            {errors.services && (
                              <span className="text-danger">
                                {errors.services}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="col-xxl col-xl-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">
                              Additional Services
                            </label>
                            <SelectAddinalServices
                              additionalServices={selectedAdditionalServices}
                              handleAdditionalServices={handleAddinalService}
                              services={services}
                              loading={loading}
                            />
                            {errors.additionalServices && (
                              <span className="text-danger">
                                {errors.additionalServices}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-12">
                          <div className="mb-3">
                            <label className="form-label">Address</label>
                            <input
                              type="text"
                              className="form-control"
                              name="address"
                              value={centerDetails.address}
                              onChange={handleInputChange}
                              placeholder="Enter Address"
                            />
                            {errors.address && (
                              <span className="text-danger">
                                {errors.address}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-xxl col-xl-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">City</label>
                            <input
                              type="text"
                              className="form-control"
                              name="city"
                              value={singledata.City || centerDetails.city}
                              onChange={handleInputChange}
                              placeholder="Enter City"
                            />
                            {errors.city && (
                              <span className="text-danger">{errors.city}</span>
                            )}
                          </div>
                        </div>
                        <div className="col-xxl col-xl-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">State</label>
                            <Select
                              options={stateOptions}
                              defaultValue={stateOptions.find(
                                (option) => option.value === singledata.StateID
                              )}
                              value={stateOptions.find(
                                (option) => option.value === centerDetails.state
                              )}
                              onChange={handleStateSelectChange}
                              placeholder="Select State"
                              isSearchable
                            />
                            {errors.state && (
                              <span className="text-danger">
                                {errors.state}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="col-xxl col-xl-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Pin Code</label>
                            <input
                              type="number"
                              className="form-control"
                              name="pinCode"
                              maxLength={6}
                              value={centerDetails.pinCode}
                              defaultValue={
                                singledata.PinCode || centerDetails.pinCode
                              }
                              onChange={handleInputChange}
                              placeholder="Enter Pin Code"
                            />
                            {errors.pinCode && (
                              <span className="text-danger">
                                {errors.pinCode}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="col-xxl col-xl-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Country</label>
                            <Select
                              defaultValue={countryOptions.find(
                                (option) =>
                                  option.value === singledata.CountryID
                              )}
                              options={countryOptions}
                              value={countryOptions.find(
                                (country) =>
                                  country.value === centerDetails.country
                              )}
                              onChange={handleCountrySelectChange}
                              placeholder="Select Country"
                              isSearchable
                            />
                            {errors.country && (
                              <span className="text-danger">
                                {errors.country}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <hr style={{ border: "1px solid lightgrey" }} />
                      <div className="mt-7">
                        <div className="row">
                          <div className="col-xxl col-xl-6 col-md-6">
                            <div className="mb-3">
                              <label className="form-label">
                                Center Incharge Name
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                name="inchargeName"
                                disabled={
                                  singledata.InchargeName ? true : false
                                }
                                value={
                                  singledata.InchargeName ||
                                  centerDetails.inchargeName
                                }
                                onChange={handleInputChange}
                                placeholder="Enter Incharge Name"
                              />
                              {errors.inchargeName && (
                                <span className="text-danger">
                                  {errors.inchargeName}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="col-xxl col-xl-6 col-md-6">
                            <div className="mb-3">
                              <label className="form-label">
                                Center Incharge Email
                              </label>
                              <input
                                type="email"
                                disabled={
                                  singledata.InchargeEmail ? true : false
                                }
                                className="form-control"
                                name="inchargeEmail"
                                value={
                                  singledata.InchargeEmail ||
                                  centerDetails.inchargeEmail
                                }
                                onChange={handleInputChange}
                                placeholder="Enter Incharge Email"
                              />
                              {errors.inchargeEmail && (
                                <span className="text-danger">
                                  {errors.inchargeEmail}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-xxl col-xl-6 col-md-6">
                            <div className="mb-3">
                              <label className="form-label">
                                Center Incharge Mobile No.
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                disabled={singledata.Mobile ? true : false}
                                name="mobile"
                                value={
                                  centerDetails.mobile || singledata.Mobile
                                }
                                onChange={handleInputChange}
                                placeholder="Enter Mobile No."
                                maxLength={10}
                              />
                              {errors.mobile && (
                                <span className="text-danger">
                                  {errors.mobile}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="col-xxl col-xl-6 col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Position</label>
                              <input
                                type="text"
                                className="form-control"
                                name="inchargePosition"
                                disabled={singledata.InchargePosition}
                                value={
                                  singledata.InchargePosition ||
                                  centerDetails.inchargePosition
                                }
                                onChange={handleInputChange}
                                placeholder="Enter Position"
                              />
                              {errors.inchargePosition && (
                                <span className="text-danger">
                                  {errors.inchargePosition}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className=""
                        style={{
                          marginLeft: "10px",
                          gap: "25px",
                          alignItems: "center",
                          marginTop: "10px",
                          marginBottom: "5px",
                        }}
                      >
                        <div style={{ fontSize: "14px" }}>
                          <input
                            type="checkbox"
                            name="manageCenter"
                            checked={centerDetails.manageCenter}
                            onChange={handleCheckboxChange}
                          />
                          I manage this center
                        </div>
                        <div style={{ fontSize: "14px", marginRight: "20px" }}>
                          <input
                            type="checkbox"
                            name="monthlyBill"
                            checked={centerDetails.monthlyBill}
                            onChange={handleCheckboxChange}
                          />
                          Monthly Bill (if any like Live CCTV) To Center Owner *
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-12 d-flex justify-content-end">
                          <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary me-2"
                          >
                            Submit
                          </button>
                          <button type="button" className="btn btn-secondary">
                            <Link to={all_routes.center} className="text-white">
                              Cancel
                            </Link>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CenterAdd;
