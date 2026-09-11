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

const CODIGO = 'miClase123';
const DESCRIPCION = 'MiDescripcionClase';
const DESCRIPCION_EDIT = 'MiNuevaDescripciónClase';
const TIPO = '2 - Productos';
const CONCEPTO = '0 - GENERAL';
const CONCEPTO_FILTRO = 'GENERAL';

async function ejecutarPrueba(t, config, ingresar) {
    await ingresar(t, config);
        await abrirMaestros360(t, 'Clases', 'productos');
        await eliminarRegistroSiExiste(t, '#gridClases', CODIGO);
        await t
            .click('#gridClases .dx-icon.dx-icon-add')
            .typeText(Selector('#txtStrIdClase .dx-texteditor-input'), CODIGO)
            .click('#txtClase_Descripcion .dx-texteditor-input')
            .typeText('#txtClase_Descripcion .dx-texteditor-input', DESCRIPCION)
            .click(Selector('#txtClases_IntTipo .dx-lookup-field'))
            ;
    await seleccionarOpcion(t, TIPO);
    await t
            .click(Selector('#BtnActualizarClases span').withText('Guardar'))
            .wait(2000)
            .expect(Selector('td').withText(CODIGO).exists).ok('no se encuentra la clase')
            .wait(2000)
            .click(Selector('#gridClases [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
            .click(Selector('#txtClase_Descripcion .dx-texteditor-input'))
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtClase_Descripcion .dx-texteditor-input', DESCRIPCION_EDIT)
            .click(Selector('#txtClases_StrConcepto .dx-lookup-field'));
    
        await filtrarPor(t, CONCEPTO_FILTRO);
            await seleccionarOpcion(t, CONCEPTO);
    await t
            .click(Selector('#BtnActualizarClases span').withText('Guardar'))
            .wait(2000);
        await eliminarRegistroDesdeGrid(t, '#gridClases');
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `Prueba Clases - Test Hgi360`
    .page(testAdminConfig.pagina);

test('Prueba Clases Completo Test Hgi360 - Test Hgi360', async t => {
    await ejecutarPrueba(t, testAdminConfig, ingresarAplicacion);
});

fixture `Prueba Clases - Hgi360 Admin`
    .page(hgiAdminConfig.pagina);

test('Prueba Clases Completo - Hgi360 Admin', async t => {
    await ejecutarPrueba(t, hgiAdminConfig, ingresarAplicacion);
});
