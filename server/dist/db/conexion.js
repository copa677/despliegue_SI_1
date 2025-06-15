"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize = new sequelize_1.Sequelize('AUTOREPUESTOSCRUZ', 'postgres', 'password', {
    host: 'postgres',
    port: 5432,
    dialect: 'postgres'
});
exports.default = sequelize;
