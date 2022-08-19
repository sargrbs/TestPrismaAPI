import dotenv from 'dotenv'
dotenv.config()
import axios from 'axios'
import prisma from './prisma'
import {v4 as uuidv4} from 'uuid';
import crypto from "crypto"
import CryptoJS from 'crypto-js'
import Base64 from 'crypto-js/enc-base64';
            
function getSecondWord(w){
    const word = w.split(" ")
    return word[1]
}

export default {
    async getOrders(req, res){
        try{
            const params = new URLSearchParams(req.query)

            const start = params.get('start')
            const end = params.get('end')
            const number = params.get('number')
            const apikey = process.env.APIBLING
            
            let url = `https://bling.com.br/Api/v2/pedidos/json/&filters=dataEmissao[${start} TO ${end}]&apikey=${apikey}`
            
            if(number){
                url = `https://bling.com.br/Api/v2/pedido/${number}/json/&apikey=${apikey}`
            }
    
            const data = await axios.get(url)
            
           
    
            const ordersToImport =  data.data.retorno.pedidos
            
            const orders = []
    
            //Checking if order already has imported
            const verifyOrder = ordersToImport.map( async (order, index) => {
                const id = order.pedido.numero + "-" + order.pedido.cliente.id
               
                const orderCheck = await prisma.order.findFirst({ where: { id } })
                
                if(orderCheck === null){
                    orders.push(order)
                }
            })
            //await for verification 
            await Promise.all(verifyOrder)
    
            //Checking if marketplace exist
            const mktToCreate = []
            const verifyMarketplace = orders.map( async (ord) => {
                
                const mkt = ord?.pedido.tipoIntegracao === 'Api' 
                            ? 
                                getSecondWord(ord?.pedido.observacaointerna)+"-"+ord?.pedido.tipoIntegracao
                            : 
                            ord?.pedido.tipoIntegracao+"-"+ord?.pedido.intermediador.nomeUsuario
    
                const mktCheck = await prisma.marketplace.findFirst({ where: { nome: mkt } })
                
                if(mktCheck === null){
                    mktToCreate.push(mkt)
                }
                
            })
            //await for verification 
            await Promise.all(verifyMarketplace)
    
            if(mktToCreate){
                //Skip duplicates
                const createMany = [...new Set(mktToCreate)]
                //Create marketplaces 
                const create = createMany.map((mkt) => 
                    prisma.marketplace.create({
                        data: {
                            id: uuidv4(),
                            nome: mkt
                        }
                    })
                )
                await Promise.all(create)
            }
    
    
            const status = await prisma.status.findFirst({
                where: {
                    nome: 'Pedido Importado'
                }
            })
            
            return res.json({orders, status})
        }catch(error){
            console.log(error)
            const erro = "Houve um erro na conexão com a API bling, tente novamente mais tarde"
            return res.status(500).json(erro)
        }
    }
    
}