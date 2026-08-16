import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, name, email, phone, message, carDetails, budget, serviceLevel } = body;

    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
      console.warn("RESEND_API_KEY no está configurada. Simulando envío...");
      return NextResponse.json({ success: true, message: "Modo simulación activo" });
    }

    // Construir HTML del correo según el origen del formulario
    let subject = "";
    let emailHtml = "";

    if (type === "quiz") {
      subject = `🚗 [Cuestionario Landing] Nueva solicitud de: ${name}`;
      emailHtml = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 12px; background-color: #fcfcfc;">
          <h2 style="color: #171717; border-bottom: 2px solid #d4af37; padding-bottom: 10px; margin-top: 0;">Nueva solicitud de Coche Ideal</h2>
          <p>Se ha recibido una nueva solicitud del asistente de configuración de la landing page:</p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <tr>
              <td style="padding: 8px; font-weight: bold; width: 180px; border-bottom: 1px solid #f0f0f0;">Nombre del Cliente:</td>
              <td style="padding: 8px; border-bottom: 1px solid #f0f0f0;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #f0f0f0;">Teléfono:</td>
              <td style="padding: 8px; border-bottom: 1px solid #f0f0f0;"><a href="tel:${phone}">${phone}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #f0f0f0;">Correo Electrónico:</td>
              <td style="padding: 8px; border-bottom: 1px solid #f0f0f0;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #f0f0f0;">Vehículo de Interés:</td>
              <td style="padding: 8px; border-bottom: 1px solid #f0f0f0;">${carDetails}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #f0f0f0;">Presupuesto Máximo:</td>
              <td style="padding: 8px; border-bottom: 1px solid #f0f0f0; color: #b45309; font-weight: bold;">${budget} €</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #f0f0f0;">Nivel de Servicio:</td>
              <td style="padding: 8px; border-bottom: 1px solid #f0f0f0; text-transform: capitalize;">${serviceLevel}</td>
            </tr>
          </table>
          <p style="margin-top: 25px; font-size: 11px; color: #999; text-align: center;">Este correo ha sido generado automáticamente por NordImport 2.0.</p>
        </div>
      `;
    } else {
      subject = `✉️ [Ficha Vehículo] Consulta de: ${name}`;
      emailHtml = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 12px; background-color: #fcfcfc;">
          <h2 style="color: #171717; border-bottom: 2px solid #d4af37; padding-bottom: 10px; margin-top: 0;">Consulta de Vehículo del Marketplace</h2>
          <p>Un cliente ha enviado una consulta interesándose por un vehículo específico:</p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <tr>
              <td style="padding: 8px; font-weight: bold; width: 180px; border-bottom: 1px solid #f0f0f0;">Vehículo Consultado:</td>
              <td style="padding: 8px; border-bottom: 1px solid #f0f0f0; font-weight: bold; color: #171717;">${carDetails}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #f0f0f0;">Nombre del Cliente:</td>
              <td style="padding: 8px; border-bottom: 1px solid #f0f0f0;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #f0f0f0;">Teléfono:</td>
              <td style="padding: 8px; border-bottom: 1px solid #f0f0f0;"><a href="tel:${phone}">${phone}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #f0f0f0;">Correo Electrónico:</td>
              <td style="padding: 8px; border-bottom: 1px solid #f0f0f0;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; vertical-align: top; border-bottom: 1px solid #f0f0f0;">Mensaje Adicional:</td>
              <td style="padding: 8px; border-bottom: 1px solid #f0f0f0; white-space: pre-wrap;">${message || "(Sin comentarios adicionales)"}</td>
            </tr>
          </table>
          <p style="margin-top: 25px; font-size: 11px; color: #999; text-align: center;">Este correo ha sido generado automáticamente por NordImport 2.0.</p>
        </div>
      `;
    }

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "onboarding@resend.dev",
        to: "nordimport.contact@gmail.com",
        subject: subject,
        html: emailHtml,
      }),
    });

    if (!resendResponse.ok) {
      const errorText = await resendResponse.text();
      throw new Error(`Error en API Resend: ${errorText}`);
    }

    const resData = await resendResponse.json();
    return NextResponse.json({ success: true, data: resData });
  } catch (error: any) {
    console.error("Error en API de contacto:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
