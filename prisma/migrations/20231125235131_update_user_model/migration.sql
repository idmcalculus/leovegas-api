/*
  Warnings:

  - A unique constraint covering the columns `[access_token]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `access_token` VARCHAR(191) NULL,
    ADD COLUMN `password` VARCHAR(191) NOT NULL,
    MODIFY `name` VARCHAR(255) NOT NULL,
    MODIFY `role` VARCHAR(191) NOT NULL DEFAULT 'USER';

-- CreateIndex
CREATE UNIQUE INDEX `User_access_token_key` ON `User`(`access_token`);
