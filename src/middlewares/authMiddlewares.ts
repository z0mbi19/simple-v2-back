import { Prisma, PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

interface TokenPayload {
  id: string;
  iat: number;
  exp: number;
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.sendStatus(401);
  }

  const token = authorization.replace("Bearer", "").trim();

  try {
    const data = jwt.verify(token, "chave esta aqui porque e so um teste");

    const { id } = data as TokenPayload;
    req.userId = id;
    res.locals.jwtPayload = id;
    return next();
  } catch {
    return res.sendStatus(401);
  }
}

export async function colaboradorVerify(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.userId) {
    return res.status(500).send("Você não esta logado");
  }
  const admUser = await prisma.user.findFirst({
    where: {
      id: parseInt(req.userId),
    },
    include: {
      colaborador: true,
    },
  });

  if (!admUser?.colaborador) {
    return res
      .status(500)
      .send(
        "Você não tem permissão para isso fale com algum administrador do sistema "
      );
  }
  return next();
}
