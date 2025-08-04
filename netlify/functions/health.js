const config = require('../../config/routes');

exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      status: 'OK',
      timestamp: new Date().toISOString(),
      urls: {
        SITE_A: config.urls.SITE_A_URL,
        SITE_B: config.urls.SITE_B_URL,
        SITE_C: config.urls.SITE_C_URL
      }
    }, null, 2)
  };
};