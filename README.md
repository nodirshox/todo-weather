# Task management

Backend service to store user task with weather information. Weather integrated with [openweathermap.org](https://openweathermap.org/).

## Technology

Backend: NestJS

ODM: Mongoose

Database: MongoDB

Server: Digital Ocean

Deployment: Docker

Pipeline: Github Actions

[Swagger](https://api.task.nodirbek.uz/api):

```
https://api.task.nodirbek.uz/api
```

## Sample user

E-mail

```
user@mail.com
```

Password

```
password
```

## Run project locally (Docker program should be running in locally)

1. Run following command

```
docker compose up -d --build
```

2. Go to Swagger UI:

```
http://localhost:3000/api
```

## Stop project locally

1. Run following command

```
docker compose down
```

## Architecture

Image
