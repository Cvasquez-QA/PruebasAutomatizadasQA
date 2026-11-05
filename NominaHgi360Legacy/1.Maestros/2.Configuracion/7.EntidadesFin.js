import { Selector } from 'testcafe';
import { miNominaConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';
import { testNominaConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';
    //En mi happgi no se han publicado unos cambios, por lo que la pruebas fallan
import {
    abrirMaestros360,
    cerrarSesion360,
    eliminarRegistroDesdeGrid,
    eliminarRegistroSiExiste,
    ingresarAplicacion,
    
} from '../../../Funciones/HelpersHgi360Legacy.js';

const CODIGO_ENTIDAD = 'mientidad123';
const DESCRIPCION_ENTIDAD = 'midescentidadfin';
const DESCRIPCION_EDITADA = 'minuevadesc';
const CODIGO_ACH = 'miacn()';
const CODIGO_ACH_ALTERNO = 'miach#';

async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    await abrirMaestros360(t, 'Entidadesfin');
    await eliminarRegistroSiExiste(t, '#gridEntidadesFinancieras', CODIGO_ENTIDAD);

    await t
        .click('#gridEntidadesFinancieras .dx-icon.dx-icon-add')
    //Se ingresa la informaci�n para la creaci�n de la entidad financiera
        .typeText('#txtIdEntidadfoco', CODIGO_ENTIDAD)
        .typeText('#txtEntidadFinanciera_Descripcion .dx-texteditor-input', DESCRIPCION_ENTIDAD)
        .typeText('#txtEntidadFinanciera_CodigoAch .dx-texteditor-input', CODIGO_ACH)
        .typeText('#txtEntidadFinanciera_CodigoAch1 .dx-texteditor-input', CODIGO_ACH_ALTERNO)
        .click(Selector('#BtnActualizarEntidadFinanciera span').withText('Guardar'))
        .wait(2000)
    //Se valida la creaci�n
        .expect(Selector('#gridEntidadesFinancieras td').withText(CODIGO_ENTIDAD).exists).ok()
    //Se edita
        .click(Selector('#gridEntidadesFinancieras [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
        .click('#txtEntidadFinanciera_Descripcion .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtEntidadFinanciera_Descripcion .dx-texteditor-input', DESCRIPCION_EDITADA)
        .click(Selector('#BtnActualizarEntidadFinanciera span').withText('Guardar'))
        .wait(2000)
    //Se elimina
        ;
    await eliminarRegistroDesdeGrid(t, '#gridEntidadesFinancieras');
    await t.switchToMainWindow();
    await cerrarSesion360(t);
}

fixture `Prueba Entidad Financiera Hgi360 Nomina - MiHgi360`
    .page(miNominaConfig.pagina);

test('Prueba Entidad Financiera - MiHgi360', async t => {
    await ejecutarPrueba(t, miNominaConfig);
});

fixture `Prueba Entidad Financiera Hgi360 Nomina - Test Hgi360`
    .page(testNominaConfig.pagina);

test('Prueba Entidad Financiera - Test Hgi360', async t => {
    await ejecutarPrueba(t, testNominaConfig);
});
