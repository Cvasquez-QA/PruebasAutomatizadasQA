import { Selector } from 'testcafe';
import {
    ingresarAplicacion,
    abrirMaestros360,
    cerrarSesion360,
    cerrarPestana360,
    limpiarCacheChromeTestCafe,
    nuevoRegistroGrid360,
    filaGrid360,
    accionFilaGrid360,
    eliminarFilaSiExiste360
} from '../../../Funciones/HelpersHgi360Web.js';
import { testAdminConfig, hgiAdminConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// mi.hgi360.com (React):
//  - grid [data-testid="gridTransacciones"], botón Nuevo #BtnNuevoTransacciones
//  - el código ahora es #TxtTransaccion_Codigo y admite máximo 5 caracteres
//    (el antiguo 'mitransaccion123' quedaba truncado y la validación del grid fallaba)
const GRID = 'gridTransacciones';
const CODIGO = 'QAT01';
const DESCRIPCION = 'midesctransaccion';
const DESCRIPCION_EDIT = 'minuevadesc';

const campoCodigo = Selector('#TxtTransaccion_Codigo .dx-texteditor-input, #txtIntIdTransaccion').filterVisible();
const campoDescripcion = Selector('#TxtTransaccion_Descripcion .dx-texteditor-input');
const btnGuardar = Selector('#BtnGuardarTransaccion').filterVisible();

async function ejecutarPrueba(t, config, ingresar) {
    await ingresar(t, config);
    await abrirMaestros360(t, 'Transacciones');
    await eliminarFilaSiExiste360(t, GRID, CODIGO);

    // Crear
    await nuevoRegistroGrid360(t, GRID);
    await t
        .typeText(campoCodigo.with({ timeout: 10000 }), CODIGO, { replace: true })
        .typeText(campoDescripcion, DESCRIPCION, { replace: true })
        .click(btnGuardar)
        .expect(filaGrid360(GRID, CODIGO).with({ timeout: 15000 }).exists)
        .ok('No se encontró la transacción creada');

    // Editar
    await accionFilaGrid360(t, GRID, CODIGO, 'Editar');
    await t
        .typeText(campoDescripcion.with({ timeout: 10000 }), DESCRIPCION_EDIT, { replace: true })
        .click(btnGuardar)
        .expect(filaGrid360(GRID, DESCRIPCION_EDIT).with({ timeout: 15000 }).exists)
        .ok('No se encontró la transacción actualizada');

    // Eliminar
    await eliminarFilaSiExiste360(t, GRID, CODIGO);
    await cerrarPestana360(t);
    await cerrarSesion360(t);
}

fixture `Prueba CRUD Transaccion - Test Hgi360`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba CRUD Transaccion Test Hgi360 - Test Hgi360', async t => {
    await ejecutarPrueba(t, testAdminConfig, ingresarAplicacion);
});

fixture `Prueba CRUD Transaccion - Hgi360 Admin`
    .page(hgiAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba CRUD Transaccion - Hgi360 Admin', async t => {
    await ejecutarPrueba(t, hgiAdminConfig, ingresarAplicacion);
});
