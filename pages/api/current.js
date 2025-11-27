const Redis = require('ioredis');

let redis;
function getRedis() {
  if (!redis) {
    redis = new Redis(process.env.REDIS_URL);
  }
  return redis;
}

export default async (req, res) => {
  const db = getRedis();
  const image = await db.get('image');
  res.redirect(image || 'https://pfp.lynn.pt');
};
