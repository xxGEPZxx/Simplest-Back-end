import express from 'express'
import config from './config/index.js'

const app = express()

// Settings
app.set('port', config.PORT)

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

export default app
