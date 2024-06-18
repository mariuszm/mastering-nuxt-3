import Stripe from './stripe';

export default defineEventHandler(async event => {
  const { email } = await readBody(event);

  // we only have one course for now, so we have the price hard-coded
  const paymentIntent = await Stripe.paymentIntents.create({
    amount: 97 * 100,
    currency: 'usd',
    metadata: { email },
  });

  // only return the secret
  return paymentIntent.client_secret;
});
