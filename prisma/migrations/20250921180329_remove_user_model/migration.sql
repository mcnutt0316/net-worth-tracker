/*
  Warnings:

  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."assets" DROP CONSTRAINT "assets_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."liabilities" DROP CONSTRAINT "liabilities_userId_fkey";

-- DropTable
DROP TABLE "public"."users";
