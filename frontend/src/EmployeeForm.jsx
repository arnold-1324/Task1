import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Dropdown, Form, Button } from "react-bootstrap";
import "./EmployeeForm.css";

const EmployeeForm = ({ addEmployee, refreshEmployees }) => {
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
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    const indianStates = [
      "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
      "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
      "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
      "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
      "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
      "Uttar Pradesh", "Uttarakhand", "West Bengal"
    ];
    setStates(indianStates);
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

  const handleStateSelect = (state) => {
    setFormData((prevData) => ({
      ...prevData,
      state: state,
    }));
  };

  const handleSubmit = async (e) => {
    debugger;
    e.preventDefault();

    const payload = {
      ...formData,
      salary: parseFloat(formData.salary).toFixed(2),
    };

    try {
      const response = await fetch("api/Employee", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
       // addEmployee(data.employees[0]); // Add the new employee to the grid
        refreshEmployees(); // Trigger the EmployeeGrid to refresh its data
        setFormData({
          name: "",
          designation: "",
          dateOfJoin: "",
          salary: "",
          gender: "",
          state: "",
          dateOfBirth: "",
          age: "",
        });
        setToastMessage({ type: "success", text: data.message });
      } else {
        setToastMessage({ type: "danger", text: data.message || "An error occurred." });
      }
    } catch (error) {
      setToastMessage({ type: "danger", text: "Failed to connect to the server." });
      console.error("Error:", error);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Employee Form</h2>
      {toastMessage && (
        <div
          className={`toast-container position-fixed top-0 end-0 p-3`}
          style={{ zIndex: 1055 }}
        >
          <div
            className={`toast align-items-center text-bg-${
              toastMessage.type === "success" ? "success" : "danger"
            } border-0 show`}
            role="alert"
          >
            <div className="d-flex">
              <div className="toast-body">{toastMessage.text}</div>
              <button
                type="button"
                className="btn-close btn-close-white me-2 m-auto"
                aria-label="Close"
                onClick={() => setToastMessage(null)}
              ></button>
            </div>
          </div>
        </div>
      )}
      <Form onSubmit={handleSubmit} className="form-content">
        <Form.Group className="form-group">
          <Form.Label>Name:</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Form.Group className="form-group">
          <Form.Label>Designation:</Form.Label>
          <Form.Control
            type="text"
            name="designation"
            value={formData.designation}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Form.Group className="form-group">
          <Form.Label>Date of Join:</Form.Label>
          <Form.Control
            type="date"
            name="dateOfJoin"
            value={formData.dateOfJoin}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Form.Group className="form-group">
          <Form.Label>Salary:</Form.Label>
          <Form.Control
            type="number"
            step="0.01"
            name="salary"
            value={formData.salary}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Form.Group className="form-group">
          <Form.Label>Gender:</Form.Label>
          <div>
            <Form.Check
              inline
              type="radio"
              label="Male"
              name="gender"
              value="Male"
              checked={formData.gender === "Male"}
              onChange={handleInputChange}
              required
            />
            <Form.Check
              inline
              type="radio"
              label="Female"
              name="gender"
              value="Female"
              checked={formData.gender === "Female"}
              onChange={handleInputChange}
              required
            />
            <Form.Check
              inline
              type="radio"
              label="Other"
              name="gender"
              value="Other"
              checked={formData.gender === "Other"}
              onChange={handleInputChange}
              required
            />
          </div>
        </Form.Group>
        <Form.Group className="form-group">
          <Form.Label>State:</Form.Label>
          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic" style={{ width: "100%", color: "black" }}>
              {formData.state || "Select State"}
            </Dropdown.Toggle>
            <Dropdown.Menu style={{ width: "100%" }}>
              {states.map((state, index) => (
                <Dropdown.Item
                  key={index}
                  onClick={() => handleStateSelect(state)}
                >
                  {state}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Form.Group>
        <Form.Group className="form-group">
          <Form.Label>Date of Birth:</Form.Label>
          <Form.Control
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Form.Group className="form-group">
          <Form.Label>Age:</Form.Label>
          <Form.Control
            type="text"
            name="age"
            value={formData.age}
            readOnly
          />
        </Form.Group>
        <Button type="submit" variant="primary" className="btn btn-primary">
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default EmployeeForm;
