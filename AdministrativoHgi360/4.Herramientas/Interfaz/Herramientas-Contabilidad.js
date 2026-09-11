import { Selector } from 'testcafe';
import {
    abrirHerramientas360,
    cerrarSesion360,
    ingresarAplicacion,
    seleccionarOpcion,
    cerrarPestana360
} from '../../../Funciones/HelpersHgi360.js';
import { testAdminConfig } from '../../../ParametrosPruebas/TestErpAdmin8902.js';
import { hgiAdminConfig } from '../../../ParametrosPruebas/Hgi360Admin8888.js';

const TRANSACCION = '01 - FACTURA DE VENTA ELECTRÓNICA';
const GRUPO = '10';
const MENSAJE_PROCESO_FINALIZADO = 'Proceso finalizado.';

async function ejecutarPruebaHerramientasContabilidad(t, config) {
    await ingresarAplicacion(t, config);
        await abrirHerramientas360(t, 'Contabilidad');
        await t
            .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
            .wait(1500)
            //
            .click(Selector('#TxtContabilidad_Transaccion .dx-lookup-field'))
            ;
    await seleccionarOpcion(t, TRANSACCION);
    await t
            //.click('#txtContabilidad_Grupo .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtContabilidad_Grupo .dx-texteditor-input', GRUPO)
            .click(Selector('#BtnContabilidad_Generar span').withText('Generar'))
            .expect(Selector('#swal2-content').innerText).eql(MENSAJE_PROCESO_FINALIZADO,'Ocurrió algun error')
            .click(Selector('button').withText('Aceptar').nth(1))
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `Herramientas-Contabilidad - Test Hgi360`
    .page(testAdminConfig.pagina);

test('Prueba Contabilidad - Test Hgi360', async t => {
    await ejecutarPruebaHerramientasContabilidad(t, testAdminConfig);
});

fixture `Herramientas-Contabilidad - Hgi360 Admin`
    .page(hgiAdminConfig.pagina);

test('Prueba Contabilidad - Hgi360 Admin', async t => {
    await ejecutarPruebaHerramientasContabilidad(t, hgiAdminConfig);
});
