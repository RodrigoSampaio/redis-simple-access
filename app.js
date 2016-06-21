'use strict'

let redis = require('redis');

let simpleRedis = function(config){
    
    let _connection;
    let _connect = function _connect(done){
        if (!_connection){
            _connection = redis.createClient(config.port, config.host);
            if (config.pass){
                _connection.auth(config.pass);
            }
            _connection.on('connect', function(err){
                done(err, _connection);
            })
        } else {
            done(null, _connection);
        }
    };

    let _get = function _get(key, done){
        _connect(function(err, conn){
            if (err){
                console.log(err);
            }else{
                conn.get(key, function(err, value){
                    if (err){
                        throw err;
                    }
                    done(err, value);
                });
            }
        });
    }

    let _set = function _set(key, value, ttl, done) {
        _connect(function(err, conn){
            if (err){
                throw err;
            } else { 
                conn.set(key, value, function(err, res){
                    if (!err && ttl){
                        conn.expire(key, ttl);
                    }
                    done(err, res);
                });
            }
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