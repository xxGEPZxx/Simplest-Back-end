import authServices from '../services/auth.services.js'

const signup = (req, res, next) => {
  const { body } = req

  authServices
    .signup(body)
    .then((data) => {
      res.status(201).json({
        status: 'success',
        message: 'User_registered',
        data,
      })
    })
    .catch((error) => {
      next(error)
    })
}

const signing = (req, res, next) => {
  const { body } = req

  authServices
    .signing(body)
    .then((data) => {
      res.status(201).json({
        status: 'success',
        message: 'User_logged_in',
        data,
      })
    })
    .catch((error) => {
      next(error)
    })
}

const profile = (req, res, next) => {
  const { user: userReq } = req
  const { id } = userReq

  authServices
    .profile({ id })
    .then((data) => {
      res.status(200).json({
        status: 'success',
        message: 'User_profile',
        data,
      })
    })
    .catch((error) => {
      next(error)
    })
}

const updatedUser = (req, res, next) => {
  const { user: userReq } = req
  const { id } = userReq
  const { body } = req

  authServices
    .updatedUser({ data: body, id })
    .then((data) => {
      res.status(201).json({
        status: 'success',
        message: 'User_updated',
        data,
      })
    })
    .catch((error) => {
      next(error)
    })
}

const refreshToken = (req, res) => {
  const { body } = req

  authServices
    .refreshToken(body)
    .then((data) => {
      res.status(201).json({
        status: 'success',
        message: 'Token_refreshed',
        data,
      })
    })
    .catch((error) => {
      next(error)
    })
}

const logout = (req, res) => {
  const { body } = req

  authServices
    .logout(body)
    .then((data) => {
      res.status(201).json({
        status: 'success',
        message: 'Token_deleted',
        data,
      })
    })
    .catch((error) => {
      next(error)
    })
}

export default {
  signup,
  signing,
  profile,
  updatedUser,
  refreshToken,
  logout,
}
