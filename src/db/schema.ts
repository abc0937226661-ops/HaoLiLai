import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// Users (Admin)
export const users = sqliteTable('users', {
  id: text('id').primaryKey(), // UUID
  username: text('username').notNull().unique(),
  password: text('password').notNull(), // Hashed (bcrypt)
  name: text('name'),
  role: text('role').notNull().default('admin'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

// Hero Slides (Carousel)
// Hero Slides (Carousel) - Enhanced
export const heroSlides = sqliteTable('hero_slides', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  subtitle: text('subtitle'),
  imageUrl: text('image_url').notNull(),

  // Custom Styling Fields (New)
  buttons: text('buttons').default('[]'),
  textAlign: text('text_align').default('left'),
  bgPosition: text('bg_position').default('center'),
  titleColor: text('title_color').default('#ffffff'),
  titleSize: text('title_size').default('text-5xl'),
  subtitleColor: text('subtitle_color').default('#e2e8f0'),
  imageOffsetX: integer('image_offset_x').default(0),
  imageOffsetY: integer('image_offset_y').default(0),
  imageScale: integer('image_scale').default(1),

  // Legacy/Default Fields
  color: text('color').default('from-amber-500'),
  link: text('link'),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  order: integer('order').default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

// Games (Grid)
export const games = sqliteTable('games', {
  id: text('id').primaryKey(), // Custom ID like 'slot-001'
  name: text('name').notNull(),
  category: text('category').notNull(), // 電子, 棋牌, 捕魚, etc.
  imageUrl: text('image_url').notNull(),
  isHot: integer('is_hot', { mode: 'boolean' }).default(false),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  order: integer('order').default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

// Announcements (News Ticker & List)
export const announcements = sqliteTable('announcements', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  content: text('content').notNull(), // HTML or Plain text
  type: text('type').notNull().default('system'), // system, activity, winner
  date: text('date').notNull(), // Display date string like "02/05"
  imageUrl: text('image_url'), // Optional image for news detail page
  link: text('link'), // Optional external link
  isImportant: integer('is_important', { mode: 'boolean' }).default(false),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

// Events (Permanent Info Section)
export const events = sqliteTable('events', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  imageUrl: text('image_url').notNull(),
  buttons: text('buttons').default('[]'),
  textAlign: text('text_align').default('left'),
  bgPosition: text('bg_position').default('center'),
  titleColor: text('title_color').default('#ffffff'),
  titleSize: text('title_size').default('text-5xl'),
  subtitleColor: text('subtitle_color').default('#e2e8f0'),
  imageOffsetX: integer('image_offset_x').default(0),
  imageOffsetY: integer('image_offset_y').default(0),
  imageScale: integer('image_scale').default(1),
  link: text('link'),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  order: integer('order').default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

// Site Configuration (Global Text)
export const siteConfig = sqliteTable('site_config', {
  key: text('key').primaryKey(), // e.g., 'footer_text', 'contact_line'
  value: text('value').notNull(),
  description: text('description'),
});

// Visit Logs (Analytics)
export const visitLogs = sqliteTable('visit_logs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  ip: text('ip'),
  path: text('path'), // Accessed path
  userAgent: text('user_agent'),
  country: text('country'),
  isEngaged: integer('is_engaged', { mode: 'boolean' }).default(true), // Only engaged users are tracked
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

// Navbar Items (CMS)
export const navbarItems = sqliteTable('navbar_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  type: text('type').notNull(), // 'link' | 'cta' | 'logo'
  text: text('text').notNull(),
  link: text('link'),
  icon: text('icon'),
  order: integer('order').default(0),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  style: text('style'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

// Footer Sections (CMS)
export const footerSections = sqliteTable('footer_sections', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  sectionTitle: text('section_title').notNull(),
  order: integer('order').default(0),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

// Footer Links (CMS)
export const footerLinks = sqliteTable('footer_links', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  sectionId: integer('section_id').notNull(),
  text: text('text').notNull(),
  link: text('link').notNull(),
  order: integer('order').default(0),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

// Footer Config (CMS)
export const footerConfig = sqliteTable('footer_config', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
  description: text('description'),
});

// YouTube Videos (Music Player)
export const youtubeVideos = sqliteTable('youtube_videos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  youtubeId: text('youtube_id').notNull(), // YouTube video ID
  order: integer('order').default(0),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

// Social Media Links (Floating Buttons)
export const socialLinks = sqliteTable('social_links', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  platform: text('platform').notNull(), // 'facebook', 'line', 'instagram', etc.
  url: text('url').notNull(),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  order: integer('order').default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});
