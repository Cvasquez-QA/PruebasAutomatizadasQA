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

const CODIGO_CENTRO_COSTO = 'MiCentroCosto';
const DESCRIPCION_INICIAL = 'MIDESCRIPCION';
const DESCRIPCION_ACTUALIZADA = 'MINUEVADESCRIPCION';
const GRID_CENTROS_COSTOS = '#gridCentrosCostos';

async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    await abrirMaestros360(t, 'Centro De Costo');
        await eliminarRegistroSiExiste(t, GRID_CENTROS_COSTOS, CODIGO_CENTRO_COSTO);

        await t
            .click(`${GRID_CENTROS_COSTOS} .dx-icon.dx-icon-add`)
            .typeText('#txtCentroCosto_Codigofocus', CODIGO_CENTRO_COSTO)
            .typeText('#txtCentroCosto_Descripcion .dx-texteditor-input', DESCRIPCION_INICIAL)
            .click('#txtCentroCosto_Estado .dx-checkbox-icon')
            .click(Selector('#BtnActualizarCentroCosto span').withText('Guardar'))
            .wait(3000)
            .expect(Selector(`${GRID_CENTROS_COSTOS} td`).withText(CODIGO_CENTRO_COSTO).exists).ok()
            .click(Selector(`${GRID_CENTROS_COSTOS} [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]`).nth(1))
            .click('#txtCentroCosto_Descripcion .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtCentroCosto_Descripcion .dx-texteditor-input', DESCRIPCION_ACTUALIZADA)
            .click(Selector('#BtnActualizarCentroCosto div').withText('Guardar'))
            .wait(4000);

        await eliminarRegistroSiExiste(t, GRID_CENTROS_COSTOS, CODIGO_CENTRO_COSTO);
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `Prueba CentroDeCosto Hgi360 Nomina - MiHgi360`
    .page(miNominaConfig.pagina);

test('MiHgi360 - Prueba CENTRO DE COSTO testerp CRUD ', async t => {
    await ejecutarPrueba(t, miNominaConfig);
});

fixture `Prueba CentroDeCosto Hgi360 Nomina - Test Hgi360`
    .page(testNominaConfig.pagina);

test('Test Hgi360 - Prueba CENTRO DE COSTO testerp CRUD ', async t => {
    await ejecutarPrueba(t, testNominaConfig);
});
