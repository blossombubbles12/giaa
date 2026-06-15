import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "../db/schema";
import { eq } from "drizzle-orm";
import fs from "fs";
import path from "path";
import { slugify } from "../lib/utils";

if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set");
    process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql, { schema });

async function migrate() {
    console.log("🚀 Starting Tutor LMS Migration...");

    const filePath = path.join(process.cwd(), "public/output.json");
    if (!fs.existsSync(filePath)) {
        console.error("❌ output.json not found in public/");
        return;
    }

    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const items = data.rss.channel.item || [];

    const lpCourses = items.filter(
        (item: any) =>
            item["{http://wordpress.org/export/1.2/}post_type"]?.["#text"] === "lp_course"
    );
    const attachments = items.filter(
        (item: any) =>
            item["{http://wordpress.org/export/1.2/}post_type"]?.["#text"] === "attachment"
    );

    console.log(`📊 Found ${lpCourses.length} courses and ${attachments.length} attachments.`);

    // Map attachments for quick lookup
    const attachmentMap = new Map();
    attachments.forEach((att: any) => {
        const postId = att["{http://wordpress.org/export/1.2/}post_id"]?.["#text"];
        const url = att["{http://wordpress.org/export/1.2/}attachment_url"]?.["#text"] || att.guid?.["#text"];
        if (postId && url) {
            attachmentMap.set(postId, url);
        }
    });

    for (const item of lpCourses) {
        const title = item.title?.["#text"] || "Untitled Course";
        const slug = item["{http://wordpress.org/export/1.2/}post_name"]?.["#text"];
        const content = item["{http://purl.org/rss/1.0/modules/content/}encoded"]?.["#text"] || "";

        const postmeta = item["{http://wordpress.org/export/1.2/}postmeta"] || [];
        const meta: Record<string, string> = {};
        if (Array.isArray(postmeta)) {
            postmeta.forEach((m: any) => {
                const key = m["{http://wordpress.org/export/1.2/}meta_key"]?.["#text"];
                const value = m["{http://wordpress.org/export/1.2/}meta_value"]?.["#text"];
                if (key) meta[key] = value;
            });
        }

        const price = parseFloat(meta["_lp_price"] || "0");
        const duration = meta["_lp_duration"] || "";
        const targetAudience = meta["_lp_target_audiences"] || "";
        const thumbnailId = meta["_thumbnail_id"];
        const thumbnail = thumbnailId ? attachmentMap.get(thumbnailId) : null;

        // Handle Category
        let categoryId = null;
        const categories = item.category;
        const catArray = Array.isArray(categories) ? categories : categories ? [categories] : [];
        const courseCat = catArray.find((c: any) => c.domain === "course_category");

        if (courseCat) {
            const catName = courseCat["#text"];
            const catSlug = courseCat.nicename;

            // Upsert Category
            const existingCat = await db.query.categories.findFirst({
                where: eq(schema.categories.slug, catSlug),
            });

            if (existingCat) {
                categoryId = existingCat.id;
            } else {
                const newCat = await db.insert(schema.categories).values({
                    name: catName.replace(/&amp;/g, "&"),
                    slug: catSlug,
                }).returning({ id: schema.categories.id });
                categoryId = newCat[0].id;
            }
        }

        // Insert Course
        console.log(`📝 Migrating Course: ${title}`);
        
        // Generate a clean slug
        const courseSlug = slugify(slug || title) + (slug ? '' : `-${Math.random().toString(36).substring(2, 6)}`);

        try {
            const [newCourse] = await db.insert(schema.courses).values({
                title,
                slug: courseSlug,
                description: content,
                price,
                duration,
                targetAudience,
                thumbnail,
                categoryId,
                published: item["{http://wordpress.org/export/1.2/}status"]?.["#text"] === "publish",
            }).returning({ id: schema.courses.id });

            // Handle Tags
            const courseTags = catArray.filter((c: any) => c.domain === "course_tag");
            for (const tag of courseTags) {
                const tagName = tag["#text"];
                const tagSlug = tag.nicename;

                let tagId;
                const existingTag = await db.query.tags.findFirst({
                    where: eq(schema.tags.slug, tagSlug),
                });

                if (existingTag) {
                    tagId = existingTag.id;
                } else {
                    const insertedTag = await db.insert(schema.tags).values({
                        name: tagName,
                        slug: tagSlug,
                    }).returning({ id: schema.tags.id });
                    tagId = insertedTag[0].id;
                }

                await db.insert(schema.courseTags).values({
                    courseId: newCourse.id,
                    tagId: tagId,
                }).onConflictDoNothing();
            }
        } catch (error) {
            console.error(`❌ Failed to migrate ${title}:`, error);
        }
    }

    console.log("✅ Migration completed successfully!");
}

migrate().catch(console.error);
