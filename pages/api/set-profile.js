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
  const db = getRedis();
  await db.set('image', photo);
  fetch(`https://internal.hackclub.com/team/?token=${process.env.TEAM_SECRET}`, { method: "POST" });
  res.redirect('https://pfp.lynn.pt');
};
