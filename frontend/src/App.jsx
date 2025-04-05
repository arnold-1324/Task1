import React, { useState } from "react";
import EmployeeForm from "./EmployeeForm.jsx";
import EmployeeGrid from "./EmployeeGrid.jsx";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const refreshEmployees = () => {
    setRefreshTrigger((prev) => prev + 1); // Increment trigger to refresh EmployeeGrid
  };

  const handleEmployeeSelect = (employee) => {
    setSelectedEmployee(employee);
  };

  return (
    <div>
      <EmployeeForm 
        refreshEmployees={refreshEmployees} 
        selectedEmployee={selectedEmployee}
        setSelectedEmployee={setSelectedEmployee}
      />
      <EmployeeGrid 
        refreshEmployeesTrigger={refreshTrigger} 
        onEmployeeSelect={handleEmployeeSelect}
      />
    </div>
  );
}

export default App;
