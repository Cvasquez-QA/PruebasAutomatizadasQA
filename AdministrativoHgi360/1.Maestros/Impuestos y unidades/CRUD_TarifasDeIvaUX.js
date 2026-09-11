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

const CODIGO = 'MiCodigoTarifaIva123';
const DESCRIPCION = 'MiDescTarifaIva123';
const PORCENTAJE = '40';
const PORCENTAJE2 = '1';
const DESCRIPCION_EDIT = 'minuevadescripcion';
const PORCENTAJE2_EDIT = '7.8';

async function ejecutarPrueba(t, config, ingresar) {
    await ingresar(t, config);
        await abrirMaestros360(t, 'Tarifas de Iva', 'impuestos');
        await eliminarRegistroSiExiste(t, '#gridTarifasIva', CODIGO);
        await t
            .click(Selector('#gridTarifasIva .dx-button-content').nth(1))
            .typeText('#txtIntIdIva', CODIGO)
            .typeText('#txtTarifaIva_Descripcion .dx-texteditor-input', DESCRIPCION)
            .typeText('#txtTarifaIva_Porcentaje .dx-texteditor-input', PORCENTAJE)
            .typeText('#txtTarifaIva_Porcentaje2 .dx-texteditor-input', PORCENTAJE2)
            .click(Selector('#BtnGuardarTarifaIva div').withText('Guardar'))
            .wait(4000)
            .expect(Selector('#gridTarifasIva td').withText(CODIGO).exists).ok()
            .click(Selector('#gridTarifasIva [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
            .click('#txtTarifaIva_Descripcion .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtTarifaIva_Descripcion .dx-texteditor-input', DESCRIPCION_EDIT)
            .click('#txtTarifaIva_Porcentaje2 .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtTarifaIva_Porcentaje2 .dx-texteditor-input', PORCENTAJE2_EDIT)
            .click('#BtnGuardarTarifaIva .dx-icon.dx-icon-save')
            .wait(4000);
        await eliminarRegistroDesdeGrid(t, '#gridTarifasIva');;
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `Prueba Tarifas de IVA - Test Hgi360`
    .page(testAdminConfig.pagina);

test('Prueba Tarifas de IVA CRUD Test Hgi360 - Test Hgi360', async t => {
    await ejecutarPrueba(t, testAdminConfig, ingresarAplicacion);
});

fixture `Prueba Tarifas de IVA - Hgi360 Admin`
    .page(hgiAdminConfig.pagina);

test('Prueba Tarifas de IVA CRUD - Hgi360 Admin', async t => {
    await ejecutarPrueba(t, hgiAdminConfig, ingresarAplicacion);
});
