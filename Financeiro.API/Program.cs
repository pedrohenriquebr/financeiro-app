using FinanceiroApp.Core.Extensions;
using Serilog;
using Serilog.Events;

var builder = WebApplication.CreateBuilder(args);

// Configure Serilog
if (!builder.Environment.IsDevelopment())
{
    var logsPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "logs");
    Directory.CreateDirectory(logsPath);

    Log.Logger = new LoggerConfiguration()
        .MinimumLevel.Information()
        //eu quero fazer log de debug, error, warning
        .MinimumLevel.Override("Microsoft", LogEventLevel.Debug)
        .WriteTo.File(
            Path.Combine(logsPath, "api-log.txt"),
            rollingInterval: RollingInterval.Day,
            retainedFileCountLimit: 5,
            fileSizeLimitBytes: 1024 * 1024, // 1MB
            outputTemplate: "{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz} [{Level:u3}] {Message:lj}{NewLine}{Exception}"
        )
        .CreateLogger();

    builder.Host.UseSerilog();
}

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add Financeiro services including SQLite and Google Drive backup
builder.Services.AddFinanceiroServices(builder.Configuration);

// Add CORS policy for local development
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocal",
        builder => builder
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader());
});

var app = builder.Build();

// Initialize database
await app.Services.InitializeDatabaseAsync();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowLocal");
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
