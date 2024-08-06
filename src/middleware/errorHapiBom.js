import Boom from 'boom'

export default function errorHapiBoom(err, req, res, next) {
  if (err instanceof Boom) {
    const { payload } = err.output
    return res.status(payload.statusCode).json({
      statusCode: payload.statusCode,
      message: payload.message,
    })
  } else {
    res.status(500).json({
      statusCode: 500,
      message: err.message,
    })
  }
}
