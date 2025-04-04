using backend.Models;
using backend.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Services
{
    public interface IEmployeeService
    {
        Task<EmployeeResponseDTO> AddEmployeeAsync(Employee employee);
        Task<EmployeeResponseDTO> GetEmployeeByIdAsync(int id);
        Task<List<Employee>> GetAllEmployeesAsync(); // Ensure this matches the implementation
        Task<string> DeleteEmployeeAsync(int id);
    }
}
