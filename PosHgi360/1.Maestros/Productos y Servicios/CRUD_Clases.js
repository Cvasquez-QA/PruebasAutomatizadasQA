import { Selector } from 'testcafe';
import {
    filtrarPor,
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

const CODIGO = 'miClase123';
const DESCRIPCION = 'MiDescripcionClase';
const DESCRIPCION_EDIT = 'MiNuevaDescripciónClase';
const TIPO = '2 - Productos';
const CONCEPTO = '0 - GENERAL';
const CONCEPTO_FILTRO = 'GENERAL';
async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    await abrirMaestros360(t, 'Clases', 'productos');
        await eliminarRegistroSiExiste(t, '#gridClases', CODIGO);
        await t
            .click('#gridClases .dx-icon.dx-icon-add')
        //Se procede a crear la Clase
            .typeText(Selector('#txtStrIdClase .dx-texteditor-input'), CODIGO)
            .click('#txtClase_Descripcion .dx-texteditor-input')
            .typeText('#txtClase_Descripcion .dx-texteditor-input', DESCRIPCION)
            //.click('#txtClases_StrConcepto .dx-lookup-field')
            //;
    await seleccionarOpcion(t, CONCEPTO);
    await t
            //El sistema permite la creación de una clase sin tener un concepto asociado
            .click(Selector('#txtClases_IntTipo .dx-lookup-field'))
            ;
    await seleccionarOpcion(t, TIPO);
    await t
            .click(Selector('#BtnActualizarClases span').withText('Guardar'))
            .wait(2000)
        //Se valida que se haya creado
            .expect(Selector('td').withText(CODIGO).exists).ok('no se encuentra la clase')
            .wait(2000)
        //Se edita la clase creada
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
        //Se elimina la clase
            .wait(2000);
        await eliminarRegistroDesdeGrid(t, '#gridClases');
            //Se cierra sesión
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `Prueba Clases testERP Pos - Test Hgi360`
    .page(testPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Test Hgi360 - Prueba Clases Completo mierp', async t => {
    await ejecutarPrueba(t, testPosConfig);
});

fixture `Prueba Clases testERP Pos - Hgi360 Pos`
    .page(hgiPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Test Hgi360 - Prueba Clases Completo mierp', async t => {
    await ejecutarPrueba(t, hgiPosConfig);
});
