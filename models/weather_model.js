import https from "https";
import dotenv from "dotenv";
dotenv.config();
const appid = process.env.WEATHER_APPID;

class WeatherData {
  constructor(city) {
    this.city = city;
    this.units = "metric";
    this.country = "";
    this.latitude = "";
    this.longitude = "";
    this.temp = "";
    this.main = "";
    this.wind = "";
    this.humidity = "";
    this.desc = "";
    this.icon = "";
    this.iconUrl = "";
  }

  // init Method
  async init() {
    return new Promise((resolve, reject) => {
      const city_url = `https://api.openweathermap.org/geo/1.0/direct?q=${this.city}&limit=1&appid=${appid}`;
      https.get(city_url, (response) => {
        console.log(` CITY API CALL ${response.statusCode}`);
        response.on("data", (data) => {
        const loc = JSON.parse(data);
        this.longitude = loc[0].lon;
        this.latitude = loc[0].lat;

          const url = `https://api.openweathermap.org/data/2.5/weather?lat=${this.latitude}&lon=${this.longitude}&units=${this.units}&appid=${appid}`;
          https.get(url, (response) => {
            console.log(` WEATHER API CALL ${response.statusCode}`);
            response.on("data", (data) => {
                const weatherData = JSON.parse(data);
                this.country = weatherData.sys.country;
                this.temp = weatherData.main.temp;
                this.desc = weatherData.weather[0].description;
                this.icon = weatherData.weather[0].icon;
                this.main = weatherData.weather[0].main;
                this.wind = weatherData.wind.speed;
                this.humidity = weatherData.main.humidity;
                this.iconUrl = `http://openweathermap.org/img/w/${this.icon}.png`;

                resolve({
                    city: this.city,
                    country: this.country,
                    temp: this.temp,
                    desc: this.desc,
                    icon: this.icon,
                    main: this.main,
                    wind: this.wind,
                    humidity: this.humidity,
                    iconUrl: this.iconUrl,
                  });
            });
          });
        });
      }).on("error", (error) => {
        reject(error);
      });
    });
  }
}

export default WeatherData;
