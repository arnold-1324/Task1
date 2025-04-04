using backend.Models;
using backend.Repositories;
using backend.DTOs;

namespace backend.Services
{
    public class EmployeeService : IEmployeeService
    {
        private readonly IEmployeeRepository _employeeRepository;

        public EmployeeService(IEmployeeRepository employeeRepository)
        {
            _employeeRepository = employeeRepository;
        }

        public async Task<EmployeeResponseDTO> AddEmployeeAsync(Employee employee)
        {
            try
            {
                if (employee == null)
                {
                    return new EmployeeResponseDTO
                    {
                        Success = false,
                        Message = "Employee cannot be null"
                    };
                }

                var addedEmployee = await _employeeRepository.AddAsync(employee);
                return new EmployeeResponseDTO
                {
                    Success = true,
                    Message = "Employee added successfully",
                    Employees = new List<EmployeeData>
                    {
                        new EmployeeData
                        {
                            Id = addedEmployee.Id,
                            Name = addedEmployee.Name,
                            Gender = addedEmployee.Gender,
                            Designation = addedEmployee.Designation,
                            State = addedEmployee.State,
                            DateOfBirth = addedEmployee.DateOfBirth,
                            DateOfJoin = addedEmployee.DateOfJoin,
                            Salary = addedEmployee.Salary,
                            Age = addedEmployee.Age
                        }
                    }
                };
            }
            catch (Exception ex)
            {
                return new EmployeeResponseDTO
                {
                    Success = false,
                    Message = $"An error occurred: {ex.Message}",
                    Employees = null
                };
            }
        }

        public async Task<EmployeeResponseDTO> GetEmployeeByIdAsync(int id)
        {
            var employee = await _employeeRepository.GetByIdAsync(id);
            if (employee == null)
            {
                return new EmployeeResponseDTO
                {
                    Success = false,
                    Message = "Employee not found",
                    Employees = null
                };
            }
            return new EmployeeResponseDTO
            {
                Success = true,
                Message = "Employee retrieved successfully",
                Employees = new List<EmployeeData>
                {
                    new EmployeeData
                    {
                        Id = employee.Id,
                        Name = employee.Name,
                        Gender = employee.Gender,
                        Designation = employee.Designation,
                        State = employee.State,
                        DateOfBirth = employee.DateOfBirth,
                        DateOfJoin = employee.DateOfJoin,
                        Salary = employee.Salary,
                        Age = employee.Age
                    }
                }
            };
        }

        public async Task<List<Employee>> GetAllEmployeesAsync()
        {
            return await _employeeRepository.GetAllAsync();
        }

        public async Task<string> DeleteEmployeeAsync(int id)
        {
            return await _employeeRepository.DeleteAsync(id);
        }
    }
}
