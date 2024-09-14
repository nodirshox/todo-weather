import { WeatherShortResponse } from '@weather/dto/weather.dto';

export interface TaskResponseDto {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  weather: WeatherShortResponse;
}
