import express from 'express'
import RouterUsuarios from './Router.Usario.js'
import RouterFeedback from './Router.Feedback.js'
import RouterComentario from './Router.Comentario.js'

const routes = express.Router()

routes.use('/api/feedback/', RouterUsuarios)
routes.use('/api/feedback/', RouterFeedback)
routes.use('/api/feedback/', RouterComentario)

export default routes