import { Module } from '@nestjs/common';
import { WeatherService } from '@weather/weather.service';

@Module({
  providers: [WeatherService],
  exports: [WeatherService],
})
export class WeatherModule {}
