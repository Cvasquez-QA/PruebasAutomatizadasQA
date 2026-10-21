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
    await abrirMaestros360(t, 'Tarifas de Iva', 'impuestos');
        await eliminarRegistroSiExiste(t, '#gridTarifasIva', CODIGO);
        await t
            .click(Selector('#gridTarifasIva .dx-button-content').nth(1))
        //Se comienza con la inserción de datos para la creación de la tarifa
            .typeText('#txtIntIdIva', CODIGO)
             .typeText('#txtTarifaIva_Descripcion .dx-texteditor-input', DESCRIPCION)
            .typeText('#txtTarifaIva_Porcentaje .dx-texteditor-input', PORCENTAJE)
            .typeText('#txtTarifaIva_Porcentaje2 .dx-texteditor-input', PORCENTAJE2)
            .click(Selector('#BtnGuardarTarifaIva div').withText('Guardar'))
        //Se valida la creación 
            .wait(4000)
            .expect(Selector('#gridTarifasIva td').withText(CODIGO).exists).ok()
       //Se edita
            .click(Selector('#gridTarifasIva [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
             //Se comienza con la inserción de datos para la actualización del Tarifa Iva
            .click('#txtTarifaIva_Descripcion .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtTarifaIva_Descripcion .dx-texteditor-input', DESCRIPCION_EDIT)
            .click('#txtTarifaIva_Porcentaje2 .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtTarifaIva_Porcentaje2 .dx-texteditor-input', PORCENTAJE2_EDIT)
            .click('#BtnGuardarTarifaIva .dx-icon.dx-icon-save')
            .wait(4000)
        //Se elimina la tarifa
            ;
        await eliminarRegistroDesdeGrid(t, '#gridTarifasIva');
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `Prueba Tarifas de IVA testerp Pos - Test Hgi360`
    .page(testPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Test Hgi360 - Prueba Tarifas de IVA CRUD mierp', async t => {
    await ejecutarPrueba(t, testPosConfig);
});

fixture `Prueba Tarifas de IVA testerp Pos - Hgi360 Pos`
    .page(hgiPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Test Hgi360 - Prueba Tarifas de IVA CRUD mierp', async t => {
    await ejecutarPrueba(t, hgiPosConfig);
});
