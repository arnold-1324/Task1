import React, { useState, useEffect } from "react";
import { PDFDownloadLink, Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";
import JsBarcode from "jsbarcode";
import { Modal } from "react-bootstrap";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./EmployeeGrid.css";

ChartJS.register(ArcElement, Tooltip, Legend);

const EmployeeGrid = ({ refreshEmployeesTrigger }) => {
  const [employees, setEmployees] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'asc'
  });
  const [downloading, setDownloading] = useState(false);
  const [showSalaryChart, setShowSalaryChart] = useState(false);

  const fetchEmployees = () => {
    fetch("api/Employee/GetAllEmployeesInfo")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch employee data.");
        }
        return response.json();
      })
      .then((data) => {
        setEmployees(data || []);
        setToastMessage({ type: "success", text: "Employees loaded successfully!" });
      })
      .catch((error) => {
        console.error("Error fetching employees:", error);
        setToastMessage({ type: "danger", text: "Failed to fetch employee data." });
      });
  };

  useEffect(() => {
    fetchEmployees();
  }, [refreshEmployeesTrigger]);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`api/Employee/${id}`, { method: "DELETE" });
      if (response.ok) {
        setEmployees((prevEmployees) => prevEmployees.filter((employee) => employee.id !== id));
        setToastMessage({ type: "success", text: "Employee deleted successfully!" });
      } else {
        setToastMessage({ type: "danger", text: "Failed to delete employee." });
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
      setToastMessage({ type: "danger", text: "Failed to delete employee." });
    }
  };

  const generateBarcode = (id) => {
    const canvas = document.createElement("canvas");
    JsBarcode(canvas, id.toString(), { format: "CODE128" });
    return canvas.toDataURL("image/png");
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sortedEmployees = [...employees].sort((a, b) => {
      if (key === 'dateOfBirth' || key === 'dateOfJoin') {
        return direction === 'asc' 
          ? new Date(a[key]) - new Date(b[key])
          : new Date(b[key]) - new Date(a[key]);
      }
      
      if (direction === 'asc') {
        return a[key] < b[key] ? -1 : 1;
      } else {
        return a[key] > b[key] ? -1 : 1;
      }
    });

    setEmployees(sortedEmployees);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
    }
    return '';
  };

  const handleExportClick = () => {
    setDownloading(true);
    setTimeout(() => setDownloading(false), 2000);
  };

  const prepareSalaryData = () => {
    const salaryRanges = {
      '0-25k': 0,
      '25k-50k': 0,
      '50k-75k': 0,
      '75k-100k': 0,
      '100k+': 0
    };

    employees.forEach(emp => {
      const salary = emp.salary;
      if (salary <= 25000) salaryRanges['0-25k']++;
      else if (salary <= 50000) salaryRanges['25k-50k']++;
      else if (salary <= 75000) salaryRanges['50k-75k']++;
      else if (salary <= 100000) salaryRanges['75k-100k']++;
      else salaryRanges['100k+']++;
    });

    return {
      labels: Object.keys(salaryRanges),
      datasets: [
        {
          data: Object.values(salaryRanges),
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF'
          ],
        },
      ],
    };
  };

  const styles = StyleSheet.create({
    page: {
      flexDirection: "column",
      alignItems: "center",
      padding: 10,
      backgroundColor: "#f5f5f5",
    },
    idCard: {
      width: "90%",
      borderRadius: 10,
      padding: 15,
      backgroundColor: "#ffffff",
      border: "2px solid #000",
      alignItems: "center",
    },
    companyLogo: {
      width: 120,
      height: 10,
      marginBottom: 10,
    },
    header: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#333",
      marginBottom: 10,
    },
    section: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 5,
    },
    label: {
      fontSize: 12,
      fontWeight: "bold",
      color: "#555",
      flex: 1,
    },
    value: {
      fontSize: 12,
      flex: 2,
      textAlign: "right",
      color: "#222",
    },
    imageContainer: {
      alignItems: "center",
      marginBottom: 5,
    },
    employeeImage: {
      width: 100,
      height: 100,
      borderRadius: 50,
      border: "2px solid #000",
    },
    barcode: {
      width: 120,
      height: 40,
      marginTop: 10,
    },
    footer: {
      marginTop: 15,
      fontSize: 10,
      color: "#777",
      textAlign: "center",
    },
    table: {
      display: "table",
      width: "100%",
      borderStyle: "solid",
      borderWidth: 1,
      borderColor: "#bfbfbf",
    },
    tableRow: {
      flexDirection: "row",
    },
    tableHeader: {
      backgroundColor: "#f0f0f0",
      fontWeight: "bold",
    },
    tableCell: {
      width: "12.5%",
      padding: 5,
      borderStyle: "solid",
      borderWidth: 1,
      borderColor: "#bfbfbf",
      fontSize: 8,
    },
  });

  const EmployeePDF = ({ employee }) => {
    const barcode = generateBarcode(employee.id);
    const companyLogo = "data:image/png;base64,..."; // Keep default company logo for now
    const employeeImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAM1BMVEXk5ueutLeqsbTn6eqpr7PJzc/j5ebf4eLZ3N2wtrnBxsjN0NLGysy6v8HT1tissra8wMNxTKO9AAAFDklEQVR4nO2d2bLbIAxAbYE3sDH//7WFbPfexG4MiCAcnWmnrzkjIRaD2jQMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMw5wQkHJczewxZh2lhNK/CBOQo1n0JIT74/H/qMV0Z7GU3aCcVPuEE1XDCtVLAhgtpme7H0s1N1U7QjO0L8F7llzGeh1hEG/8Lo7TUmmuSrOfns9xnGXpXxsONPpA/B6OqqstjC6Ax/0ujkNdYQQbKNi2k64qiiEZ+ohi35X+2YcZw/WujmslYewiAliVYrxgJYrdwUmwXsU+RdApUi83oNIE27YvrfB/ZPg8+BJETXnqh9CVzBbTQHgojgiCvtqU9thFJg/CKz3VIMKMEkIXxIWqIpIg2SkjYj+xC816mrJae2aiWGykxRNsW0UwiJghJDljYI5CD8GRiCtIsJxizYUPQ2pzItZy5pcisTRdk/a9m4amtNNfBuQkdVhSaYqfpNTSFGfb9GRIakrE2Pm+GFLaCQPqiu0OpWP+HMPQQcgQMiQprWXNmsVwIjQjYi/ZrhAqNTCgr2gu0Jnz85RSSjso0HkMFZ0YZjKkc26a/jlmh9JiDyDxi9oeorTYAzZkwwoMz19pzj9bnH/GP/+qbchjSGflneWYhtTuKdMOmNKZcJ5TjInQKcYXnESd/jQxy0ENpULTNGOGgxpap/oyw9pbUAqhfx2Dbkhovvfgz4iUzoM9+GlK6/Mh4q29hyC1mwro30hpVVLPF9wYQr71RazOeM5/cw81iBRD+A03aM9/C/obbrKjbYSpCmIVG3qT/Q8oeUo3Rz0IL7vI1tEbCB9pSiu8I/aV8x3Kg/BGWrWp4ZVs0nZfmAoEG4h/61yHYIJiFSl6Q0Vk6tTW1N8kYp8hdOkfHYYMXd2Qft+8CYwqYDSKvqIh+MCF8Wgca2u/cwdgeW3TtuVn6+1oBs3yLo5C2JpK6CvQzGpfUkz9UG/87gCsi5o2LIXolxN0FbwAsjOLEr+YJmXn7iR6N0BCt5p5cMxm7eAsfS+/CACQf4CTpKjzgkvr2cVarVTf96372yut7XLJ1sa7lv6VcfgYrWaxqr3Wlo1S6pvStr22sxOtTNPLzdY3nj20bPP+ejFdJYkLsjGLdtPBEbe/mr2bQKiXWJDroA+vtzc0p9aahuwqHMDYrQEXHEw9jwQl3drMpts9JBU1SdktPe5FBRdJQ6bwXBpa57ib2A8kukQDzMjh++Uo7Fo6Wd02Pkf4fknqoo4HtvAIjsqUcjx6DIPgWCaOML9rKI/oqD9/lgNrn+eF+p7j8tnzHBiR7+kdUGw/+V1Kzkc75mMy6U+FMaxjPibiM1U1uGM+puInHpmALZCgP4pt7i840MV8+0R1zPsRB6UTcqpizncYwZ89syDydfyWCwXB1l8/zRNGWbTG/GHKUm9AkxHMc/EGSk3z2+ArEhPEV5TUBLEvUGFcjEUH80J/jveTGOAJEljJbILWGQT3zRYiwuKsUXN1EEJAzBhRJFll7mBUG7KD8EqPkKekBREaL8hMDZLQSG6AQjtHPYmvTQnX0TtpC1SYCe2YdkkyLP3jj5BSbKiuR585eQhTgoje6yIb0Yb0C+mV6EYvebqw5SDy2WmubogZiF2AVxPC2FpDf8H2Q9QWo6IkjUxTWVEI3WY/wrCeSuqJ+eRWzXR/JXwgVjUMozbCOfoEZiSiKVGepqv5CJ8RyR4D7xBeamqa7z3BJ/z17JxuBPdv93d/a2Ki878MMAzDMAzDMAzDMAzDMF/KP09VUmxBAiI3AAAAAElFTkSuQmCC"; // Default avatar image

    return (
      <Document>
        <Page size="A6" style={styles.page}>
          <View style={styles.idCard}>
            <Image style={styles.companyLogo} src={companyLogo} />
            <Text style={styles.header}>EMPLOYEE ID CARD</Text>
            <View style={styles.imageContainer}>
              <Image style={styles.employeeImage} src={employeeImage} />
            </View>
            <View style={styles.section}>
              <Text style={styles.label}>Name:</Text>
              <Text style={styles.value}>{employee.name}</Text>
            </View>
            <View style={styles.section}>
              <Text style={styles.label}>Employee ID:</Text>
              <Text style={styles.value}>{employee.id}</Text>
            </View>
            <View style={styles.section}>
              <Text style={styles.label}>Designation:</Text>
              <Text style={styles.value}>{employee.designation}</Text>
            </View>
            <View style={styles.section}>
              <Text style={styles.label}>Gender:</Text>
              <Text style={styles.value}>{employee.gender}</Text>
            </View>
            <View style={styles.section}>
              <Text style={styles.label}>Date of Birth:</Text>
              <Text style={styles.value}>{new Date(employee.dateOfBirth).toLocaleDateString()}</Text>
            </View>
            <View style={styles.section}>
              <Text style={styles.label}>Date of Join:</Text>
              <Text style={styles.value}>{new Date(employee.dateOfJoin).toLocaleDateString()}</Text>
            </View>
            <Image style={styles.barcode} src={barcode} />
            <Text style={styles.footer}>Authorized Signature</Text>
          </View>
        </Page>
      </Document>
    );
  };

  const EmployeeListPDF = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={{ fontSize: 16, marginBottom: 10, textAlign: "center" }}>Employee List</Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCell}>Name</Text>
            <Text style={styles.tableCell}>Gender</Text>
            <Text style={styles.tableCell}>Designation</Text>
            <Text style={styles.tableCell}>State</Text>
            <Text style={styles.tableCell}>Date of Birth</Text>
            <Text style={styles.tableCell}>Date of Join</Text>
            <Text style={styles.tableCell}>Salary</Text>
            <Text style={styles.tableCell}>Age</Text>
          </View>
          {employees.map((employee) => (
            <View key={employee.id} style={styles.tableRow}>
              <Text style={styles.tableCell}>{employee.name}</Text>
              <Text style={styles.tableCell}>{employee.gender}</Text>
              <Text style={styles.tableCell}>{employee.designation}</Text>
              <Text style={styles.tableCell}>{employee.state}</Text>
              <Text style={styles.tableCell}>
                {new Date(employee.dateOfBirth).toLocaleDateString()}
              </Text>
              <Text style={styles.tableCell}>
                {new Date(employee.dateOfJoin).toLocaleDateString()}
              </Text>
              <Text style={styles.tableCell}>{employee.salary.toFixed(2)}</Text>
              <Text style={styles.tableCell}>{employee.age}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );

  return (
    <div className="employee-grid-container">
      <div className="container mb-3">
        {/* First Row: Title */}
        <div className="row mb-2">
          <div className="col">
            <h2 className="grid-title">Employee Details</h2>
          </div>
        </div>

        {/* Second Row: Buttons aligned right */}
        <div className="row">
          <div className="col text-end">
            <button
              className="btn btn-info salary-chart-btn me-2 "
              style={{width:"170px"}}
              onClick={() => setShowSalaryChart(true)}
            >
              <i className="bi bi-pie-chart-fill me-2"></i>
              Salary Distribution
            </button>
            <PDFDownloadLink
              document={<EmployeeListPDF />}
              fileName="Employee_List.pdf"
              className={`btn btn-success export-btn ${downloading ? 'downloading' : ''}`}
              onClick={handleExportClick}
            >
              {({ loading }) => (
                <>
                  <i className="bi bi-cloud-download me-2"></i>
                  {loading ? "Generating PDF..." : "Export to PDF"}
                </>
              )}
            </PDFDownloadLink>
          </div>
        </div>
      </div>
      <Modal
        show={showSalaryChart}
        onHide={() => setShowSalaryChart(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Salary Distribution</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ height: '400px' }}>
            <Pie 
              data={prepareSalaryData()}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                  },
                },
              }}
            />
          </div>
        </Modal.Body>
      </Modal>

      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
              Name {getSortIcon('name')}
            </th>
            <th onClick={() => handleSort('gender')} style={{ cursor: 'pointer' }}>
              Gender {getSortIcon('gender')}
            </th>
            <th onClick={() => handleSort('designation')} style={{ cursor: 'pointer' }}>
              Designation {getSortIcon('designation')}
            </th>
            <th onClick={() => handleSort('state')} style={{ cursor: 'pointer' }}>
              State {getSortIcon('state')}
            </th>
            <th onClick={() => handleSort('salary')} style={{ cursor: 'pointer' }}>
              Salary {getSortIcon('salary')}
            </th>
            <th onClick={() => handleSort('age')} style={{ cursor: 'pointer' }}>
              Age {getSortIcon('age')}
            </th>
            <th onClick={() => handleSort('dateOfBirth')} style={{ cursor: 'pointer' }}>
              Date of Birth {getSortIcon('dateOfBirth')}
            </th>
            <th onClick={() => handleSort('dateOfJoin')} style={{ cursor: 'pointer' }}>
              Date of Join {getSortIcon('dateOfJoin')}
            </th>
            <th>Actions</th>
            <th>Download ID Card</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.name}</td>
              <td>{employee.gender}</td>
              <td>{employee.designation}</td>
              <td>{employee.state}</td>
              <td>{employee.salary.toFixed(2)}</td>
              <td>{employee.age}</td>
              <td>{new Date(employee.dateOfBirth).toLocaleDateString()}</td>
              <td>{new Date(employee.dateOfJoin).toLocaleDateString()}</td>
              <td>
                <button className="btn btn-danger me-2" onClick={() => handleDelete(employee.id)}>
                  Delete
                </button>
              </td>
              <td>
                <PDFDownloadLink
                  document={<EmployeePDF employee={employee} />}
                  fileName={`Employee_${employee.id}_IDCard.pdf`}
                  className="btn btn-primary download-btn"
                  onClick={() => setDownloading(true)}
                >
                  {({ loading }) => (
                    <>
                      <i className="bi bi-download me-2"></i>
                      {loading ? "Loading..." : "Download ID Card"}
                    </>
                  )}
                </PDFDownloadLink>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeGrid;
