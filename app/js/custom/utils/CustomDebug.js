/*
 * The copyright in this software module is being made available under the BSD License, included below. This software module may be subject to other third party and/or contributor rights, including patent rights, and no such rights are granted under this license.
 * The whole software resulting from the execution of this software module together with its external dependent software modules from dash.js project may be subject to Orange and/or other third party rights, including patent rights, and no such rights are granted under this license.
 * 
 * Copyright (c) 2014, Orange
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
 * •  Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
 * •  Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
 * •  Neither the name of the Orange nor the names of its contributors may be used to endorse or promote products derived from this software module without specific prior written permission.
 * 
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS “AS IS” AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
Custom.utils.CustomDebug = function () {
    "use strict";

    var rslt = Custom.utils.copyMethods(MediaPlayer.utils.Debug);

    var showLogTimestamp = true,
        startTime = new Date().getTime();

    rslt.getLogger = function () {
        var _logger = ('undefined' !== typeof(log4javascript)) ? log4javascript.getLogger() : null;
        if (_logger) {
            if(!_logger.initialized) {
                var appender = new log4javascript.PopUpAppender();
                var layout = new log4javascript.PatternLayout("%d{HH:mm:ss.SSS} %-5p - %m%n");
                appender.setLayout(layout);
                _logger.addAppender(appender);
                _logger.setLevel(log4javascript.Level.ALL);
                _logger.initialized = true;
            }
        }
        return _logger;
    };

    rslt.toHHMMSSmmm = function (time) {
        var str,
            h,
            m,
            s,
            ms = time;

        h = Math.floor(ms / 3600000);
        ms -= (h * 3600000);
        m = Math.floor(ms / 60000);
        ms -= (m * 60000);
        s = Math.floor(ms / 1000);
        ms -= (s * 1000);

        if (h < 10) {h = "0"+h;}
        if (m < 10) {m = "0"+m;}
        if (s < 10) {s = "0"+s;}
        if (ms < 10) {ms = "0"+ms;}
        if (ms < 100) {ms = "0"+ms;}

        str = h+':'+m+':'+s+':'+ms;
        return str;
    };

    rslt._log = function (level, args) {
        if (this.getLogToBrowserConsole() && (level <= rslt.getLevel())) {
            var _logger = this.getLogger(),
                message = "",
                logTime = null;

            if ((_logger === undefined) || (_logger === null)) {
                _logger = console;
            }

            if (showLogTimestamp) {
                logTime = new Date().getTime();
                message += "[" + this.toHHMMSSmmm(logTime - startTime) + "] ";
            }

            Array.apply(null, args).forEach(function(item) {
                message += item + " ";
            });

            switch (level) {
                case this.ERROR:
                    _logger.error(message);
                    break;
                case this.WARN:
                    _logger.warn(message);
                    break;
                case this.INFO:
                    _logger.info(message);
                    break;
                case this.DEBUG:
                    _logger.debug(message);
                    break;
            }
        }

        this.eventBus.dispatchEvent({
            type: "log",
            message: arguments[0]
        });
    };

    rslt.error = function () {
        this._log(this.ERROR, arguments);
    };

    rslt.warn = function () {
        this._log(this.WARN, arguments);
    };

    rslt.info = function () {
        this._log(this.INFO, arguments);
    };

    // Keep this function for compatibility
    rslt.log = function () {
        this._log(this.DEBUG, arguments);
    };

    return rslt;
};

