import { Selector } from 'testcafe';
import {
    seleccionarOpcion,
    ingresarAplicacion,
    abrirMaestros360,
    eliminarRegistroSiExiste,
    cerrarSesion360,
    cerrarPestana360,
    eliminarRegistroDesdeGrid,
    limpiarCacheChromeTestCafe
} from '../../../Funciones/HelpersHgi360Legacy.js';
import { testPosConfig, hgiPosConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

const CODIGO = 'PruebaCodigoTipoTerc';
const DESCRIPCION = 'descTipoTercero';
const DIAS = '5';
const DESCRIPCION_EDIT = 'NuevaDescripciónTipoTerceros';
const PRECIO_1 = '1 - Precio 1';
async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    await abrirMaestros360(t, 'Tipos Tercero', 'terceros');
        await eliminarRegistroSiExiste(t, '#gridTiposTerceros', CODIGO);
        await t
            .click(Selector('#gridTiposTerceros .dx-button-content').nth(1))
        //Se comienza con la inserción de datos para la creación del tercero
            .typeText('#txtIntIdTipoTercerofoco', CODIGO)
            .typeText('#txtTipoTerceros_Descripcion .dx-texteditor-input', DESCRIPCION)
            //.click(Selector('#txtTiposTerceros_IntPrecio div').withText('[Vacío]').nth(1))
            .typeText('#txtTipoTerceros_Dias .dx-texteditor-input',DIAS)
            .click(Selector('#BtnGuardarTipoTerceros div').withText('Guardar'))
            //El sistema permite guardar un TipoTercero sin precio
        //Se valida que se haya creado el tipo tercero
            .wait(2000)
            .expect(Selector('#gridTiposTerceros td').withText(CODIGO).exists).ok()
        //Se edita el tipo tercero
            .click(Selector('#gridTiposTerceros [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
            //Se comienza con la inserción de datos para la actualización del tipo tercero
            .click('#txtTipoTerceros_Descripcion .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtTipoTerceros_Descripcion .dx-texteditor-input', DESCRIPCION_EDIT)
            .click('#txtTiposTerceros_IntPrecio .dx-lookup-field')
            ;
    await seleccionarOpcion(t, PRECIO_1);
    await t
            .click(Selector('#BtnGuardarTipoTerceros span').withText('Guardar'))
        //Se elimina el Tipo Tercero
            .wait(2000);
        await eliminarRegistroDesdeGrid(t, '#gridTiposTerceros');
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `Prueba Tipo Terceros testERP Pos - Test Hgi360`
    .page(testPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Test Hgi360 - Prueba Tipo Tercero testERP', async t => {
    await ejecutarPrueba(t, testPosConfig);
});

fixture `Prueba Tipo Terceros testERP Pos - Hgi360 Pos`
    .page(hgiPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Test Hgi360 - Prueba Tipo Tercero testERP', async t => {
    await ejecutarPrueba(t, hgiPosConfig);
});
