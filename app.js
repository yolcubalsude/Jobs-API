require('dotenv').config();
require('express-async-errors');


const helmet = require ('helmet')
const cors = require ('cors')
const xss = require ('xss-clean')
const rateLimiter = require ('express-rate-limit')


const express = require('express');
const app = express();

const connectDB = require('./db/connect');
const authenticateUser = require ('./middleware/authentication')

const authRouter = require('./routes/auth');
const jobsRouter = require('./routes/jobs');


const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');


app.set('trust proxy' , 1);
app.use(
  rateLimiter({windowMs: 15 * 60 * 100, 
     max : 100,
    })
   );
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());



app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authenticateUser, jobsRouter);


app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    console.log("Connecting to DB...-------------------");
    await connectDB(process.env.MONGO_URI);
    console.log("Connected to DB!------------------");
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.error(" Uygulama başlatılamadı------------------:");
    console.error(error);
  }
};

start();
