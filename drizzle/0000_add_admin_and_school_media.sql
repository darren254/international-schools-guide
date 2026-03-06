CREATE TABLE "admin_sessions" (
	"id" varchar PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "admin_users" (
	"id" varchar PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"password_salt" varchar(64) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "admin_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "cities" (
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"country" varchar(100),
	"description" text,
	"meta_title" varchar(255),
	"meta_description" text,
	"center_latitude" numeric(10, 8),
	"center_longitude" numeric(11, 8),
	"map_zoom" integer DEFAULT 11,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "cities_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "city_translations" (
	"id" varchar PRIMARY KEY NOT NULL,
	"city_slug" varchar(255) NOT NULL,
	"locale" varchar(5) NOT NULL,
	"field_name" varchar(100) NOT NULL,
	"content" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contact_messages" (
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"inquiry_type" varchar(50) NOT NULL,
	"school_name" varchar(255),
	"message" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "exchange_rates" (
	"id" serial PRIMARY KEY NOT NULL,
	"from_currency" varchar(3) NOT NULL,
	"to_currency" varchar(3) NOT NULL,
	"rate" numeric(12, 4) NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "fact_check_claims" (
	"id" varchar PRIMARY KEY NOT NULL,
	"run_id" varchar NOT NULL,
	"claim_index" integer NOT NULL,
	"original_text" text NOT NULL,
	"claim_type" varchar(50) NOT NULL,
	"school_slug" varchar(255),
	"canonical_value" text,
	"verdict" varchar(30),
	"severity" varchar(10),
	"rationale" text,
	"confidence" numeric(3, 2),
	"isj_bias_applied" boolean DEFAULT false,
	"stage_data" jsonb DEFAULT '{}'::jsonb
);
--> statement-breakpoint
CREATE TABLE "fact_check_runs" (
	"id" varchar PRIMARY KEY NOT NULL,
	"article_slug" varchar(255) NOT NULL,
	"status" varchar(20) DEFAULT 'running' NOT NULL,
	"stage_reached" varchar(50),
	"claims_extracted" integer DEFAULT 0,
	"high_count" integer DEFAULT 0,
	"medium_count" integer DEFAULT 0,
	"low_count" integer DEFAULT 0,
	"report" jsonb,
	"error" text,
	"started_at" timestamp DEFAULT now(),
	"completed_at" timestamp,
	"duration_ms" integer
);
--> statement-breakpoint
CREATE TABLE "guides" (
	"id" varchar PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"content" text,
	"excerpt" text,
	"guide_type" varchar(50),
	"city_slug" varchar(255),
	"tags" text[],
	"hero_image_url" varchar(500),
	"og_image_url" varchar(500),
	"read_time" integer,
	"author" varchar(255),
	"meta_title" varchar(255),
	"meta_description" text,
	"faq_schema" text,
	"published" boolean DEFAULT false,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "guides_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "neighbourhoods" (
	"id" varchar PRIMARY KEY NOT NULL,
	"city_slug" varchar(255),
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"boundary" jsonb,
	"center_latitude" numeric(10, 8),
	"center_longitude" numeric(11, 8),
	"is_key_anchor" boolean DEFAULT false,
	"display_order" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "news_drafts" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"standfirst" text,
	"meta_description" text,
	"category" text DEFAULT 'NEWS',
	"content" text NOT NULL,
	"key_facts" jsonb DEFAULT '[]'::jsonb,
	"schools_mentioned" jsonb DEFAULT '[]'::jsonb,
	"tags" jsonb DEFAULT '[]'::jsonb,
	"source_article_title" text,
	"source_article_url" text,
	"source_credit" text,
	"image_path" text,
	"image_style" text,
	"author_name" text DEFAULT 'Mia Windsor',
	"author_title" text DEFAULT 'Managing Editor',
	"status" text DEFAULT 'draft',
	"publish_token" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"published_at" timestamp,
	"reading_time" integer,
	"article_type" text DEFAULT 'news',
	"view_count" integer DEFAULT 0,
	"fact_check_notes" jsonb DEFAULT '[]'::jsonb,
	CONSTRAINT "news_drafts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "school_campuses" (
	"id" varchar PRIMARY KEY NOT NULL,
	"school_id" varchar NOT NULL,
	"name" varchar(255) NOT NULL,
	"short_name" varchar(100),
	"address_full" text NOT NULL,
	"latitude" numeric(10, 8) NOT NULL,
	"longitude" numeric(11, 8) NOT NULL,
	"grades" varchar(255),
	"description" text,
	"display_order" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "school_fees" (
	"id" varchar PRIMARY KEY NOT NULL,
	"school_id" varchar NOT NULL,
	"academic_year" varchar(9) NOT NULL,
	"grade_level" varchar(100) NOT NULL,
	"grade_ages" varchar(50),
	"tuition_fee" integer,
	"capital_fee" integer,
	"enrollment_guarantee_fee" integer,
	"total_fee_early_bird" integer,
	"total_fee_standard" integer,
	"display_order" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "school_media" (
	"id" varchar PRIMARY KEY NOT NULL,
	"school_id" varchar(255) NOT NULL,
	"variant" varchar(30) NOT NULL,
	"url" varchar(500) NOT NULL,
	"display_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "school_one_time_fees" (
	"id" varchar PRIMARY KEY NOT NULL,
	"school_id" varchar NOT NULL,
	"academic_year" varchar(9) NOT NULL,
	"fee_name" varchar(255) NOT NULL,
	"amount" integer NOT NULL,
	"description" text,
	"display_order" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "school_results" (
	"id" varchar PRIMARY KEY NOT NULL,
	"school_id" varchar NOT NULL,
	"qualification_type" varchar(50) NOT NULL,
	"average_score" numeric(5, 2),
	"pass_rate" numeric(5, 2),
	"year" integer NOT NULL,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "school_translations" (
	"id" varchar PRIMARY KEY NOT NULL,
	"school_id" varchar NOT NULL,
	"locale" varchar(5) NOT NULL,
	"field_name" varchar(100) NOT NULL,
	"content" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "schools" (
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"city_slug" varchar(255),
	"address_full" text,
	"latitude" numeric(10, 8),
	"longitude" numeric(11, 8),
	"nearest_mrt" varchar(255),
	"phone" varchar(50),
	"email" varchar(255),
	"website" varchar(255),
	"student_count" varchar(50),
	"age_range" varchar(50),
	"curriculum" text[],
	"accreditation" text[],
	"founded_year" integer,
	"school_type" varchar(100),
	"fee_system_type" varchar(20),
	"fee_currency" varchar(3) DEFAULT 'IDR',
	"application_fee" integer,
	"enrollment_fee" integer,
	"head_name" varchar(255),
	"head_since" integer,
	"head_bio" text,
	"head_photo_url" varchar(500),
	"head_credentials" varchar(500),
	"nationalities_count" integer,
	"nationalities_description" text,
	"gender_split" varchar(50),
	"student_body_description" text,
	"academic_description" text,
	"school_hours" varchar(100),
	"uniform_required" boolean,
	"activities_count" integer,
	"facilities" text[],
	"school_life_description" text,
	"intelligence_summary" text,
	"intelligence_positives" text[],
	"intelligence_considerations" text[],
	"intelligence_updated_at" timestamp,
	"last_inspected" date,
	"inspection_body" varchar(255),
	"inspection_rating" varchar(100),
	"inspection_findings" text,
	"hero_image_url" varchar(500),
	"og_image_url" varchar(500),
	"logo_url" varchar(500),
	"gallery_images" text[],
	"verified_status" boolean DEFAULT false,
	"verified_date" date,
	"verified_content" text,
	"verified_content_updated_at" timestamp,
	"is_premium" boolean DEFAULT false,
	"published" boolean DEFAULT true,
	"last_updated" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"meta_title" varchar(255),
	"meta_description" text,
	CONSTRAINT "schools_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "admin_sessions" ADD CONSTRAINT "admin_sessions_user_id_admin_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."admin_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "city_translations" ADD CONSTRAINT "city_translations_city_slug_cities_slug_fk" FOREIGN KEY ("city_slug") REFERENCES "public"."cities"("slug") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fact_check_claims" ADD CONSTRAINT "fact_check_claims_run_id_fact_check_runs_id_fk" FOREIGN KEY ("run_id") REFERENCES "public"."fact_check_runs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "neighbourhoods" ADD CONSTRAINT "neighbourhoods_city_slug_cities_slug_fk" FOREIGN KEY ("city_slug") REFERENCES "public"."cities"("slug") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "school_campuses" ADD CONSTRAINT "school_campuses_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "school_fees" ADD CONSTRAINT "school_fees_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "school_one_time_fees" ADD CONSTRAINT "school_one_time_fees_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "school_results" ADD CONSTRAINT "school_results_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "school_translations" ADD CONSTRAINT "school_translations_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "schools" ADD CONSTRAINT "schools_city_slug_cities_slug_fk" FOREIGN KEY ("city_slug") REFERENCES "public"."cities"("slug") ON DELETE no action ON UPDATE no action;