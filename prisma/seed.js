import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

import {v4 as uuidv4} from 'uuid'


async function main() {
    const empresas = await prisma.empresas.createMany({
      data: [
        {id: uuidv4(), cnpj: '00.000.000/9999-99', razao_social: 'TESTE EIRELI'},
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
        ]
    })

    const user = await prisma.user.createMany({
      data: [
        {id: uuidv4(), name: 'USER', email: 'user@teste.com.br', password: '$2b$10$oZXg8lVoADS2nu9LqctGwun5H3fW234aE1KoEe7YBcWjc8IECXQFW', privilege: '1'}
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
