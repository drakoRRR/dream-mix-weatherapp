# Dream Mix WeatherApp

## Instruction to run a project with Docker
Before deploying the project, you need to configure the .env file, the project has .env .example
```
WEATHER_APP_ID=
SECRET_KEY_DJANGO=
```

After configuring the file, use Docker and docker-compose.

For a quick start, use:
```dockerfile
docker-compose up -d --build
```