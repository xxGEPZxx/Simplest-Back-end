import express from 'express'
import dotenv from 'dotenv'

dotenv.config()
const app = express()

// Settings
app.set('port', process.env.PORT)

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

export default app
