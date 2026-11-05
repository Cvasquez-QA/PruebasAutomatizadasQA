import { Selector } from 'testcafe';
import { ingresarAplicacion, abrirMaestros360, seleccionarOpcion, eliminarRegistroSiExiste, cerrarSesion360, cerrarPestana360, eliminarRegistroDesdeGrid, ingresarAplicacionMiHappgi } from '../../../Funciones/HelpersHgi360Legacy.js';
import { miContableConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js'; 
import { testContableConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js'; 

const CODIGO = 'mibodega123';
const DESCRIPCION = 'descripcionmibodega';
const DIRECCION = 'direcciónmibidega123';
const TELEFONO = '1623456as';
const RESPONSABLE = 'nosé';
const DESCRIPCION_EDIT = 'nueva descripcion bodega';
const RESPONSABLE_EDIT = 'nuevoresponsablebodega';
const LISTA_PRECIOS = '1 - Precio 1';


async function ejecutarPruebaBodegas(t, config, ingresar) {
    await ingresar(t, config);
        await abrirMaestros360(t, 'Bodegas');
        await eliminarRegistroSiExiste(t, '#gridBodegas', CODIGO);
        await t
            .click('#gridBodegas .dx-icon.dx-icon-add')
        //Se comienza con la inserción de datos para la creación de la bodega
            .typeText('#txtIdBodegafocus', CODIGO)
            .typeText('#txtBodega_Descripcion .dx-texteditor-input', DESCRIPCION)
            .typeText('#txtBodega_Direccion .dx-texteditor-input', DIRECCION)
            .typeText('#txtBodega_Telefono .dx-texteditor-input', TELEFONO)
            .click('#txtBodega_Responsable .dx-texteditor-input')
            .typeText('#txtBodega_Responsable .dx-texteditor-input', RESPONSABLE)
            .click(Selector('#txtBodega_ListaPrecios .dx-lookup-field'))
            //El sistema permite guardar una Bodega sin precio
            .click(Selector('#txtBodega_Estado .dx-radiobutton-icon').nth(2))
            .click(Selector('#BtnActualizarBodega span').withText('Guardar'))
        //Se valida la creación 
            .wait(4000)
            .expect(Selector('#gridBodegas td').withText(CODIGO).exists).ok()
        //Se edita la bodega
            .click(Selector('#gridBodegas [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
            .click('#txtBodega_Descripcion .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtBodega_Descripcion .dx-texteditor-input', DESCRIPCION_EDIT)
            .click('#txtBodega_Responsable .dx-texteditor-input')     
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtBodega_Responsable .dx-texteditor-input', RESPONSABLE_EDIT)
            .click(Selector('#txtBodega_ListaPrecios .dx-lookup-field'))
            ;
    await seleccionarOpcion(t, LISTA_PRECIOS);
    await t
            .click('#txtBodega_Estado .dx-radiobutton-icon')
            .click(Selector('#BtnActualizarBodega span').withText('Guardar'))
        //Se elimina la bodega
            .wait(4000);
        await eliminarRegistroDesdeGrid(t, '#gridBodegas');
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `CRUD_BodegasUX - Mi ERP`
    .page(miContableConfig.pagina);

test('Prueba Bodegas Mi Contable CRUD - Mi ERP', async t => {
    await ejecutarPruebaBodegas(t, miContableConfig, ingresarAplicacionMiHappgi);
});

fixture `CRUD_BodegasUX - Test Contable`
    .page(testContableConfig.pagina);

test('Prueba Bodegas Mi Contable CRUD - Test Contable', async t => {
    await ejecutarPruebaBodegas(t, testContableConfig, ingresarAplicacion);
});
