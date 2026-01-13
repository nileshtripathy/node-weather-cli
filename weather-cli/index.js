import { getWeather } from "./weather.js";

const city = process.argv.slice(2).join(" ");

if (!city) {
  console.error("❌ Please provide a city name");
  console.log('Usage: node index.js "New York"');
  process.exit(1);
}

(async () => {
  try {
    const weather = await getWeather(city);
    console.log(`🌍 Weather in ${weather.city}`);
    console.log(`🌡️ Temperature: ${weather.temperature}°C`);
    console.log(`💨 Wind Speed: ${weather.windSpeed} km/h`);
  } catch (err) {
    console.error("⚠️ Error:", err.message);
  }
})();