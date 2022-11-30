export default {
  id: process.env.AKSARA_GA_ID,
  client: process.env.AKSARA_GA_CLIENT,
  key: process.env.AKSARA_GA_KEY,
  scope: "https://www.googleapis.com/auth/analytics.readonly",
} as const;
