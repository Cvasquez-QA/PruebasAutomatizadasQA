import { Selector } from 'testcafe';
import {
    ingresarAplicacion,
    eliminarRegistroSiExiste,
    cerrarPestana360,
    cerrarSesion360,
    limpiarCacheChromeTestCafe
} from '../../../Funciones/HelpersHgi360Legacy.js';
import { abrirMaestroPos360 as abrirMaestros360 } from '../../../Funciones/MenuMaestros360.js';
import { testPosConfig, hgiPosConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

const CODIGO = 'pruebaCodigoSubsector';
const DESCRIPCION = 'descSubsector';
const DESCRIPCION_EDIT = 'nuevaDescSubsector';
async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    await abrirMaestros360(t, 'Subsector', 'terceros');
        await eliminarRegistroSiExiste(t, '#gridSubsector', CODIGO);
        await t
            //Se ingresa al maestro
            await t
        //Se ingresa al maestro de subsector
                    .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
            .wait(1500)
             await t
            .click(Selector('#gridTerParametro1 .dx-icon.dx-icon-add'))
        //Se comienza con la inserción de datos para la creación del subsector
            .typeText('#TerParametro1_StrIdParametro', CODIGO)
            .typeText('#txtTerParametro1_StrDescripcion', DESCRIPCION)
            .click(Selector('#BtnGuardarTerParametro1 span').withText('Guardar'))
        //Se valida su creación 
            .wait(3000)
            .expect(Selector('#gridTerParametro1 td').withText(CODIGO).exists).ok()
        //Se edita el subsector
            .click(Selector('#gridTerParametro1 [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
            .click('#txtTerParametro1_StrDescripcion')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtTerParametro1_StrDescripcion .dx-texteditor-input', DESCRIPCION_EDIT)
            .click(Selector('#BtnGuardarTerParametro1 span').withText('Guardar'))
        //Se elimina el subsector
            .wait(4000)
            .click(Selector('#gridTerParametro1 [class^="dx-button-mode-contained dx-eliminar-gestion dx-li"]'))
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `Prueba Subsector testHgi360 POS - Test Hgi360`
    .page(testPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Test Hgi360 - Prueba CRUD Subsector testHgi360', async t => {
    await ejecutarPrueba(t, testPosConfig);
});

fixture `Prueba Subsector testHgi360 POS - Hgi360 Pos`
    .page(hgiPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Test Hgi360 - Prueba CRUD Subsector testHgi360', async t => {
    await ejecutarPrueba(t, hgiPosConfig);
});
