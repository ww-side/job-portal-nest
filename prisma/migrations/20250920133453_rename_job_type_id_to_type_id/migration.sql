-- Ensure there is a default JobType for existing rows with NULL (optional)
INSERT INTO "public"."JobType" (id, name)
SELECT '00000000-0000-0000-0000-000000000001', 'remote'
WHERE NOT EXISTS (
    SELECT 1 FROM "public"."JobType" WHERE id = '00000000-0000-0000-0000-000000000001'
);

-- Update existing Job rows that have NULL in jobTypeId
UPDATE "public"."Job"
SET "jobTypeId" = '00000000-0000-0000-0000-000000000001'
WHERE "jobTypeId" IS NULL;

-- Rename the column
ALTER TABLE "public"."Job" RENAME COLUMN "jobTypeId" TO "typeId";
