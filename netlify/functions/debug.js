const config = require('../../config/routes');

exports.handler = async (event, context) => {
  try {
    const userAgent = event.headers['user-agent'] || '';
    const query = event.queryStringParameters || {};
    const debugInfo = config.getDebugInfo(userAgent, query);
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-store, no-cache, must-revalidate, private'
      },
      body: JSON.stringify({
        ...debugInfo,
        urls: config.urls,
        timestamp: new Date().toISOString()
      }, null, 2)
    };
  } catch (error) {
    console.error('[ERROR]', error.message);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};