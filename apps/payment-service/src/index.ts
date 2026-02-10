import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { clerkMiddleware, getAuth } from '@hono/clerk-auth'
import { shouldBeUSer } from './middleware/authMiddleware'
import stripe from "./utils/stripe"

const app = new Hono()
app.use('*', clerkMiddleware())

app.get('/health', (c) => {
  return c.json({
    status:"ok",
    uptime:process.uptime(),
    timestamp:Date.now(),
  })
})

app.get('/test',shouldBeUSer, (c) => {
  return c.json({
    message:"Payment service authenticated!",userId:c.get("userId")
  })
})

/*
app.post("/create-stripe-product", async (c) => {
  try {
    const res = await stripe.products.create({
      id:"123",
      name: "Test Product",
      default_price_data: {
        currency: "usd",
        unit_amount: 10 * 100,
      },
    })

    return c.json(res);
  } catch (error: any) {
    console.log("Stripe Error:", error.message)
    return c.json({ error: error.message }, 400)
  }
})

app.get("/stripe-product-price", async (c) => {
  try {
    const res = await stripe.prices.list({
      product:"123",
    })

    return c.json(res);
  } catch (error: any) {
    console.log("Stripe Error:", error.message)
    return c.json({ error: error.message }, 400)
  }
})
  */

const start = async ()=>{
  try{
    serve({
      fetch:app.fetch,
      port:8002,
    },
    (info) =>{
      console.log("payment service is running on port 8002");
    }
  );
  }catch(error){
    console.log(error);
    process.exit(1);
}
};
start();
