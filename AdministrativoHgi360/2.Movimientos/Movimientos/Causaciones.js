import { Selector } from 'testcafe';
import {
    abrirMovimientos360,
    cerrarPestana360,
    cerrarSesion360,
    filtrarPor,
    ingresarAplicacion,
    seleccionarOpcion,
    parseTextoNumerico,
    parseValorNumerico
} from '../../../Funciones/HelpersHgi360.js';
import { testAdminConfig } from '../../../ParametrosPruebas/TestErpAdmin8902.js';
import { hgiAdminConfig } from '../../../ParametrosPruebas/Hgi360Admin8888.js';

const TX_DOCUMENTO = '25';

const CANTIDAD_1 = '1';
const VALOR_UNITARIO_1 = '1000';
const TERCERO = '1000099598'
const TERCERO_NUEVO = 'hgi';
const CLASE = '01';
const SUCURSAL = 'GENERAL';
var docRef = 0; 
const TX_CAUSACION = '04'
const CUENTA_1 = '11050501';
const VALOR_ESPERADO = '1000';

async function ejecutarPrueba(t, config, ingresar) {
    await ingresar(t, config);
        await abrirMovimientos360(t, 'Causaciones');
        await t
            .click('#ListagridDocumentosCausaciones .dx-icon.dx-icon-add')
            .wait(4000)
        await t
        .click(Selector('#Causacion_Transaccion .dx-lookup-field'))
        await filtrarPor(t,TX_CAUSACION)
        await seleccionarOpcion(t, TX_CAUSACION)
        /*
            .typeText(Selector('#Causacion_Transaccion .dx-lookup-field'), 'CAUSACIONES')
            .wait(1500)
            .pressKey('down')
            .pressKey('enter')
            .wait(1500)
            */
        await t
            .click('#Causacion_Tercero .dx-lookup-field')
        await filtrarPor(t,TERCERO)
        await seleccionarOpcion(t, TERCERO)
        await t
            .click('#Causacion_Clase .dx-lookup-field')
            await filtrarPor(t,CLASE)
            await seleccionarOpcion(t, CLASE)
        await t
        .click('#Causacion_Sucursal .dx-lookup-field')
        await filtrarPor(t,SUCURSAL)
        await seleccionarOpcion(t, SUCURSAL)
         await t
        .click(Selector('#BtnGuardarCausacion span').withText('Guardar'))
            while (await Selector('#swal2-content').withText('existe').visible){
                await t 
                .click(Selector('button').withText('Aceptar'))
                .click('#txtDocumentoCausacion_Referencia .dx-texteditor-input')
                .pressKey('ctrl+a')
                .pressKey('backspace')
                docRef = docRef + 1;
                await t
                .typeText('#txtDocumentoCausacion_Referencia .dx-texteditor-input', String(docRef))
                .click(Selector('#BtnGuardarCausacion span').withText('Guardar'))
            }

        await t
            .click('#txtCausacion_Detalle_Cuenta_1 .dx-icon.dx-icon-search')
            .wait(3000)
        await t
            .doubleClick(Selector('td').withText(CUENTA_1))
            .pressKey('enter')
        await t
            .typeText('#txtdocumento_detalle_causacion_cursor_1', 'pruebaCausacion')
            .pressKey('enter')
            .doubleClick('#txtdocumento_detalle_causacion_Valor_cursor_1')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtdocumento_detalle_causacion_Valor_cursor_1', VALOR_ESPERADO)
            .pressKey('enter')
        await t/*
            .pressKey('enter')
        await t
            .pressKey('enter')
            .pressKey('enter')
            .pressKey('enter')
            .pressKey('enter')
            .pressKey('enter')
            .pressKey('enter')
            .pressKey('enter')
            */
            .click('#txtdocumento_detalle_causacion_Boton_1 .dx-icon.dx-icon-check')
        const numCausacion = Selector('#txtDocumentoCausacion');
        const numero = await numCausacion.value;
        await t
            .click(Selector('#BtnAtrasCausacion span').withText('Atrás'))
        await t
            .click('#ListagridDocumentosCausaciones .dx-icon.dx-icon-add')
            .wait(3000)
        await t
        .click(Selector('#Causacion_Transaccion .dx-lookup-field'))
        await filtrarPor(t,TX_CAUSACION)
        await seleccionarOpcion(t, TX_CAUSACION)
        await t
        .typeText(Selector('#txtDocumentoCausacion'),numero)
            .pressKey('enter')
            .wait(3000)
            const valorCausacion = await parseValorNumerico(Selector('#txtDocumentoCausacion_Total .dx-texteditor-input'));
            await t.expect(valorCausacion).eql(parseInt(VALOR_ESPERADO, 10), 'El valor no es el total de la causacion creada previamente')
        await t
            .click('#BtnEliminarCausacion .dx-icon.dx-icon-trash')
        
            .click(Selector('.swal2-actions button').withText('Aceptar'))
            .wait(2000);
    
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `Prueba Causaciones - Test Hgi360`
    .page(testAdminConfig.pagina);

test('Prueba Causaciones admin - Test Hgi360', async t => {
    await ejecutarPrueba(t, testAdminConfig, ingresarAplicacion);
});

fixture `Prueba Causaciones - Hgi360 Admin`
    .page(hgiAdminConfig.pagina);

test('Prueba Causaciones admin - Hgi360 Admin', async t => {
    await ejecutarPrueba(t, hgiAdminConfig, ingresarAplicacion);
});
