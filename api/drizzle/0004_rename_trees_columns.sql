ALTER TABLE "trees" RENAME COLUMN "region" TO "location";--> statement-breakpoint
ALTER TABLE "trees" RENAME COLUMN "co2_per_year" TO "co2";--> statement-breakpoint
ALTER TABLE "trees" ADD COLUMN "oxygen" integer DEFAULT 0 NOT NULL;