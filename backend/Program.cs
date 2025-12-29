using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;
using MotiveBackend.Data;

var builder = WebApplication.CreateBuilder(args);

var connectionString = "Server=motivedatabase.mysql.database.azure.com;Database=ecen424_db_project;User ID=YousefTantawy;Password=el7amamsyel7amamsy!!;SslMode=Required;";

builder.Services.AddDbContext<Ecen424DbProjectContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()  // Allows http://localhost:5173, 3000, 8080... anything
              .AllowAnyMethod()  // Allows GET, POST, PUT, DELETE
              .AllowAnyHeader(); // Allows any custom headers
    });
});

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseCors();
}
app.UseForwardedHeaders(new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto,
    // Trust the loopback address (Nginx is on localhost)
    KnownNetworks = { },
    KnownProxies = { }
});
app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
