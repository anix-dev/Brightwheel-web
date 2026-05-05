import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { all_routes } from "../../feature-module/router/all_routes";
import api from "../../core/data/api";
import moment from "moment";
import { toast } from "react-toastify";
import { Modal, Form, Button } from "react-bootstrap";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "./attendence.css";
interface AttendanceRecord {
  ID: number;
  TeacherID: string;
  TeacherName: string;
  TeacherTag: string;
  TeacherNo: string;
  IsPresent: number;
  note: string;
  CREATED_DATE: string;
}

interface TableData {
  [key: string]: string | number | undefined;
  date: string;
  id: any;
  note: string;
}

type TimeRange = "week" | "month" | "year";

const TeacherDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [show, setShow] = useState(false);
  const [teacher, setTeacher] = useState<any>({});
  const [data, setData] = useState<TableData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalData, setModalData] = useState<{
    recordId: number;
    day: any;
    date: any;
    note: string;
  } | null>(null);
  const [modalStatus, setModalStatus] = useState("1");
  const [timeRange, setTimeRange] = useState<TimeRange>("year");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const user = localStorage.getItem("user");

  const getDateRange = (
    range: TimeRange
  ): { startDate: Date; endDate: Date } => {
    const currentDate = new Date(selectedDate);
    let startDate: Date, endDate: Date;

    if (range === "week") {
      const day = currentDate.getDay();
      const diffToMonday = day === 0 ? -6 : 1 - day;
      startDate = new Date(currentDate);
      startDate.setDate(currentDate.getDate() + diffToMonday);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      endDate.setHours(23, 59, 59, 999);
    } else if (range === "month") {
      startDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 3, // previous month
        1
      );
      endDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
      );
    } else {
      startDate = new Date(currentDate.getFullYear(), 0, 1);
      endDate = new Date(currentDate.getFullYear(), 11, 31);
    }
    return { startDate, endDate };
  };

  const transformToWeekView = (
    attendanceData: AttendanceRecord[],
    date: Date
  ): TableData[] => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);

    const groupedByTeacher = attendanceData.reduce((acc, item) => {
      if (!acc[item.TeacherID]) acc[item.TeacherID] = [];
      acc[item.TeacherID].push(item);
      return acc;
    }, {} as Record<string, AttendanceRecord[]>);

    const rows: TableData[] = Object.entries(groupedByTeacher).map(
      ([teacherId, records]) => {
        const firstRecord = records[0];
        const row: TableData = {
          id: teacherId,
          note: firstRecord.note || "",
          date: `${moment(startOfWeek).format("YYYY-MM-DD")} to ${moment(
            endOfWeek
          ).format("YYYY-MM-DD")}`,
          sunday: "week",
          monday: "holiday",
          tuesday: "holiday",
          wednesday: "holiday",
          thursday: "holiday",
          friday: "holiday",
          saturday: "week",
        };

        records.forEach((item) => {
          const itemDate = new Date(item.CREATED_DATE);
          if (itemDate >= startOfWeek && itemDate <= endOfWeek) {
            const day = itemDate
              .toLocaleString("en-US", { weekday: "long" })
              .toLowerCase();
            row[day] =
              item.IsPresent === 1
                ? "1"
                : item.IsPresent === 0
                ? "0"
                : "holiday";
            if (item.note) {
              row.note = item.note;
            }
          }
        });

        return row;
      }
    );

    return rows;
  };
  const transformToYearView = (
    attendanceData: AttendanceRecord[],
    date: Date
  ): TableData[] => {
    const groupedByTeacher = attendanceData.reduce((acc, item) => {
      if (!acc[item.TeacherID]) acc[item.TeacherID] = [];
      acc[item.TeacherID].push(item);
      return acc;
    }, {} as Record<string, AttendanceRecord[]>);

    const rows: TableData[] = Object.entries(groupedByTeacher).map(
      ([teacherId, records]) => {
        const firstRecord = records[0];
        const row: TableData = {
          id: teacherId,
          note: firstRecord.note || "",
          date: date.getFullYear().toString(),
          jan: "",
          feb: "",
          mar: "",
          apr: "",
          may: "",
          jun: "",
          jul: "",
          aug: "",
          sep: "",
          oct: "",
          nov: "",
          dec: "",
        };

        const monthlyStats: Record<
          string,
          { present: number; absent: number; total: number }
        > = {};

        // Initialize monthly stats
        const monthNames = [
          "jan",
          "feb",
          "mar",
          "apr",
          "may",
          "jun",
          "jul",
          "aug",
          "sep",
          "oct",
          "nov",
          "dec",
        ];
        monthNames.forEach((month) => {
          monthlyStats[month] = { present: 0, absent: 0, total: 0 };
        });

        records.forEach((item) => {
          const itemDate = new Date(item.CREATED_DATE);
          if (itemDate.getFullYear() === date.getFullYear()) {
            const monthIndex = itemDate.getMonth();
            const monthKey = monthNames[monthIndex];

            monthlyStats[monthKey].total++;
            if (item.IsPresent === 1) {
              monthlyStats[monthKey].present++;
            } else if (item.IsPresent === 0) {
              monthlyStats[monthKey].absent++;
            }

            if (item.note) {
              row.note = item.note;
            }
          }
        });

        monthNames.forEach((month) => {
          const stats = monthlyStats[month];
          if (stats.total > 0) {
            row[month] = `${stats.present}`;
          } else {
            row[month] = "0";
          }
        });

        return row;
      }
    );
    return rows;
  };
  const transformToMonthView = (
    attendanceData: AttendanceRecord[],
    date: Date
  ): TableData[] => {
    const currentMonth = date.getMonth(); // e.g., June = 5
    const currentYear = date.getFullYear();
    const monthsToShow = [2, 1, 0]; // offset from currentMonth
    const months: {
      month: number;
      year: number;
      label: string;
      days: number;
    }[] = monthsToShow.map((offset) => {
      const m = new Date(currentYear, currentMonth - offset, 1);
      const month = m.getMonth();
      const year = m.getFullYear();
      const days = new Date(year, month + 1, 0).getDate();
      return {
        month,
        year,
        label: moment(m).format("MMMM YYYY"),
        days,
      };
    });
    const groupedByTeacher = attendanceData.reduce((acc, item) => {
      if (!acc[item.TeacherID]) acc[item.TeacherID] = [];
      acc[item.TeacherID].push(item);
      return acc;
    }, {} as Record<string, AttendanceRecord[]>);
    const rows: TableData[] = [];
    Object.entries(groupedByTeacher).forEach(([teacherId, records]) => {
      months.forEach(({ month, year, label, days }, index) => {
        const row: TableData = {
          id: `${teacherId}`,
          note: "",
          date: label,
        };

        for (let i = 1; i <= days; i++) {
          row[`day${i}`] = "";
        }

        records.forEach((item) => {
          const itemDate = moment(item.CREATED_DATE).toDate();
          const itemMonth = itemDate.getMonth();
          const itemYear = itemDate.getFullYear();
          const itemDay = itemDate.getDate();
          if (itemMonth === month && itemYear === year) {
            const status =
              item.IsPresent === 1 ? "1" : item.IsPresent === 0 ? "0" : "2";
            row[`day${itemDay}`] = status;
            if (item.note) row.note = item.note;
          }
        });

        rows.push(row);
      });
    });
    return rows;
  };

  const getTeacherDetails = async (
    range: TimeRange,
    date: Date
  ): Promise<void> => {
    setLoading(true);
     const { startDate, endDate } = getDateRange(range);

    try {
      const start = moment(startDate).format("YYYY-MM-DD");
      const end = moment(endDate).format("YYYY-MM-DD");

      const res = await api.post("/api/mssql-procedure/execute", {
        procedureName: "TeacherAttendenceGetById",
        parameters: [
          { name: "TeacherID", type: "Int", value: id },
          { name: "StartDate", type: "VarChar", value: start },
          { name: "EndDate", type: "VarChar", value: end },
        ],
      });

      const raw: AttendanceRecord[] = res.data.record || [];
      let transformed: TableData[] = [];
      setTeacher(res.data.record[0]);
      switch (range) {
        case "week":
          transformed = transformToWeekView(raw, date);
          break;
        case "month":
          transformed = transformToMonthView(raw, date);
          break;
        case "year":
          transformed = transformToYearView(raw, date);
          break;
      }
      setData(transformed);
    } catch (error) {
      console.log("Failed to fetch attendance:", error);
      // const { startDate, endDate } = getDateRange(range);
      const emptyData = [
        {
          id: id,
          note: "",
          date:
            range === "week"
              ? `${moment(startDate).format("YYYY-MM-DD")} to ${moment(
                  endDate
                ).format("YYYY-MM-DD")}`
              : range === "month"
              ? moment(new Date()).format("MMMM YYYY")
              : startDate.getFullYear().toString(),
        },
      ];
      setData(emptyData);
    } finally {
      setLoading(false);
    }
  };

  const singleData = async () => {
    try {
      setLoading(true);
      const res = await api.post("/api/mssql-procedure/execute", {
        procedureName: "TeacherGetbyID",
        parameters: [{ name: "id", type: "Int", value: id }],
      });
      if (res.data.success) {
        const filteredCenters = res.data.record[0];
        setTeacher(filteredCenters);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };
  useEffect(() => {
    singleData();
  }, []);
  useEffect(() => {
    getTeacherDetails(timeRange, selectedDate);
  }, [timeRange, selectedDate, id]);

  const handleTimeRangeChange = (range: TimeRange): void => {
    setTimeRange(range);
    setSelectedDate(new Date());
  };
  const getStatusClass = (status: any): any => {
    if (timeRange === "year") {
      const [present, total] = status.split("/").map(Number);
      if (total === 0) return "bg-info";
      if (present === total) return "bg-success";
      if (present === 0) return "bg-danger";
      return "bg-grey"; // Mixed
    }
    if (status === "week") {
      return "bg-grey";
    } else {
      switch (status) {
        case "1":
          return "bg-success";
        case "0":
          return "bg-danger";
        default:
          return "bg-white";
      }
    }
  };
  const handleStatusUpdate = async (
    id: number,
    status: any,
    day: any,
    date: any
  ) => {
    try {
      const days = day;
      const dateString = date;
      const baseDate = moment(dateString, "MMMM YYYY");
      baseDate.date(days);
      const formattedDate = baseDate.format("YYYY/MM/DD");

      const res = await api.post("/api/mssql-procedure/execute", {
        procedureName: "TeacherAttendenceUpdate",
        parameters: [
          { name: "TeacherID", type: "Int", value: id },
          { name: "IsPresent", type: "Int", value: status },
          { name: "note", type: "VarChar", value: "" },
          { name: "CREATED_DATE", type: "VarChar", value: formattedDate },
          { name: "MODIFIED_BY", type: "Int", value: user },
        ],
      });

      if (res.data.success) {
        toast.success("Attendance updated successfully");
        setShow(false);
        setModalData(null);
        getTeacherDetails(timeRange, selectedDate);
      } else {
        throw new Error(res.data.message || "Update failed");
      }
    } catch (error) {
      console.log("Error updating attendance:", error);
      toast.error("Failed to update attendance");
    }
  };

  const renderWeekTable = (): JSX.Element => {
    const days = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];

    return (
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Date Range</th>
            {days.map((day) => (
              <th key={day}>{day.charAt(0).toUpperCase() + day.slice(1)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td>{row.date}</td>
              {days.map((day) => {
                const isWeekend = day === "sunday" || day === "saturday";

                const status =
                  (row[day] as string) || (isWeekend ? "week" : "");

                return (
                  <td key={day}>
                    <span
                      className={`attendance-range ${getStatusClass(status)}`}
                    ></span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };
  const renderMonthTable = (): JSX.Element => {
    const currYear = selectedDate.getFullYear();
    const currMonth = selectedDate.getMonth();
    const prevMonthDate = new Date(currYear, currMonth - 1, 1);

    const daysInCurrMonth = new Date(currYear, currMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(
      prevMonthDate.getFullYear(),
      prevMonthDate.getMonth() + 1,
      0
    ).getDate();

    return (
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Month</th>
              {Array.from({ length: 31 }, (_, i) => (
                <th key={i + 1}>{i + 1}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => {
              const monthName = row.date;
              const isPrevMonth =
                monthName === moment(prevMonthDate).format("MMMM YYYY");
              const totalDays = isPrevMonth ? daysInPrevMonth : daysInCurrMonth;
              return (
                <tr key={rowIndex}>
                  <td>{monthName}</td>
                  {Array.from({ length: 31 }, (_, i) => {
                    const day = i + 1;
                    // Only show data for days that exist in this month
                    if (day > totalDays) {
                      return <td key={day}></td>;
                    }

                    const weekday = new Date(
                      isPrevMonth ? prevMonthDate.getFullYear() : currYear,
                      isPrevMonth ? prevMonthDate.getMonth() : currMonth,
                      day
                    ).getDay();

                    let status = row[`day${day}`] || "";
                    if (weekday === 0 || weekday === 6) {
                      status = "week";
                    }

                    const statusClass = getStatusClass(status);
                    return (
                      <td key={day}>
                        {status === "week" ? (
                          <span className={`attendance-range ${statusClass}`} />
                        ) : (
                          <Link
                            className="dropdown-item p-0"
                            to="#"
                            onClick={() => {
                              setModalData({
                                recordId: row.id,
                                day,
                                date: row.date,
                                note: row.note || "",
                              });
                              setShow(true);
                              setModalStatus(status === "1" ? "1" : "0");
                            }}
                          >
                            <span
                              className={`attendance-range ${statusClass}`}
                            ></span>
                          </Link>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const renderYearTable = (): JSX.Element => {
    const months = [
      { key: "jan", label: "Jan" },
      { key: "feb", label: "Feb" },
      { key: "mar", label: "Mar" },
      { key: "apr", label: "Apr" },
      { key: "may", label: "May" },
      { key: "jun", label: "Jun" },
      { key: "jul", label: "Jul" },
      { key: "aug", label: "Aug" },
      { key: "sep", label: "Sep" },
      { key: "oct", label: "Oct" },
      { key: "nov", label: "Nov" },
      { key: "dec", label: "Dec" },
    ];

    return (
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Year</th>
            {months.map(({ label }) => (
              <th key={label}>{label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => {
            return (
              <tr key={index}>
                <td>{row.date}</td>
                {months.map(({ key }) => {
                  return (
                    <td
                      key={key}
                      onClick={() => {
                        if (timeRange === "year") {
                          handleTimeRangeChange("month");
                        }
                      }}
                      style={{
                        cursor: timeRange === "year" ? "pointer" : "default",
                      }}
                    >
                      <span style={{ color: "black", fontWeight: "bold" }}>
                        {row[key]}
                      </span>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };
  const renderTable = (): JSX.Element | null => {
    switch (timeRange) {
      case "week":
        return renderWeekTable();
      case "month":
        return renderMonthTable();
      case "year":
        return renderYearTable();
      default:
        return null;
    }
  };
  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="row">
          <div className="col-xxl-12 col-xl-12">
            <div className="row mb-4">
              <div className="col-12">
                <div className="card shadow-sm border-0">
                  <div className="card-header bg-white border-0 py-3">
                    <div className="d-flex align-items-center justify-content-between flex-wrap">
                      <div className="d-flex align-items-center">
                        <div className="flex-shrink-0 position-relative me-3">
                          <img
                            src={
                              teacher.Image
                                ? teacher.Image
                                : "assets/images/default.png"
                            }
                            alt="Teacher"
                            className="teacher-avatar rounded-circle border border-3 border-white shadow"
                            style={{
                              width: "60px",
                              height: "60px",
                              objectFit: "cover",
                            }}
                          />
                          <span
                            className="position-absolute bottom-0 end-0 bg-success rounded-circle border border-2 border-white"
                            style={{ width: "12px", height: "12px" }}
                          ></span>
                        </div>
                        <div>
                          <h5 className="mb-0 fw-semibold">
                            {teacher.TeacherName}
                          </h5>
                          <div className="d-flex flex-wrap align-items-center mt-1">
                            <small className="text-muted me-3">
                              <i className="fas fa-users-class me-1"></i>
                              Classes: {teacher.ClassName}
                            </small>
                            <small className="text-muted me-3">
                              <i className="fas fa-id-card me-1"></i> ID:{" "}
                              {teacher.TeacherID}
                            </small>
                            <small className="text-muted me-3">
                              <i className="fas fa-envelope me-1"></i>{" "}
                              {teacher.Email}
                            </small>
                            <small className="text-muted">
                              <i className="fas fa-book me-1"></i>{" "}
                              {teacher.Subjects}
                            </small>
                          </div>
                        </div>
                      </div>

                      <div className="d-flex align-items-center mt-2 mt-sm-0">
                        <div className="me-4 text-center">
                          <h6 className="mb-0 fw-semibold">
                            {teacher.AttendancePercentage || 0}%
                          </h6>
                          <small className="text-muted">Attendance</small>
                        </div>
                        <div className="text-center">
                          <h6 className="mb-0 fw-semibold">
                            {teacher.PresentCount || 0}/
                            {teacher.AbsentCount || 0}
                          </h6>
                          <small className="text-muted">Present/Absent</small>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card-body pt-0">
                    <div className="d-flex justify-content-between align-items-center flex-wrap mb-3">
                      <h4 className="mb-2 mb-md-0 fw-semibold d-flex align-items-center">
                        <i className="fas fa-calendar-check text-primary me-2"></i>
                        Teacher Attendance
                      </h4>
                      <div className="dropdown">
                        <button
                          className="btn btn-outline-primary dropdown-toggle d-flex align-items-center"
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <i className="fas fa-calendar-alt me-2"></i>
                          {timeRange === "month" ? "This Month" : "This Year"}
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end border-0 shadow-sm p-2">
                          <li>
                            <button
                              className="dropdown-item rounded d-flex align-items-center py-2"
                              onClick={() => handleTimeRangeChange("month")}
                            >
                              <i className="fas fa-calendar me-2 text-muted"></i>
                              This Month
                            </button>
                          </li>
                          <li>
                            <button
                              className="dropdown-item rounded d-flex align-items-center py-2"
                              onClick={() => handleTimeRangeChange("year")}
                            >
                              <i className="fas fa-calendar-alt me-2 text-muted"></i>
                              This Year
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <div className="mb-3">
                  <span className="badge bg-success me-2">Present</span>
                  <span className="badge bg-danger me-2">Absent</span>
                  <span className="badge bg-grey me-2">Weekends</span>
                  {/* <span className="badge bg-white">Holiday/No Data</span> */}
                </div>
                {loading ? (
                  <div className="text-center">
                    <div className="spinner-border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : (
                  renderTable()
                )}
              </div>
            </div>

            <Modal
              className="fade"
              id="edit-modal"
              show={show}
              onHide={() => setShow(false)}
              centered
            >
              <div className="modal-content border-0 shadow-lg rounded">
                <Modal.Header closeButton className="bg-primary text-white">
                  <Modal.Title className="h5 mb-0">
                    Edit Attendance - Day {modalData?.day}
                  </Modal.Title>
                </Modal.Header>

                <Form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (modalData) {
                      handleStatusUpdate(
                        modalData.recordId,
                        modalStatus,
                        modalData.day,
                        modalData.date
                      );
                    }
                  }}
                >
                  <Modal.Body>
                    <div className="mb-3">
                      <label className="form-label fw-semibold d-block mb-2">
                        Attendance Status
                      </label>
                      <div className="d-flex gap-4">
                        {["Present", "Absent"].map((status) => (
                          <label
                            className="form-check-label d-flex align-items-center gap-2"
                            key={status}
                          >
                            <input
                              type="radio"
                              className="form-check-input"
                              name="attendanceStatus"
                              value={status === "Present" ? "1" : "0"}
                              checked={
                                modalStatus ===
                                (status === "Present" ? "1" : "0")
                              }
                              onChange={(e) => setModalStatus(e.target.value)}
                            />
                            {status}
                          </label>
                        ))}
                      </div>
                    </div>
                  </Modal.Body>

                  <Modal.Footer className="d-flex justify-content-end gap-2">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setShow(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Save Changes
                    </button>
                  </Modal.Footer>
                </Form>
              </div>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDetail;
