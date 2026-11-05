import { Selector } from 'testcafe';
import { seleccionarOpcion, ingresarAplicacion, abrirMaestros360, eliminarRegistroSiExiste, cerrarSesion360, cerrarPestana360, eliminarRegistroDesdeGrid, ingresarAplicacionMiHappgi } from '../../../Funciones/HelpersHgi360Legacy.js';
import { miContableConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js'; 
import { testContableConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js'; 

const CODIGO = 'PruebaCodigoTipoTerc';
const DESCRIPCION = 'descTipoTercero';
const DIAS = '5';
const DESCRIPCION_EDIT = 'NuevaDescripciónTipoTerceros';
const PRECIO_1 = '1 - Precio 1';

/*
+++++++++++++++++++++++++++++++++++++++++++++
+++++++++++++++++++++++++++++++++++++++++++++
+++++++++++++++++++++++++++++++++++++++++++++
*/


async function ejecutarPruebaTiposTercero(t, config, ingresar) {
    await ingresar(t, config);
        await abrirMaestros360(t, 'Tipos Tercero');
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

fixture `CRUD_TiposTerceroUX - Mi ERP`
    .page(miContableConfig.pagina);

test('Prueba Tipo Tercero Test Contable - Mi ERP', async t => {
    await ejecutarPruebaTiposTercero(t, miContableConfig, ingresarAplicacionMiHappgi);
});

fixture `CRUD_TiposTerceroUX - Test Contable`
    .page(testContableConfig.pagina);

test('Prueba Tipo Tercero Test Contable - Test Contable', async t => {
    await ejecutarPruebaTiposTercero(t, testContableConfig, ingresarAplicacion);
});
