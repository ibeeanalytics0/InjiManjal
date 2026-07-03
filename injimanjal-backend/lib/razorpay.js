const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * Verifies a Razorpay payment signature (HMAC-SHA256).
 * Frontend cannot fake this because it never has access to RAZORPAY_KEY_SECRET.
 */
function verifyPaymentSignature({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) {
  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  return expected === razorpay_signature;
}

module.exports = { razorpay, verifyPaymentSignature };
