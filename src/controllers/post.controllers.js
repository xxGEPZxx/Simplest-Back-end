import postServices from '../services/post.services.js'

const createPost = (req, res, next) => {
  const { body, user: userReq } = req
  const { id } = userReq

  postServices
    .createPost({ data: body, id })
    .then((data) => {
      res.status(201).json({
        status: 'success',
        message: 'Post_created',
        data,
      })
    })
    .catch((error) => {
      next(error)
    })
}

const getAllPosts = (req, res, next) => {
  postServices
    .getAllPosts()
    .then((data) => {
      res.status(200).json({
        status: 'success',
        message: 'Posts_retrieved',
        data,
      })
    })
    .catch((error) => {
      next(error)
    })
}

const getPostByUsers = (req, res, next) => {
  const { user: userReq } = req
  const { id } = userReq

  postServices
    .getPostByUsers({ id })
    .then((data) => {
      res.status(200).json({
        status: 'success',
        message: 'Posts_retrieved',
        data,
      })
    })
    .catch((error) => {
      next(error)
    })
}

const updatePost = (req, res, next) => {
  const { body, user: userReq, params } = req
  const { id } = userReq
  const { idPosts } = params

  postServices
    .updatePost({ data: body, id, IdPosts: idPosts })
    .then((data) => {
      res.status(200).json({
        status: 'success',
        message: 'Post_updated',
        data,
      })
    })
    .catch((error) => {
      next(error)
    })
}

const deletePost = (req, res, next) => {
  const { user: userReq, params } = req
  const { id } = userReq
  const { idPosts } = params

  postServices
    .deletePost({ id, IdPosts: idPosts })
    .then((data) => {
      res.status(201).json({
        status: 'success',
        message: 'Post_deleted',
        data,
      })
    })
    .catch((error) => {
      next(error)
    })
}

export default {
  createPost,
  getAllPosts,
  getPostByUsers,
  updatePost,
  deletePost,
}
