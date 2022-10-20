import { Router } from "express";
import { authenticate } from "./controller/AuthController";
import {
  deleteConsulta,
  getAllConsulta,
  getConsulta,
  getDadosForm,
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
  userNow,
  userNowEdit,
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
import {
  authMiddleware,
  colaboradorVerify,
} from "./middlewares/authMiddlewares";

const router = Router();

router.post("/auth", authenticate);

//Use
router.post("/user", authMiddleware, userMiddleware, storeUser);
router.put("/user/:id", authMiddleware, userMiddleware, updateUser);
router.delete("/user/:id", authMiddleware, desactiveUser);
router.get("/user/", authMiddleware, indexAllUser);
router.get("/usernow/", authMiddleware, userNow);
router.put("/usernow/", authMiddleware, userNowEdit);
router.get("/user/:id", authMiddleware, indexUser);

//Paciente
router.get("/paciente/", authMiddleware, colaboradorVerify, getAllPaciente);
router.get("/paciente/:id", authMiddleware, colaboradorVerify, getPaciente);
router.put(
  "/paciente/:id",
  authMiddleware,
  colaboradorVerify,
  userMiddleware,
  updatePaciente
);
router.post("/paciente/", userMiddleware, storePaciente);
router.delete(
  "/paciente/:id",
  authMiddleware,
  colaboradorVerify,
  desactiveUser
);

//Serviço
router.get("/servico/", authMiddleware, colaboradorVerify, getAllServico);
router.get("/servico/:id", authMiddleware, colaboradorVerify, indexServico);
router.post(
  "/servico",
  authMiddleware,
  colaboradorVerify,
  servicoMiddleware,
  storeServico
);
router.put(
  "/servico/:id",
  authMiddleware,
  colaboradorVerify,
  servicoMiddleware,
  updateServico
);
router.delete("/servico/:id", authMiddleware, colaboradorVerify, excludServico);

//Material
router.get("/material/", authMiddleware, getAllMaterial);
router.get("/material/:id", authMiddleware, indexMaterial);
router.post("/material", authMiddleware, materialMiddleware, storeMaterial);
router.put("/material/:id", authMiddleware, materialMiddleware, updateMaterial);
router.delete("/material/:id", authMiddleware, excludMaterial);

//Consulta
router.get("/consulta/", authMiddleware, getAllConsulta);
router.get("/consulta/:id", authMiddleware, getConsulta);
router.delete("/consulta/:id", deleteConsulta);
router.post("/consulta", authMiddleware, consultaMiddleware, storeConsulta);
router.put("/consulta/:id", authMiddleware, consultaMiddleware, updateConsulta);
router.get("/formconsulta/", authMiddleware, getDadosForm);

export default router;
