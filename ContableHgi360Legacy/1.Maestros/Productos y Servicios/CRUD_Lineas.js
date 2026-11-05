import { Selector } from 'testcafe';
import { ingresarAplicacion, abrirMaestros360, eliminarRegistroSiExiste, cerrarSesion360, cerrarPestana360, eliminarRegistroDesdeGrid, ingresarAplicacionMiHappgi } from '../../../Funciones/HelpersHgi360Legacy.js';
import { miContableConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js'; 
import { testContableConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js'; 

const CODIGO = '123456';
const DESCRIPCION = 'MiDescripciónLinea';
const DESCRIPCION_EDIT = 'MiNuevaDescripciónLinea';
const DESCUENTO = '20';
const DESCUENTO_MAX = '150';

/*
+++++++++++++++++++++++++++++++++++++++++++++
+++++++++++++++++++++++++++++++++++++++++++++
+++++++++++++++++++++++++++++++++++++++++++++
*/


async function ejecutarPruebaLineas(t, config, ingresar) {
    await ingresar(t, config);
        await abrirMaestros360(t, 'Lineas');
        await eliminarRegistroSiExiste(t, '#gridLineas', CODIGO);
                //Se procede a crear la línea
            await t
            .click('#gridLineas .dx-icon.dx-icon-add')
            .typeText('#txtStrIdLinea', CODIGO)
            //El sistema permite cualquier caracter para el còdigo de la lìnea
            .typeText('#txtLineas_Descripcion .dx-texteditor-input', DESCRIPCION)
            .typeText('#txtLineas_Descuento .dx-texteditor-input', DESCUENTO)
            .typeText('#txtLineas_DescuentoMax .dx-texteditor-input', DESCUENTO_MAX)
            .click(Selector('#BtnGuardarLinea div').withText('Guardar'))
    //'Consulta y valida la creación de la Linea'
            .wait(3000)
            .expect(Selector('td').withText(CODIGO).exists).ok()
    //'Editar Linea'
            .click(Selector('#gridLineas [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
            .click('#txtLineas_Descripcion .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtLineas_Descripcion .dx-texteditor-input', DESCRIPCION_EDIT)
            .click(Selector('#BtnGuardarLinea div').withText('Guardar'))
    //'Eliminar Linea'
            .wait(3000);
        await eliminarRegistroDesdeGrid(t, '#gridLineas');
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `CRUD_Lineas - Mi ERP`
    .page(miContableConfig.pagina);

test('Prueba Líneas Mi Contable - Mi ERP', async t => {
    await ejecutarPruebaLineas(t, miContableConfig, ingresarAplicacionMiHappgi);
});

fixture `CRUD_Lineas - Test Contable`
    .page(testContableConfig.pagina);

test('Prueba Líneas Mi Contable - Test Contable', async t => {
    await ejecutarPruebaLineas(t, testContableConfig, ingresarAplicacion);
});
