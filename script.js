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

    // Fetch weather data using coordinates
    function getWeatherByCoords(lat, lon) {
        const apiKey = localStorage.getItem('api_key');
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                displayTemp(data); // Update temperature display
                displayWeather(data); // Update weather display
            })
            .catch(err => console.error('Error fetching weather data:', err));
    }

    // Update the temperature display
    function displayTemp(data) {
        const temperature = Math.ceil(data.main.temp);
        document.getElementById('temp').innerText = `${temperature}°C`;
    }

    // Update the weather icon and description
    function displayWeather(data) {
        const weatherDescription = data.weather[0].description;
        const weatherIcon = data.weather[0].icon;
        document.getElementById('weather').src = `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`;
        document.getElementById('weather').alt = weatherDescription;

        // Capitalize and format weather description for title
        let title = weatherDescription.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        document.getElementById('weather').title = title;
    }

    // Request user's location and fetch weather data
    function requestLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const { latitude, longitude } = position.coords;
                localStorage.setItem('latitude', latitude);
                localStorage.setItem('longitude', longitude);
                getWeatherByCoords(latitude, longitude);
            }, error => {
                console.error('Error getting location:', error);
                document.getElementById('temp').innerText = 'Unable to retrieve location';
            });
        } else {
            console.error('Geolocation not supported by this browser');
            document.getElementById('temp').innerText = 'Geolocation not supported';
        }
    }

    // Check for saved location in localStorage and fetch weather data or request location
    window.onload = function() {
        const savedLatitude = localStorage.getItem('latitude');
        const savedLongitude = localStorage.getItem('longitude');
        if (savedLatitude && savedLongitude) {
            getWeatherByCoords(savedLatitude, savedLongitude);
        } else {
            requestLocation();
        }
    };

    let api_key = '';

    // Toggle API key input box visibility
    document.getElementById('toggle-input').addEventListener('click', function() {
        document.getElementById('input-box').classList.toggle('show');
        document.getElementById('api-input').focus(); // Focus on input box when toggled
    });

    // Save API key to localStorage when user presses Enter
    document.getElementById('api-input').addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            api_key = event.target.value;
            localStorage.setItem('api_key', api_key); // Save API key to localStorage
            document.getElementById('input-box').classList.remove('show');
            event.target.value = api_key;
        }
    });
});