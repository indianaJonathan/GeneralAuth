# General Auth
## Simple authentication app

This app uses Node.JS to authenticate your app.[^1]

### Features
- Create user
- Get user details
- Update user
- Delete user
- Restore user
- Get deleted user details
- Get all users
- Get all deleted users
- Login
- Generate "forgot password" token
- Reset password
- Get user details by session token

### Dependencies
- BCrypt
- Cors
- DotEnv
- Express
- JsonWebToken
- MySql2
- Path
- Sequelize
- Sequelize CLI

### Dev dependencies
- Colors
- Nodemon

## Getting started
Download the repository and install dependencies
> npm install

Setup the .ENV file
> #Database <br>
> SEQUELIZE_DATABASE=<YOUR_DATABASE_NAME (default project uses generalauth)> <br>
> SEQUELIZE_DIALECT=<YOUR_DATABASE_DIALECT (default project uses mysql)> <br>
> SEQUELIZE_HOST=<YOUR_DATABASE_HOST (in dev mode use "localhost")> <br>
> SEQUELIZE_PORT=<YOUR_DATABASE_PORT> <br>
> SEQUELIZE_USER=<YOUR_DATABASE_USER> <br>
> SEQUELIZE_PASS=<YOUR_DATABASE_PASSWORD> <br>
> <br>
> #BCrypt <br>
> BCRYPT_SALT=12 <br>
> <br>
> #JsonWebToken <br>
> JWT_SECRET=<YOUR_JET_SECRET> <br>
> <br>
> #Mailer <br>
> MAILER_PROVIDER=<YOUR_EMAIL_PROVIDER> <br>
> MAILER_ADDRESS=<YOUR_EMAIL_ADDRESS> <br>
> MAILER_PASS=<YOUR_EMAIL_PASSWORD> <br>
> <br>
> #App <br>
> APP_PORT=3333 <br>

Run the **"create database"** command
> npx sequelize db:create

Run the **migrations** to setup tables
> npx sequelize db:migrate

Run the **seeds** to add primary data
> npx sequelize db:seed:all

### **You are ready to go**
> npm run dev

> npm run start

[^1] Created by Jonathan Hermam