const redis=require("redis");

const userClient= redis.createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: 'redis-14633.c305.ap-south-1-1.ec2.redns.redis-cloud.com',
        port: 14633
    }
});

module.exports=userClient;