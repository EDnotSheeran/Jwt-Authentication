import express from 'express'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import usersRoutes from './routes/UsersRoutes'
import dotenv from 'dotenv'
dotenv.config()

// App
const app = express()

//Middlewares
app.use(morgan('dev'))
app.use(bodyParser.json())

//Routes
app.use('/users',usersRoutes)

//Start the server
app.listen(process.env.PORT || 3333,()=>{
    console.log(`\x1b[32m[Server started at\x1b[0m \x1b[36m${process.env.HOST || 'http://localhost'}\x1b[0m:\x1b[33m${process.env.PORT || 3333}\x1b[32m]\x1b[0m`)
})
