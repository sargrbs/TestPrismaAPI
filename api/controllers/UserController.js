import prisma from './prisma'
import bcrypt from "bcrypt"
import {v4 as uuidv4} from 'uuid';

async function encrypt(pass){
    const saltRounds = 10;
    const encryptPass = bcrypt.hashSync(pass, saltRounds);
    return encryptPass
}
export default {
    async createUser(req, res) {
        try {
            const {name, email, password, privilege } = req.body
            const us = await prisma.user.findFirst({ where: { email } })
            
            if (us) {
                return res.status(500).json({ error: 'E-email já cadastrado' });
            }
            
            const pass = await encrypt(password)

            const user = await prisma.user.create({
                data: {
                    id: uuidv4(),
                    name,
                    email,
                    privilege,
                    password: pass,
                    
                }
            })

            return res.json(user)

        } catch (error) {
            return res.json(error)
        }
    },

    async getUsers(req, res) {
        const data = await prisma.user.findMany({
            orderBy: [
                {
                  id: 'desc',
                }
              ],
        })
        res.json(data)
    },

    async checkUser(req, res) {
       const {email, password} = req.body
        
        const data = await prisma.user.findFirst({
            where:{
                email: email
            }
        })
        if(data === null){
            return res.status(500).json({ error: 'Usuário ou senha inválido' });
        }
        //check pass
        if(bcrypt.compareSync(password, data.password)){
            return res.json(data)
        }else{
            return res.status(500).json({ error: 'Usuário ou senha inválido' });
        }
    },

    async delUser(req, res){
        try {
            const { id } = req.params
            const del = await prisma.user.delete({
                where: {
                    id: id
                }
            })
            return res.json(del)

        } catch (error) {
            return res.json(error)
        }
    },

    async getSingleUser(req, res){
        try {
            const { id } = req.params

            const data = await prisma.user.findFirst({
                where: {
                    id: id
                }
            })
            return res.json(data)

        } catch (error) {
            return res.json(error)
        }
    },

    async editUser(req, res){
        try {
            const {name, email, privilege } = req.body
            
            const { id } = req.params
            const us = await prisma.user.findFirst({ 
                    where: {
                        NOT: {
                            id: id,
                        }, 
                        email 
                    } 
                })
            
            if (us) {
                return res.status(500).json({ error: 'E-email já cadastrado' });
            }

            const user = await prisma.user.update({
                where: {
                    id: id
                },
                data: {
                    name,
                    email,
                    privilege,
                }
            })

            return res.json(user)

        } catch (error) {
            return res.json(error)
        }
    },

    async editPass(req, res){
        try {
            const {password} = req.body
            const { id } = req.params
            
            const pass = await encrypt(password)

            const user = await prisma.user.update({
                where: {
                    id: id
                },
                data: {
                    password: pass,
                }
            })

            return res.json(user)

        } catch (error) {
            return res.json(error)
        }
    },
    async checkEmailuser(req, res){
        try {
            const paramsBusca = new URLSearchParams(req.query)
            const email = paramsBusca.get('email')
            
            const data = await prisma.user.findFirst({
                where: {
                    email: email
                }
            })
            return res.json(data)

        } catch (error) {
            return res.json(error)
        }
    },
}
