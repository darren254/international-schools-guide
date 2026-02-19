import {
  pgTable,
  varchar,
  text,
  integer,
  boolean,
  numeric,
  date,
  timestamp,
  jsonb,
  serial,
} from "drizzle-orm/pg-core";

// ─── Cities ───────────────────────────────────────────
export const cities = pgTable("cities", {
  id: varchar("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  country: varchar("country", { length: 100 }),
  description: text("description"),
  metaTitle: varchar("meta_title", { length: 255 }),
  metaDescription: text("meta_description"),
  centerLatitude: numeric("center_latitude", { precision: 10, scale: 8 }),
  centerLongitude: numeric("center_longitude", { precision: 11, scale: 8 }),
  mapZoom: integer("map_zoom").default(11),
  createdAt: timestamp("created_at").defaultNow(),
});

// ─── Neighbourhoods (for map overlays) ────────────────
export const neighbourhoods = pgTable("neighbourhoods", {
  id: varchar("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  citySlug: varchar("city_slug", { length: 255 }).references(() => cities.slug),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull(),
  // GeoJSON polygon stored as JSONB for fuzzy boundary rendering
  boundary: jsonb("boundary"),
  centerLatitude: numeric("center_latitude", { precision: 10, scale: 8 }),
  centerLongitude: numeric("center_longitude", { precision: 11, scale: 8 }),
  isKeyAnchor: boolean("is_key_anchor").default(false),
  displayOrder: integer("display_order").default(0),
});

// ─── Schools ──────────────────────────────────────────
export const schools = pgTable("schools", {
  id: varchar("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  citySlug: varchar("city_slug", { length: 255 }).references(() => cities.slug),
  // Primary address (for single-campus schools)
  addressFull: text("address_full"),
  latitude: numeric("latitude", { precision: 10, scale: 8 }),
  longitude: numeric("longitude", { precision: 11, scale: 8 }),
  nearestMrt: varchar("nearest_mrt", { length: 255 }),
  // Contact (nullable — section hidden when empty)
  phone: varchar("phone", { length: 50 }),
  email: varchar("email", { length: 255 }),
  website: varchar("website", { length: 255 }),
  // Overview
  studentCount: varchar("student_count", { length: 50 }),
  ageRange: varchar("age_range", { length: 50 }),
  curriculum: text("curriculum").array(),
  accreditation: text("accreditation").array(),
  foundedYear: integer("founded_year"),
  schoolType: varchar("school_type", { length: 100 }), // 'Non-profit, Co-ed' etc.
  // Fees
  feeSystemType: varchar("fee_system_type", { length: 20 }),
  feeCurrency: varchar("fee_currency", { length: 3 }).default("IDR"),
  applicationFee: integer("application_fee"),
  enrollmentFee: integer("enrollment_fee"),
  // Head of School
  headName: varchar("head_name", { length: 255 }),
  headSince: integer("head_since"),
  headBio: text("head_bio"),
  headPhotoUrl: varchar("head_photo_url", { length: 500 }),
  headCredentials: varchar("head_credentials", { length: 500 }),
  // Student body
  nationalitiesCount: integer("nationalities_count"),
  nationalitiesDescription: text("nationalities_description"),
  genderSplit: varchar("gender_split", { length: 50 }),
  studentBodyDescription: text("student_body_description"),
  // Academics
  academicDescription: text("academic_description"),
  // School life
  schoolHours: varchar("school_hours", { length: 100 }),
  uniformRequired: boolean("uniform_required"),
  activitiesCount: integer("activities_count"),
  facilities: text("facilities").array(),
  schoolLifeDescription: text("school_life_description"),
  // The Intelligence (editorial)
  intelligenceSummary: text("intelligence_summary"),
  intelligencePositives: text("intelligence_positives").array(),
  intelligenceConsiderations: text("intelligence_considerations").array(),
  intelligenceUpdatedAt: timestamp("intelligence_updated_at"),
  // Inspection
  lastInspected: date("last_inspected"),
  inspectionBody: varchar("inspection_body", { length: 255 }),
  inspectionRating: varchar("inspection_rating", { length: 100 }),
  inspectionFindings: text("inspection_findings"),
  // Media
  heroImageUrl: varchar("hero_image_url", { length: 500 }),
  galleryImages: text("gallery_images").array(),
  // Verified status
  verifiedStatus: boolean("verified_status").default(false),
  verifiedDate: date("verified_date"),
  verifiedContent: text("verified_content"),
  verifiedContentUpdatedAt: timestamp("verified_content_updated_at"),
  // Listing
  isPremium: boolean("is_premium").default(false),
  published: boolean("published").default(true),
  lastUpdated: timestamp("last_updated").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  // SEO
  metaTitle: varchar("meta_title", { length: 255 }),
  metaDescription: text("meta_description"),
});

// ─── School Campuses (multi-campus support) ───────────
export const schoolCampuses = pgTable("school_campuses", {
  id: varchar("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  schoolId: varchar("school_id").references(() => schools.id).notNull(),
  name: varchar("name", { length: 255 }).notNull(), // e.g. "Cilandak Campus", "Pattimura Campus"
  shortName: varchar("short_name", { length: 100 }), // e.g. "Cilandak", "Pattimura"
  addressFull: text("address_full").notNull(),
  latitude: numeric("latitude", { precision: 10, scale: 8 }).notNull(),
  longitude: numeric("longitude", { precision: 11, scale: 8 }).notNull(),
  grades: varchar("grades", { length: 255 }), // e.g. "Early Childhood–High School", "Elementary K–5"
  description: text("description"),
  displayOrder: integer("display_order").default(0),
});

// ─── Fee Schedule (complete, per-grade) ───────────────
export const schoolFees = pgTable("school_fees", {
  id: varchar("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  schoolId: varchar("school_id").references(() => schools.id).notNull(),
  academicYear: varchar("academic_year", { length: 9 }).notNull(), // '2025-2026'
  gradeLevel: varchar("grade_level", { length: 100 }).notNull(), // 'Early Years 1 & 2 Half Day'
  gradeAges: varchar("grade_ages", { length: 50 }), // '3–4 years'
  // Store in local currency (IDR), convert at display time
  tuitionFee: integer("tuition_fee"),
  capitalFee: integer("capital_fee"),
  enrollmentGuaranteeFee: integer("enrollment_guarantee_fee"),
  totalFeeEarlyBird: integer("total_fee_early_bird"),
  totalFeeStandard: integer("total_fee_standard"),
  displayOrder: integer("display_order").default(0),
});

// ─── One-Time / Additional Fees ───────────────────────
export const schoolOneTimeFees = pgTable("school_one_time_fees", {
  id: varchar("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  schoolId: varchar("school_id").references(() => schools.id).notNull(),
  academicYear: varchar("academic_year", { length: 9 }).notNull(),
  feeName: varchar("fee_name", { length: 255 }).notNull(), // 'Application Fee', 'Technology Fee (MS/HS)'
  amount: integer("amount").notNull(),
  description: text("description"),
  displayOrder: integer("display_order").default(0),
});

// ─── Academic Results (flexible, not IB-specific) ─────
export const schoolResults = pgTable("school_results", {
  id: varchar("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  schoolId: varchar("school_id").references(() => schools.id).notNull(),
  qualificationType: varchar("qualification_type", { length: 50 }).notNull(), // 'IB Diploma', 'A-Levels', 'AP', 'IGCSE'
  averageScore: numeric("average_score", { precision: 5, scale: 2 }),
  passRate: numeric("pass_rate", { precision: 5, scale: 2 }),
  year: integer("year").notNull(),
  notes: text("notes"),
});

// ─── Translations (i18n) ─────────────────────────────
export const schoolTranslations = pgTable("school_translations", {
  id: varchar("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  schoolId: varchar("school_id").references(() => schools.id).notNull(),
  locale: varchar("locale", { length: 5 }).notNull(), // 'en', 'ko', 'ja', 'zh', etc.
  fieldName: varchar("field_name", { length: 100 }).notNull(), // 'intelligence_summary', 'head_bio', etc.
  content: text("content").notNull(),
});

export const cityTranslations = pgTable("city_translations", {
  id: varchar("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  citySlug: varchar("city_slug", { length: 255 }).references(() => cities.slug).notNull(),
  locale: varchar("locale", { length: 5 }).notNull(),
  fieldName: varchar("field_name", { length: 100 }).notNull(),
  content: text("content").notNull(),
});

// ─── Exchange Rates (weekly auto-update) ──────────────
export const exchangeRates = pgTable("exchange_rates", {
  id: serial("id").primaryKey(),
  fromCurrency: varchar("from_currency", { length: 3 }).notNull(),
  toCurrency: varchar("to_currency", { length: 3 }).notNull(),
  rate: numeric("rate", { precision: 12, scale: 4 }).notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ─── Guides / Insights ────────────────────────────────
export const guides = pgTable("guides", {
  id: varchar("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  content: text("content"),
  excerpt: text("excerpt"),
  guideType: varchar("guide_type", { length: 50 }),
  citySlug: varchar("city_slug", { length: 255 }),
  tags: text("tags").array(),
  heroImageUrl: varchar("hero_image_url", { length: 500 }),
  ogImageUrl: varchar("og_image_url", { length: 500 }),
  readTime: integer("read_time"),
  author: varchar("author", { length: 255 }),
  metaTitle: varchar("meta_title", { length: 255 }),
  metaDescription: text("meta_description"),
  faqSchema: text("faq_schema"),
  published: boolean("published").default(false),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ─── News ─────────────────────────────────────────────
export const newsDrafts = pgTable("news_drafts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  standfirst: text("standfirst"),
  metaDescription: text("meta_description"),
  category: text("category").default("NEWS"),
  content: text("content").notNull(),
  keyFacts: jsonb("key_facts").default([]),
  schoolsMentioned: jsonb("schools_mentioned").default([]),
  tags: jsonb("tags").default([]),
  sourceArticleTitle: text("source_article_title"),
  sourceArticleUrl: text("source_article_url"),
  sourceCredit: text("source_credit"),
  imagePath: text("image_path"),
  imageStyle: text("image_style"),
  authorName: text("author_name").default("Mia Windsor"),
  authorTitle: text("author_title").default("Managing Editor"),
  status: text("status").default("draft"),
  publishToken: text("publish_token").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  publishedAt: timestamp("published_at"),
  readingTime: integer("reading_time"),
  articleType: text("article_type").default("news"),
  viewCount: integer("view_count").default(0),
  factCheckNotes: jsonb("fact_check_notes").default([]),
});

// ─── Contact Messages ─────────────────────────────────
export const contactMessages = pgTable("contact_messages", {
  id: varchar("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  inquiryType: varchar("inquiry_type", { length: 50 }).notNull(),
  schoolName: varchar("school_name", { length: 255 }),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
