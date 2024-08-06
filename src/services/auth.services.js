import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import mssql from 'mssql'
import Boom from '@hapi/boom'

import { getConnection } from '../database/index.js'
import config from '../config/index.js'

const signup = async (data) => {
  const { name, lastName, email, password, dateBirth } = data

  const pool = await getConnection()
  const transaction = new mssql.Transaction(pool)

  try {
    await transaction.begin()

    // Check if user exists
    const emailUser = await transaction
      .request()
      .input('email', mssql.NVarChar, email)
      .query(`SELECT * FROM [dbo].[Users] WHERE email = @email`)

    if (emailUser.recordset.length > 0)
      throw Boom.conflict('Email_already_registered')

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create user
    const createUser = await transaction
      .request()
      .input('name', mssql.NVarChar, name)
      .input('lastName', mssql.NVarChar, lastName)
      .input('email', mssql.NVarChar, email)
      .input('password', mssql.NVarChar, hashedPassword)
      .input('dateBirth', mssql.Date, dateBirth)
      .query(
        `INSERT INTO [dbo].[Users] (Name, LastName, Email, Password, DateBirth) OUTPUT inserted.* VALUES (@name, @lastName, @email, @password, @dateBirth)`
      )

    // Check if user was created
    if (createUser.rowsAffected.length === 0)
      throw Boom.badImplementation('User_not_created')

    await transaction.commit()

    const result = {
      name: createUser.recordset[0].Name,
      lastName: createUser.recordset[0].LastName,
      email: createUser.recordset[0].Email,
      dateBirth: createUser.recordset[0].DateBirth,
    }

    return result
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}

const signing = async (data) => {
  const { email, password } = data

  const pool = await getConnection()
  const transaction = new mssql.Transaction(pool)

  try {
    await transaction.begin()

    // Check if user exists
    const emailUser = await transaction
      .request()
      .input('email', mssql.NVarChar, email)
      .query(`SELECT * FROM [dbo].[Users] WHERE Email = @email`)

    if (emailUser.recordset.length === 0)
      throw new Error('Email_is_not_registered')

    const user = emailUser.recordset[0]

    // Check if password is correct
    const validPassword = await bcrypt.compare(password, user.Password)

    if (!validPassword) throw Boom.unauthorized('Invalid_password')

    // Create and assign a token
    const token = jwt.sign({ id: user.IdUsers }, config.jwt.secret, {
      expiresIn: '1d',
    })

    // Return token
    const resultToken = await transaction
      .request()
      .input('token', mssql.NVarChar, token)
      .input('id', mssql.BigInt, user.IdUsers)
      .query(`UPDATE [dbo].[Users] SET Token = @token WHERE IdUsers = @id`)

    // Check if token was updated
    if (resultToken.rowsAffected.length === 0)
      throw Boom.badImplementation('Token_not_updated')

    const result = {
      email: user.email,
      accessToken: token,
    }

    await transaction.commit()

    return result
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}

const profile = async (data) => {
  const { id } = data

  const pool = await getConnection()
  const transaction = new mssql.Transaction(pool)

  try {
    await transaction.begin()

    // Check if user exists
    const emailUser = await transaction
      .request()
      .input('IdUsers', mssql.BigInt, id)
      .query(`SELECT * FROM [dbo].[Users] WHERE IdUsers = @IdUsers`)

    if (emailUser.recordset.length === 0) throw Boom.notFound('User_not_found')

    const user = emailUser.recordset[0]

    const result = {
      name: user.Name,
      lastName: user.LastName,
      email: user.Email,
      dateBirth: user.DateBirth,
    }

    await transaction.commit()

    return result
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}

const updatedUser = async ({ data, id }) => {
  const { name, lastName, email, dateBirth } = data

  const pool = await getConnection()
  const transaction = new mssql.Transaction(pool)

  try {
    await transaction.begin()

    // Check if user exists
    const IdUsers = await transaction
      .request()
      .input('IdUsers', mssql.BigInt, id)
      .query(`SELECT * FROM [dbo].[Users] WHERE IdUsers = @IdUsers`)

    if (IdUsers.recordset.length === 0) throw Boom.notFound('User_not_found')

    // Update user
    const updateUser = await transaction
      .request()
      .input('name', mssql.NVarChar, name ?? IdUsers.recordset[0].Name)
      .input(
        'lastName',
        mssql.NVarChar,
        lastName ?? IdUsers.recordset[0].LastName
      )
      .input('email', mssql.NVarChar, email ?? IdUsers.recordset[0].Email)
      .input(
        'dateBirth',
        mssql.Date,
        dateBirth ?? IdUsers.recordset[0].DateBirth
      )
      .input('UpdateTime', mssql.DateTime, new Date())
      .query(
        `UPDATE [dbo].[Users] SET Name = @name, LastName = @lastName, DateBirth = @dateBirth, UpdateTime = @UpdateTime OUTPUT inserted.* WHERE Email = @email`
      )

    // Check if user was updated
    if (updateUser.rowsAffected.length === 0)
      throw Boom.badImplementation('User_not_updated')

    await transaction.commit()

    const result = {
      name: updateUser.recordset[0].Name,
      lastName: updateUser.recordset[0].LastName,
      email: updateUser.recordset[0].Email,
      dateBirth: updateUser.recordset[0].DateBirth,
    }

    return result
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}

const refreshToken = async (data) => {
  const accessToken = jwt.sign(
    { accessToken: data.accessToken },
    config.jwt.secret,
    {
      expiresIn: '1d',
    }
  )
  return accessToken
}

const logout = async (data) => {
  const { email } = data

  const pool = await getConnection()
  const transaction = new mssql.Transaction(pool)

  try {
    await transaction.begin()

    const result = await transaction
      .request()
      .input('email', mssql.NVarChar, email)
      .query(`UPDATE [dbo].[Users] SET Token = NULL WHERE Email = @email`)

    if (result.rowsAffected.length === 0)
      throw Boom.badImplementation('Token_not_deleted')

    await transaction.commit()

    return 'Token_deleted'
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}

export default {
  signup,
  signing,
  profile,
  updatedUser,
  refreshToken,
  logout,
}
