-- AlterEnum
ALTER TYPE "handler_type_enum" ADD VALUE 'MODELRESPONSE';

-- AlterTable
ALTER TABLE "intent_handlers" ADD COLUMN     "intent_handler_guidelines" TEXT;
