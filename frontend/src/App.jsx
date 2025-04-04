import { useState } from 'react'
import EmployeeForm from './EmployeeForm.jsx';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      
      <EmployeeForm />
      
    </>
  )
}

export default App
