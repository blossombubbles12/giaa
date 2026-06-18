import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

const sql = neon(process.env.DATABASE_URL!);

// Helper to run a single statement and swallow "already exists" errors
async function exec(statement: string, label: string) {
  try {
    await (sql as any).query(statement);
    console.log(`✓ ${label}`);
  } catch (err: any) {
    const skip = ['42P07', '42710', '42P04', '42P16', '23505'];
    if (skip.includes(err.code)) {
      console.log(`  (already exists) ${label}`);
    } else {
      console.error(`✗ FAILED: ${label}\n  ${err.message}`);
      process.exit(1);
    }
  }
}

async function main() {
  console.log('🚀 Running migrations against NeonDB...\n');

  await exec(`CREATE TYPE "public"."user_role" AS ENUM('ADMIN', 'STUDENT')`, 'ENUM user_role');
  await exec(`CREATE TYPE "public"."course_type" AS ENUM('ONLINE', 'OFFLINE')`, 'ENUM course_type');
  await exec(`CREATE TYPE "public"."enrollment_status" AS ENUM('PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED')`, 'ENUM enrollment_status');
  await exec(`CREATE TYPE "public"."payment_status" AS ENUM('PENDING', 'SUCCESS', 'FAILED')`, 'ENUM payment_status');
  await exec(`CREATE TYPE "public"."notification_type" AS ENUM('INFO', 'SUCCESS', 'WARNING', 'ERROR')`, 'ENUM notification_type');

  await exec(`
    CREATE TABLE IF NOT EXISTS "user" (
      "id" varchar(255) PRIMARY KEY NOT NULL,
      "name" varchar(255),
      "email" varchar(255) NOT NULL,
      "password" text NOT NULL,
      "role" "user_role" DEFAULT 'STUDENT' NOT NULL,
      "image" text,
      "created_at" timestamp DEFAULT now() NOT NULL,
      "updated_at" timestamp DEFAULT now() NOT NULL,
      CONSTRAINT "user_email_unique" UNIQUE("email")
    )
  `, 'TABLE user');

  // Missing user columns for full schema compatibility
  await exec(`ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "email_verified" timestamp`, `ADD COLUMN user.email_verified`);
  await exec(`ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "verification_token" text`, `ADD COLUMN user.verification_token`);
  await exec(`ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "reset_token" text`, `ADD COLUMN user.reset_token`);
  await exec(`ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "reset_token_expires" timestamp`, `ADD COLUMN user.reset_token_expires`);

  await exec(`
    CREATE TABLE IF NOT EXISTS "course" (
      "id" varchar(255) PRIMARY KEY NOT NULL,
      "title" varchar(255) NOT NULL,
      "description" text NOT NULL,
      "price" double precision NOT NULL,
      "type" "course_type" DEFAULT 'ONLINE' NOT NULL,
      "duration" varchar(255),
      "access_link" text,
      "category" varchar(255),
      "tags" text,
      "target_audience" text,
      "learning_outcomes" text,
      "thumbnail" text,
      "published" boolean DEFAULT false NOT NULL,
      "created_at" timestamp DEFAULT now() NOT NULL,
      "updated_at" timestamp DEFAULT now() NOT NULL
    )
  `, 'TABLE course');

  await exec(`
    CREATE TABLE IF NOT EXISTS "course_schedule" (
      "id" varchar(255) PRIMARY KEY NOT NULL,
      "course_id" varchar(255) NOT NULL,
      "start_date" timestamp NOT NULL,
      "end_date" timestamp NOT NULL,
      "location" varchar(255),
      "capacity" integer,
      "created_at" timestamp DEFAULT now() NOT NULL
    )
  `, 'TABLE course_schedule');

  await exec(`
    CREATE TABLE IF NOT EXISTS "lesson" (
      "id" varchar(255) PRIMARY KEY NOT NULL,
      "title" varchar(255) NOT NULL,
      "video_url" text,
      "content" text,
      "order" integer NOT NULL,
      "course_id" varchar(255) NOT NULL
    )
  `, 'TABLE lesson');

  await exec(`
    CREATE TABLE IF NOT EXISTS "material" (
      "id" varchar(255) PRIMARY KEY NOT NULL,
      "title" varchar(255) NOT NULL,
      "file_url" text NOT NULL,
      "course_id" varchar(255) NOT NULL
    )
  `, 'TABLE material');

  await exec(`
    CREATE TABLE IF NOT EXISTS "enrollment" (
      "id" varchar(255) PRIMARY KEY NOT NULL,
      "user_id" varchar(255) NOT NULL,
      "course_id" varchar(255) NOT NULL,
      "status" "enrollment_status" DEFAULT 'ACTIVE' NOT NULL,
      "created_at" timestamp DEFAULT now() NOT NULL
    )
  `, 'TABLE enrollment');

  await exec(
    `CREATE UNIQUE INDEX IF NOT EXISTS "enrollment_user_id_course_id_key" ON "enrollment"("user_id", "course_id")`,
    'INDEX enrollment_user_course'
  );

  await exec(`
    CREATE TABLE IF NOT EXISTS "event" (
      "id" varchar(255) PRIMARY KEY NOT NULL,
      "title" varchar(255) NOT NULL,
      "description" text,
      "location" varchar(255),
      "capacity" integer NOT NULL,
      "start_date" timestamp NOT NULL,
      "end_date" timestamp NOT NULL,
      "created_at" timestamp DEFAULT now() NOT NULL
    )
  `, 'TABLE event');
  await exec(`ALTER TABLE "event" ADD COLUMN IF NOT EXISTS "slug" varchar(255)`, `ADD COLUMN event.slug`);
  await exec(`ALTER TABLE "event" ADD COLUMN IF NOT EXISTS "thumbnail" text`, `ADD COLUMN event.thumbnail`);
  await exec(`ALTER TABLE "event" ADD COLUMN IF NOT EXISTS "thumbnail_public_id" varchar(255)`, `ADD COLUMN event.thumbnail_public_id`);

  await exec(`
    CREATE TABLE IF NOT EXISTS "booking" (
      "id" varchar(255) PRIMARY KEY NOT NULL,
      "user_id" varchar(255) NOT NULL,
      "event_id" varchar(255) NOT NULL,
      "created_at" timestamp DEFAULT now() NOT NULL
    )
  `, 'TABLE booking');

  await exec(`
    CREATE TABLE IF NOT EXISTS "certificate" (
      "id" varchar(255) PRIMARY KEY NOT NULL,
      "user_id" varchar(255),
      "recipient_name" varchar(255),
      "recipient_email" varchar(255),
      "course_id" varchar(255) NOT NULL,
      "short_code" varchar(20) NOT NULL,
      "pdf_url" text NOT NULL,
      "verify_hash" varchar(255) NOT NULL,
      "issued_at" timestamp DEFAULT now() NOT NULL,
      CONSTRAINT "certificate_verify_hash_unique" UNIQUE("verify_hash")
    )
  `, 'TABLE certificate');

  await exec(`
    CREATE TABLE IF NOT EXISTS "payment" (
      "id" varchar(255) PRIMARY KEY NOT NULL,
      "amount" double precision NOT NULL,
      "status" "payment_status" DEFAULT 'PENDING' NOT NULL,
      "transaction_id" varchar(255),
      "user_id" varchar(255) NOT NULL,
      "course_id" varchar(255) NOT NULL,
      "created_at" timestamp DEFAULT now() NOT NULL,
      CONSTRAINT "payment_transaction_id_unique" UNIQUE("transaction_id")
    )
  `, 'TABLE payment');

  await exec(`
    CREATE TABLE IF NOT EXISTS "testimonial" (
      "id" varchar(255) PRIMARY KEY NOT NULL,
      "user_id" varchar(255) NOT NULL,
      "content" text NOT NULL,
      "rating" integer DEFAULT 5 NOT NULL,
      "approved" boolean DEFAULT false NOT NULL,
      "created_at" timestamp DEFAULT now() NOT NULL
    )
  `, 'TABLE testimonial');

  await exec(`
    CREATE TABLE IF NOT EXISTS "page_content" (
      "id" varchar(255) PRIMARY KEY NOT NULL,
      "key" varchar(255) NOT NULL,
      "value" text NOT NULL,
      "updated_at" timestamp DEFAULT now() NOT NULL,
      CONSTRAINT "page_content_key_unique" UNIQUE("key")
    )
  `, 'TABLE page_content');

  await exec(`
    CREATE TABLE IF NOT EXISTS "category" (
      "id" varchar(255) PRIMARY KEY NOT NULL,
      "name" varchar(255) NOT NULL,
      "slug" varchar(255) NOT NULL,
      "description" text,
      "created_at" timestamp DEFAULT now() NOT NULL,
      CONSTRAINT "category_name_unique" UNIQUE("name"),
      CONSTRAINT "category_slug_unique" UNIQUE("slug")
    )
  `, 'TABLE category');

  await exec(`
    CREATE TABLE IF NOT EXISTS "tag" (
      "id" varchar(255) PRIMARY KEY NOT NULL,
      "name" varchar(255) NOT NULL,
      "slug" varchar(255) NOT NULL,
      "created_at" timestamp DEFAULT now() NOT NULL,
      CONSTRAINT "tag_name_unique" UNIQUE("name"),
      CONSTRAINT "tag_slug_unique" UNIQUE("slug")
    )
  `, 'TABLE tag');

  await exec(`
    CREATE TABLE IF NOT EXISTS "course_tag" (
      "course_id" varchar(255) NOT NULL,
      "tag_id" varchar(255) NOT NULL
    )
  `, 'TABLE course_tag');

  await exec(`
    CREATE UNIQUE INDEX IF NOT EXISTS "course_tag_course_id_tag_id_key" ON "course_tag"("course_id", "tag_id")
  `, 'INDEX course_tag');

  await exec(`
    CREATE TABLE IF NOT EXISTS "notification" (
      "id" varchar(255) PRIMARY KEY NOT NULL,
      "user_id" varchar(255) NOT NULL,
      "title" varchar(255) NOT NULL,
      "message" text NOT NULL,
      "read" boolean DEFAULT false NOT NULL,
      "type" "notification_type" DEFAULT 'INFO' NOT NULL,
      "link" text,
      "created_at" timestamp DEFAULT now() NOT NULL
    )
  `, 'TABLE notification');

  await exec(`
    CREATE TABLE IF NOT EXISTS "settings" (
      "id" varchar(255) PRIMARY KEY NOT NULL,
      "group" varchar(255) NOT NULL,
      "key" varchar(255) NOT NULL,
      "value" text NOT NULL,
      "updated_at" timestamp DEFAULT now() NOT NULL,
      CONSTRAINT "settings_key_unique" UNIQUE("key")
    )
  `, 'TABLE settings');

  await exec(`
    CREATE TABLE IF NOT EXISTS "gallery" (
      "id" varchar(255) PRIMARY KEY NOT NULL,
      "title" varchar(255) NOT NULL,
      "description" text,
      "images" json DEFAULT '[]' NOT NULL,
      "created_at" timestamp DEFAULT now() NOT NULL
    )
  `, 'TABLE gallery');

  await exec(`
    CREATE TABLE IF NOT EXISTS "post_category" (
      "id" varchar(255) PRIMARY KEY NOT NULL,
      "name" varchar(255) NOT NULL,
      "slug" varchar(255) NOT NULL,
      "description" text,
      "created_at" timestamp DEFAULT now() NOT NULL,
      CONSTRAINT "post_category_name_unique" UNIQUE("name"),
      CONSTRAINT "post_category_slug_unique" UNIQUE("slug")
    )
  `, 'TABLE post_category');

  await exec(`
    CREATE TABLE IF NOT EXISTS "post_tag" (
      "id" varchar(255) PRIMARY KEY NOT NULL,
      "name" varchar(255) NOT NULL,
      "slug" varchar(255) NOT NULL,
      "created_at" timestamp DEFAULT now() NOT NULL,
      CONSTRAINT "post_tag_name_unique" UNIQUE("name"),
      CONSTRAINT "post_tag_slug_unique" UNIQUE("slug")
    )
  `, 'TABLE post_tag');

  await exec(`
    CREATE TABLE IF NOT EXISTS "post" (
      "id" varchar(255) PRIMARY KEY NOT NULL,
      "title" varchar(255) NOT NULL,
      "slug" varchar(255) NOT NULL,
      "content" text NOT NULL,
      "excerpt" text,
      "thumbnail" text,
      "thumbnail_public_id" varchar(255),
      "category_id" varchar(255),
      "published" boolean DEFAULT false NOT NULL,
      "author_id" varchar(255),
      "created_at" timestamp DEFAULT now() NOT NULL,
      "updated_at" timestamp DEFAULT now() NOT NULL,
      CONSTRAINT "post_slug_unique" UNIQUE("slug")
    )
  `, 'TABLE post');

  await exec(`
    CREATE TABLE IF NOT EXISTS "post_tag_junction" (
      "post_id" varchar(255) NOT NULL,
      "tag_id" varchar(255) NOT NULL
    )
  `, 'TABLE post_tag_junction');

  await exec(`
    CREATE UNIQUE INDEX IF NOT EXISTS "post_tag_junction_post_id_tag_id_key" ON "post_tag_junction"("post_id", "tag_id")
  `, 'INDEX post_tag_junction');

  // Drop existing constraints if they exist to ensure we can update them with CASCADE
  // We use both name patterns (manual and drizzle-kit generated) for total coverage
  await exec(`ALTER TABLE "enrollment" DROP CONSTRAINT IF EXISTS "enrollment_user_id_fk"`, 'DROP FK enrollment->user (1)');
  await exec(`ALTER TABLE "enrollment" DROP CONSTRAINT IF EXISTS "enrollment_user_id_user_id_fk"`, 'DROP FK enrollment->user (2)');
  await exec(`ALTER TABLE "enrollment" ADD CONSTRAINT "enrollment_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade`, 'FK enrollment->user');

  await exec(`ALTER TABLE "payment" DROP CONSTRAINT IF EXISTS "payment_user_id_fk"`, 'DROP FK payment->user (1)');
  await exec(`ALTER TABLE "payment" DROP CONSTRAINT IF EXISTS "payment_user_id_user_id_fk"`, 'DROP FK payment->user (2)');
  await exec(`ALTER TABLE "payment" ADD CONSTRAINT "payment_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade`, 'FK payment->user');

  await exec(`ALTER TABLE "testimonial" DROP CONSTRAINT IF EXISTS "testimonial_user_id_fk"`, 'DROP FK testimonial->user (1)');
  await exec(`ALTER TABLE "testimonial" DROP CONSTRAINT IF EXISTS "testimonial_user_id_user_id_fk"`, 'DROP FK testimonial->user (2)');
  await exec(`ALTER TABLE "testimonial" ADD CONSTRAINT "testimonial_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade`, 'FK testimonial->user');

  await exec(`ALTER TABLE "booking" DROP CONSTRAINT IF EXISTS "booking_user_id_fk"`, 'DROP FK booking->user (1)');
  await exec(`ALTER TABLE "booking" DROP CONSTRAINT IF EXISTS "booking_user_id_user_id_fk"`, 'DROP FK booking->user (2)');
  await exec(`ALTER TABLE "booking" ADD CONSTRAINT "booking_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade`, 'FK booking->user');

  await exec(`ALTER TABLE "certificate" DROP CONSTRAINT IF EXISTS "certificate_user_id_fk"`, 'DROP FK certificate->user (1)');
  await exec(`ALTER TABLE "certificate" DROP CONSTRAINT IF EXISTS "certificate_user_id_user_id_fk"`, 'DROP FK certificate->user (2)');
  await exec(`ALTER TABLE "certificate" ADD CONSTRAINT "certificate_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade`, 'FK certificate->user');

  // New certificate columns for guest/unregistered recipients
  await exec(`ALTER TABLE "certificate" ADD COLUMN IF NOT EXISTS "recipient_name" varchar(255)`, `ADD COLUMN certificate.recipient_name`);
  await exec(`ALTER TABLE "certificate" ADD COLUMN IF NOT EXISTS "recipient_email" varchar(255)`, `ADD COLUMN certificate.recipient_email`);
  await exec(`ALTER TABLE "certificate" ALTER COLUMN "user_id" DROP NOT NULL`, 'ALTER certificate.user_id DROP NOT NULL');
  await exec(`ALTER TABLE "certificate" ADD COLUMN IF NOT EXISTS "short_code" varchar(20)`, `ADD COLUMN certificate.short_code`);

  await exec(`ALTER TABLE "notification" DROP CONSTRAINT IF EXISTS "notification_user_id_fk"`, 'DROP FK notification->user (1)');
  await exec(`ALTER TABLE "notification" DROP CONSTRAINT IF EXISTS "notification_user_id_user_id_fk"`, 'DROP FK notification->user (2)');
  await exec(`ALTER TABLE "notification" ADD CONSTRAINT "notification_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade`, 'FK notification->user');

  await exec(`ALTER TABLE "post" DROP CONSTRAINT IF EXISTS "post_author_id_fk"`, 'DROP FK post->user (1)');
  await exec(`ALTER TABLE "post" DROP CONSTRAINT IF EXISTS "post_author_id_user_id_fk"`, 'DROP FK post->user (2)');
  await exec(`ALTER TABLE "post" ADD CONSTRAINT "post_author_id_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "user"("id") ON DELETE SET NULL`, 'FK post->user');

  // Other Foreign Keys (Course relations)
  await exec(`ALTER TABLE "lesson" DROP CONSTRAINT IF EXISTS "lesson_course_id_fk"`, 'DROP FK lesson->course (1)');
  await exec(`ALTER TABLE "lesson" DROP CONSTRAINT IF EXISTS "lesson_course_id_course_id_fk"`, 'DROP FK lesson->course (2)');
  await exec(`ALTER TABLE "lesson" ADD CONSTRAINT "lesson_course_id_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE cascade`, 'FK lesson->course');

  await exec(`ALTER TABLE "material" DROP CONSTRAINT IF EXISTS "material_course_id_fk"`, 'DROP FK material->course (1)');
  await exec(`ALTER TABLE "material" DROP CONSTRAINT IF EXISTS "material_course_id_course_id_fk"`, 'DROP FK material->course (2)');
  await exec(`ALTER TABLE "material" ADD CONSTRAINT "material_course_id_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE cascade`, 'FK material->course');

  await exec(`ALTER TABLE "enrollment" DROP CONSTRAINT IF EXISTS "enrollment_course_id_fk"`, 'DROP FK enrollment->course (1)');
  await exec(`ALTER TABLE "enrollment" DROP CONSTRAINT IF EXISTS "enrollment_course_id_course_id_fk"`, 'DROP FK enrollment->course (2)');
  await exec(`ALTER TABLE "enrollment" ADD CONSTRAINT "enrollment_course_id_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE cascade`, 'FK enrollment->course');

  await exec(`ALTER TABLE "booking" DROP CONSTRAINT IF EXISTS "booking_event_id_fk"`, 'DROP FK booking->event (1)');
  await exec(`ALTER TABLE "booking" DROP CONSTRAINT IF EXISTS "booking_event_id_event_id_fk"`, 'DROP FK booking->event (2)');
  await exec(`ALTER TABLE "booking" ADD CONSTRAINT "booking_event_id_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE cascade`, 'FK booking->event');

  await exec(`ALTER TABLE "certificate" DROP CONSTRAINT IF EXISTS "certificate_course_id_fk"`, 'DROP FK certificate->course (1)');
  await exec(`ALTER TABLE "certificate" DROP CONSTRAINT IF EXISTS "certificate_course_id_course_id_fk"`, 'DROP FK certificate->course (2)');
  await exec(`ALTER TABLE "certificate" ADD CONSTRAINT "certificate_course_id_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE cascade`, 'FK certificate->course');

  await exec(`ALTER TABLE "payment" DROP CONSTRAINT IF EXISTS "payment_course_id_fk"`, 'DROP FK payment->course (1)');
  await exec(`ALTER TABLE "payment" DROP CONSTRAINT IF EXISTS "payment_course_id_course_id_fk"`, 'DROP FK payment->course (2)');
  await exec(`ALTER TABLE "payment" ADD CONSTRAINT "payment_course_id_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE cascade`, 'FK payment->course');

  await exec(`ALTER TABLE "course_schedule" DROP CONSTRAINT IF EXISTS "course_schedule_course_id_fk"`, 'DROP FK course_schedule->course (1)');
  await exec(`ALTER TABLE "course_schedule" DROP CONSTRAINT IF EXISTS "course_schedule_course_id_course_id_fk"`, 'DROP FK course_schedule->course (2)');
  await exec(`ALTER TABLE "course_schedule" ADD CONSTRAINT "course_schedule_course_id_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE cascade`, 'FK course_schedule->course');

  // Blog Meta Keys
  await exec(`ALTER TABLE "post" DROP CONSTRAINT IF EXISTS "post_category_id_fk"`, 'DROP FK post->category (1)');
  await exec(`ALTER TABLE "post" DROP CONSTRAINT IF EXISTS "post_category_id_category_id_fk"`, 'DROP FK post->category (2)');
  await exec(`ALTER TABLE "post" ADD CONSTRAINT "post_category_id_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "post_category"("id") ON DELETE SET NULL`, 'FK post->category');

  await exec(`ALTER TABLE "post_tag_junction" DROP CONSTRAINT IF EXISTS "post_tag_junction_post_id_fk"`, 'DROP FK junction->post (1)');
  await exec(`ALTER TABLE "post_tag_junction" DROP CONSTRAINT IF EXISTS "post_tag_junction_post_id_post_id_fk"`, 'DROP FK junction->post (2)');
  await exec(`ALTER TABLE "post_tag_junction" ADD CONSTRAINT "post_tag_junction_post_id_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE CASCADE`, 'FK junction->post');

  await exec(`ALTER TABLE "post_tag_junction" DROP CONSTRAINT IF EXISTS "post_tag_junction_tag_id_fk"`, 'DROP FK junction->tag (1)');
  await exec(`ALTER TABLE "post_tag_junction" DROP CONSTRAINT IF EXISTS "post_tag_junction_tag_id_tag_id_fk"`, 'DROP FK junction->tag (2)');
  await exec(`ALTER TABLE "post_tag_junction" ADD CONSTRAINT "post_tag_junction_tag_id_tag_id_fk" FOREIGN KEY ("tag_id") REFERENCES "post_tag"("id") ON DELETE CASCADE`, 'FK junction->tag');

  // Add missing columns to tables if they don't exist
  await exec(`ALTER TABLE "course" ADD COLUMN IF NOT EXISTS "thumbnail_public_id" varchar(255)`, `ADD COLUMN course.thumbnail_public_id`);
  await exec(`ALTER TABLE "material" ADD COLUMN IF NOT EXISTS "public_id" varchar(255)`, `ADD COLUMN material.public_id`);
  await exec(`ALTER TABLE "event" ADD COLUMN IF NOT EXISTS "thumbnail" text`, `ADD COLUMN event.thumbnail`);
  await exec(`ALTER TABLE "event" ADD COLUMN IF NOT EXISTS "thumbnail_public_id" varchar(255)`, `ADD COLUMN event.thumbnail_public_id`);

  const columns = [
    { name: 'slug', type: 'varchar(255)' },
    { name: 'duration', type: 'varchar(255)' },
    { name: 'access_link', type: 'text' },
    { name: 'category_id', type: 'varchar(255)' },
    { name: 'target_audience', type: 'text' },
    { name: 'learning_outcomes', type: 'text' },
    { name: 'venue', type: 'varchar(255)' },
    { name: 'certification_type_id', type: 'varchar(255)' },
    { name: 'year', type: 'integer' },
    { name: 'month', type: 'varchar(50)' },
  ];

  for (const col of columns) {
    await exec(`ALTER TABLE "course" ADD COLUMN IF NOT EXISTS "${col.name}" ${col.type}`, `ADD COLUMN course.${col.name}`);
  }

  // FK for category_id
  await exec(`ALTER TABLE "course" ADD CONSTRAINT "course_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE SET NULL`, 'FK course->category');

  // New billing and payment type columns
  await exec(`ALTER TABLE "enrollment" ADD COLUMN IF NOT EXISTS "billing_email" varchar(255)`, `ADD COLUMN enrollment.billing_email`);
  await exec(`ALTER TABLE "enrollment" ADD COLUMN IF NOT EXISTS "billing_address" text`, `ADD COLUMN enrollment.billing_address`);
  await exec(`ALTER TABLE "payment" ADD COLUMN IF NOT EXISTS "payment_type" varchar(50) DEFAULT 'SELF'`, `ADD COLUMN payment.payment_type`);

  // Certification and Course expansion
  await exec(`
    CREATE TABLE IF NOT EXISTS "certification_type" (
      "id" varchar(255) PRIMARY KEY NOT NULL,
      "name" varchar(255) NOT NULL,
      "description" text,
      "created_at" timestamp DEFAULT now() NOT NULL,
      CONSTRAINT "certification_type_name_unique" UNIQUE("name")
    )
  `, 'TABLE certification_type');

  const courseExpansion = [
    { name: 'venue', type: 'varchar(255)' },
    { name: 'certification_type_id', type: 'varchar(255)' },
    { name: 'year', type: 'integer' },
    { name: 'month', type: 'varchar(50)' }
  ];

  for (const col of courseExpansion) {
    await exec(`ALTER TABLE "course" ADD COLUMN IF NOT EXISTS "${col.name}" ${col.type}`, `ADD COLUMN course.${col.name}`);
  }

  await exec(`ALTER TABLE "course" ADD CONSTRAINT "course_certification_type_id_fk" FOREIGN KEY ("certification_type_id") REFERENCES "certification_type"("id") ON DELETE SET NULL`, 'FK course->certification_type');

  console.log('\n✅ All migrations applied successfully!');
  process.exit(0);
}

main();
