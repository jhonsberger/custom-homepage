document.addEventListener('DOMContentLoaded', function() {
    function showTime() {
        let time = new Date();
        let hours = time.getHours();
        let minutes = time.getMinutes();
        let am_pm = "AM";

        // Adjust for 12-hour format and AM/PM
        if (hours >= 12) {
            if (hours > 12) hours -= 12;
            am_pm = "PM";
        } else if (hours == 0) {
            hours = 12;
            am_pm = "AM";
        }

        // Add leading zero if needed
        hours = hours < 10 ? "0" + hours : hours;
        minutes = minutes < 10 ? "0" + minutes : minutes;

        let currentTime = hours + ":" + minutes + " " + am_pm;
        document.getElementById("clock").innerHTML = currentTime;
    }
    setInterval(showTime, 100);

    function getWeather(city) {
        const apiKey = localStorage.getItem('api_key');
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                displayTemp(data); // Update temperature display
                displayWeather(data); // Update weather display
            })
            .catch(err => console.error('Error fetching weather data:', err));
    }

    function displayTemp(data) {
        const temperature = Math.ceil(data.main.temp);
        document.getElementById('temp').innerText = `Temperature: ${temperature}°C`;
    }

    function displayWeather(data) {
        const weatherDescription = data.weather[0].description;
        const weatherIcon = data.weather[0].icon;
        document.getElementById('weather').src = `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`;
        document.getElementById('weather').alt = weatherDescription;

        // Capitalize and format weather description for title
        let title = weatherDescription.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        document.getElementById('weather').title = title;
    }

    document.getElementById('city-input').addEventListener('input', function() {
        const city = document.getElementById('city-input').value;
        localStorage.setItem('city', city); // Save city to localStorage
        if (city) {
            getWeather(city); // Fetch weather data for the input city
        }
    });

    window.onload = function() {
        const savedCity = localStorage.getItem('city');
        if (savedCity) {
            document.getElementById('city-input').value = savedCity;
            getWeather(savedCity); // Fetch weather data for saved city
        }
    };

    let api_key = '';

    document.getElementById('toggle-input').addEventListener('click', function() {
        document.getElementById('input-box').classList.toggle('show');
        document.getElementById('api-input').focus(); // Focus on input box when toggled
    });

    document.getElementById('api-input').addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            api_key = event.target.value;
            localStorage.setItem('api_key', api_key); // Save API key to localStorage
            document.getElementById('input-box').classList.remove('show');
            event.target.value = api_key;
        }
    });
});
