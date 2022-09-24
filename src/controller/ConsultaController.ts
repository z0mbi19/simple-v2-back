import { Prisma, PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export async function getAllConsulta(req: Request, res: Response) {
  const result = await prisma.consulta.findMany();

  return res.json(result);
}

export async function getConsulta(req: Request, res: Response) {
  const result = await prisma.consulta.findMany({
    where: {
      id: parseInt(req.params.id),
    },
  });

  return res.json(result);
}

export async function storeConsulta(req: Request, res: Response) {
  const { consulta, plano, validadePlano, material, servico, userId, croID } =
    req.body;

  if (new Date(consulta).getTime() < new Date().getTime()) {
    return res
      .status(500)
      .send("A data da consulta não pode ser menor que a de hoje");
  }

  if (new Date(consulta).getHours() < 8 || new Date(consulta).getHours() > 18) {
    return res.status(500).send("Consultorio fechado");
  }

  const consultaExist = await prisma.consulta.findFirst({
    where: {
      consulta: new Date(consulta).toISOString(),
      croID,
    },
  });

  if (consultaExist) {
    return res.status(500).send("Esse horario já esta ocupado");
  }

  const userExist = await prisma.user.findFirst({
    where: {
      id: userId,
      colaboradorId: null,
    },
  });

  if (!userExist) {
    return res.status(500).send("Paciente não existe");
  }

  const dentistaExist = await prisma.dentista.findFirst({
    where: {
      cro: croID,
    },
  });

  if (!dentistaExist) {
    return res.status(500).send("Dentista não existe");
  }

  if (servico) {
    const idService = servico.map((s: any) => s.id);

    const servicoExist = await prisma.servico.findMany({
      where: {
        id: { in: idService },
      },
    });

    if (servicoExist.length !== servico.length) {
      return res.status(500).send("Servico não existe");
    }
  }

  if (material) {
    const idMaterial = material.map((s: any) => s.id);

    const materialExist = await prisma.material.findMany({
      where: {
        id: { in: idMaterial },
      },
    });

    if (materialExist.length !== material.length) {
      return res.status(500).send("material não existe");
    }
  }

  let consu: Prisma.ConsultaCreateInput;

  consu = {
    consulta: new Date(consulta).toISOString(),
    dentista: { connect: { cro: croID } },
    user: { connect: { id: userId } },
    servico: { connect: servico },
    material: { connect: material },
    plano,
    validadePlano: new Date(validadePlano).toISOString(),
  };

  const test = await prisma.consulta.create({
    data: consu,
  });

  return res.json({ servico, test });
}

export async function updateConsulta(req: Request, res: Response) {
  const { consulta, plano, validadePlano, material, servico, userId, croID } =
    req.body;

  if (new Date(consulta).getTime() < new Date().getTime()) {
    return res
      .status(500)
      .send("A data da consulta não pode ser menor que a de hoje");
  }

  if (new Date(consulta).getHours() < 8 || new Date(consulta).getHours() > 18) {
    return res.status(500).send("Consultorio fechado");
  }

  const consultaExist = await prisma.consulta.findFirst({
    where: {
      NOT: { id: parseInt(req.params.id) },
      consulta: new Date(consulta).toISOString(),
      croID,
    },
  });

  if (consultaExist) {
    return res.status(500).send("Esse horario já esta ocupado");
  }

  const userExist = await prisma.user.findFirst({
    where: {
      id: userId,
      colaboradorId: null,
    },
  });

  if (!userExist) {
    return res.status(500).send("Paciente não existe");
  }

  const dentistaExist = await prisma.dentista.findFirst({
    where: {
      cro: croID,
    },
  });

  if (!dentistaExist) {
    return res.status(500).send("Dentista não existe");
  }

  if (servico) {
    await prisma.consulta.update({
      where: { id: parseInt(req.params.id) },
      data: { servico: { set: [] } },
    });

    const idService = servico.map((s: any) => s.id);

    const servicoExist = await prisma.servico.findMany({
      where: {
        id: { in: idService },
      },
    });

    if (servicoExist.length !== servico.length) {
      return res.status(500).send("Servico não existe");
    }
  }

  if (material) {
    await prisma.consulta.update({
      where: { id: parseInt(req.params.id) },
      data: { material: { set: [] } },
    });

    const idMaterial = material.map((s: any) => s.id);

    const materialExist = await prisma.material.findMany({
      where: {
        id: { in: idMaterial },
      },
    });

    if (materialExist.length !== material.length) {
      return res.status(500).send("material não existe");
    }
  }

  let consu: Prisma.ConsultaCreateInput;

  consu = {
    consulta: new Date(consulta).toISOString(),
    dentista: { connect: { cro: croID } },
    user: { connect: { id: userId } },
    servico: { connect: servico },
    material: { connect: material },
    plano,
    validadePlano: validadePlano && new Date(validadePlano).toISOString(),
  };

  const test = await prisma.consulta.update({
    where: { id: parseInt(req.params.id) },
    data: consu,
  });

  return res.json(test);
}
