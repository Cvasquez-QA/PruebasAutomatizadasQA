import { Selector } from 'testcafe';
import {
    ingresarAplicacion,
    eliminarRegistroSiExiste,
    cerrarSesion360,
    cerrarPestana360,
    eliminarRegistroDesdeGrid,
    limpiarCacheChromeTestCafe
} from '../../../Funciones/HelpersHgi360Legacy.js';
import { abrirMaestroPos360 as abrirMaestros360 } from '../../../Funciones/MenuMaestros360.js';
import { testPosConfig, hgiPosConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';


async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    await abrirMaestros360(t, 'Tarifas Aut. Retención', 'impuestos');
        await eliminarRegistroSiExiste(t, '#gridTarifasCree', CODIGO);
        await t
            .click('#gridTarifasCree .dx-icon.dx-icon-add')
            .typeText('#txtTarifaCree_Idfoco', CODIGO)
            .typeText('#txtTarifaCree_Descripcion .dx-texteditor-input', DESCRIPCION)
            .typeText('#txtTarifaCree_PorTar .dx-texteditor-input', PORCENTAJE_TARIFA)
            //El sistema permite guardar una Tarifa CREE con un porcentaje mayor a 100 PERO este lo redondea
            .click(Selector('#BtnGuardarTarifaCree span').withText('Guardar'))
        //Se valida la creación
            .wait(4000)
            .expect(Selector('#gridTarifasCree td').withText(CODIGO).exists).ok()
        //Se edita
            .click(Selector('#gridTarifasCree [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
            .click('#txtTarifaCree_Descripcion .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtTarifaCree_Descripcion .dx-texteditor-input', DESCRIPCION_EDIT)
            .click('#txtTarifaCree_PorTar .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtTarifaCree_PorTar .dx-texteditor-input', PORCENTAJE_TARIFA_EDIT)
            .click(Selector('#BtnGuardarTarifaCree span').withText('Guardar'))
        //Se celiminar
            .wait(2000);
        await eliminarRegistroDesdeGrid(t, '#gridTarifasCree');
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `Prueba Tarifa AUT. RETENCION Pos testerp - Test Hgi360`
    .page(testPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Test Hgi360 - Prueba Tarifa AUT. RETENCIÓN MIERP ', async t => {
    await ejecutarPrueba(t, testPosConfig);
});

fixture `Prueba Tarifa AUT. RETENCION Pos testerp - Hgi360 Pos`
    .page(hgiPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Test Hgi360 - Prueba Tarifa AUT. RETENCIÓN MIERP ', async t => {
    await ejecutarPrueba(t, hgiPosConfig);
});
