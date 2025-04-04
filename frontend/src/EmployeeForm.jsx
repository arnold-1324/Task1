import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./EmployeeForm.css"; // Add a custom CSS file for additional styling

const EmployeeForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    dateOfJoin: "",
    salary: "",
    gender: "",
    state: "",
    dateOfBirth: "",
    age: "",
  });

  const [states, setStates] = useState([]);
  const [filteredStates, setFilteredStates] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const indianStates = [
      "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
      "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
      "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
      "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim",
      "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",
      "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
      "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
    ];
    setStates(indianStates);
    setFilteredStates(indianStates);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "dateOfBirth") {
      calculateAge(value);
    }
  };

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      setFormData((prevData) => ({
        ...prevData,
        age: age - 1,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        age: age,
      }));
    }
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleStateSelect = (state) => {
    setFormData((prevData) => ({
      ...prevData,
      state: state,
    }));
    setShowDropdown(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <div className="form-container width-200">
      <h2 className="form-title">Employee Form</h2>
      <form onSubmit={handleSubmit} className="form-content">
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Designation:</label>
          <input
            type="text"
            name="designation"
            className="form-control"
            value={formData.designation}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Date of Join:</label>
          <input
            type="date"
            name="dateOfJoin"
            className="form-control"
            value={formData.dateOfJoin}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Salary:</label>
          <input
            type="number"
            name="salary"
            className="form-control"
            value={formData.salary}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Gender:</label>
          <select
            name="gender"
            className="form-select"
            value={formData.gender}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label>State:</label>
          <div className="dropdown-container">
            <button
              type="button"
              className="dropdown-toggle"
              onClick={toggleDropdown}
            >
              {formData.state || "Select State"} <span className="arrow-down">▼</span>
            </button>
            {showDropdown && (
              <ul className="dropdown-menu">
                {states.map((state, index) => (
                  <li
                    key={index}
                    className="dropdown-item"
                    onClick={() => handleStateSelect(state)}
                  >
                    {state}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="form-group">
          <label>Date of Birth:</label>
          <input
            type="date"
            name="dateOfBirth"
            className="form-control"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Age:</label>
          <input
            type="text"
            name="age"
            className="form-control"
            value={formData.age}
            readOnly
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default EmployeeForm;
