using backend.DTOs;
using backend.Models; // Added for Employee model
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeeController : ControllerBase
    {
        private readonly IEmployeeService _employeeService;

        public EmployeeController(IEmployeeService employeeService)
        {
            _employeeService = employeeService;
        }

        [HttpPost]
        public async Task<IActionResult> AddEmployee([FromBody] EmployeeRequestDTO employeeRequest)
        {
            try
            {
                if (employeeRequest == null)
                {
                    return BadRequest("Employee data is required");
                }

                var employee = new Employee
                {
                    Name = employeeRequest.Name,
                    Designation = employeeRequest.Designation,
                    DateOfJoin = employeeRequest.DateOfJoin,
                    Salary = employeeRequest.Salary,
                    Gender = employeeRequest.Gender,
                    State = employeeRequest.State,
                    DateOfBirth = employeeRequest.DateOfBirth,
                    Age = employeeRequest.Age
                };

                var createdEmployee = await _employeeService.AddEmployeeAsync(employee);
                if (createdEmployee.Employees != null && createdEmployee.Employees.Any())
                {
                    var employeeId = createdEmployee.Employees.First().Id;
                    return CreatedAtAction(nameof(GetEmployeeById), new { id = employeeId }, createdEmployee);
                }

                return BadRequest("Failed to create employee");
            }
            catch (Exception ex)
            {
                return BadRequest($"An error occurred: {ex.Message}");
            }
        }

        [HttpGet("GetAllEmployeesInfo")]
        public async Task<IActionResult> GetAllEmployees([FromQuery] int pageNo)
        {
            var employees = await _employeeService.GetAllEmployeesAsync();
            return Ok(employees);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetEmployeeById(int id)
        {
            var employee = await _employeeService.GetEmployeeByIdAsync(id);
            if (employee == null) return NotFound();
            return Ok(employee);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteEmployee(int id)
        {
            var result = await _employeeService.DeleteEmployeeAsync(id);
            if (result == "Employee not found") return NotFound(result);
            return Ok(result);
        }

        [HttpPut("{id:int}/UpdateEmployee")]
        public async Task<IActionResult> UpdateEmployee(int id, [FromBody] EmployeeRequestDTO employeeRequest)
        {
            try
            {
                if (employeeRequest == null)
                {
                    return BadRequest("Employee data is required");
                }

                var employee = new Employee
                {
                    Name = employeeRequest.Name,
                    Designation = employeeRequest.Designation,
                    DateOfJoin = employeeRequest.DateOfJoin,
                    Salary = employeeRequest.Salary,
                    Gender = employeeRequest.Gender,
                    State = employeeRequest.State,
                    DateOfBirth = employeeRequest.DateOfBirth,
                    Age = employeeRequest.Age
                };

                var result = await _employeeService.UpdateEmployeeAsync(id, employee);
                if (!result.Success)
                {
                    return NotFound(result);
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest($"An error occurred: {ex.Message}");
            }
        }
    }
}
