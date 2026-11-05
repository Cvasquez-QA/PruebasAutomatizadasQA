import { Selector } from 'testcafe';
import { miNominaConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';
import { testNominaConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';
import {
    abrirMaestros360,
    cerrarPestana360,
    cerrarSesion360,
    eliminarRegistroSiExiste,
    ingresarAplicacion,
} from '../../../Funciones/HelpersHgi360Legacy.js';

const CODIGO_SUBCENTRO = 'MiSubCC';
const DESCRIPCION_INICIAL = 'MIDESCRIPCION';
const DESCRIPCION_ACTUALIZADA = 'MINUEVADESCRIPCION';
const GRID_SUBCENTROS = '#gridSubCentrosCostos';

async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    await abrirMaestros360(t, 'Subcentro De Costo');
        await eliminarRegistroSiExiste(t, GRID_SUBCENTROS, CODIGO_SUBCENTRO);

        await t
            .click(`${GRID_SUBCENTROS} .dx-icon.dx-icon-add`)
            .typeText('#txtSubCentroCosto_Codigofocus', CODIGO_SUBCENTRO)
            .typeText('#txtSubCentroCosto_Descripcion .dx-texteditor-input', DESCRIPCION_INICIAL)
            .click('#txtSubCentroCosto_Estado .dx-checkbox-icon')
            .click(Selector('#BtnActualizarSubCentroCosto span').withText('Guardar'))
            .wait(3000)
            .expect(Selector(`${GRID_SUBCENTROS} td`).withText(CODIGO_SUBCENTRO).exists).ok()
            .click(Selector(`${GRID_SUBCENTROS} [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]`).nth(1))
            .click('#txtSubCentroCosto_Descripcion .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtSubCentroCosto_Descripcion .dx-texteditor-input', DESCRIPCION_ACTUALIZADA)
            .click(Selector('#BtnActualizarSubCentroCosto div').withText('Guardar'))
            .wait(4000);

        await eliminarRegistroSiExiste(t, GRID_SUBCENTROS, CODIGO_SUBCENTRO);
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `Prueba SubCentroDeCosto Hgi360 Nomina - MiHgi360`
    .page(miNominaConfig.pagina);

test('MiHgi360 - Prueba SUBCENTRO DE COSTO testerp CRUD ', async t => {
    await ejecutarPrueba(t, miNominaConfig);
});

fixture `Prueba SubCentroDeCosto Hgi360 Nomina - Test Hgi360`
    .page(testNominaConfig.pagina);

test('Test Hgi360 - Prueba SUBCENTRO DE COSTO testerp CRUD ', async t => {
    await ejecutarPrueba(t, testNominaConfig);
});
