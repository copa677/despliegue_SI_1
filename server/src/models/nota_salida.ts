import { DataType, DataTypes, DecimalDataType, INTEGER, IntegerDataType } from 'sequelize';
import sequelize from "../db/conexion";

export const NotaSalida = sequelize.define('NotaSalida', {
    cod: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    origen: {
        type: DataTypes.STRING,
    },
    descripcion: {
        type: DataTypes.STRING,
    },
    fecha: {
        type: DataTypes.DATE,
    },
}, {
    tableName: 'nota_salida', // Nombre de la tabla existente en la base de datos
    timestamps: false // Indica que no hay columnas 'createdAt' y 'updatedAt' en la tabla
});
//Llamada de los procedimientos almacenador
export async function Actulizar_nota_salida(codSalida: number,fecha: Date,origen: string,descripcion:string) {
    try {
    const [results, metadata] = await sequelize.query(
        `CALL actualizar_nota_salida('${codSalida}','${fecha}', '${origen}','${descripcion}')`
    );

    } catch (error) {
        console.error('Error al llamar al procedimiento almacenado:', error);
        throw error;
    }
}

export async function Insertar_detalle_salida(codSalida: number,producto: string,cantidad: number) {
    try {
    const [results, metadata] = await sequelize.query(
        `CALL insertar_detalle_salida('${codSalida}','${producto}', '${cantidad}')`
    );

    } catch (error) {
        console.error('Error al llamar al procedimiento almacenado:', error);
        throw error;
    }
}

export async function Eliminar_notas_vacias() {
    try {
    const [results, metadata] = await sequelize.query(
        `CALL eliminar_notas_salida_vacias()`
    );

    } catch (error) {
        console.error('Error al llamar al procedimiento almacenado:', error);
        throw error;
    }
}

export async function Eliminar_nota_salida(codSalida: number) {
    try {
    const [results, metadata] = await sequelize.query(
        `CALL eliminar_nota_salida('${codSalida}')`
    );

    } catch (error) {
        console.error('Error al llamar al procedimiento almacenado:', error);
        throw error;
    }
}

export async function Mostrar_detalle_nota_salida(codSalida: number) {
    try {
    const [results, metadata] = await sequelize.query(
        `SELECT * FROM mostrar_detalle_nota_salida('${codSalida}')`
    );
    return results;
    } catch (error) {
        console.error('Error al llamar al procedimiento almacenado:', error);
        throw error;
    }
}

export async function Actulizar_detalle_salida(codSalida: number,producto: string,cantidad: number) {
    try {
    const [results, metadata] = await sequelize.query(
        `CALL actualizar_detalle_salida('${codSalida}','${producto}', '${cantidad}')`
    );

    } catch (error) {
        console.error('Error al llamar al procedimiento almacenado:', error);
        throw error;
    }
}

export async function Eliminar_detalle_salida(codDetalle: number) {
    try {
    const [results, metadata] = await sequelize.query(
        `CALL eliminar_detalle_nota_salida('${codDetalle}')`
    );

    } catch (error) {
        console.error('Error al llamar al procedimiento almacenado:', error);
        throw error;
    }
}
