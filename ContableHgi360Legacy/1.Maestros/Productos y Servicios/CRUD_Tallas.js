import { Selector } from 'testcafe';
import { ingresarAplicacion, abrirMaestros360, eliminarRegistroSiExiste, cerrarSesion360, cerrarPestana360, eliminarRegistroDesdeGrid, ingresarAplicacionMiHappgi } from '../../../Funciones/HelpersHgi360Legacy.js';
import { miContableConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js'; 
import { testContableConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js'; 

const CODIGO = 'pruebaCodigoTalla';
const DESCRIPCION = 'descTalla';
const DESCRIPCION_EDIT = 'nuevaDescTalla';
const ORDEN = '87';
const ORDEN_EDIT = '5';


async function ejecutarPruebaTallas(t, config, ingresar) {
    await ingresar(t, config);
        await abrirMaestros360(t, 'Tallas');
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

fixture `CRUD_Tallas - Mi ERP`
    .page(miContableConfig.pagina);

test('Prueba CRUD Tallas Mi Contable - Mi ERP', async t => {
    await ejecutarPruebaTallas(t, miContableConfig, ingresarAplicacionMiHappgi);
});

fixture `CRUD_Tallas - Test Contable`
    .page(testContableConfig.pagina);

test('Prueba CRUD Tallas Mi Contable - Test Contable', async t => {
    await ejecutarPruebaTallas(t, testContableConfig, ingresarAplicacion);
});
