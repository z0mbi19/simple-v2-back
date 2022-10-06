import { Router } from "express";
import { authenticate } from "./controller/AuthController";
import {
  getAllConsulta,
  getConsulta,
  storeConsulta,
  updateConsulta,
} from "./controller/ConsultaController";
import {
  excludMaterial,
  getAllMaterial,
  indexMaterial,
  storeMaterial,
  updateMaterial,
} from "./controller/MaterialController";
import {
  excludServico,
  getAllServico,
  indexServico,
  storeServico,
  updateServico,
} from "./controller/ServicoController";
import {
  desactiveUser,
  indexAllUser,
  indexUser,
  storeUser,
  updateUser,
} from "./controller/UserControler";
import {
  consultaMiddleware,
  materialMiddleware,
  servicoMiddleware,
  userMiddleware,
} from "./middlewares/yupMiddlewares";
import cors from "cors";
import {
  getAllPaciente,
  getPaciente,
  storePaciente,
  updatePaciente,
} from "./controller/PacienteController";

const router = Router();

router.post("/auth", authenticate);

//Use
router.post("/user", userMiddleware, storeUser);
router.put("/user/:id", userMiddleware, updateUser);
router.delete("/user/:id", desactiveUser);
router.get("/user/", indexAllUser);
router.get("/user/:id", indexUser);

//Paciente
router.get("/paciente/", getAllPaciente);
router.get("/paciente/:id", getPaciente);
router.put("/paciente/:id", userMiddleware, updatePaciente);
router.post("/paciente/", userMiddleware, storePaciente);
router.delete("/paciente/:id", desactiveUser);

//Serviço
router.get("/servico/", getAllServico);
router.get("/servico/:id", indexServico);
router.post("/servico", servicoMiddleware, storeServico);
router.put("/servico/:id", servicoMiddleware, updateServico);
router.delete("/servico/:id", excludServico);

//Material
router.get("/material/", getAllMaterial);
router.get("/material/:id", indexMaterial);
router.post("/material", materialMiddleware, storeMaterial);
router.put("/material/:id", materialMiddleware, updateMaterial);
router.delete("/material/:id", excludMaterial);

//Consulta
router.get("/consulta/", getAllConsulta);
router.get("/consulta/:id", getConsulta);
router.post("/consulta", consultaMiddleware, storeConsulta);
router.put("/consulta/:id", consultaMiddleware, updateConsulta);

// //Colaborador
// router.get("/dentista", authMiddleware, dentista);
// router.get("/colaborador", authMiddleware, allColaborador);
// router.get("/colaborador/id/:id", authMiddleware, idColaborador);
// router.get("/colaborador/nome", authMiddleware, nomeColaborador);
// router.get("/colaborador/cpf", authMiddleware, cpfColaborador);
// router.post("/colaborador", authMiddleware, storeColaborador);
// router.put("/colaborador/:id", authMiddleware, updateColaborador);
// router.delete("/colaborador/:id", authMiddleware, deleteColaborador);

export default router;
