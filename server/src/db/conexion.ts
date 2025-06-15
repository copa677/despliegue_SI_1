import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('AUTOREPUESTOSCRUZ','postgres','password',{
    host: 'postgres',
    port: 5432,
    dialect: 'postgres'
})

export default sequelize;