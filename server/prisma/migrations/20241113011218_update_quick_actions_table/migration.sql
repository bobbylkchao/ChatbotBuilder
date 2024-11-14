/*
  Warnings:

  - You are about to drop the column `display` on the `quick_actions` table. All the data in the column will be lost.
  - You are about to drop the column `prompt` on the `quick_actions` table. All the data in the column will be lost.
  - Added the required column `config` to the `quick_actions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "quick_actions" DROP COLUMN "display",
DROP COLUMN "prompt",
ADD COLUMN     "config" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "role_name" SET DEFAULT 'OPERATOR';
