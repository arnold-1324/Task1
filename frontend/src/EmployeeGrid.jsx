import React, { useState, useEffect } from "react";
import { PDFDownloadLink, Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";
import JsBarcode from "jsbarcode";
import "bootstrap/dist/css/bootstrap.min.css";
import "./EmployeeGrid.css";

const EmployeeGrid = ({ refreshEmployeesTrigger }) => {
  const [employees, setEmployees] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);

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

  return (
    <div className="employee-grid-container">
      <h2 className="grid-title">Employee Details</h2>
      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Gender</th>
            <th>Designation</th>
            <th>Date of Birth</th>
            <th>Date of Join</th>
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
                  className="btn btn-primary"
                >
                  {({ loading }) => (loading ? "Loading..." : "Download ID Card")}
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
