-- DropIndex
DROP INDEX `User_access_token_key` ON `User`;

-- AlterTable
ALTER TABLE `User` MODIFY `access_token` TEXT NULL;
