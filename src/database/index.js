import { pool } from './database.js'

export const getConnection = async () => {
  try {
    if (pool.connected) return pool
    return await pool.connect()
  } catch (error) {
    console.error('Error connecting to the database', error)
  }
}
