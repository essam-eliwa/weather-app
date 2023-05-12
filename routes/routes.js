import WeatherData from "../models/weather_model.js";
import { Router } from "express";
var router = Router();



/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("pages/index", { title: "Express" });
});

// /* Weather Post request handler */

// Testing code
// router.post('/weather', function(req, res, next) {
//   res.send(`respond with a resource ${req.body.city}`);
// });

async function getWeather(city) {
  const weather = new WeatherData(city);
  const data = await weather.init();
  //console.log(data);
  return data;
}

router.post("/weather", function (req, res, next) {
  // console.log("post request received");
  // console.log(req.body.city);
 
  getWeather(req.body.city).then((data) => {
    console.log(data);
    res.render("pages/weather", { weatherObj: data });
  }).catch((error) => {
    console.error(error);
  });
});

export default router;
