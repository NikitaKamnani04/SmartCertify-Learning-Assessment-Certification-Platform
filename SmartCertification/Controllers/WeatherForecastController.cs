using Microsoft.AspNetCore.Mvc;
using SmartCertification.Domain.Entities;

namespace SmartCertification.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase
    {
        private static readonly string[] Summaries =
        [
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        ];

        private readonly ILogger<WeatherForecastController> logger;
        private readonly SmartCertifyContext smartCertifyContext;

        public WeatherForecastController(ILogger<WeatherForecastController> logger,
            SmartCertifyContext smartCertifyContext)
        {
            this.logger = logger;
            this.smartCertifyContext = smartCertifyContext;

        }
        [HttpGet(Name = "GetWeatherForecast")]
        public IActionResult Get()
        {
            //return Enumerable.Range(1, 5).Select(index => new WeatherForecast
            //{
            //    Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            //    TemperatureC = Random.Shared.Next(-20, 55),
            //    Summary = Summaries[Random.Shared.Next(Summaries.Length)]
            //})
            //.ToArray();

            var model = smartCertifyContext.UserProfiles.ToList();
            return Ok(model);
        }
    }
}
