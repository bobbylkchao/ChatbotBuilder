/*
  Warnings:

  - You are about to drop the column `intent_content` on the `intent_handlers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "intent_handlers" DROP COLUMN "intent_content",
ADD COLUMN     "intent_handler_content" TEXT;
