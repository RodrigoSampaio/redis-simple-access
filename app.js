'use strict'

let redis = require('redis');

let simpleRedis = function (config) {

    let _connection;
    let _connect = function (done) {
        if (_connection) {
            done(null, _connection);
            return;
        }
        _connection = redis.createClient(config.port, config.host);
        if (config.pass) {
            _connection.auth(config.pass);
        }
        _connection.on('connect', function (err) {
            done(err, _connection);
        });
    };

    let _get = function (key, done) {
        _connect(function (err, conn) {
            if (err) {
                done(err);
                return;
            }
            conn.get(key, function (err, value) {
                done(err, value);
            });
        });
    }

    let _set = function (key, value, ttl, done) {
        _connect(function (err, conn) {
            if (err) {
                done(err);
                return;
            }
            conn.set(key, value, function (err, res) {
                if (err) {
                    done(err);
                    return;
                }
                if (ttl) {
                    conn.expire(key, ttl);
                }
                done(null, res);
            });
        });
    };

    let _dispose = function () {
        _connection.quit();
        _connection = null;
    };

    return {
        get: _get,
        set: _set,
        dispose: _dispose
    };

};

module.exports = simpleRedis;
