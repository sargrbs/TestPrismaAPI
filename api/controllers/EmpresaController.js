import prisma from './prisma'
import {v4 as uuidv4} from 'uuid';

export default {
    async createEmpresa(req, res) {
        try {
            const { razao_social, cnpj } = req.body

            const emp = await prisma.empresas.findFirst({ where: { cnpj } })
            
            if (emp) {
                
                return res.status(500).json({ error: 'CNPJ já cadastrado' });
            }
            const empresa = await prisma.empresas.create({
                data: {
                    id: uuidv4(),
                    razao_social,
                    cnpj
                }
            })

            return res.json(empresa)

        } catch (error) {
            return res.json(error)
        }
    },

    async getEmpresa(req, res) {
        const data = await prisma.empresas.findMany({
            orderBy: [
                {
                  id: 'desc',
                }
              ],
        })
        res.json(data)
    },

    async delEmpresa(req, res){
        try {
            const { id } = req.params
            const del = await prisma.empresas.delete({
                where: {
                    id: id
                }
            })
            return res.json(del)

        } catch (error) {
            return res.json(error)
        }
    },

    async getSingleEmpre(req, res){
        try {
            const { id } = req.params

            const data = await prisma.empresas.findFirst({
                where: {
                    id: id
                }
            })
            return res.json(data)

        } catch (error) {
            return res.json(error)
        }
    },

    async editEmpree(req, res){
        try{
            const {id}  = req.params

            const edit = await prisma.empresas.update(
                {
                    where: {
                        id: id
                    },
                    data:{
                        razao_social: req.body.razao_social,
                        cnpj: req.body.cnpj,
                    }
                }
            )
            return res.json(edit)
        }catch (error) {
            return res.json(error)
        }
    }
}
