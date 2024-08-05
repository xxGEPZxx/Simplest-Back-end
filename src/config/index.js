import dotenv from 'dotenv'

dotenv.config()

export default {
  PORT: process.env.PORT,
  db: {
    Database: process.env.DB_DATABASE,
    Host: process.env.DB_HOST,
    User: process.env.DB_USER,
    Password: process.env.DB_PASS,
  },
}
