import express from 'express'
import cors from 'cors'

import config from './config/index.js'
import Routes from './routes/routes.js'
import errorHapiBoom from './middleware/errorHapiBom.js'

const app = express()

// Settings
app.set('port', config.PORT)

// Middlewares
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Routes
app.use('/api', Routes)

// Error handler
app.use(errorHapiBoom)

export default app
