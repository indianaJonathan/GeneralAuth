# General Auth
## Simple authentication app

This app uses Node.JS to authenticate your app

### Dependencies
- Cors
- Express
- Sequelize
- Sequelize CLI
- MySql2
- JsonWebToken
- BCrypt
- NodeMailer

### Dev dependencies
- Nodemon
- Path

## Getting started
Download the repository and install dependencies
> npm install

Setup the .ENV file
> #Database <br>
> SEQUELIZE_DATABASE=generalauth <br>
> SEQUELIZE_DIALECT=mysql <br>
> SEQUELIZE_HOST=localhost <br>
> SEQUELIZE_PORT=3306 <br>
> SEQUELIZE_USER=root <br>
> SEQUELIZE_PASS=@Bolinho34 <br>
> <br>
> #BCrypt <br>
> BCRYPT_SALT=12 <br>
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