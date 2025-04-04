using backend.Models;
using backend.Db; // Ensure this is included
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories
{
    public class EmployeeRepository : IEmployeeRepository
    {
        private readonly ApplicationDbContext _context;

        public EmployeeRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Employee> AddAsync(Employee employee)
        {
            _context.Employees.Add(employee);
            await _context.SaveChangesAsync();
            return employee;
        }

        public async Task<Employee?> GetByIdAsync(int id)
        {
            return await _context.Employees.FindAsync(id);
        }

        public async Task<List<Employee>> GetAllAsync()
        {
            return await _context.Employees.ToListAsync(); // Ensure this matches the interface
        }

        public async Task<string> DeleteAsync(int id)
        {
            var employee = await GetByIdAsync(id);
            if (employee == null)
            {
                return "Employee not found";
            }

            _context.Employees.Remove(employee);
            await _context.SaveChangesAsync();
            return "Employee deleted successfully";
        }
    }
}
