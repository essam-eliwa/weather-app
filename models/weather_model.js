import https from "https";
import dotenv from "dotenv";

dotenv.config();

const WEATHER_APPID = process.env.WEATHER_APPID;

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

  async init() {
    try {
      const city_url = `https://api.openweathermap.org/geo/1.0/direct?q=${this.city}&limit=1&appid=${WEATHER_APPID}`;
      const city_data = await this.getData(city_url);
      this.longitude = city_data[0].lon;
      this.latitude = city_data[0].lat;

      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${this.latitude}&lon=${this.longitude}&units=${this.units}&appid=${WEATHER_APPID}`;
      const weather_data = await this.getData(url);

      this.country = weather_data.sys.country;
      this.temp = weather_data.main.temp;
      this.desc = weather_data.weather[0].description;
      this.icon = weather_data.weather[0].icon;
      this.main = weather_data.weather[0].main;
      this.wind = weather_data.wind.speed;
      this.humidity = weather_data.main.humidity;
      this.iconUrl = `http://openweathermap.org/img/w/${this.icon}.png`;

      return this;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  getData(url) {
    return new Promise((resolve, reject) => {
      https
        .get(url, (response) => {
          let data = "";

          response.on("data", (chunk) => {
            data += chunk;
          });

          response.on("end", () => {
            try {
              resolve(JSON.parse(data));
            } catch (error) {
              reject(error);
            }
          });
        })
        .on("error", (error) => {
          reject(error);
        });
    });
  }
}

export default WeatherData;
