-- CreateTable
CREATE TABLE "public"."SessionRoom" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SessionRoom_pkey" PRIMARY KEY ("id")
);
