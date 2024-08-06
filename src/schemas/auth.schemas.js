import Joi from 'joi'

const name = Joi.string().regex(/^[a-zA-ZñÑ\s]*$/)
const lastName = Joi.string().regex(/^[a-zA-ZñÑ\s]*$/)
const email = Joi.string().email().max(255)
const password = Joi.string().pattern(/^[a-zA-Z0-9]{6,30}$/)
const dateBirth = Joi.date()
const token = Joi.string()

export const signupSchema = Joi.object({
  name: name.required(),
  lastName: lastName.required(),
  email: email.required(),
  password: password.required(),
  dateBirth: dateBirth.required(),
})

export const signingSchema = Joi.object({
  email,
  password,
})

export const updatedUserSchema = Joi.object({
  name,
  lastName,
  email,
  dateBirth,
})
