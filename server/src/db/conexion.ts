import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('AUTOREPUESTOSCRUZ','postgres','password',{
    host: 'localhost',
    port: 5433,
    dialect: 'postgres'
})
export default sequelize;