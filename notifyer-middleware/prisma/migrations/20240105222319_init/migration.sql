-- CreateTable
CREATE TABLE "Users" (
    "Id" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "Password" VARCHAR(255) NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Tokens" (
    "Id" TEXT NOT NULL,
    "UserId" TEXT NOT NULL,
    "SessionKey" TEXT NOT NULL,

    CONSTRAINT "Tokens_pkey" PRIMARY KEY ("Id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_Email_key" ON "Users"("Email");

-- CreateIndex
CREATE UNIQUE INDEX "Tokens_UserId_key" ON "Tokens"("UserId");

-- AddForeignKey
ALTER TABLE "Tokens" ADD CONSTRAINT "Tokens_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "Users"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;
