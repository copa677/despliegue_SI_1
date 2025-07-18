PGDMP  0                    }            AUTOREPUESTOSCRUZ    17.4    17.4 �    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            �           1262    16387    AUTOREPUESTOSCRUZ    DATABASE     �   CREATE DATABASE "AUTOREPUESTOSCRUZ" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Spanish_Bolivia.1252';
 #   DROP DATABASE "AUTOREPUESTOSCRUZ";
                     postgres    false                       1255    24925 -   Actualizar_Stock_Inventario(integer, integer) 	   PROCEDURE       CREATE PROCEDURE public."Actualizar_Stock_Inventario"(IN "p_codigo_producto " integer, IN p_cantidad integer)
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE inventario
    SET cantenstockenalmacen = cantenstockenalmacen + p_cantidad
    WHERE codprod = p_codigo_producto;
END;
$$;
 m   DROP PROCEDURE public."Actualizar_Stock_Inventario"(IN "p_codigo_producto " integer, IN p_cantidad integer);
       public               postgres    false            �            1255    16390 ;   actualizar_contrasena(character varying, character varying) 	   PROCEDURE     -  CREATE PROCEDURE public.actualizar_contrasena(IN p_username character varying, IN p_nueva_contrasena character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Actualizar la contraseña del usuario
    UPDATE USUARIO
    SET password = p_nueva_contrasena
    WHERE username = p_username;
END;
$$;
 w   DROP PROCEDURE public.actualizar_contrasena(IN p_username character varying, IN p_nueva_contrasena character varying);
       public               postgres    false            A           1255    24930 >   actualizar_detalle_salida(integer, character varying, integer) 	   PROCEDURE     �  CREATE PROCEDURE public.actualizar_detalle_salida(IN p_coddetalle integer, IN p_nombrecategoria character varying, IN p_cantidad integer)
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_codigoProducto INT;
BEGIN
    -- Obtener el código del producto basado en el nombre de la categoría
    SELECT codigo INTO v_codigoProducto
    FROM PRODUCTO
    WHERE idcategoria = (SELECT id FROM CATEGORIA WHERE descripcion = p_nombreCategoria)
    LIMIT 1;

    -- Actualizar el detalle de salida con el nuevo código de producto y cantidad
    UPDATE DETALLE_NOTA_SALIDA
    SET codproducto = v_codigoProducto,
        cantidad = p_cantidad
    WHERE cod = p_codDetalle;
END;
$$;
 �   DROP PROCEDURE public.actualizar_detalle_salida(IN p_coddetalle integer, IN p_nombrecategoria character varying, IN p_cantidad integer);
       public               postgres    false            =           1255    24926 K   actualizar_nota_salida(integer, date, character varying, character varying) 	   PROCEDURE     l  CREATE PROCEDURE public.actualizar_nota_salida(IN p_cod integer, IN p_fecha date, IN p_origen character varying, IN p_descripcion character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Verificar si existe la nota de salida con el código dado
    IF EXISTS (SELECT 1 FROM NOTA_SALIDA WHERE cod = p_cod) THEN
        -- Actualizar la nota de salida
        UPDATE NOTA_SALIDA
        SET fecha = p_fecha,
            origen = p_origen,
            descripcion = p_descripcion
        WHERE cod = p_cod;
    ELSE
        RAISE EXCEPTION 'Nota de salida con el código % no encontrada', p_cod;
    END IF;
END;
$$;
 �   DROP PROCEDURE public.actualizar_nota_salida(IN p_cod integer, IN p_fecha date, IN p_origen character varying, IN p_descripcion character varying);
       public               postgres    false                       1255    16393    actualizar_notas_salida()    FUNCTION     �  CREATE FUNCTION public.actualizar_notas_salida() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_origen_anterior VARCHAR(255);
    v_origen_actual VARCHAR(255);
    v_codProducto INT;
    detalle RECORD;
BEGIN
    -- Obtener el origen anterior y el origen actual de la nota de salida
    v_origen_anterior := OLD.origen;
    v_origen_actual := NEW.origen;

    -- Si el origen anterior es diferente al origen actual
    IF v_origen_anterior != v_origen_actual THEN
        FOR detalle IN
            SELECT codproducto, cantidad
            FROM DETALLE_NOTA_SALIDA
            WHERE codSalida = OLD.cod
        LOOP
            v_codProducto := detalle.codproducto;

            IF v_origen_anterior = 'almacen' THEN
                -- Devolver la cantidad del producto al almacén e inventario
                UPDATE ALMACEN
                SET capacidad_actual = capacidad_actual + detalle.cantidad
                WHERE id = (SELECT codalmacen FROM INVENTARIO WHERE codprod = v_codProducto LIMIT 1);

                UPDATE INVENTARIO
                SET cantenstockenalmacen = cantenstockenalmacen + detalle.cantidad
                WHERE codprod = v_codProducto;
            ELSE
                -- Devolver la cantidad del producto al stock del producto
                UPDATE PRODUCTO
                SET stock = stock + detalle.cantidad
                WHERE codigo = v_codProducto;
            END IF;

            -- Sacar la cantidad del producto del nuevo origen
            IF v_origen_actual = 'almacen' THEN
                -- Reducir la cantidad del producto del almacén e inventario
                UPDATE ALMACEN
                SET capacidad_actual = capacidad_actual - detalle.cantidad
                WHERE id = (SELECT codalmacen FROM INVENTARIO WHERE codprod = v_codProducto LIMIT 1);

                UPDATE INVENTARIO
                SET cantenstockenalmacen = cantenstockenalmacen - detalle.cantidad
                WHERE codprod = v_codProducto;
            ELSE
                -- Reducir la cantidad del producto del stock del producto
                UPDATE PRODUCTO
                SET stock = stock - detalle.cantidad
                WHERE codigo = v_codProducto;
            END IF;
        END LOOP;
    END IF;

    RETURN NEW;
END;
$$;
 0   DROP FUNCTION public.actualizar_notas_salida();
       public               postgres    false                       1255    16394 e   actualizar_permiso(character varying, boolean, boolean, boolean, boolean, boolean, character varying) 	   PROCEDURE     <  CREATE PROCEDURE public.actualizar_permiso(IN p_username character varying, IN p_habilitado boolean, IN p_ver boolean, IN p_insertar boolean, IN p_editar boolean, IN p_eliminar boolean, IN p_vista character varying)
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_cod_usuario INT;
BEGIN
    -- Obtener el código del usuario a partir del nombre de usuario
    SELECT id INTO v_cod_usuario
    FROM USUARIO
    WHERE username = p_username;
    
    -- Verificar si se encontró el usuario
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Usuario % no encontrado', p_username;
    END IF;

    -- Actualizar el permiso si la vista existe para el usuario
    UPDATE PERMISOS
    SET habilitado = p_habilitado,
        ver = p_ver,
        insertar = p_insertar,
        editar = p_editar,
        eliminar = p_eliminar
    WHERE codUser = v_cod_usuario
      AND vista = p_vista;
    
    -- Verificar si se realizó alguna actualización
    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se encontró ningún permiso para la vista % del usuario %', p_vista, p_username;
    END IF;
END;
$$;
 �   DROP PROCEDURE public.actualizar_permiso(IN p_username character varying, IN p_habilitado boolean, IN p_ver boolean, IN p_insertar boolean, IN p_editar boolean, IN p_eliminar boolean, IN p_vista character varying);
       public               postgres    false                       1255    16395    actualizar_stock()    FUNCTION     [  CREATE FUNCTION public.actualizar_stock() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_origen VARCHAR(255);
    v_codProd INT;
    v_count INT;
    v_currentStock INT;
    v_currentAlmacenStock INT;
BEGIN
    -- Obtener el origen de la nota de salida asociada
    SELECT origen INTO v_origen
    FROM NOTA_SALIDA
    WHERE cod = NEW.codSalida;

    -- Iniciar una transacción
    BEGIN
        IF v_origen = 'almacen' THEN
            -- Obtener el código del producto desde el detalle de nota de salida
            v_codProd := NEW.codproducto;

            -- Verificar si el código del producto existe en el almacén
            SELECT COUNT(*) INTO v_count
            FROM INVENTARIO
            WHERE codprod = v_codProd;

            IF v_count = 0 THEN
                -- Eliminar el detalle y la nota de salida asociada
                DELETE FROM DETALLE_NOTA_SALIDA WHERE codSalida = NEW.codSalida;
                DELETE FROM NOTA_SALIDA WHERE cod = NEW.codSalida;
                RAISE EXCEPTION 'El código de producto no existe en el almacén';
            END IF;

            -- Obtener la cantidad actual en stock del almacén
            SELECT cantenstockenalmacen INTO v_currentAlmacenStock
            FROM INVENTARIO
            WHERE codprod = v_codProd;

            -- Verificar si hay suficiente cantidad en el almacén
            IF v_currentAlmacenStock < NEW.cantidad THEN
                -- Eliminar el detalle y la nota de salida asociada
                DELETE FROM DETALLE_NOTA_SALIDA WHERE codSalida = NEW.codSalida;
                DELETE FROM NOTA_SALIDA WHERE cod = NEW.codSalida;
                RAISE EXCEPTION 'Cantidad insuficiente en el almacén para el producto %', v_codProd;
            END IF;

            -- Decrementar la cantidad actual del almacén
            UPDATE ALMACEN
            SET capacidad_actual = capacidad_actual - NEW.cantidad
            WHERE id = (SELECT codalmacen FROM INVENTARIO WHERE codprod = v_codProd LIMIT 1);

            -- Decrementar la cantidad en stock de la tabla INVENTARIO
            UPDATE INVENTARIO
            SET cantenstockenalmacen = cantenstockenalmacen - NEW.cantidad
            WHERE codprod = v_codProd;

        ELSIF v_origen = 'stock' THEN
            -- Obtener el código del producto desde el detalle de nota de salida
            v_codProd := NEW.codproducto;

            -- Verificar si el código del producto existe en el stock
            SELECT COUNT(*) INTO v_count
            FROM PRODUCTO
            WHERE codigo = v_codProd;

            IF v_count = 0 THEN
                -- Eliminar el detalle y la nota de salida asociada
                DELETE FROM DETALLE_NOTA_SALIDA WHERE codSalida = NEW.codSalida;
                DELETE FROM NOTA_SALIDA WHERE cod = NEW.codSalida;
                RAISE EXCEPTION 'El código de producto no existe en el stock';
            END IF;

            -- Obtener la cantidad actual en stock del producto
            SELECT stock INTO v_currentStock
            FROM PRODUCTO
            WHERE codigo = v_codProd;

            -- Verificar si hay suficiente cantidad en el stock
            IF v_currentStock < NEW.cantidad THEN
                -- Eliminar el detalle y la nota de salida asociada
                DELETE FROM DETALLE_NOTA_SALIDA WHERE codSalida = NEW.codSalida;
                DELETE FROM NOTA_SALIDA WHERE cod = NEW.codSalida;
                RAISE EXCEPTION 'Cantidad insuficiente en el stock para el producto %', v_codProd;
            END IF;

            -- Decrementar el stock del producto en la tabla PRODUCTO
            UPDATE PRODUCTO
            SET stock = stock - NEW.cantidad
            WHERE codigo = v_codProd;
        ELSE
            RAISE EXCEPTION 'Origen de nota de salida no reconocido: %', v_origen;
        END IF;

    EXCEPTION
        WHEN others THEN
            -- En caso de error, eliminar la nota de salida asociada y sus detalles
            DELETE FROM DETALLE_NOTA_SALIDA WHERE codSalida = NEW.codSalida;
            DELETE FROM NOTA_SALIDA WHERE cod = NEW.codSalida;
            RAISE;
    END;
	CALL eliminar_notas_salida_vacias();
    RETURN NEW;
END;
$$;
 )   DROP FUNCTION public.actualizar_stock();
       public               postgres    false                       1255    16396    actualizar_stock_y_capacidad()    FUNCTION     x  CREATE FUNCTION public.actualizar_stock_y_capacidad() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_codalmacen INT;
    v_nombre_categoria TEXT;
BEGIN
    -- Verificar si el producto existe en el inventario
    SELECT codalmacen INTO v_codalmacen
    FROM inventario
    WHERE codprod = NEW.codigoproducto;

    -- Si no se encuentra el producto en el inventario
    IF v_codalmacen IS NULL THEN
        -- Obtener el nombre de la categoría del producto
        SELECT c.descripcion INTO v_nombre_categoria
        FROM producto p
        JOIN categoria c ON p.idcategoria = c.id
        WHERE p.codigo = NEW.codigoproducto;

        -- Generar un error con el nombre de la categoría
        IF v_nombre_categoria IS NULL THEN
            RAISE EXCEPTION 'Categoría no encontrada para el producto con código: %', NEW.codigoproducto;
        ELSE
            RAISE EXCEPTION 'No existe inventario del producto en la categoría: %', v_nombre_categoria;
        END IF;
    END IF;

    -- Actualizar el stock en el inventario
    UPDATE inventario
    SET cantenstockenalmacen = cantenstockenalmacen + NEW.cantidad,
        fechaultimo = CURRENT_DATE
    WHERE codprod = NEW.codigoproducto;

    -- Actualizar la capacidad actual en la tabla Almacen
    UPDATE almacen
    SET capacidad_actual = capacidad_actual + NEW.cantidad
    WHERE id = v_codalmacen;

    RETURN NEW;
END;
$$;
 5   DROP FUNCTION public.actualizar_stock_y_capacidad();
       public               postgres    false                       1255    16397 *   actualizar_stock_y_capacidad_al_eliminar()    FUNCTION     �  CREATE FUNCTION public.actualizar_stock_y_capacidad_al_eliminar() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_codalmacen INT;
BEGIN
    -- Obtener el código del almacén del inventario
    SELECT codalmacen INTO v_codalmacen
    FROM inventario
    WHERE codprod = OLD.codigoproducto;

    -- Verificar si se encontró el producto en el inventario
    IF v_codalmacen IS NULL THEN
        RAISE EXCEPTION 'No se encontró inventario para el producto con código: %', OLD.codigoproducto;
    END IF;

    -- Actualizar el stock en el inventario
    UPDATE inventario
    SET cantenstockenalmacen = cantenstockenalmacen - OLD.cantidad,
        fechaultimo = CURRENT_DATE
    WHERE codprod = OLD.codigoproducto;

    -- Actualizar la capacidad actual en la tabla Almacen
    UPDATE almacen
    SET capacidad_actual = capacidad_actual - OLD.cantidad
    WHERE id = v_codalmacen;

    RETURN OLD;
END;
$$;
 A   DROP FUNCTION public.actualizar_stock_y_capacidad_al_eliminar();
       public               postgres    false                       1255    16398    actualizar_total_boleta()    FUNCTION       CREATE FUNCTION public.actualizar_total_boleta() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_total DECIMAL(10,2);
BEGIN
    -- Calcular la suma de los precios multiplicados por las cantidades
    SELECT SUM(cantidad * precio)
    INTO v_total
    FROM detalle_de_compra
    WHERE codboletacompra = NEW.codboletacompra;
    
    -- Actualizar el total en la boleta de compra
    UPDATE boleta_de_compra
    SET total = v_total
    WHERE codigo = NEW.codboletacompra;
    
    RETURN NEW;
END;
$$;
 0   DROP FUNCTION public.actualizar_total_boleta();
       public               postgres    false                       1255    16399    calcular_stock_actualizado()    FUNCTION     z	  CREATE FUNCTION public.calcular_stock_actualizado() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_cantidad_anterior INT;
    v_cantidad_nueva INT;
    v_origen VARCHAR(255);
    v_count INT;
    v_stock_actual INT;
BEGIN
    -- Obtener la cantidad anterior y nueva del detalle de nota de salida
    v_cantidad_anterior := OLD.cantidad;
    v_cantidad_nueva := NEW.cantidad;

    -- Obtener el origen de la nota de salida asociada al detalle
    SELECT origen INTO v_origen
    FROM NOTA_SALIDA
    WHERE cod = OLD.codSalida;

    -- Obtener el stock actual del producto desde el origen
    IF v_origen = 'almacen' THEN
        SELECT cantenstockenalmacen INTO v_stock_actual
        FROM INVENTARIO
        WHERE codprod = OLD.codproducto;
    ELSIF v_origen = 'stock' THEN
        SELECT stock INTO v_stock_actual
        FROM PRODUCTO
        WHERE codigo = OLD.codproducto;
    ELSE
        RAISE EXCEPTION 'Origen de nota de salida no reconocido: %', v_origen;
    END IF;

    -- Verificar si hay suficiente cantidad para realizar la actualización
    IF v_stock_actual < v_cantidad_nueva THEN
        RAISE EXCEPTION 'Cantidad insuficiente en el origen (%s) para el producto (cod: %s)', v_origen, OLD.codproducto;
    END IF;

    -- Iniciar una transacción para asegurar la integridad de los datos
    BEGIN
        -- Realizar los ajustes necesarios según el origen
        IF v_origen = 'almacen' THEN
            -- Ajustar la capacidad actual y el inventario del almacén
            UPDATE ALMACEN
            SET capacidad_actual = capacidad_actual - (v_cantidad_nueva - v_cantidad_anterior)
            WHERE id = (SELECT codalmacen FROM INVENTARIO WHERE codprod = OLD.codproducto LIMIT 1);

            UPDATE INVENTARIO
            SET cantenstockenalmacen = cantenstockenalmacen - (v_cantidad_nueva - v_cantidad_anterior)
            WHERE codprod = OLD.codproducto;
        ELSIF v_origen = 'stock' THEN
            -- Ajustar el stock del producto
            UPDATE PRODUCTO
            SET stock = stock - (v_cantidad_nueva - v_cantidad_anterior)
            WHERE codigo = OLD.codproducto;
        END IF;
        
        -- Confirmar la transacción si todo fue exitoso
        COMMIT;
    EXCEPTION
        WHEN others THEN
            -- En caso de error, revertir la transacción y levantar la excepción
            ROLLBACK;
            RAISE;
    END;

    RETURN NEW;
END;
$$;
 3   DROP FUNCTION public.calcular_stock_actualizado();
       public               postgres    false                       1255    16400    calcular_total_factura()    FUNCTION     �  CREATE FUNCTION public.calcular_total_factura() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Verifica si ya existe un registro para esta factura en MONTO_TOTAL_FACTURA
    -- Si existe, actualiza el total, si no, lo inserta
    IF EXISTS (SELECT 1 FROM MONTO_TOTAL_FACTURA WHERE codigo = NEW.CODFACT) THEN
        UPDATE MONTO_TOTAL_FACTURA
        SET montototal = (SELECT SUM(cantidad * precio) 
                          FROM DETALLE_DE_FACTURA 
                          WHERE CODFACT = NEW.CODFACT)
        WHERE codigo = NEW.CODFACT;
    ELSE
        INSERT INTO MONTO_TOTAL_FACTURA (codigo, montototal)
        VALUES (NEW.CODFACT, (SELECT SUM(cantidad * precio) 
                              FROM DETALLE_DE_FACTURA 
                              WHERE CODFACT = NEW.CODFACT));
    END IF;

    -- Si la actualización o inserción se realiza correctamente, retorna NULL para permitir que la operación continúe
    RETURN NULL;
EXCEPTION
    -- Si hay algún error, se atrapa la excepción y se imprime el mensaje de error
    WHEN others THEN
        RAISE EXCEPTION 'Error al calcular el total de la factura: %', SQLERRM;
END;
$$;
 /   DROP FUNCTION public.calcular_total_factura();
       public               postgres    false            -           1255    16729 U   crear_producto(character varying, character varying, integer, numeric, numeric, date) 	   PROCEDURE     g  CREATE PROCEDURE public.crear_producto(IN p_nombre_marca character varying, IN p_nombre_categoria character varying, IN p_stock integer, IN p_precio_compra numeric, IN p_precio_venta numeric, IN p_fecha_vencimiento date)
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_cod_marca INT;
    v_cod_categoria INT;
    v_cod_producto INT; -- Variable para almacenar el código del producto generado automáticamente
    v_cod_precio_venta INT; -- Variable para almacenar el código del precio de venta generado automáticamente
BEGIN
    -- Buscar el código de la marca
    SELECT codigo INTO v_cod_marca FROM MARCA WHERE nombre = p_nombre_marca;

    -- Buscar el código de la categoría
    SELECT id INTO v_cod_categoria FROM CATEGORIA WHERE descripcion = p_nombre_categoria;

    -- Obtener el próximo valor de la secuencia para el código del producto
    SELECT nextval('producto_codigo_seq') INTO v_cod_producto;

    -- Insertar el nuevo producto
    INSERT INTO PRODUCTO (codigo, codmarca, idcategoria, precioCompra, stock, fecha_Vencimiento)
    VALUES (v_cod_producto, v_cod_marca, v_cod_categoria, p_precio_compra, p_stock, p_fecha_vencimiento);

    -- Obtener el próximo valor de la secuencia para el código del precio de venta
    SELECT nextval('precioVenta_codigo_seq') INTO v_cod_precio_venta;

    -- Insertar el precio de venta en la tabla PRECIO_VENTA
    INSERT INTO PRECIO_VENTA (codigo, precioVenta)
    VALUES (v_cod_precio_venta, p_precio_venta);

    -- Actualizar el código de precio de venta en la tabla PRODUCTO
    UPDATE PRODUCTO SET codPrecioVenta = v_cod_precio_venta WHERE codigo = v_cod_producto;
END;
$$;
 �   DROP PROCEDURE public.crear_producto(IN p_nombre_marca character varying, IN p_nombre_categoria character varying, IN p_stock integer, IN p_precio_compra numeric, IN p_precio_venta numeric, IN p_fecha_vencimiento date);
       public               postgres    false            .           1255    16730 Y   crear_producto_sin_fecha(character varying, character varying, integer, numeric, numeric) 	   PROCEDURE     E  CREATE PROCEDURE public.crear_producto_sin_fecha(IN p_nombre_marca character varying, IN p_nombre_categoria character varying, IN p_stock integer, IN p_precio_compra numeric, IN p_precio_venta numeric)
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_cod_marca INT;
    v_cod_categoria INT;
    v_cod_producto INT; -- Variable para almacenar el código del producto generado automáticamente
    v_cod_precio_venta INT; -- Variable para almacenar el código del precio de venta generado automáticamente
BEGIN
    -- Buscar el código de la marca
    SELECT codigo INTO v_cod_marca FROM MARCA WHERE nombre = p_nombre_marca;

    -- Buscar el código de la categoría
    SELECT id INTO v_cod_categoria FROM CATEGORIA WHERE descripcion = p_nombre_categoria;

    -- Obtener el próximo valor de la secuencia para el código del producto
    SELECT nextval('producto_codigo_seq') INTO v_cod_producto;

    -- Insertar el nuevo producto
    INSERT INTO PRODUCTO (codigo, codmarca, idcategoria, precioCompra, stock, fecha_Vencimiento)
    VALUES (v_cod_producto, v_cod_marca, v_cod_categoria, p_precio_compra, p_stock, null);

    -- Obtener el próximo valor de la secuencia para el código del precio de venta
    SELECT nextval('precioVenta_codigo_seq') INTO v_cod_precio_venta;

    -- Insertar el precio de venta en la tabla PRECIO_VENTA
    INSERT INTO PRECIO_VENTA (codigo, precioVenta)
    VALUES (v_cod_precio_venta, p_precio_venta);

    -- Actualizar el código de precio de venta en la tabla PRODUCTO
    UPDATE PRODUCTO SET codPrecioVenta = v_cod_precio_venta WHERE codigo = v_cod_producto;
END;
$$;
 �   DROP PROCEDURE public.crear_producto_sin_fecha(IN p_nombre_marca character varying, IN p_nombre_categoria character varying, IN p_stock integer, IN p_precio_compra numeric, IN p_precio_venta numeric);
       public               postgres    false                       1255    16403 l   crear_usuario(character varying, character varying, character varying, character varying, character varying) 	   PROCEDURE     �  CREATE PROCEDURE public.crear_usuario(IN p_nombre_administrador character varying, IN p_telefono character varying, IN p_correo_electronico character varying, IN p_username character varying, IN p_password character varying)
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_cod_administrador INT;
BEGIN
    -- Insertar nuevo administrador
    INSERT INTO ADMINISTRADOR (nombre, telefono, email) 
    VALUES (p_nombre_administrador, p_telefono, p_correo_electronico)
    RETURNING cod INTO v_cod_administrador;

    -- Insertar nuevo usuario sin asignar permisos
    INSERT INTO USUARIO (username, codadm, password) 
    VALUES (p_username, v_cod_administrador, p_password);
END;
$$;
 �   DROP PROCEDURE public.crear_usuario(IN p_nombre_administrador character varying, IN p_telefono character varying, IN p_correo_electronico character varying, IN p_username character varying, IN p_password character varying);
       public               postgres    false                       1255    16404 w   crear_usuario(character varying, character varying, character varying, character varying, character varying, character) 	   PROCEDURE     b  CREATE PROCEDURE public.crear_usuario(IN p_nombre_administrador character varying, IN p_telefono character varying, IN p_correo_electronico character varying, IN p_username character varying, IN p_password character varying, IN p_tipo_permiso character)
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_cod_administrador INT;
    v_cod_permiso INT;
BEGIN
    -- Insertar nuevo administrador
    INSERT INTO ADMINISTRADOR (nombre, telefono, email) 
    VALUES (p_nombre_administrador, p_telefono, p_correo_electronico)
    RETURNING cod INTO v_cod_administrador;

    -- Obtener código de permiso según el tipo
    SELECT cod INTO v_cod_permiso FROM PERMISOS WHERE categoria = p_tipo_permiso;

    -- Insertar nuevo usuario
    INSERT INTO USUARIO (username, codadm, codperm, password) 
    VALUES (p_username, v_cod_administrador, v_cod_permiso, p_password);
END;
$$;
 �   DROP PROCEDURE public.crear_usuario(IN p_nombre_administrador character varying, IN p_telefono character varying, IN p_correo_electronico character varying, IN p_username character varying, IN p_password character varying, IN p_tipo_permiso character);
       public               postgres    false                       1255    16405    devolver_stock()    FUNCTION     �   CREATE FUNCTION public.devolver_stock() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Actualizar el stock del producto
    UPDATE PRODUCTO 
    SET stock = stock + OLD.cantidad 
    WHERE codigo = OLD.CODPROD;
    
    RETURN OLD;
END;
$$;
 '   DROP FUNCTION public.devolver_stock();
       public               postgres    false                       1255    16406    devolver_stockap()    FUNCTION     o  CREATE FUNCTION public.devolver_stockap() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_origen VARCHAR(255);
    v_codAlmacen INT;
    v_codProd INT;
BEGIN
    -- Obtener el origen de la nota de salida asociada
    SELECT origen INTO v_origen
    FROM NOTA_SALIDA
    WHERE cod = OLD.codSalida;

    IF v_origen = 'almacen' THEN
        -- Obtener el código del producto desde el detalle de nota de salida
        v_codProd := OLD.codproducto;

        -- Incrementar la cantidad actual del almacén
        UPDATE ALMACEN
        SET capacidad_actual = capacidad_actual + OLD.cantidad
        WHERE id = (SELECT codalmacen FROM INVENTARIO WHERE codprod = v_codProd LIMIT 1);

        -- Incrementar la cantidad en stock de la tabla INVENTARIO
        UPDATE INVENTARIO
        SET cantenstockenalmacen = cantenstockenalmacen + OLD.cantidad
        WHERE codprod = v_codProd;
    ELSIF v_origen = 'stock' THEN
        -- Incrementar el stock del producto en la tabla PRODUCTO
        UPDATE PRODUCTO
        SET stock = stock + OLD.cantidad
        WHERE codigo = OLD.codproducto;
    END IF;

    RETURN OLD;
END;
$$;
 )   DROP FUNCTION public.devolver_stockap();
       public               postgres    false                        1255    16407    eliminar_boleta_compra(integer) 	   PROCEDURE     d  CREATE PROCEDURE public.eliminar_boleta_compra(IN p_codigo integer)
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Eliminar los detalles de compra asociados a la boleta de compra
    DELETE FROM DETALLE_DE_COMPRA
    WHERE codboletacompra = p_codigo;

    -- Eliminar la boleta de compra
    DELETE FROM BOLETA_DE_COMPRA
    WHERE codigo = p_codigo;
END;
$$;
 C   DROP PROCEDURE public.eliminar_boleta_compra(IN p_codigo integer);
       public               postgres    false            B           1255    24931 %   eliminar_detalle_nota_salida(integer) 	   PROCEDURE     N  CREATE PROCEDURE public.eliminar_detalle_nota_salida(IN p_coddetalle integer)
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_codSalida INT;
    v_codProducto INT;
    v_cantidad INT;
    v_origen VARCHAR(255);
BEGIN
    -- Eliminar el detalle de nota de salida
    DELETE FROM DETALLE_NOTA_SALIDA
    WHERE cod = p_codDetalle;
END;
$$;
 M   DROP PROCEDURE public.eliminar_detalle_nota_salida(IN p_coddetalle integer);
       public               postgres    false            <           1255    24924    eliminar_factura(integer) 	   PROCEDURE     *  CREATE PROCEDURE public.eliminar_factura(IN p_codigo_factura integer)
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_total_factura_id INT;
    v_cliente_id INT;
    v_detalle_count INT;
BEGIN
    -- Obtener el ID de la tupla de monto_total_factura asociada a la factura
    SELECT codigo INTO v_total_factura_id
    FROM MONTO_TOTAL_FACTURA
    WHERE codigo = p_codigo_factura;

    -- Obtener el ID del cliente asociado a la factura
    SELECT cicliente INTO v_cliente_id
    FROM FACTURA
    WHERE codigo = p_codigo_factura;

    -- Contar el número de detalles de factura asociados
    SELECT COUNT(*) INTO v_detalle_count
    FROM DETALLE_DE_FACTURA
    WHERE CODFACT = p_codigo_factura;

    -- Eliminar los descuentos asociados a la factura
    DELETE FROM DESCUENTO WHERE codigodesc = p_codigo_factura;

    -- Eliminar la tupla de monto_total_factura si existe
    IF v_total_factura_id IS NOT NULL THEN
        DELETE FROM MONTO_TOTAL_FACTURA WHERE codigo = v_total_factura_id;
    END IF;

    -- Verificar si la factura tiene detalles asociados antes de eliminar
    IF v_detalle_count > 0 THEN
        -- Eliminar el detalle de la factura
        DELETE FROM DETALLE_DE_FACTURA WHERE CODFACT = p_codigo_factura;
    END IF;

    -- Eliminar la factura
    DELETE FROM FACTURA WHERE codigo = p_codigo_factura;

    -- Eliminar el cliente solo si no tiene más facturas asociadas
    IF NOT EXISTS (SELECT 1 FROM FACTURA WHERE cicliente = v_cliente_id) THEN
        DELETE FROM CLIENTE WHERE ci = v_cliente_id;
    END IF;

    -- Ajustar la secuencia de la factura
    PERFORM setval('factura_codigo_seq', COALESCE((SELECT MAX(codigo) FROM FACTURA), 1));

    -- Ajustar la secuencia del detalle de factura
    PERFORM setval('detallefactura_codigo_seq', COALESCE((SELECT MAX(codigo) FROM DETALLE_DE_FACTURA), 1));
END;
$$;
 E   DROP PROCEDURE public.eliminar_factura(IN p_codigo_factura integer);
       public               postgres    false            7           1255    16739    eliminar_inventario(integer) 	   PROCEDURE       CREATE PROCEDURE public.eliminar_inventario(IN codigo_inventario integer)
    LANGUAGE plpgsql
    AS $$
BEGIN
    DELETE FROM INVENTARIO WHERE numero = codigo_inventario;
    PERFORM setval('inventario_codigo_seq', (SELECT MAX(numero) FROM INVENTARIO));
END;
$$;
 I   DROP PROCEDURE public.eliminar_inventario(IN codigo_inventario integer);
       public               postgres    false            ?           1255    24928    eliminar_nota_salida(integer) 	   PROCEDURE     �  CREATE PROCEDURE public.eliminar_nota_salida(IN p_codsalida integer)
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Eliminar los detalles de la nota de salida asociados al código de nota de salida
    DELETE FROM DETALLE_NOTA_SALIDA
    WHERE codSalida = p_codSalida;

    -- Eliminar la nota de salida
    DELETE FROM NOTA_SALIDA
    WHERE cod = p_codSalida;

    -- Ajustar la secuencia de los códigos de nota de salida
    PERFORM setval('salida_codigo_seq', COALESCE((SELECT MAX(cod) FROM NOTA_SALIDA), 1000));

    -- Ajustar la secuencia de los códigos de detalle de nota de salida
    PERFORM setval('DetalleSalida_codigo_seq', COALESCE((SELECT MAX(cod) FROM DETALLE_NOTA_SALIDA), 1000));
END;
$$;
 D   DROP PROCEDURE public.eliminar_nota_salida(IN p_codsalida integer);
       public               postgres    false                       1255    16412 $   eliminar_notas_salida_sin_detalles()    FUNCTION     �  CREATE FUNCTION public.eliminar_notas_salida_sin_detalles() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_num_detalles INT;
BEGIN
    -- Contar la cantidad de detalles asociados a la nota de salida
    SELECT COUNT(*) INTO v_num_detalles
    FROM DETALLE_NOTA_SALIDA
    WHERE codSalida = OLD.cod;

    -- Si no hay detalles asociados, eliminar la nota de salida
    IF v_num_detalles = 0 THEN
        DELETE FROM NOTA_SALIDA WHERE cod = OLD.cod;
    END IF;

    RETURN NULL;
END;
$$;
 ;   DROP FUNCTION public.eliminar_notas_salida_sin_detalles();
       public               postgres    false            C           1255    24932    eliminar_notas_salida_vacias() 	   PROCEDURE     �  CREATE PROCEDURE public.eliminar_notas_salida_vacias()
    LANGUAGE plpgsql
    AS $$
DECLARE
    max_cod INT;
BEGIN
    -- Eliminar las notas de salida que no tienen detalles asociados
    DELETE FROM NOTA_SALIDA
    WHERE NOT EXISTS (
        SELECT 1
        FROM DETALLE_NOTA_SALIDA
        WHERE DETALLE_NOTA_SALIDA.codSalida = NOTA_SALIDA.cod
    );

    PERFORM setval('salida_codigo_seq', COALESCE((SELECT MAX(cod) FROM NOTA_SALIDA), 1000));
END;
$$;
 6   DROP PROCEDURE public.eliminar_notas_salida_vacias();
       public               postgres    false            :           1255    24922    getfactura(integer)    FUNCTION     �  CREATE FUNCTION public.getfactura(codigo_factura_param integer) RETURNS TABLE(codigo_factura integer, nombre_cliente character varying, fecha date, nombre_usuario character varying, metodo_pago_nombre character varying, total numeric, monto_descuento numeric)
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_codigo_factura INT;
    v_nombre_cliente VARCHAR(255);
    v_fecha DATE;
    v_nombre_usuario VARCHAR(255);
    v_metodo_pago_nombre VARCHAR(255);
    v_total DECIMAL(10,2);
    v_monto_descuento DECIMAL(10,2);
BEGIN
    -- Obtener datos principales de la factura
    SELECT
        f.codigo, c.nombre, f.fecha, a.nombre, tp.nombre, mt.montototal
    INTO
        v_codigo_factura, v_nombre_cliente, v_fecha, v_nombre_usuario, v_metodo_pago_nombre, v_total
    FROM
        factura f, cliente c, administrador a, usuario u, tipo_de_pago tp, monto_total_factura mt
    WHERE
        f.codigo = codigo_factura_param
        AND f.cicliente = c.ci
        AND f.codAdmin = a.cod
        AND a.cod = u.codadm
        AND f.codtpago = tp.cod
        AND f.codigo = mt.codigo;

    -- Obtener monto de descuento si existe
    SELECT
        COALESCE(d.montodescuento, 0.00)
    INTO
        v_monto_descuento
    FROM
        descuento d
    WHERE
        d.codigodesc = codigo_factura_param;

    -- Devolver resultados
    RETURN QUERY
    SELECT
        v_codigo_factura, v_nombre_cliente, v_fecha, v_nombre_usuario, v_metodo_pago_nombre, v_total, v_monto_descuento;
END;
$$;
 ?   DROP FUNCTION public.getfactura(codigo_factura_param integer);
       public               postgres    false            3           1255    16735 ]   insertar_bitacora(character varying, character varying, character varying, character varying) 	   PROCEDURE     +  CREATE PROCEDURE public.insertar_bitacora(IN p_username character varying, IN p_ip character varying, IN p_fechahora character varying, IN p_descripcion character varying)
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_userid INT;
BEGIN
    -- Obtener el ID del usuario basado en el nombre de usuario proporcionado
    SELECT id INTO v_userid FROM USUARIO WHERE username = p_username;

    -- Insertar datos en la tabla BITACORA
    INSERT INTO BITACORA (IDUser, IP, FechaHora, descripcion)
    VALUES (v_userid, p_ip, p_fechaHora, p_descripcion);
END;
$$;
 �   DROP PROCEDURE public.insertar_bitacora(IN p_username character varying, IN p_ip character varying, IN p_fechahora character varying, IN p_descripcion character varying);
       public               postgres    false                       1255    16416 h   insertar_boleta_compra(character varying, character varying, character varying, text, character varying)    FUNCTION     �  CREATE FUNCTION public.insertar_boleta_compra(p_nombre_proveedor character varying, p_nombre_usuario character varying, p_metodo_pago_nombre character varying, p_descripcion text, p_fecha character varying) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_codproveedor INT;
    v_coduser INT;
    v_codadm INT;
    v_codpago INT;
    codboleta INT;
BEGIN
    -- Buscar el código del proveedor por nombre
    SELECT codigo INTO v_codproveedor
    FROM PROVEEDORES
    WHERE nombre = p_nombre_proveedor;
    
    -- Verificar si se encontró el proveedor
    IF v_codproveedor IS NULL THEN
        RAISE EXCEPTION 'Proveedor no encontrado: %', p_nombre_proveedor;
    END IF;
    
    -- Buscar el código del usuario por nombre
    SELECT id INTO v_coduser
    FROM USUARIO
    WHERE username = p_nombre_usuario;
    
    -- Verificar si se encontró el usuario
    IF v_coduser IS NULL THEN
        RAISE EXCEPTION 'Usuario no encontrado: %', p_nombre_usuario;
    END IF;
    
    -- Buscar el código del administrador por código de usuario
    SELECT codadm INTO v_codadm
    FROM USUARIO
    WHERE id = v_coduser;
    
    -- Verificar si se encontró el administrador
    IF v_codadm IS NULL THEN
        RAISE EXCEPTION 'Administrador no encontrado para el usuario: %', p_nombre_usuario;
    END IF;
    
    -- Buscar el código del método de pago por nombre
    SELECT cod INTO v_codpago
    FROM TIPO_DE_PAGO
    WHERE nombre = p_metodo_pago_nombre;
    
    -- Verificar si se encontró el método de pago
    IF v_codpago IS NULL THEN
        RAISE EXCEPTION 'Método de pago no encontrado: %', p_metodo_pago_nombre;
    END IF;
    
    -- Insertar la boleta de compra
    INSERT INTO BOLETA_DE_COMPRA (codproveedor, codAdm, codPago, descripcion, fecha)
    VALUES (v_codproveedor, v_codadm, v_codpago, p_descripcion, p_fecha)
    RETURNING codigo INTO codboleta;
    
    -- Devolver el código de la boleta de compra recién creada
    RETURN codboleta;
END;
$$;
 �   DROP FUNCTION public.insertar_boleta_compra(p_nombre_proveedor character varying, p_nombre_usuario character varying, p_metodo_pago_nombre character varying, p_descripcion text, p_fecha character varying);
       public               postgres    false            8           1255    16417 E   insertar_detalle_compra(integer, character varying, integer, numeric) 	   PROCEDURE       CREATE PROCEDURE public.insertar_detalle_compra(IN p_codigo_boleta integer, IN p_categoria_producto_nombre character varying, IN p_cantidad integer, IN p_precio numeric)
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_id_categoria INT;
    v_codigo_producto INT;
    v_precio_compra_actual DECIMAL(10,2);
BEGIN
    -- Obtener el código de la categoría por nombre
    SELECT id INTO v_id_categoria
    FROM CATEGORIA
    WHERE descripcion = p_categoria_producto_nombre;
    
    -- Verificar si se encontró la categoría
    IF v_id_categoria IS NULL THEN
        RAISE EXCEPTION 'Categoría no encontrada: %', p_categoria_producto_nombre;
    END IF;
    
    -- Obtener el código del producto por código de categoría
    SELECT codigo, precioCompra INTO v_codigo_producto, v_precio_compra_actual
    FROM PRODUCTO
    WHERE idcategoria = v_id_categoria
    LIMIT 1; -- Suponiendo que tomamos el primer producto encontrado
    
    -- Verificar si se encontró el producto
    IF v_codigo_producto IS NULL THEN
        RAISE EXCEPTION 'Producto no encontrado para la categoría: %', p_categoria_producto_nombre;
    END IF;
    
    -- Actualizar el precio de compra si es diferente
    IF v_precio_compra_actual <> p_precio THEN
        UPDATE PRODUCTO
        SET precioCompra = p_precio
        WHERE codigo = v_codigo_producto;
    END IF;
    
    -- Insertar el detalle de compra
    INSERT INTO DETALLE_DE_COMPRA (codboletacompra, codigoproducto, cantidad, precio)
    VALUES (p_codigo_boleta, v_codigo_producto, p_cantidad, p_precio);
END;
$$;
 �   DROP PROCEDURE public.insertar_detalle_compra(IN p_codigo_boleta integer, IN p_categoria_producto_nombre character varying, IN p_cantidad integer, IN p_precio numeric);
       public               postgres    false            >           1255    24927 <   insertar_detalle_salida(integer, character varying, integer) 	   PROCEDURE     �  CREATE PROCEDURE public.insertar_detalle_salida(IN p_codsalida integer, IN p_nombrecategoria character varying, IN p_cantidad integer)
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_idCategoria INT;
    v_codigoProducto INT;
BEGIN
    -- Obtener el ID de la categoría basada en el nombre de la categoría
    SELECT id INTO v_idCategoria
    FROM CATEGORIA
    WHERE descripcion = p_nombreCategoria;

    -- Validar si la categoría existe
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Categoría no encontrada';
    END IF;

    -- Obtener el código del producto basado en la categoría
    SELECT codigo INTO v_codigoProducto
    FROM PRODUCTO
    WHERE idcategoria = v_idCategoria
    LIMIT 1;

    -- Validar si el producto existe
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Producto no encontrado en la categoría';
    END IF;

    -- Verificar si ya existe un detalle con el mismo producto y código de salida
    IF EXISTS (SELECT 1 FROM DETALLE_NOTA_SALIDA WHERE codSalida = p_codSalida AND codproducto = v_codigoProducto) THEN
        -- Actualizar la cantidad del detalle existente
        UPDATE DETALLE_NOTA_SALIDA
        SET cantidad = cantidad + p_cantidad
        WHERE codSalida = p_codSalida AND codproducto = v_codigoProducto;
    ELSE
        -- Insertar el detalle de salida
        INSERT INTO DETALLE_NOTA_SALIDA(codSalida, codproducto, cantidad)
        VALUES (p_codSalida, v_codigoProducto, p_cantidad);
    END IF;
END;
$$;
 �   DROP PROCEDURE public.insertar_detalle_salida(IN p_codsalida integer, IN p_nombrecategoria character varying, IN p_cantidad integer);
       public               postgres    false                        1255    16419 >   insertar_detalles_factura(integer, character varying, integer) 	   PROCEDURE     !  CREATE PROCEDURE public.insertar_detalles_factura(IN codigo_factura integer, IN categoria_producto_nombre character varying, IN cantidad_producto integer)
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_cod_categoria_producto INT;
    v_cod_producto INT;
    v_precio_venta DECIMAL(10, 2);
BEGIN
    -- Obtener código de categoría de producto
    SELECT id INTO v_cod_categoria_producto
    FROM categoria
    WHERE descripcion = categoria_producto_nombre;

    -- Obtener código del producto y su precio de venta
    SELECT p.codigo, pv.precioVenta INTO v_cod_producto, v_precio_venta
    FROM producto p
    JOIN precio_venta pv ON p.codPrecioVenta = pv.codigo
    WHERE p.idcategoria = v_cod_categoria_producto
    LIMIT 1;

    -- Insertar detalle de factura
    INSERT INTO detalle_de_factura (CODPROD, CODFACT, cantidad, precio)
    VALUES (v_cod_producto, codigo_factura, cantidad_producto, v_precio_venta);

    -- Disminuir cantidad de stock
    UPDATE producto
    SET stock = stock - cantidad_producto
    WHERE codigo = v_cod_producto;
END;
$$;
 �   DROP PROCEDURE public.insertar_detalles_factura(IN codigo_factura integer, IN categoria_producto_nombre character varying, IN cantidad_producto integer);
       public               postgres    false                       1255    16420 x   insertar_factura(integer, character varying, character varying, character varying, character varying, character varying)    FUNCTION     E  CREATE FUNCTION public.insertar_factura(ci_cliente integer, nombre_cliente character varying, correo_cliente character varying, telefono_cliente character varying, nombre_usuario character varying, metodo_pago_nombre character varying) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_cod_administrador INT;
    v_cod_metodo_pago INT;
    v_cod_factura INT;
BEGIN
    -- Obtener código de administrador
    SELECT cod INTO v_cod_administrador
    FROM administrador
    WHERE cod = (SELECT codadm FROM usuario WHERE username = nombre_usuario);

    -- Obtener código de método de pago
    SELECT cod INTO v_cod_metodo_pago
    FROM tipo_de_pago
    WHERE nombre = metodo_pago_nombre;

    BEGIN
        -- Intentar insertar el cliente, si no existe
        INSERT INTO CLIENTE (ci, nombre, correo, telefono)
        VALUES (ci_cliente, nombre_cliente, correo_cliente, telefono_cliente);
    EXCEPTION
        WHEN unique_violation THEN
            -- Si el cliente ya existe, no se hace nada
            NULL;
    END;

    -- Insertar factura y obtener su código
    INSERT INTO factura (codAdmin, cicliente, codtpago, fecha)
    VALUES (v_cod_administrador, ci_cliente, v_cod_metodo_pago, CURRENT_DATE)
    RETURNING codigo INTO v_cod_factura;

    -- Devolver el código de la factura insertada
    RETURN v_cod_factura;
END;
$$;
 �   DROP FUNCTION public.insertar_factura(ci_cliente integer, nombre_cliente character varying, correo_cliente character varying, telefono_cliente character varying, nombre_usuario character varying, metodo_pago_nombre character varying);
       public               postgres    false                       1255    16421 �   insertar_factura(integer, character varying, character varying, character varying, character varying, character varying, numeric)    FUNCTION     �  CREATE FUNCTION public.insertar_factura(ci_cliente integer, nombre_cliente character varying, correo_cliente character varying, telefono_cliente character varying, nombre_usuario character varying, metodo_pago_nombre character varying, monto_descuento numeric) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_cod_administrador INT;
    v_cod_metodo_pago INT;
    v_cod_factura INT;
BEGIN
    -- Obtener código de administrador
    SELECT cod INTO v_cod_administrador
    FROM administrador
    WHERE cod = (SELECT codadm FROM usuario WHERE username = nombre_usuario);

    -- Obtener código de método de pago
    SELECT cod INTO v_cod_metodo_pago
    FROM tipo_de_pago
    WHERE nombre = metodo_pago_nombre;

    BEGIN
        -- Intentar insertar el cliente, si no existe
        INSERT INTO CLIENTE (ci, nombre, correo, telefono)
        VALUES (ci_cliente, nombre_cliente, correo_cliente, telefono_cliente);
    EXCEPTION
        WHEN unique_violation THEN
            -- Si el cliente ya existe, no se hace nada
            NULL;
    END;

    -- Insertar factura y obtener su código
    INSERT INTO factura (codAdmin, cicliente, codtpago, fecha)
    VALUES (v_cod_administrador, ci_cliente, v_cod_metodo_pago, CURRENT_DATE)
    RETURNING codigo INTO v_cod_factura;

    -- Insertar el descuento
    INSERT INTO DESCUENTO (codigodesc, montodescuento)
    VALUES (v_cod_factura, monto_descuento);

    -- Devolver el código de la factura insertada
    RETURN v_cod_factura;
END;
$$;
   DROP FUNCTION public.insertar_factura(ci_cliente integer, nombre_cliente character varying, correo_cliente character varying, telefono_cliente character varying, nombre_usuario character varying, metodo_pago_nombre character varying, monto_descuento numeric);
       public               postgres    false                       1255    16422 B   insertar_inventario(character varying, integer, character varying) 	   PROCEDURE     y  CREATE PROCEDURE public.insertar_inventario(IN nombre_producto character varying, IN cantidad integer, IN nombre_almacen character varying)
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_cod_producto INT;
    v_cod_almacen INT;
BEGIN
    -- Obtener el código del producto
    SELECT codigo INTO v_cod_producto
    FROM PRODUCTO
    WHERE idcategoria = (
        SELECT id
        FROM CATEGORIA
        WHERE descripcion = nombre_producto
    );
    
    -- Obtener el código del almacén
    SELECT id INTO v_cod_almacen
    FROM ALMACEN
    WHERE nombre = nombre_almacen;
    
    -- Insertar el nuevo inventario
    INSERT INTO INVENTARIO (codprod, codalmacen, cantenstockenalmacen, fechaultimo)
    VALUES (v_cod_producto, v_cod_almacen, cantidad, CAST(CURRENT_TIMESTAMP AS DATE));
    
    -- Mostrar mensaje de éxito
    RAISE NOTICE 'Inventario insertado correctamente.';
END;
$$;
 �   DROP PROCEDURE public.insertar_inventario(IN nombre_producto character varying, IN cantidad integer, IN nombre_almacen character varying);
       public               postgres    false            5           1255    16737 H   insertar_inventario(character varying, integer, character varying, date) 	   PROCEDURE     n  CREATE PROCEDURE public.insertar_inventario(IN nombre_producto character varying, IN cantidad integer, IN nombre_almacen character varying, IN fecha date)
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_cod_producto INT;
    v_cod_almacen INT;
BEGIN
    -- Obtener el código del producto
    SELECT codigo INTO v_cod_producto
    FROM PRODUCTO
    WHERE idcategoria = (
        SELECT id
        FROM CATEGORIA
        WHERE descripcion = nombre_producto
    );
    
    -- Obtener el código del almacén
    SELECT id INTO v_cod_almacen
    FROM ALMACEN
    WHERE nombre = nombre_almacen;
    
    -- Insertar el nuevo inventario
    INSERT INTO INVENTARIO (codprod, codalmacen, cantenstockenalmacen, fechaultimo)
    VALUES (v_cod_producto, v_cod_almacen, cantidad, fecha);
    
    -- Mostrar mensaje de éxito
    RAISE NOTICE 'Inventario insertado correctamente.';
END;
$$;
 �   DROP PROCEDURE public.insertar_inventario(IN nombre_producto character varying, IN cantidad integer, IN nombre_almacen character varying, IN fecha date);
       public               postgres    false            !           1255    16424 d   insertar_permisos(character varying, boolean, boolean, boolean, boolean, boolean, character varying) 	   PROCEDURE     6  CREATE PROCEDURE public.insertar_permisos(IN p_username character varying, IN p_habilitado boolean, IN p_ver boolean, IN p_insertar boolean, IN p_editar boolean, IN p_eliminar boolean, IN p_vista character varying)
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_cod_usuario INT;
BEGIN
    -- Obtener el código del usuario a partir del nombre de usuario
    SELECT id INTO v_cod_usuario
    FROM USUARIO
    WHERE username = p_username;
    
    -- Verificar si se encontró el usuario
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Usuario % no encontrado', p_username;
    END IF;

    -- Insertar los nuevos permisos para el usuario
    INSERT INTO PERMISOS (codUser, habilitado, ver, insertar, editar, eliminar, vista)
    VALUES (v_cod_usuario, p_habilitado, p_ver, p_insertar, p_editar, p_eliminar, p_vista);
END;
$$;
 �   DROP PROCEDURE public.insertar_permisos(IN p_username character varying, IN p_habilitado boolean, IN p_ver boolean, IN p_insertar boolean, IN p_editar boolean, IN p_eliminar boolean, IN p_vista character varying);
       public               postgres    false            0           1255    16732 b   modificar_producto(integer, character varying, character varying, integer, numeric, numeric, date) 	   PROCEDURE     4  CREATE PROCEDURE public.modificar_producto(IN p_codigo_producto integer, IN p_nombre_categoria character varying, IN p_nombre_marca character varying, IN p_stock integer, IN p_precio_compra numeric, IN p_precio_venta numeric, IN p_fecha_vencimiento date)
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_cod_categoria INT;
    v_cod_marca INT;
BEGIN
    -- Buscar el código de la categoría
    SELECT id INTO v_cod_categoria FROM CATEGORIA WHERE descripcion = p_nombre_categoria;

    -- Buscar el código de la marca
    SELECT codigo INTO v_cod_marca FROM MARCA WHERE nombre = p_nombre_marca;

    -- Actualizar el producto en la tabla PRODUCTO
    UPDATE PRODUCTO
    SET 
        idcategoria = v_cod_categoria,
        codmarca = v_cod_marca,
        stock = p_stock,
        precioCompra = p_precio_compra,
        fecha_vencimiento = p_fecha_vencimiento
    WHERE codigo = p_codigo_producto;

    -- Actualizar el precio de venta en la tabla PRECIO_VENTA
    UPDATE PRECIO_VENTA
    SET 
        precioVenta = p_precio_venta
    WHERE codigo = p_codigo_producto;
END;
$$;
 �   DROP PROCEDURE public.modificar_producto(IN p_codigo_producto integer, IN p_nombre_categoria character varying, IN p_nombre_marca character varying, IN p_stock integer, IN p_precio_compra numeric, IN p_precio_venta numeric, IN p_fecha_vencimiento date);
       public               postgres    false            1           1255    16733 e   modificar_producto_sinfecha(integer, character varying, character varying, integer, numeric, numeric) 	   PROCEDURE     �  CREATE PROCEDURE public.modificar_producto_sinfecha(IN p_codigo_producto integer, IN p_nombre_categoria character varying, IN p_nombre_marca character varying, IN p_stock integer, IN p_precio_compra numeric, IN p_precio_venta numeric)
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_cod_categoria INT;
    v_cod_marca INT;
BEGIN
    -- Buscar el código de la categoría
    SELECT id INTO v_cod_categoria FROM CATEGORIA WHERE descripcion = p_nombre_categoria;

    -- Buscar el código de la marca
    SELECT codigo INTO v_cod_marca FROM MARCA WHERE nombre = p_nombre_marca;

    -- Actualizar el producto en la tabla PRODUCTO
    UPDATE PRODUCTO
    SET 
        idcategoria = v_cod_categoria,
        codmarca = v_cod_marca,
        stock = p_stock,
        precioCompra = p_precio_compra
    WHERE codigo = p_codigo_producto;

    -- Actualizar el precio de venta en la tabla PRECIO_VENTA
    UPDATE PRECIO_VENTA
    SET 
        precioVenta = p_precio_venta
    WHERE codigo = p_codigo_producto;
END;
$$;
 �   DROP PROCEDURE public.modificar_producto_sinfecha(IN p_codigo_producto integer, IN p_nombre_categoria character varying, IN p_nombre_marca character varying, IN p_stock integer, IN p_precio_compra numeric, IN p_precio_venta numeric);
       public               postgres    false            "           1255    16427 $   mostrar_administradores_vinculados()    FUNCTION       CREATE FUNCTION public.mostrar_administradores_vinculados() RETURNS TABLE(nombre_administrador character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        a.nombre AS nombre_administrador
    FROM
        administrador a
    WHERE
        EXISTS (
            SELECT 1
            FROM usuario u
            WHERE u.codadm = a.cod
        );
END;
$$;
 ;   DROP FUNCTION public.mostrar_administradores_vinculados();
       public               postgres    false            4           1255    16736    mostrar_bitacoras()    FUNCTION     6  CREATE FUNCTION public.mostrar_bitacoras() RETURNS TABLE(id_bitacora integer, nombre_usuario character varying, ip character varying, fechahora character varying, descripcion character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT bitacora.id, 
           (SELECT username FROM USUARIO WHERE id = bitacora.IDUser) AS nombre_usuario,
           bitacora.IP,
           bitacora.FechaHora,
           bitacora.descripcion
    FROM bitacora
    ORDER BY bitacora.id DESC; -- Ordenar por el código de bitácora en orden descendente
END;
$$;
 *   DROP FUNCTION public.mostrar_bitacoras();
       public               postgres    false            #           1255    16429    mostrar_clientes_vinculados()    FUNCTION     h  CREATE FUNCTION public.mostrar_clientes_vinculados() RETURNS TABLE(nombre_cliente character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        c.nombre AS nombre_cliente
    FROM
        cliente c
    WHERE
        EXISTS (
            SELECT 1
            FROM factura f
            WHERE f.cicliente = c.ci
        );
END;
$$;
 4   DROP FUNCTION public.mostrar_clientes_vinculados();
       public               postgres    false            @           1255    24929 $   mostrar_detalle_nota_salida(integer)    FUNCTION       CREATE FUNCTION public.mostrar_detalle_nota_salida(p_codsalida integer) RETURNS TABLE(cod_detalle integer, nombre_producto character varying, cantidad integer)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        d.cod AS cod_detalle,
        (SELECT descripcion::VARCHAR FROM CATEGORIA WHERE id = (SELECT idcategoria FROM PRODUCTO WHERE codigo = d.codproducto LIMIT 1)) AS nombre_producto,
        d.cantidad
    FROM
        DETALLE_NOTA_SALIDA d
    WHERE
        d.codSalida = p_codSalida;
END;
$$;
 G   DROP FUNCTION public.mostrar_detalle_nota_salida(p_codsalida integer);
       public               postgres    false            ;           1255    24923 !   mostrar_detalles_factura(integer)    FUNCTION     X  CREATE FUNCTION public.mostrar_detalles_factura(p_codigo_factura integer) RETURNS TABLE(categoria_producto_nombre text, cantidad_producto bigint, precio_unitario numeric, importe numeric)
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Recuperar los detalles de la factura
    RETURN QUERY 
    SELECT
        (SELECT descripcion FROM CATEGORIA WHERE id = P.idcategoria) AS categoria_producto_nombre,
        SUM(DF.cantidad) AS cantidad_producto,
        (SELECT precioVenta FROM PRECIO_VENTA WHERE codigo = P.codPrecioVenta) AS precio_unitario,
        SUM(DF.cantidad) * (SELECT precioVenta FROM PRECIO_VENTA WHERE codigo = P.codPrecioVenta) AS importe
    FROM
        DETALLE_DE_FACTURA DF,
        PRODUCTO P
    WHERE
        DF.CODPROD = P.codigo AND
        DF.CODFACT = p_codigo_factura
    GROUP BY
        P.idcategoria, P.codPrecioVenta;
END;
$$;
 I   DROP FUNCTION public.mostrar_detalles_factura(p_codigo_factura integer);
       public               postgres    false            9           1255    24921    mostrar_facturas()    FUNCTION     ;  CREATE FUNCTION public.mostrar_facturas() RETURNS TABLE(codigo_factura integer, nombre_cliente character varying, fecha date, nombre_usuario character varying, metodo_pago_nombre character varying, total numeric)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        f.codigo AS codigo_factura,
        c.nombre AS nombre_cliente,
        f.fecha,
        a.nombre AS nombre_administrador,
        tp.nombre AS metodo_pago,
        mt.montototal AS total
    FROM
        factura f,
        cliente c,
        administrador a,
        usuario u,
        tipo_de_pago tp,
        monto_total_factura mt
    WHERE
        f.cicliente = c.ci
        AND f.codAdmin = a.cod
        AND a.cod = u.codadm
        AND f.codtpago = tp.cod
        AND f.codigo = mt.codigo
    ORDER BY
        f.codigo ASC;
END;
$$;
 )   DROP FUNCTION public.mostrar_facturas();
       public               postgres    false            6           1255    16738    mostrar_inventario()    FUNCTION     }  CREATE FUNCTION public.mostrar_inventario() RETURNS TABLE(numero integer, nombre_producto character varying, nombre_almacen character varying, cantidad integer, fecha date)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY 
    SELECT 
        I.numero,
        (SELECT descripcion FROM CATEGORIA WHERE id = P.idcategoria)::VARCHAR(255) AS nombre_producto,
        (SELECT nombre FROM ALMACEN WHERE id = I.codalmacen)::VARCHAR(255) AS nombre_almacen,
        I.cantenstockenalmacen AS cantidad_en_inventario,
        I.fechaultimo AS fecha
    FROM 
        INVENTARIO I, PRODUCTO P
    WHERE 
        P.codigo = I.codprod;
END;
$$;
 +   DROP FUNCTION public.mostrar_inventario();
       public               postgres    false            $           1255    16434    mostrar_usuarios()    FUNCTION     �  CREATE FUNCTION public.mostrar_usuarios() RETURNS TABLE(user_id integer, username character varying, correoelectronico character varying, telefono character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT u.id AS user_id,
           u.username,
           (SELECT a.email FROM ADMINISTRADOR a WHERE a.cod = u.codadm) AS email,
           (SELECT a.telefono FROM ADMINISTRADOR a WHERE a.cod = u.codadm) AS telefono
    FROM USUARIO u;
END;
$$;
 )   DROP FUNCTION public.mostrar_usuarios();
       public               postgres    false            '           1255    16435    obtener_boleta_compra(integer)    FUNCTION     "  CREATE FUNCTION public.obtener_boleta_compra(p_codigo integer) RETURNS TABLE(nroboleta integer, nombre_proveedor character varying, nombre_administrador character varying, metodo_pago_nombre character varying, descripcion text, fecha character varying, total numeric)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        bc.codigo AS NroBoleta,
        (SELECT p.nombre FROM PROVEEDORES p WHERE p.codigo = bc.codproveedor) AS nombre_proveedor,
        (SELECT a.nombre FROM ADMINISTRADOR a WHERE a.cod = bc.codAdm) AS nombre_administrador,
        (SELECT tp.nombre FROM TIPO_DE_PAGO tp WHERE tp.cod = bc.codPago) AS metodo_pago_nombre,
        bc.descripcion,
        bc.fecha,
        bc.total
    FROM
        BOLETA_DE_COMPRA bc
    WHERE
        bc.codigo = p_codigo;
END;
$$;
 >   DROP FUNCTION public.obtener_boleta_compra(p_codigo integer);
       public               postgres    false            &           1255    16436    obtener_boletas_compra()    FUNCTION     �  CREATE FUNCTION public.obtener_boletas_compra() RETURNS TABLE(nroboleta integer, nombre_proveedor character varying, nombre_administrador character varying, metodo_pago_nombre character varying, descripcion text, fecha character varying, total numeric)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        bc.codigo AS NroBoleta,
        (SELECT p.nombre FROM PROVEEDORES p WHERE p.codigo = bc.codproveedor) AS nombre_proveedor,
        (SELECT a.nombre FROM ADMINISTRADOR a WHERE a.cod = bc.codAdm) AS nombre_administrador,
        (SELECT tp.nombre FROM TIPO_DE_PAGO tp WHERE tp.cod = bc.codPago) AS metodo_pago_nombre,
        bc.descripcion,
        bc.fecha,
        bc.total
    FROM
        BOLETA_DE_COMPRA bc;
END;
$$;
 /   DROP FUNCTION public.obtener_boletas_compra();
       public               postgres    false            %           1255    16437 ?   obtener_categoria_permiso(character varying, character varying)    FUNCTION       CREATE FUNCTION public.obtener_categoria_permiso(nombre_usuario character varying, vista_param character varying) RETURNS TABLE(cod_perm integer, perm_habilitado boolean, perm_ver boolean, perm_insertar boolean, perm_editar boolean, perm_eliminar boolean)
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_cod_usuario INT;
BEGIN
    -- Obtener el código del usuario
    SELECT id INTO v_cod_usuario
    FROM USUARIO
    WHERE username = nombre_usuario;

    -- Si se encuentra el usuario, obtener los detalles del permiso correspondiente a la vista
    RETURN QUERY
    SELECT cod, habilitado, ver, insertar, editar, eliminar
    FROM PERMISOS
    WHERE codUser = v_cod_usuario
      AND vista = vista_param;
    
    -- Si no se encuentra ningún permiso, retornar una fila con valores nulos
    IF NOT FOUND THEN
        RETURN QUERY SELECT 
            NULL::INT, 
            NULL::BOOLEAN, 
            NULL::BOOLEAN, 
            NULL::BOOLEAN, 
            NULL::BOOLEAN, 
            NULL::BOOLEAN;
    END IF;
    
END;
$$;
 q   DROP FUNCTION public.obtener_categoria_permiso(nombre_usuario character varying, vista_param character varying);
       public               postgres    false            2           1255    16734    obtener_datos_producto(integer)    FUNCTION     �  CREATE FUNCTION public.obtener_datos_producto(p_codigo_producto integer) RETURNS TABLE(categoria character varying, marca character varying, stock integer, precio_compra numeric, precio_venta numeric, fecha_vencimiento date)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY 
    SELECT 
        (SELECT descripcion FROM CATEGORIA WHERE id = p.idcategoria) AS categoria,
        (SELECT nombre FROM MARCA WHERE codigo = p.codmarca) AS marca,
        p.stock,
        p.precioCompra AS precio_compra,
        (SELECT precioVenta FROM PRECIO_VENTA WHERE codigo = p.codPrecioVenta) AS precio_venta,
        p.fecha_Vencimiento AS fecha_vencimiento
    FROM 
        PRODUCTO p
    WHERE 
        p.codigo = p_codigo_producto;
END;
$$;
 H   DROP FUNCTION public.obtener_datos_producto(p_codigo_producto integer);
       public               postgres    false            (           1255    16439 '   obtener_detalles_boleta_compra(integer)    FUNCTION     �  CREATE FUNCTION public.obtener_detalles_boleta_compra(p_codigo_boleta integer) RETURNS TABLE(nombre_producto text, cantidad bigint, precio_unitario numeric, importe numeric)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY 
    SELECT
        (SELECT descripcion FROM CATEGORIA WHERE id = P.idcategoria) AS nombre_producto,
        SUM(DC.cantidad) AS cantidad,
        P.precioCompra AS precio_unitario,
        SUM(DC.cantidad) * P.precioCompra AS importe
    FROM
        DETALLE_DE_COMPRA DC,
        PRODUCTO P
    WHERE
        DC.codigoproducto = P.codigo AND
        DC.codboletacompra = p_codigo_boleta
    GROUP BY
        P.idcategoria, P.precioCompra;
END;
$$;
 N   DROP FUNCTION public.obtener_detalles_boleta_compra(p_codigo_boleta integer);
       public               postgres    false            /           1255    16731    obtener_productos()    FUNCTION     �  CREATE FUNCTION public.obtener_productos() RETURNS TABLE(cod integer, categoria text, marca character varying, stock integer, precio_compra numeric, precio_venta numeric, fecha_vencimiento date)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.codigo AS cod,
        (SELECT descripcion FROM CATEGORIA WHERE id = p.idcategoria) AS categoria,
        (SELECT nombre FROM MARCA WHERE codigo = p.codmarca) AS marca,
        p.stock,
        p.precioCompra AS precio_compra,
        (SELECT precioVenta FROM PRECIO_VENTA WHERE codigo = p.codPrecioVenta) AS precio_venta,
        p.fecha_Vencimiento
    FROM 
        PRODUCTO p;
END;
$$;
 *   DROP FUNCTION public.obtener_productos();
       public               postgres    false                       1255    16441    trigger_verificar_stock()    FUNCTION       CREATE FUNCTION public.trigger_verificar_stock() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    PERFORM actualizar_stock(); -- Llamar a la función actualizar_stock()

    RETURN NEW; -- Retornar el nuevo detalle de nota de salida si todo está correcto
EXCEPTION
    WHEN others THEN
        -- En caso de error, eliminar el detalle y la nota de salida asociada
        DELETE FROM DETALLE_NOTA_SALIDA WHERE cod = NEW.cod;
        DELETE FROM NOTA_SALIDA WHERE cod = NEW.codSalida;
        RAISE;
END;
$$;
 0   DROP FUNCTION public.trigger_verificar_stock();
       public               postgres    false                       1255    16442     verificar_asociaciones_almacen()    FUNCTION     d  CREATE FUNCTION public.verificar_asociaciones_almacen() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_inventario_count INT;
BEGIN
    -- Verificar si el almacén está asociado a algún producto en el inventario
    SELECT COUNT(*) INTO v_inventario_count
    FROM INVENTARIO
    WHERE codalmacen = OLD.id;

    -- Lanzar un error si el almacén está asociado a algún producto en el inventario
    IF v_inventario_count > 0 THEN
        RAISE EXCEPTION 'No se puede eliminar el almacén con ID % porque está asociado a productos en el inventario', OLD.id;
    END IF;

    RETURN OLD;
END;
$$;
 7   DROP FUNCTION public.verificar_asociaciones_almacen();
       public               postgres    false            )           1255    16443 !   verificar_asociaciones_producto()    FUNCTION     �  CREATE FUNCTION public.verificar_asociaciones_producto() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_detalle_compra_count INT;
    v_detalle_venta_count INT;
    v_detalle_nota_salida_count INT;
BEGIN
    -- Verificar si el producto está asociado a algún detalle de compra
    SELECT COUNT(*) INTO v_detalle_compra_count
    FROM DETALLE_DE_COMPRA
    WHERE codigoproducto = OLD.codigo;
    
    -- Verificar si el producto está asociado a algún detalle de venta
    SELECT COUNT(*) INTO v_detalle_venta_count
    FROM DETALLE_DE_FACTURA
    WHERE CODPROD = OLD.codigo;
    
    -- Verificar si el producto está asociado a algún detalle de nota de salida
    SELECT COUNT(*) INTO v_detalle_nota_salida_count
    FROM DETALLE_NOTA_SALIDA
    WHERE codproducto = OLD.codigo;
    
    -- Lanzar un error si el producto está asociado a alguna de las tablas
    IF v_detalle_compra_count > 0 THEN
        RAISE EXCEPTION 'No se puede eliminar el producto con código % porque está asociado a un detalle de compra', OLD.codigo;
    ELSIF v_detalle_venta_count > 0 THEN
        RAISE EXCEPTION 'No se puede eliminar el producto con código % porque está asociado a un detalle de venta', OLD.codigo;
    ELSIF v_detalle_nota_salida_count > 0 THEN
        RAISE EXCEPTION 'No se puede eliminar el producto con código % porque está asociado a un detalle de nota de salida', OLD.codigo;
    END IF;

    RETURN OLD;
END;
$$;
 8   DROP FUNCTION public.verificar_asociaciones_producto();
       public               postgres    false            *           1255    16444 "   verificar_asociaciones_proveedor()    FUNCTION     o  CREATE FUNCTION public.verificar_asociaciones_proveedor() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_boleta_compra_count INT;
BEGIN
    -- Verificar si el proveedor está asociado a alguna boleta de compra
    SELECT COUNT(*) INTO v_boleta_compra_count
    FROM BOLETA_DE_COMPRA
    WHERE codproveedor = OLD.codigo;

    -- Lanzar un error si el proveedor está asociado a alguna boleta de compra
    IF v_boleta_compra_count > 0 THEN
        RAISE EXCEPTION 'No se puede eliminar el proveedor con código % porque está asociado a una boleta de compra', OLD.codigo;
    END IF;

    RETURN OLD;
END;
$$;
 9   DROP FUNCTION public.verificar_asociaciones_proveedor();
       public               postgres    false            +           1255    16445    verificar_capacidad_almacen()    FUNCTION       CREATE FUNCTION public.verificar_capacidad_almacen() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_capacidad_total INT;
    v_capacidad_actual INT;
    v_nombre_almacen VARCHAR(255);
    porcentaje_maximo FLOAT := 0.9; -- 90%
BEGIN
    -- Obtener la capacidad total, capacidad actual y nombre del almacén
    SELECT capacidad_total, capacidad_actual, nombre
    INTO v_capacidad_total, v_capacidad_actual, v_nombre_almacen
    FROM almacen
    WHERE id = (SELECT codalmacen FROM inventario WHERE codprod = NEW.codigoproducto);

    -- Calcular el porcentaje de capacidad actual
    IF (v_capacidad_actual * 1.0 / v_capacidad_total) >= porcentaje_maximo THEN
        -- Si la capacidad actual alcanza el 90% o más de la capacidad total, enviar un mensaje
        PERFORM pg_notify('almacen_lleno', 'El almacén está casi lleno. Por favor, considere aumentar la capacidad.');
    END IF;

    -- Verificar si la suma de cantidad y la capacidad actual supera la capacidad total
    IF (v_capacidad_actual + NEW.cantidad) > v_capacidad_total THEN
        -- Enviar un mensaje indicando que el almacén está lleno
        PERFORM pg_notify('almacen_lleno', format('El almacén %s está lleno. No se puede añadir más productos.', v_nombre_almacen));
    END IF;

    RETURN NEW;
END;
$$;
 4   DROP FUNCTION public.verificar_capacidad_almacen();
       public               postgres    false            ,           1255    16446    verificar_stock()    FUNCTION     �  CREATE FUNCTION public.verificar_stock() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_stock_existente INT;
BEGIN
    -- Obtener stock existente del producto
    SELECT stock INTO v_stock_existente
    FROM producto
    WHERE codigo = NEW.CODPROD;

    -- Verificar si hay suficiente stock
    IF v_stock_existente >= NEW.cantidad THEN
        RETURN NEW;
    ELSE
        RAISE EXCEPTION 'No hay suficiente stock del producto';
    END IF;
END;
$$;
 (   DROP FUNCTION public.verificar_stock();
       public               postgres    false            �            1259    16447    administrador_codigo_seq    SEQUENCE     �   CREATE SEQUENCE public.administrador_codigo_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE public.administrador_codigo_seq;
       public               postgres    false            �            1259    16448    administrador    TABLE     �   CREATE TABLE public.administrador (
    cod integer DEFAULT nextval('public.administrador_codigo_seq'::regclass) NOT NULL,
    nombre character varying(255),
    telefono character varying(20),
    email character varying(255)
);
 !   DROP TABLE public.administrador;
       public         heap r       postgres    false    217            �            1259    16454    almacen_codigo_seq    SEQUENCE     {   CREATE SEQUENCE public.almacen_codigo_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public.almacen_codigo_seq;
       public               postgres    false            �            1259    16455    almacen    TABLE        CREATE TABLE public.almacen (
    id integer DEFAULT nextval('public.almacen_codigo_seq'::regclass) NOT NULL,
    nombre character varying(255),
    direccion character varying(255),
    ciudad character varying(255),
    capacidad_actual integer,
    capacidad_total integer NOT NULL
);
    DROP TABLE public.almacen;
       public         heap r       postgres    false    219            �            1259    16461    bitacora_codigo_seq    SEQUENCE     |   CREATE SEQUENCE public.bitacora_codigo_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.bitacora_codigo_seq;
       public               postgres    false            �            1259    16462    bitacora    TABLE     �   CREATE TABLE public.bitacora (
    id integer DEFAULT nextval('public.bitacora_codigo_seq'::regclass) NOT NULL,
    iduser integer,
    ip character varying(255),
    fechahora character varying(255),
    descripcion character varying(255)
);
    DROP TABLE public.bitacora;
       public         heap r       postgres    false    221            �            1259    16468    boletacompra_codigo_seq    SEQUENCE     �   CREATE SEQUENCE public.boletacompra_codigo_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.boletacompra_codigo_seq;
       public               postgres    false            �            1259    16469    boleta_de_compra    TABLE       CREATE TABLE public.boleta_de_compra (
    codigo integer DEFAULT nextval('public.boletacompra_codigo_seq'::regclass) NOT NULL,
    codproveedor integer,
    codadm integer,
    codpago integer,
    descripcion text,
    total numeric(10,2),
    fecha character varying(10)
);
 $   DROP TABLE public.boleta_de_compra;
       public         heap r       postgres    false    223            �            1259    16475 	   categoria    TABLE     f   CREATE TABLE public.categoria (
    id integer NOT NULL,
    idpadre integer,
    descripcion text
);
    DROP TABLE public.categoria;
       public         heap r       postgres    false            �            1259    16480    cliente    TABLE     �   CREATE TABLE public.cliente (
    ci integer NOT NULL,
    nombre character varying(255),
    telefono character varying(20),
    correo character varying(255)
);
    DROP TABLE public.cliente;
       public         heap r       postgres    false            �            1259    16485 	   descuento    TABLE     e   CREATE TABLE public.descuento (
    codigodesc integer NOT NULL,
    montodescuento numeric(10,2)
);
    DROP TABLE public.descuento;
       public         heap r       postgres    false            �            1259    16488    detallecompra_codigo_seq    SEQUENCE     �   CREATE SEQUENCE public.detallecompra_codigo_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE public.detallecompra_codigo_seq;
       public               postgres    false            �            1259    16489    detalle_de_compra    TABLE     �   CREATE TABLE public.detalle_de_compra (
    codigo integer DEFAULT nextval('public.detallecompra_codigo_seq'::regclass) NOT NULL,
    codboletacompra integer,
    codigoproducto integer,
    cantidad integer,
    precio numeric(10,2)
);
 %   DROP TABLE public.detalle_de_compra;
       public         heap r       postgres    false    228            �            1259    16493    detallefactura_codigo_seq    SEQUENCE     �   CREATE SEQUENCE public.detallefactura_codigo_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 0   DROP SEQUENCE public.detallefactura_codigo_seq;
       public               postgres    false            �            1259    16494    detalle_de_factura    TABLE     �   CREATE TABLE public.detalle_de_factura (
    codigo integer DEFAULT nextval('public.detallefactura_codigo_seq'::regclass) NOT NULL,
    codprod integer,
    codfact integer,
    cantidad integer,
    precio numeric(10,2)
);
 &   DROP TABLE public.detalle_de_factura;
       public         heap r       postgres    false    230            �            1259    16498    detallesalida_codigo_seq    SEQUENCE     �   CREATE SEQUENCE public.detallesalida_codigo_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE public.detallesalida_codigo_seq;
       public               postgres    false            �            1259    16499    detalle_nota_salida    TABLE     �   CREATE TABLE public.detalle_nota_salida (
    cod integer DEFAULT nextval('public.detallesalida_codigo_seq'::regclass) NOT NULL,
    codsalida integer NOT NULL,
    codproducto integer NOT NULL,
    cantidad integer
);
 '   DROP TABLE public.detalle_nota_salida;
       public         heap r       postgres    false    232            �            1259    16503    factura_codigo_seq    SEQUENCE     {   CREATE SEQUENCE public.factura_codigo_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public.factura_codigo_seq;
       public               postgres    false            �            1259    16504    factura    TABLE     �   CREATE TABLE public.factura (
    codigo integer DEFAULT nextval('public.factura_codigo_seq'::regclass) NOT NULL,
    codadmin integer,
    cicliente integer,
    codtpago integer,
    fecha date
);
    DROP TABLE public.factura;
       public         heap r       postgres    false    234            �            1259    16508    inventario_codigo_seq    SEQUENCE     ~   CREATE SEQUENCE public.inventario_codigo_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ,   DROP SEQUENCE public.inventario_codigo_seq;
       public               postgres    false            �            1259    16509 
   inventario    TABLE     �   CREATE TABLE public.inventario (
    numero integer DEFAULT nextval('public.inventario_codigo_seq'::regclass) NOT NULL,
    codalmacen integer,
    codprod integer,
    fechaultimo date,
    cantenstockenalmacen integer
);
    DROP TABLE public.inventario;
       public         heap r       postgres    false    236            �            1259    16513    marca    TABLE     ^   CREATE TABLE public.marca (
    codigo integer NOT NULL,
    nombre character varying(255)
);
    DROP TABLE public.marca;
       public         heap r       postgres    false            �            1259    16516    monto_total_factura    TABLE     g   CREATE TABLE public.monto_total_factura (
    codigo integer NOT NULL,
    montototal numeric(10,2)
);
 '   DROP TABLE public.monto_total_factura;
       public         heap r       postgres    false            �            1259    16519    salida_codigo_seq    SEQUENCE     z   CREATE SEQUENCE public.salida_codigo_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.salida_codigo_seq;
       public               postgres    false            �            1259    16520    nota_salida    TABLE     �   CREATE TABLE public.nota_salida (
    cod integer DEFAULT nextval('public.salida_codigo_seq'::regclass) NOT NULL,
    origen character varying(255),
    descripcion character varying(255),
    fecha date
);
    DROP TABLE public.nota_salida;
       public         heap r       postgres    false    240            �            1259    16526    permiso_codigo_seq    SEQUENCE     {   CREATE SEQUENCE public.permiso_codigo_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public.permiso_codigo_seq;
       public               postgres    false            �            1259    16527    permisos    TABLE       CREATE TABLE public.permisos (
    cod integer DEFAULT nextval('public.permiso_codigo_seq'::regclass) NOT NULL,
    coduser integer,
    habilitado boolean,
    ver boolean,
    insertar boolean,
    editar boolean,
    eliminar boolean,
    vista character varying(40)
);
    DROP TABLE public.permisos;
       public         heap r       postgres    false    242            �            1259    16531    precioventa_codigo_seq    SEQUENCE        CREATE SEQUENCE public.precioventa_codigo_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.precioventa_codigo_seq;
       public               postgres    false            �            1259    16532    precio_venta    TABLE     �   CREATE TABLE public.precio_venta (
    codigo integer DEFAULT nextval('public.precioventa_codigo_seq'::regclass) NOT NULL,
    precioventa numeric(10,2)
);
     DROP TABLE public.precio_venta;
       public         heap r       postgres    false    244            �            1259    16536    producto_codigo_seq    SEQUENCE     |   CREATE SEQUENCE public.producto_codigo_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.producto_codigo_seq;
       public               postgres    false            �            1259    16537    producto    TABLE       CREATE TABLE public.producto (
    codigo integer DEFAULT nextval('public.producto_codigo_seq'::regclass) NOT NULL,
    codmarca integer,
    idcategoria integer,
    preciocompra numeric(10,2),
    codprecioventa integer,
    stock integer,
    fecha_vencimiento date
);
    DROP TABLE public.producto;
       public         heap r       postgres    false    246            �            1259    16541    proveedor_codigo_seq    SEQUENCE     }   CREATE SEQUENCE public.proveedor_codigo_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE public.proveedor_codigo_seq;
       public               postgres    false            �            1259    16542    proveedores    TABLE     �   CREATE TABLE public.proveedores (
    codigo integer DEFAULT nextval('public.proveedor_codigo_seq'::regclass) NOT NULL,
    nombre character varying(255),
    direccion character varying(255),
    telefono character varying(20)
);
    DROP TABLE public.proveedores;
       public         heap r       postgres    false    248            �            1259    16548    tipo_de_pago    TABLE     �   CREATE TABLE public.tipo_de_pago (
    cod integer NOT NULL,
    nombre character varying(255),
    descripcion character varying(255)
);
     DROP TABLE public.tipo_de_pago;
       public         heap r       postgres    false            �            1259    16553    totalfactura_codigo_seq    SEQUENCE     �   CREATE SEQUENCE public.totalfactura_codigo_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.totalfactura_codigo_seq;
       public               postgres    false            �            1259    16554    user_codigo_seq    SEQUENCE     x   CREATE SEQUENCE public.user_codigo_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.user_codigo_seq;
       public               postgres    false            �            1259    16555    usuario    TABLE     �   CREATE TABLE public.usuario (
    id integer DEFAULT nextval('public.user_codigo_seq'::regclass) NOT NULL,
    username character varying(20) NOT NULL,
    codadm integer NOT NULL,
    password character varying(255) NOT NULL
);
    DROP TABLE public.usuario;
       public         heap r       postgres    false    252            �            1259    16559    v_cod_producto    TABLE     ;   CREATE TABLE public.v_cod_producto (
    nextval bigint
);
 "   DROP TABLE public.v_cod_producto;
       public         heap r       postgres    false            �          0    16448    administrador 
   TABLE DATA           E   COPY public.administrador (cod, nombre, telefono, email) FROM stdin;
    public               postgres    false    218   9�      �          0    16455    almacen 
   TABLE DATA           c   COPY public.almacen (id, nombre, direccion, ciudad, capacidad_actual, capacidad_total) FROM stdin;
    public               postgres    false    220   �      �          0    16462    bitacora 
   TABLE DATA           J   COPY public.bitacora (id, iduser, ip, fechahora, descripcion) FROM stdin;
    public               postgres    false    222   w�      �          0    16469    boleta_de_compra 
   TABLE DATA           l   COPY public.boleta_de_compra (codigo, codproveedor, codadm, codpago, descripcion, total, fecha) FROM stdin;
    public               postgres    false    224   ��      �          0    16475 	   categoria 
   TABLE DATA           =   COPY public.categoria (id, idpadre, descripcion) FROM stdin;
    public               postgres    false    225   I�      �          0    16480    cliente 
   TABLE DATA           ?   COPY public.cliente (ci, nombre, telefono, correo) FROM stdin;
    public               postgres    false    226   ��      �          0    16485 	   descuento 
   TABLE DATA           ?   COPY public.descuento (codigodesc, montodescuento) FROM stdin;
    public               postgres    false    227   o�      �          0    16489    detalle_de_compra 
   TABLE DATA           f   COPY public.detalle_de_compra (codigo, codboletacompra, codigoproducto, cantidad, precio) FROM stdin;
    public               postgres    false    229   ��      �          0    16494    detalle_de_factura 
   TABLE DATA           X   COPY public.detalle_de_factura (codigo, codprod, codfact, cantidad, precio) FROM stdin;
    public               postgres    false    231   ��      �          0    16499    detalle_nota_salida 
   TABLE DATA           T   COPY public.detalle_nota_salida (cod, codsalida, codproducto, cantidad) FROM stdin;
    public               postgres    false    233   6�      �          0    16504    factura 
   TABLE DATA           O   COPY public.factura (codigo, codadmin, cicliente, codtpago, fecha) FROM stdin;
    public               postgres    false    235   _�      �          0    16509 
   inventario 
   TABLE DATA           d   COPY public.inventario (numero, codalmacen, codprod, fechaultimo, cantenstockenalmacen) FROM stdin;
    public               postgres    false    237   ��      �          0    16513    marca 
   TABLE DATA           /   COPY public.marca (codigo, nombre) FROM stdin;
    public               postgres    false    238   �      �          0    16516    monto_total_factura 
   TABLE DATA           A   COPY public.monto_total_factura (codigo, montototal) FROM stdin;
    public               postgres    false    239   :�      �          0    16520    nota_salida 
   TABLE DATA           F   COPY public.nota_salida (cod, origen, descripcion, fecha) FROM stdin;
    public               postgres    false    241   n�      �          0    16527    permisos 
   TABLE DATA           d   COPY public.permisos (cod, coduser, habilitado, ver, insertar, editar, eliminar, vista) FROM stdin;
    public               postgres    false    243   ��      �          0    16532    precio_venta 
   TABLE DATA           ;   COPY public.precio_venta (codigo, precioventa) FROM stdin;
    public               postgres    false    245   P�      �          0    16537    producto 
   TABLE DATA           y   COPY public.producto (codigo, codmarca, idcategoria, preciocompra, codprecioventa, stock, fecha_vencimiento) FROM stdin;
    public               postgres    false    247   ��      �          0    16542    proveedores 
   TABLE DATA           J   COPY public.proveedores (codigo, nombre, direccion, telefono) FROM stdin;
    public               postgres    false    249   g�      �          0    16548    tipo_de_pago 
   TABLE DATA           @   COPY public.tipo_de_pago (cod, nombre, descripcion) FROM stdin;
    public               postgres    false    250   F�      �          0    16555    usuario 
   TABLE DATA           A   COPY public.usuario (id, username, codadm, password) FROM stdin;
    public               postgres    false    253   ��      �          0    16559    v_cod_producto 
   TABLE DATA           1   COPY public.v_cod_producto (nextval) FROM stdin;
    public               postgres    false    254   P�      �           0    0    administrador_codigo_seq    SEQUENCE SET     J   SELECT pg_catalog.setval('public.administrador_codigo_seq', 10010, true);
          public               postgres    false    217            �           0    0    almacen_codigo_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public.almacen_codigo_seq', 1003, true);
          public               postgres    false    219            �           0    0    bitacora_codigo_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public.bitacora_codigo_seq', 1325, true);
          public               postgres    false    221            �           0    0    boletacompra_codigo_seq    SEQUENCE SET     H   SELECT pg_catalog.setval('public.boletacompra_codigo_seq', 1022, true);
          public               postgres    false    223            �           0    0    detallecompra_codigo_seq    SEQUENCE SET     I   SELECT pg_catalog.setval('public.detallecompra_codigo_seq', 1018, true);
          public               postgres    false    228            �           0    0    detallefactura_codigo_seq    SEQUENCE SET     J   SELECT pg_catalog.setval('public.detallefactura_codigo_seq', 1008, true);
          public               postgres    false    230            �           0    0    detallesalida_codigo_seq    SEQUENCE SET     I   SELECT pg_catalog.setval('public.detallesalida_codigo_seq', 1008, true);
          public               postgres    false    232            �           0    0    factura_codigo_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public.factura_codigo_seq', 1004, true);
          public               postgres    false    234            �           0    0    inventario_codigo_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public.inventario_codigo_seq', 1005, true);
          public               postgres    false    236            �           0    0    permiso_codigo_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public.permiso_codigo_seq', 1062, true);
          public               postgres    false    242            �           0    0    precioventa_codigo_seq    SEQUENCE SET     G   SELECT pg_catalog.setval('public.precioventa_codigo_seq', 1041, true);
          public               postgres    false    244            �           0    0    producto_codigo_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public.producto_codigo_seq', 1042, true);
          public               postgres    false    246            �           0    0    proveedor_codigo_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public.proveedor_codigo_seq', 1005, true);
          public               postgres    false    248            �           0    0    salida_codigo_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public.salida_codigo_seq', 1001, true);
          public               postgres    false    240            �           0    0    totalfactura_codigo_seq    SEQUENCE SET     J   SELECT pg_catalog.setval('public.totalfactura_codigo_seq', 10003, false);
          public               postgres    false    251            �           0    0    user_codigo_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.user_codigo_seq', 1007, true);
          public               postgres    false    252            �           2606    16563     administrador administrador_pkey 
   CONSTRAINT     _   ALTER TABLE ONLY public.administrador
    ADD CONSTRAINT administrador_pkey PRIMARY KEY (cod);
 J   ALTER TABLE ONLY public.administrador DROP CONSTRAINT administrador_pkey;
       public                 postgres    false    218            �           2606    16565    almacen almacen_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.almacen
    ADD CONSTRAINT almacen_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.almacen DROP CONSTRAINT almacen_pkey;
       public                 postgres    false    220            �           2606    16567    bitacora bitacora_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.bitacora
    ADD CONSTRAINT bitacora_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.bitacora DROP CONSTRAINT bitacora_pkey;
       public                 postgres    false    222            �           2606    16569 &   boleta_de_compra boleta_de_compra_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY public.boleta_de_compra
    ADD CONSTRAINT boleta_de_compra_pkey PRIMARY KEY (codigo);
 P   ALTER TABLE ONLY public.boleta_de_compra DROP CONSTRAINT boleta_de_compra_pkey;
       public                 postgres    false    224            �           2606    16571    categoria categoria_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.categoria
    ADD CONSTRAINT categoria_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.categoria DROP CONSTRAINT categoria_pkey;
       public                 postgres    false    225            �           2606    16573    cliente cliente_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.cliente
    ADD CONSTRAINT cliente_pkey PRIMARY KEY (ci);
 >   ALTER TABLE ONLY public.cliente DROP CONSTRAINT cliente_pkey;
       public                 postgres    false    226            �           2606    16575    descuento descuento_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public.descuento
    ADD CONSTRAINT descuento_pkey PRIMARY KEY (codigodesc);
 B   ALTER TABLE ONLY public.descuento DROP CONSTRAINT descuento_pkey;
       public                 postgres    false    227            �           2606    16577 (   detalle_de_compra detalle_de_compra_pkey 
   CONSTRAINT     j   ALTER TABLE ONLY public.detalle_de_compra
    ADD CONSTRAINT detalle_de_compra_pkey PRIMARY KEY (codigo);
 R   ALTER TABLE ONLY public.detalle_de_compra DROP CONSTRAINT detalle_de_compra_pkey;
       public                 postgres    false    229            �           2606    16579 *   detalle_de_factura detalle_de_factura_pkey 
   CONSTRAINT     l   ALTER TABLE ONLY public.detalle_de_factura
    ADD CONSTRAINT detalle_de_factura_pkey PRIMARY KEY (codigo);
 T   ALTER TABLE ONLY public.detalle_de_factura DROP CONSTRAINT detalle_de_factura_pkey;
       public                 postgres    false    231            �           2606    16581 ,   detalle_nota_salida detalle_nota_salida_pkey 
   CONSTRAINT     k   ALTER TABLE ONLY public.detalle_nota_salida
    ADD CONSTRAINT detalle_nota_salida_pkey PRIMARY KEY (cod);
 V   ALTER TABLE ONLY public.detalle_nota_salida DROP CONSTRAINT detalle_nota_salida_pkey;
       public                 postgres    false    233            �           2606    16583    factura factura_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.factura
    ADD CONSTRAINT factura_pkey PRIMARY KEY (codigo);
 >   ALTER TABLE ONLY public.factura DROP CONSTRAINT factura_pkey;
       public                 postgres    false    235            �           2606    16585    inventario inventario_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.inventario
    ADD CONSTRAINT inventario_pkey PRIMARY KEY (numero);
 D   ALTER TABLE ONLY public.inventario DROP CONSTRAINT inventario_pkey;
       public                 postgres    false    237            �           2606    16587    marca marca_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.marca
    ADD CONSTRAINT marca_pkey PRIMARY KEY (codigo);
 :   ALTER TABLE ONLY public.marca DROP CONSTRAINT marca_pkey;
       public                 postgres    false    238            �           2606    16589 ,   monto_total_factura monto_total_factura_pkey 
   CONSTRAINT     n   ALTER TABLE ONLY public.monto_total_factura
    ADD CONSTRAINT monto_total_factura_pkey PRIMARY KEY (codigo);
 V   ALTER TABLE ONLY public.monto_total_factura DROP CONSTRAINT monto_total_factura_pkey;
       public                 postgres    false    239            �           2606    16591    nota_salida nota_salida_pkey 
   CONSTRAINT     [   ALTER TABLE ONLY public.nota_salida
    ADD CONSTRAINT nota_salida_pkey PRIMARY KEY (cod);
 F   ALTER TABLE ONLY public.nota_salida DROP CONSTRAINT nota_salida_pkey;
       public                 postgres    false    241            �           2606    16593    permisos permisos_pkey 
   CONSTRAINT     U   ALTER TABLE ONLY public.permisos
    ADD CONSTRAINT permisos_pkey PRIMARY KEY (cod);
 @   ALTER TABLE ONLY public.permisos DROP CONSTRAINT permisos_pkey;
       public                 postgres    false    243            �           2606    16595    precio_venta precio_venta_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY public.precio_venta
    ADD CONSTRAINT precio_venta_pkey PRIMARY KEY (codigo);
 H   ALTER TABLE ONLY public.precio_venta DROP CONSTRAINT precio_venta_pkey;
       public                 postgres    false    245            �           2606    16597    producto producto_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.producto
    ADD CONSTRAINT producto_pkey PRIMARY KEY (codigo);
 @   ALTER TABLE ONLY public.producto DROP CONSTRAINT producto_pkey;
       public                 postgres    false    247            �           2606    16599    proveedores proveedores_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public.proveedores
    ADD CONSTRAINT proveedores_pkey PRIMARY KEY (codigo);
 F   ALTER TABLE ONLY public.proveedores DROP CONSTRAINT proveedores_pkey;
       public                 postgres    false    249            �           2606    16601    tipo_de_pago tipo_de_pago_pkey 
   CONSTRAINT     ]   ALTER TABLE ONLY public.tipo_de_pago
    ADD CONSTRAINT tipo_de_pago_pkey PRIMARY KEY (cod);
 H   ALTER TABLE ONLY public.tipo_de_pago DROP CONSTRAINT tipo_de_pago_pkey;
       public                 postgres    false    250            �           2606    16603    usuario usuario_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_pkey;
       public                 postgres    false    253                       2620    16604 *   detalle_de_compra actualizar_stock_trigger    TRIGGER     �   CREATE TRIGGER actualizar_stock_trigger AFTER INSERT ON public.detalle_de_compra FOR EACH ROW EXECUTE FUNCTION public.actualizar_stock_y_capacidad();
 C   DROP TRIGGER actualizar_stock_trigger ON public.detalle_de_compra;
       public               postgres    false    229    275                       2620    16605 B   detalle_de_compra actualizar_stock_y_capacidad_al_eliminar_trigger    TRIGGER     �   CREATE TRIGGER actualizar_stock_y_capacidad_al_eliminar_trigger AFTER DELETE ON public.detalle_de_compra FOR EACH ROW EXECUTE FUNCTION public.actualizar_stock_y_capacidad_al_eliminar();
 [   DROP TRIGGER actualizar_stock_y_capacidad_al_eliminar_trigger ON public.detalle_de_compra;
       public               postgres    false    229    276                       2620    16606 1   detalle_de_compra actualizar_total_boleta_trigger    TRIGGER     �   CREATE TRIGGER actualizar_total_boleta_trigger AFTER INSERT OR DELETE OR UPDATE ON public.detalle_de_compra FOR EACH ROW EXECUTE FUNCTION public.actualizar_total_boleta();
 J   DROP TRIGGER actualizar_total_boleta_trigger ON public.detalle_de_compra;
       public               postgres    false    229    277                       2620    16607 1   detalle_de_factura calcular_total_factura_trigger    TRIGGER     �   CREATE TRIGGER calcular_total_factura_trigger AFTER INSERT ON public.detalle_de_factura FOR EACH ROW EXECUTE FUNCTION public.calcular_total_factura();
 J   DROP TRIGGER calcular_total_factura_trigger ON public.detalle_de_factura;
       public               postgres    false    231    279                       2620    16608 3   detalle_de_factura eliminar_detalle_factura_trigger    TRIGGER     �   CREATE TRIGGER eliminar_detalle_factura_trigger AFTER DELETE ON public.detalle_de_factura FOR EACH ROW EXECUTE FUNCTION public.devolver_stock();
 L   DROP TRIGGER eliminar_detalle_factura_trigger ON public.detalle_de_factura;
       public               postgres    false    231    282                       2620    16609 '   nota_salida trg_actualizar_notas_salida    TRIGGER     �   CREATE TRIGGER trg_actualizar_notas_salida AFTER UPDATE ON public.nota_salida FOR EACH ROW EXECUTE FUNCTION public.actualizar_notas_salida();
 @   DROP TRIGGER trg_actualizar_notas_salida ON public.nota_salida;
       public               postgres    false    257    241                       2620    16610 (   detalle_nota_salida trg_actualizar_stock    TRIGGER     �   CREATE TRIGGER trg_actualizar_stock AFTER INSERT ON public.detalle_nota_salida FOR EACH ROW EXECUTE FUNCTION public.actualizar_stock();
 A   DROP TRIGGER trg_actualizar_stock ON public.detalle_nota_salida;
       public               postgres    false    274    233                       2620    16611 2   detalle_nota_salida trg_calcular_stock_actualizado    TRIGGER     �   CREATE TRIGGER trg_calcular_stock_actualizado AFTER UPDATE ON public.detalle_nota_salida FOR EACH ROW EXECUTE FUNCTION public.calcular_stock_actualizado();
 K   DROP TRIGGER trg_calcular_stock_actualizado ON public.detalle_nota_salida;
       public               postgres    false    233    278                       2620    16612 &   detalle_nota_salida trg_devolver_stock    TRIGGER     �   CREATE TRIGGER trg_devolver_stock AFTER DELETE ON public.detalle_nota_salida FOR EACH ROW EXECUTE FUNCTION public.devolver_stockap();
 ?   DROP TRIGGER trg_devolver_stock ON public.detalle_nota_salida;
       public               postgres    false    233    283                       2620    16613 .   almacen trigger_verificar_asociaciones_almacen    TRIGGER     �   CREATE TRIGGER trigger_verificar_asociaciones_almacen BEFORE DELETE ON public.almacen FOR EACH ROW EXECUTE FUNCTION public.verificar_asociaciones_almacen();
 G   DROP TRIGGER trigger_verificar_asociaciones_almacen ON public.almacen;
       public               postgres    false    260    220                       2620    16614 0   producto trigger_verificar_asociaciones_producto    TRIGGER     �   CREATE TRIGGER trigger_verificar_asociaciones_producto BEFORE DELETE ON public.producto FOR EACH ROW EXECUTE FUNCTION public.verificar_asociaciones_producto();
 I   DROP TRIGGER trigger_verificar_asociaciones_producto ON public.producto;
       public               postgres    false    297    247                       2620    16615 4   proveedores trigger_verificar_asociaciones_proveedor    TRIGGER     �   CREATE TRIGGER trigger_verificar_asociaciones_proveedor BEFORE DELETE ON public.proveedores FOR EACH ROW EXECUTE FUNCTION public.verificar_asociaciones_proveedor();
 M   DROP TRIGGER trigger_verificar_asociaciones_proveedor ON public.proveedores;
       public               postgres    false    249    298                       2620    16616 -   detalle_de_compra verificar_capacidad_trigger    TRIGGER     �   CREATE TRIGGER verificar_capacidad_trigger AFTER INSERT ON public.detalle_de_compra FOR EACH ROW EXECUTE FUNCTION public.verificar_capacidad_almacen();
 F   DROP TRIGGER verificar_capacidad_trigger ON public.detalle_de_compra;
       public               postgres    false    299    229                       2620    16617 *   detalle_de_factura verificar_stock_trigger    TRIGGER     �   CREATE TRIGGER verificar_stock_trigger BEFORE INSERT ON public.detalle_de_factura FOR EACH ROW EXECUTE FUNCTION public.verificar_stock();
 C   DROP TRIGGER verificar_stock_trigger ON public.detalle_de_factura;
       public               postgres    false    300    231            �           2606    16618 -   boleta_de_compra boleta_de_compra_codadm_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.boleta_de_compra
    ADD CONSTRAINT boleta_de_compra_codadm_fkey FOREIGN KEY (codadm) REFERENCES public.administrador(cod);
 W   ALTER TABLE ONLY public.boleta_de_compra DROP CONSTRAINT boleta_de_compra_codadm_fkey;
       public               postgres    false    224    4814    218            �           2606    16623 .   boleta_de_compra boleta_de_compra_codpago_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.boleta_de_compra
    ADD CONSTRAINT boleta_de_compra_codpago_fkey FOREIGN KEY (codpago) REFERENCES public.tipo_de_pago(cod);
 X   ALTER TABLE ONLY public.boleta_de_compra DROP CONSTRAINT boleta_de_compra_codpago_fkey;
       public               postgres    false    250    224    4852            �           2606    16628 3   boleta_de_compra boleta_de_compra_codproveedor_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.boleta_de_compra
    ADD CONSTRAINT boleta_de_compra_codproveedor_fkey FOREIGN KEY (codproveedor) REFERENCES public.proveedores(codigo);
 ]   ALTER TABLE ONLY public.boleta_de_compra DROP CONSTRAINT boleta_de_compra_codproveedor_fkey;
       public               postgres    false    4850    249    224            �           2606    16633     categoria categoria_idpadre_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.categoria
    ADD CONSTRAINT categoria_idpadre_fkey FOREIGN KEY (idpadre) REFERENCES public.categoria(id);
 J   ALTER TABLE ONLY public.categoria DROP CONSTRAINT categoria_idpadre_fkey;
       public               postgres    false    4822    225    225            �           2606    16638 #   descuento descuento_codigodesc_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.descuento
    ADD CONSTRAINT descuento_codigodesc_fkey FOREIGN KEY (codigodesc) REFERENCES public.factura(codigo);
 M   ALTER TABLE ONLY public.descuento DROP CONSTRAINT descuento_codigodesc_fkey;
       public               postgres    false    235    227    4834            �           2606    16643 8   detalle_de_compra detalle_de_compra_codboletacompra_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.detalle_de_compra
    ADD CONSTRAINT detalle_de_compra_codboletacompra_fkey FOREIGN KEY (codboletacompra) REFERENCES public.boleta_de_compra(codigo);
 b   ALTER TABLE ONLY public.detalle_de_compra DROP CONSTRAINT detalle_de_compra_codboletacompra_fkey;
       public               postgres    false    4820    229    224            �           2606    16648 7   detalle_de_compra detalle_de_compra_codigoproducto_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.detalle_de_compra
    ADD CONSTRAINT detalle_de_compra_codigoproducto_fkey FOREIGN KEY (codigoproducto) REFERENCES public.producto(codigo);
 a   ALTER TABLE ONLY public.detalle_de_compra DROP CONSTRAINT detalle_de_compra_codigoproducto_fkey;
       public               postgres    false    247    229    4848            �           2606    16653 2   detalle_de_factura detalle_de_factura_codfact_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.detalle_de_factura
    ADD CONSTRAINT detalle_de_factura_codfact_fkey FOREIGN KEY (codfact) REFERENCES public.factura(codigo);
 \   ALTER TABLE ONLY public.detalle_de_factura DROP CONSTRAINT detalle_de_factura_codfact_fkey;
       public               postgres    false    4834    235    231            �           2606    16658 2   detalle_de_factura detalle_de_factura_codprod_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.detalle_de_factura
    ADD CONSTRAINT detalle_de_factura_codprod_fkey FOREIGN KEY (codprod) REFERENCES public.producto(codigo);
 \   ALTER TABLE ONLY public.detalle_de_factura DROP CONSTRAINT detalle_de_factura_codprod_fkey;
       public               postgres    false    4848    247    231                        2606    16663 8   detalle_nota_salida detalle_nota_salida_codproducto_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.detalle_nota_salida
    ADD CONSTRAINT detalle_nota_salida_codproducto_fkey FOREIGN KEY (codproducto) REFERENCES public.producto(codigo);
 b   ALTER TABLE ONLY public.detalle_nota_salida DROP CONSTRAINT detalle_nota_salida_codproducto_fkey;
       public               postgres    false    247    4848    233                       2606    16668 6   detalle_nota_salida detalle_nota_salida_codsalida_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.detalle_nota_salida
    ADD CONSTRAINT detalle_nota_salida_codsalida_fkey FOREIGN KEY (codsalida) REFERENCES public.nota_salida(cod);
 `   ALTER TABLE ONLY public.detalle_nota_salida DROP CONSTRAINT detalle_nota_salida_codsalida_fkey;
       public               postgres    false    233    4842    241                       2606    16673    factura factura_cicliente_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.factura
    ADD CONSTRAINT factura_cicliente_fkey FOREIGN KEY (cicliente) REFERENCES public.cliente(ci);
 H   ALTER TABLE ONLY public.factura DROP CONSTRAINT factura_cicliente_fkey;
       public               postgres    false    235    226    4824                       2606    16678    factura factura_codadmin_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.factura
    ADD CONSTRAINT factura_codadmin_fkey FOREIGN KEY (codadmin) REFERENCES public.administrador(cod);
 G   ALTER TABLE ONLY public.factura DROP CONSTRAINT factura_codadmin_fkey;
       public               postgres    false    218    4814    235                       2606    16683    factura factura_codtpago_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.factura
    ADD CONSTRAINT factura_codtpago_fkey FOREIGN KEY (codtpago) REFERENCES public.tipo_de_pago(cod);
 G   ALTER TABLE ONLY public.factura DROP CONSTRAINT factura_codtpago_fkey;
       public               postgres    false    250    4852    235                       2606    16688 %   inventario inventario_codalmacen_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.inventario
    ADD CONSTRAINT inventario_codalmacen_fkey FOREIGN KEY (codalmacen) REFERENCES public.almacen(id);
 O   ALTER TABLE ONLY public.inventario DROP CONSTRAINT inventario_codalmacen_fkey;
       public               postgres    false    220    4816    237                       2606    16693 "   inventario inventario_codprod_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.inventario
    ADD CONSTRAINT inventario_codprod_fkey FOREIGN KEY (codprod) REFERENCES public.producto(codigo);
 L   ALTER TABLE ONLY public.inventario DROP CONSTRAINT inventario_codprod_fkey;
       public               postgres    false    247    237    4848                       2606    16698 3   monto_total_factura monto_total_factura_codigo_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.monto_total_factura
    ADD CONSTRAINT monto_total_factura_codigo_fkey FOREIGN KEY (codigo) REFERENCES public.factura(codigo);
 ]   ALTER TABLE ONLY public.monto_total_factura DROP CONSTRAINT monto_total_factura_codigo_fkey;
       public               postgres    false    235    239    4834                       2606    16703    permisos permisos_coduser_fkey    FK CONSTRAINT        ALTER TABLE ONLY public.permisos
    ADD CONSTRAINT permisos_coduser_fkey FOREIGN KEY (coduser) REFERENCES public.usuario(id);
 H   ALTER TABLE ONLY public.permisos DROP CONSTRAINT permisos_coduser_fkey;
       public               postgres    false    4854    253    243            	           2606    16708    producto producto_codmarca_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.producto
    ADD CONSTRAINT producto_codmarca_fkey FOREIGN KEY (codmarca) REFERENCES public.marca(codigo);
 I   ALTER TABLE ONLY public.producto DROP CONSTRAINT producto_codmarca_fkey;
       public               postgres    false    238    4838    247            
           2606    16713 %   producto producto_codprecioventa_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.producto
    ADD CONSTRAINT producto_codprecioventa_fkey FOREIGN KEY (codprecioventa) REFERENCES public.precio_venta(codigo);
 O   ALTER TABLE ONLY public.producto DROP CONSTRAINT producto_codprecioventa_fkey;
       public               postgres    false    247    245    4846                       2606    16718 "   producto producto_idcategoria_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.producto
    ADD CONSTRAINT producto_idcategoria_fkey FOREIGN KEY (idcategoria) REFERENCES public.categoria(id);
 L   ALTER TABLE ONLY public.producto DROP CONSTRAINT producto_idcategoria_fkey;
       public               postgres    false    225    247    4822                       2606    16723    usuario usuario_codadm_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_codadm_fkey FOREIGN KEY (codadm) REFERENCES public.administrador(cod);
 E   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_codadm_fkey;
       public               postgres    false    253    218    4814            �   �   x���1�0Eg�=A;iR6$���i��&���'E��������mB ���q(O��>&�B�&SC��g+��ֳ�U�����Z�dT*�!N��k ������z�$�x�r�ަġ"hc4!"���Wl�&����8X�90h�Z�\`�F�'Y6�h�o 8��T�p�bv���ԏz���x�Mn�      �   b   x�3400�t�1��M-JNL�W�-��L�,H�QHIUp�Q�/��WH��/,MUP6�	�'�$*8�VqpZpM2��$C#N#�=... ��.z      �   G  x��X͎�6>{��O��Dɖu�E���-vў��M����3@�VEa_�d��M$z��2���H��O#���2Y�B���u]�)x4�J(�WN6{׷�v�>��v���u[9�����q�}�����!�e�~\���LM�~�<����=�"G��:UgO�yi���3�۔2MY;a�(?���������71�$��l7���|��_��[���n"�4�rR�Y�]sZ��=�g���sC�z�;��c�_�L��4)8Y��|�4��/��c�/��b�����U�&=���M�IO��N�0f�R?��CA31˔�)���L�qډ����/b�6Ǧ_O3U��T�*H�E�VR�BV���;�_�Jbw�bU�[�%-�0n�Y9�ǵ[ЬD�$���"��48�C%� �{��j"yV�Y�I���mh��J�J�7��3D��dʾ %� epqY]�h�MA\VW�H�jl\��*F�	�ZVW�,�9���t�_��*D��ް��bt�_��*@�{��Ȳ��C�k�_���%nٸZI]�d㦵E��#ĭ��RB�"P�d�~U�&�YM�2��b���n��C3�_�UOݱ����O��4����Ƈ>����0��ǡ?�M�~k��OD	zt?�A�J����c;]闗���n�=k�����?���G��������Ǽ^[�wh��yn��]dص]�B(�{���P�1�$�z���軡CJ,��x�s5O�����'�߽��X��O4���Ք�[�?�ɒ����dF+	5�	�o%"\ט��zަ�WB�� ̓��o,I��gu��D�<2:d_� ���B�_H׷���`�@�{�t��~	3-X�ͿYӒ�~��2�j����nYRmeTOx~YD� $k&�M?���V���$k(b�	�&H�L�!IB�]����x�Ux\A�;���!�� ٝ�+�a\�L��z-.k&42nɋu��@��#����cmG����TR����+��#є$�d�~��͸R&�/�!'��q�é	�q��%uNV�Г��*�u���L'����X��h��O���ÿI�#�      �   k   x�-�1�0F��>�/�;4����%P`h%n_Ruy�ӧ�L
hK+=L&_��Rd|�*[�iv�� �����:4��h�H�����RN��~�tͿL)��g��_{      �   x   x�3400���t/J,NT�)M*�LN�+I�2400I����xƜ`!0_�93�4������	H�sbAirF>X�)'X&����P47�$$k�)�U��3�B]$�2KS�b���� _0�      �   �   x�m���0Dg�+����c;ݐX3KTEUD�@�,|=��w�,+�����;D%��是�S7�ŨE,�)���X�ç���cAF��ԭW�޾���܈4 ����4@�Qaz篃��M�g��,�?�Kg�y��8�      �   !   x�3400��35�2400�4�30������ 61�      �   6   x�3404�4404ƜF���z\@�L��Y�$l645 1@21z\\\ ��"      �   @   x�3400�4404Ɯ&��z\@�9\�Y�$b6�4�	r"$a#���X�c���� aLV      �      x�3400�4��ƜF\1z\\\ )(I      �   E   x�M��	�0��ԋîN���_�0$�a� %�ܳ��`1P�Z��=WU����:��E7��#��Tut�      �   B   x�M���0�7�Bt�q����axD�����_��a��%TCj�1�Ґ����v��U=��      �   $   x�3400�t��II��2400���,N������ e��      �   $   x�3400�442�30�2400Fb�p���1z\\\ ���      �   <   x�3400�,.�O��LTH+�T�MU(K�SHTHI-.HM�,�4202�50�52����� �      �   �  x�m�ݎ�0�ky�M;��eo�@���a:ǆ�_l{΄j��Eo_��ܗ�v�\�7�Ӽ�G��}��"��k��%�C|>�aӺ-\o���j�qz����N�1}đ4!��ڠɕ-r�F;�,M�[��7�j�����0��i���w����d���Y�"4�jsI��
�1�!Q����TA�$�E�D�Y}dy,���X�#s�곥�� �Ӷ��i�B�a��I��$� sc��W�c.&�J%�)ҠeAZ�l?�EJ��9��ºgJkP�ȬE�FfSC�r�H��uy�Un�"g�:��;��;B:���TC]�sHyN�QENW#�9���G��E��B��F%xB��?%��%X�w��$�w���o��������w��      �   �   x�M���0�3*&��H���:�00���F!"0~!2�.
�D�ۊ�St���?�UB��7�
-q�	Y�C�ڣ�SƐ����3�n���Bo���:��[	���O��8)��tr6��!>��?,�
H�b�ge�?G�m~?k��H       �   Y   x�M��	�0��]$?J�K���n�G���3a���@�Z�Z^I!h�X���YEO�'�wD.�0�O�7dsS���r6� ��.      �   �   x�m��n�0 �s�~ ����]�4�r�N��%C�2{KR$���[��g{�y��s,U
|H�4�7�_#�a鍉&��s�5f��+]fͰG\����G���vm؄fk�s���*�����x8\R,�p�B°�DWBF��B�_�ּ	�0(��I7�/�o&^*���,����&��������t��ιд��_kk�OA[�      �   L   x�3��HL�WHTH.M�+ITHJ�KN,�LT(�/R�2�tMKM.�,ˇ(L�,r�rRA*�S�b���� í�      �   �  x�5�K�rP ��>Gcw�
ݜ(�;�v�Q�Q����e��~��p,�Q?q[�cǽ�%�.E�V&_U�m5�1Z�	Q�s�n,/���P
� ���\�Kl/�<ull&M�5^]�����Ư���^�C����"���iV������2�����He-�H�8y�2�5����{[�\�Rm�����ׁ�U���������c��`�$���0e�ʝ������:t��z��ӂcar���h%�U�8L�D��w� GPU�ۿ4uւ��V���Oc0::�I3�롻N�iB��9~I�n����Q��4�����Ñ�(�r�n�wΐ2Q�"��|v����a�M_�\H_���]��
�����MV�}�l=Q<�!7�̹A:'*��\x�"o��5�r0@Z�z�"{�^,��4�c      �      x�3400����� 	�w     