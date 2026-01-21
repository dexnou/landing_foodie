interface ConfirmationEmailProps {
    to: string;
    name: string;
    orderId: string;
    ticketType: string;
    quantity: number;
    unitPrice: string;
    totalPrice: string;
}

const notifyDiscord = async (title: string, fields: any[], webhookUrl?: string) => {
    const url = webhookUrl || process.env.DISCORD_WEBHOOK_URL;
    if (!url) {
        console.warn("⚠️ No Discord Webhook configured for notification skipping.");
        return;
    }

    const body = JSON.stringify({
        content: "⚠️ **Fallo en envío de Email - Fallback activado**",
        embeds: [{
            title,
            color: 15158332, // Rojo
            fields: fields.slice(0, 25)
        }]
    });

    try {
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body
        });
        console.log("✅ Notificación de fallo enviada a Discord.");
    } catch (error) {
        console.error("❌ Error enviando a Discord:", error);
    }
};

export const sendOrderConfirmationEmail = async ({
    to,
    name,
    orderId,
    ticketType,
    quantity,
    unitPrice,
    totalPrice,
}: ConfirmationEmailProps) => {
    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    const SENDER_EMAIL = process.env.SENDER_EMAIL;
    const SENDER_NAME = process.env.SENDER_NAME;

    if (!BREVO_API_KEY) {
        console.error('Falta la variable de entorno BREVO_API_KEY');
        return false;
    }

    const htmlContent = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>¡Pago Confirmado! - Food Delivery Day</title>
    <style type="text/css">
        body { margin: 0; padding: 0; background-color: #1a1a1a; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
        table { border-collapse: collapse; }
        .wrapper { width: 100%; background-color: #1a1a1a; padding: 40px 0; }
        .container { max-width: 600px; margin: 0 auto; background-color: #111111; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        
        /* COLORES DE MARCA */
        .bg-pink { background-color: #ff0054; }
        .text-pink { color: #ff0054; }
        .bg-dark { background-color: #111111; }
        .bg-footer { background-color: #0a0a0a; }
        
        /* ESTILOS TEXTO */
        h1 { color: #ffffff; font-size: 28px; font-weight: 800; margin: 0; line-height: 1.2; }
        p { color: #cccccc; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0; }
        .strong { color: #ffffff; font-weight: bold; }
        
        /* BOTÓN */
        .btn { display: inline-block; padding: 16px 32px; background-color: #ff0054; color: #ffffff !important; text-decoration: none; font-weight: bold; border-radius: 50px; text-transform: uppercase; letter-spacing: 1px; font-size: 14px; transition: background-color 0.3s; }
        .btn:hover { background-color: #d60046; }

        /* TABLA DE RECIBO */
        .receipt { width: 100%; background-color: #1a1a1a; border-radius: 8px; padding: 20px; margin: 20px 0; border: 1px solid #333; }
        .receipt td { padding: 12px 15px; color: #cccccc; border-bottom: 1px solid #333; font-size: 14px; }
        .receipt tr:last-child td { border-bottom: none; }
        .total-row td { color: #ff0054; font-size: 20px; font-weight: 800; padding-top: 20px; }
    </style>
</head>
<body>
    <table class="wrapper" width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td align="center">
                <table class="container" width="600" cellpadding="0" cellspacing="0">
                    
                    <tr>
                        <td class="bg-pink" align="center" style="padding: 40px 30px;">
                            <img src="https://www.fooddeliveryday.com.ar/logo-foodie.png" alt="Food Delivery Day" width="160" style="display: block; margin-bottom: 20px;">
                            <h1 style="text-transform: uppercase;">¡Todo listo!</h1>
                            <p style="color: #ffffff; opacity: 0.9; margin: 10px 0 0 0; font-size: 18px;">Tu lugar está asegurado.</p>
                        </td>
                    </tr>

                    <tr>
                        <td class="bg-dark" style="padding: 40px 30px;">
                            <p>Hola <span class="strong">${name}</span>,</p>
                            <p>Confirmamos la recepción de tu pago. Ya sos parte del evento que va a revolucionar el delivery en Argentina.</p>
                            
                            <table class="receipt" width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td colspan="2" style="text-transform: uppercase; font-size: 12px; color: #666; letter-spacing: 1px; padding-bottom: 10px;">
                                        Orden #${orderId}
                                    </td>
                                </tr>
                                <tr>
                                    <td width="70%">${ticketType} <span style="font-size:12px; color:#666;">(x${quantity})</span></td>
                                    <td width="30%" align="right">${unitPrice}</td>
                                </tr>
                                <tr class="total-row">
                                    <td width="70%" style="border-bottom: none;">TOTAL PAGADO</td>
                                    <td width="30%" align="right" style="border-bottom: none;">${totalPrice}</td>
                                </tr>
                            </table>

                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" style="padding-top: 20px;">
                                        <a href="https://www.fooddeliveryday.com.ar" class="btn">Ver Info del Evento</a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td class="bg-footer" style="padding: 30px; text-align: center; border-top: 1px solid #333;">
                            <p style="font-size: 12px; color: #666; margin-bottom: 10px;"></p>                            
                            <p style="font-size: 11px; color: #444; margin-top: 20px;">
                                © 2026 Food Delivery Day. Todos los derechos reservados.<br>
                                Av. Rafael Obligado 6340, CABA, Argentina.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
  `;

    try {
        const res = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': BREVO_API_KEY,
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                sender: {
                    name: SENDER_NAME,
                    email: SENDER_EMAIL
                },
                to: [
                    {
                        email: to,
                        name: name
                    }
                ],
                subject: `¡Pago Confirmado! - Orden #${orderId}`,
                htmlContent: htmlContent
            })
        });

        if (!res.ok) {
            const errorData = await res.json();
            console.error('Error enviando email con Brevo:', errorData);
            return false;
        }

        console.log(`Email de confirmación enviado a ${to} vía Brevo`);
        return true;
    } catch (error) {
        console.error('Error de red al enviar email con Brevo:', error);
        return false;
    }
};

interface SponsorLeadProps {
    nombre: string;
    puesto: string;
    empresa: string;
    telefono: string;
    email: string;
    nota: string;
}

export const sendSponsorLeadEmail = async ({
    nombre,
    puesto,
    empresa,
    telefono,
    email,
    nota,
}: SponsorLeadProps) => {
    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    const SENDER_EMAIL = process.env.SENDER_EMAIL;
    const SENDER_NAME = process.env.SENDER_NAME;
    // Email donde llega la notificación
    const NOTIFICATION_EMAIL = process.env.CONTACT_EMAIL;

    const performFallback = async (reason: string) => {
        await notifyDiscord(
            `❌ Error enviando Lead de Sponsor: ${empresa}`,
            [
                { name: "Error", value: reason },
                { name: "Empresa", value: empresa },
                { name: "Contacto", value: `${nombre} (${puesto})` },
                { name: "Email", value: email },
                { name: "Teléfono", value: telefono },
                { name: "Mensaje", value: nota ? nota.slice(0, 500) : "Sin mensaje" },
            ],
            process.env.FOODIE_DISCORD_SPONSORS_WEBHOOK_URL
        );
        return false;
    };

    if (!BREVO_API_KEY) {
        return await performFallback("Falta API Key de Brevo");
    }

    const htmlContent = `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333; border-bottom: 2px solid #ff0054; padding-bottom: 10px;">🚀 Nuevo Lead de Sponsor</h2>
            <p>Alguien quiere ser sponsor del evento:</p>
            
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                <tr><td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Nombre:</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${nombre}</td></tr>
                <tr><td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Empresa:</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${empresa}</td></tr>
                <tr><td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Puesto:</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${puesto}</td></tr>
                <tr><td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td><td style="padding: 10px; border-bottom: 1px solid #eee;"><a href="mailto:${email}">${email}</a></td></tr>
                <tr><td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Teléfono:</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${telefono}</td></tr>
                <tr><td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Mensaje:</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${nota}</td></tr>
            </table>

            <p style="margin-top: 30px; font-size: 12px; color: #888;">Este es un mensaje automático del sitio web.</p>
        </div>
    </div>
    `;

    try {
        const res = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': BREVO_API_KEY,
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                sender: { name: SENDER_NAME, email: SENDER_EMAIL },
                to: [{ email: NOTIFICATION_EMAIL }],
                replyTo: { email: email, name: nombre },
                subject: `📢 Nuevo Sponsor Interesado: ${empresa}`,
                htmlContent: htmlContent
            })
        });

        if (!res.ok) {
            const errData = await res.json();
            console.error("Error brevo response:", errData);
            return await performFallback(`Error API Brevo: ${res.status}`);
        }

        console.log(`Email de lead de sponsor enviado a ${NOTIFICATION_EMAIL} vía Brevo`);
        return true;
    } catch (error: any) {
        console.error('Error enviando lead de sponsor:', error);
        return await performFallback(`Error de Red: ${error.message}`);
    }
};


