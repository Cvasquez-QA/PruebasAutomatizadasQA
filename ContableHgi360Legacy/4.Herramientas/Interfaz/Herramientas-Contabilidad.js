import { Selector } from 'testcafe';
import { abrirHerramientas, cerrarSesion360, ingresarAplicacion, seleccionarOpcion, cerrarPestana360, ingresarAplicacionMiHappgi } from '../../../Funciones/HelpersHgi360Legacy.js';
import { miContableConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js'; 
import { testContableConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js'; 

const TRANSACCION = '01 - FACTURA DE VENTA ELECTRÓNICA';
const GRUPO = '10';
const MENSAJE_PROCESO_FINALIZADO = 'Proceso finalizado.';


async function ejecutarPruebaHerramientasContabilidad(t, config, ingresar) {
    await ingresar(t, config);
        await abrirHerramientas(t, 'CONTABILIDAD');
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

fixture `Herramientas-Contabilidad - Mi ERP`
    .page(miContableConfig.pagina);

test('Prueba Contabilidad - Mi ERP', async t => {
    await ejecutarPruebaHerramientasContabilidad(t, miContableConfig, ingresarAplicacionMiHappgi);
});

fixture `Herramientas-Contabilidad - Test Contable`
    .page(testContableConfig.pagina);

test('Prueba Contabilidad - Test Contable', async t => {
    await ejecutarPruebaHerramientasContabilidad(t, testContableConfig, ingresarAplicacion);
});
