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

const CODIGO = 'pruebaCodigoTalla';
const DESCRIPCION = 'descTalla';
const DESCRIPCION_EDIT = 'nuevaDescTalla';
const ORDEN = '87';
const ORDEN_EDIT = '5';

async function ejecutarPruebaTallas(t, config) {
    await ingresarAplicacion(t, config);
        await abrirMaestros360(t, 'Tallas', 'productos');
        await eliminarRegistroSiExiste(t, '#gridTallas', CODIGO);
                //se adiciona
            await t
            .click('#gridTallas .dx-icon.dx-icon-add')
            .typeText('#txtTallas_StrIdTalla', CODIGO)
            .typeText('#txtTallas_StrDescripcion .dx-texteditor-input', DESCRIPCION)
            .typeText('#txtTallas_IntOrden .dx-texteditor-input', ORDEN)
            .click('#BtnGuardarTallas .dx-icon.dx-icon-save')
            //.click(Selector('.swal2-actions button').withText('Aceptar'))
            //Se valida la creación
            .expect((Selector('#gridTallas td').withText(ORDEN)).exists).ok('no se encontro el registro creado')
            //se edita
            .click(Selector('#gridTallas [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
            .click('#txtTallas_StrDescripcion')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtTallas_StrDescripcion', DESCRIPCION_EDIT)
            .click('#txtTallas_IntOrden .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtTallas_IntOrden .dx-texteditor-input', ORDEN_EDIT)
            .click('#BtnGuardarTallas .dx-icon.dx-icon-save')
            //.click(Selector('.swal2-actions button').withText('Aceptar'))
            //Se valida la actualizacion
            .expect((Selector('#gridTallas td').withText(DESCRIPCION_EDIT)).exists).ok('no se encontro el registro actualizado')
            //Se elimina
            ;
        await eliminarRegistroDesdeGrid(t, '#gridTallas');
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `CRUD_Tallas - Test Hgi360`
    .page(testAdminConfig.pagina);

test('Prueba CRUD Tallas mierp - Test Hgi360', async t => {
    await ejecutarPruebaTallas(t, testAdminConfig);
});

fixture `CRUD_Tallas - Hgi360 Admin`
    .page(hgiAdminConfig.pagina);

test('Prueba CRUD Tallas mierp - Hgi360 Admin', async t => {
    await ejecutarPruebaTallas(t, hgiAdminConfig);
});
