"use client";

import { ShippingFormInputs } from "@repo/types";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import type { StripeError } from "@stripe/stripe-js";
import { useState } from "react";

const CheckoutForm = ({
  shippingForm,
}: {
  shippingForm: ShippingFormInputs;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<StripeError | null>(null);

  const handleClick = async () => {
    setLoading(true);
    if (!stripe || !elements) {
      setError({ message: "Stripe has not loaded yet." } as StripeError);
      setLoading(false);
      return;
    }

    const res = await stripe.confirmPayment({
      elements,
      confirmParams: {
        payment_method_data: {
          billing_details: {
            email: shippingForm.email,
          },
        },
        shipping: {
          name: shippingForm.name,
          address: {
            line1: shippingForm.address,
            city: shippingForm.city,
            country: "US",
          },
          phone: shippingForm.phone,
        },
        return_url: `${window.location.origin}/return`,
      },
    });

    if (res.error) {
      setError(res.error);
    }
    setLoading(false);
  };

  return (
    <form>
      <PaymentElement options={{ layout: "accordion" }} />
      <button disabled={loading} onClick={handleClick}>
        {loading ? "Loading..." : "Pay"}
      </button>
      {error && <div className="">{error.message}</div>}
    </form>
  );
};

export default CheckoutForm;