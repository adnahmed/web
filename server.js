const config = require('./src/config');
const app = require('./src/app');

app.listen(config.port, () => {
    console.log(`Server is listening on port ${config.port}`);
})