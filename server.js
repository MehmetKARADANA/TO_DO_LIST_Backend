const express = require('express');
const port = 5000;

const connectDB = require('./repository');

connectDB();
const app = express();

const { errorHandler } = require('./errorMiddleware');

app.use(express.json());
app.use(express.urlencoded({extended: false}));


app.use('/api/todos', require('./todoRoutes'));
app.use('/api/users', require('./userRoutes'));
app.use(errorHandler);
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
