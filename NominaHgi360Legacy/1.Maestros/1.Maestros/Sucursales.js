import { Selector } from 'testcafe';
import { miNominaConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';
import { testNominaConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';
import {
    abrirMaestros360,
    cerrarPestana360,
    cerrarSesion360,
    eliminarRegistroSiExiste,
    ingresarAplicacion,
} from '../../../Funciones/HelpersHgi360Legacy.js';

const CODIGO_SUCURSAL = 'MiSucursal';
const DESCRIPCION_INICIAL = 'MIDESCRIPCION';
const DESCRIPCION_ACTUALIZADA = 'MINUEVADESCRIPCION';
const GRID_SUCURSALES = '#gridSucursales';

async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    await abrirMaestros360(t, 'Sucursales');
        await eliminarRegistroSiExiste(t, GRID_SUCURSALES, CODIGO_SUCURSAL);

        await t
            .click(`${GRID_SUCURSALES} .dx-icon.dx-icon-add`)
            .typeText('#txtStrIdSucursalfocus', CODIGO_SUCURSAL)
            .typeText('#txtSucursales_Descripcion .dx-texteditor-input', DESCRIPCION_INICIAL)
            .click('#txtSucursales_IntEstado .dx-checkbox-icon')
            .click(Selector('#BtnActualizarSucursal span').withText('Guardar'))
            .wait(3000)
            .expect(Selector(`${GRID_SUCURSALES} td`).withText(CODIGO_SUCURSAL).exists).ok()
            .click(Selector(`${GRID_SUCURSALES} [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]`).nth(1))
            .click('#txtSucursales_Descripcion .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtSucursales_Descripcion .dx-texteditor-input', DESCRIPCION_ACTUALIZADA)
            .click(Selector('#BtnActualizarSucursal div').withText('Guardar'))
            .wait(4000);

        await eliminarRegistroSiExiste(t, GRID_SUCURSALES, CODIGO_SUCURSAL);
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `Prueba Sucursales Hgi360 Nomina - MiHgi360`
    .page(miNominaConfig.pagina);

test('MiHgi360 - Prueba Sucursales testerp CRUD ', async t => {
    await ejecutarPrueba(t, miNominaConfig);
});

fixture `Prueba Sucursales Hgi360 Nomina - Test Hgi360`
    .page(testNominaConfig.pagina);

test('Test Hgi360 - Prueba Sucursales testerp CRUD ', async t => {
    await ejecutarPrueba(t, testNominaConfig);
});
