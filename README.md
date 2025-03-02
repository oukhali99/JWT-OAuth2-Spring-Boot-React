# Spring Boot JWT + OAuth Bidding Platform
Bidding app that uses a Spring Boot backend and a React Redux Frontend.

![alt text](https://raw.githubusercontent.com/oukhali99/JWT-OAuth2-Spring-Boot-React/refs/heads/main/Screenshot_20250302_012358.png)

## Features
- Create a listing
- Bid on a listing
- JWT token authentication
- Register/Login directly on the website with username + password
- Register/Login using OAuth2
- Users registered using OAuth2 cannot be used to login directly
- Send and accept friend requests

## Wait... JWT and OAuth2 at the same time?
Yes. The usual workflow of JWT Authentication is to sign up directly with a username and a password. This application supports this.

Moreover, you can also sign up using Google. How this works:
- The react frontend obtains an accessToken from Google (with your consent)
- This token is sent to the Spring Boot backend
- The backend verifies the token, and fetches the email with which it is associated
- Then, it checks for that email in the psql database. If not found, it creates it with a blank password. And sets the ```signedUpWithOAuth``` flag. This is important so people can't sign into an OAuth account directly.
- Then, it generates and returns a JWT token to the frontend.

![alt text](https://raw.githubusercontent.com/oukhali99/JWT-OAuth2-Spring-Boot-React/refs/heads/main/Screenshot_20250302_012647.png)

## Running this app
First, start the psql database
```
docker compose up -d
```

Then, create and fill in your .env file
```
cp src/frontend/.env.default src/frontend/.env
vim src/frontend/.env
```

Then run it in IntelliJ with the following arguments
```
--spring.datasource.url=jdbc:postgresql://localhost:5433/ChangeMeOrNotItDoesntMatter
--spring.datasource.username=ChangeMeOrNotItDoesntMatter
--spring.datasource.password=ChangeMeOrNotItDoesntMatter
--server.port=8081
--spring.security.secret-key=ChangeMe
```

I will add a Dockerfile for the Spring Boot backend eventually. And maybe even for the React Frontend.

Finally, for the frontend
```
cd src/frontend
yarn
yarn start
```