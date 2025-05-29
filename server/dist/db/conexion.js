"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize = new sequelize_1.Sequelize('AUTOREPUESTOSCRUZ', 'postgres', 'password', {
    host: 'localhost',
    port: 5433,
    dialect: 'postgres'
});
exports.default = sequelize;
