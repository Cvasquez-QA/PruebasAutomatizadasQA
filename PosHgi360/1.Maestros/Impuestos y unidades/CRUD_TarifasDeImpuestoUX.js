import { Selector } from 'testcafe';
import {
    ingresarAplicacion,
    abrirMaestros360,
    eliminarRegistroSiExiste,
    cerrarSesion360,
    cerrarPestana360,
    eliminarRegistroDesdeGrid,
    limpiarCacheChromeTestCafe
} from '../../../Funciones/HelpersHgi360Legacy.js';
import { testPosConfig, hgiPosConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';


async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    await abrirMaestros360(t, 'Tarifas de Impuesto', 'impuestos');
        await eliminarRegistroSiExiste(t, '#gridTarifasImpto1', CODIGO);
        await t
            .click('#gridTarifasImpto1 .dx-icon.dx-icon-add')
            .typeText('#txtIntIdCodigo', CODIGO)
            .typeText('#txtTarifaImpto1_Descripcion .dx-texteditor-input', DESCRIPCION)
            .typeText('#txtTarifaImpto1_Porcentaje .dx-texteditor-input', PORCENTAJE)
            //El sistema permite guardar una tarifa de impuesto con un porcentaje mayor a 100
            .click(Selector('#BtnGuardarTarifaImpto1 span').withText('Guardar'))
        //Se valida la creación
            .wait(4000)
            .expect(Selector('#gridTarifasImpto1 td').withText(CODIGO).exists).ok()
        //Se edita
            .click(Selector('#gridTarifasImpto1 [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
            .click('#txtTarifaImpto1_Descripcion .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtTarifaImpto1_Descripcion .dx-texteditor-input', DESCRIPCION_EDIT)
            .click('#txtTarifaImpto1_Porcentaje .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtTarifaImpto1_Porcentaje .dx-texteditor-input', PORCENTAJE_EDIT)
            .click(Selector('#BtnGuardarTarifaImpto1 span').withText('Guardar'))
            .wait(4000)
        //Se elimina la tarifa de impuesto
            ;
        await eliminarRegistroDesdeGrid(t, '#gridTarifasImpto1');
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `Prueba Tarifa de Impuesto testerp Pos - Test Hgi360`
    .page(testPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Test Hgi360 - Prueba Tarifa de Impuesto mierp CRUD ', async t => {
    await ejecutarPrueba(t, testPosConfig);
});

fixture `Prueba Tarifa de Impuesto testerp Pos - Hgi360 Pos`
    .page(hgiPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Test Hgi360 - Prueba Tarifa de Impuesto mierp CRUD ', async t => {
    await ejecutarPrueba(t, hgiPosConfig);
});
