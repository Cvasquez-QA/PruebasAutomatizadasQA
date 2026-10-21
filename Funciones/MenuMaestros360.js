import { Selector } from 'testcafe';

/**
 * Menú Maestros de test.hgi360.com (React): abre un maestro desplegando antes el "Ver más" correcto.
 *
 * Las tarjetas del menú no tienen el mismo orden ni los mismos "Ver más" en todos los módulos
 * (revisado el 19-oct-2026). El índice es la posición del botón entre los "Ver más" visibles:
 *
 *   Módulo          Productos  Terceros  Localización  Impuestos y Unidades
 *   Administrativo      0          1           2                3
 *   POS                 0          1       (no tiene)           2
 *   PH                  0          1           2                3
 *
 * Configuración, Otras Aplicaciones y Copropiedades no tienen "Ver más".
 */
export const VER_MAS_POR_MODULO = {
    admin: { productos: 0, terceros: 1, localizacion: 2, impuestos: 3 },
    pos: { productos: 0, terceros: 1, localizacion: null, impuestos: 2 },
    ph: { productos: 0, terceros: 1, localizacion: 2, impuestos: 3 }
};

/** Tarjeta de cada maestro (para las pruebas que llaman sin indicar el grupo). */
const GRUPOS = {
    productos: ['Lineas', 'Grupos', 'Clases', 'Tipos', 'Productos', 'Ensamble', 'Cajas', 'Tallas', 'Colores',
        'Característica', 'Caracteristica', 'Categorias', 'Establecimientos', 'Estaciones',
        'Parametro11', 'Parametro22', 'Parametro33', 'Parametro44', 'Parametro55', 'Parametro66',
        'ParametroPos1', 'ParametroPos2', 'PP1', 'PP2', 'PP3'],
    terceros: ['Tipos Tercero', 'Terceros', 'Vendedores', 'Actividades Eco', 'Categoria Puntos', 'Cargos',
        'Parentesco', 'Subsector', 'PT1', 'PT11', 'PT22', 'PT33', 'PT44', 'PT55'],
    localizacion: ['Bodegas', 'Zonas', 'Ciudades', 'Barrios', 'Ubicaciones', 'Sectores', 'Centro de Costo',
        'Subcentro de Costo', 'Sucursales', 'ParamDoc11', 'Parametro Doc1'],
    impuestos: ['Tarifas de Iva', 'Maestro de Retención', 'Formas de Pago', 'Conceptos Pago', 'Unidades', 'Bancos',
        'Tarifas de Impuesto', 'Tarifas Aut. Retención', 'Denominaciones', 'Monedas', 'Entidades Financieras',
        'Tarifas CREE']
};

const grupoDeMaestro = nombre =>
    Object.keys(GRUPOS).find(grupo => GRUPOS[grupo].includes(nombre)) || null;

/** 'Pos' -> 'pos', 'PH' -> 'ph', 'Administración' -> 'admin'; otro módulo -> null (despliega todos). */
export const moduloDeConfig = config => {
    const modulo = String((config && config.modulo) || '').trim().toLowerCase();
    if (modulo === 'pos') {
        return 'pos';
    }
    if (modulo === 'ph' || modulo === 'propiedad horizontal') {
        return 'ph';
    }
    if (modulo.startsWith('administra')) {
        return 'admin';
    }
    return null;
};

const opcionMaestro = nombre => Selector('#ErpMenuCardGrid .erp-menu-child-text')
    .withExactText(nombre)
    .filterVisible();
const botonesVerMas = Selector('#ErpMenuCardGrid .erp-menu-card-vermas').filterVisible();

/** Pulsa un "Ver más" solo si la tarjeta está recogida (si ya dice "Ver menos" no lo toca). */
async function desplegar(t, boton) {
    if (!await boton.exists) {
        return;
    }
    const texto = (await boton.innerText) || '';
    if (/menos/i.test(texto)) {
        return;
    }
    await t.click(boton).wait(1000);
}

/**
 * Abre un maestro del menú Maestros del módulo indicado ('admin' | 'pos' | 'ph' | null).
 * grupo: 'productos' | 'terceros' | 'localizacion' | 'impuestos' (si no se pasa, se deduce del nombre).
 * Con módulo o grupo desconocido despliega todos los "Ver más".
 */
export async function abrirMaestroModulo360(t, modulo, nombreMaestro, grupo = null) {
    const opcion = opcionMaestro(nombreMaestro);
    const tarjeta = grupo || grupoDeMaestro(nombreMaestro);
    const mapa = VER_MAS_POR_MODULO[modulo];

    await t
        .switchToMainWindow()
        .click(Selector('#ErpSidebarModulos span').withExactText('Maestros'))
        .expect(Selector('#ErpMenuCardGrid').filterVisible().with({ timeout: 15000 }).exists)
        .ok('No abrió el menú Maestros');

    if (!await opcion.with({ timeout: 2500 }).exists) {
        if (mapa && tarjeta && Object.prototype.hasOwnProperty.call(mapa, tarjeta)) {
            const indice = mapa[tarjeta];
            if (indice !== null) {
                await desplegar(t, botonesVerMas.nth(indice));
            }
        } else {
            const total = await botonesVerMas.count;
            for (let i = 0; i < total; i++) {
                await desplegar(t, botonesVerMas.nth(i));
            }
        }
    }

    await t
        .expect(opcion.with({ timeout: 8000 }).exists)
        .ok(`No se encontró el maestro "${nombreMaestro}" en el menú Maestros (módulo=${modulo || 'otro'}, tarjeta=${tarjeta || 'desconocida'})`)
        .click(opcion)
        .wait(1500);
}

/** Igual que abrirMaestroModulo360, tomando el módulo de config.modulo. */
export const abrirMaestroConfig360 = (t, config, nombreMaestro, grupo = null) =>
    abrirMaestroModulo360(t, moduloDeConfig(config), nombreMaestro, grupo);

export const abrirMaestroAdmin360 = (t, nombreMaestro, grupo = null) =>
    abrirMaestroModulo360(t, 'admin', nombreMaestro, grupo);

export const abrirMaestroPos360 = (t, nombreMaestro, grupo = null) =>
    abrirMaestroModulo360(t, 'pos', nombreMaestro, grupo);

export const abrirMaestroPh360 = (t, nombreMaestro, grupo = null) =>
    abrirMaestroModulo360(t, 'ph', nombreMaestro, grupo);
