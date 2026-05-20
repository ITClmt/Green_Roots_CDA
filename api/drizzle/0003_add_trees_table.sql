CREATE TABLE "trees" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"species" text NOT NULL,
	"description" text,
	"region" text,
	"co2_per_year" integer DEFAULT 0 NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"image_url" text,
	"stock" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (3) with time zone DEFAULT now() NOT NULL
);
