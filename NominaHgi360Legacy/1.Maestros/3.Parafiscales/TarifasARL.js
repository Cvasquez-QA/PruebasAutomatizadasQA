import { Selector } from 'testcafe';
import { miNominaConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';
import { testNominaConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';
import {
    abrirMaestros360,
    cerrarPestana360,
    cerrarSesion360,
    eliminarRegistroDesdeGrid,
    eliminarRegistroSiExiste,
    ingresarAplicacion
} from '../../../Funciones/HelpersHgi360Legacy.js';

const MAESTRO = 'Tarifas Arl';
const GRID = '#gridNomTarifasARL';
const CODIGO = 'MiTarifaArl';
const DESCRIPCION = 'DescripcionTarifaArl';
const DESCRIPCION_EDITADA = 'MINUEVADESCRIPCIONARL';
const PORCENTAJE = '0,522';
const CODIGO_TRABAJO = '112010';
const BOTON_GUARDAR = Selector('#BtnGuardarNomTarifasARL div').withText('Guardar');

async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    await abrirMaestros360(t, MAESTRO);
        await eliminarRegistroSiExiste(t, GRID, CODIGO);

        await t
            .click('#gridNomTarifasARL .dx-icon.dx-icon-add')
            .typeText('#NomTarifasARL_StrIdCodigo', CODIGO)
            .typeText('#txtTarifasArl_Descripcion .dx-texteditor-input', DESCRIPCION)
            .typeText('#txtTarifasArl_Porcentaje .dx-texteditor-input', PORCENTAJE)
            .typeText('#txtTarifasArl_CodTrabajo .dx-texteditor-input', CODIGO_TRABAJO)
            .click(BOTON_GUARDAR)
            .wait(3000)
            .expect(Selector(`${GRID} td`).withText(CODIGO).exists).ok()
            .click(Selector('#gridNomTarifasARL [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
            .click('#txtTarifasArl_Descripcion .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtTarifasArl_Descripcion .dx-texteditor-input', DESCRIPCION_EDITADA)
            .click(BOTON_GUARDAR)
            .wait(4000);

        await eliminarRegistroDesdeGrid(t, GRID);
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `Prueba TarifasARL Hgi360 Nomina - MiHgi360`
    .page(miNominaConfig.pagina);

test('MiHgi360 - Prueba Tarifas ARL testerp CRUD ', async t => {
    await ejecutarPrueba(t, miNominaConfig);
});

fixture `Prueba TarifasARL Hgi360 Nomina - Test Hgi360`
    .page(testNominaConfig.pagina);

test('Test Hgi360 - Prueba Tarifas ARL testerp CRUD ', async t => {
    await ejecutarPrueba(t, testNominaConfig);
});
