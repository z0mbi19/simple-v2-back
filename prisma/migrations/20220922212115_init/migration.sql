-- CreateTable
CREATE TABLE "Colaborador" (
    "id" SERIAL NOT NULL,
    "ctps" INTEGER NOT NULL,
    "pis" INTEGER NOT NULL,
    "adm" BOOLEAN NOT NULL,
    "dentistaId" INTEGER,

    CONSTRAINT "Colaborador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dentista" (
    "id" SERIAL NOT NULL,
    "cro" INTEGER NOT NULL,
    "especialidade" TEXT NOT NULL,

    CONSTRAINT "Dentista_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" INTEGER NOT NULL,
    "nascimento" TIMESTAMP(3) NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "sexo" BOOLEAN NOT NULL,
    "endereco" TEXT NOT NULL,
    "cep" INTEGER NOT NULL,
    "cidade" TEXT NOT NULL,
    "uf" TEXT NOT NULL,
    "telefone" INTEGER NOT NULL,
    "colaboradorId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Servico" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Servico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Material" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "valorUni" DOUBLE PRECISION NOT NULL,
    "valorTotal" DOUBLE PRECISION NOT NULL,
    "descricao" TEXT NOT NULL,

    CONSTRAINT "Material_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Consulta" (
    "id" SERIAL NOT NULL,
    "consulta" TIMESTAMP(3) NOT NULL,
    "plano" TEXT NOT NULL,
    "validadePlano" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "croID" INTEGER NOT NULL,

    CONSTRAINT "Consulta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Financeiro" (
    "id" SERIAL NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "tipo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "materia" BOOLEAN NOT NULL,

    CONSTRAINT "Financeiro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ConsultaToMaterial" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ConsultaToServico" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Colaborador_ctps_key" ON "Colaborador"("ctps");

-- CreateIndex
CREATE UNIQUE INDEX "Colaborador_pis_key" ON "Colaborador"("pis");

-- CreateIndex
CREATE UNIQUE INDEX "Colaborador_dentistaId_key" ON "Colaborador"("dentistaId");

-- CreateIndex
CREATE UNIQUE INDEX "Dentista_cro_key" ON "Dentista"("cro");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_cpf_key" ON "User"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "User_telefone_key" ON "User"("telefone");

-- CreateIndex
CREATE UNIQUE INDEX "User_colaboradorId_key" ON "User"("colaboradorId");

-- CreateIndex
CREATE UNIQUE INDEX "Servico_nome_key" ON "Servico"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Material_nome_key" ON "Material"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "_ConsultaToMaterial_AB_unique" ON "_ConsultaToMaterial"("A", "B");

-- CreateIndex
CREATE INDEX "_ConsultaToMaterial_B_index" ON "_ConsultaToMaterial"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ConsultaToServico_AB_unique" ON "_ConsultaToServico"("A", "B");

-- CreateIndex
CREATE INDEX "_ConsultaToServico_B_index" ON "_ConsultaToServico"("B");

-- AddForeignKey
ALTER TABLE "Colaborador" ADD CONSTRAINT "Colaborador_dentistaId_fkey" FOREIGN KEY ("dentistaId") REFERENCES "Dentista"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_colaboradorId_fkey" FOREIGN KEY ("colaboradorId") REFERENCES "Colaborador"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consulta" ADD CONSTRAINT "Consulta_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consulta" ADD CONSTRAINT "Consulta_croID_fkey" FOREIGN KEY ("croID") REFERENCES "Dentista"("cro") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ConsultaToMaterial" ADD CONSTRAINT "_ConsultaToMaterial_A_fkey" FOREIGN KEY ("A") REFERENCES "Consulta"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ConsultaToMaterial" ADD CONSTRAINT "_ConsultaToMaterial_B_fkey" FOREIGN KEY ("B") REFERENCES "Material"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ConsultaToServico" ADD CONSTRAINT "_ConsultaToServico_A_fkey" FOREIGN KEY ("A") REFERENCES "Consulta"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ConsultaToServico" ADD CONSTRAINT "_ConsultaToServico_B_fkey" FOREIGN KEY ("B") REFERENCES "Servico"("id") ON DELETE CASCADE ON UPDATE CASCADE;
