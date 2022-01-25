const connectToMongo = require('./db');

connectToMongo();

const express = require('express')
const app = express()
const port = 3000

const user = require('./models/User');

app.use(express.json());  // to receive data from the body

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})