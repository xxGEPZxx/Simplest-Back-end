import mssql from 'mssql'
import config from '../config/index.js'

const dbSettings = {
  user: config.db.User,
  password: config.db.Password,
  server: config.db.Host,
  database: config.db.Database,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
}

const pool = new mssql.ConnectionPool(dbSettings)

export { pool }
