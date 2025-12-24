using Microsoft.EntityFrameworkCore;
using MotiveBackend.Data;

var builder = WebApplication.CreateBuilder(args);

var connectionString = "Server=motivedatabase.mysql.database.azure.com;Database=myshop;User ID=YousefTantawy;Password=el7amamsyel7amamsy!!;SslMode=Required;";

builder.Services.AddDbContext<Ecen424DbProjectContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy => policy
            .WithOrigins("http://localhost:5173") // The URL of your React App
            .AllowAnyMethod()
            .AllowAnyHeader());
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
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
