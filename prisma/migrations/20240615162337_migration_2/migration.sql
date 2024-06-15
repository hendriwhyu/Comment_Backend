-- DropForeignKey
ALTER TABLE "BookmarksOnPosts" DROP CONSTRAINT "BookmarksOnPosts_postId_fkey";

-- DropForeignKey
ALTER TABLE "BookmarksOnPosts" DROP CONSTRAINT "BookmarksOnPosts_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserJoinEvents" DROP CONSTRAINT "UserJoinEvents_eventId_fkey";

-- DropForeignKey
ALTER TABLE "UserJoinEvents" DROP CONSTRAINT "UserJoinEvents_userId_fkey";

-- AddForeignKey
ALTER TABLE "UserJoinEvents" ADD CONSTRAINT "UserJoinEvents_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserJoinEvents" ADD CONSTRAINT "UserJoinEvents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookmarksOnPosts" ADD CONSTRAINT "BookmarksOnPosts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookmarksOnPosts" ADD CONSTRAINT "BookmarksOnPosts_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
