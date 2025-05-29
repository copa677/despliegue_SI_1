import { Request, Response } from 'express';
import { User, callActualizarPassword } from '../models/User';
import { editar_permiso, insertar_permiso, obtener_categoria_permiso } from '../models/permisos';

export const newPermiso = async (req: Request, res: Response) => {
    const {username,perm_habilitado,perm_ver,perm_insertar,perm_editar,perm_eliminar,vista} = req.body;
    try {
        await insertar_permiso(username,perm_habilitado,perm_ver,perm_insertar,perm_editar,perm_eliminar,vista);
        res.json({
            msg: "Nuevo permiso Insertado"
        })
    } catch (error:any) {
        res.status(400).json({
            msg: 'Ups Ocurrio Un error'+error.message,
            error: error.message
        })
    }
}

export const actualizar_Permiso = async (req: Request, res: Response) => {
    const {username,perm_habilitado,perm_ver,perm_insertar,perm_editar,perm_eliminar,vista} = req.body;
    try {
        await editar_permiso(username,perm_habilitado,perm_ver,perm_insertar,perm_editar,perm_eliminar,vista);
        res.json({
            msg: "Permiso editado con exito"
        })
    } catch (error:any) {
        res.status(400).json({
            msg: 'Ups Ocurrio Un error'+error.message,
            error: error.message
        })
    }
}


export const UserPer = async (req: Request, res: Response) => {
    const {username,vista} = req.body;
    //validamos si el usuario existe en la base
    const user: any = await User.findOne({where: { username: username }});
    if(!user){
        res.status(400).json({
            msg: `No existe un usuario con el nombre ${username} en la base de datos`
        })
    }

    try {
        const permiso=await obtener_categoria_permiso(username,vista);

        res.json(permiso)
    } catch (error:any) {
        res.status(400).json({
            msg: 'Ups Ocurrio Un error'+error.message,
            error: error.message
        })
    }
}