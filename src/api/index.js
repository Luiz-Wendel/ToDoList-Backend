const colors = require('colors');

const app = require('./app');

const { PORT } = process.env;

app.listen(PORT, () => console.log(`App running on port: ${colors.cyan(PORT)}...`));
