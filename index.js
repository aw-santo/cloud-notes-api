const connectToMongo = require('./db');

connectToMongo();
const cors = require('cors');

const express = require('express');
const app = express();
const port = 5000;

app.use(express.json());  // to receive data from the body
app.use(cors());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`saveMe listening at http://localhost:${port}`)
})