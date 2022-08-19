import prisma from './prisma'
import {v4 as uuidv4} from 'uuid';

export default {
    async createMkt(req, res) {
        try {
            const { nome } = req.body

            const emp = await prisma.marketplace.findFirst({ where: { nome } })
            
            if (emp) {
                return res.status(500).json({ error: 'MarketPlace já cadastrado' });
            }
            const market = await prisma.marketplace.create({
                data: {
                    id: uuidv4(),
                    nome
                }
            })

            return res.json(market)

        } catch (error) {
            return res.json(error)
        }
    },

    async getMkt(req, res) {
        const data = await prisma.marketplace.findMany({
            orderBy: [
                {
                  id: 'desc',
                }
              ],
        })
        res.json(data)
    },
    async getMktHome(req, res) {

        const paramsBusca = new URLSearchParams(req.query)
        const start = paramsBusca.get('start')
        const end = paramsBusca.get('end')

        const data = await prisma.marketplace.findMany({
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
            orderBy: [
                {
                  id: 'desc',
                }
              ],
        })
        res.json(data)
    },

    async delMkt(req, res){
        try {
            const { id } = req.params
            const del = await prisma.marketplace.delete({
                where: {
                    id: id
                }
            })
            return res.json(del)

        } catch (error) {
            return res.json(error)
        }
    },

    async getSingleMkt(req, res){
        try {
            const { id } = req.params

            const data = await prisma.marketplace.findFirst({
                where: {
                    id: id
                }
            })
            return res.json(data)

        } catch (error) {
            return res.json(error)
        }
    },

    async editMkt(req, res){
        try{
            const {id}  = req.params

            const edit = await prisma.marketplace.update(
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
