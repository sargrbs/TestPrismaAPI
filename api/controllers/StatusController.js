import prisma from './prisma'
import {v4 as uuidv4} from 'uuid';


export default {
    async createStatus(req, res) {
        try {
            try{
                const status = await prisma.status.create({
                    data: {
                        id: uuidv4(),
                        nome: req.body.nome,
                        cor: req.body.cor,
                    }
                })
                return res.json(status)
            }catch (error){
                return res.json(error)
            }

        } catch (error) {
            return res.json(error)
        }
    },

    async getStatus(req, res) {
        const data = await prisma.status.findMany({
            include:{
                order: true,
            },
        })
        return res.json(data)
    },

    async getStatusHome(req, res) {

        const paramsBusca = new URLSearchParams(req.query)
        const start = paramsBusca.get('start')
        const end = paramsBusca.get('end')

        const data = await prisma.status.findMany({
            include: {
                order: {
                    where:{
                        data_venda: {
                            lte: end,
                            gte: start,
                        },
                    }
                },
            },
        })
        return res.json(data)
    },

    async delStatus(req, res){
        try {
            const { id } = req.params
            const del = await prisma.status.delete({
                where: {
                    id: id
                }
            })
            return res.json(del)

        } catch (error) {
            return res.json(error)
        }
    },

    async getSingleStatus(req, res){
        try {
            const { id } = req.params

            const status = await prisma.status.findFirst({
                where: {
                    id: id
                }
            })
            return res.json(status.cor)

        } catch (error) {
            return res.json(error)
        }
    },

    async editStatus(req, res){
        try{
            const {id}  = req.params

            const edit = await prisma.status.update(
                {
                    where: {
                        id: id
                    },
                    data:{
                        nome: req.body.nome,
                    }
                }
            )
            return res.json(edit)
        }catch (error) {
            return res.json(error)
        }
    }
}
