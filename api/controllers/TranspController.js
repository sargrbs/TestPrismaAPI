import prisma from './prisma'
import {v4 as uuidv4} from 'uuid';

export default {
    async createTransp(req, res) {
        try {
            const { nome, telefone, nome_contato, link} = req.body

            const tp = await prisma.transportadora.findFirst({ where: {nome}})

            if (tp) {
                return res.status(500).json({ error: 'Transportadora já cadastrada' });
            }
            const trnsp = await prisma.transportadora.create({
                data: {
                    id: uuidv4(),
                    nome,
                    telefone,
                    nome_contato,
                    link
                }
            })
            return res.json(trnsp)

        } catch (error) {
            return res.json(error)
        }
    },

    async getTransp(req, res){
        const data = await prisma.transportadora.findMany({
            
            orderBy: [
                {
                  id: 'desc',
                }
              ],
        })
        res.json(data)
    },

    async getTranspHome(req, res){
        //get url params for search query
        const paramsBusca = new URLSearchParams(req.query)
        const start = paramsBusca.get('start')
        const end = paramsBusca.get('end')
        const data = await prisma.transportadora.findMany({
            where:{
                NOT: {
                    nome: "Sem Transportadora",
                },
            },
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

        const getStatusIdDelayed = await prisma.status.findFirst({
            where: {
                nome: "Atrasado"
            }
        })
        const getStatusIdDelivered = await prisma.status.findFirst({
            where: {
                nome: "Entregue"
            }
        })

        const trDelayed = await prisma.transportadora.findMany({
            where:{
                NOT: {
                    nome: "Sem Transportadora",
                },
            },
            include: {
                order: {
                    where:{
                        data_venda: {
                            lte: end,
                            gte: start,
                        },
                        statusId: getStatusIdDelayed.id,
                    }
                }
            },
            orderBy: [
                {
                    id: 'desc',
                }
                ],
        })

        const trDelivered = await prisma.transportadora.findMany({
            where:{
                NOT: {
                    nome: "Sem Transportadora",
                },
            },
            include: {
                order: {
                    where:{
                        data_venda: {
                            lte: end,
                            gte: start,
                        },
                        statusId: getStatusIdDelivered.id,
                    }
                }
            },
            orderBy: [
                {
                    id: 'desc',
                }
                ],
        })

       return res.json({data, trDelayed, trDelivered})
    },

    async delTransp(req, res){
        try {
            const { id } = req.params
            const del = await prisma.transportadora.delete({
                where: {
                    id: id
                }
            })
            return res.json(del)

        } catch (error) {
            return res.json(error)
        }
    },

    async getSingle(req, res){
        try {
            const { id } = req.params

            const data = await prisma.transportadora.findFirst({
                where: {
                    id: id
                }
            })
            return res.json(data)

        } catch (error) {
            return res.json(error)
        }
    },

    async editTransp(req, res){
        try{
            const {id}  = req.params

            const edit = await prisma.transportadora.update(
                {
                    where: {
                        id: id
                    },
                    data:{
                        nome: req.body.nome,
                        telefone: req.body.telefone,
                        nome_contato: req.body.nome_contato,
                        link: req.body.link
                    }
                }
            )
            return res.json(edit)
        }catch (error) {
            return res.json(error)
        }
    }
}