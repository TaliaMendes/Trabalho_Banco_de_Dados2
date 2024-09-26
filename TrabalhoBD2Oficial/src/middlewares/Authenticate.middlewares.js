import jwt from 'jsonwebtoken'

const checkToken = (req, res, next) => {
  const authHeader = req.headers.authorization
  
  if (authHeader) {
    const token = authHeader.split(' ')[1]
    const secret = process.env.JWT_SECRET

    try {
      const decoded = jwt.verify(token, secret)
      req.user = decoded
      next()
    } catch (error) {
      return res.status(403).json({ message: 'Invalid token' })
    }
  } else {
    return res.status(401).json({ message: 'Access denied' })
  }
}

export { checkToken }