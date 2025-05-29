"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPer = exports.actualizar_Permiso = exports.newPermiso = void 0;
const User_1 = require("../models/User");
const permisos_1 = require("../models/permisos");
const newPermiso = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, perm_habilitado, perm_ver, perm_insertar, perm_editar, perm_eliminar, vista } = req.body;
    try {
        yield (0, permisos_1.insertar_permiso)(username, perm_habilitado, perm_ver, perm_insertar, perm_editar, perm_eliminar, vista);
        res.json({
            msg: "Nuevo permiso Insertado"
        });
    }
    catch (error) {
        res.status(400).json({
            msg: 'Ups Ocurrio Un error' + error.message,
            error: error.message
        });
    }
});
exports.newPermiso = newPermiso;
const actualizar_Permiso = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, perm_habilitado, perm_ver, perm_insertar, perm_editar, perm_eliminar, vista } = req.body;
    try {
        yield (0, permisos_1.editar_permiso)(username, perm_habilitado, perm_ver, perm_insertar, perm_editar, perm_eliminar, vista);
        res.json({
            msg: "Permiso editado con exito"
        });
    }
    catch (error) {
        res.status(400).json({
            msg: 'Ups Ocurrio Un error' + error.message,
            error: error.message
        });
    }
});
exports.actualizar_Permiso = actualizar_Permiso;
const UserPer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, vista } = req.body;
    //validamos si el usuario existe en la base
    const user = yield User_1.User.findOne({ where: { username: username } });
    if (!user) {
        res.status(400).json({
            msg: `No existe un usuario con el nombre ${username} en la base de datos`
        });
    }
    try {
        const permiso = yield (0, permisos_1.obtener_categoria_permiso)(username, vista);
        res.json(permiso);
    }
    catch (error) {
        res.status(400).json({
            msg: 'Ups Ocurrio Un error' + error.message,
            error: error.message
        });
    }
});
exports.UserPer = UserPer;
