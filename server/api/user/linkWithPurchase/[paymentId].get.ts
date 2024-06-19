import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async event => {
  // get PaymentIntent ID from route
  const { paymentId } = event.context.params;
  const user = event.context.user;

  // update CoursePurchase record
  try {
    await prisma.coursePurchase.update({
      where: {
        paymentId,
      },
      data: {
        userEmail: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Error linking course purchase',
    });
  }

  return 200;
});
