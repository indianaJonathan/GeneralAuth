# General Auth
## Simple authentication app

This app uses Node.JS to authenticate your app.<sup>[1](#footnote)</sup>

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
```
npm install
```

Setup the .ENV file
```
# Database
SEQUELIZE_DATABASE=<YOUR_DATABASE_NAME (default project uses generalauth)>
SEQUELIZE_DIALECT=<YOUR_DATABASE_DIALECT (default project uses mysql)>
SEQUELIZE_HOST=<YOUR_DATABASE_HOST (in dev mode use "localhost")>
SEQUELIZE_PORT=<YOUR_DATABASE_PORT>
SEQUELIZE_USER=<YOUR_DATABASE_USER>
SEQUELIZE_PASS=<YOUR_DATABASE_PASSWORD>

# BCrypt
BCRYPT_SALT=12

# JsonWebToken
JWT_SECRET=<YOUR_JET_SECRET>

# Mailer
MAILER_PROVIDER=<YOUR_EMAIL_PROVIDER>
MAILER_ADDRESS=<YOUR_EMAIL_ADDRESS>
MAILER_PASS=<YOUR_EMAIL_PASSWORD>

# App
APP_PORT=3333
```

Run the **"create database"** command
```
npx sequelize db:create
```

Run the **migrations** to setup tables
```
npx sequelize db:migrate
```

Run the **seeds** to add primary data
```
npx sequelize db:seed:all
```

### **You are ready to go**
```
npm run dev
```

```
npm run start
```

<a name="footnote">Created by Jonathan Hermam</a>