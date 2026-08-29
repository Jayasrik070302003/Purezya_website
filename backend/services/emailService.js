/**
 * Brevo (formerly Sendinblue) Transactional Email Service
 * Handles transactional order confirmation & welcome emails.
 */

exports.sendOrderConfirmationEmail = async ({ orderId, items, totalAmount, shippingDetails, userEmail }) => {
    const apiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.SENDER_EMAIL || 'support@Purazya.com';
    const senderName = process.env.SENDER_NAME || 'Purazya Organic Foods';

    let recipientEmail = userEmail;
    let recipientName = 'Valued Customer';

    if (shippingDetails) {
        if (typeof shippingDetails === 'object') {
            if (shippingDetails.email) recipientEmail = shippingDetails.email;
            const name = `${shippingDetails.firstName || ''} ${shippingDetails.lastName || ''}`.trim();
            if (name) recipientName = name;
        } else if (typeof shippingDetails === 'string') {
            try {
                if (shippingDetails.startsWith('{')) {
                    const parsed = JSON.parse(shippingDetails);
                    if (parsed.email) recipientEmail = parsed.email;
                    const name = `${parsed.firstName || ''} ${parsed.lastName || ''}`.trim();
                    if (name) recipientName = name;
                }
            } catch (e) { }
        }
    }

    if (!recipientEmail) {
        console.log(`[Email Service] No recipient email found for Order #${orderId}`);
        return false;
    }

    if (!apiKey) {
        console.log(`[Email Service] BREVO_API_KEY not set in environment. Order #${orderId} confirmation simulated for ${recipientEmail}.`);
        return true;
    }

    const itemsHtml = (items || []).map(item => `
        <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #111827; font-weight: 600;">${item.name || item.product_name}</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; text-align: center; color: #4b5563;">${item.quantity}</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; text-align: right; color: #166534; font-weight: 700;">₹${(item.quantity * item.price).toFixed(2)}</td>
        </tr>
    `).join('');

    const emailPayload = {
        sender: { name: senderName, email: senderEmail },
        to: [{ email: recipientEmail, name: recipientName }],
        subject: `Order #${orderId} Confirmed - Purazya Organic Foods`,
        htmlContent: `
            <!DOCTYPE html>
            <html>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f9fafb; margin: 0; padding: 24px;">
                <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e5e7eb; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
                    <div style="background: #14532d; padding: 24px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px;">Purazya LIFE</h1>
                        <p style="color: #86efac; margin: 4px 0 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Where Purity Becomes A Habit</p>
                    </div>
                    <div style="padding: 32px 24px;">
                        <h2 style="color: #111827; margin: 0 0 12px 0; font-size: 20px;">Thank you for your order, ${recipientName}!</h2>
                        <p style="color: #4b5563; line-height: 1.5; margin: 0 0 24px 0; font-size: 14px;">Your order <strong>#${orderId}</strong> has been received and is being prepared with our freshest organic ingredients.</p>
                        
                        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
                            <h3 style="color: #166534; margin: 0 0 12px 0; font-size: 15px; font-weight: 700;">Order Summary</h3>
                            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                                <thead>
                                    <tr style="color: #6b7280; text-transform: uppercase; font-size: 11px; border-bottom: 2px solid #bbf7d0;">
                                        <th style="text-align: left; padding-bottom: 8px;">Item</th>
                                        <th style="text-align: center; padding-bottom: 8px;">Qty</th>
                                        <th style="text-align: right; padding-bottom: 8px;">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${itemsHtml}
                                </tbody>
                            </table>
                            <div style="border-top: 2px solid #86efac; margin-top: 16px; padding-top: 12px; display: flex; justify-content: space-between; font-size: 16px; font-weight: 800; color: #14532d;">
                                <span>Total Paid:</span>
                                <span>₹${parseFloat(totalAmount).toFixed(2)}</span>
                            </div>
                        </div>

                        <p style="color: #6b7280; font-size: 12px; line-height: 1.5; margin: 0; text-align: center;">
                            If you have questions about your delivery, reply directly to this email or reach us at <a href="mailto:${senderEmail}" style="color: #15803d; text-decoration: none; font-weight: 600;">${senderEmail}</a>.
                        </p>
                    </div>
                </div>
            </body>
            </html>
        `
    };

    try {
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': apiKey,
                'content-type': 'application/json'
            },
            body: JSON.stringify(emailPayload)
        });

        if (response.ok) {
            console.log(`[Email Service] Brevo confirmation sent for Order #${orderId} to ${recipientEmail}`);
            return true;
        } else {
            const errData = await response.text();
            console.warn(`[Email Service] Brevo send notice (${response.status}):`, errData);
            return false;
        }
    } catch (err) {
        console.error('[Email Service] Error sending Brevo email:', err.message);
        return false;
    }
};
