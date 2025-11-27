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
  
  // Get client IP
  const clientIp = req.headers['x-forwarded-for']?.split(',')[0] || 
                   req.headers['x-real-ip'] || 
                   req.connection.remoteAddress;
  
  // Check if it's an automated IP
  const automatedIPs = ['94.198.41.230', '37.120.212.158', '146.70.146.182', '37.120.155.138'];
  const isAutomated = automatedIPs.includes(clientIp);
  
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
  
  // Check rate limit (2 minutes = 120 seconds) - skip for automated IPs
  if (!isAutomated) {
    const lastRun = await db.get('last_profile_change');
    const now = Date.now();
    
    if (lastRun) {
      const timeSinceLastRun = (now - parseInt(lastRun)) / 1000; // seconds
      if (timeSinceLastRun < 120) {
        const waitTime = Math.ceil(120 - timeSinceLastRun);
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
  
  await db.set('image', photo);
  await db.set('last_profile_change', now.toString());
  await db.set('last_changer_location', location);
  res.redirect('https://pfp.lynn.pt');
};
