/*
  Warnings:

  - A unique constraint covering the columns `[bot_name,user_id]` on the table `bots` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "bots_bot_name_user_id_key" ON "bots"("bot_name", "user_id");
