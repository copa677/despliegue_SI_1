export interface Permiso{
    cod?: number,
    username?: string,
    perm_habilitado: boolean,
    perm_ver: boolean,
    perm_insertar: boolean,
    perm_editar?: boolean,
    perm_eliminar: boolean,
    vista?: string
}