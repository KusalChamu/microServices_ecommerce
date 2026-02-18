"use client";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { CartItemsType, ShippingFormInputs } from "@repo/types";
import CheckoutForm from "./CheckoutForm";
import useCartStore from "@/stores/cartStore";

const stripe = loadStripe(
  "pk_test_51MdCLkDhkeDdZct5FkM9qMlMvAzsJpObS6eUy44jYLuVMhUFjYjzr4VLodA0GiUj0WBaOSzm38QJ8ju3SAYhdNkF00myyAyh6M"
);

const fetchClientSecret = async (cart: CartItemsType, token: string) => {
  return fetch(
    `${process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL}/sessions/create-checkout-session`,
    {
      method: "POST",
      body: JSON.stringify({
        cart,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  )
    .then((response) => response.json())
    .then((json) => json.checkoutSessionClientSecret);
};

const StripePaymentForm = ({
  shippingForm,
}: {
  shippingForm: ShippingFormInputs;
}) => {
  const { cart } = useCartStore();
  const [token, setToken] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const { getToken } = useAuth();

  useEffect(() => {
    getToken().then((token) => setToken(token));
  }, []);

  useEffect(() => {
    if (!token) return;
    fetchClientSecret(cart, token).then((cs) => setClientSecret(cs));
  }, [cart, token]);

  if (!token || !clientSecret) {
    return <div className="">Loading...</div>;
  }

  return (
    <Elements stripe={stripe} options={{ clientSecret }}>
      <CheckoutForm shippingForm={shippingForm} />
    </Elements>
  );
};

export default StripePaymentForm;