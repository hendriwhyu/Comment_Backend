/*
  Warnings:

  - You are about to drop the column `bookmarks` on the `Posts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Posts" DROP COLUMN "bookmarks";

-- CreateTable
CREATE TABLE "BookmarksOnPosts" (
    "userId" UUID NOT NULL,
    "postId" UUID NOT NULL,

    CONSTRAINT "BookmarksOnPosts_pkey" PRIMARY KEY ("postId","userId")
);

-- AddForeignKey
ALTER TABLE "BookmarksOnPosts" ADD CONSTRAINT "BookmarksOnPosts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookmarksOnPosts" ADD CONSTRAINT "BookmarksOnPosts_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
