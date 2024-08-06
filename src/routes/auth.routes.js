import { Router } from 'express'

import authControllers from '../controllers/auth.controllers.js'
import validateToken from '../middleware/validateToken.js'
import validateData from '../middleware/validateData.js'
import { signupSchema, signingSchema, updatedUserSchema } from '../schemas/auth.schemas.js'

const AuthRouter = Router()

AuthRouter.post(
  '/signup',
  validateData({ body: signupSchema }),
  authControllers.signup
)

AuthRouter.post(
  '/signing',
  validateData({ body: signingSchema }),
  authControllers.signing
)

AuthRouter.get('/profile', validateToken, authControllers.profile)

AuthRouter.put(
  '/updated-user',
  validateToken,
  validateData({ body: updatedUserSchema }),
  authControllers.updatedUser
)

AuthRouter.post('/refresh-token', validateToken, authControllers.refreshToken)

AuthRouter.post('/logout', validateToken, authControllers.logout)

export default AuthRouter
