using backend.Models;

namespace backend.Repositories
{
    public interface IEmployeeRepository
    {
        Task<Employee> AddAsync(Employee employee);
        Task<Employee?> GetByIdAsync(int id); 
        Task<List<Employee>> GetAllAsync(); 

        Task <string> DeleteAsync(int id);

    }
}
