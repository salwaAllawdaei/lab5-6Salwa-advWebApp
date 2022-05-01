using Microsoft.EntityFrameworkCore;
using Lab56Api.Model;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

var dbmsVersion = new MariaDbServerVersion(builder.Configuration.GetValue<string>("DBMSVersion"));
var connString = builder.Configuration.GetConnectionString("Lab56DbContext");

builder.Services.AddControllers();
builder.Services.AddCors(opt =>
{
    opt.AddPolicy("AllowAll", builder => builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

builder.Services.AddDbContext<Lab56DbContext>(opt => opt.UseMySql(connString, dbmsVersion));

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors("AllowAll");
app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
