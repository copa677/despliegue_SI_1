import { DataType, DataTypes } from 'sequelize';
import sequelize from '../db/conexion';

export const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type : DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'usuario', // Nombre de la tabla existente en la base de datos
    timestamps: false // Indica que no hay columnas 'createdAt' y 'updatedAt' en la tabla
});


// Llamar al procedimiento almacenado
export async function callCrearUsuarioProcedure(nombreAdministrador: string, telefono: string, correoElectronico: string, username: string, password: string) {
    try {
      const [results, metadata] = await sequelize.query(
        `CALL crear_usuario('${nombreAdministrador}', '${telefono}', '${correoElectronico}', '${username}', '${password}')`
      );
      //console.log(results);
    } catch (error) {
      console.error('Error al llamar al procedimiento almacenado:', error);
    }
}
  
export async function callActualizarPassword(username: string, password: string){
  try {
    const [results, metadata] = await sequelize.query(
      `CALL actualizar_contrasena('${username}', '${password}')`
    );
  } catch (error) {
    console.error('Error al llamar al procedimiento almacenado:', error);
  }
}

export async function Mostrar_usuarios(){
  try {
    const [results, metadata] = await sequelize.query(
      `SELECT * FROM mostrar_usuarios()`
    );
    return results;
  } catch (error) {
    console.error('Error al llamar al procedimiento almacenado:', error);
  }
};

export async function Mostrar_NombreAdmin(){
  try {
    const [results, metadata] = await sequelize.query(
      `SELECT * FROM mostrar_administradores_vinculados()`
    );
    return results;
  } catch (error) {
    console.error('Error al llamar al procedimiento almacenado:', error);
  }
};

