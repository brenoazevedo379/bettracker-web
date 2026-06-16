-- CreateTable
CREATE TABLE "Bet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "selecao" TEXT NOT NULL,
    "odd" REAL NOT NULL,
    "valor" REAL NOT NULL,
    "casa" TEXT NOT NULL,
    "esporte" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDENTE',
    "retorno" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
