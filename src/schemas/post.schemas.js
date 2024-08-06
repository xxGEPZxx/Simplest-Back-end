import Joi from 'joi'

const idPosts = Joi.number().integer()
const title = Joi.string().min(3).max(255)
const description = Joi.string().min(3).max(255)
const image = Joi.string().uri()

export const createPostSchema = Joi.object({
  title: title.required(),
  description: description.required(),
  image: image,
})

export const updatePostSchema = Joi.object({
  title,
  description,
  image,
})

export const idPostsSchema = Joi.object({
  idPosts: idPosts.required(),
})

