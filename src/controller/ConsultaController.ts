import { Prisma, PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { object } from "yup";

const prisma = new PrismaClient();

export async function getAllConsulta(req: Request, res: Response) {
  const result = await prisma.consulta.findMany();

  return res.json(result);
}

export async function deleteConsulta(req: Request, res: Response) {
  const result = await prisma.consulta.findFirst({
    where: {
      id: parseInt(req.params.id),
    },
  });

  if (!result) {
    return res.status(500).send("Essa consulta não existe");
  }

  await prisma.consulta.delete({
    where: {
      id: parseInt(req.params.id),
    },
  });

  return res.status(200).send("Consulta apagada com sucesso ");
}

export async function getConsulta(req: Request, res: Response) {
  const result = await prisma.consulta.findFirst({
    where: {
      id: parseInt(req.params.id),
    },
    include: {
      material: {
        select: {
          id: true,
        },
      },
      servico: {
        select: {
          id: true,
        },
      },
    },
  });

  const servico = result?.servico.map((x) => {
    return x.id;
  });

  const material = result?.material.map((x) => {
    return x.id;
  });

  return res.json({
    ...result,
    material,
    servico,
    consulta: result?.consulta.toLocaleString("pt-Br"),
  });
}

export async function getDadosForm(req: Request, res: Response) {
  const user = await prisma.user.findFirst({
    where: {
      id: parseInt(req.userId),
    },
    include: {
      colaborador: {
        include: {
          dentista: true,
        },
      },
    },
  });

  let con: Prisma.ConsultaFindManyArgs;

  if (user?.colaboradorId === null) {
    con = {
      where: {
        userId: parseInt(req.userId),
      },
      include: {
        user: {
          select: {
            nome: true,
          },
        },
        dentista: {
          select: {
            colaborador: {
              select: {
                user: {
                  select: {
                    nome: true,
                  },
                },
              },
            },
          },
        },
      },
    };
  }
  if (user?.colaborador?.dentista?.cro) {
    con = {
      where: {
        croID: user?.colaborador?.dentista?.cro,
      },
      include: {
        user: {
          select: {
            nome: true,
          },
        },
        dentista: {
          select: {
            colaborador: {
              select: {
                user: {
                  select: {
                    nome: true,
                  },
                },
              },
            },
          },
        },
      },
    };
  } else {
    con = {
      include: {
        user: {
          select: {
            nome: true,
          },
        },
        dentista: {
          select: {
            colaborador: {
              select: {
                user: {
                  select: {
                    nome: true,
                  },
                },
              },
            },
          },
        },
      },
    };
  }

  const consultas = await prisma.consulta.findMany(con);

  const relatorio = await prisma.consulta.findMany({
    where: {
      consulta: {
        gt: new Date(
          `${new Date().getFullYear()}-01-01 00:00:00.000`
        ).toISOString(),
      },
    },
  });

  const gerarCor = (opacidade = 1) => {
    let r = Math.random() * 255;
    let g = Math.random() * 255;
    let b = Math.random() * 255;

    return `rgba(${r}, ${g}, ${b}, ${opacidade})`;
  };

  const graficoConsulta = () => {
    const meses = [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ];

    const count = relatorio.reduce((r: any, { consulta }) => {
      let key = consulta.toISOString().slice(0, 7);
      r[key] = (r[key] || 0) + 1;
      return r;
    }, {});

    const color = Object.keys(count).map((x) => {
      return gerarCor();
    });
    return {
      labels: Object.keys(count),
      datasets: [
        {
          label: "Consultas",
          backgroundColor: color,
          data: Object.values(count),
        },
      ],
    };
  };
  const calendar = consultas.map((x: any) => {
    const date = new Date(x.consulta).toLocaleString("pt-Br");
    return {
      date: `${date.substring(6, 10)}-${date.substring(3, 5)}-${date.substring(
        0,
        2
      )} ${date.substring(11, 19)}`,
      id: x.id,
      title: `Dentista: ${x.dentista?.colaborador?.user?.nome}, paciente: ${x.user?.nome}`,
    };
  });

  let pas: Prisma.UserFindManyArgs;

  if (user?.colaboradorId === null) {
    pas = {
      where: {
        id: parseInt(req.userId),
      },
      include: {
        colaborador: {
          select: {
            dentista: {
              select: {
                cro: true,
              },
            },
          },
        },
      },
    };
  } else {
    pas = {
      where: {
        colaboradorId: null,
      },
      include: {
        colaborador: {
          select: {
            dentista: {
              select: {
                cro: true,
              },
            },
          },
        },
      },
    };
  }

  const pacientes = await prisma.user.findMany(pas);

  const dentista = await prisma.user.findMany({
    where: {
      colaborador: {
        NOT: {
          dentistaId: null,
        },
      },
    },
    include: {
      colaborador: {
        select: {
          dentista: {
            select: {
              cro: true,
            },
          },
        },
      },
    },
  });
  const material = await prisma.material.findMany();
  const servico = await prisma.servico.findMany();

  const graficoServico = () => {
    const label: string[] = [];
    const data: number[] = [];

    servico.forEach((x) => {
      label.push(x.nome);
      data.push(x.valor);
    });

    const color = servico.map((x) => {
      return gerarCor();
    });
    return {
      labels: label,
      datasets: [{ data: data, backgroundColor: color }],
    };
  };

  const graficomaterial = () => {
    const label: string[] = [];
    const data: number[] = [];

    material.forEach((x) => {
      label.push(x.nome);
      data.push(x.quantidade);
    });

    const color = material.map((x) => {
      return gerarCor();
    });
    return {
      labels: label,
      datasets: [{ data: data, backgroundColor: color }],
    };
  };

  if (user?.colaboradorId === null) {
    return res.json({
      calendar,
      pacientes,
      dentista,
      material,
      servico,
    });
  } else {
    return res.json({
      calendar,
      graficoConsulta: graficoConsulta(),
      graficoServico: graficoServico(),
      graficomaterial: graficomaterial(),
      pacientes,
      dentista,
      material,
      servico,
    });
  }
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

  const pacienteOcupado = await prisma.consulta.findFirst({
    where: {
      consulta: new Date(consulta).toISOString(),
      userId,
    },
  });

  if (pacienteOcupado) {
    return res
      .status(500)
      .send("Esse paciente já tem uma consulta nesse horario");
  }

  if (consultaExist) {
    return res
      .status(500)
      .send("Esse dentista já tem uma consulta nesse horario");
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

  if (plano) {
    consu = {
      consulta: new Date(consulta).toISOString(),
      dentista: { connect: { cro: croID } },
      user: { connect: { id: userId } },
      servico: { connect: servico },
      material: { connect: material },
      plano,
      validadePlano: new Date(validadePlano).toISOString(),
    };
  } else {
    consu = {
      consulta: new Date(consulta).toISOString(),
      dentista: { connect: { cro: croID } },
      user: { connect: { id: userId } },
      servico: { connect: servico },
      material: { connect: material },
      // plano,
      // validadePlano: new Date(validadePlano).toISOString(),
    };
  }

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
