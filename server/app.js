const express = require('express');
const mongoose = require('mongoose');
const { MONGOURI } = require('./keys');
const app = express();
const port = 8000;

mongoose.connect(MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
mongoose.connection.on('connected', () => {
    console.log('connected to mongodb');
});
mongoose.connection.off('error', (err) => {
    console.log('error : ', err);
});

require('./models/user');
require('./models/post');

app.use(express.json());
app.use(require('./routes/auth'));
app.use(require('./routes/post'));

app.listen(port, () => {
    console.log('Server running http://localhost:' + port);
});
