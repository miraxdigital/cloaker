const config = require('../../config/routes');

exports.handler = async (event, context) => {
  try {
    // Extract request information
    const userAgent = event.headers['user-agent'] || '';
    const query = event.queryStringParameters || {};
    
    // Log the request
    console.log(`[${new Date().toISOString()}] ${event.httpMethod} ${event.path} - IP: ${event.headers['x-forwarded-for'] || 'unknown'}`);
    
    // Detection logic
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i;
    const isMobile = mobileRegex.test(userAgent);
    
    // UTM analysis
    const utmParams = ['utm_source', 'utm_campaign', 'utm_medium', 'utm_content', 'utm_term'];
    const detectedUTMs = {};
    let utmCount = 0;
    
    utmParams.forEach(param => {
      if (query[param]) {
        detectedUTMs[param] = query[param];
        utmCount++;
      }
    });

    // Log detection
    console.log('[DETECTION]', {
      mobile: isMobile ? 'YES' : 'NO',
      utmCount: utmCount,
      userAgent: userAgent.substring(0, 80) + '...'
    });

    if (utmCount > 0) {
      console.log('[UTM DETECTED]', detectedUTMs);
    }

    // Determine redirect URL
    const targetUrl = config.getRedirectUrl(userAgent, query);
    
    // Log redirect decision
    const debugInfo = config.getDebugInfo(userAgent, query);
    console.log('[REDIRECT DECISION]', {
      mobile: debugInfo.isMobile,
      hasUTM: debugInfo.hasRequiredUTM,
      hasVariant: debugInfo.hasVariant,
      target: targetUrl === config.urls.SITE_B_URL ? 'SITE_B (Cafe Quema Grasa)' :
              targetUrl === config.urls.SITE_C_URL ? 'SITE_C (Tes Metabolicos)' : 'SITE_A (Desenvem Foco)'
    });
    
    // Return redirect response
    return {
      statusCode: 302,
      headers: {
        'Location': targetUrl,
        'Cache-Control': 'no-store, no-cache, must-revalidate, private',
        'Referrer-Policy': 'no-referrer',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY'
      }
    };
  } catch (error) {
    console.error('[ERROR]', error.message);
    // Fallback to SITE_A_URL
    return {
      statusCode: 302,
      headers: {
        'Location': config.urls.SITE_A_URL,
        'Cache-Control': 'no-store, no-cache, must-revalidate, private'
      }
    };
  }
};