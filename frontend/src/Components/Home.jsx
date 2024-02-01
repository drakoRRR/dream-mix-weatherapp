import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import axios from 'axios';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { LineChart } from '@mui/x-charts/LineChart';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';


const Home = () => {
    const [loading, setLoading] = useState(true);
    const currentDate = dayjs();
    const [selectedDate, setSelectedDate] = useState(currentDate);
    const [selectedDropdownCity, setSelectedDropdownCity] = useState('');
    const [filteredWeather, setFilteredWeather] = useState([]);
    const [uniqueHours, setUniqueHours] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [allCities, setAllCities] = useState([]);
    const [confirmationDate, setConfirmationDate] = useState(null);
    const [forecastDays, setForecastDays] = useState(1); 
    const [dateRange, setDateRange] = useState([selectedDate, selectedDate]);



    const handleCityFilterButtonClick = (selectedCity) => {
        setSelectedDropdownCity(selectedCity);
    };

    const handleActualForecast = () => {
        let start_date, end_date;
    
        if (forecastDays === 1) {
            start_date = currentDate.format('YYYY-MM-DD');
            end_date = currentDate.format('YYYY-MM-DD');
        } else {
            start_date = currentDate.format('YYYY-MM-DD');
            end_date = currentDate.add(4, 'days').format('YYYY-MM-DD');
        }
    
        fetchData(selectedDropdownCity, confirmationDate || selectedDate, start_date, end_date);
    };
    

    const handleModelForecast = async () => {
        try {
<<<<<<< HEAD
            let start_date, end_date;
    
            if (forecastDays === 1) {
                start_date = currentDate.format('YYYY-MM-DD');
                end_date = currentDate.format('YYYY-MM-DD');
            } else {
                start_date = currentDate.format('YYYY-MM-DD');
                end_date = currentDate.add(4, 'days').format('YYYY-MM-DD');
            }
    
            console.log('Selected Date Range:', start_date, end_date);
    
            const res = await axios.post('http://127.0.0.1:8000/api/get-predict-weather-by-city-date/', {
                start_date: start_date,
                end_date: end_date,
                city: selectedDropdownCity,
            });
    
=======
            const res = await axios.post('http://127.0.0.1:8000/api/get-predict-weather-by-city-date/',
                {
                    start_date: selectedDate.format('YYYY-MM-DD'),
                    end_date: selectedDate.format('YYYY-MM-DD'),
                    city: selectedDropdownCity,
                },
            );

>>>>>>> 68c5a87682d944986a60e986d8fb50ac8a860de2
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
<<<<<<< HEAD
            const res = await axios.post('http://127.0.0.1:8000/api/get-weather-by-city-date/', {
                start_date: date.format('YYYY-MM-DD'),
                end_date: date.format('YYYY-MM-DD'),
                city: city,
            });
=======
            const res = await axios.post('http://127.0.0.1:8000/api/get-weather-by-city-date/',
                {
                    start_date: date.format('YYYY-MM-DD'),
                    end_date: date.format('YYYY-MM-DD'),
                    city: city,
                },
            );
>>>>>>> 68c5a87682d944986a60e986d8fb50ac8a860de2

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



    const handleForecastDaysChange = (days) => {
        setForecastDays(days);
    };


    return (
        <div>
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

            <div>
                {dateRange[0].isValid() && dateRange[1].isValid() && (
                    <p>
                        Selected Date Range: {dateRange[0].format("YYYY-MM-DD")} to {dateRange[1].format("YYYY-MM-DD")}
                    </p>
                )}
            </div>

            <div className="forecast-options">
                <label>
                    <input
                        type="radio"
                        name="forecastDays"
                        value={1}
                        checked={forecastDays === 1}
                        onChange={() => handleForecastDaysChange(1)}
                    />
                    1 Day
                </label>

                <label>
                    <input
                        type="radio"
                        name="forecastDays"
                        value={5}
                        checked={forecastDays === 5}
                        onChange={() => handleForecastDaysChange(5)}
                    />
                    5 Days
                </label>
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
};

export default Home;
