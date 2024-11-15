-- AlterTable
ALTER TABLE "bots" ADD COLUMN     "bot_allowed_origin" TEXT[] DEFAULT ARRAY[]::TEXT[];
