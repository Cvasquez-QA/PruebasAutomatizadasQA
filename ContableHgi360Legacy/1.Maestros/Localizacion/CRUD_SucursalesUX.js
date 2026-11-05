import { Selector } from 'testcafe';
import { ingresarAplicacion, abrirMaestros360, eliminarRegistroSiExiste, cerrarSesion360, cerrarPestana360, eliminarRegistroDesdeGrid, ingresarAplicacionMiHappgi } from '../../../Funciones/HelpersHgi360Legacy.js';
import { miContableConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js'; 
import { testContableConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js'; 

const CODIGO = 'MiSucursal';
const DESCRIPCION = 'MIDESCRIPCION';
const DESCRIPCION_EDIT = 'MINUEVADESCRIPCION';

/*
+++++++++++++++++++++++++++++++++++++++++++++
+++++++++++++++++++++++++++++++++++++++++++++
+++++++++++++++++++++++++++++++++++++++++++++
*/


async function ejecutarPruebaSucursales(t, config, ingresar) {
    await ingresar(t, config);
        await abrirMaestros360(t, 'Sucursales');
        await eliminarRegistroSiExiste(t, '#gridSucursales', CODIGO);
        await t
            .click('#gridSucursales .dx-icon.dx-icon-add')
        //Se comienza con la inserción de datos para la creación de la Sucursal
            .typeText('#txtStrIdSucursalfocus', CODIGO)
            .typeText('#txtSucursales_Descripcion .dx-texteditor-input', DESCRIPCION)
            .click('#txtSucursales_IntEstado .dx-checkbox-icon')
            .click(Selector('#BtnActualizarSucursal span').withText('Guardar'))
            //El sistema NO permite guardar una Sucursal sin zona
    //Se valida la creación
            .wait(3000)
            .expect(Selector('#gridSucursales td').withText(CODIGO).exists).ok()
    //Se edita la Sucursal
            .click(Selector('#gridSucursales [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
        //Se comienza con la inserción de datos para la actualización de la Sucursal
            .click('#txtSucursales_Descripcion .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtSucursales_Descripcion .dx-texteditor-input', DESCRIPCION_EDIT)
            .click(Selector('#BtnActualizarSucursal div').withText('Guardar'))
    //Se elimina la Sucursal
            .wait(4000);
        await eliminarRegistroDesdeGrid(t, '#gridSucursales');
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `CRUD_SucursalesUX - Mi ERP`
    .page(miContableConfig.pagina);

test('Prueba Sucursales Mi Contable CRUD - Mi ERP', async t => {
    await ejecutarPruebaSucursales(t, miContableConfig, ingresarAplicacionMiHappgi);
});

fixture `CRUD_SucursalesUX - Test Contable`
    .page(testContableConfig.pagina);

test('Prueba Sucursales Mi Contable CRUD - Test Contable', async t => {
    await ejecutarPruebaSucursales(t, testContableConfig, ingresarAplicacion);
});
