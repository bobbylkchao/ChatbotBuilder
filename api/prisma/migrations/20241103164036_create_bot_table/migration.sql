-- CreateTable
CREATE TABLE "bots" (
    "bot_id" TEXT NOT NULL,
    "bot_name" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bots_pkey" PRIMARY KEY ("bot_id")
);

-- AddForeignKey
ALTER TABLE "bots" ADD CONSTRAINT "bots_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
