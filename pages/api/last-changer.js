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
  const location = await db.get('last_changer_location');
  res.json({ location: location || null });
};
