namespace backend.DTOs
{
    public class EmployeeRequestDTO
    {
        public string? Name { get; set; }
        public string? Gender { get; set; }
        public string? Designation { get; set; }
        public List<string>? State { get; set; }
        public DateTime DateOfBirth { get; set; }
    }

    public class EmployeeResponseDTO
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Gender { get; set; }
        public string? Designation { get; set; }
        public List<string>? State { get; set; }
        public DateTime DateOfBirth { get; set; }
        public int Age { get; set; }
    }
}
