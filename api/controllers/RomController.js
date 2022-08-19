import prisma from './prisma'
import Moment from 'moment'
import {v4 as uuidv4} from 'uuid';


export default {
    async createRom(req, res) {
        try {
            const { data_coleta, 
                transportadora, 
                orders,
                qtd_volumes } = req.body
            const rom = await prisma.romaneio.create({
                data: {
                    id: uuidv4(),
                    data_coleta: Moment(data_coleta).format('YYYY-MM-DDT00:00:00.000Z'),
                    qtd_volumes: qtd_volumes,
                    transportadora: {
                        connect: {id: transportadora},
                    },
                    order: {
                        connect: orders?.map(id => ({id: id}))
                    }
                }
            })
            return res.json(rom)
            
        } catch (error) {
            return res.json(error)
        }
    },

    async getRom(req, res) {
        const data = await prisma.romaneio.findMany({
            include: {
                order: true,
                transportadora: true,
              },
        })
        return res.json(data)
    },

    async delRom(req, res){
        try {
            const { id } = req.params
            const del = await prisma.romaneio.delete({
                where: {
                    id: id
                }
            })
            return res.json(del)

        } catch (error) {
            return res.json(error)
        }
    },

    async getSingleRom(req, res){
        try {
            const { id } = req.params

            const data = await prisma.romaneio.findFirst({
                where: {
                    id: id
                },
                include: {
                    order: true,
                    transportadora: true,
                  },
            })
            return res.json(data)

        } catch (error) {
            return res.json(error)
        }
    },

    async editRom(req, res){
        try{
            const {id}  = req.params

            const edit = await prisma.romaneio.update(
                {
                    where: {
                        id: id
                    },
                    data:{
                        responsavel_coleta: req.body.responsavel_coleta,
                    }
                }
            )
            return res.json(edit)
        }catch (error) {
            return res.json(error)
        }
    }
}
