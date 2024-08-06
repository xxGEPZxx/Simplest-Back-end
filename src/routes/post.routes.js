import { Router } from 'express'

import PostController from '../controllers/post.controllers.js'
import validateToken from '../middleware/validateToken.js'
import validateData from '../middleware/validateData.js'
import {
  createPostSchema,
  updatePostSchema,
  idPostsSchema,
} from '../schemas/post.schemas.js'

const PostRouter = Router()

PostRouter.post(
  '/',
  validateToken,
  validateData({ body: createPostSchema }),
  PostController.createPost
)
PostRouter.get('/', PostController.getAllPosts)
PostRouter.get('/user', validateToken, PostController.getPostByUsers)
PostRouter.put(
  '/:idPosts',
  validateToken,
  validateData({ body: updatePostSchema, params: idPostsSchema }),
  PostController.updatePost
)
PostRouter.delete(
  '/:idPosts',
  validateToken,
  validateData({ params: idPostsSchema }),
  PostController.deletePost
)

export default PostRouter
