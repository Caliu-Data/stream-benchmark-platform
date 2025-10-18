import { sendEmail } from './email.js';

export default {
  async fetch(request, env) {
    const securityHeaders = {
      'Access-Control-Allow-Origin': '*', // Update this to your domain in production
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    };
    
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: securityHeaders,
      });
    }

    // Only allow POST requests
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ success: false, message: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json', ...securityHeaders },
      });
    }

    try {
      const data = await request.json();
      
      // Validate required fields
      if (!data.email) {
        throw new Error('Email is required');
      }

      if (!data.turnstileToken) {
        throw new Error('Turnstile token missing');
      }

      if (!data.recaptchaToken) {
        throw new Error('reCAPTCHA token missing');
      }

      // Validate Turnstile token
      const turnstileValidation = await validateTurnstileToken(data.turnstileToken, env);
      if (!turnstileValidation.success) {
        throw new Error('Invalid Turnstile token');
      }

      // Validate reCAPTCHA token
      const recaptchaValidation = await validateRecaptchaToken(data.recaptchaToken, env);
      if (!recaptchaValidation.success || recaptchaValidation.score < 0.5) {
        throw new Error('Invalid reCAPTCHA token or suspicious activity');
      }

      // Prepare lead data
      const leadData = {
        email: data.email,
        useCases: data.useCases || [],
        technologies: data.technologies || [],
        requestedFeature: data.requestedFeature || null,
        utm: data.utm || null,
        timestamp: data.timestamp || new Date().toISOString()
      };

      // Send email via SendGrid
      await sendEmail(leadData, env);
      
      return new Response(JSON.stringify({ 
        success: true,
        message: 'Lead captured successfully' 
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...securityHeaders
        },
      });
    } catch (err) {
      console.error('Worker error:', err);
      return new Response(JSON.stringify({ 
        success: false, 
        message: err.message || 'Internal server error'
      }), {
        status: 500,
        headers: { 
          'Content-Type': 'application/json', 
          ...securityHeaders 
        },
      });
    }
  },
};

/**
 * Validate Cloudflare Turnstile token
 */
async function validateTurnstileToken(token, env) {
  const formData = new URLSearchParams();
  formData.append('secret', env.TURNSTILE_SECRET_KEY);
  formData.append('response', token);

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData
  });

  const result = await response.json();
  console.log('Turnstile validation result:', result);
  
  if (!result.success) {
    const errorCodes = result['error-codes'] || [];
    console.error('Turnstile validation failed:', errorCodes);
    throw new Error(`Turnstile validation failed: ${errorCodes.join(', ')}`);
  }

  return result;
}

/**
 * Validate Google reCAPTCHA token
 */
async function validateRecaptchaToken(token, env) {
  const formData = new URLSearchParams();
  formData.append('secret', env.RECAPTCHA_SECRET_KEY);
  formData.append('response', token);

  const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData
  });

  const result = await response.json();
  console.log('reCAPTCHA validation result:', result);
  
  if (!result.success) {
    const errorCodes = result['error-codes'] || [];
    console.error('reCAPTCHA validation failed:', errorCodes);
    throw new Error(`reCAPTCHA validation failed: ${errorCodes.join(', ')}`);
  }

  return result;
}

