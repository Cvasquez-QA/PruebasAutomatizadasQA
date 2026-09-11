import { Selector } from 'testcafe';
import {
    filtrarPor,
    seleccionarOpcion,
    ingresarAplicacion,
    abrirMaestros360,
    eliminarRegistroSiExiste,
    cerrarSesion360,
    cerrarPestana360,
    eliminarRegistroDesdeGrid
} from '../../../Funciones/HelpersHgi360.js';
import { testAdminConfig } from '../../../ParametrosPruebas/TestErpAdmin8902.js';
import { hgiAdminConfig } from '../../../ParametrosPruebas/Hgi360Admin8888.js';

const CODIGO = 'MiTipo123';
const DESCRIPCION = 'MiDescripcionTipo';
const DESCRIPCION_EDIT = 'minuevadescripcion';
const CONCEPTO_FILTRO = 'GENERAL';
const CONCEPTO = '0 - GENERAL';

async function ejecutarPrueba(t, config, ingresar) {
    await ingresar(t, config);
        await abrirMaestros360(t, 'Tipos', 'productos');
        await eliminarRegistroSiExiste(t, '#gridTipos', CODIGO);
        await t
            .click('#gridTipos .dx-icon.dx-icon-add')
            .typeText('#txtStrIdTipo', CODIGO)
            .typeText('#txtTipo_Descripcion .dx-texteditor-input', DESCRIPCION)
            .click(Selector('#BtnGuardarTipo span').withText('Guardar'))
            .wait(2000)
            .expect(Selector('td').withText(CODIGO).exists).ok()
            .wait(1000)
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
            .wait(2000);
        await eliminarRegistroDesdeGrid(t, '#gridTipos');
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `Prueba Tipos - Test Hgi360`
    .page(testAdminConfig.pagina);

test('Prueba CRUD Tipos Test Hgi360 - Test Hgi360', async t => {
    await ejecutarPrueba(t, testAdminConfig, ingresarAplicacion);
});

fixture `Prueba Tipos - Hgi360 Admin`
    .page(hgiAdminConfig.pagina);

test('Prueba CRUD Tipos - Hgi360 Admin', async t => {
    await ejecutarPrueba(t, hgiAdminConfig, ingresarAplicacion);
});
