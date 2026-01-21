import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { PrismaClient } from '@prisma/client';
import { courses } from '../src/data/quizData';

const prisma = new PrismaClient();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function readJsonFile<T>(filePath: string, fallback: T): T {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    const raw = fs.readFileSync(filePath, 'utf8');
    if (!raw.trim()) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function toDateOrNull(value: unknown): Date | null {
  if (!value) return null;
  const d = new Date(String(value));
  return Number.isNaN(d.getTime()) ? null : d;
}

async function seedQuizContent() {
  const categories = courses.flatMap((course) =>
    course.subjects.map((subject) => ({
      id: subject.id,
      name: subject.name,
      description: subject.description,
      courseId: course.id,
      courseName: course.name,
      questions: subject.questions,
    }))
  );

  let categoriesUpserted = 0;
  let questionsInserted = 0;

  for (const category of categories) {
    await prisma.quizCategory.upsert({
      where: { id: category.id },
      update: {
        name: category.name,
        description: category.description ?? null,
        courseId: category.courseId ?? null,
        courseName: category.courseName ?? null,
      },
      create: {
        id: category.id,
        name: category.name,
        description: category.description ?? null,
        courseId: category.courseId ?? null,
        courseName: category.courseName ?? null,
      },
      select: { id: true },
    });
    categoriesUpserted++;

    await prisma.quizQuestion.deleteMany({ where: { categoryId: category.id } });

    const questionRows = category.questions.map((q, idx) => ({
      categoryId: category.id,
      questionText: q.question,
      options: q.options,
      correctIndex: q.correct,
      order: idx,
    }));

    if (questionRows.length > 0) {
      const created = await prisma.quizQuestion.createMany({ data: questionRows });
      questionsInserted += created.count;
    }
  }

  return { categoriesUpserted, questionsInserted };
}

type LegacyUser = {
  id?: string;
  rollNumber?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  password?: string;
  passwordHash?: string;
  department?: string;
  course?: string;
  semester?: number;
  role?: string;
  createdAt?: string;
  lastLogin?: string;
};

type LegacyProgress = Record<
  string,
  Record<
    string,
    {
      completed?: boolean;
      score?: number;
      totalQuestions?: number;
      completedAt?: string;
    }
  >
>;

async function importLegacyUsersAndProgress() {
  const projectRoot = path.resolve(__dirname, '..');
  const backendDataDir = path.join(projectRoot, 'backend', 'data');

  const usersFile = path.join(backendDataDir, 'users.json');
  const progressFile = path.join(backendDataDir, 'progress.json');

  const legacyUsers = readJsonFile<LegacyUser[]>(usersFile, []);
  const legacyProgress = readJsonFile<LegacyProgress>(progressFile, {});

  let usersUpserted = 0;
  let quizAttemptsImported = 0;

  for (const u of legacyUsers) {
    const email = u.email ? String(u.email).toLowerCase() : '';
    const rollNumber = u.rollNumber ? String(u.rollNumber).trim() : '';

    if (!email || !rollNumber) continue;

    const passwordHash = u.passwordHash || u.password;
    if (!passwordHash) continue;

    const legacyId = u.id ? String(u.id) : null;

    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { rollNumber }] },
      select: { id: true },
    });

    if (existing) {
      await prisma.user.update({
        where: { id: existing.id },
        data: {
          rollNumber,
          fullName: String(u.fullName || '').trim() || rollNumber,
          email,
          phone: String(u.phone || ''),
          passwordHash: String(passwordHash),
          department: String(u.department || ''),
          course: u.course ? String(u.course) : null,
          semester: typeof u.semester === 'number' ? u.semester : null,
          role: u.role ? String(u.role) : 'Student',
          createdAt: toDateOrNull(u.createdAt) ?? undefined,
          lastLogin: toDateOrNull(u.lastLogin) ?? undefined,
        },
        select: { id: true },
      });
      usersUpserted++;
      continue;
    }

    await prisma.user.create({
      data: {
        ...(legacyId ? { id: legacyId } : {}),
        rollNumber,
        fullName: String(u.fullName || '').trim() || rollNumber,
        email,
        phone: String(u.phone || ''),
        passwordHash: String(passwordHash),
        department: String(u.department || ''),
        course: u.course ? String(u.course) : null,
        semester: typeof u.semester === 'number' ? u.semester : null,
        role: u.role ? String(u.role) : 'Student',
        createdAt: toDateOrNull(u.createdAt) ?? undefined,
        lastLogin: toDateOrNull(u.lastLogin) ?? undefined,
      },
      select: { id: true },
    });
    usersUpserted++;
  }

  // Import progress.json into QuizAttempt rows (one per completed subject)
  for (const [legacyUserId, subjects] of Object.entries(legacyProgress)) {
    const user = await prisma.user.findUnique({
      where: { id: String(legacyUserId) },
      select: { id: true },
    });

    if (!user) continue;

    for (const [subjectId, data] of Object.entries(subjects || {})) {
      if (!data?.completed) continue;

      const total = Number(data.totalQuestions ?? 0);
      const score = Number(data.score ?? 0);
      if (!Number.isFinite(total) || total <= 0) continue;
      if (!Number.isFinite(score) || score < 0) continue;

      // Ensure category exists (seedQuizContent already does this)
      const category = await prisma.quizCategory.findUnique({
        where: { id: String(subjectId) },
        select: { id: true },
      });
      if (!category) continue;

      const createdAt = toDateOrNull(data.completedAt) ?? new Date();
      const percentage = Math.round((score / total) * 100);

      const existingAttempt = await prisma.quizAttempt.findFirst({
        where: {
          userId: user.id,
          categoryId: category.id,
          createdAt,
        },
        select: { id: true },
      });

      if (existingAttempt) continue;

      await prisma.quizAttempt.create({
        data: {
          userId: user.id,
          categoryId: category.id,
          score,
          total,
          percentage,
          createdAt,
        },
        select: { id: true },
      });

      quizAttemptsImported++;
    }
  }

  return { usersUpserted, quizAttemptsImported };
}

async function main() {
  const quiz = await seedQuizContent();
  const legacy = await importLegacyUsersAndProgress();

  console.log('Seed complete');
  console.log({ quiz, legacy });
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
