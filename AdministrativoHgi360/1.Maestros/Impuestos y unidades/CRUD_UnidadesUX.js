import { Selector } from 'testcafe';
import {
    ingresarAplicacion,
    abrirMaestros360,
    seleccionarOpcion,
    eliminarRegistroSiExiste,
    cerrarSesion360,
    cerrarPestana360,
    eliminarRegistroDesdeGrid
} from '../../../Funciones/HelpersHgi360.js';
import { testAdminConfig } from '../../../ParametrosPruebas/TestErpAdmin8902.js';
import { hgiAdminConfig } from '../../../ParametrosPruebas/Hgi360Admin8888.js';

const CODIGO = 'codUni';
const DESCRIPCION = 'midescunidad';
const OPCION_CODIGO_DIAN = '91 - alimenta';
const DESCRIPCION_EDIT = 'minuevadescunidad';
const OPCION_CODIGO_DIAN_EDIT = 'A1 - 15 calorías C';

async function ejecutarPrueba(t, config, ingresar) {
    await ingresar(t, config);
        await abrirMaestros360(t, 'Unidades', 'impuestos');
        await eliminarRegistroSiExiste(t, '#gridUnidades', CODIGO);
        await t
            .click('#gridUnidades .dx-icon.dx-icon-add')
            .typeText('#txtStrIdUnidad', CODIGO)
            .typeText('#txtUnidad_Descripcion .dx-texteditor-input', DESCRIPCION)
            .click(Selector('#txtUnidad_Codigo_DIAN .dx-lookup-field'))
            ;
    await seleccionarOpcion(t, OPCION_CODIGO_DIAN);
    await t
            .click(Selector('#BtnGuardarUnidad span').withText('Guardar'))
            .wait(4000)
            .expect(Selector('#gridUnidades td').withText(CODIGO).exists).ok()
            .click(Selector('#gridUnidades [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
            .click('#txtUnidad_Descripcion .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtUnidad_Descripcion .dx-texteditor-input', DESCRIPCION_EDIT)
            .click(Selector('#txtUnidad_Codigo_DIAN .dx-lookup-field'))
            ;
    await seleccionarOpcion(t, OPCION_CODIGO_DIAN_EDIT);
    await t
            .click(Selector('#BtnGuardarUnidad div').withText('Guardar'));
        await eliminarRegistroDesdeGrid(t, '#gridUnidades');
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `Prueba Unidades - Test Hgi360`
    .page(testAdminConfig.pagina);

test('Prueba Unidades CRUD Test Hgi360 - Test Hgi360', async t => {
    await ejecutarPrueba(t, testAdminConfig, ingresarAplicacion);
});

fixture `Prueba Unidades - Hgi360 Admin`
    .page(hgiAdminConfig.pagina);

test('Prueba Unidades CRUD - Hgi360 Admin', async t => {
    await ejecutarPrueba(t, hgiAdminConfig, ingresarAplicacion);
});
