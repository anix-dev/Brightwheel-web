import React from 'react';

const CenterModels = () => {
    return (
        <>
            <div className="modal fade" id="add_teacher_collect" aria-labelledby="addTeacherModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <div className="d-flex align-items-center">
                                <h4 className="modal-title" id="addTeacherModalLabel">Add Teacher Details</h4>
                            </div>
                            <button
                                type="button"
                                className="btn-close custom-btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            >
                                <i className="ti ti-x" />
                            </button>
                        </div>
                        <div className="modal-body">
                            {/* Add your form inputs for teacher details here */}
                            <form>
                                <div className="row">

                                    {/* Choose Class Dropdown */}
                                    <div className="col-lg-6">
                                        <div className="mb-3">
                                            <label className="form-label">Choose Class to Add Teacher To *</label>
                                            <select className="form-select">
                                                <option>Select Class</option>
                                                <option value="pre-school-lkg">Pre-School LKG</option>
                                                <option value="pre-school-nursery">Pre-School Nursery</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Name of Teacher */}
                                    <div className="col-lg-6">
                                        <div className="mb-3">
                                            <label className="form-label">Name of Teacher *</label>
                                            <input type="text" className="form-control" placeholder="Enter Teacher's Name" />
                                        </div>
                                    </div>

                                    {/* Date of Joining */}
                                    <div className="col-lg-6">
                                        <div className="mb-3">
                                            <label className="form-label">Date of Joining (dd-mm-yyyy) *</label>
                                            <input type="date" className="form-control" placeholder="Enter Date of Joining" />
                                        </div>
                                    </div>

                                    {/* Mobile Number of Teacher */}
                                    <div className="col-lg-6">
                                        <div className="mb-3">
                                            <label className="form-label">Mobile Number of Teacher *</label>
                                            <input type="tel" className="form-control" placeholder="Enter Mobile Number" />
                                        </div>
                                    </div>

                                    {/* Mobile Number for User (Teacher) */}
                                    <div className="col-lg-6">
                                        <div className="mb-3">
                                            <label className="form-label">Mobile Number for User (Teacher)</label>
                                            <input type="tel" className="form-control" placeholder="Enter User Mobile Number" />
                                        </div>
                                    </div>

                                    {/* Choose Learning Level */}
                                    <div className="col-lg-6">
                                        <div className="mb-3">
                                            <label className="form-label">Choose Learning Level (For Teach Module)</label>
                                            <select className="form-select">
                                                <option>Select Learning Level</option>
                                                <option value="beginner">Beginner</option>
                                                <option value="intermediate">Intermediate</option>
                                                <option value="advanced">Advanced</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Gender Dropdown */}
                                    <div className="col-lg-6">
                                        <div className="mb-3">
                                            <label className="form-label">Gender *</label>
                                            <select className="form-select">
                                                <option>Select Gender</option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Email of Teacher */}
                                    <div className="col-lg-6">
                                        <div className="mb-3">
                                            <label className="form-label">Email of Teacher *</label>
                                            <input type="email" className="form-control" placeholder="Enter Teacher's Email" />
                                        </div>
                                    </div>

                                    {/* Date of Birth of Teacher */}
                                    <div className="col-lg-6">
                                        <div className="mb-3">
                                            <label className="form-label">Date of Birth of Teacher (mm/dd/yyyy) *</label>
                                            <input type="date" className="form-control" placeholder="Enter Date of Birth" />
                                        </div>
                                    </div>

                                    {/* Choose Subjects */}
                                    <div className="col-lg-12">
                                        <div className="mb-3">
                                            <label className="form-label">Choose Subjects *</label>
                                            <select className="form-select">
                                                <option value="math">Math</option>
                                                <option value="science">Science</option>
                                                <option value="english">English</option>
                                                <option value="history">History</option>
                                                <option value="geography">Geography</option>
                                            </select>
                                        </div>
                                    </div>


                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary">Add Teacher</button>
                        </div>
                    </div>
                </div>
            </div>

            <>
                <div className="modal fade" id="add_user_modal" aria-labelledby="addUserModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title" id="addUserModalLabel">Add Single User</h4>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                />
                            </div>
                            <div className="modal-body">
                                {/* User Details Form */}
                                <form>
                                    <div className="row">
                                        {/* Enrollment Number */}
                                        <div className="col-lg-6">
                                            <div className="mb-3">
                                                <label className="form-label">Enrollment Number *</label>
                                                <input type="text" className="form-control" placeholder="Enter Enrollment Number" required />
                                                <small className="text-danger">Enrollment Number is Required</small>
                                            </div>
                                        </div>

                                        {/* Choose Class to Add Users */}
                                        <div className="col-lg-6">
                                            <div className="mb-3">
                                                <label className="form-label">Choose Class to Add Users *</label>
                                                <select className="form-select" required>
                                                    <option>Select Class</option>
                                                    <option value="class1">Class 1</option>
                                                    <option value="class2">Class 2</option>
                                                </select>
                                            </div>
                                        </div>

                                      

                                        {/* Student Name */}
                                        <div className="col-lg-6">
                                            <div className="mb-3">
                                                <label className="form-label">Student Name *</label>
                                                <input type="text" className="form-control" placeholder="Enter Student Name" required />
                                                <small className="text-danger">Student Name is Required</small>
                                            </div>
                                        </div>

                                        {/* Gender */}
                                        <div className="col-lg-6">
                                            <div className="mb-3">
                                                <label className="form-label">Gender *</label>
                                                <select className="form-select" required>
                                                    <option>Select Gender</option>
                                                    <option value="male">Male</option>
                                                    <option value="female">Female</option>
                                                    <option value="other">Other</option>
                                                </select>
                                                <small className="text-danger">Please select student gender</small>
                                            </div>
                                        </div>

                                        {/* Date of Birth */}
                                        <div className="col-lg-6">
                                            <div className="mb-3">
                                                <label className="form-label">Date Of Birth *</label>
                                                <input type="date" className="form-control" required />
                                                <small className="text-danger">Please select DOB</small>
                                            </div>
                                        </div>

                                        {/* Student Mobile */}
                                        <div className="col-lg-6">
                                            <div className="mb-3">
                                                <label className="form-label">Student Mobile </label>
                                                <input type="tel" className="form-control" placeholder="Enter Student Mobile Number" />
                                            </div>
                                        </div>

                                        {/* Student Email */}
                                        <div className="col-lg-6">
                                            <div className="mb-3">
                                                <label className="form-label">Student Email</label>
                                                <input type="email" className="form-control" placeholder="Enter Student Email" />
                                            </div>
                                        </div>

                                        {/* Mother Name */}
                                        <div className="col-lg-6">
                                            <div className="mb-3">
                                                <label className="form-label">Mother Name *</label>
                                                <input type="text" className="form-control" placeholder="Enter Mother's Name" required />
                                                <small className="text-danger">Mother Name is Required</small>
                                            </div>
                                        </div>

                                        {/* Mother Mobile Numbers */}
                                        <div className="col-lg-6">
                                            <div className="mb-3">
                                                <label className="form-label">Mother Mobile Numbers  *</label>
                                                <input type="tel" className="form-control" placeholder="Enter Mother's Mobile Number" required />
                                                <small className="text-danger">Mother Mobile Number is Required</small>
                                            </div>
                                        </div>

                                        {/* Mother Email Id */}
                                        <div className="col-lg-6">
                                            <div className="mb-3">
                                                <label className="form-label">Mother Email Id *</label>
                                                <input type="email" className="form-control" placeholder="Enter Mother's Email" required />
                                                <small className="text-danger">Mother Email Id is Required</small>
                                            </div>
                                        </div>

                                        {/* Father Name */}
                                        <div className="col-lg-6">
                                            <div className="mb-3">
                                                <label className="form-label">Father Name</label>
                                                <input type="text" className="form-control" placeholder="Enter Father's Name" />
                                            </div>
                                        </div>

                                        {/* Father Mobile Numbers */}
                                        <div className="col-lg-6">
                                            <div className="mb-3">
                                                <label className="form-label">Father Mobile Numbers</label>
                                                <input type="tel" className="form-control" placeholder="Enter Father's Mobile Number" />
                                            </div>
                                        </div>

                                        {/* Father Email Id */}
                                        <div className="col-lg-6">
                                            <div className="mb-3">
                                                <label className="form-label">Father Email Id</label>
                                                <input type="email" className="form-control" placeholder="Enter Father's Email" />
                                            </div>
                                        </div>

                                        {/* Instruction */}
                                        <div className="col-lg-12">
                                            <p className="text-muted">
                                                * Mobile Number should be as Country Code + Mobile (Example - 919876543210)<br />
                                                * Account password would be student first name(first letter capital) followed by year of birth. Ex: - for student Nitin Gupta with year of birth 2015 password would be Nitin2015.<br />
                                                * Email Id is must for one parent (mother), Father details will be added only if father email id provided.
                                            </p>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary">Add Single User</button>
                            </div>
                        </div>
                    </div>
                </div>
            </>

            <div className="modal fade" id="add_remove_class_modal"

                aria-labelledby="addRemoveClassModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-lg" >
                    <div className="modal-content" style={{ backgroundColor: "white" }}  >
                        <div className="modal-header" >
                            <h4 className="modal-title" id="addRemoveClassModalLabel">Add / Remove Class</h4>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            />
                        </div>
                        <div className="modal-body">
                            {/* Add or Remove Class Form */}
                            <form >
                                <div style={{
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)', // Stronger shadow for more visibility
                                    padding: "20px", // Increased padding for better visual effect
                                    backgroundColor: "white",
                                    borderRadius: "8px", // Rounded corners to complement shadow
                                    marginTop: "20px" // Space above to let shadow be visible
                                }}>
                                    {/* Choose School Segment */}
                                    <div className="col-lg-12" >
                                        <div className="mb-3">
                                            <label className="form-label">Choose School Segment *</label>
                                            <select className="form-select" required>
                                                <option>Select School Segment</option>
                                                <option value="preschool">Preschool</option>
                                                <option value="primary">Primary School</option>
                                                <option value="secondary">Secondary School</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Class Name */}
                                    <div className="col-lg-12">
                                        <div className="mb-3">
                                            <label className="form-label">Class Name (Class & Section) *</label>
                                            <input type="text" className="form-control" placeholder="Enter Class Name and Section" required />
                                        </div>
                                        <button type="button" className="btn btn-primary">Add Class</button>

                                    </div>

                                </div>
                                <div className="col " style={{ justifyContent: "space-between" }}>

                                    {/* Choose Class to Remove */}
                                    <div className="col-lg-12"
                                        style={{
                                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)', // Stronger shadow for more visibility
                                            padding: "20px", // Increased padding for better visual effect
                                            backgroundColor: "white",
                                            borderRadius: "8px", // Rounded corners to complement shadow
                                            marginTop: "10px" // Space above to let shadow be visible
                                        }}
                                    >
                                        <div className="mb-3">
                                            <label className="form-label">Choose Class to Remove *</label>
                                            <select className="form-select" required>
                                                <option>Select Class to Remove</option>
                                                <option value="toddlers">Toddlers</option>
                                                <option value="nursery">Nursery</option>
                                                <option value="lkg">LKG</option>
                                                <option value="ukg">UKG</option>
                                                <option value="toddlers_cam">Toddlers Cam Class</option>
                                                <option value="nursery_cam">Nursery Cam Class</option>
                                                <option value="lkg_cam">LKG Cam Class</option>
                                                <option value="ukg_cam">UKG Cam Class</option>
                                            </select>
                                        </div>
                                        <div className="col-lg-12">
                                            <div className="mb-3">
                                                <label className="form-label">Class Name (Class & Section) *</label>
                                                <input type="text" className="form-control" placeholder="Enter Class Name and Section" required />
                                            </div>
                                        </div>
                                        <button type="button" style={{ backgroundColor: "red" }} className="btn btn-primary">Remove Class</button>
                                    </div>
                                    <div className="col-lg-12"

                                        style={{
                                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)', // Stronger shadow for more visibility
                                            padding: "20px", // Increased padding for better visual effect
                                            backgroundColor: "white",

                                            borderRadius: "8px", // Rounded corners to complement shadow
                                            marginTop: "10px" // Space above to let shadow be visible
                                        }}
                                    >
                                        <div className="mb-3">
                                            <label className="form-label">Change Class Name</label>
                                            <select className="form-select" required>
                                                <option>Select Class to Remove</option>
                                                <option value="toddlers">Toddlers</option>
                                                <option value="nursery">Nursery</option>
                                                <option value="lkg">LKG</option>
                                                <option value="ukg">UKG</option>
                                                <option value="toddlers_cam">Toddlers Cam Class</option>
                                                <option value="nursery_cam">Nursery Cam Class</option>
                                                <option value="lkg_cam">LKG Cam Class</option>
                                                <option value="ukg_cam">UKG Cam Class</option>
                                            </select>
                                        </div>
                                        <div className="col-lg-12">
                                            <div className="mb-3">
                                                <label className="form-label">New Class Name  *</label>
                                                <input type="text" className="form-control" placeholder="Enter Class Name and Section" required />
                                            </div>
                                        </div>
                                        <button type="button" className="btn btn-primary">Change Class Name</button>
                                    </div>


                                </div>
                            </form>
                        </div>

                    </div>

                </div>
            </div>
        </>

    );
};

export default CenterModels;
