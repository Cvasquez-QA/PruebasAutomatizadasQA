import { Selector } from 'testcafe';
import {
    abrirMovimientos360,
    cerrarPestana360,
    cerrarSesion360,
    filtrarPor,
    ingresarAplicacion,
    selectorOpcion,
} from '../../Funciones/HelpersHgi360.js';
import { hgi360AdminConfig } from '../../ParametrosPruebas/Hgi360Admin8888.js';
import { testAdminConfig } from '../../ParametrosPruebas/TestErpAdmin8902.js';

const TX_DOCUMENTO = '25';

const CANTIDAD_1 = '1';
const VALOR_UNITARIO_1 = '1000';
const TERCERO = '1000099598'
const TERCERO_NUEVO = 'hgi';
const CLASE = '01 - SOFTWARE';
var docRef = 0; 
const TX_CAUSACION = 'CAUSACION'
const CUENTA_1 = '11050501';
const CUENTA_2 = '11050502';
const VALOR = '1000';
const SUCURSAL = '0';
const CCOSTO = 'Inactivo'

async function ejecutarPrueba(t, config, ingresar) {
    await ingresar(t, config);
        await abrirMovimientos360(t, 'Causaciones');
        await t
            .click('#ListagridDocumentosCausaciones .dx-icon.dx-icon-add')
            .wait(4000)
        await t
        .click(Selector('#Causacion_Transaccion .dx-lookup-field'))
            //.typeText(Selector('#Causacion_Transaccion .dx-lookup-field'), 'CAUSACIONES')
            .pressKey('C+A+J+A')
            .wait(1500)
            .pressKey('down')
            .pressKey('enter')
            .wait(1500)
        await t
            .click('#Causacion_Tercero .dx-lookup-field')
        await filtrarPor(t,TERCERO)
        await t.click(selectorOpcion(TERCERO))
        await t
        /*
        .click('#Causacion_Sucursal .dx-lookup-field')
        await filtrarPor(t,SUCURSAL)
        await t.click(selectorOpcion(SUCURSAL))
    await t
    */
    await t
        .click(Selector('#Causacion_Ccosto .dx-lookup-field'))
        await filtrarPor(t,CCOSTO)
        await t.click(selectorOpcion(CCOSTO))
    await t
    
        .click(Selector('#BtnGuardarCausacion span').withText('Guardar'))
            while (await Selector('#swal2-content').withText('existe').visible){
                await t 
                .click('#txtDocumentoCausacion_Referencia .dx-texteditor-input')
            await t
                .pressKey('ctrl+a')
                .pressKey('backspace')
                docRef = docRef + 1;
                await t
                .typeText('#txtDocumentoCausacion_Referencia .dx-texteditor-input', String(docRef))
                .click(Selector('#BtnGuardarCausacion span').withText('Guardar'))
                .click(Selector('button').withText('Aceptar'))
            }

        await t
        .expect(Selector('.dx-overlay-content.dx-toast-error.dx-toast-content div').withText('El centro de costo seleccionado estÃ¡ inactivo').visible).ok('No se tiene el control del CCosto Inactivo')
    
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `Prueba INC106 Control CCosto en Causaciones - Test Hgi360`
    .page(testAdminConfig.pagina);

test('Prueba INC106 Control CCosto en Causaciones admin - Test Hgi360', async t => {
    await ejecutarPrueba(t, testAdminConfig, ingresarAplicacion);
});

fixture `Prueba INC106 Control CCosto en Causaciones - Hgi360`
    .page(hgi360AdminConfig.pagina);

test('Prueba INC106 Control CCosto en Causaciones Test Hgi360 admin - Mi Hgi360', async t => {
    await ejecutarPrueba(t, hgi360AdminConfig, ingresarAplicacion);
});