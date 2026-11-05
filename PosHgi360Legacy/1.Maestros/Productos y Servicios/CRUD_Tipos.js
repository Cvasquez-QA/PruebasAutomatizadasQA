import { Selector } from 'testcafe';
import {
    filtrarPor,
    seleccionarOpcion,
    ingresarAplicacion,
    eliminarRegistroSiExiste,
    cerrarSesion360,
    cerrarPestana360,
    eliminarRegistroDesdeGrid,
    limpiarCacheChromeTestCafe
} from '../../../Funciones/HelpersHgi360Legacy.js';
import { abrirMaestroPos360 as abrirMaestros360 } from '../../../Funciones/MenuMaestros360.js';
import { testPosConfig, hgiPosConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

const CODIGO = 'MiTipo123';
const DESCRIPCION = 'MiDescripcionTipo';
const DESCRIPCION_EDIT = 'minuevadescripcion';
const CONCEPTO = '0 - GENERAL';
const CONCEPTO_FILTRO = 'GENERAL';
async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    await abrirMaestros360(t, 'Tipos', 'productos');
        await eliminarRegistroSiExiste(t, '#gridTipos', CODIGO);
        await t
            .click('#gridTipos .dx-icon.dx-icon-add')
        //Se procede a crear el Tipo
            .typeText('#txtStrIdTipo', CODIGO)
            .typeText('#txtTipo_Descripcion .dx-texteditor-input', DESCRIPCION)
            .click(Selector('#BtnGuardarTipo span').withText('Guardar'))
            //.click(Selector('#txtMaestroTipo_Concepto .dx-lookup-field'))
            //El sistema permite la creación de un Tipo sin tener un concepto asociado
        //Se valida la creación del tipo
            .wait(2000)
            .expect(Selector('td').withText(CODIGO).exists).ok()
            .wait(1000)
        //Se edita el tipo
            .click(Selector('#gridTipos [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
            .click(Selector('#txtTipo_Descripcion .dx-texteditor-input'))
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtTipo_Descripcion .dx-texteditor-input', DESCRIPCION_EDIT)
            .click(Selector('#txtMaestroTipo_Concepto .dx-lookup-field'));

            await filtrarPor(t, CONCEPTO_FILTRO);
            await t
            .wait(2000)
            ;
    await seleccionarOpcion(t, CONCEPTO);
    await t
            .click(Selector('#BtnGuardarTipo div').withText('Guardar'))
        //Se elimina el tipo
            .wait(2000);
        await eliminarRegistroDesdeGrid(t, '#gridTipos');
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `Prueba Tipos testerp Pos - Test Hgi360`
    .page(testPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Test Hgi360 - Prueba CRUD Tipos mierp', async t => {
    await ejecutarPrueba(t, testPosConfig);
});

fixture `Prueba Tipos testerp Pos - Hgi360 Pos`
    .page(hgiPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Test Hgi360 - Prueba CRUD Tipos mierp', async t => {
    await ejecutarPrueba(t, hgiPosConfig);
});
