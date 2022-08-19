-- CreateTable
CREATE TABLE "User" (
    "id" STRING NOT NULL,
    "name" STRING NOT NULL,
    "email" STRING NOT NULL,
    "password" STRING NOT NULL,
    "privilege" STRING NOT NULL,
    "created_at" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATE NOT NULL
);

-- CreateTable
CREATE TABLE "Order" (
    "id" STRING NOT NULL,
    "nfe" STRING,
    "data_venda" DATE NOT NULL,
    "previsao_entrega" DATE,
    "produto" STRING NOT NULL,
    "numero_serie" STRING,
    "valor_total" DECIMAL(15,2) NOT NULL,
    "nome_cliente" STRING NOT NULL,
    "telefone_cliente" STRING,
    "cpf_cliente" STRING NOT NULL,
    "protocolo_cotacao" STRING,
    "valor_frete" DECIMAL(15,2),
    "video" BOOL,
    "rastreio" BOOL,
    "cidade" STRING,
    "produto_extra" STRING,
    "volumes" STRING,
    "cep" STRING,
    "endereco" STRING,
    "bairro" STRING,
    "estado" STRING,
    "complemento" STRING,
    "created_at" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATE NOT NULL,
    "marketplaceId" STRING NOT NULL,
    "statusId" STRING NOT NULL,
    "romaneioId" STRING,
    "empresasId" STRING NOT NULL,
    "transportadoraId" STRING,
    "nivelAtrasoId" STRING
);

-- CreateTable
CREATE TABLE "Transportadora" (
    "id" STRING NOT NULL,
    "nome" STRING NOT NULL,
    "telefone" STRING NOT NULL,
    "nome_contato" STRING NOT NULL,
    "created_at" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATE NOT NULL
);

-- CreateTable
CREATE TABLE "Marketplace" (
    "id" STRING NOT NULL,
    "nome" STRING NOT NULL,
    "created_at" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATE NOT NULL
);

-- CreateTable
CREATE TABLE "Status" (
    "id" STRING NOT NULL,
    "nome" STRING NOT NULL,
    "cor" STRING NOT NULL,
    "created_at" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATE NOT NULL
);

-- CreateTable
CREATE TABLE "Romaneio" (
    "id" STRING NOT NULL,
    "data_coleta" DATE NOT NULL,
    "responsavel_coleta" STRING,
    "qtd_volumes" STRING NOT NULL,
    "created_at" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATE NOT NULL,
    "transportadoraId" STRING NOT NULL
);

-- CreateTable
CREATE TABLE "Ocorrencias" (
    "id" STRING NOT NULL,
    "descricao" STRING NOT NULL,
    "created_at" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATE NOT NULL,
    "orderId" STRING NOT NULL
);

-- CreateTable
CREATE TABLE "Empresas" (
    "id" STRING NOT NULL,
    "razao_social" STRING NOT NULL,
    "cnpj" STRING NOT NULL,
    "created_at" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATE NOT NULL
);

-- CreateTable
CREATE TABLE "NivelAtraso" (
    "id" STRING NOT NULL,
    "codigo" STRING NOT NULL,
    "descricao" STRING NOT NULL,
    "created_at" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATE NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Order_id_key" ON "Order"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Transportadora_id_key" ON "Transportadora"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Marketplace_id_key" ON "Marketplace"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Status_id_key" ON "Status"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Romaneio_id_key" ON "Romaneio"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Ocorrencias_id_key" ON "Ocorrencias"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Empresas_id_key" ON "Empresas"("id");

-- CreateIndex
CREATE UNIQUE INDEX "NivelAtraso_id_key" ON "NivelAtraso"("id");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_transportadoraId_fkey" FOREIGN KEY ("transportadoraId") REFERENCES "Transportadora"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_marketplaceId_fkey" FOREIGN KEY ("marketplaceId") REFERENCES "Marketplace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "Status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_romaneioId_fkey" FOREIGN KEY ("romaneioId") REFERENCES "Romaneio"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_empresasId_fkey" FOREIGN KEY ("empresasId") REFERENCES "Empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_nivelAtrasoId_fkey" FOREIGN KEY ("nivelAtrasoId") REFERENCES "NivelAtraso"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Romaneio" ADD CONSTRAINT "Romaneio_transportadoraId_fkey" FOREIGN KEY ("transportadoraId") REFERENCES "Transportadora"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ocorrencias" ADD CONSTRAINT "Ocorrencias_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
