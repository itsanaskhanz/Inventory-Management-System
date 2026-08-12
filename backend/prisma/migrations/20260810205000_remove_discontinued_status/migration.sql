-- AlterEnum
ALTER TYPE "Status" RENAME TO "Status_old";
CREATE TYPE "Status" AS ENUM ('IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK');
ALTER TABLE "Product" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Product" ALTER COLUMN "status" TYPE "Status" USING ("status"::text::"Status");
ALTER TABLE "Product" ALTER COLUMN "status" SET DEFAULT 'IN_STOCK';
DROP TYPE "Status_old";