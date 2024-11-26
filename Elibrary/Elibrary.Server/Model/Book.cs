using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Elibrary.Model;

public class Book
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required(ErrorMessage = "Title is required.")]
    public required string Title { get; set; }

    [Required(ErrorMessage = "Author is required.")]
    public required string Author { get; set; }

    [Required(ErrorMessage = "Description is required.")]
    public required string Description { get; set; }

    // Marking CreatedBy as nullable in case it can be null; 
    // If it is required, remove the '?' and use 'required' instead.
    public string? CreatedBy { get; set; }

    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Optionally, you can add a constructor to enforce non-null properties
    public Book()
    {
        // Ensure all required properties are initialized in the constructor if needed
        Title = Title ?? throw new ArgumentNullException(nameof(Title));
        Author = Author ?? throw new ArgumentNullException(nameof(Author));
        Description = Description ?? throw new ArgumentNullException(nameof(Description));
    }
}
