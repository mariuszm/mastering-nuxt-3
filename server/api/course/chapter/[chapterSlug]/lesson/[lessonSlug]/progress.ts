import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// endpoint that updates progress of the lesson
export default defineEventHandler(async event => {
  // only allow PUT/PATCH/POST requests
  assertMethod(event, ['PUT', 'PATCH', 'POST']);

  // throw a 401 if there's no user logged in
  protectRoute(event);

  // get the route params
  const { chapterSlug, lessonSlug } = event.context.params;

  // get the lesson from the DB
  const lesson = await prisma.lesson.findFirst({
    where: {
      slug: lessonSlug,
      Chapter: {
        slug: chapterSlug,
      },
    },
  });

  // if the lesson doesn't exist, throw a 404
  if (!lesson) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Lesson not found',
    });
  }

  // get the completed value from the request body and update progress in DB
  // select based on the chapter and lesson slugs
  const { completed } = await readBody(event);

  // get user email from the supabase user if there is one
  const { email: userEmail } = event.context.user;

  return prisma.lessonProgress.upsert({
    where: {
      // what record we're looking for.
      // This is auto generated by prisma (based off on that @@unique attribute)
      // If it's not provided, you cannot do an upsert because we cannot
      // find a specific record
      lessonId_userEmail: {
        lessonId: lesson.id,
        userEmail,
      },
    },
    update: {
      // what fields to update (if they already exist)
      completed,
    },
    create: {
      // if the record doesn't yet exist, we know what to do
      // in order to create it
      completed,
      userEmail,
      Lesson: {
        connect: {
          // connect it to an existing lesson
          // (because we have this relation in the schema)
          // so it makes sure that the connections between the two objects
          // will stay in sync correctly
          id: lesson.id,
        },
      },
    },
  });
});
