import { Selector } from 'testcafe';
import { filtrarPor, seleccionarOpcion, ingresarAplicacion, abrirMaestros360, eliminarRegistroSiExiste, cerrarSesion360, cerrarPestana360, eliminarRegistroDesdeGrid, ingresarAplicacionMiHappgi } from '../../../Funciones/HelpersHgi360Legacy.js';
import { miContableConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js'; 
import { testContableConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js'; 

const CODIGO = 'MICODIGO123VENDEDOR';
const NOMBRE = 'VENDEDORCITO';
const NOMBRE_EDIT = 'Vendedor Pérez';
const FILTRO_GENERAL = 'General';
const TIPO_GENERAL = '0 - GENERAL';

/*
+++++++++++++++++++++++++++++++++++++++++++++
+++++++++++++++++++++++++++++++++++++++++++++
+++++++++++++++++++++++++++++++++++++++++++++
*/


async function ejecutarPruebaVendedores(t, config, ingresar) {
    await ingresar(t, config);
        await abrirMaestros360(t, 'Vendedores');
        await eliminarRegistroSiExiste(t, '#gridVendedores', CODIGO);
        await t
            .click(Selector('#gridVendedores .dx-icon.dx-icon-add'))
        //Se comienza con la inserción de datos para la creación del VENDEDOR
            .typeText('#txtVendedor_Codigo', CODIGO)
            .typeText('#txtVendedores_Nombre .dx-texteditor-input', NOMBRE)
            .click('#txtVendedores_ReporteA .dx-lookup-field');
            
            await filtrarPor(t, FILTRO_GENERAL);
            await t
            .wait(2000)
            ;
    await seleccionarOpcion(t, TIPO_GENERAL);
    await t
            .click('#txtVendedores_Sucursal .dx-lookup-field');
    
            await filtrarPor(t, FILTRO_GENERAL);
            await t
            .wait(2000)
            ;
    await seleccionarOpcion(t, TIPO_GENERAL);
    await t
            .click('#txtVendedores_Activo .dx-checkbox-icon')
            .click(Selector('#BtnGuardarVendedor div').withText('Guardar'))
            //El sistema permite guardar un VENDEDOR sin ReporteA
        //Se valida su creación 
            .wait(3000)
            .expect(Selector('#gridVendedores td').withText(CODIGO).exists).ok()
        //Se edita el vendedor
            .click(Selector('#gridVendedores [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
            .click('#txtVendedores_Nombre .dx-texteditor-input')
            .pressKey('backspace')
            .pressKey('ctrl+a')
            .typeText('#txtVendedores_Nombre .dx-texteditor-input', NOMBRE_EDIT)
            .click(Selector('#BtnGuardarVendedor span').withText('Guardar'))
        //Se elimina el vendedor
            .wait(4000);
        await eliminarRegistroDesdeGrid(t, '#gridVendedores');
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `CRUD_VendedoresUX - Mi ERP`
    .page(miContableConfig.pagina);

test('Prueba CRUD Vendedor Test Contable - Mi ERP', async t => {
    await ejecutarPruebaVendedores(t, miContableConfig, ingresarAplicacionMiHappgi);
});

fixture `CRUD_VendedoresUX - Test Contable`
    .page(testContableConfig.pagina);

test('Prueba CRUD Vendedor Test Contable - Test Contable', async t => {
    await ejecutarPruebaVendedores(t, testContableConfig, ingresarAplicacion);
});
