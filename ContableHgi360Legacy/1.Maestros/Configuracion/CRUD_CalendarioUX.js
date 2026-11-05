import { Selector } from 'testcafe';
import { eliminarRegistroSiExiste, ingresarAplicacion, abrirMaestros360, cerrarSesion360, cerrarPestana360, ingresarAplicacionMiHappgi } from '../../../Funciones/HelpersHgi360Legacy.js';
import { miContableConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js'; 
import { testContableConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js'; 

const CODIGO = '81';
const FESTIVOS = '4';


async function ejecutarPruebaCalendario(t, config, ingresar) {
    await ingresar(t, config);
        //Se ingresa al maestro de Calendario
        await abrirMaestros360(t, 'Calendario');
        await eliminarRegistroSiExiste(t, '#gridCalendario', CODIGO, 1);
        await t
            .click('#gridCalendario .dx-icon.dx-icon-add')
            .typeText('#txtIdCalendario', CODIGO)
            .wait(2000)
            .click('#txtCalendario_FechaInicial .dx-texteditor-input')
            .pressKey('2')
            .pressKey('0')
            .pressKey('2')
            .pressKey('6')
            .pressKey('0')
            .pressKey('2')
            .pressKey('0')
            .pressKey('3')
            //.typeText('#txtCalendario_FechaInicial .dx-dropdowneditor-icon','2024-09-01')
            //.typeText('#txtCalendario_FechaFinal .dx-dropdowneditor-icon','2024-09-01')
            .doubleClick('#txtCalendario_FechaFinal .dx-texteditor-input')
            .pressKey('2')
            .pressKey('0')
            .pressKey('2')
            .pressKey('6')
            .pressKey('0')
            .pressKey('2')
            .pressKey('0')
            .pressKey('3')
            .click(Selector('#BtnGuardarCalendario div').withText('Guardar'))
            .wait(2000)
            .click(Selector('#BtnGuardarCalendario div').withText('Guardar'))
        //Se valida la creación 
            .wait(4000)
            .expect(Selector('#gridCalendario td').withText(CODIGO).visible).ok()
        //Se edita 
            .click(Selector('#gridCalendario [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
            .typeText('#txtCalendario_Festivos .dx-texteditor-input', FESTIVOS)
            .click(Selector('#BtnGuardarCalendario div').withText('Guardar'))
           // .click(Selector('button').withText('Aceptar').nth(1))
            .wait(4000)
        //Se elimina el Calendario
            await eliminarRegistroSiExiste(t, '#gridCalendario', CODIGO, 1);
       await cerrarPestana360(t);
       await cerrarSesion360(t);
}

fixture `CRUD_CalendarioUX - Mi ERP`
    .page(miContableConfig.pagina);

test('Prueba Calendario Mi Contable CRUD - Mi ERP', async t => {
    await ejecutarPruebaCalendario(t, miContableConfig, ingresarAplicacionMiHappgi);
});

fixture `CRUD_CalendarioUX - Test Contable`
    .page(testContableConfig.pagina);

test('Prueba Calendario Mi Contable CRUD - Test Contable', async t => {
    await ejecutarPruebaCalendario(t, testContableConfig, ingresarAplicacion);
});
