import { Selector } from 'testcafe';
import {
    ingresarAplicacion,
    abrirMaestros360,
    eliminarRegistroSiExiste,
    cerrarSesion360,
    cerrarPestana360,
    eliminarRegistroDesdeGrid
} from '../../../Funciones/HelpersHgi360.js';
import { testAdminConfig } from '../../../ParametrosPruebas/TestErpAdmin8902.js';
import { hgiAdminConfig } from '../../../ParametrosPruebas/Hgi360Admin8888.js';

const CODIGO = '1234567';
const DESCRIPCION = 'MIDESC123';
const PORCENTAJE = '87500';
const DESCRIPCION_EDIT = 'MINUEVADESC';
const PORCENTAJE_EDIT = '10278';

async function ejecutarPrueba(t, config, ingresar) {
    await ingresar(t, config);
        await abrirMaestros360(t, 'Tarifas Aut. Retención', 'impuestos');
        await eliminarRegistroSiExiste(t, '#gridTarifasCree', CODIGO);
        await t
            .click('#gridTarifasCree .dx-icon.dx-icon-add')
            .typeText('#txtTarifaCree_Idfoco', CODIGO)
            .typeText('#txtTarifaCree_Descripcion .dx-texteditor-input', DESCRIPCION)
            .typeText('#txtTarifaCree_PorTar .dx-texteditor-input', PORCENTAJE)
            .click(Selector('#BtnGuardarTarifaCree span').withText('Guardar'))
            .wait(4000)
            .expect(Selector('#gridTarifasCree td').withText(CODIGO).exists).ok()
            .click(Selector('#gridTarifasCree [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
            .click('#txtTarifaCree_Descripcion .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtTarifaCree_Descripcion .dx-texteditor-input', DESCRIPCION_EDIT)
            .click('#txtTarifaCree_PorTar .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtTarifaCree_PorTar .dx-texteditor-input', PORCENTAJE_EDIT)
            .click(Selector('#BtnGuardarTarifaCree span').withText('Guardar'))
            .wait(2000);
        await eliminarRegistroDesdeGrid(t, '#gridTarifasCree');;
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `Prueba Tarifa AUT. RETENCION - Test Hgi360`
    .page(testAdminConfig.pagina);

test('Prueba Tarifa AUT. RETENCIÓN Test Hgi360 - Test Hgi360', async t => {
    await ejecutarPrueba(t, testAdminConfig, ingresarAplicacion);
});

fixture `Prueba Tarifa AUT. RETENCION - Hgi360 Admin`
    .page(hgiAdminConfig.pagina);

test('Prueba Tarifa AUT. RETENCIÓN - Hgi360 Admin', async t => {
    await ejecutarPrueba(t, hgiAdminConfig, ingresarAplicacion);
});
