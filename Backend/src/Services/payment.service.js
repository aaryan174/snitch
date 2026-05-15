import Razorpay from "razorpay"

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_SECRET_KEY
})


export const createOrder = async ({ amount, currency = "INR" }) => {
    const options = {
        amount: Math.round(amount * 100), // Razorpay requires paise (integer)
        currency,
    };
    const order = await razorpay.orders.create(options);
    return order;
};