import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Modal, Button, Form, Table, Row, Col, Spinner } from "react-bootstrap";
import { FaTrash, FaPlus, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import api from "../../core/data/api";
import { toast } from "react-toastify";
import "./TimelinePopup.css";

interface TimelinePopupProps {
  id: any;
  isOpen: boolean;
  onClose: () => void;
}

interface TimelineItem {
  ID: string;
  date: string;
  notes: string;
}

const TimelinePopup: React.FC<TimelinePopupProps> = ({ id, isOpen, onClose }) => {
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const user = localStorage.getItem("user");
  const [date, setDate] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Get today's date in YYYY-MM-DD format for the min attribute
  const today = useMemo(() => {
    return new Date().toISOString().split('T')[0];
  }, []);

  // Memoized pagination calculations
  const { currentRows, totalPages } = useMemo(() => {
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = timeline.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(timeline.length / rowsPerPage);
    
    return { currentRows, totalPages };
  }, [timeline, currentPage, rowsPerPage]);
      

  // Fetch timeline data
  const getAllReminders = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const res = await api.post("/api/mssql-procedure/execute", {
        procedureName: "spReminderGetALL",
        parameters: [
          { name: "Id", type: "Int", value: id?.id },

        ],
      });
      
      if (res.data.success) {
        setTimeline(res.data.record || []);
      }
    } catch (error: any) {
      console.log("Error fetching timeline:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Validate if selected date is today or in the future
  const isValidDate = (selectedDate: string): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time part for accurate comparison
    
    const selected = new Date(selectedDate);
    selected.setHours(0, 0, 0, 0);
    
    return selected >= today;
  };

  // Add new timeline item
  const handleAddUpdate = async () => {
    if (!date || !text.trim()) return;
    
    // Validate date is today or in the future
    if (!isValidDate(date)) {
      toast.error("Please select today's date or a future date");
      return;
    }
    
    try {
      setSubmitting(true);
      const parameters = [
        { name: "LeadId", type: "Int", value: id.id },
        { name: "date", type: "VarChar", value: date },
        { name: "notes", type: "VarChar", value: text },
        { name: "CREATED_BY", type: "Int", value: user },
        { name: "setTimer", type: "DateTime", value: null },
      ];
      
      const procedureName = "LeadsReminderCreate";
      const res = await api.post("/api/mssql-procedure/execute", {
        procedureName,
        parameters,
      });
      
      if (res.data) {
        toast.success("Timeline added successfully");
        setDate("");
        setText("");
        getAllReminders(); // refresh after insert
      }
    } catch (error: any) {
      console.log("Error adding timeline item:", error);
      toast.error("Failed to add timeline item");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete timeline item
  const handleDelete = async (itemId: string) => {
    try {
      const res = await api.post("/api/mssql-procedure/execute/", {
        procedureName: "ReminderDelete",
        parameters: [
          { name: "ID", type: "Int", value: itemId },
          { name: "MODIFIED_BY", type: "Int", value: user },
        ],
      });
      if (res.data.success) {
        toast.success("Reminder deleted successfully");
        setTimeline(prev => prev.filter(item => item.ID !== itemId));
        getAllReminders();
      }
    } catch (error) {
      console.log("Error deleting timeline item:", error);
      toast.error("Failed to delete timeline item");
    }
  };

  // Reset pagination when timeline changes
  useEffect(() => {
    if (timeline.length === 0) {
      setCurrentPage(1);
    } else if (currentPage > Math.ceil(timeline.length / rowsPerPage)) {
      setCurrentPage(Math.ceil(timeline.length / rowsPerPage));
    }
  }, [timeline, currentPage, rowsPerPage]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setCurrentPage(1);
      setDate("");
      setText("");
    }
  }, [isOpen]);

  // Load data when modal opens
  useEffect(() => {
    if (isOpen && id) {
      getAllReminders();
    }
  }, [isOpen, id, getAllReminders]);

  return (
    <Modal 
      show={isOpen} 
      onHide={onClose} 
      size="xl"
      centered 
      className="timeline-modal"
      dialogClassName="timeline-modal-dialog"
    >
      <Modal.Header closeButton className="timeline-modal-header">
        <Modal.Title style={{color:'white'}}>
          <i className="fas fa-history me-2"></i>
          Timeline for Lead #{id?.id}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="timeline-modal-body">
        <Row className="h-100">
          {/* Left side - Timeline table */}
          <Col xl={8} lg={8} md={8} className="timeline-column border-end-md">
            <h5 className="section-title">
              <i className="fas fa-list-ul me-2"></i>
              Timeline History
            </h5>
            
            {loading ? (
              <div className="text-center py-4">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2">Loading timeline...</p>
              </div>
            ) : (
              <>
                <div className="table-container">
                  <Table responsive striped hover className="timeline-table">
                    <thead>
                      <tr>
                        <th style={{ width: "25%" }}>Date</th>
                        <th style={{ width: "60%" }}>Notes</th>
                        <th style={{ width: "15%", textAlign: "center" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentRows.length > 0 ? (
                        currentRows.map((item) => (
                          <tr key={item.ID}>
                            <td className="timeline-date">
                              {new Date(item.date).toLocaleDateString()}
                            </td>
                            <td className="timeline-notes">{item.notes}</td>
                            <td className="text-center">
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleDelete(item.ID)}
                                aria-label="Delete"
                              >
                                <FaTrash />
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3} className="text-center py-4 text-muted">
                            <i className="fas fa-inbox fs-1 d-block mb-2"></i>
                            No timeline records found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>

                {/* Pagination controls - Only show if we have more than one page */}
                {timeline.length > rowsPerPage && (
                  <div className="d-flex justify-content-between align-items-center mt-3 px-2">
                    <Button
                      size="sm"
                      variant="outline-primary"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((prev) => prev - 1)}
                    >
                      <FaChevronLeft className="me-1" /> Previous
                    </Button>

                    <span className="text-muted">
                      Page {currentPage} of {totalPages}
                    </span>

                    <Button
                      size="sm"
                      variant="outline-primary"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((prev) => prev + 1)}
                    >
                      Next <FaChevronRight className="ms-1" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </Col>

          {/* Right side - Add update */}
          <Col xl={4} lg={4} md={4} className="update-column">
            <h5 className="section-title">
              <i className="fas fa-plus-circle me-2"></i>
              Add New Update
            </h5>
            
            <Form className="update-form">
              <Form.Group className="mb-3">
                <Form.Label>
                  <i className="fas fa-calendar-alt me-1"></i>
                  Date *
                </Form.Label>
                <Form.Control
                  type="date"
                  value={date}
                  min={today} // Restrict to today and future dates
                  onChange={(e) => setDate(e.target.value)}
                  className="form-control-lg"
                />
                <Form.Text className="text-muted">
                  Only today's date or future dates are allowed
                </Form.Text>
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>
                  <i className="fas fa-sticky-note me-1"></i>
                  Notes *
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter your notes here..."
                  className="form-control-lg"
                />
              </Form.Group>
              
              <Button
                variant="primary"
                onClick={handleAddUpdate}
                disabled={!date || !text.trim() || submitting}
                className="w-100 py-2"
              >
                {submitting ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Adding...
                  </>
                ) : (
                  <>
                    <FaPlus className="me-2" />
                    Add Update
                  </>
                )}
              </Button>
            </Form>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default TimelinePopup;