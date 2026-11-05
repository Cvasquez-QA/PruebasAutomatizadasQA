import { Selector } from 'testcafe';
import { ingresarAplicacion, abrirMaestros360, eliminarRegistroSiExiste, cerrarSesion360, cerrarPestana360, ingresarAplicacionMiHappgi } from '../../../Funciones/HelpersHgi360Legacy.js';
import { miContableConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js'; 
import { testContableConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js'; 

const CODIGO = 'mitransaccion123';
const DESCRIPCION = 'midesctransaccion';
const DESCRIPCION_EDIT = 'minuevadesc';


/*
**********************************************************************
**********************************************************************
*/


async function ejecutarPruebaTransacciones(t, config, ingresar) {
    await ingresar(t, config);
        await abrirMaestros360(t, 'Transacciones');
        await eliminarRegistroSiExiste(t, '#gridTransacciones', CODIGO);
        await t
            .click('#gridTransacciones .dx-icon.dx-icon-add')
            .wait(1500)
            .typeText('#txtIntIdTransaccion', CODIGO)
            .typeText('#TxtTransaccion_Descripcion .dx-texteditor-input', DESCRIPCION)
            .click(Selector('#BtnGuardarTransaccion span').withText('Guardar'))
            //.click(Selector('button').withText('Aceptar'))
        //Se valida la creación
            .wait(2000)
            .expect(Selector('#gridTransacciones td').withText(CODIGO).exists).ok()
        //Se edita
            .click(Selector('#gridTransacciones [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
            .wait(1500)
            .click('#TxtTransaccion_Descripcion .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#TxtTransaccion_Descripcion .dx-texteditor-input', DESCRIPCION_EDIT)
            //.expect(Selector('#txtTransaccion_Tipo .dx-texteditor-input').withText('Documentos').exists).ok()
            .click(Selector('#BtnGuardarTransaccion span').withText('Guardar'))
            //.click(Selector('button').withText('Aceptar'))
            .wait(2000)
        //Se elimina la Transaccion
            await eliminarRegistroSiExiste(t, '#gridTransacciones', CODIGO);
            await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `CRUD_TransaccionesUX - Mi ERP`
    .page(miContableConfig.pagina);

test('Prueba CRUD Transaccion mihgi360 - Mi ERP', async t => {
    await ejecutarPruebaTransacciones(t, miContableConfig, ingresarAplicacionMiHappgi);
});

fixture `CRUD_TransaccionesUX - Test Contable`
    .page(testContableConfig.pagina);

test('Prueba CRUD Transaccion mihgi360 - Test Contable', async t => {
    await ejecutarPruebaTransacciones(t, testContableConfig, ingresarAplicacion);
});
