"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
var path = require("path");
var fs_1 = require("fs");
require("webpack-dev-server");
var MiniCssExtractPlugin = require('mini-css-extract-plugin');
var overridePath = function (config) {
    var oneOfRule = config.module.rules.find(function (rule) { return rule.oneOf; });
    if (!oneOfRule) {
        return config;
    }
    var tsRule = oneOfRule.oneOf.find(function (rule) { return rule.test && rule.test.toString().includes('ts'); });
    if (!tsRule) {
        return config;
    }
    var packageDirs = (0, fs_1.readdirSync)(path.join(__dirname, '../../../modules'));
    var newIncludePaths = packageDirs.map(function (pkg) { return path.resolve(__dirname, '../../../modules', pkg); });
    if (Array.isArray(tsRule.include)) {
        tsRule.include = __spreadArray(__spreadArray([], tsRule.include, true), newIncludePaths, true);
    }
    else {
        tsRule.include = __spreadArray([tsRule.include], newIncludePaths, true);
    }
    return config;
};
module.exports = function override(config, env) {
    config.optimization.splitChunks = {
        cacheGroups: {
            "default": false
        }
    };
    config.optimization.runtimeChunk = false;
    config.plugins = config.plugins.filter(function (plugin) { return !(plugin instanceof MiniCssExtractPlugin); });
    config.module.rules = config.module.rules.map(function (moduleRule) {
        var _a;
        moduleRule.oneOf = (_a = moduleRule.oneOf) === null || _a === void 0 ? void 0 : _a.map(function (rule) {
            if (!rule.hasOwnProperty('use')) {
                return rule;
            }
            return Object.assign({}, rule, {
                use: rule.use.map(function (options) {
                    return /mini-css-extract-plugin/.test(options.loader)
                        ? { loader: require.resolve('style-loader'), options: {} }
                        : options;
                })
            });
        });
        return moduleRule;
    });
    config = overridePath(config);
    config.output.filename = 'content-react.js';
    return config;
};
