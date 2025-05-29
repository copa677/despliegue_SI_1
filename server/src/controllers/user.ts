import { Request, Response } from 'express';
import bycrypt from 'bcrypt';
import { Mostrar_NombreAdmin, Mostrar_usuarios, User, callActualizarPassword } from '../models/User';
import jwt from 'jsonwebtoken'
import { callCrearUsuarioProcedure } from '../models/User';


export const newUser = async (req: Request, res: Response) => {
    
    const { nombreAdministrador, telefono, correoElectronico, username, password} = req.body;

    //codificacion de la contraseña
    const hashedPassword = await bycrypt.hash(password,10)

    //validar si el Usuario ya existe en la Base de Datos
    const user = await User.findOne({where: { username: username }})
    if(user){
        res.status(400).json({
            msg: `Ya existe un usuario con el nombre ${username}`
        })
    }


    
    try {
        //Guardar Usuario en la base de datos
        // await User.create({
        //     username: username,
        //     password: hashedPassword
        // })
        //console.log(nombreAdministrador);
        await callCrearUsuarioProcedure(nombreAdministrador, telefono, correoElectronico, username, hashedPassword);

        res.json({
            msg: `Usuario ${username} creado exitosamente`,
        })
    } catch (error) {
        res.status(400).json({
            msg: 'Ups Ocurrio Un error',
            error
        })
    }

}

export const newPassword = async (req: Request, res: Response) =>{
    const {username, password} = req.body;
    //Encriptamos el password
    const hashedPassword = await bycrypt.hash(password,10)
    //validamos si el usuario existe en la base
    const user: any = await User.findOne({where: { username: username }});
    if(!user){
        res.status(400).json({
            msg: `No existe un usuario con el nombre ${username} en la base de datos`
        })
    }

    try {
        await callActualizarPassword(username, hashedPassword);

        res.json({
            msg: `Password actualizado exitosamente`,
        })
    } catch (error) {
        res.status(400).json({
            msg: 'Ups Ocurrio Un error',
            error
        })
    }

}

export const loginUser = async (req: Request, res: Response) => {
    
    const {username, password} = req.body;
    //validamos si el usuario existe en la base
    const user: any = await User.findOne({where: { username: username }});
    if(!user){
        res.status(400).json({
            msg: `No existe un usuario con el nombre ${username} en la base de datos`
        })
    }

    //validamos el password
    const passwordValido = await bycrypt.compare(password,user.password);
    if(!passwordValido){
        res.status(400).json({
            msg: 'Password Incorrecta'
        })
    }

    //generar token
    const token = jwt.sign({
                    username: username
                  }, process.env.SECRET_KEY || 'SuperPutz')


    res.json(token)

}

export const getUsuarios = async (req:Request, res:Response) => {
    
    try {
        const listUsuario = await Mostrar_usuarios();
        //console.log(_listProduct);
        
        res.json(listUsuario);
    } catch (error) {
        res.status(401).json({
            msg: 'Ups Ocurrio Un error',
            error
        })
    }
};

export const getNombreAdmin = async (req:Request, res:Response) => {
    
    try {
        const listUsuario = await Mostrar_NombreAdmin();
        res.json(listUsuario);
    } catch (error) {
        res.status(401).json({
            msg: 'Ups Ocurrio Un error',
            error
        })
    }
};

