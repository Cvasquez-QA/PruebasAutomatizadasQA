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

const CODIGO = 'codReteFte';
const DESCRIPCION = 'DESCRIPCIONRETEFUENTE';
const BASE_RTE_FTE = '5314';
const PORCENTAJE_ND = '801';
const PORCENTAJE_DECL = '100';
const BASE_RTE_ICA = '896';
const PORCENTAJE = '5664';
const DESCRIPCION_EDIT = 'NuevaDescripciónReteFuente';
const BASE_RTE_FTE_EDIT = '5000';
const BASE_RTE_ICA_EDIT = '800069';
const PORCENTAJE_EDIT = '8411';

async function ejecutarPrueba(t, config, ingresar) {
    await ingresar(t, config);
        await abrirMaestros360(t, 'Maestro de Retención', 'impuestos');
        await eliminarRegistroSiExiste(t, '#gridTarifasRetenciones', CODIGO);
        await t
            .click('#gridTarifasRetenciones .dx-icon.dx-icon-add')
            .typeText('#txtIntIdRetencion', CODIGO)
            .click('#txtTarifasRetencion_Descripcion .dx-texteditor-input')
            .typeText('#txtTarifasRetencion_Descripcion .dx-texteditor-input', DESCRIPCION)
            .typeText('#txtTarifasRetencion_BaseRteFte .dx-texteditor-input', BASE_RTE_FTE)
            .typeText('#txtTarifasRetencion_PorcentajeND .dx-texteditor-input', PORCENTAJE_ND)
            .typeText('#txtTarifasRetencion_PorcentajeDecl .dx-texteditor-input', PORCENTAJE_DECL)
            .typeText('#txtTarifasRetencion_BaseRteIca .dx-texteditor-input', BASE_RTE_ICA)
            .typeText('#txtTarifasRetencion_Porcentaje .dx-texteditor-input', PORCENTAJE)
            .click(Selector('#BtnGuardarTarifasRetencion span').withText('Guardar'))
            .wait(4000)
            .expect(Selector('#gridTarifasRetenciones td').withText(CODIGO).exists).ok()
            .wait(2000)
            .click(Selector('#gridTarifasRetenciones [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
            .click('#txtTarifasRetencion_Descripcion .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtTarifasRetencion_Descripcion .dx-texteditor-input', DESCRIPCION_EDIT)
            .click(Selector('#txtTarifasRetencion_BaseRteFte .dx-texteditor-input'))
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtTarifasRetencion_BaseRteFte .dx-texteditor-input', BASE_RTE_FTE_EDIT)
            .click(Selector('#txtTarifasRetencion_BaseRteIca .dx-texteditor-input'))
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtTarifasRetencion_BaseRteIca .dx-texteditor-input', BASE_RTE_ICA_EDIT)
            .click(Selector('#txtTarifasRetencion_Porcentaje .dx-texteditor-input'))
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtTarifasRetencion_Porcentaje .dx-texteditor-input', PORCENTAJE_EDIT)
            .click(Selector('#BtnGuardarTarifasRetencion div').withText('Guardar'))
            .wait(2000);
        await eliminarRegistroDesdeGrid(t, '#gridTarifasRetenciones');;
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `Prueba Tablas de Rte Fnte - Test Hgi360`
    .page(testAdminConfig.pagina);

test('Prueba Rte Fnte CRUD Test Hgi360 - Test Hgi360', async t => {
    await ejecutarPrueba(t, testAdminConfig, ingresarAplicacion);
});

fixture `Prueba Tablas de Rte Fnte - Hgi360 Admin`
    .page(hgiAdminConfig.pagina);

test('Prueba Rte Fnte CRUD - Hgi360 Admin', async t => {
    await ejecutarPrueba(t, hgiAdminConfig, ingresarAplicacion);
});
