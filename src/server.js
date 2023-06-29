const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('colors');

require('./database');

const app = express();

const routes = require('./routes.js')

app.use(cors({
    origin: "*",
}));

app.use(express.json());
app.use(routes);

console.info(("[application] Server marked as running").green);

app.listen(process.env.PORT || process.env.APP_PORT || 3000, function(){
    console.info(("[application] Express server listening on port %d in %s mode").green, this.address().port, app.settings.env);
});