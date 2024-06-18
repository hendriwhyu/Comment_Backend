-- CreateEnum
CREATE TYPE "enum_Posts_category" AS ENUM ('Event', 'News');

-- CreateEnum
CREATE TYPE "enum_Users_role" AS ENUM ('company', 'user');

-- CreateTable
CREATE TABLE "Posts" (
    "id" UUID NOT NULL,
    "title" VARCHAR(255),
    "category" "enum_Posts_category",
    "description" TEXT,
    "startDate" TIMESTAMPTZ(6),
    "endDate" TIMESTAMPTZ(6),
    "maxParticipants" INTEGER,
    "image" VARCHAR(255),
    "ownerId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profiles" (
    "userId" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "photo" VARCHAR(255),
    "headTitle" VARCHAR(255),
    "phone" VARCHAR(255),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL
);

-- CreateTable
CREATE TABLE "UserJoinEvents" (
    "userId" UUID NOT NULL,
    "eventId" UUID NOT NULL,
    "joinDate" TIMESTAMPTZ(6) NOT NULL,
    "isActive" BOOLEAN NOT NULL,

    CONSTRAINT "UserJoinEvents_pkey" PRIMARY KEY ("userId","eventId")
);

-- CreateTable
CREATE TABLE "Users" (
    "id" UUID NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "role" "enum_Users_role" DEFAULT 'user',
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comments" (
    "id" UUID NOT NULL,
    "postId" UUID NOT NULL,
    "content" VARCHAR(255) NOT NULL,
    "userId" UUID,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookmarksOnPosts" (
    "userId" UUID NOT NULL,
    "postId" UUID NOT NULL,

    CONSTRAINT "BookmarksOnPosts_pkey" PRIMARY KEY ("postId","userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profiles_userId_key" ON "Profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "Users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- AddForeignKey
ALTER TABLE "Posts" ADD CONSTRAINT "Posts_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profiles" ADD CONSTRAINT "Profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserJoinEvents" ADD CONSTRAINT "UserJoinEvents_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserJoinEvents" ADD CONSTRAINT "UserJoinEvents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookmarksOnPosts" ADD CONSTRAINT "BookmarksOnPosts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookmarksOnPosts" ADD CONSTRAINT "BookmarksOnPosts_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
