import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import pptxgen from "pptxgenjs";
import { Resvg } from "@resvg/resvg-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

const OUT_PATH = path.join(repoRoot, "Brainy_Project_Summary.pptx");

const COLORS = {
  bg: "0B1020",
  panel: "111A33",
  panel2: "0F1730",
  border: "243255",
  text: "FFFFFF",
  muted: "B8C3DA",
  accent: "1FE7C6",
  accent2: "1C9EA0",
  warm: "FFB86B",
};

function svgToDataUri(svgString, widthPx = 256) {
  const resvg = new Resvg(svgString, { fitTo: { mode: "width", value: widthPx } });
  const pngBuffer = resvg.render().asPng();
  return `data:image/png;base64,${pngBuffer.toString("base64")}`;
}

function addBg(slide) {
  slide.background = { color: COLORS.bg };
}

function addTopBar(slide, title) {
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 13.333,
    h: 0.55,
    fill: { color: COLORS.panel2 },
    line: { color: COLORS.border, width: 1 },
  });

  slide.addText(title, {
    x: 0.6,
    y: 0.14,
    w: 12.5,
    h: 0.3,
    fontFace: "Calibri",
    fontSize: 16,
    color: COLORS.text,
    bold: true,
  });

  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0.54,
    w: 13.333,
    h: 0.03,
    fill: { color: COLORS.accent },
    line: { color: COLORS.accent },
  });
}

function addCard(slide, x, y, w, h) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x,
    y,
    w,
    h,
    fill: { color: COLORS.panel },
    line: { color: COLORS.border, width: 1 },
    radius: 10,
  });
}

function addBullets(slide, items, x, y, w, h) {
  const textRuns = items.map((t) => ({
    text: t,
    options: { bullet: { indent: 18 }, hanging: 6 },
  }));

  slide.addText(textRuns, {
    x,
    y,
    w,
    h,
    fontFace: "Calibri",
    fontSize: 18,
    color: COLORS.muted,
    valign: "top",
    paraSpaceAfter: 10,
  });
}

function addSectionTitle(slide, text, x, y, w) {
  slide.addText(text, {
    x,
    y,
    w,
    h: 0.5,
    fontFace: "Calibri",
    fontSize: 28,
    color: COLORS.text,
    bold: true,
  });
  slide.addShape(pptx.ShapeType.rect, {
    x,
    y: y + 0.52,
    w: Math.min(w, 5.2),
    h: 0.06,
    fill: { color: COLORS.accent2 },
    line: { color: COLORS.accent2 },
  });
}

function addChip(slide, label, x, y, color = COLORS.accent) {
  const w = Math.max(1.4, label.length * 0.12 + 0.7);
  slide.addShape(pptx.ShapeType.roundRect, {
    x,
    y,
    w,
    h: 0.42,
    fill: { color: COLORS.panel2 },
    line: { color, width: 1 },
    radius: 14,
  });
  slide.addText(label, {
    x: x + 0.18,
    y: y + 0.08,
    w: w - 0.3,
    h: 0.3,
    fontFace: "Calibri",
    fontSize: 14,
    color: COLORS.text,
  });
  return w;
}

const pptx = new pptxgen();
pptx.layout = "LAYOUT_WIDE";

// Assets
const faviconSvg = fs.readFileSync(path.join(repoRoot, "public", "favicon.svg"), "utf8");
const brainLogo = svgToDataUri(faviconSvg, 256);
const profilePhotoPath = path.join(repoRoot, "public", "neelam-enosh.jpg");
const hasPhoto = fs.existsSync(profilePhotoPath);

// Slide 1: Title
{
  const slide = pptx.addSlide();
  addBg(slide);

  // Accent glow bars
  slide.addShape(pptx.ShapeType.roundRect, {
    x: -0.3,
    y: 6.6,
    w: 7.4,
    h: 1.2,
    fill: { color: COLORS.accent2, transparency: 70 },
    line: { color: COLORS.accent2, transparency: 100 },
    radius: 20,
  });
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 6.1,
    y: -0.2,
    w: 8.0,
    h: 1.2,
    fill: { color: COLORS.warm, transparency: 78 },
    line: { color: COLORS.warm, transparency: 100 },
    radius: 20,
  });

  slide.addImage({ data: brainLogo, x: 0.75, y: 0.9, w: 1.05, h: 1.05 });

  slide.addText("Brainy", {
    x: 1.95,
    y: 0.95,
    w: 8.0,
    h: 0.8,
    fontFace: "Calibri",
    fontSize: 52,
    bold: true,
    color: COLORS.text,
  });

  slide.addText("Quiz-Based Learning Platform (Statistics & Engineering)", {
    x: 0.75,
    y: 2.0,
    w: 9.6,
    h: 0.6,
    fontFace: "Calibri",
    fontSize: 22,
    color: COLORS.muted,
  });

  slide.addText("Project Summary • Jan 2026", {
    x: 0.75,
    y: 2.65,
    w: 8.0,
    h: 0.5,
    fontFace: "Calibri",
    fontSize: 16,
    color: COLORS.muted,
  });

  // Presenter card
  addCard(slide, 0.75, 5.35, 7.55, 1.65);
  slide.addText("Presented by", {
    x: 1.05,
    y: 5.55,
    w: 2.2,
    h: 0.3,
    fontFace: "Calibri",
    fontSize: 14,
    color: COLORS.muted,
  });
  slide.addText("Neelam Enosh", {
    x: 1.05,
    y: 5.85,
    w: 6.8,
    h: 0.5,
    fontFace: "Calibri",
    fontSize: 28,
    bold: true,
    color: COLORS.text,
  });
  slide.addText("Tech-focused learner • Developer • Music Tech", {
    x: 1.05,
    y: 6.30,
    w: 6.8,
    h: 0.4,
    fontFace: "Calibri",
    fontSize: 14,
    color: COLORS.muted,
  });

  // Photo frame
  addCard(slide, 9.0, 1.1, 3.75, 5.9);
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 9.25,
    y: 1.35,
    w: 3.25,
    h: 0.18,
    fill: { color: COLORS.accent },
    line: { color: COLORS.accent },
    radius: 10,
  });

  if (hasPhoto) {
    slide.addImage({ path: profilePhotoPath, x: 9.35, y: 1.65, w: 3.05, h: 3.05 });
  } else {
    slide.addText("(Add photo to public/neelam-enosh.jpg)", {
      x: 9.35,
      y: 2.7,
      w: 3.05,
      h: 0.8,
      fontFace: "Calibri",
      fontSize: 14,
      color: COLORS.muted,
      align: "center",
      valign: "mid",
    });
  }

  slide.addText("Links", {
    x: 9.35,
    y: 4.85,
    w: 3.05,
    h: 0.3,
    fontFace: "Calibri",
    fontSize: 14,
    color: COLORS.muted,
  });
  slide.addText("github.com/neelamenosh/Brainy\nbrainy-eta.vercel.app", {
    x: 9.35,
    y: 5.15,
    w: 3.05,
    h: 0.9,
    fontFace: "Calibri",
    fontSize: 14,
    color: COLORS.text,
  });
}

// Slide 2: Problem & Goal
{
  const slide = pptx.addSlide();
  addBg(slide);
  addTopBar(slide, "Overview");

  addSectionTitle(slide, "Problem & Goal", 0.75, 1.0, 12);
  addCard(slide, 0.75, 1.9, 11.85, 5.2);

  addBullets(
    slide,
    [
      "Students need fast, structured practice for engineering/statistics concepts.",
      "Goal: deliver quiz-based learning with clear scoring + repeat practice.",
      "Track progress over time and store results per category.",
      "Support role-based usage (Student + Faculty/Admin workflows).",
    ],
    1.15,
    2.25,
    11.0,
    4.5
  );

  addChip(slide, "React + Vite", 0.9, 6.45, COLORS.accent);
  addChip(slide, "Express API", 2.55, 6.45, COLORS.accent2);
  addChip(slide, "Prisma + Postgres", 4.35, 6.45, COLORS.warm);
}

// Slide 3: Key Features
{
  const slide = pptx.addSlide();
  addBg(slide);
  addTopBar(slide, "Product");

  addSectionTitle(slide, "Key Features", 0.75, 1.0, 12);

  addCard(slide, 0.75, 1.9, 6.0, 5.2);
  slide.addText("Learning", {
    x: 1.15,
    y: 2.15,
    w: 5.3,
    h: 0.4,
    fontFace: "Calibri",
    fontSize: 20,
    bold: true,
    color: COLORS.text,
  });
  addBullets(
    slide,
    [
      "Browse courses & quiz categories",
      "Attempt quizzes and get instant scoring",
      "View results history (by category, latest first)",
      "Clean UI with modern glass/gradient theme",
    ],
    1.15,
    2.65,
    5.35,
    4.2
  );

  addCard(slide, 7.0, 1.9, 5.6, 5.2);
  slide.addText("Accounts & Roles", {
    x: 7.4,
    y: 2.15,
    w: 5.0,
    h: 0.4,
    fontFace: "Calibri",
    fontSize: 20,
    bold: true,
    color: COLORS.text,
  });
  addBullets(
    slide,
    [
      "Register / Login with hashed passwords (bcrypt)",
      "JWT auth + refresh token flow",
      "Protected routes & role checks",
      "Faculty/Admin endpoints for student oversight",
    ],
    7.4,
    2.65,
    4.9,
    4.2
  );
}

// Slide 4: Tech Stack
{
  const slide = pptx.addSlide();
  addBg(slide);
  addTopBar(slide, "Technology");

  addSectionTitle(slide, "Tech Stack", 0.75, 1.0, 12);

  addCard(slide, 0.75, 1.9, 11.85, 5.2);

  slide.addText("Frontend", {
    x: 1.15,
    y: 2.2,
    w: 3.0,
    h: 0.4,
    fontFace: "Calibri",
    fontSize: 18,
    bold: true,
    color: COLORS.accent,
  });
  slide.addText("React • TypeScript • Vite • Tailwind • shadcn/ui", {
    x: 1.15,
    y: 2.6,
    w: 10.8,
    h: 0.35,
    fontFace: "Calibri",
    fontSize: 18,
    color: COLORS.text,
  });

  slide.addText("Backend", {
    x: 1.15,
    y: 3.25,
    w: 3.0,
    h: 0.4,
    fontFace: "Calibri",
    fontSize: 18,
    bold: true,
    color: COLORS.accent2,
  });
  slide.addText("Node.js • Express • CORS allowlist • cookie-parser", {
    x: 1.15,
    y: 3.65,
    w: 10.8,
    h: 0.35,
    fontFace: "Calibri",
    fontSize: 18,
    color: COLORS.text,
  });

  slide.addText("Database", {
    x: 1.15,
    y: 4.3,
    w: 3.0,
    h: 0.4,
    fontFace: "Calibri",
    fontSize: 18,
    bold: true,
    color: COLORS.warm,
  });
  slide.addText("PostgreSQL • Prisma ORM", {
    x: 1.15,
    y: 4.7,
    w: 10.8,
    h: 0.35,
    fontFace: "Calibri",
    fontSize: 18,
    color: COLORS.text,
  });

  slide.addText("Auth", {
    x: 1.15,
    y: 5.35,
    w: 3.0,
    h: 0.4,
    fontFace: "Calibri",
    fontSize: 18,
    bold: true,
    color: COLORS.accent,
  });
  slide.addText("JWT • bcrypt password hashing", {
    x: 1.15,
    y: 5.75,
    w: 10.8,
    h: 0.35,
    fontFace: "Calibri",
    fontSize: 18,
    color: COLORS.text,
  });
}

// Slide 5: Architecture
{
  const slide = pptx.addSlide();
  addBg(slide);
  addTopBar(slide, "Architecture");

  addSectionTitle(slide, "High-Level Architecture", 0.75, 1.0, 12);

  // Boxes
  const y = 2.3;
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.95,
    y,
    w: 3.6,
    h: 1.2,
    fill: { color: COLORS.panel },
    line: { color: COLORS.border, width: 1 },
    radius: 12,
  });
  slide.addText("Frontend\n(React + Vite)", {
    x: 0.95,
    y: y + 0.15,
    w: 3.6,
    h: 0.9,
    fontFace: "Calibri",
    fontSize: 18,
    color: COLORS.text,
    align: "center",
    valign: "mid",
  });

  slide.addShape(pptx.ShapeType.roundRect, {
    x: 4.95,
    y,
    w: 3.6,
    h: 1.2,
    fill: { color: COLORS.panel },
    line: { color: COLORS.border, width: 1 },
    radius: 12,
  });
  slide.addText("API Server\n(Express)", {
    x: 4.95,
    y: y + 0.15,
    w: 3.6,
    h: 0.9,
    fontFace: "Calibri",
    fontSize: 18,
    color: COLORS.text,
    align: "center",
    valign: "mid",
  });

  slide.addShape(pptx.ShapeType.roundRect, {
    x: 8.95,
    y,
    w: 3.6,
    h: 1.2,
    fill: { color: COLORS.panel },
    line: { color: COLORS.border, width: 1 },
    radius: 12,
  });
  slide.addText("Database\n(Postgres)", {
    x: 8.95,
    y: y + 0.15,
    w: 3.6,
    h: 0.9,
    fontFace: "Calibri",
    fontSize: 18,
    color: COLORS.text,
    align: "center",
    valign: "mid",
  });

  // Arrows
  slide.addShape(pptx.ShapeType.rightArrow, {
    x: 4.0,
    y: y + 0.35,
    w: 1.0,
    h: 0.5,
    fill: { color: COLORS.accent2 },
    line: { color: COLORS.accent2 },
  });
  slide.addShape(pptx.ShapeType.rightArrow, {
    x: 8.0,
    y: y + 0.35,
    w: 1.0,
    h: 0.5,
    fill: { color: COLORS.warm },
    line: { color: COLORS.warm },
  });

  // Notes
  addCard(slide, 0.75, 3.9, 11.85, 3.2);
  addBullets(
    slide,
    [
      "Frontend calls API via /api/* (dev proxy supported).",
      "Auth: JWT access token + refresh token; protected routes verify role.",
      "Results persisted with Prisma models: User, QuizCategory, QuizQuestion, QuizAttempt.",
      "CORS allowlist supports localhost + *.vercel.app deployments.",
    ],
    1.15,
    4.25,
    11.0,
    2.6
  );
}

// Slide 6: Data Model
{
  const slide = pptx.addSlide();
  addBg(slide);
  addTopBar(slide, "Database");

  addSectionTitle(slide, "Core Data Model", 0.75, 1.0, 12);

  addCard(slide, 0.75, 1.9, 11.85, 5.2);

  slide.addText("User", {
    x: 1.15,
    y: 2.2,
    w: 3.0,
    h: 0.3,
    fontFace: "Calibri",
    fontSize: 18,
    bold: true,
    color: COLORS.accent,
  });
  slide.addText("rollNumber, fullName, email, department, role", {
    x: 1.15,
    y: 2.5,
    w: 11.0,
    h: 0.3,
    fontFace: "Calibri",
    fontSize: 16,
    color: COLORS.muted,
  });

  slide.addText("QuizCategory", {
    x: 1.15,
    y: 3.05,
    w: 3.0,
    h: 0.3,
    fontFace: "Calibri",
    fontSize: 18,
    bold: true,
    color: COLORS.accent2,
  });
  slide.addText("name, description, courseName", {
    x: 1.15,
    y: 3.35,
    w: 11.0,
    h: 0.3,
    fontFace: "Calibri",
    fontSize: 16,
    color: COLORS.muted,
  });

  slide.addText("QuizQuestion", {
    x: 1.15,
    y: 3.9,
    w: 3.0,
    h: 0.3,
    fontFace: "Calibri",
    fontSize: 18,
    bold: true,
    color: COLORS.warm,
  });
  slide.addText("questionText, options(JSON), correctIndex, order", {
    x: 1.15,
    y: 4.2,
    w: 11.0,
    h: 0.3,
    fontFace: "Calibri",
    fontSize: 16,
    color: COLORS.muted,
  });

  slide.addText("QuizAttempt", {
    x: 1.15,
    y: 4.75,
    w: 3.0,
    h: 0.3,
    fontFace: "Calibri",
    fontSize: 18,
    bold: true,
    color: COLORS.accent,
  });
  slide.addText("userId, categoryId, score, total, percentage, createdAt", {
    x: 1.15,
    y: 5.05,
    w: 11.0,
    h: 0.3,
    fontFace: "Calibri",
    fontSize: 16,
    color: COLORS.muted,
  });

  slide.addText("Relationship: User → QuizAttempt → QuizCategory", {
    x: 1.15,
    y: 5.8,
    w: 11.0,
    h: 0.35,
    fontFace: "Calibri",
    fontSize: 18,
    color: COLORS.text,
  });
}

// Slide 7: API Summary
{
  const slide = pptx.addSlide();
  addBg(slide);
  addTopBar(slide, "Backend API");

  addSectionTitle(slide, "Core API Endpoints", 0.75, 1.0, 12);

  addCard(slide, 0.75, 1.9, 11.85, 5.2);

  slide.addText("Auth", {
    x: 1.15,
    y: 2.15,
    w: 3.0,
    h: 0.3,
    fontFace: "Calibri",
    fontSize: 18,
    bold: true,
    color: COLORS.accent,
  });
  slide.addText("/api/auth/register, /login, /refresh-token, /logout, /verify, /me", {
    x: 1.15,
    y: 2.45,
    w: 11.0,
    h: 0.4,
    fontFace: "Calibri",
    fontSize: 16,
    color: COLORS.muted,
  });

  slide.addText("Quiz", {
    x: 1.15,
    y: 3.15,
    w: 3.0,
    h: 0.3,
    fontFace: "Calibri",
    fontSize: 18,
    bold: true,
    color: COLORS.accent2,
  });
  slide.addText("/api/quiz/categories, /results (POST save), /results (GET list)", {
    x: 1.15,
    y: 3.45,
    w: 11.0,
    h: 0.4,
    fontFace: "Calibri",
    fontSize: 16,
    color: COLORS.muted,
  });

  slide.addText("Student Results", {
    x: 1.15,
    y: 4.15,
    w: 3.5,
    h: 0.3,
    fontFace: "Calibri",
    fontSize: 18,
    bold: true,
    color: COLORS.warm,
  });
  slide.addText("/api/student/results (Student role only)", {
    x: 1.15,
    y: 4.45,
    w: 11.0,
    h: 0.4,
    fontFace: "Calibri",
    fontSize: 16,
    color: COLORS.muted,
  });

  slide.addText("Faculty/Admin", {
    x: 1.15,
    y: 5.15,
    w: 3.5,
    h: 0.3,
    fontFace: "Calibri",
    fontSize: 18,
    bold: true,
    color: COLORS.text,
  });
  slide.addText("/api/faculty/* and /api/admin/* routes for reporting + oversight", {
    x: 1.15,
    y: 5.45,
    w: 11.0,
    h: 0.4,
    fontFace: "Calibri",
    fontSize: 16,
    color: COLORS.muted,
  });
}

// Slide 8: UI & Pages
{
  const slide = pptx.addSlide();
  addBg(slide);
  addTopBar(slide, "Frontend");

  addSectionTitle(slide, "User Experience", 0.75, 1.0, 12);

  addCard(slide, 0.75, 1.9, 11.85, 5.2);
  addBullets(
    slide,
    [
      "Landing page: course overview, testimonials, call-to-action",
      "Auth pages: Register + Login with role handling",
      "Quiz flow: category → questions → score → save results",
      "Results page: view attempt history (percentage + category)",
      "Personal About page: profile, skills, links, photo",
    ],
    1.15,
    2.25,
    11.0,
    4.8
  );
}

// Slide 9: Security & Quality
{
  const slide = pptx.addSlide();
  addBg(slide);
  addTopBar(slide, "Quality");

  addSectionTitle(slide, "Security & Reliability", 0.75, 1.0, 12);

  addCard(slide, 0.75, 1.9, 11.85, 5.2);
  addBullets(
    slide,
    [
      "Passwords stored as bcrypt hashes (never plaintext).",
      "JWT-based auth with protected endpoints and role checks.",
      "CORS allowlist + *.vercel.app support for safe deployments.",
      "Prisma schema enforces relationships + unique constraints.",
      "Build pipeline: Vite production build verifies compile health.",
    ],
    1.15,
    2.25,
    11.0,
    4.8
  );
}

// Slide 10: Next Steps
{
  const slide = pptx.addSlide();
  addBg(slide);
  addTopBar(slide, "Roadmap");

  addSectionTitle(slide, "Next Improvements", 0.75, 1.0, 12);

  addCard(slide, 0.75, 1.9, 11.85, 5.2);
  addBullets(
    slide,
    [
      "Add question management (admin UI) + bulk imports.",
      "Improve analytics dashboards (faculty/admin + student trends).",
      "Add testing (API + UI) and CI checks.",
      "Refresh-token rotation + rate limiting for auth endpoints.",
      "More courses/subjects, search, filters, and pagination.",
    ],
    1.15,
    2.25,
    11.0,
    4.8
  );

  slide.addText("Thank you", {
    x: 0.75,
    y: 6.95,
    w: 12.0,
    h: 0.4,
    fontFace: "Calibri",
    fontSize: 18,
    color: COLORS.muted,
  });
}

await pptx.writeFile({ fileName: OUT_PATH });
console.log(`✅ Wrote ${path.relative(repoRoot, OUT_PATH)}`);
