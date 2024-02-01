import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import axios from 'axios';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LineChart } from '@mui/x-charts/LineChart';

const Home = () => {
    const [loading, setLoading] = useState(true);
    const currentDate = dayjs();
    const [selectedDate, setSelectedDate] = useState(currentDate);
    const [selectedDropdownCity, setSelectedDropdownCity] = useState('');
    const [filteredWeather, setFilteredWeather] = useState([]);
    const [uniqueHours, setUniqueHours] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [allCities, setAllCities] = useState([]);

    const cities = ["New York", "Київ", "Харків", "Львів", "Одеса", "Дніпро", "Донецьк", "Запоріжжя", "Луганськ", "Івано-Франківськ", "Чернівці", "Житомир", "Вінниця"];

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleCityFilterButtonClick = (selectedCity) => {
        setSelectedDropdownCity(selectedCity);
    };

    const handleActualForecast = () => {
        fetchData(selectedDropdownCity, selectedDate);
    };

    const handleModelForecast = async () => {
        try {
            const res = await axios.post('http://127.0.0.1:8000/api/get-predict-weather-by-city-date/',
                {
                    start_date: selectedDate.format('YYYY-MM-DD'),
                    end_date: selectedDate.format('YYYY-MM-DD'),
                    city: selectedDropdownCity,
                },
            );

            if (res.status !== 200) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }

            const predictWeather = res.data;
            console.log('Predicted Weather:', predictWeather);
        } catch (error) {
            console.error('Error fetching predicted weather data:', error);
        }
    };

    const fetchData = async (city, date) => {
        try {
            const res = await axios.post('http://127.0.0.1:8000/api/get-weather-by-city-date/',
                {
                    start_date: date.format('YYYY-MM-DD'),
                    end_date: date.format('YYYY-MM-DD'),
                    city: city,
                },
            );

            if (res.status !== 200) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }

            const weatherData = res.data;
            setFilteredWeather(weatherData);

            const updatedUniqueHours = extractUniqueHours(weatherData);
            const updatedChartData = extractChartData(weatherData, updatedUniqueHours);

            setUniqueHours(updatedUniqueHours);
            setChartData(updatedChartData);
        } catch (error) {
            console.error('Error fetching weather data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAllCities = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:8000/api/get-cities/');

            if (res.status !== 200) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }

            const citiesData = res.data;
            setAllCities(citiesData);
        } catch (error) {
            console.error('Error fetching cities data:', error);
        }
    };

    useEffect(() => {
        fetchAllCities();
    }, []);

    const extractHourFromDateString = (dateString) => {
        const match = dateString.match(/(\d{2}):\d{2}:\d{2}/);
        return match ? match[1] : null;
    };

    const extractUniqueHours = (weatherData) => {
        const uniqueHours = new Set();
        weatherData.forEach((weather) => {
            const hour = extractHourFromDateString(weather.date);
            if (hour !== null) {
                uniqueHours.add(hour);
            }
        });
        return Array.from(uniqueHours).sort();
    };

    const extractChartData = (weatherData, uniqueHours) => {
        const temperatureData = weatherData.map((weather) => weather.temp_celsius);

        return temperatureData.map((temp, index) => ({
            x: extractHourFromDateString(weatherData[index].date),
            y: temp,
        }));
    };

    useEffect(() => {
        fetchData(selectedDropdownCity, selectedDate);
    }, [selectedDropdownCity, selectedDate]);

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
            <div className="dropdown">
                <select
                    value={selectedDropdownCity}
                    onChange={(e) => handleCityFilterButtonClick(e.target.value)}
                    className="secondary-button-item_filter"
                >
                    <option value="">Select city</option>
                    {allCities.map((city, idx) => (
                        <option key={`city-option-${idx}`} value={city}>
                            {city}
                        </option>
                    ))}
                </select>

                <button
                    className="secondary-button-item"
                    onClick={handleActualForecast}
                >
                    Actual forecast
                </button>

                <button
                    className="secondary-button-item"
                    onClick={handleModelForecast}
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
