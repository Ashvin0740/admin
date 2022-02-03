const redis = require('redis');
const ioRedis = require('socket.io-redis');
const { promisify } = require('util');

function RedisClient() {
    this.options = {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
    };
}

RedisClient.prototype.initialize = function () {
    this.redisClient = redis.createClient(this.options);
    this.publisher = redis.createClient(this.options);
    this.subscriber = redis.createClient(this.options);

    if (process.env.NODE_ENV !== 'prod') this.redisClient.config('SET', 'notify-keyspace-events', 'Ex'); // TODO -> move to setupConfig
    this.redisClient.on('ready', this.setupConfig.bind(this));
}

RedisClient.prototype.setupConfig = function () {
    this.publisher.setMaxListeners(0);
    this.subscriber.setMaxListeners(0);
    this.subscriber.subscribe('__keyevent@0__:expired'); // reminder service
    this.subscriber.on('message', this.onMessage);
    this.setupVariables();
}

RedisClient.prototype.getAdapter = function(){
    return ioRedis({ ...this.options, subClient: this.subscriber, pubClient: this.publisher });
}

RedisClient.prototype.setupVariables = function () {
    this.keysAsync = promisify(this.redisClient.keys).bind(this.redisClient);
    this.incrAsync = promisify(this.redisClient.incr).bind(this.redisClient);
    this.decrAsync = promisify(this.redisClient.decr).bind(this.redisClient);
    // timers
    this.getAsync = promisify(this.redisClient.get).bind(this.redisClient);
    this.setAsync = promisify(this.redisClient.set).bind(this.redisClient);

    this.expireAsync = promisify(this.redisClient.expire).bind(this.redisClient);
    this.ttlAsync = promisify(this.redisClient.ttl).bind(this.redisClient);
    this.pexpireAsync = promisify(this.redisClient.pexpire).bind(this.redisClient);
    this.pttlAsync = promisify(this.redisClient.pttl).bind(this.redisClient);
    // hash
    this.hdelAsync = promisify(this.redisClient.hdel).bind(this.redisClient);
    this.hsetAsync = promisify(this.redisClient.hset).bind(this.redisClient);
    this.hkeysAsync = promisify(this.redisClient.hkeys).bind(this.redisClient);
    this.hgetAsync = promisify(this.redisClient.hget).bind(this.redisClient);
    this.hgetallAsync = promisify(this.redisClient.hgetall).bind(this.redisClient);
    this.hmgetAsync = promisify(this.redisClient.hmget).bind(this.redisClient);
    this.hdelAsync = promisify(this.redisClient.hdel).bind(this.redisClient);
    this.hmsetAsync = promisify(this.redisClient.hmset).bind(this.redisClient);
    this.hexistsAsync = promisify(this.redisClient.hexists).bind(this.redisClient);
    // set
    this.saddAsync = promisify(this.redisClient.sadd).bind(this.redisClient);
    this.sismemberAsync = promisify(this.redisClient.sismember).bind(this.redisClient);
    this.smembersAsync = promisify(this.redisClient.smembers).bind(this.redisClient);
    // sorted set
    this.zaddAsync = promisify(this.redisClient.zadd).bind(this.redisClient);
    this.zrangeAsync = promisify(this.redisClient.zrange).bind(this.redisClient);
    this.zrangebyscoreAsync = promisify(this.redisClient.zrangebyscore).bind(this.redisClient);
    // delete
    this.deleteAsync = promisify(this.redisClient.del).bind(this.redisClient);
    this.delete = (key, callback) => this.redisClient.del(key.toString(), callback);
    this.publish = (eventName, data) => publisher.publish(eventName, _.stringify(data));
}

RedisClient.prototype.onMessage = function (channel, message) {
    // `scheduler:127.0.0.1:reqTurnChange:iTableId-iUserId-extraData`;

    let _channel;
    let _message;

    if (channel === '__keyevent@0__:expired') {
        const [$preMessage, task, $channel, $postMessage, ip] = message.split(':');
        if (ip !== process.env.HOST) return false;
        if (task !== 'scheduler') return false;

        _channel = $channel;
        _message = `${$preMessage}-${$postMessage || ''}`; // iTabled + -iUserId
    } else {
        _channel = channel;
        _message = message;
    }

    let parsedMessage = '';
    try {
        parsedMessage = _.parse(_message);
    } catch (error) {
        log.red('can not parse -> ', _message);
        parsedMessage = _message;
    }
    emitter.emit(_channel, parsedMessage);
}

module.exports = new RedisClient();
