import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

import {v4 as uuidv4} from 'uuid'


async function main() {
    const empresas = await prisma.empresas.createMany({
      data: [
        {id: uuidv4(), cnpj: '18.841.300/0001-69', razao_social: 'ANA PAULA MARCZAK DE BORBA EIRELI'},
        {id: uuidv4(), cnpj: '10.220.594/0001-08', razao_social: 'MARCZAK CICLO PEÇAS EIRELI'}
      ]
    })

    const marketplace = await prisma.marketplace.createMany({
        data: [
          {id: uuidv4(), nome: 'Mercado Livre'},
          {id: uuidv4(), nome: 'Via Varejo'},
          {id: uuidv4(), nome: 'B2W'},
          {id: uuidv4(), nome: 'Magalu'},
        ]
    })

    const nivelAtraso = await prisma.nivelAtraso.createMany({
        data: [
          {id: uuidv4(), codigo: "0", descricao: 'Sem Atraso'}, 
          {id: uuidv4(), codigo: "1", descricao: 'Atrasado'}, 
        ]
    })

    const status = await prisma.status.createMany({
        data: [
          {id: uuidv4(), nome: 'Atrasado', cor: 'vermelho'}, 
          {id: uuidv4(), nome: 'Entregue', cor: 'verde'}, 
          {id: uuidv4(), nome: 'Em trânsito', cor: 'azul'}, 
          {id: uuidv4(), nome: 'Em produção', cor: 'laranja'}, 
          {id: uuidv4(), nome: 'Pedido Importado', cor: 'sem cor'}, 
        ]
    })

    const transportadora = await prisma.transportadora.createMany({
        data: [
          {id: uuidv4(), nome: 'Sem Transportadora', telefone: '99 99999-9999', nome_contato: 'Contato Indefinida'},
          {id: uuidv4(), nome: 'Fedex', telefone: '99 99999-9999', nome_contato: 'Contato Fedex'},
          {id: uuidv4(), nome: 'Rodonaves', telefone: '99 99999-9999', nome_contato: 'Contato Rodo'},
          {id: uuidv4(), nome: 'Braspress', telefone: '99 99999-9999', nome_contato: 'Contato Braspress'},
        ]
    })

    const user = await prisma.user.createMany({
      data: [
        {id: uuidv4(), name: 'Rubens', email: 'rubens@oms.com.br', password: '$2b$10$oZXg8lVoADS2nu9LqctGwun5H3fW234aE1KoEe7YBcWjc8IECXQFW', privilege: '1'}
      ]
  })

}
  
  main()
    .catch((e) => {
      console.error(e)
      process.exit(1)
    })
    .finally(async () => {
      await prisma.$disconnect()
    })