/*
  Warnings:

  - You are about to drop the `UserJoinPosts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserJoinPosts" DROP CONSTRAINT "UserJoinPosts_eventId_fkey";

-- DropTable
DROP TABLE "UserJoinPosts";

-- CreateTable
CREATE TABLE "UserJoinEvents" (
    "userId" UUID NOT NULL,
    "eventId" UUID NOT NULL,
    "joinDate" TIMESTAMPTZ(6) NOT NULL,
    "isActive" BOOLEAN NOT NULL,

    CONSTRAINT "UserJoinEvents_pkey" PRIMARY KEY ("userId","eventId")
);

-- AddForeignKey
ALTER TABLE "UserJoinEvents" ADD CONSTRAINT "UserJoinEvents_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserJoinEvents" ADD CONSTRAINT "UserJoinEvents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
