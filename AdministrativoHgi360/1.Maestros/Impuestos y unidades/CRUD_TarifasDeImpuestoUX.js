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

const CODIGO = 'micodigo123';
const DESCRIPCION = 'midectaridaimpuyesto';
const PORCENTAJE = '333';
const DESCRIPCION_EDIT = 'minuevadesc';
const PORCENTAJE_EDIT = '12,2';

async function ejecutarPrueba(t, config, ingresar) {
    await ingresar(t, config);
        await abrirMaestros360(t, 'Tarifas de Impuesto', 'impuestos');
        await eliminarRegistroSiExiste(t, '#gridTarifasImpto1', CODIGO);
        await t
            .click('#gridTarifasImpto1 .dx-icon.dx-icon-add')
            .typeText('#txtIntIdCodigo', CODIGO)
            .typeText('#txtTarifaImpto1_Descripcion .dx-texteditor-input', DESCRIPCION)
            .typeText('#txtTarifaImpto1_Porcentaje .dx-texteditor-input', PORCENTAJE)
            .click(Selector('#BtnGuardarTarifaImpto1 span').withText('Guardar'))
            .wait(4000)
            .expect(Selector('#gridTarifasImpto1 td').withText(CODIGO).exists).ok()
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
            .wait(4000);
        await eliminarRegistroDesdeGrid(t, '#gridTarifasImpto1');;
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `Prueba Tarifa de Impuesto - Test Hgi360`
    .page(testAdminConfig.pagina);

test('Prueba Tarifa de Impuesto Test Hgi360 - Test Hgi360', async t => {
    await ejecutarPrueba(t, testAdminConfig, ingresarAplicacion);
});

fixture `Prueba Tarifa de Impuesto - Hgi360 Admin`
    .page(hgiAdminConfig.pagina);

test('Prueba Tarifa de Impuesto - Hgi360 Admin', async t => {
    await ejecutarPrueba(t, hgiAdminConfig, ingresarAplicacion);
});
