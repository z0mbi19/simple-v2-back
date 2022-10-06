import { Prisma, PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function getAllPaciente(req: Request, res: Response) {
  const result = await prisma.user.findMany({
    where: {
      colaborador: null,
      ativo: true,
    },
  });

  return res.json(result);
}

export async function getPaciente(req: Request, res: Response) {
  const result = await prisma.user.findMany({
    where: {
      id: parseInt(req.params.id),
      colaborador: null,
      ativo: true,
    },
  });

  return res.json(result);
}

export async function storePaciente(req: Request, res: Response) {
  const {
    email,
    nome,
    senha,
    cpf,
    nascimento,
    sexo,
    endereco,
    cep,
    cidade,
    uf,
    telefone,
  } = req.body;

  const emailExist = await prisma.user.findFirst({
    where: {
      email,
    },
  });
  const cpfExist = await prisma.user.findFirst({
    where: {
      cpf,
    },
  });

  const telefoneExist = await prisma.user.findFirst({
    where: {
      telefone,
    },
  });

  if (emailExist) {
    return res.status(500).send("Email já cadastrado");
  }
  if (cpfExist) {
    return res.status(500).send("CPF já cadastrado");
  }
  if (telefoneExist) {
    return res.status(500).send("Telefone já cadastrado");
  }

  let user: Prisma.UserCreateInput;

  user = {
    email,
    nome,
    senha: bcrypt.hashSync(senha, 8),
    cpf,
    nascimento: new Date(nascimento).toISOString(),
    sexo,
    endereco,
    cep,
    cidade,
    uf,
    telefone,
  };

  await prisma.user.create({ data: user });

  return res.status(200).send("ok");
}

export async function updatePaciente(req: Request, res: Response) {
  const {
    email,
    nome,
    senha,
    cpf,
    nascimento,
    sexo,
    endereco,
    cep,
    cidade,
    uf,
    telefone,
  } = req.body;

  const emailExist = await prisma.user.findFirst({
    where: {
      NOT: { id: parseInt(req.params.id) },
      email,
    },
  });
  const cpfExist = await prisma.user.findFirst({
    where: {
      NOT: { id: parseInt(req.params.id) },
      cpf,
    },
  });

  const telefoneExist = await prisma.user.findFirst({
    where: {
      NOT: { id: parseInt(req.params.id) },
      telefone,
    },
  });

  if (emailExist) {
    return res.status(500).send("Email já cadastrado");
  }
  if (cpfExist) {
    return res.status(500).send("CPF já cadastrado");
  }
  if (telefoneExist) {
    return res.status(500).send("Telefone já cadastrado");
  }

  let user: Prisma.UserCreateInput;

  user = {
    email,
    nome,
    senha: bcrypt.hashSync(senha, 8),
    cpf,
    nascimento: new Date(nascimento).toISOString(),
    sexo,
    endereco,
    cep,
    cidade,
    uf,
    telefone,
  };

  await prisma.user.update({
    where: { id: parseInt(req.params.id) },
    data: user,
  });

  return res.status(200).send("ok");
}

export async function desactivePaciente(req: Request, res: Response) {
  const result = await prisma.user.update({
    where: {
      id: parseInt(req.params.id),
    },
    data: { ativo: false },
  });

  return res.json(result);
}
