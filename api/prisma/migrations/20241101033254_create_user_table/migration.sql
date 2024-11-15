-- CreateEnum
CREATE TYPE "role_enum" AS ENUM ('SUPERADMIN', 'ADMIN', 'OPERATOR', 'VIEWER');

-- CreateTable
CREATE TABLE "users" (
    "user_id" TEXT NOT NULL,
    "user_email" TEXT NOT NULL,
    "user_name" TEXT,
    "open_id" TEXT NOT NULL,
    "role_name" "role_enum" NOT NULL DEFAULT 'VIEWER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_user_email_key" ON "users"("user_email");

-- CreateIndex
CREATE UNIQUE INDEX "users_user_email_open_id_key" ON "users"("user_email", "open_id");
