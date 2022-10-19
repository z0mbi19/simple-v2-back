import { Prisma, PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function indexAllUser(req: Request, res: Response) {
  const admUser = await prisma.user.findFirst({
    where: {
      id: parseInt(req.userId),
    },
    include: {
      colaborador: true,
    },
  });

  if (!admUser?.colaborador?.adm) {
    return res
      .status(500)
      .send(
        "Você não tem permissão para isso fale com algum administrador do sistema "
      );
  }
  const user = await prisma.user.findMany({
    where: {
      NOT: {
        colaboradorId: null,
      },
    },
    include: {
      colaborador: {
        include: {
          dentista: true,
        },
      },
    },
  });

  return res.json(user);
}

export async function userNow(req: Request, res: Response) {
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

  return res.json(user);
}

export async function indexUser(req: Request, res: Response) {
  const admUser = await prisma.user.findFirst({
    where: {
      id: parseInt(req.userId),
    },
    include: {
      colaborador: true,
    },
  });

  if (!admUser?.colaborador?.adm) {
    return res
      .status(500)
      .send(
        "Você não tem permissão para isso fale com algum administrador do sistema "
      );
  }
  if (!parseInt(req.params.id)) {
    return;
  }
  const user = await prisma.user.findFirst({
    where: {
      id: parseInt(req.params.id),
    },
    include: {
      colaborador: {
        include: {
          dentista: true,
        },
      },
    },
  });

  return res.json(user);
}

export async function storeUser(req: Request, res: Response) {
  // const admUser = await prisma.user.findFirst({
  //   where: {
  //     id: parseInt(req.userId),
  //   },
  //   include: {
  //     colaborador: true,
  //   },
  // });

  // if (!admUser?.colaborador?.adm) {
  //   return res
  //     .status(500)
  //     .send(
  //       "Você não tem permissão para isso fale com algum administrador do sistema "
  //     );
  // }

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
    ctps,
    pis,
    adm,
    cro,
    especialidade,
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

  if (pis) {
    const pisExist = await prisma.colaborador.findFirst({
      where: {
        pis,
      },
    });
    if (pisExist) {
      return res.status(500).send("Pis já cadastrado");
    }
  }

  if (ctps) {
    const ctpsExist = await prisma.colaborador.findFirst({
      where: {
        ctps,
      },
    });
    if (ctpsExist) {
      return res.status(500).send("ctps já cadastrado");
    }
  }

  if (cro) {
    const croExist = await prisma.dentista.findFirst({
      where: {
        cro,
      },
    });
    if (croExist) {
      return res.status(500).send("cro já cadastrado");
    }
  }

  let user: Prisma.UserCreateInput;
  let colab: Prisma.ColaboradorCreateInput = {
    ctps,
    pis,
    adm,
  };
  let dent: Prisma.DentistaCreateInput = {
    cro,
    especialidade,
  };

  if (ctps && !cro) {
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
      colaborador: {
        create: colab,
      },
    };
  } else if (ctps && cro) {
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
      colaborador: {
        create: { ...colab, dentista: { create: dent } },
      },
    };
  } else {
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
  }

  await prisma.user.create({ data: user });

  return res.status(200).send("ok");
}

export async function updateUser(req: Request, res: Response) {
  const admUser = await prisma.user.findFirst({
    where: {
      id: parseInt(req.userId),
    },
    include: {
      colaborador: true,
    },
  });

  if (!admUser?.colaborador?.adm) {
    return res
      .status(500)
      .send(
        "Você não tem permissão para isso fale com algum administrador do sistema "
      );
  }
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
    ctps,
    pis,
    adm,
    cro,
    especialidade,
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

  if (pis) {
    const pisExist = await prisma.colaborador.findFirst({
      where: {
        NOT: { id: parseInt(req.params.id) },
        pis,
      },
    });
    if (pisExist) {
      return res.status(500).send("Pis já cadastrado");
    }
  }

  if (ctps) {
    const ctpsExist = await prisma.colaborador.findFirst({
      where: {
        NOT: { id: parseInt(req.params.id) },
        ctps,
      },
    });
    if (ctpsExist) {
      return res.status(500).send("ctps já cadastrado");
    }
  }

  if (cro) {
    const croExist = await prisma.dentista.findFirst({
      where: {
        NOT: { id: parseInt(req.params.id) },
        cro,
      },
    });
    if (croExist) {
      return res.status(500).send("cro já cadastrado");
    }
  }

  let user: Prisma.UserCreateInput;
  console.log(ctps);
  let colab: Prisma.ColaboradorCreateInput = {
    ctps,
    pis,
    adm,
  };
  let dent: Prisma.DentistaCreateInput = {
    cro,
    especialidade,
  };

  if (ctps && !cro) {
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
      colaborador: {
        create: colab,
      },
    };
  } else if (ctps && cro) {
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
      colaborador: {
        create: { ...colab, dentista: { create: dent } },
      },
    };
  } else {
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
  }

  await prisma.user.update({
    where: { id: parseInt(req.params.id) },
    data: user,
  });

  return res.status(200).send("ok");
}

export async function desactiveUser(req: Request, res: Response) {
  const admUser = await prisma.user.findFirst({
    where: {
      id: parseInt(req.userId),
    },
    include: {
      colaborador: true,
    },
  });

  if (!admUser?.colaborador?.adm) {
    return res
      .status(500)
      .send(
        "Você não tem permissão para isso fale com algum administrador do sistema "
      );
  }
  const userExist = await prisma.user.findFirst({
    where: {
      id: parseInt(req.params.id),
    },
  });

  if (!userExist) {
    return res.status(500).send("Usuario não cadastrado");
  }

  await prisma.user.update({
    where: {
      id: parseInt(req.params.id),
    },
    data: { ativo: false },
  });

  return res.status(200).send("Usuario desativado com sucesso");
}
