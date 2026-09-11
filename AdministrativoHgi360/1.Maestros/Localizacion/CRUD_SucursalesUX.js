import { Selector } from 'testcafe';
import {
    ingresarAplicacion,
    abrirMaestros360,
    eliminarRegistroSiExiste,
    cerrarSesion360,
    cerrarPestana360,
    eliminarRegistroDesdeGrid
} from '../../../Funciones/HelpersHgi360.js';
import { testAdminConfig } from '../../../ParametrosPruebas/TestErpAdmin8902.js';
import { hgiAdminConfig } from '../../../ParametrosPruebas/Hgi360Admin8888.js';

const CODIGO = 'MiSucursal';
const DESCRIPCION = 'MIDESCRIPCION';
const DESCRIPCION_EDIT = 'MINUEVADESCRIPCION';

async function ejecutarPrueba(t, config, ingresar) {
    await ingresar(t, config);
        await abrirMaestros360(t, 'Sucursales', 'localizacion');
        await eliminarRegistroSiExiste(t, '#gridSucursales', CODIGO);
        await t
            .click('#gridSucursales .dx-icon.dx-icon-add')
            .typeText('#txtStrIdSucursalfocus', CODIGO)
            .typeText('#txtSucursales_Descripcion .dx-texteditor-input', DESCRIPCION)
            .click('#txtSucursales_IntEstado .dx-checkbox-icon')
            .click(Selector('#BtnActualizarSucursal span').withText('Guardar'))
            .wait(3000)
            .expect(Selector('#gridSucursales td').withText(CODIGO).exists).ok()
            .click(Selector('#gridSucursales [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
            .click('#txtSucursales_Descripcion .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtSucursales_Descripcion .dx-texteditor-input', DESCRIPCION_EDIT)
            .click(Selector('#BtnActualizarSucursal div').withText('Guardar'))
            .wait(4000);
        await eliminarRegistroDesdeGrid(t, '#gridSucursales');;
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `Prueba Sucursales - Test Hgi360`
    .page(testAdminConfig.pagina);

test('Prueba Sucursales Test Hgi360 CRUD - Test Hgi360', async t => {
    await ejecutarPrueba(t, testAdminConfig, ingresarAplicacion);
});

fixture `Prueba Sucursales - Hgi360 Admin`
    .page(hgiAdminConfig.pagina);

test('Prueba Sucursales CRUD - Hgi360 Admin', async t => {
    await ejecutarPrueba(t, hgiAdminConfig, ingresarAplicacion);
});
