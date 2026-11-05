import { Selector } from 'testcafe';
import { ingresarAplicacion, abrirMaestros360, eliminarRegistroSiExiste, cerrarSesion360, cerrarPestana360, ingresarAplicacionMiHappgi } from '../../../Funciones/HelpersHgi360Legacy.js';
import { miContableConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js'; 
import { testContableConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js'; 

const CODIGO = 'MisPuntos';
const DESCRIPCION = 'MIDESCRIPCION';
const DESCRIPCION_EDIT = 'MINUEVADESCRIPCION';

/*
+++++++++++++++++++++++++++++++++++++++++++++
+++++++++++++++++++++++++++++++++++++++++++++
+++++++++++++++++++++++++++++++++++++++++++++
*/


async function ejecutarPruebaCategoriaPuntos(t, config, ingresar) {
    await ingresar(t, config);
        await abrirMaestros360(t, 'Categoria Puntos');
        await eliminarRegistroSiExiste(t, '#gridCategoriaPuntos', CODIGO);
        await t
            .click('#gridCategoriaPuntos .dx-icon.dx-icon-add')
        //Se comienza con la inserción de datos para la creación de el registro
            .typeText('#CategoriaPuntos_StrIdCategoriaPuntos', CODIGO)
            .typeText('#txtCategoriaPuntos_StrDescripcion .dx-texteditor-input', DESCRIPCION)
            .click(Selector('#BtnGuardarCategoriaPuntos span').withText('Guardar'))
            
    //Se valida la creación
            .wait(3000)
            .expect(Selector('#gridCategoriaPuntos td').withText(CODIGO).exists).ok()
    //Se edita el registro
            .click(Selector('#gridCategoriaPuntos [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
        //Se comienza con la inserción de datos para la actualización de el registro
            .click('#txtCategoriaPuntos_StrDescripcion .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtCategoriaPuntos_StrDescripcion .dx-texteditor-input', DESCRIPCION_EDIT)
            .click(Selector('#BtnGuardarCategoriaPuntos div').withText('Guardar'))
    //Se elimina el registro
            .wait(4000)
            .click('#gridCategoriaPuntos [class^="dx-button-mode-contained dx-eliminar-gestion dx-li"]')
            .click(Selector('.swal2-actions button').withText('Aceptar'))
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `CRUD_CategoriaPuntosUX - Mi ERP`
    .page(miContableConfig.pagina);

test('Prueba CATEGORIA PUNTOS Test Contable CRUD - Mi ERP', async t => {
    await ejecutarPruebaCategoriaPuntos(t, miContableConfig, ingresarAplicacionMiHappgi);
});

fixture `CRUD_CategoriaPuntosUX - Test Contable`
    .page(testContableConfig.pagina);

test('Prueba CATEGORIA PUNTOS Test Contable CRUD - Test Contable', async t => {
    await ejecutarPruebaCategoriaPuntos(t, testContableConfig, ingresarAplicacion);
});
