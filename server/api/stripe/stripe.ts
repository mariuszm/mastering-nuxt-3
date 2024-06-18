import stripe from 'stripe';

const config = useRuntimeConfig();
const Stripe = stripe(config.stripeSecret); // secret only accessible on the server

export default Stripe;
