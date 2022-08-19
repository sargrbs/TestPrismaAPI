/*
  Warnings:

  - A unique constraint covering the columns `[nome]` on the table `Marketplace` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Marketplace_nome_key" ON "Marketplace"("nome");
