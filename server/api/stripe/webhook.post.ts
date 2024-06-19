import { PrismaClient } from '@prisma/client';
import Stripe from './stripe';

type PaymentIntent = {
  id: string;
};

const prisma = new PrismaClient();
const STRIPE_WEBHOOK_SECRET = useRuntimeConfig().stripeWebhookSecret;

export default defineEventHandler(async event => {
  const signature = getHeader(event, 'stripe-signature');
  const body = await readRawBody(event);

  // verify the webhook signature
  let stripeEvent;
  try {
    stripeEvent = await Stripe.webhooks.constructEvent(
      body,
      signature,
      STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    console.error(error);
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid signature',
    });
  }

  if (stripeEvent.type === 'payment_intent.succeeded') {
    await handlePaymentIntentSucceeded(stripeEvent.data.object);
  }

  if (stripeEvent.type === 'payment_intent.payment_failed') {
    await handlePaymentIntentFailed(stripeEvent.data.object);
  }

  return 200;
});

async function handlePaymentIntentSucceeded(paymentIntent: PaymentIntent) {
  // verify the related course purchase
  try {
    await prisma.coursePurchase.update({
      where: {
        paymentId: paymentIntent.id,
      },
      data: {
        verified: true,
      },
    });
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error veryfing purchase',
    });
  }
}

async function handlePaymentIntentFailed(paymentIntent: PaymentIntent) {
  // clean up the course purchase
  try {
    await prisma.coursePurchase.delete({
      where: {
        paymentId: paymentIntent.id,
      },
    });
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error removing purchase',
    });
  }
}
