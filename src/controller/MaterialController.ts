import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export async function getAllMaterial(req: Request, res: Response) {
  const result = await prisma.material.findMany();
  return res.json(result);
}

export async function indexMaterial(req: Request, res: Response) {
  const result = await prisma.material.findFirst({
    where: {
      id: parseInt(req.params.id),
    },
  });
  return res.json(result);
}

export async function storeMaterial(req: Request, res: Response) {
  const { nome } = req.body;
  const materialExist = await prisma.material.findFirst({
    where: { nome: nome },
  });

  if (materialExist) {
    return res.status(500).send("Material já cadastrado");
  }

  await prisma.material.create({ data: { ...req.body } });

  return res.status(200).send("ok");
}

export async function updateMaterial(req: Request, res: Response) {
  const { nome } = req.body;
  const materialExist = await prisma.material.findFirst({
    where: {
      NOT: { id: parseInt(req.params.id) },
      nome: nome,
    },
  });

  if (materialExist) {
    return res.status(500).send("Material já cadastrado");
  }

  await prisma.material.update({
    where: {
      id: parseInt(req.params.id),
    },
    data: { ...req.body },
  });

  return res.status(200).send("ok");
}

export async function excludMaterial(req: Request, res: Response) {
  const materialExist = await prisma.material.findFirst({
    where: { id: parseInt(req.params.id) },
  });

  if (!materialExist) {
    return res.status(500).send("Material não esta cadastrado");
  }

  await prisma.material.delete({ where: { id: parseInt(req.params.id) } });

  return res.status(200).send("ok");
}
