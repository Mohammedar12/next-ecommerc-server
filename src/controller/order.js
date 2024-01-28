require("dotenv").config();

const Stripe = require("stripe");
const { tryCatch } = require("../utils/tryCatch");
const Orders = require("../models/order");
const getRawBody = require("raw-body");
const stripe = new Stripe(process.env.PAYMENT_API_SECRET_KEY);

module.exports = {
  getOrders: tryCatch(async (req, res) => {
    const orders = await Orders.find({ user: req.user._id });
    if (!orders) {
      return res.status(404).json({ message: "Address not found" });
    }
    res.json(orders);
  }),
  checkoutSession: async (req, res) => {
    const body = req.body;

    const shippingInfo = body?.shippingInfo;
    const line_items = body?.items?.map((item) => {
      return {
        price_data: {
          currency: "sar",
          unit_amount: item.price * 100,
          product_data: {
            name: item.name,
            images: [item.image],
            metadata: { productId: item.id },
          },
        },
        quantity: item.quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: line_items, // Make sure line_items is correctly defined
      success_url: "http://localhost:3000/payment?status=success", // Update with your actual success URL
      cancel_url: "http://localhost:3000/payment?status=failed", // Update with your actual cancel URL
      customer_email: req?.user?.email,
      client_reference_id: req?.user?._id,
      mode: "payment",
      metadata: { shippingInfo }, // Ensure shippingInfo is structured properly
      shipping_options: [
        {
          shipping_rate: "shr_1OCGxbA3cYikhtyYfZEjmENs", // Ensure the shipping_rate is valid
        },
      ],
    });

    res.json({
      url: session.url,
    });

    //   const customer = await stripe.customers.create({
    //     email: body.email,
    //   });
  },
  webhook: async (req, res) => {
    const rawBody = req.body;

    const getCartItems = async (lineItems) => {
      return new Promise((resolve, reject) => {
        let cartItems = [];
        console.log("Promise");
        lineItems?.data?.forEach(async (item) => {
          const product = await stripe.products.retrieve(item.price.product);
          const productId = product.metadata.productId;

          cartItems.push({
            product: productId,
            name: product.name,
            price: item.price.unit_amount_decimal / 100,
            quantity: item.quantity,
            image: product.images[0],
          });

          if (cartItems.length === lineItems?.data.length) {
            resolve(cartItems);
          }
        });
      });
    };

    const signature = req.headers["stripe-signature"];
    if (!rawBody || !signature) {
      return res
        .status(400)
        .send("Bad Request: Missing request payload or signature");
    }
    // console.log("Request Headers:", req.headers, signature);
    try {
      const event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        process.env.STIPRE_WEBHOOK
        // "whsec_5c98b2e5fa1942762127f2972cdsa4aad988ab16a0803f6483906a5e7d4836c7e40"
      );
      if (event.type === "checkout.session.completed") {
        // console.log("Checkout session completed event received.");
        console.log("checkout.session.completed");
        const session = event.data.object;

        const lineItems = await stripe.checkout.sessions.listLineItems(
          session.id
        );
        const orderItems = await getCartItems(lineItems);
        const userId = session.client_reference_id;
        const amountPaid = session.amount_total / 100;

        const paymentInfo = {
          id: session.payment_intent,
          status: session.payment_status,
          amountPaid,
          taxPaid: session.total_details.amount_tax / 100,
        };

        const orderData = {
          user: userId,
          shippingInfo: session.metadata.shippingInfo,
          paymentInfo,
          orderItems,
        };
        const order = await Orders.create(orderData);
        res.status(201).json({ success: true });
      } else {
        // Handle other webhook events if needed
        // console.log("Unhandled webhook event type:", event.type);
        res.status(200).end();
      }
    } catch (error) {
      console.log(error);
    }
  },
};
