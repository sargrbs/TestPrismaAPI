import prisma from './prisma'
import {v4 as uuidv4} from 'uuid';

export default {
    async createOcorrencia(req, res) {
        try {
            const { id } = req.params
            const ocorrencia = await prisma.ocorrencias.create({
                data: {
                    id: uuidv4(),
                    descricao: req.body.descricao,
                    order:{
                        connect: {id: id},
                    }
                },

            })

            return res.json(ocorrencia)

        } catch (error) {
            return res.json(error)
        }
    },

    async getOcorrencia(req, res) {

        const { id } = req.params
        const data = await prisma.ocorrencias.findMany({
            where: {
                orderId: id,
            }
        })
        res.json(data)
    },

    async delOcorrencia(req, res){
        try {
            const { id } = req.params
            const del = await prisma.ocorrencias.delete({
                where: {
                    id: id
                }
            })
            return res.json(del)

        } catch (error) {
            return res.json(error)
        }
    },

    async getSingleOcorrencia(req, res){
        try {
            const { id } = req.params

            const data = await prisma.ocorrencias.findFirst({
                where: {
                    id: id
                }
            })
            return res.json(data)

        } catch (error) {
            return res.json(error)
        }
    },

    async editOcorrencia(req, res){
        try{
            const {id}  = req.params

            const edit = await prisma.ocorrencias.update(
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
