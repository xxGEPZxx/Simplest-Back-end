import jwt from 'jsonwebtoken'
import Boom from '@hapi/boom'

import config from '../config/index.js'

const validateToken = (req, res, next) => {
  const bearerHeader = req.headers.authorization

  if (bearerHeader !== null && typeof bearerHeader !== 'undefined') {
    const token = bearerHeader.split(' ')[1]
    jwt.verify(token, config.jwt.secret, (err, data) => {
      if (err !== null && typeof err !== 'undefined') {
        return res.status(401).json({
          name: err.name,
          message: 'Token_invalid',
          data: err,
        })
      }
      req.user = data
      next()
    })
  } else {
    return res.status(401).json({
      message: 'Token_not_found',
    })
  }
}

export default validateToken
