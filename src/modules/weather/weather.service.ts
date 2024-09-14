import { Injectable } from '@nestjs/common';
import { WEATHER_LATITUDE, WEATHER_LONGITUDE } from '@const/weather';
import axios from 'axios';
import {
  WeatherResponse,
  WeatherShortResponse,
} from '@weather/dto/weather.dto';

@Injectable()
export class WeatherService {
  async fetchWeather(): Promise<WeatherShortResponse> {
    const url = 'https://api.openweathermap.org/data/2.5/weather';

    const params = {
      lat: WEATHER_LATITUDE,
      lon: WEATHER_LONGITUDE,
      appid: process.env.WEATHER_API,
      units: 'metric',
    };

    try {
      const { data } = await axios.post<WeatherResponse>(url, {}, { params });

      return {
        temperature: data.main.temp,
        condition: data.weather.length > 0 ? data.weather[0].main : '',
      };
    } catch (error) {
      throw new Error(`Failed to fetch weather data: ${error.message}`);
    }
  }
}
