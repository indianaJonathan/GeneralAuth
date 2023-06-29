require('dotenv').config();

module.exports = {
    dialect: process.env.SEQUELIZE_DIALECT,
    host: process.env.SEQUELIZE_HOST,
    port: process.env.SEQUELIZE_PORT,
    username: process.env.SEQUELIZE_USER,
    password: process.env.SEQUELIZE_PASS,
    database: process.env.SEQUELIZE_DATABASE,
    timeout: 60000,
    define: {
        timestamps: true,
        underscored: true,
        paranoid: true,
    }
};