import express from 'express'
import ControllerUsuario from '../controller/ControllerUsuario.js'
import { checkToken } from '../middlewares/Authenticate.middlewares.js'

const routes = express.Router()

routes.get('/usuarios', ControllerUsuario.getAllUsers)
routes.get('/usuarios/conta/:_id', ControllerUsuario.getUser)
routes.post('/usuarios/cadastro', ControllerUsuario.newUser)
routes.post('/usuarios/login', ControllerUsuario.loginUser)
routes.put('/usuarios/conta/:_id',ControllerUsuario.updateUser)
routes.delete('/usuarios/conta/:_id', ControllerUsuario.deleteUser)

export default routes

//checkToken 