using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
namespace backend.DTOs
{
    public class EmployeeRequestDTO
    {
        [Required(ErrorMessage = "Name is required.")]
        [StringLength(100, ErrorMessage = "Name cannot be longer than 100 characters.")]
        public string? Name { get; set; }

        [Required(ErrorMessage = "Designation is required.")]
        [StringLength(100, ErrorMessage = "Designation cannot be longer than 100 characters.")]
        public string? Designation { get; set; }


        [Required(ErrorMessage = "Date of Join is required.")]
        [DataType(DataType.Date, ErrorMessage = "Please enter a valid date.")]
        public DateTime DateOfJoin { get; set; }

        [Required(ErrorMessage = "Salary is required.")]
        [Range(0, double.MaxValue, ErrorMessage = "Salary must be a positive number.")]
        public decimal Salary { get; set; }

        [Required(ErrorMessage = "Gender is required.")]
        public string? Gender { get; set; }

        [Required(ErrorMessage = "State is required.")]
        public string? State { get; set; }

        [Required(ErrorMessage = "Date of Birth is required.")]
         [DataType(DataType.Date, ErrorMessage = "Please enter a valid date.")]
        public DateTime DateOfBirth { get; set; }

        [Required(ErrorMessage = "Age is required.")]
        [Range(0, 70, ErrorMessage = "Age must be between 0 and 150.")]
        public int Age { get; set; }
    }

    public class EmployeeData
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Gender { get; set; }
        public string? Designation { get; set; }
        public string? State { get; set; }
        public DateTime DateOfBirth { get; set; }
        public DateTime DateOfJoin { get; set; }
        public decimal Salary { get; set; }
        public int Age { get; set; }

    }
    public class EmployeeResponseDTO
    {
        public List<EmployeeData>? Employees { get; set; }
        public string? Message { get; set; }
        public bool Success { get; set; }
    }

    
}
