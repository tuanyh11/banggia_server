'use strict'
import express from 'express'
import Connect from './Connection/ConnectServer'
import routes from './Routes/index'
import cors from 'cors'
import dotenv from 'dotenv'
// import Product from './Models/Product'
dotenv.config()

const app = express()

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cors())

routes(app)

const port = process.env.PORT || 3001

app.use('/', (req, res) => {
    res.send('hello to my app')
})

app.listen( port, () => { 
    console.log(`app run on port ${port}`)
})
