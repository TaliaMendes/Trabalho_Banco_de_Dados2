import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Client } from '../database/connection.js'
import dotenv from 'dotenv'

dotenv.config()

class Auth {
  constructor(email, senha) {
    this.email = email;
    this.senha = senha;
  }

  async login() {
    const db = Client.db('TrabalhoBD2')
    
    // Busca o usuário pelo e-mail no banco de dados
    const user = await db.collection('Usuários').findOne({ email: this.email })
    
    if (!user) {
      throw new Error('Credenciais inválidas') // E-mail não encontrado
    }

    // Compara a senha digitada com a senha criptografada armazenada
    const isValidate = await bcrypt.compare(this.senha, user.senha)
    
    if (isValidate) {
      // Gera o token de acesso se a senha estiver correta
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '12h' })
      return { token, user } // Retorna token e user
    } else {
      throw new Error('Credenciais inválidas') 
    }
  }
}

export default Auth
