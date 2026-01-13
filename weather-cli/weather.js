import https from "https";


function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = "";

      if (res.statusCode !== 200) {
        reject(new Error(`Request failed with status ${res.statusCode}`));
      }

      res.on("data", chunk => data += chunk);
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch (err) {
          reject(new Error("Invalid JSON response"));
        }
      });
    }).on("error", reject);
  });
}


export async function getWeather(city) {
  // 1. Get coordinates
  const geoURL = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`;
  const geoData = await fetchJSON(geoURL);

  if (!geoData.results || geoData.results.length === 0) {
    throw new Error("City not found");
  }

  const { latitude, longitude, name, country } = geoData.results[0];


  const weatherURL =
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

  const weatherData = await fetchJSON(weatherURL);
  const weather = weatherData.current_weather;

  return {
    city: `${name}, ${country}`,
    temperature: weather.temperature,
    windSpeed: weather.windspeed,
    weatherCode: weather.weathercode
  };
}