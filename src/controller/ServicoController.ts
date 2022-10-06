import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export async function getAllServico(req: Request, res: Response) {
  const result = await prisma.servico.findMany();
  return res
    .status(200)
    .set("Content-Range", `posts 0-${result.length}/${result.length}`)
    .json(result);
}

export async function indexServico(req: Request, res: Response) {
  const result = await prisma.servico.findFirst({
    where: {
      id: parseInt(req.params.id),
    },
  });
  return res.json(result);
}

export async function storeServico(req: Request, res: Response) {
  const { nome, valor } = req.body;

  const servicoExist = await prisma.servico.findFirst({
    where: {
      nome: nome,
    },
  });

  if (servicoExist) {
    return res.status(500).send("Serviço já cadastrado");
  }

  const result = await prisma.servico.create({
    data: { nome, valor: parseFloat(valor) },
  });

  return res.json(result);
}

export async function updateServico(req: Request, res: Response) {
  const { nome, valor } = req.body;

  const servicoExist = await prisma.servico.findFirst({
    where: {
      NOT: { id: parseInt(req.params.id) },
      nome: nome,
    },
  });

  if (servicoExist) {
    return res.status(500).send("Serviço já cadastrado");
  }

  await prisma.servico.update({
    where: {
      id: parseInt(req.params.id),
    },
    data: { nome, valor: parseFloat(valor) },
  });

  return res.status(200).send("ok");
}

export async function excludServico(req: Request, res: Response) {
  const servicoExist = await prisma.servico.findFirst({
    where: { id: parseInt(req.params.id) },
  });

  if (!servicoExist) {
    return res.status(500).send("Serviço não esta cadastrado");
  }

  await prisma.servico.delete({ where: { id: parseInt(req.params.id) } });

  return res.status(200).send("ok");
}
