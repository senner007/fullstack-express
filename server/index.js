const express = require('express');
const bodyParser = require('body-parser');
const cors = require ('cors');
var fs = require('fs');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

const names = require('./routes/api/names');

app.use('/api/posts', names);


const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`))