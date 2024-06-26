<template>
  <LandingModal @close="$emit('close')">
    <div class="w-full max-w-2xl p-8 bg-slate-200 rounded-xl">
      <div
        v-if="success"
        class="flex flex-col items-center justify-center space-y-6"
      >
        <h2 class="text-xl font-bold">Thanks for buying the course!</h2>
        <button
          class="flex items-center justify-center w-full h-12 px-16 mt-4 text-black transition bg-blue-300 rounded text-md focus:outline-none focus:shadow-outline hover:bg-blue-200"
          @click="login"
        >
          Login with GitHub to access
        </button>
      </div>
      <form v-else @submit.prevent="handleSubmit">
        <h2 class="text-xl font-bold text-center">Buying {{ course.title }}</h2>
        <div class="px-8 py-6 mt-8 text-base bg-white rounded shadow-md width">
          <div class="flex items-center justify-between w-full mb-8">
            <label class="font-bold"> Email </label>
            <input
              v-model="email"
              class="w-full ml-6 text-left input focus:outline-none"
              type="email"
              autocomplete="email"
              placeholder="your@email.com"
              required
            />
          </div>

          <div id="card-element">
            <!-- Elements will create input elements here -->
          </div>
        </div>

        <button
          class="flex items-center justify-center w-full h-12 px-16 mt-4 font-sans text-lg font-bold text-black transition rounded focus:outline-none focus:shadow-outline"
          :class="
            processingPayment || email === ''
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-yellow-300 hover:bg-yellow-200 cursor-pointer'
          "
          :disabled="processingPayment || email === ''"
        >
          <LandingLoading v-if="processingPayment" class="w-5 h-5" />
          <div v-else>Pay $97</div>
        </button>
      </form>
    </div>
  </LandingModal>
</template>

<script setup>
defineEmits(['close']);

const course = await useCourse();
const config = useRuntimeConfig();
const stripe = ref(null);
const card = ref(null);
const email = ref('');
const processingPayment = ref(false);
const success = ref(false);
const paymentIntentId = ref(null);

const formStyle = {
  base: {
    fontSize: '16px',
    color: '#3d4852',
    '::placeholder': {
      color: '#8795a1',
    },
  },
};

const elements = computed(() => stripe.value.elements());

const setupStripe = () => {
  stripe.value = Stripe?.(config.public.stripeKey);

  if (!card.value && elements.value) {
    card.value = elements.value.create('card', {
      style: formStyle,
    });
    card.value.mount('#card-element');
  }
};

const handleSubmit = async () => {
  if (email.value === '') return;

  processingPayment.value = true;
  let secret;

  try {
    // create a PaymentIntent with the order amount and currency
    const response = await $fetch('/api/stripe/paymentIntent', {
      method: 'POST',
      body: {
        email: email.value,
      },
    });
    secret = response;
  } catch (error) {
    console.error(error);
  }

  try {
    const response = await stripe.value.confirmCardPayment(secret, {
      payment_method: {
        card: card.value,
      },
      receipt_email: email.value,
    });

    if (response.paymentIntent?.status === 'succeeded') {
      success.value = true;
      paymentIntentId.value = response.paymentIntent.id;
    }
  } catch (error) {
    console.error(error);
  } finally {
    processingPayment.value = false;
  }
};

const login = async () => {
  if (!paymentIntentId.value) return;

  const redirectTo = `/linkWithPurchase/${paymentIntentId.value}`;
  await navigateTo(`/login?redirectTo=${redirectTo}`);
};

useHead({
  script: [
    {
      src: 'https://js.stripe.com/v3',
      onload: setupStripe,
    },
  ],
});
</script>
