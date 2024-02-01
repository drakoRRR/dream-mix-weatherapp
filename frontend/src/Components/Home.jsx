import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import WeatherData from './weatherData';
import { LineChart, xAxis, Tooltip, Label } from '@mui/x-charts/LineChart';


const Home = () => {
    const [loading, setLoading] = useState(true);
    const currentDate = dayjs();
    const [selectedDate, setSelectedDate] = useState(currentDate);


    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setLoading(false);
        }, 5000);

        return () => clearTimeout(timeoutId);
    }, []);


    const cities = ["New York", "Київ", "Харків", "Львів", "Одеса", "Дніпро", "Донецьк", "Запоріжжя", "Луганськ", "Івано-Франківськ", "Чернівці", "Житомир", "Вінниця"];
    const [selectedDropdownCity, setSelectedDropdownCity] = useState('');

    const handleCityFilterButtonClick = (selectedCity) => {
        setSelectedDropdownCity(selectedCity);
    };

    const filteredWeather = WeatherData.filter(
        (weather) =>
            weather.city === selectedDropdownCity &&
            dayjs(weather.date).isSame(selectedDate, 'day')
    );

    const extractHourFromDateString = (dateString) => {
        const match = dateString.match(/(\d{2}):\d{2}:\d{2}/);
        if (match) {
            return match[1];
        }
        return null;
    };

    const extractUniqueHours = () => {
        const uniqueHours = new Set();
        filteredWeather.forEach((weather) => {
            const hour = extractHourFromDateString(weather.date);
            if (hour !== null) {
                uniqueHours.add(hour);
            }
        });
        return Array.from(uniqueHours).sort();
    };

    const uniqueHours = extractUniqueHours();

    const temperatureData = filteredWeather.map((weather) => weather.temp_celsius);

    const chartData = temperatureData.map((temp, index) => ({
        x: extractHourFromDateString(filteredWeather[index].date),
        y: temp,
    }));





    return (
        <div>

            <div style={{ position: 'absolute', top: 10, right: 20 }}>
                <LocalizationProvider dateAdapter={AdapterDayjs} className="calendar">
                    <DateCalendar
                        defaultValue={currentDate}
                        views={['year', 'month', 'day']}
                        disablePast={true}
                        onChange={(newDate) => handleDateChange(newDate)}
                    />
                </LocalizationProvider>
            </div>
            <div class="dropdown">
                

                <select
                    value={selectedDropdownCity}
                    onChange={(e) => handleCityFilterButtonClick(e.target.value)}
                    className="secondary-button-item_filter"
                >
                    <option value="">Select city</option>
                    {cities.map((city, idx) => (
                        <option key={`city-option-${idx}`} value={city}>
                            {city}
                        </option>
                    ))}
                </select>

                <button
                    className="secondary-button-item"
                >
                    Actual forecast
                </button>

                <button
                    className="secondary-button-item"
                >
                    Model forecast
                </button>
            </div>


            <div style={{ position: 'relative', width: '500px', height: '300px', marginLeft: '50px' }}>
                <LineChart
                    xAxis={[{ data: uniqueHours }]}
                    series={[
                        {
                            data: chartData.map((data) => data.y),
                        },
                    ]}
                    width={500}
                    height={300}
                />

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)' }}>
                    <span style={{ fontWeight: 'bold', transform: 'rotate(-90deg)' }}>Temperature (°C)</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'absolute', right: 0, bottom: '20px', transform: 'translateX(-50%)' }}>
                    <span style={{ fontWeight: 'bold', transform: 'rotate(90deg)' }}>Hour</span>
                </div>

            </div>


            <div className="weather_data">
                <ul className="items-container">
                    {filteredWeather.map((weather, idx) => (
                        <li key={`weather-${idx}`} className="work-section-info">
                            <p>{dayjs(weather.date).format("YYYY-MM-DD HH:mm:ss")}</p>
                            <p>Temperature: {weather.temp_celsius}°C / {weather.temp_fahrenheit}°F</p>
                            <p>Feels Like: {weather.feels_like_celsius}°C / {weather.feels_like_fahrenheit}°F</p>
                            <p>Humidity: {weather.humidity}%</p>
                            <p>Description: {weather.description}</p>
                            <p>Wind Speed: {weather.wind_speed} m/s</p>
                            <p>Pressure: {weather.pressure} hPa</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Home;