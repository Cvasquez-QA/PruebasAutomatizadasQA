import { Selector } from 'testcafe';
import {
    ingresarAplicacion,
    abrirMaestros360,
    eliminarRegistroSiExiste,
    cerrarSesion360,
    cerrarPestana360
} from '../../../Funciones/HelpersHgi360.js';
import { testAdminConfig } from '../../../ParametrosPruebas/TestErpAdmin8902.js';
import { hgiAdminConfig } from '../../../ParametrosPruebas/Hgi360Admin8888.js';

const CODIGO = 'mitransaccion123';
const DESCRIPCION = 'midesctransaccion';
const DESCRIPCION_EDIT = 'minuevadesc';

async function ejecutarPrueba(t, config, ingresar) {
    await ingresar(t, config);
        await abrirMaestros360(t, 'Transacciones');
        await eliminarRegistroSiExiste(t, '#gridTransacciones', CODIGO);
        await t
            .click('#gridTransacciones .dx-icon.dx-icon-add')
            .wait(1500)
            .typeText('#txtIntIdTransaccion', CODIGO)
            .typeText('#TxtTransaccion_Descripcion .dx-texteditor-input', DESCRIPCION)
            .click(Selector('#BtnGuardarTransaccion span').withText('Guardar'))
            .wait(2000)
            .expect(Selector('#gridTransacciones td').withText(CODIGO).exists).ok()
            .click(Selector('#gridTransacciones [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
            .wait(1500)
            .click('#TxtTransaccion_Descripcion .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#TxtTransaccion_Descripcion .dx-texteditor-input', DESCRIPCION_EDIT)
            .click(Selector('#BtnGuardarTransaccion span').withText('Guardar'))
            .wait(2000);
        await eliminarRegistroSiExiste(t, '#gridTransacciones', CODIGO);
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `Prueba CRUD Transaccion - Test Hgi360`
    .page(testAdminConfig.pagina);

test('Prueba CRUD Transaccion Test Hgi360 - Test Hgi360', async t => {
    await ejecutarPrueba(t, testAdminConfig, ingresarAplicacion);
});

fixture `Prueba CRUD Transaccion - Hgi360 Admin`
    .page(hgiAdminConfig.pagina);

test('Prueba CRUD Transaccion - Hgi360 Admin', async t => {
    await ejecutarPrueba(t, hgiAdminConfig, ingresarAplicacion);
});
