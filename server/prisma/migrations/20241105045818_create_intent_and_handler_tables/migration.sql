-- CreateEnum
CREATE TYPE "handler_type_enum" AS ENUM ('NONFUNCTIONAL', 'FUNCTIONAL', 'COMPONENT');

-- CreateTable
CREATE TABLE "intents" (
    "intent_id" TEXT NOT NULL,
    "intent_name" TEXT NOT NULL,
    "intent_guidelines" TEXT,
    "bot_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "intents_pkey" PRIMARY KEY ("intent_id")
);

-- CreateTable
CREATE TABLE "intent_handlers" (
    "intent_handler_id" TEXT NOT NULL,
    "intent_handler_type" "handler_type_enum" NOT NULL,
    "intent_content" TEXT NOT NULL,
    "intent_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "intent_handlers_pkey" PRIMARY KEY ("intent_handler_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "intents_intent_name_bot_id_key" ON "intents"("intent_name", "bot_id");

-- CreateIndex
CREATE UNIQUE INDEX "intent_handlers_intent_id_key" ON "intent_handlers"("intent_id");

-- AddForeignKey
ALTER TABLE "intents" ADD CONSTRAINT "intents_bot_id_fkey" FOREIGN KEY ("bot_id") REFERENCES "bots"("bot_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "intent_handlers" ADD CONSTRAINT "intent_handlers_intent_id_fkey" FOREIGN KEY ("intent_id") REFERENCES "intents"("intent_id") ON DELETE RESTRICT ON UPDATE CASCADE;
