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
    
    // Parameter analysis
    const vParam = query.v || null;
    
    // Log detection
    console.log('[DETECTION]', {
      mobile: isMobile ? 'YES' : 'NO',
      vParam: vParam || 'not present',
      userAgent: userAgent.substring(0, 80) + '...'
    });

    if (Object.keys(query).length > 0) {
      console.log('[PARAMS DETECTED]', query);
    }

    // Determine redirect URL
    const targetUrl = config.getRedirectUrl(userAgent, query);
    
    // Log redirect decision
    const debugInfo = config.getDebugInfo(userAgent, query);
    console.log('[REDIRECT DECISION]', {
      mobile: debugInfo.isMobile,
      vParam: debugInfo.vParam,
      target: debugInfo.siteMapped
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