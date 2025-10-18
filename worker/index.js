import { sendEmail } from './email.js';

export default {
  async fetch(request, env) {
    // Get the origin of the request
    const origin = request.headers.get('Origin');
    
    // Allow Cloudflare Pages deployment and production domains
    const allowedOrigins = [
      'https://stream-benchmark.pages.dev',
      'https://benchmark.caliudata.com',
      'https://app.caliudata.com',
      'https://caliudata.com'
    ];
    
    const allowOrigin = allowedOrigins.includes(origin) ? origin : 'https://benchmark.caliudata.com';
    
    const securityHeaders = {
      'Access-Control-Allow-Origin': allowOrigin,
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

    // Health check endpoint
    if (request.method === 'GET') {
      return new Response(JSON.stringify({ 
        status: 'ok', 
        message: 'Worker is running',
        timestamp: new Date().toISOString()
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...securityHeaders },
      });
    }

    // Only allow POST requests for form submission
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ success: false, message: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json', ...securityHeaders },
      });
    }

    try {
      let data;
      
      // Parse JSON with better error handling
      try {
        const text = await request.text();
        console.log('Raw request body length:', text.length);
        console.log('Raw request body:', text.substring(0, 200)); // First 200 chars
        console.log('Content-Type:', request.headers.get('Content-Type'));
        data = JSON.parse(text);
      } catch (parseError) {
        console.error('JSON parse error:', parseError.message);
        console.error('Failed to parse body');
        throw new Error(`Invalid JSON: ${parseError.message}`);
      }
      
      console.log('Parsed data successfully');
      
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

