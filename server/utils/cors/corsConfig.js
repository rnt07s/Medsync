const cors = require("cors");

function corsConfig(app) {
  const allowedOrigins = [
    "https://learnstocks.netlify.app",
    "https://console.cron-job.org",
    "https://prodez-ai.netlify.app",
    "https://medi-connect-in.netlify.app",
    "https://med-space.vercel.app",
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://localhost:8080",
    "http://localhost:8081",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
  ];

  const corsOptions = {
    origin: (origin, callback) => {
      // Log origin for debugging
      console.log('CORS check - Origin:', origin);
      // Allow requests with no 'Origin' (e.g., Postman or internal requests)
      // Also allow all localhost origins for development
      if (!origin || allowedOrigins.includes(origin) || (origin && origin.includes('localhost'))) {
        callback(null, true);
      } else {
        console.warn('CORS blocked for origin:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-auth-token", "Origin", "Accept"],
    exposedHeaders: ["Content-Type", "Authorization", "x-auth-token"],
    credentials: true,
  };

  // Apply CORS using the options
  app.use(cors(corsOptions));

  // Additional middleware to set explicit CORS response headers and log preflight
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    // Allow all localhost origins in development
    if (origin && (allowedOrigins.includes(origin) || origin.includes('localhost'))) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Vary', 'Origin');
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,x-auth-token,Origin,Accept');
    }
    if (req.method === 'OPTIONS') {
      console.log('CORS preflight (OPTIONS) request for', req.url, 'from', origin);
      return res.sendStatus(204);
    }
    next();
  });
}

module.exports = corsConfig;
