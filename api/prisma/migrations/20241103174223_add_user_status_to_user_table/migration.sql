-- CreateEnum
CREATE TYPE "user_status_enum" AS ENUM ('INVITED', 'ACTIVE');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "user_status" "user_status_enum" NOT NULL DEFAULT 'ACTIVE';
