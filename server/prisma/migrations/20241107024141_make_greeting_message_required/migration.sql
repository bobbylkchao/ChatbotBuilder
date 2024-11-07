/*
  Warnings:

  - Made the column `greeting_message` on table `bots` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "bots" ALTER COLUMN "greeting_message" SET NOT NULL;
