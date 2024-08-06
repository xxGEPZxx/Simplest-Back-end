export default function validateData(options) {
  return (req, res, next) => {
    const { body, params, query } = options

    if (body) {
      const { error } = body.validate(req.body)
      if (error) return res.status(400).send(error.details[0].message)
    }

    if (params) {
      const { error } = params.validate(req.params)
      if (error) return res.status(400).send(error.details[0].message)
    }

    if (query) {
      const { error } = query.validate(req.query)
      if (error) return res.status(400).send(error.details[0].message)
    }

    next()
  }
}
