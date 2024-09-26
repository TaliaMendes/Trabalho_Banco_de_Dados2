import Usuario from '../models/Usuarios.js'
import Auth from '../models/Auth.js'

class UserController {

  static async getAllUsers(req, res) {
    try {
      const users = await Usuario.getAllUsers()
      res.status(200).json(users)
    } catch (error) {
      res.status(500).send('Erro ao buscar usuários')
    }
  }

  static async getUser(req, res) {
    const userId = req.params._id
    try {
      const user = await Usuario.getUser(userId)
      res.status(200).json(user)
    } catch (error) {
      res.status(500).send('Usuário não encontrado')
    }
  }

  static async newUser(req, res) {
    const { email, senha, nome } = req.body
    
    const createUser = new Usuario (email, senha, nome)
    try {
      const user = await createUser.createUser()
      res.status(201).json({ message: "Usuário registrado com sucesso"})
    } catch (error) {
      res.status(500).send('Erro ao registrar usuário')
    }
  }

  static async loginUser(req, res) {
    const { email, senha } = req.body

    const auth = new Auth(email, senha)
    try {
      const { token, user } = await auth.login()
      res.status(200).json({ token, user })
    } catch (error) {
      res.status(401).send('Credenciais inválidas')
    }
  }

  static async updateUser(req, res) {
    const updateUser = {
      email : req.body.email,
      senha : req.body.senha,
      nome : req.body.nome
    }
    const idUser = req.params._id

    try{
      const update = await Usuario.updateUser(idUser, updateUser)
      res.status(200).json(update)
    } catch (error) {
      res.status(500).send('Erro ao editar usuário')
    }
  }

  static async deleteUser(req, res) {
    const idUser = req.params._id

    try{
      const deleteUser = await Usuario.deleteUser(idUser)
      res.status(200).json(deleteUser)
    } catch (error) {
      res.status(500).send('Erro ao deletar usuário')
    }
  }
}

export default UserController



