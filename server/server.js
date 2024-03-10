import "dotenv/config";
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import connect from './database/conn.js';
import router from './routes/router.js';
import bodyParser from 'body-parser';
import blogRouter from "./routes/blogRoutes.js";

const app = express();

//Middlewares
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(cors());

app.use(morgan('tiny'));
app.disable('x-powered-by'); //less hackers know about our stack
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 413 && 'body' in err) {
      return res.status(413).send({ error: 'Request entity too large' });
    }
  
    next();
});

const port = 8080;

//HTTP requests
app.get('/',(req,res)=>{
    res.status(201).json("Home http request!");
});

//API routes
app.use('/api', router);
app.use('/api/blogs', blogRouter);


//Start server only when database connection in successful
connect().then(()=>{
    try {
        app.listen(port, ()=>{
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.log("Cannot connect to the server: "+error);
    }
}).catch(error =>{
    console.log("Invalid database connection!");
});
