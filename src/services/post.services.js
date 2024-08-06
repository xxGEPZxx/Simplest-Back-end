import mssql from 'mssql'
import Boom from '@hapi/boom'

import { getConnection } from '../database/index.js'

const createPost = async ({ data, id }) => {
  const { title, description, image } = data

  const pool = await getConnection()
  const transaction = new mssql.Transaction(pool)

  try {
    await transaction.begin()

    const createPost = await transaction
      .request()
      .input('title', mssql.NVarChar, title)
      .input('description', mssql.NVarChar, description)
      .input('userId', mssql.Int, id)
      .query(
        `INSERT INTO [dbo].[Posts] (Title, Description, IdUsers) OUTPUT inserted.* VALUES (@title, @description, @userId)`
      )

    if (createPost.rowsAffected.length === 0)
      throw Boom.badImplementation('Post_not_created')

    await transaction.commit()

    const result = {
      title: createPost.recordset[0].Title,
      content: createPost.recordset[0].Content,
      description: createPost.recordset[0].Description,
      image: createPost.recordset[0].Image,
    }

    return result
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}

const getAllPosts = async () => {
  const pool = await getConnection()
  const transaction = new mssql.Transaction(pool)

  try {
    await transaction.begin()

    const posts = await transaction.request()
      .query(`Select [dbo].[Users].Name, [dbo].[Users].LastName, [dbo].[Users].Email,
			[dbo].[Posts].Title, [dbo].[Posts].Description, [dbo].[Posts].Image, [dbo].[Posts].IdUsers
				from [dbo].[Posts] LEFT JOIN [dbo].[Users] ON [dbo].[Posts].IdUsers = [dbo].[Users].IdUsers`)

    if (posts.recordset.length === 0) throw Boom.notFound('Posts_not_found')

    await transaction.commit()

    const resultPosts = posts.recordset.map((post) => ({
      user: {
        userId: post.IdUsers,
        name: post.Name,
        lastName: post.LastName,
        email: post.Email,
      },
      title: post.Title,
      description: post.Description,
      image: post.Image,
    }))

    return resultPosts
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}

const getPostByUsers = async ({ id }) => {
  const pool = await getConnection()

  const posts = await pool.request().input('id', mssql.BigInt, id)
    .query(`Select [dbo].[Users].Name, [dbo].[Users].LastName, [dbo].[Users].Email,
			[dbo].[Posts].Title, [dbo].[Posts].Description, [dbo].[Posts].Image, [dbo].[Posts].IdUsers
				from [dbo].[Posts] LEFT JOIN [dbo].[Users] ON [dbo].[Posts].IdUsers = [dbo].[Users].IdUsers  
				Where [dbo].[Posts].IdUsers = @id`)

  if (posts.recordset.length === 0) throw Boom.notFound('Posts_not_found')

  const resultPosts = posts.recordset.map((post) => ({
    user: {
      userId: post.IdUsers,
      name: post.Name,
      lastName: post.LastName,
      email: post.Email,
    },
    title: post.Title,
    description: post.Description,
    image: post.Image,
  }))

  return resultPosts
}

const updatePost = async ({ data, id, IdPosts }) => {
  const { title, description } = data

  const pool = await getConnection()
  const transaction = new mssql.Transaction(pool)

  try {
    await transaction.begin()

    // Verify if the post exists and belongs to the user
    const post = await transaction
      .request()
      .input('id', mssql.BigInt, IdPosts)
      .input('userId', mssql.BigInt, id).query(`Select [dbo].[Users].IdUsers,
			[dbo].[Posts].IdPost, [dbo].[Posts].IdUsers as IdUserHasPost,
            [dbo].[Posts].Title, [dbo].[Posts].Description, [dbo].[Posts].Image	
				from [dbo].[Posts] LEFT JOIN [dbo].[Users] ON [dbo].[Posts].IdUsers = [dbo].[Users].IdUsers  
				Where [dbo].[Posts].IdPost = @id AND [dbo].[Users].IdUsers = @userId`)

    if (post.recordset.length === 0) throw Boom.notFound('Post_not_found')

    // Update the post
    const updatePost = await transaction
      .request()
      .input('title', mssql.NVarChar, title ?? post.recordset[0].Title)
      .input(
        'description',
        mssql.NVarChar,
        description ?? post.recordset[0].Description
      )
      .input('id', mssql.BigInt, IdPosts)
      .input('UpdateTime', mssql.DateTime, new Date())
      .query(
        `UPDATE [dbo].[Posts] SET Title = @title, Description = @description, UpdateTime = @UpdateTime OUTPUT inserted.* WHERE IdPost = @id`
      )

    if (updatePost.rowsAffected.length === 0)
      throw Boom.badImplementation('Post_not_updated')

    await transaction.commit()

    const result = {
      title: updatePost.recordset[0].Title,
      description: updatePost.recordset[0].Description,
      image: updatePost.recordset[0].Image,
    }

    return result
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}

const deletePost = async ({ id, IdPosts }) => {
  const pool = await getConnection()
  const transaction = new mssql.Transaction(pool)

  try {
    await transaction.begin()

    // Verify if the post exists and belongs to the user
    const post = await transaction
      .request()
      .input('id', mssql.BigInt, IdPosts)
      .input('userId', mssql.BigInt, id).query(`Select [dbo].[Users].IdUsers,
                [dbo].[Posts].IdPost, [dbo].[Posts].IdUsers as IdUserHasPost,
                [dbo].[Posts].Title, [dbo].[Posts].Description, [dbo].[Posts].Image	
                    from [dbo].[Posts] LEFT JOIN [dbo].[Users] ON [dbo].[Posts].IdUsers = [dbo].[Users].IdUsers  
                    Where [dbo].[Posts].IdPost = @id AND [dbo].[Users].IdUsers = @userId`)

    if (post.recordset.length === 0) throw Boom.notFound('Post_not_found')

    // Delete the post
    const deletePost = await transaction
      .request()
      .input('id', mssql.BigInt, IdPosts)
      .query(`DELETE FROM [dbo].[Posts] OUTPUT deleted.* WHERE IdPost = @id`)

    if (deletePost.rowsAffected.length === 0)
      throw Boom.badImplementation('Post_not_deleted')

    await transaction.commit()

    const result = {
      title: deletePost.recordset[0].Title,
      description: deletePost.recordset[0].Description,
      image: deletePost.recordset[0].Image,
    }

    return result
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}

export default {
  createPost,
  getAllPosts,
  getPostByUsers,
  updatePost,
  deletePost,
}
