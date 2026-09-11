import { Selector } from 'testcafe';
import {
    filtrarPorInput,
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

const CODIGO = 'MiCaracteristica';
const DESCRIPCION = 'MIDESCRIPCION';
const DESCRIPCION_EDIT = 'MINUEVADESCRIPCION';
const LINEA = '0 - GENERAL';
const ITEM = '0';
const CARACTERISTICA = '1 - Característica 1';

/*
+++++++++++++++++++++++++++++++++++++++++++++
+++++++++++++++++++++++++++++++++++++++++++++
+++++++++++++++++++++++++++++++++++++++++++++
*/

async function ejecutarPruebaCaracteristica(t, config) {
    await ingresarAplicacion(t, config);
        await abrirMaestros360(t, 'Característica', 'productos');
        await eliminarRegistroSiExiste(t, '#gridCaracteristicas', CODIGO);
        await t
            .click('#gridCaracteristicas .dx-icon.dx-icon-add')
        //Se comienza con la inserción de datos para la creación de el registro
            .typeText('#txtCaracteristicas_StrIdCaracteristica', CODIGO)
            .typeText('#txtCaracteristicas_StrDescripcion .dx-texteditor-input', DESCRIPCION)
            .click('#txtCaracteristicas_StrLinea .dx-lookup-field')
            .click(filtrarPorInput)
            ;
    await seleccionarOpcion(t, LINEA);
    await t
            .typeText('#txtCaracteristicas_IntItem .dx-texteditor-input', ITEM)
            .click('#txtCaracteristicas_IntCaracteristica .dx-lookup-field')
            ;
    await seleccionarOpcion(t, CARACTERISTICA);
    await t
            .click(Selector('#BtnGuardarCaracteristicas div').withText('Guardar'))
            //El sistema NO permite guardar una Sector sin zona
    //Se valida la creación
            .wait(3000)
            .expect(Selector('#gridCaracteristicas td').withText(CODIGO).exists).ok()
    //Se edita el registro
            .click(Selector('#gridCaracteristicas [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
        //Se comienza con la inserción de datos para la actualización de el registro
            .click('#txtCaracteristicas_StrDescripcion .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtCaracteristicas_StrDescripcion .dx-texteditor-input', DESCRIPCION_EDIT)
            .click(Selector('#BtnGuardarCaracteristicas div').withText('Guardar'))
    //Se elimina el registro
            .wait(4000);
        await eliminarRegistroDesdeGrid(t, '#gridCaracteristicas');
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `CRUD_Caracteristica - Test Hgi360`
    .page(testAdminConfig.pagina);

test('Prueba CARACTERÍSTICA testerp CRUD - Test Hgi360', async t => {
    await ejecutarPruebaCaracteristica(t, testAdminConfig);
});

fixture `CRUD_Caracteristica - Hgi360 Admin`
    .page(hgiAdminConfig.pagina);

test('Prueba CARACTERÍSTICA Hgi360 Admin CRUD - Hgi360 Admin', async t => {
    await ejecutarPruebaCaracteristica(t, hgiAdminConfig);
});
