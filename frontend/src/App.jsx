import React, { useState } from "react";
import EmployeeForm from "./EmployeeForm.jsx";
import EmployeeGrid from "./EmployeeGrid.jsx";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshEmployees = () => {
    setRefreshTrigger((prev) => prev + 1); // Increment trigger to refresh EmployeeGrid
  };

  return (
    <div>
      <EmployeeForm refreshEmployees={refreshEmployees} />
      <EmployeeGrid refreshEmployeesTrigger={refreshTrigger} />
    </div>
  );
}

export default App;
