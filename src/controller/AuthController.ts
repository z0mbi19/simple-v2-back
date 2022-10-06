import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

//const prisma = new PrismaClient()
const prisma = new PrismaClient();

export async function authenticate(req: Request, res: Response) {
  const result = await prisma.user.findFirst({
    where: {
      ativo: true,
      email: req.body.email,
    },
    include: {
      colaborador: {
        include: {
          dentista: true,
        },
      },
    },
  });
  if (!result) {
    return res.status(401).send("Usuario ou senha invalido 😶");
  }

  const isValidPassword = await bcrypt.compare(req.body.senha, result.senha);

  if (!isValidPassword) {
    return res.status(401).send("Usuario ou senha invalido");
  }

  const token = jwt.sign(
    { id: result.id },
    "chave esta aqui porque e so um teste",
    { expiresIn: "1d" }
  );

  return res.json({
    jwt: token,
    id: result.id,
    colaborador: result.colaborador,
  });
}

export async function get(req: Request, res: Response) {
  return res.status(200).send("ok");
}
