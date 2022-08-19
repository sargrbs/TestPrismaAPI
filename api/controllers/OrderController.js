import Moment from 'moment'
import prisma from './prisma'
import {v4 as uuidv4} from 'uuid';


export default {
    async createOrder(req, res) {
        try {
            const order = await prisma.order.create({
                data: {
                    id: uuidv4(),
                    data_venda: req.body.data_venda,
                    produto: req.body.produto,
                    volumes: req.body.volumes,
                    valor_total: parseFloat(req.body.valor_total),
                    nome_cliente: req.body.nome_cliente,
                    telefone_cliente: req.body.telefone_cliente,
                    cpf_cliente: req.body.cpf_cliente,
                    cep: req.body.cep,
                    endereco: req.body.endereco,
                    cidade: req.body.cidade,
                    bairro: req.body.bairro,
                    estado: req.body.estado,
                    produto_extra: req.body.produto_extra,
                    complemento: req.body.complemento,
                    marketplace: {
                        connect: { id: req.body.marketplace },
                    },
                    status: {
                        connect: { id: req.body.status },
                    },
                    empresas: {
                        connect: { id: req.body.empresa },
                    },
                    ocorrencias: {
                        create: {
                            id: uuidv4(),
                            descricao: 'Pedido Criado'
                        },
                    },
                    transportadora: {},
                    romaneio: {},
                    nivelAtraso: {},
                }
            })
            return res.json(order)

        } catch (error) {
            console.log(error)
            return res.json(error)
        }
    },

    async createManyOrders(req, res) {
        try{
            const data = req.body

            const orders = data.map((order) => 
                prisma.order.create({
                    data: order
                })
            )
            await Promise.all(orders)
            return res.json(orders)
        }catch (error){
            console.log(error)
            return res.json(error)
        }
    },
    async getHomeOrders(req, res) {
        try {
            const data = await prisma.order.findMany({
                include: {
                    transportadora: true,
                    status: true,
                    ocorrencias: true
                },
            })
            return res.json(data)
        } catch (error) {
            return res.json(error)
        }

    },
    async getOrders(req, res) {
        try{
            //const data = await prisma.order.findMany()

            //get url params for search query
            const paramsBusca = new URLSearchParams(req.query)
            const start = paramsBusca.get('start')
            const end = paramsBusca.get('end')
            const name = paramsBusca.get('name')
            const status = paramsBusca.get('status')
            const mkt = paramsBusca.get('mkt')
            const empr = paramsBusca.get('empr')
            const filterTr = paramsBusca.get('transp')

            
            
            const getStatusIdDelivered = await prisma.status.findFirst({
                where: {
                    nome: "Entregue",
                },
            })
            const getStatusIdDelayed = await prisma.status.findFirst({
                where: {
                    nome: "Atrasado",
                },
            })

            const data = await prisma.order.findMany({
                where: {
                    NOT: [
                        { statusId: getStatusIdDelivered.id},
                        { statusId: getStatusIdDelayed.id},

                    ]
                },
            })
            //update status if delayed
            const updateStatus = data.map(async (order) => {
                if (Moment(order.previsao_entrega).format('YYYY-MM-DD') < Moment().format('YYYY-MM-DD')) {
                    const edit = await prisma.order.update(
                        {
                            where: { id: order.id },
                            data: {
                                status: {
                                    connect: { id: getStatusIdDelayed.id },
                                }
                            }
                        }
                    )
                    return edit
                }
            })
            
            await Promise.all(updateStatus)
            
            

            //set params for pagination
            // const page = parseInt(paramsBusca.get('page')) - 1 || 0
            // const pageSize = 10
            // const currentSkip = pageSize * page
            // console.log(currentSkip, page)

            const orders = await prisma.order.findMany({
                // skip: currentSkip,
                // take: pageSize,
                where: {
                    data_venda: {
                        lte: end,
                        gte: start,
                    },
                    nome_cliente: {
                        contains: name,
                        mode: 'insensitive'
                    },
                    ...(status != 0 ? { statusId: status } : {}),
                    ...(mkt != 0 ? { marketplaceId: mkt } : {}),
                    ...(empr != 0 ? { empresasId: empr } : {}),
                    ...(filterTr != 0 ? { transportadoraId: filterTr } : {}),
                    
                },
                include:{
                    marketplace: true,
                    status: true,
                    empresas: true,
                    transportadora: true,
                    nivelAtraso: true,
                    ocorrencias: true,
                },
                orderBy: {
                    data_venda: 'desc'
                },
            })
            
            //count number of itens for pagination
            const totalData = await prisma.order.count({
                where: {
                    data_venda: {
                        lte: end,
                        gte: start,
                    },
                    nome_cliente: {
                        contains: name,
                        mode: 'insensitive'
                    },
                    ...(status != 0 ? { statusId: status } : {}),
                    ...(mkt != 0 ? { marketplaceId: mkt } : {}),
                    ...(empr != 0 ? { empresasId: empr } : {}),
                    ...(filterTr != 0 ? { transportadoraId: filterTr } : {}),
                },
            })
            const getTotalOrders = Math.ceil(totalData / 10)

            return res.json({ orders, getTotalOrders, getStatusIdDelivered, totalData })
        } catch (error){
            console.log(error)
            return res.json(error)
        }
    },

    async delOrder(req, res) {
        try {
            const { id } = req.params
            try {
                const delOcorr = await prisma.ocorrencias.deleteMany({
                    where: { orderId: id },
                })
                const del = await prisma.order.delete({
                    where: {
                        id: id,
                    }
                })

                return res.json({ order: delOcorr, ocorrencia: delOcorr })
            } catch (error) {
                return res.json(error)
            }

        } catch (error) {
            return res.json(error)
        }
    },

    async getSingleOrder(req, res) {
        try {
            const { id } = req.params
            const data = await prisma.order.findFirst({
                where: {
                    id: id
                }
            })
            return res.json(data)

        } catch (error) {
            return res.json(error)
        }
    },

    async editOrder(req, res) {
        try {
            const { id } = req.params

            // console.log(parseFloat(req.body.valor_total).toFixed(2))

            try {
                const edit = await prisma.order.update(
                    {
                        where: {
                            id: id
                        },
                        data: {
                            nfe: req.body.nfe,
                            previsao_entrega: req.body.previsao_entrega,
                            produto: req.body.produto,
                            numero_serie: req.body.numero_serie,
                            valor_total: parseFloat(req.body.valor_total).toFixed(2),
                            nome_cliente: req.body.nome_cliente,
                            telefone_cliente: req.body.telefone_cliente,
                            cpf_cliente: req.body.cpf_cliente,
                            cidade: req.body.cidade,
                            protocolo_cotacao: req.body.protocolo_cotacao,
                            valor_frete: parseFloat(req.body.valor_frete).toFixed(2),
                            volumes: req.body.volumes,
                            cep: req.body.cep,
                            endereco: req.body.endereco,
                            bairro: req.body.bairro,
                            estado: req.body.estado,
                            complemento: req.body.complemento,
                            produto_extra: req.body.produto_extra,
                            marketplace: {
                                connect: { id: req.body.marketplace },
                            },
                            status: {
                                connect: { id: req.body.status },
                            },
                            empresas: {
                                connect: { id: req.body.empresa },
                            },
                            transportadora: {
                                connect: { id: req.body.transportadora },
                            }
                        }
                    }
                )
                return res.json(edit)

            } catch (error) {
                return res.json(error)
            }
        } catch (error) {
            return res.json(error)
        }
    },

    async editSttsOrder(req, res) {
        try {
            const { id } = req.params
            const getNivelAtraso = await prisma.nivelAtraso.findFirst({
                where: {
                    descricao: "Atrasado",
                },
            })
            const getStatusIdDelayed = await prisma.status.findFirst({
                where: {
                    nome: "Atrasado",
                },
            })
            try {
                
                const edit = await prisma.order.update(
                    {
                        where: { id: id },
                        data: { 
                            status: { connect: { id: req.body.status }},
                            ...(req.body.status === getStatusIdDelayed.id 
                                ? 
                                    { nivelAtraso: { connect: {id: getNivelAtraso.id} } } 
                                :   { nivelAtraso: { disconnect: true } } 
                            )
                        }
                    }
                )
                return res.json(edit)
               
            } catch (error) {
                return res.json(error)
            }
        } catch (error) {
            return res.json(error)
        }
    },

    async editNvAtrOrder(req, res) {
        try {
            const { id } = req.params
            try {
                const edit = await prisma.order.update(
                    {
                        where: {
                            id: id
                        },
                        data: {
                            nivelAtraso: {
                                connect: { id: req.body.nivelAtraso },
                            },
                        }
                    }
                )
                return res.json(edit)
            } catch (error) {
                return res.json(error)
            }
        } catch (error) {
            return res.json(error)
        }
    },
    async editEmpresaOrder(req, res) {
        try {
            const { id } = req.params
            try {
                const edit = await prisma.order.update(
                    {
                        where: {
                            id: id
                        },
                        data: {
                            empresas: {
                                connect: { id: req.body.empresa },
                            },
                        }
                    }
                )
                return res.json(edit)
            } catch (error) {
                return res.json(error)
            }
        } catch (error) {
            return res.json(error)
        }
    },

    async editVidOrder(req, res) {
        try {
            const { id } = req.params
            try {
                const edit = await prisma.order.update(
                    {
                        where: {
                            id: id,
                        },
                        data: {
                            video: req.body.video,
                        }
                    }
                )
                return res.json(edit)
            } catch (error) {
                return res.json(error)
            }
        } catch (error) {
            return res.json(error)
        }
    },

    async editRastOrder(req, res) {
        try {
            const { id } = req.params
            try {
                const edit = await prisma.order.update(
                    {
                        where: {
                            id: id,
                        },
                        data: {
                            rastreio: req.body.rastreio,
                        }
                    }
                )
                return res.json(edit)
            } catch (error) {
                return res.json(error)
            }
        } catch (error) {
            return res.json(error)
        }
    },

    async editStatusOrderAt(req, res) {
        try {
            const { id } = req.params

            const edit = await prisma.order.update(
                {
                    where: {
                        id: id
                    },
                    data: {
                        status: {
                            connectOrCreate: {
                                create: {
                                    id: uuidv4(),
                                    nome: 'Atrasado',
                                },
                                where: {
                                    nome: 'Atrasado',
                                },
                            },
                        },
                        nivelAtraso: {
                            connectOrCreate: {
                                create: {
                                    id: uuidv4(),
                                    codigo: 1,
                                    descricao: 'Aceitável',
                                },
                                where: {
                                    codigo: 1,
                                },
                            }
                        },
                    },
                }
            )
            return res.json(edit)
        } catch (error) {
            return res.json(error)
        }
    },

    async getDayOrder(req, res) {
        try {
            const date = Moment(new Date()).format('YYYY-MM-DDT00:00:00.000Z')
            const { id } = req.params
            const result = await prisma.order.findMany({
                where: {
                    updated_at: date,
                    transportadoraId: id,
                    romaneioId: null
                },

            })

            return res.json(result)
        } catch (error) {
            return res.json(error)
        }
    },

    async getBikeList(req, res) {
        const getStatus = await prisma.status.findFirst({
            where: {
                nome: "Pedido Importado",
            },
        })
        try {
            
            const result = await prisma.order.findMany({
                where: {
                    statusId: getStatus.id,
                },

            })

            return res.json(result)
        } catch (error) {
            return res.json(error)

            
        }
    },
    async searchOrder(req, res) {
        const paramsBusca = new URLSearchParams(req.query)
        const cpf = paramsBusca.get('cpf')
        try {   
            
            const result = await prisma.order.findFirst({
                where: {
                    cpf_cliente: cpf
                },
                include:{
                    status: true,
                    empresas: true,
                    transportadora: true,
                },
            })
            return res.json(result)
        } catch (error) {
            return res.json(error)

            
        }
    }
}
