export function sendEmailTemplate(email: string) {
    return {
      subject: '👋 Bienvenue sur MyApp !',
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 24px; color: #111;">
          <div style="max-width: 600px; margin: auto; background: white; padding: 32px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
            <h2 style="margin-top: 0;">Bienvenue 👋</h2>
            <p>Bonjour <strong>${email}</strong>,</p>
            <p>Merci de t’être inscrit sur <strong>MyApp</strong> ! Nous sommes ravis de t’avoir avec nous 🚀</p>
            <p>Tu peux maintenant profiter de tous nos services.</p>
            <hr style="margin: 32px 0;" />
            <p style="font-size: 12px; color: #666;">Cet email est automatique, ne pas y répondre.</p>
          </div>
        </div>
      `,
    };
  }
  