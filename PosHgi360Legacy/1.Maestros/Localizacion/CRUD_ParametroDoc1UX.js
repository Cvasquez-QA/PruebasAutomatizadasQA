import { Selector } from 'testcafe';
import {
    ingresarAplicacion,
    eliminarRegistroSiExiste,
    cerrarPestana360,
    cerrarSesion360,
    eliminarRegistroDesdeGrid,
    limpiarCacheChromeTestCafe
} from '../../../Funciones/HelpersHgi360Legacy.js';
import { abrirMaestroPos360 as abrirMaestros360 } from '../../../Funciones/MenuMaestros360.js';
import { testPosConfig, hgiPosConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

const CODIGO = 'pruebaCodigoParametroDoc1';
const DESCRIPCION = 'descParametroDoc1';
const DESCRIPCION_EDIT = 'nuevaDescParametroDoc1';
async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    await abrirMaestros360(t, 'Parametro Doc1', 'localizacion');
        await eliminarRegistroSiExiste(t, '#gridParametroDoc1', CODIGO);
        await t
            //Se ingresa al maestro de Parametro1    
                    .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
            .wait(1500)
             await t
            .click('#gridDocParametro1 .dx-icon.dx-icon-add')
        //Se comienza con la inserción de datos para la creación del registro
            .typeText('#DocParametro1_StrIdCodigo', 'codParametro1')
            .typeText('#txtDocParametro1_StrDescripcion .dx-texteditor-input', 'descParametro1')
            .click(Selector('#BtnGuardarDocParametro1 div').withText('Guardar'))
            .wait(1000)
            //.click(Selector('.swal2-actions button').withText('Aceptar'))
    //Se valida la creación
            .wait(4000)
            .expect(Selector('#gridDocParametro1 td').withText('codParametro1').exists).ok()
    //Se edita
            .click(Selector('#gridDocParametro1 [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
        //Se comienza con la inserción de datos para la actualización
           .click('#DocParametro1_StrDescripcion')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#DocParametro1_StrDescripcion', 'NuevaDescParametro1')
            .click('#BtnGuardarDocParametro1')
           // .click(Selector('.swal2-actions button').withText('Aceptar'))
    //Se elimina el registro
            .wait(4000);
        await eliminarRegistroDesdeGrid(t, '#gridDocParametro1');
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `Prueba ParametroDoc1 testerp Pos - Test Hgi360`
    .page(testPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Test Hgi360 - Prueba ParametroDoc1 CRUD miErp ', async t => {
    await ejecutarPrueba(t, testPosConfig);
});

fixture `Prueba ParametroDoc1 testerp Pos - Hgi360 Pos`
    .page(hgiPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Test Hgi360 - Prueba ParametroDoc1 CRUD miErp ', async t => {
    await ejecutarPrueba(t, hgiPosConfig);
});
