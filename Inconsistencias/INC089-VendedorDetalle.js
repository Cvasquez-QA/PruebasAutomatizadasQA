import { Selector } from 'testcafe';
import * as HelpersHgi360 from '../../Funciones/HelpersHgi360.js';
import * as HelpersHappgi from '../../Funciones/HelpersHappgi.js';
import { testAdminConfig } from '../../ParametrosPruebas/TestErpAdmin8902.js';

const helpersDe = (config) =>
    String(config?.pagina || '').toLowerCase().includes('hgi360')
        ? HelpersHgi360
        : HelpersHappgi;

const esHgi360 = (config) =>
    String(config?.pagina || '').toLowerCase().includes('hgi360');

let abrirMovimiento = HelpersHappgi.abrirMovimiento;
let abrirTransaccion = HelpersHappgi.abrirTransaccion;
let cerrarSesion = HelpersHappgi.cerrarSesion;
let ingresarAplicacion = HelpersHappgi.ingresarAplicacion;

const usarHelpersDe = (config) => {
    const h = helpersDe(config);
    abrirMovimiento = esHgi360(config) ? h.abrirMovimientos360 : h.abrirMovimiento;
    abrirTransaccion = h.abrirTransaccion;
    cerrarSesion = esHgi360(config)
        ? (h.cerrarSesion360 || HelpersHgi360.cerrarSesion360)
        : h.cerrarSesion;
    ingresarAplicacion = h.ingresarAplicacion;
};

async function ejecutarPrueba(t, config) {
    usarHelpersDe(config);
    await ingresarAplicacion(t, config);
    await abrirMovimiento(t, esHgi360(config) ? 'Documentos' : 'DOCUMENTOS');
    await t.click('#ListagridDocumentos .dx-icon.dx-icon-add');
    await abrirTransaccion(t, 'INC089');
    await t
        .wait(1500)
        .click(Selector('#BtnGuardarDocumento div').withText('Guardar'))
        .wait(2000)
        .expect(Selector('#txtDocumento_Detalle_Vendedor_cursor_1').visible).ok('No está el campo Vendedor en el detalle')
        .click('#txtDocumento_Detalle_Vendedor_cursor_1')
        .expect(Selector('#txtDocumento_Detalle_Vendedor_cursor_1').focused).ok('El foco no está en el campo Vendedor del detalle')
        .switchToMainWindow();
    await cerrarSesion(t);
}

fixture `Prueba Vendedor Detalle INC089 testHGI360 Contable`
    .page(testAdminConfig.pagina);

test('Prueba Vendedor Detalle INC089 test Hgi360 contable', async t => {
    await ejecutarPrueba(t, testAdminConfig);
});
