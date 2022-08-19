import { Router } from 'express';

import EmpresaController from './controllers/EmpresaController'  
import TranspController from './controllers/TranspController'  
import MktController from './controllers/MktController'  
import RomController from './controllers/RomController'  
import OrderController from './controllers/OrderController'  
import StatusController from './controllers/StatusController'  
import OcorrenciaController from './controllers/OcorrenciaController'  
import NivelAtrasoController from './controllers/NivelAtrasoController'  
import UserController from './controllers/UserController'  
import ApiBling from './controllers/ApiBling';

const router = Router();

router.post("/newEmpresa", EmpresaController.createEmpresa)
router.get("/getEmpresas", EmpresaController.getEmpresa)
router.get("/getSingleEmpre/:id", EmpresaController.getSingleEmpre)
router.put("/editEmpresa/:id", EmpresaController.editEmpree)
router.delete("/deltEmpresas/:id", EmpresaController.delEmpresa)

router.post("/newTransp", TranspController.createTransp)
router.get("/getTransp", TranspController.getTransp)
router.get("/getTranspHome", TranspController.getTranspHome)
router.delete("/delTr/:id", TranspController.delTransp)
router.get("/getSingleTransp/:id", TranspController.getSingle)
router.put("/editTransp/:id", TranspController.editTransp)

router.post("/newMkt", MktController.createMkt)
router.get("/getMkt", MktController.getMkt)
router.get("/getMktHome", MktController.getMktHome)
router.delete("/delMkt/:id", MktController.delMkt)
router.get("/getSingleMkt/:id", MktController.getSingleMkt)
router.put("/editMkt/:id", MktController.editMkt)

router.post("/newRom", RomController.createRom)
router.get("/getRom", RomController.getRom)
router.delete("/delRom/:id", RomController.delRom)
router.get("/getSingleRom/:id", RomController.getSingleRom)
router.put("/editRom/:id", RomController.editRom)

router.post("/newOrder", OrderController.createOrder)
router.post("/manyOrders", OrderController.createManyOrders)
router.get("/getOrders", OrderController.getOrders)
router.get("/getHomeOrders", OrderController.getHomeOrders)
router.delete("/delOrder/:id", OrderController.delOrder)
router.get("/getSingleOrder/:id", OrderController.getSingleOrder)
router.put("/editOrder/:id", OrderController.editOrder)
router.put("/editSttsOrder/:id", OrderController.editSttsOrder)
router.put("/editVidOrder/:id", OrderController.editVidOrder)
router.put("/editRastOrder/:id", OrderController.editRastOrder)
router.put("/editNvAtrOrder/:id", OrderController.editNvAtrOrder)
router.put("/editStatusOrderAt/:id", OrderController.editStatusOrderAt)
router.put("/editEmpresaOrder/:id", OrderController.editEmpresaOrder)
router.get("/getdayorder/:id", OrderController.getDayOrder)
router.get("/getBikeList", OrderController.getBikeList)
router.get("/searchOrder", OrderController.searchOrder)

router.post("/newStatus", StatusController.createStatus)
router.get("/getStatus", StatusController.getStatus)
router.get("/getStatusHome", StatusController.getStatusHome)
router.delete("/delStatus/:id", StatusController.delStatus)
router.get("/getSingleStatus/:id", StatusController.getSingleStatus)
router.put("/editStatus/:id", StatusController.editStatus)

router.post("/newNivelAtraso", NivelAtrasoController.createNivelAtraso)
router.get("/getNivelAtraso", NivelAtrasoController.getNivelAtraso)
router.get("/getSingleNvAtr/:id", NivelAtrasoController.getSingleNvAtr)
router.delete("/delNivelAtraso/:id", NivelAtrasoController.delNivelAtraso)

router.post("/newOcorrencia/:id", OcorrenciaController.createOcorrencia)
router.get("/getOcorrencia/:id", OcorrenciaController.getOcorrencia)
router.delete("/delOcorrencia/:id", OcorrenciaController.delOcorrencia)
router.get("/getSingleOcorrencia/:id", OcorrenciaController.getSingleOcorrencia)
router.put("/editOcorrencia/:id", OcorrenciaController.editOcorrencia)

router.post("/newUser", UserController.createUser)
router.get("/getUsers", UserController.getUsers)
router.post("/checkUser", UserController.checkUser)
router.get("/getSingleUser/:id", UserController.getSingleUser)
router.get("/checkEmailuser", UserController.checkEmailuser)
router.delete("/delUser/:id", UserController.delUser)
router.put("/editUser/:id", UserController.editUser)
router.put("/editUserpass/:id", UserController.editPass)

router.get("/importOrders", ApiBling.getOrders)

export { router }