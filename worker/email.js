export async function sendEmail(leadData, env) {
  const SENDGRID_API_KEY = env.SENDGRID_API_KEY;
  const TO_EMAIL = env.TO_EMAIL;
  const FROM_EMAIL = env.FROM_EMAIL;

  const payload = {
    personalizations: [
      {
        to: [{ email: TO_EMAIL }],
        subject: `New Lead Capture - Caliu Benchmark Platform`,
      },
    ],
    from: { email: FROM_EMAIL || 'info@caliudata.com', name: 'Caliu Benchmark' },
    content: [
      {
        type: 'text/html',
        value: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 5px; }
    .content { background: #f9fafb; padding: 20px; margin-top: 20px; border-radius: 5px; }
    .section { margin-bottom: 20px; }
    .label { font-weight: bold; color: #4b5563; }
    .value { color: #1f2937; margin-left: 10px; }
    .list-item { background: #e5e7eb; padding: 8px; margin: 5px 0; border-radius: 3px; }
    .utm-section { background: #dbeafe; padding: 15px; border-radius: 5px; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>🎯 New Lead Captured - Caliu Benchmark Platform</h2>
    </div>
    
    <div class="content">
      <div class="section">
        <span class="label">📧 Email:</span>
        <span class="value">${leadData.email}</span>
      </div>

      ${leadData.technologies && leadData.technologies.length > 0 ? `
      <div class="section">
        <div class="label">🔧 Interested Technologies:</div>
        ${leadData.technologies.map(tech => `<div class="list-item">${tech}</div>`).join('')}
      </div>
      ` : ''}

      ${leadData.useCases && leadData.useCases.length > 0 ? `
      <div class="section">
        <div class="label">💼 Interested Use Cases:</div>
        ${leadData.useCases.map(useCase => `<div class="list-item">${useCase}</div>`).join('')}
      </div>
      ` : ''}

      ${leadData.requestedFeature ? `
      <div class="section">
        <span class="label">🎯 Requested Feature:</span>
        <span class="value">${leadData.requestedFeature.type}: ${leadData.requestedFeature.value}</span>
      </div>
      ` : ''}

      <div class="section">
        <span class="label">📅 Timestamp:</span>
        <span class="value">${new Date(leadData.timestamp).toLocaleString()}</span>
      </div>

      ${leadData.utm ? `
      <div class="utm-section">
        <div class="label">📊 Campaign Tracking (UTM):</div>
        <div style="margin-top: 10px;">
          ${leadData.utm.source ? `<div><span class="label">Source:</span> <span class="value">${leadData.utm.source}</span></div>` : ''}
          ${leadData.utm.medium ? `<div><span class="label">Medium:</span> <span class="value">${leadData.utm.medium}</span></div>` : ''}
          ${leadData.utm.campaign ? `<div><span class="label">Campaign:</span> <span class="value">${leadData.utm.campaign}</span></div>` : ''}
          ${leadData.utm.content ? `<div><span class="label">Content:</span> <span class="value">${leadData.utm.content}</span></div>` : ''}
          ${leadData.utm.term ? `<div><span class="label">Term:</span> <span class="value">${leadData.utm.term}</span></div>` : ''}
        </div>
      </div>
      ` : ''}
    </div>
  </div>
</body>
</html>
        `,
      },
    ],
  };

  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${SENDGRID_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`SendGrid API error: ${response.status} - ${errorText}`);
  }

  return response;
}

