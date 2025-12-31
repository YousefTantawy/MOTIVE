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
