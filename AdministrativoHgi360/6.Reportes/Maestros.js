import { Selector } from 'testcafe';
import {
    abrirReportes360,
    cerrarPestana360,
    cerrarSesion360,
    ingresarAplicacion
} from '../../Funciones/HelpersHgi360.js';
import { testAdminConfig } from '../../ParametrosPruebas/TestErpAdmin8902.js';
import { hgiAdminConfig } from '../../ParametrosPruebas/Hgi360Admin8888.js';

const PLANTILLAS = [
    { nombre: 'Indicadores', nth: 0, validarDatos: false, waitMs: 10000 },
    { nombre: 'Terceros', nth: 1, validarDatos: true, waitMs: 12000 },
    { nombre: 'Productos', nth: 2, validarDatos: true, waitMs: 12000 },
];

/** Prefijo de controles de reporte varía por aplicativo (2350001, 2650001, etc.) */
const listaPlantillas = Selector('[id$="_SlbListaPlantillas"]');
const btnGenerar = Selector('[id$="_BtnGenerar"] span').withText('Generar');
const gridSinDatos = Selector('[id$="_GridReportes"] span').withText('Sin datos');

async function generarReporte(t, { nombre, nth, validarDatos, waitMs }) {
    await t.click(listaPlantillas);

    const opcion =
        nth > 0
            ? Selector('.dx-item.dx-list-item').nth(nth).find('div').withText(nombre)
            : Selector('.dx-item.dx-list-item div').withText(nombre);

    await t.click(opcion).click(btnGenerar);

    if (waitMs > 0) {
        await t.wait(waitMs);
    }

    if (validarDatos) {
        await t.expect(gridSinDatos.visible).notOk(`El reporte ${nombre} no devolvió datos`);
    }
}

async function ejecutarPruebaMaestros(t, config, ingresar) {
    await ingresar(t, config);
    await abrirReportes360(t, 'Maestros');
    await t.wait(6000);

    for (const plantilla of PLANTILLAS) {
        await generarReporte(t, plantilla);
    }

    await cerrarPestana360(t);
    await cerrarSesion360(t);
}

fixture `Reportes Maestros - Test Happgi`
    .page(testAdminConfig.pagina);

test('Prueba Reportes Maestros - Test Happgi', async t => {
    await ejecutarPruebaMaestros(t, testAdminConfig, ingresarAplicacion);
});

fixture `Reportes Maestros - Hgi360 Admin`
    .page(hgiAdminConfig.pagina);

test('Prueba Reportes Maestros - Hgi360 Admin', async t => {
    await ejecutarPruebaMaestros(t, hgiAdminConfig, ingresarAplicacion);
});
