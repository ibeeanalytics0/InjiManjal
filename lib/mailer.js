const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.FROM_EMAIL || 'orders@injimanjal.com';

async function sendOrderConfirmationToCustomer(order, customerEmail, items) {
  const itemsHtml = items
    .map(i => `<tr><td>${i.product_name}</td><td>${i.quantity}</td><td>₹${i.unit_price}</td></tr>`)
    .join('');

  return resend.emails.send({
    from: FROM,
    to: customerEmail,
    subject: `Order Confirmed — #${order.id}`,
    html: `
      <h2>Thank you for your order!</h2>
      <p>Your order <strong>#${order.id}</strong> has been confirmed.</p>
      <table border="1" cellpadding="6" style="border-collapse:collapse">
        <tr><th>Item</th><th>Qty</th><th>Price</th></tr>
        ${itemsHtml}
      </table>
      <p><strong>Total: ₹${order.total}</strong></p>
      <p>We'll notify you once it ships.</p>
    `,
  });
}

async function sendNewOrderAlertToAdmin(order, customerEmail, items) {
  const itemsHtml = items
    .map(i => `<tr><td>${i.product_name}</td><td>${i.quantity}</td><td>₹${i.unit_price}</td></tr>`)
    .join('');

  return resend.emails.send({
    from: FROM,
    to: process.env.ADMIN_EMAIL,
    subject: `🛒 New Order #${order.id} — ₹${order.total}`,
    html: `
      <h2>New order received</h2>
      <p>Customer: ${customerEmail}</p>
      <table border="1" cellpadding="6" style="border-collapse:collapse">
        <tr><th>Item</th><th>Qty</th><th>Price</th></tr>
        ${itemsHtml}
      </table>
      <p><strong>Total: ₹${order.total}</strong></p>
    `,
  });
}

module.exports = { sendOrderConfirmationToCustomer, sendNewOrderAlertToAdmin };
