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

const MAESTRO = 'Regímenes';
const GRID = '#gridNomRegimenes';
const CODIGO = '98';
const DESCRIPCION = 'DescripcionRegimen';
const DESCRIPCION_EDITADA = 'MINUEVADESCRIPCIONREGIMEN';
const BOTON_GUARDAR = Selector('#BtnGuardarNomRegimenes span').withText('Guardar');
const CASILLAS = [
    '#chkRegimenLab_Cesantias .dx-checkbox-icon',
    '#chkRegimenLab_PrimaServicios .dx-checkbox-icon',
    '#chkRegimenLab_Vacaciones .dx-checkbox-icon',
    '#chkRegimenLab_PrimaVacaciones .dx-checkbox-icon',
    '#chkRegimenLab_SabadosFestivos .dx-checkbox-icon',
    '#chkRegimenLab_LiquidaSalario .dx-checkbox-icon'
];

async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    await abrirMaestros360(t, MAESTRO);
        await eliminarRegistroSiExiste(t, GRID, CODIGO);

        await t
            .click('#gridNomRegimenes .dx-icon.dx-icon-add')
            .typeText('#NomRegimenes_IntIdRegimen', CODIGO);

        for (const casilla of CASILLAS) {
            await t.click(casilla);
        }

        await t
            .typeText('#txtRegimenLab_Descripcion .dx-texteditor-input', DESCRIPCION)
            .typeText('#numRegimenLab_DiasCesantias .dx-texteditor-input', '360')
            .typeText('#numRegimenLab_DiasPrima .dx-texteditor-input', '180')
            .typeText('#numRegimenLab_DiasVacaciones .dx-texteditor-input', '15')
            .typeText('#numRegimenLab_DiasPrimaVacaciones .dx-texteditor-input', '15')
            .click(BOTON_GUARDAR)
            .wait(3000)
            .expect(Selector(`${GRID} td`).withText(CODIGO).exists).ok()
            .click(Selector('#gridNomRegimenes [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
            .click('#txtRegimenLab_Descripcion .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtRegimenLab_Descripcion .dx-texteditor-input', DESCRIPCION_EDITADA)
            .click(BOTON_GUARDAR)
            .wait(4000);

        await eliminarRegistroDesdeGrid(t, GRID);
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `Prueba Regimenes Hgi360 Nomina - MiHgi360`
    .page(miNominaConfig.pagina);

test('MiHgi360 - Prueba Regimenes testerp CRUD ', async t => {
    await ejecutarPrueba(t, miNominaConfig);
});

fixture `Prueba Regimenes Hgi360 Nomina - Test Hgi360`
    .page(testNominaConfig.pagina);

test('Test Hgi360 - Prueba Regimenes testerp CRUD ', async t => {
    await ejecutarPrueba(t, testNominaConfig);
});
