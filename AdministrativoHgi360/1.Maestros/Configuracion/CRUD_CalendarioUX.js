import { Selector } from 'testcafe';
import {
    eliminarRegistroSiExiste,
    ingresarAplicacion,
    abrirMaestros360,
    cerrarSesion360,
    cerrarPestana360
} from '../../../Funciones/HelpersHgi360.js';
import { testAdminConfig } from '../../../ParametrosPruebas/TestErpAdmin8902.js';
import { hgiAdminConfig } from '../../../ParametrosPruebas/Hgi360Admin8888.js';

const CODIGO = '81';
const FESTIVOS = '4';

async function ejecutarPrueba(t, config, ingresar) {
    await ingresar(t, config);
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
            .wait(4000)
            .expect(Selector('#gridCalendario td').withText(CODIGO).visible).ok()
            .click(Selector('#gridCalendario [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
            .typeText('#txtCalendario_Festivos .dx-texteditor-input', FESTIVOS)
            .click(Selector('#BtnGuardarCalendario div').withText('Guardar'))
            .wait(4000);
        await eliminarRegistroSiExiste(t, '#gridCalendario', CODIGO, 1);
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `Prueba Calendario - Test Hgi360`
    .page(testAdminConfig.pagina);

test('Prueba Calendario Hgi360 CRUD - Test Hgi360', async t => {
    await ejecutarPrueba(t, testAdminConfig, ingresarAplicacion);
});

fixture `Prueba Calendario - Hgi360 Admin`
    .page(hgiAdminConfig.pagina);

test('Prueba Calendario Hgi360 CRUD - Hgi360 Admin', async t => {
    await ejecutarPrueba(t, hgiAdminConfig, ingresarAplicacion);
});
