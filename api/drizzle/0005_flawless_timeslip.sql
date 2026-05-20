ALTER TABLE "trees" RENAME COLUMN "co2_per_year" TO "oxygen";--> statement-breakpoint
ALTER TABLE "trees" ADD COLUMN "location" text;--> statement-breakpoint
ALTER TABLE "trees" ADD COLUMN "co2" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "trees" DROP COLUMN "region";--> statement-breakpoint
ALTER TABLE "trees" DROP COLUMN "o2_per_year";