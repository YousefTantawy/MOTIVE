using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;
using MotiveBackend.Models;

var builder = WebApplication.CreateBuilder(args);

string connectionString = "Server=127.0.0.1;Database=ecen424_db_project;User ID=root;Password=motivepassword;SslMode=None;AllowPublicKeyRetrieval=True;";

builder.Services.AddDbContext<Ecen424DbProjectContext>(options =>
    options.UseMySql(connectionString, new MySqlServerVersion(new Version(8, 0, 21))));

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Register the HTTP Client for the Python Microservice
builder.Services.AddHttpClient("PythonAiService", client =>
{
    // Matches the port in your python script: os.environ.get("PORT", 5171)
    client.BaseAddress = new Uri("http://127.0.0.1:5171/");
    client.DefaultRequestHeaders.Add("Accept", "application/json");
});

builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseForwardedHeaders(new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto,
    KnownNetworks = { },
    KnownProxies = { }
});

app.UseSwagger();
app.UseSwaggerUI();

app.UseCors();

app.UseAuthorization();

app.MapControllers();

app.Run();

