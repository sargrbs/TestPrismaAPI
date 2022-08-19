import prisma from './prisma'
import {v4 as uuidv4} from 'uuid';


export default {
    async createNivelAtraso(req, res) {
        try {
            const nv = await prisma.nivelAtraso.findFirst({ where: { codigo: req.body.codigo } })
            
            if (nv) {
                return res.status(500).json({ error: 'Código já cadastrado' });
            }
            const nvatr = await prisma.nivelAtraso.create({
                data: {
                    id: uuidv4(),
                    codigo: req.body.codigo,
                    descricao: req.body.descricao
                }
            })

            return res.json(nvatr)

        } catch (error) {
            return res.json(error)
        }
    },

    async getNivelAtraso(req, res) {
        const data = await prisma.nivelAtraso.findMany()
        res.json(data)
    },

    async getSingleNvAtr(req, res){
        try {
            const { id } = req.params

            const status = await prisma.nivelAtraso.findFirst({
                where: {
                    id: id
                }
            })
            return res.json(status)

        } catch (error) {
            return res.json(error)
        }
    },

    async delNivelAtraso(req, res){
        try {
            const { id } = req.params
            const del = await prisma.nivelAtraso.delete({
                where: {
                    id: id
                }
            })
            return res.json(del)

        } catch (error) {
            return res.json(error)
        }
    },
}
