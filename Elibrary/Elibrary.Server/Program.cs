using System.Security.Claims;
using Elibrary.Data;
using Elibrary.model;
using Elibrary.Model;
using Elibrary.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure authentication and authorization
builder.Services.AddAuthentication()
    .AddCookie(IdentityConstants.ApplicationScheme);

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("RequireAuthenticatedUser", policy => policy.RequireAuthenticatedUser());
});

// Configure database context
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// Configure identity services
builder.Services.AddIdentityCore<User>()
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders();

// Configure application cookie settings
builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.SameSite = SameSiteMode.None; // Allows cross-site cookies
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always; // Requires HTTPS
    options.Events.OnRedirectToLogin = context =>
    {
        context.Response.StatusCode = StatusCodes.Status401Unauthorized;
        return Task.CompletedTask;
    };
    options.Events.OnRedirectToAccessDenied = context =>
    {
        context.Response.StatusCode = StatusCodes.Status403Forbidden;
        return Task.CompletedTask;
    };
});

// Configure CORS for React app
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173") // React app URL
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials(); // Needed for cookies
        });
});

// Register IEmailSender service (use NullEmailSender if no email functionality is needed)
builder.Services.AddSingleton<IEmailSender<User>, NullEmailSender>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseStaticFiles();
app.UseRouting();
app.UseHttpsRedirection();
app.UseCors("AllowReactApp");
app.UseAuthentication();
app.UseAuthorization();

// Map identity API
app.MapIdentityApi<User>();

// Test endpoint to get the current user's name
app.MapGet("/hello", (ClaimsPrincipal user) => user.Identity!.Name)
    .RequireAuthorization("RequireAuthenticatedUser");

// Endpoint to sign out the current user
app.MapPost("/api/account/signout", async (SignInManager<User> signInManager) =>
{
    await signInManager.SignOutAsync();
    return Results.Ok();
}).RequireCors("AllowReactApp");

// Endpoint to create a new book
app.MapPost("/api/books", async (AppDbContext db, Book book, ClaimsPrincipal user) =>
{
    var userName = user.Identity?.Name;

    if (string.IsNullOrEmpty(userName))
    {
        return Results.Unauthorized();
    }

    // Set the CreatedBy property to the user's name
    book.CreatedBy = userName;

    db.Books.Add(book);
    await db.SaveChangesAsync();

    return Results.Created($"/api/books/{book.Id}", book);
}).RequireAuthorization("RequireAuthenticatedUser")
  .RequireCors("AllowReactApp");

// Endpoint to get books created by the current user
app.MapGet("/api/books", async (AppDbContext db, ClaimsPrincipal user) =>
{
    var userName = user.Identity?.Name;

    if (string.IsNullOrEmpty(userName))
    {
        return Results.Unauthorized();
    }

    var books = await db.Books.Where(b => b.CreatedBy == userName).ToListAsync();
    return Results.Ok(books);
}).RequireAuthorization("RequireAuthenticatedUser")
  .RequireCors("AllowReactApp");

// Endpoint to get a specific book by ID
app.MapGet("/api/books/{id}", async (int id, AppDbContext db, ClaimsPrincipal user) =>
{
    var userName = user.Identity?.Name;

    if (string.IsNullOrEmpty(userName))
    {
        return Results.Unauthorized();
    }

    var book = await db.Books.FindAsync(id);

    if (book == null || book.CreatedBy != userName)
    {
        return Results.NotFound();
    }

    return Results.Ok(book);
}).RequireAuthorization("RequireAuthenticatedUser");

// Endpoint to update a book
app.MapPut("/api/books/{id}", async (int id, AppDbContext db, Book updatedBook, ClaimsPrincipal user) =>
{
    var userName = user.Identity?.Name;

    if (string.IsNullOrEmpty(userName))
    {
        return Results.Unauthorized();
    }

    var book = await db.Books.FindAsync(id);

    if (book == null || book.CreatedBy != userName)
    {
        return Results.NotFound();
    }

    // Update book properties
    book.Title = updatedBook.Title;
    book.Author = updatedBook.Author;
    book.Description = updatedBook.Description;

    await db.SaveChangesAsync();

    return Results.NoContent();
}).RequireAuthorization("RequireAuthenticatedUser");

// Endpoint to delete a book
app.MapDelete("/api/books/{id}", async (int id, AppDbContext db, ClaimsPrincipal user) =>
{
    var userName = user.Identity?.Name;

    if (string.IsNullOrEmpty(userName))
    {
        return Results.Unauthorized();
    }

    var book = await db.Books.FindAsync(id);

    if (book == null || book.CreatedBy != userName)
    {
        return Results.NotFound();
    }

    db.Books.Remove(book);
    await db.SaveChangesAsync();

    return Results.NoContent();
}).RequireAuthorization("RequireAuthenticatedUser");

app.Run();
