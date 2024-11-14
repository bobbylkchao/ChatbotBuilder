-- CreateTable
CREATE TABLE "quick_actions" (
    "quick_action_id" TEXT NOT NULL,
    "display" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "bot_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quick_actions_pkey" PRIMARY KEY ("quick_action_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "quick_actions_bot_id_key" ON "quick_actions"("bot_id");

-- AddForeignKey
ALTER TABLE "quick_actions" ADD CONSTRAINT "quick_actions_bot_id_fkey" FOREIGN KEY ("bot_id") REFERENCES "bots"("bot_id") ON DELETE RESTRICT ON UPDATE CASCADE;
