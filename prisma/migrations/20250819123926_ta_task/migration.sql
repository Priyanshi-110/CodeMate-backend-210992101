-- AlterTable
ALTER TABLE "public"."SessionRoom" ADD COLUMN     "handRaised" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'Student';

-- CreateTable
CREATE TABLE "public"."CodeSnippet" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "roomId" TEXT NOT NULL,

    CONSTRAINT "CodeSnippet_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."CodeSnippet" ADD CONSTRAINT "CodeSnippet_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "public"."SessionRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
