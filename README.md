# Spring Boot JWT + OAuth Bidding Platform
Bidding app that uses a Spring Boot backend and a Typescript ViteJS React Redux Frontend.

![alt text](https://raw.githubusercontent.com/oukhali99/JWT-OAuth2-Spring-Boot-React/refs/heads/main/Screenshot_20250302_012358.png)

## Features
- Create and bid on listings
- Composition based search queries
- JWT token authentication
- Register/Login directly on the website with username + password
- Register/Login using OAuth2
- Users registered using OAuth2 cannot be used to login directly
- Send and accept friend requests

## Hosted on AWS
This demo is hosted [here](https://jwt-oauth-frontend.oussamakhalifeh.com)

![alt text](https://raw.githubusercontent.com/oukhali99/JWT-OAuth2-Spring-Boot-React/refs/heads/main/docs/AWS%20Architecture.drawio.svg)

## POWERFUL Search Feature with Maximal Code Reuse
The Frontend sends SearchQuery objects to the backend in the POST body when making a search request. Each entity has it's own SearchQuery object. And we build more complex SearchQuery objects using simpler ones.

![alt text](https://raw.githubusercontent.com/oukhali99/JWT-OAuth2-Spring-Boot-React/refs/heads/main/docs/Search.drawio.svg)

Similarly, the React Frontend has SearchQuery classes. But on top of that, the Frontend also has SearchQueryForm React components. These components are also built from other simpler SearchQueryForm components. This way, the component that takes input for say, searching a user by First Name, is also used in searching for Listings by name.

The entire thing is written to have ZERO code duplication, maximizing code reuse.


## Wait... JWT and OAuth2 at the same time?
Yes. The usual workflow of JWT Authentication is to sign up directly with a username and a password. This application supports this.

Moreover, you can also sign up using Google. How it works:

![alt text](https://raw.githubusercontent.com/oukhali99/JWT-OAuth2-Spring-Boot-React/refs/heads/main/docs/OAuth%20Authentication%20Sequence.drawio.svg)

- The react frontend obtains an accessToken from Google (with your consent)
- This token is sent to the Spring Boot backend
- The backend verifies the token, and fetches the email with which it is associated
- Then, it checks for that email in the psql database. If not found, it creates it with a blank password. And sets the ```signedUpWithOAuth``` flag. This is important so people can't sign into an OAuth account directly.
- Then, it generates and returns a JWT token to the frontend.

What's more, a user that signed up with OAuth will not be allowed to login directly. This makes sense because what would he even use as a password? The below flowchart shows this.

![alt text](https://raw.githubusercontent.com/oukhali99/JWT-OAuth2-Spring-Boot-React/refs/heads/main/docs/Authentication%20Activity.drawio.svg)

There are only 3 database entities:

![alt text](https://raw.githubusercontent.com/oukhali99/JWT-OAuth2-Spring-Boot-React/refs/heads/main/docs/Backend%20Classes.drawio.svg)

## Marketplace Simulator
This app has a basic bidding marketplace. This diagram shows roughly how it works:

![alt text](https://raw.githubusercontent.com/oukhali99/JWT-OAuth2-Spring-Boot-React/refs/heads/main/docs/Marketplace%20Sequence.drawio.svg)

## Social Media Features
Authenticated users can also send, receive and accept friend requests.

![alt text](https://raw.githubusercontent.com/oukhali99/JWT-OAuth2-Spring-Boot-React/refs/heads/main/docs/Friend%20Request%20Sequence.drawio.svg)

Sending and accepting friend requests are both done through the same endpoint.

![alt text](https://raw.githubusercontent.com/oukhali99/JWT-OAuth2-Spring-Boot-React/refs/heads/main/docs/Friend%20Request%20Activity.drawio.svg)

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