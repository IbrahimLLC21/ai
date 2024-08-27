export const dynamic = 'force-dynamic';

import * as paypal from '@paypal/checkout-server-sdk';

const environment = new paypal.core.SandboxEnvironment(
  process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
  process.env.PAYPAL_SECRET!
);
export const paypalClient = new paypal.core.PayPalHttpClient(environment);
