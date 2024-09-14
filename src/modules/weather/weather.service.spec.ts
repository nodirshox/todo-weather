import { Test, TestingModule } from '@nestjs/testing';
import { WeatherService } from './weather.service';
import axios from 'axios';
import { WEATHER_LATITUDE, WEATHER_LONGITUDE } from '@const/weather';
import {
  WeatherResponse,
  WeatherShortResponse,
} from '@weather/dto/weather.dto';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockWeatherResponse: WeatherResponse = {
  coord: {
    lon: 69.2406,
    lat: 41.3111,
  },
  weather: [
    {
      id: 800,
      main: 'Clear',
      description: 'clear sky',
      icon: '01n',
    },
  ],
  base: 'stations',
  main: {
    temp: 26.9,
    feels_like: 26.05,
    temp_min: 26.9,
    temp_max: 26.9,
    pressure: 1007,
    humidity: 21,
    sea_level: 1007,
    grnd_level: 958,
  },
  visibility: 10000,
  wind: {
    speed: 4.12,
    deg: 290,
  },
  clouds: {
    all: 0,
  },
  dt: 1726321009,
  sys: {
    type: 1,
    id: 9016,
    country: 'UZ',
    sunrise: 1726275754,
    sunset: 1726320890,
  },
  timezone: 18000,
  id: 1484839,
  name: 'Toshkent Shahri',
  cod: 200,
};

describe('WeatherService', () => {
  let service: WeatherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WeatherService],
    }).compile();

    service = module.get<WeatherService>(WeatherService);
  });

  describe('fetchWeather', () => {
    it('should return weather data successfully', async () => {
      mockedAxios.post.mockResolvedValue({ data: mockWeatherResponse });

      const result: WeatherShortResponse = await service.fetchWeather();

      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://api.openweathermap.org/data/2.5/weather',
        {},
        {
          params: {
            lat: WEATHER_LATITUDE,
            lon: WEATHER_LONGITUDE,
            appid: process.env.WEATHER_API,
            units: 'metric',
          },
        },
      );

      expect(result).toEqual({
        temperature: 26.9,
        condition: 'Clear',
      });
    });

    it('should return empty condition when weather array is empty', async () => {
      const mockEmptyWeatherResponse: WeatherResponse = {
        ...mockWeatherResponse,
        weather: [],
      };

      mockedAxios.post.mockResolvedValue({ data: mockEmptyWeatherResponse });

      const result: WeatherShortResponse = await service.fetchWeather();

      expect(result).toEqual({
        temperature: 26.9,
        condition: '',
      });
    });

    it('should throw an error when the weather API request fails', async () => {
      const errorMessage = 'Network Error';
      mockedAxios.post.mockRejectedValue(new Error(errorMessage));

      await expect(service.fetchWeather()).rejects.toThrow(
        `Failed to fetch weather data: ${errorMessage}`,
      );
    });
  });
});
