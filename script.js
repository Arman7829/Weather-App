const apiKey = 'f9dc0d776b019d6277164f943e77fdbf';

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' });
}

async function getWeather() {
  const city = document.getElementById('cityInput').value.trim();
  if (!city) return;
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('City not found');
    const data = await res.json();

    const current = data.list[0];
    document.getElementById('city').textContent = data.city.name;
    document.getElementById('date').textContent = formatDate(current.dt_txt);
    document.getElementById('temperature').textContent = Math.round(current.main.temp);
    document.getElementById('description').textContent = current.weather[0].main;
    document.getElementById('humidity').textContent = current.main.humidity;
    document.getElementById('wind').textContent = current.wind.speed;
    document.getElementById('weatherIcon').src = `https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`;

    // 5-day forecast (every 8th item)
    const forecastContainer = document.getElementById('forecast');
    forecastContainer.innerHTML = '';
    for (let i = 8; i < data.list.length; i += 8) {
      const f = data.list[i];
      const div = document.createElement('div');
      div.className = 'forecast-day';
      div.innerHTML = `
        <div>${formatDate(f.dt_txt)}</div>
        <img src="https://openweathermap.org/img/wn/${f.weather[0].icon}.png" alt="icon">
        <div>${Math.round(f.main.temp)}°C</div>
      `;
      forecastContainer.appendChild(div);
    }
  } catch (err) {
    alert(err.message);
  }
}