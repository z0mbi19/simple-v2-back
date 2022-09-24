import { NextFunction, Request, Response } from "express";
import * as yup from "yup";
import { setLocale } from "yup";

export async function userMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let schema = yup.object().shape({
    email: yup
      .string()
      .email("Tem que ser um email valido")
      .required("Email e obrigatório"),
    nome: yup.string().required("Nome e obrigatório"),
    senha: yup.string().required("Senha e obrigatório"),
    cpf: yup.number().required("CPF e obrigatório"),
    nascimento: yup.date().required("Data de nascimento e obrigatório"),
    sexo: yup.boolean().required("Sexo e obrigatório"),
    endereco: yup.string().required("Endereço e obrigatório"),
    cep: yup
      .number()
      .typeError("O cep tem que ser numeros")
      .required("CEP e obrigatório"),
    cidade: yup.string().required("Cidade e obrigatório"),
    uf: yup.string().required("UF e obrigatório"),
    telefone: yup
      .number()
      .typeError("O telefone tem que ser numeros")
      .required("Telefone e obrigatório"),
  });

  let schemaColab = yup.object().shape({
    email: yup
      .string()
      .email("Tem que ser um email valido")
      .required("Email e obrigatório"),
    nome: yup.string().required("Nome e obrigatório"),
    senha: yup.string().required("Senha e obrigatório"),
    cpf: yup.number().required("CPF e obrigatório"),
    nascimento: yup.date().required("Data de nascimento e obrigatório"),
    sexo: yup.boolean().required("Sexo e obrigatório"),
    endereco: yup.string().required("Endereço e obrigatório"),
    cep: yup
      .number()
      .typeError("O cep tem que ser numeros")
      .required("CEP e obrigatório"),
    cidade: yup.string().required("Cidade e obrigatório"),
    uf: yup.string().required("UF e obrigatório"),
    telefone: yup
      .number()
      .typeError("O telefone tem que ser numeros")
      .required("Telefone e obrigatório"),
    ctps: yup
      .number()
      .typeError("O CTPS tem que ser numeros")
      .required("CTPS e obrigatório"),
    pis: yup
      .number()
      .typeError("O PIS tem que ser numeros")
      .required("PIS e obrigatório"),
  });

  let schemaDent = yup.object().shape({
    email: yup
      .string()
      .email("Tem que ser um email valido")
      .required("Email e obrigatório"),
    nome: yup.string().required("Nome e obrigatório"),
    senha: yup.string().required("Senha e obrigatório"),
    cpf: yup.number().required("CPF e obrigatório"),
    nascimento: yup.date().required("Data de nascimento e obrigatório"),
    sexo: yup.boolean().required("Sexo e obrigatório"),
    endereco: yup.string().required("Endereço e obrigatório"),
    cep: yup
      .number()
      .typeError("O cep tem que ser numeros")
      .required("CEP e obrigatório"),
    cidade: yup.string().required("Cidade e obrigatório"),
    uf: yup.string().required("UF e obrigatório"),
    telefone: yup
      .number()
      .typeError("O telefone tem que ser numeros")
      .required("Telefone e obrigatório"),
    ctps: yup
      .number()
      .typeError("O CTPS tem que ser numeros")
      .required("CTPS e obrigatório"),
    pis: yup
      .number()
      .typeError("O PIS tem que ser numeros")
      .required("PIS e obrigatório"),
    cro: yup
      .number()
      .typeError("O CRO tem que ser numeros")
      .required("CRO e obrigatório"),
    especialidade: yup.string().required("Especialidade e obrigatório"),
  });

  if (req.body.ctps && !req.body.cro) {
    await schemaColab
      .validate(req.body)
      .then(() => {
        return next();
      })
      .catch((e) => {
        return res.status(500).json(e.errors);
      });
  } else if (req.body.ctps && req.body.cro) {
    await schemaDent
      .validate(req.body)
      .then(() => {
        return next();
      })
      .catch((e) => {
        return res.status(500).json(e.errors);
      });
  } else {
    await schema
      .validate(req.body)
      .then(() => {
        return next();
      })
      .catch((e) => {
        return res.status(500).json(e.errors);
      });
  }
}

export async function servicoMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let schema = yup.object().shape({
    nome: yup.string().required("Nome e obrigatório"),
    valor: yup.number().required("Valor e obrigatório"),
  });
  await schema
    .validate(req.body)
    .then(() => {
      return next();
    })
    .catch((e) => {
      return res.status(500).json(e.errors);
    });
}

export async function materialMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let schema = yup.object().shape({
    nome: yup.string().required("Nome e obrigatório"),
    quantidade: yup.number().required("Quantidade e obrigatório"),
    valorUni: yup
      .number()
      .typeError("O Valor Unitario tem que ser numeros")
      .required("Valor e obrigatório"),
    valorTotal: yup
      .number()
      .typeError("O Valor total tem que ser numeros")
      .required("Valor total e obrigatório"),
    descricao: yup.string().required("Descrição e obrigatório"),
  });
  await schema
    .validate(req.body)
    .then(() => {
      return next();
    })
    .catch((e) => {
      return res.status(500).json(e.errors);
    });
}

export async function consultaMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let schema = yup.object().shape({
    consulta: yup
      .date()
      .typeError("A data da consulta tem que ser uma data valida")
      .required("Data da consulta e obrigatório"),
    validadePlano: yup
      .date()
      .typeError("A data da consulta tem que ser uma data valida"),
  });
  await schema
    .validate(req.body)
    .then(() => {
      return next();
    })
    .catch((e) => {
      return res.status(500).json(e.errors);
    });
}
