const axios = require("axios").default;
import { WebClient } from "@slack/web-api";
const Redis = require('ioredis');
const sharp = require('sharp');

let redis;
function getRedis() {
  if (!redis) {
    redis = new Redis(process.env.REDIS_URL);
  }
  return redis;
}

export const config = {
  maxDuration: 10,
};

export default async (req, res) => {
  const db = getRedis();
  
  // Check for bypass password
  const bypassPassword = req.query.bypass;
  const correctPassword = process.env.BYPASS_PASSWORD;
  const hasBypass = bypassPassword && correctPassword && bypassPassword === correctPassword;
  
  // Get client IP
  const clientIp = req.headers['x-forwarded-for']?.split(',')[0] || 
                   req.headers['x-real-ip'] || 
                   req.connection.remoteAddress;
  
  // Check if it's an automated IP
  const automatedIPs = ['94.198.41.230', '37.120.212.158', '146.70.146.182', '37.120.155.138'];
  const isAutomated = automatedIPs.includes(clientIp);
  
  // Check if request is from curl or similar tool (skip for automated IPs)
  if (!isAutomated) {
    const userAgent = req.headers['user-agent'] || '';
    const isCurl = userAgent.toLowerCase().includes('curl') ||
                   userAgent.toLowerCase().includes('wget') ||
                   userAgent.toLowerCase().includes('httpie') ||
                   userAgent.toLowerCase().includes('python-requests') ||
                   userAgent.toLowerCase().includes('axios') ||
                   userAgent === '' ||
                   !userAgent.includes('Mozilla');
    
    if (isCurl) {
      return res.status(403).json({
        error: 'Browser required',
        message: 'please use a web browser to change my pfp! curl and similar tools arent allowed. you can still bypass this by just setting a browser agent though :)',
        hint: 'visit https://pfp.lynn.pt in your browser'
      });
    }
  }
  
  let location = 'Automated';
  let isp = 'N/A';
  
  // Get country from IP if not automated
  if (!isAutomated) {
    try {
      const geoResponse = await axios.get(`https://ip.hackclub.com/ip/${clientIp}`);
      location = geoResponse.data.country_name || 'Unknown';
      isp = geoResponse.data.isp_name || 'Unknown';
    } catch (error) {
      location = 'Unknown';
      isp = 'Unknown';
    }
  }
  
  // Check daily rate limit (150 requests per day) - skip for automated IPs
  if (!isAutomated && !hasBypass) {
    // Use IP + cookie for tracking
    const userCookie = req.cookies?.user_id;
    const identifier = userCookie || clientIp;
    const dailyKey = `daily_limit:${identifier}:${new Date().toISOString().split('T')[0]}`;
    
    const dailyCount = await db.get(dailyKey);
    const count = dailyCount ? parseInt(dailyCount) : 0;
    
    if (count >= 150) {
      return res.status(429).json({
        error: 'Daily limit exceeded',
        message: `you've hit your daily limit of 150 profile picture changes! come back tomorrow :)`,
        limit: 150,
        current: count
      });
    }
  }
  
  // Check rate limit (45 seconds) - skip for automated IPs or bypass password
  if (!isAutomated && !hasBypass) {
    const lastRun = await db.get('last_profile_change');
    const now = Date.now();
    
    if (lastRun) {
      const timeSinceLastRun = (now - parseInt(lastRun)) / 1000; // seconds
      if (timeSinceLastRun < 45) {
        const waitTime = Math.ceil(45 - timeSinceLastRun);
        return res.status(429).json({ 
          error: 'Rate limit exceeded',
          message: `woah woah woah you're going too fast! slow down! try again in ${waitTime} seconds`,
          retryAfter: waitTime
        });
      }
    }
  }
  
  const now = Date.now();
  
  const client = new WebClient();
  const context = require.context('../../public/images', true)
  let photos = context.keys()
  let photo = photos[Math.floor(Math.random() * photos.length)].replace('./', 'https://pfp.lynn.pt/images/')
  const image = await axios.get(photo, {
    responseType: "arraybuffer",
  });
  const squareImageBuffer = await sharp(Buffer.from(image.data))
    .resize(400, 400) // Adjust the dimensions as needed
    .toBuffer();
  
  const slackRequest = await client.users.setPhoto({
    image: squareImageBuffer,
    token: process.env.SLACK_TOKEN,
  });
  
  // Extract filename from photo URL
  const filename = photo.split('/').pop();
  
  // Log the change
  const automatedTag = isAutomated ? ' (AUTOMATED)' : '';
  console.log(`PFP changed to ${filename}, from ${location}, ISP: ${isp}${automatedTag}`);
  
  // Increment daily counter for non-automated users
  if (!isAutomated && !hasBypass) {
    const userCookie = req.cookies?.user_id;
    const identifier = userCookie || clientIp;
    const dailyKey = `daily_limit:${identifier}:${new Date().toISOString().split('T')[0]}`;
    await db.incr(dailyKey);
    await db.expire(dailyKey, 86400); // Expire after 24 hours
  }
  
  // Set a cookie for tracking if not already set
  if (!isAutomated && !req.cookies?.user_id) {
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    res.setHeader('Set-Cookie', `user_id=${userId}; Path=/; Max-Age=31536000; SameSite=Lax`);
  }
  
  await db.set('image', photo);
  await db.set('last_profile_change', now.toString());
  await db.set('last_changer_location', location);
  res.redirect('https://pfp.lynn.pt');
};
