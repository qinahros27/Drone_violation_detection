const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const cors = require("cors");
const routes = require("./routes");
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(cors());
app.use('/', routes);

app.set('view engine', 'pug');
app.use(express.static('img'));

//MongoDB connection
const mongoose = require('mongoose');
const mongoURL = 'mongodb+srv://mongoviope:anhnguyen@atlascluster.9asbi9z.mongodb.net/birdnestdb?retryWrites=true&w=majority';
mongoose.connect(mongoURL, { useNewUrlParser: true , useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error'));

app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
}); 

module.exports = app;