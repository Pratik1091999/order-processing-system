const redis = require('redis');

const redisClient = redis.createClient({
    username: 'default',
    password: process.env.REDIS_PASSWORD,  // Secure credentials from env variables
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
    }
});

redisClient.on('error', (err) => console.error('❌ Redis Client Error:', err));

const connectRedis = async () => {
    if (!redisClient.isOpen) {
        await redisClient.connect();
        console.log('✅ Redis Connected Successfully');
    }
};

const setRedis = async (key, value, expiration = 600) => {
    await connectRedis();
    await redisClient.setEx(key, expiration, JSON.stringify(value));
};

const getRedis = async (key) => {
    await connectRedis();
    const value = await redisClient.get(key);
    return value ? JSON.parse(value) : null;
};

module.exports = { connectRedis, setRedis, getRedis };
