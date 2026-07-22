-- Store uploaded document bytes directly in the database instead of on local
-- disk, since serverless deployments (e.g. Vercel) have no persistent
-- filesystem to write to.
ALTER TABLE "Document" ADD COLUMN "content" BLOB NOT NULL DEFAULT (x'');
ALTER TABLE "Document" DROP COLUMN "filePath";
