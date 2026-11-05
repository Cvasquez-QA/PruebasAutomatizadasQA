import { Selector } from 'testcafe';
import { abrirMaestros360, cerrarSesion360, ingresarAplicacion, cerrarPestana360, ingresarAplicacionMiHappgi } from '../../../../../Funciones/HelpersHgi360Legacy.js';
import { miContableConfig } from '../../../../../ParametrosPruebas/ParametrosPruebas.js'; 
import { testContableConfig } from '../../../../../ParametrosPruebas/ParametrosPruebas.js'; 

const CODIGO_TRANSACCION = '01';
const DESCRIPCION_TRANSACCION = 'pruebaDuplicado';
const CODIGO_CALENDARIO = '01';


async function ejecutarPruebaConfiguracion(t, config, ingresar) {
    await ingresar(t, config);
        await abrirMaestros360(t, 'Transacciones');
        await t
            .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
            .wait(1500)
            .click('#gridTransacciones .dx-icon.dx-icon-add')
            .typeText('#txtIntIdTransaccion', CODIGO_TRANSACCION)
            .typeText('#TxtTransaccion_Descripcion .dx-texteditor-input', DESCRIPCION_TRANSACCION)
            .click(Selector('#BtnGuardarTransaccion span').withText('Guardar'))
            let mensaje= Selector('#swal2-content').innerText;
            await t
            .expect(mensaje).contains('Ya existe un registro con','El sistema no está mostrando el mensaje prestablecido para cuando se inserta un duplicado')//Código '2025-72' Error inesperado al agregar la entidad.
            .click(Selector('button').withText('Aceptar').nth(1))
            .wait(2000);
    /////PRUEBA CALENDARIO
        //Se ingresa al maestro de Calendario
            
        await cerrarPestana360(t);
        await abrirMaestros360(t, 'Calendario');
        await t
            .click('#gridCalendario .dx-icon.dx-icon-add')
            .typeText('#txtIdCalendario', CODIGO_CALENDARIO)
            .wait(200)
            .click('#txtCalendario_FechaInicial .dx-texteditor-input')
            .pressKey('2')
            .pressKey('0')
            .pressKey('2')
            .pressKey('5')
            .pressKey('0')
            .pressKey('1')
            .pressKey('0')
            .pressKey('1')
            //.typeText('#txtCalendario_FechaInicial .dx-dropdowneditor-icon','2024-09-01')
            //.typeText('#txtCalendario_FechaFinal .dx-dropdowneditor-icon','2024-09-01')
            .doubleClick('#txtCalendario_FechaFinal .dx-texteditor-input')
            .pressKey('2')
            .pressKey('0')
            .pressKey('2')
            .pressKey('5')
            .pressKey('0')
            .pressKey('1')
            .pressKey('3')
            .pressKey('1')
            .click(Selector('#BtnGuardarCalendario div').withText('Guardar'))
            .wait(1000)
            .click(Selector('button').withText('Aceptar').nth(1))
            //.click(Selector('#BtnGuardarCalendario div').withText('Guardar'))
            .expect(mensaje).contains('Ya existe un registro con','El sistema no está mostrando el mensaje prestablecido para cuando se inserta un duplicado')//Código '2025-72' Error inesperado al agregar la entidad.;
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `Configuracion - Mi ERP`
    .page(miContableConfig.pagina);

test('Prueba Inserción Duplicados - CONFIGURACIÓN - Mi ERP', async t => {
    await ejecutarPruebaConfiguracion(t, miContableConfig, ingresarAplicacionMiHappgi);
});

fixture `Configuracion - Test Contable`
    .page(testContableConfig.pagina);

test('Prueba Inserción Duplicados - CONFIGURACIÓN - Test Contable', async t => {
    await ejecutarPruebaConfiguracion(t, testContableConfig, ingresarAplicacion);
});
