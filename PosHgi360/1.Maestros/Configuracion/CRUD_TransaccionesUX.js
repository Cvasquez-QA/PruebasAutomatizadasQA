import { Selector } from 'testcafe';
import {
    ingresarAplicacion,
    abrirMaestros360,
    eliminarRegistroSiExiste,
    cerrarSesion360,
    cerrarPestana360,
    limpiarCacheChromeTestCafe
} from '../../../Funciones/HelpersHgi360Legacy.js';
import { testPosConfig, hgiPosConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

const CODIGO = 'mitransaccion123';
const DESCRIPCION = 'midesctransaccion';
const DESCRIPCION_EDIT = 'minuevadesc';

async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    await abrirMaestros360(t, 'Transacciones');
        await eliminarRegistroSiExiste(t, '#gridTransacciones', CODIGO);
        await t
            .click('#gridTransacciones .dx-icon.dx-icon-add')
            .wait(1500)
            .typeText('#txtIntIdTransaccion', CODIGO)
            .typeText('#TxtTransaccion_Descripcion .dx-texteditor-input', DESCRIPCION)
            .click(Selector('#BtnGuardarTransaccion span').withText('Guardar'))
            //.click(Selector('button').withText('Aceptar'))
        //Se valida la creación
            .wait(2000)
            .expect(Selector('#gridTransacciones td').withText(CODIGO).exists).ok()
        //Se edita
            .click(Selector('#gridTransacciones [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
            .wait(1500)
            .click('#TxtTransaccion_Descripcion .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#TxtTransaccion_Descripcion .dx-texteditor-input', DESCRIPCION_EDIT)
            //.expect(Selector('#txtTransaccion_Tipo .dx-texteditor-input').withText('Documentos').exists).ok()
            .click(Selector('#BtnGuardarTransaccion span').withText('Guardar'))
            //.click(Selector('button').withText('Aceptar'))
            .wait(2000)
        //Se elimina la Transaccion
            await eliminarRegistroSiExiste(t, '#gridTransacciones', CODIGO);
            await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `Prueba CRUD Transaccion testERP Pos - Test Hgi360`
    .page(testPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Test Hgi360 - Prueba CRUD Transaccion mihgi360', async t => {
    await ejecutarPrueba(t, testPosConfig);
});

fixture `Prueba CRUD Transaccion testERP Pos - Hgi360 Pos`
    .page(hgiPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Test Hgi360 - Prueba CRUD Transaccion mihgi360', async t => {
    await ejecutarPrueba(t, hgiPosConfig);
});
