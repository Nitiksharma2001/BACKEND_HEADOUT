export function corsHeaders(req, res, next) {
  // res.header("Access-Control-Allow-Origin", "*");
  const allowedOrigins = ['http://localhost:5173', process.env.FRONTEND_URL]
  const origin = req.headers.origin
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  }
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  )
  res.header('Access-Control-Allow-credentials', true)
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, UPDATE')
  next()
}
