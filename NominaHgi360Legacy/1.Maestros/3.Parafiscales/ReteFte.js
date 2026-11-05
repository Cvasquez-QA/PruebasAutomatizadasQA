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

const MAESTRO = 'Retefte';
const GRID = '#gridNomReteFte';
const CODIGO = 'MiReteFte';
const DESCRIPCION = 'DescripcionReteFte';
const DESCRIPCION_EDITADA = 'MINUEVADESCRIPCIONRETEFTE';
const BOTON_GUARDAR = Selector('#BtnGuardarNomReteFte span').withText('Guardar');

async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    await abrirMaestros360(t, MAESTRO);
        await eliminarRegistroSiExiste(t, GRID, CODIGO);

        await t
            .click('#gridNomReteFte .dx-icon.dx-icon-add')
            .typeText('#NomReteFte_StrIdCodigo', CODIGO)
            .typeText('#txtReteFte_DesdeUvt .dx-texteditor-input', '1')
            .typeText('#txtReteFte_HastaUvt .dx-texteditor-input', '95')
            .typeText('#txtReteFte_Porcentaje .dx-texteditor-input', '10')
            .typeText('#txtReteFte_Descripcion .dx-texteditor-input', DESCRIPCION)
            .typeText('#txtReteFte_UvtsSumados .dx-texteditor-input', '2')
            .typeText('#txtReteFte_UvtsRestados .dx-texteditor-input', '3')
            .click(BOTON_GUARDAR)
            .wait(3000)
            .expect(Selector(`${GRID} td`).withText(CODIGO).exists).ok()
            .click(Selector('#gridNomReteFte [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
            .click('#txtReteFte_Descripcion .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtReteFte_Descripcion .dx-texteditor-input', DESCRIPCION_EDITADA)
            .click(BOTON_GUARDAR)
            .wait(4000);

        await eliminarRegistroDesdeGrid(t, GRID);
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `Prueba ReteFte Hgi360 Nomina - MiHgi360`
    .page(miNominaConfig.pagina);

test('MiHgi360 - Prueba ReteFte testerp CRUD ', async t => {
    await ejecutarPrueba(t, miNominaConfig);
});

fixture `Prueba ReteFte Hgi360 Nomina - Test Hgi360`
    .page(testNominaConfig.pagina);

test('Test Hgi360 - Prueba ReteFte testerp CRUD ', async t => {
    await ejecutarPrueba(t, testNominaConfig);
});
