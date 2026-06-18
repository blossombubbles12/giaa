import { pgTable, text, varchar, timestamp, boolean, doublePrecision, integer, pgEnum, uniqueIndex, json } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const userRoleEnum = pgEnum("user_role", ["ADMIN", "STUDENT"]);
export const courseTypeEnum = pgEnum("course_type", ["ONLINE", "OFFLINE"]);
export const enrollmentStatusEnum = pgEnum("enrollment_status", ["PENDING", "ACTIVE", "COMPLETED", "CANCELLED"]);
export const paymentStatusEnum = pgEnum("payment_status", ["PENDING", "SUCCESS", "FAILED"]);
export const notificationTypeEnum = pgEnum("notification_type", ["INFO", "SUCCESS", "WARNING", "ERROR"]);

export const users = pgTable("user", {
    id: varchar("id", { length: 255 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    name: varchar("name", { length: 255 }),
    email: varchar("email", { length: 255 }).unique().notNull(),
    password: text("password").notNull(),
    role: userRoleEnum("role").default("STUDENT").notNull(),
    image: text("image"),
    emailVerified: timestamp("email_verified"),
    verificationToken: text("verification_token"),
    resetToken: text("reset_token"),
    resetTokenExpires: timestamp("reset_token_expires"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const categories = pgTable("category", {
    id: varchar("id", { length: 255 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    name: varchar("name", { length: 255 }).notNull().unique(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    description: text("description"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const tags = pgTable("tag", {
    id: varchar("id", { length: 255 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    name: varchar("name", { length: 255 }).notNull().unique(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const certificationTypes = pgTable("certification_type", {
    id: varchar("id", { length: 255 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    name: varchar("name", { length: 255 }).notNull().unique(),
    description: text("description"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const courses = pgTable("course", {
    id: varchar("id", { length: 255 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    title: varchar("title", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    description: text("description").notNull(),
    price: doublePrecision("price").notNull(),
    type: courseTypeEnum("type").default("ONLINE").notNull(),
    duration: varchar("duration", { length: 255 }),
    venue: varchar("venue", { length: 255 }),
    certificationTypeId: varchar("certification_type_id", { length: 255 }).references(() => certificationTypes.id, { onDelete: "set null" }),
    year: integer("year"),
    month: varchar("month", { length: 50 }),
    accessLink: text("access_link"),
    categoryId: varchar("category_id", { length: 255 }).references(() => categories.id, { onDelete: "set null" }),
    targetAudience: text("target_audience"),
    learningOutcomes: text("learning_outcomes"),
    thumbnail: text("thumbnail"),
    thumbnailPublicId: varchar("thumbnail_public_id", { length: 255 }),
    published: boolean("published").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const courseTags = pgTable("course_tag", {
    courseId: varchar("course_id", { length: 255 }).references(() => courses.id, { onDelete: "cascade" }).notNull(),
    tagId: varchar("tag_id", { length: 255 }).references(() => tags.id, { onDelete: "cascade" }).notNull(),
}, (t) => ({
    pk: uniqueIndex("course_tag_course_id_tag_id_key").on(t.courseId, t.tagId),
}));

export const courseSchedules = pgTable("course_schedule", {
    id: varchar("id", { length: 255 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    courseId: varchar("course_id", { length: 255 }).references(() => courses.id, { onDelete: "cascade" }).notNull(),
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date").notNull(),
    location: varchar("location", { length: 255 }),
    capacity: integer("capacity"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const lessons = pgTable("lesson", {
    id: varchar("id", { length: 255 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    title: varchar("title", { length: 255 }).notNull(),
    videoUrl: text("video_url"),
    content: text("content"),
    order: integer("order").notNull(),
    courseId: varchar("course_id", { length: 255 }).references(() => courses.id, { onDelete: "cascade" }).notNull(),
});

export const materials = pgTable("material", {
    id: varchar("id", { length: 255 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    title: varchar("title", { length: 255 }).notNull(),
    fileUrl: text("file_url").notNull(),
    publicId: varchar("public_id", { length: 255 }),
    courseId: varchar("course_id", { length: 255 }).references(() => courses.id, { onDelete: "cascade" }).notNull(),
});

export const enrollments = pgTable("enrollment", {
    id: varchar("id", { length: 255 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: varchar("user_id", { length: 255 }).references(() => users.id, { onDelete: "cascade" }).notNull(),
    courseId: varchar("course_id", { length: 255 }).references(() => courses.id, { onDelete: "cascade" }).notNull(),
    status: enrollmentStatusEnum("status").default("ACTIVE").notNull(),
    billingEmail: varchar("billing_email", { length: 255 }),
    billingAddress: text("billing_address"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => ({
    unq: uniqueIndex("enrollment_user_id_course_id_key").on(t.userId, t.courseId),
}));

export const payments = pgTable("payment", {
    id: varchar("id", { length: 255 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    amount: doublePrecision("amount").notNull(),
    status: paymentStatusEnum("status").default("PENDING").notNull(),
    transactionId: varchar("transaction_id", { length: 255 }).unique(),
    userId: varchar("user_id", { length: 255 }).references(() => users.id, { onDelete: "cascade" }).notNull(),
    courseId: varchar("course_id", { length: 255 }).references(() => courses.id).notNull(),
    paymentType: varchar("payment_type", { length: 50 }).default("SELF"), // SELF or COMPANY
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const events = pgTable("event", {
    id: varchar("id", { length: 255 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    title: varchar("title", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    description: text("description"),
    location: varchar("location", { length: 255 }),
    capacity: integer("capacity").notNull(),
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date").notNull(),
    thumbnail: text("thumbnail"),
    thumbnailPublicId: varchar("thumbnail_public_id", { length: 255 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const bookings = pgTable("booking", {
    id: varchar("id", { length: 255 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: varchar("user_id", { length: 255 }).references(() => users.id, { onDelete: "cascade" }).notNull(),
    eventId: varchar("event_id", { length: 255 }).references(() => events.id, { onDelete: "cascade" }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const certificates = pgTable("certificate", {
    id: varchar("id", { length: 255 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: varchar("user_id", { length: 255 }).references(() => users.id, { onDelete: "cascade" }),
    recipientName: varchar("recipient_name", { length: 255 }),
    recipientEmail: varchar("recipient_email", { length: 255 }),
    courseId: varchar("course_id", { length: 255 }).references(() => courses.id, { onDelete: "cascade" }).notNull(),
    shortCode: varchar("short_code", { length: 20 }).unique().notNull(),
    pdfUrl: text("pdf_url").notNull(),
    verifyHash: varchar("verify_hash", { length: 255 }).unique().notNull(),
    issuedAt: timestamp("issued_at").defaultNow().notNull(),
});

export const leads = pgTable("lead", {
    id: varchar("id", { length: 255 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    phone: varchar("phone", { length: 50 }),
    subject: varchar("subject", { length: 255 }), // e.g. "Inquiry about Course X"
    message: text("message").notNull(),
    source: varchar("source", { length: 255 }), // e.g. "CONTACT_PAGE", "COURSE_DETAIL"
    status: varchar("status", { length: 50 }).default("NEW").notNull(), // NEW, CONTACTED, RESOLVED
    courseId: varchar("course_id", { length: 255 }).references(() => courses.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const testimonials = pgTable("testimonial", {
    id: varchar("id", { length: 255 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: varchar("user_id", { length: 255 }).references(() => users.id, { onDelete: "cascade" }).notNull(),
    content: text("content").notNull(),
    rating: integer("rating").default(5).notNull(),
    approved: boolean("approved").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const pageContent = pgTable("page_content", {
    id: varchar("id", { length: 255 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    key: varchar("key", { length: 255 }).unique().notNull(),
    value: text("value").notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const notifications = pgTable("notification", {
    id: varchar("id", { length: 255 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: varchar("user_id", { length: 255 }).references(() => users.id, { onDelete: "cascade" }).notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    message: text("message").notNull(),
    read: boolean("read").default(false).notNull(),
    type: notificationTypeEnum("type").default("INFO").notNull(),
    link: text("link"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const settings = pgTable("settings", {
    id: varchar("id", { length: 255 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    group: varchar("group", { length: 255 }).notNull(), // e.g., 'GENERAL', 'SECURITY'
    key: varchar("key", { length: 255 }).notNull().unique(),
    value: text("value").notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const galleries = pgTable("gallery", {
    id: varchar("id", { length: 255 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    images: json("images").default([]).notNull(), // Array of { url: string, publicId: string }
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const spaceInquiries = pgTable("space_inquiry", {
    id: varchar("id", { length: 255 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    phone: varchar("phone", { length: 255 }).notNull(),
    spaceName: varchar("space_name", { length: 255 }).notNull(),
    preferredDate: timestamp("preferred_date").notNull(),
    message: text("message"),
    status: varchar("status", { length: 50 }).default("PENDING").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const postCategories = pgTable("post_category", {
    id: varchar("id", { length: 255 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    name: varchar("name", { length: 255 }).notNull().unique(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    description: text("description"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const postTags = pgTable("post_tag", {
    id: varchar("id", { length: 255 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    name: varchar("name", { length: 255 }).notNull().unique(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const posts = pgTable("post", {
    id: varchar("id", { length: 255 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    title: varchar("title", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    content: text("content").notNull(),
    excerpt: text("excerpt"),
    thumbnail: text("thumbnail"),
    thumbnailPublicId: varchar("thumbnail_public_id", { length: 255 }),
    categoryId: varchar("category_id", { length: 255 }).references(() => postCategories.id, { onDelete: "set null" }),
    published: boolean("published").default(false).notNull(),
    authorId: varchar("author_id", { length: 255 }).references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const postTagJunction = pgTable("post_tag_junction", {
    postId: varchar("post_id", { length: 255 }).references(() => posts.id, { onDelete: "cascade" }).notNull(),
    tagId: varchar("tag_id", { length: 255 }).references(() => postTags.id, { onDelete: "cascade" }).notNull(),
}, (t) => ({
    pk: uniqueIndex("post_tag_junction_post_id_tag_id_key").on(t.postId, t.tagId),
}));

// Relations
export const userRelations = relations(users, ({ many }) => ({
    enrollments: many(enrollments),
    payments: many(payments),
    bookings: many(bookings),
    certificates: many(certificates),
    testimonials: many(testimonials),
    notifications: many(notifications),
}));

export const categoryRelations = relations(categories, ({ many }) => ({
    courses: many(courses),
}));

export const tagRelations = relations(tags, ({ many }) => ({
    courses: many(courseTags),
}));

export const courseRelations = relations(courses, ({ many, one }) => ({
    lessons: many(lessons),
    materials: many(materials),
    enrollments: many(enrollments),
    certificates: many(certificates),
    schedules: many(courseSchedules),
    courseTags: many(courseTags),
    category: one(categories, { fields: [courses.categoryId], references: [categories.id] }),
    certificationType: one(certificationTypes, { fields: [courses.certificationTypeId], references: [certificationTypes.id] }),
}));

export const courseTagRelations = relations(courseTags, ({ one }) => ({
    course: one(courses, { fields: [courseTags.courseId], references: [courses.id] }),
    tag: one(tags, { fields: [courseTags.tagId], references: [tags.id] }),
}));

export const enrollmentRelations = relations(enrollments, ({ one }) => ({
    user: one(users, { fields: [enrollments.userId], references: [users.id] }),
    course: one(courses, { fields: [enrollments.courseId], references: [courses.id] }),
}));

export const courseScheduleRelations = relations(courseSchedules, ({ one }) => ({
    course: one(courses, { fields: [courseSchedules.courseId], references: [courses.id] }),
}));

export const materialRelations = relations(materials, ({ one }) => ({
    course: one(courses, { fields: [materials.courseId], references: [courses.id] }),
}));

export const paymentRelations = relations(payments, ({ one }) => ({
    user: one(users, { fields: [payments.userId], references: [users.id] }),
    course: one(courses, { fields: [payments.courseId], references: [courses.id] }),
}));

export const leadRelations = relations(leads, ({ one }) => ({
    course: one(courses, { fields: [leads.courseId], references: [courses.id] }),
}));

export const certificateRelations = relations(certificates, ({ one }) => ({
    user: one(users, { fields: [certificates.userId], references: [users.id] }),
    course: one(courses, { fields: [certificates.courseId], references: [courses.id] }),
}));

export const testimonialRelations = relations(testimonials, ({ one }) => ({
    user: one(users, { fields: [testimonials.userId], references: [users.id] }),
}));

export const bookingRelations = relations(bookings, ({ one }) => ({
    user: one(users, { fields: [bookings.userId], references: [users.id] }),
    event: one(events, { fields: [bookings.eventId], references: [events.id] }),
}));

export const eventRelations = relations(events, ({ many }) => ({
    bookings: many(bookings),
}));

export const lessonRelations = relations(lessons, ({ one }) => ({
    course: one(courses, { fields: [lessons.courseId], references: [courses.id] }),
}));

export const notificationRelations = relations(notifications, ({ one }) => ({
    user: one(users, { fields: [notifications.userId], references: [users.id] }),
}));

export const postCategoryRelations = relations(postCategories, ({ many }) => ({
    posts: many(posts),
}));

export const postTagRelations = relations(postTags, ({ many }) => ({
    posts: many(postTagJunction),
}));

export const postRelations = relations(posts, ({ one, many }) => ({
    category: one(postCategories, { fields: [posts.categoryId], references: [postCategories.id] }),
    author: one(users, { fields: [posts.authorId], references: [users.id] }),
    postTags: many(postTagJunction),
}));

export const postTagJunctionRelations = relations(postTagJunction, ({ one }) => ({
    post: one(posts, { fields: [postTagJunction.postId], references: [posts.id] }),
    tag: one(postTags, { fields: [postTagJunction.tagId], references: [postTags.id] }),
}));

export const certificationTypeRelations = relations(certificationTypes, ({ many }) => ({
    courses: many(courses),
}));
