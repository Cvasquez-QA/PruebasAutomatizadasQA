import { Selector } from 'testcafe';
import { ingresarAplicacion, abrirMaestros360, eliminarRegistroSiExiste, cerrarSesion360, cerrarPestana360, eliminarRegistroDesdeGrid, ingresarAplicacionMiHappgi } from '../../../Funciones/HelpersHgi360Legacy.js';
import { miContableConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js'; 
import { testContableConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js'; 

const CODIGO = 'MiCodigoTarifaIva123';
const DESCRIPCION = 'MiDescTarifaIva123';
const PORCENTAJE = '40';
const PORCENTAJE2 = '1';
const DESCRIPCION_EDIT = 'minuevadescripcion';
const PORCENTAJE2_EDIT = '7.8';


async function ejecutarPruebaTarifasDeIva1(t, config, ingresar) {
    await ingresar(t, config);
        await abrirMaestros360(t, 'Tarifas De Iva');
        await eliminarRegistroSiExiste(t, '#gridTarifasIva', CODIGO);
        await t
            .click(Selector('#gridTarifasIva .dx-button-content').nth(1))
        //Se comienza con la inserción de datos para la creación de la tarifa
            .typeText('#txtIntIdIva', CODIGO)
             .typeText('#txtTarifaIva_Descripcion .dx-texteditor-input', DESCRIPCION)
            .typeText('#txtTarifaIva_Porcentaje .dx-texteditor-input', PORCENTAJE)
            .typeText('#txtTarifaIva_Porcentaje2 .dx-texteditor-input', PORCENTAJE2)
            .click(Selector('#BtnGuardarTarifaIva div').withText('Guardar'))
        //Se valida la creación 
            .wait(4000)
            .expect(Selector('#gridTarifasIva td').withText(CODIGO).exists).ok()
       //Se edita
            .click(Selector('#gridTarifasIva [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
             //Se comienza con la inserción de datos para la actualización del Tarifa Iva
            .click('#txtTarifaIva_Descripcion .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtTarifaIva_Descripcion .dx-texteditor-input', DESCRIPCION_EDIT)
            .click('#txtTarifaIva_Porcentaje2 .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtTarifaIva_Porcentaje2 .dx-texteditor-input', PORCENTAJE2_EDIT)
            .click('#BtnGuardarTarifaIva .dx-icon.dx-icon-save')
            .wait(4000)
        //Se elimina la tarifa
            ;
        await eliminarRegistroDesdeGrid(t, '#gridTarifasIva');
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

async function ejecutarPruebaTarifasDeIva2(t, config, ingresar) {
    await ingresar(t, config);
        await abrirMaestros360(t, 'Tarifas De Iva');
        await eliminarRegistroSiExiste(t, '#gridTarifasIva', CODIGO);
        await t
            .click(Selector('#gridTarifasIva .dx-button-content').nth(1))
        //Se comienza con la inserción de datos para la creación de la tarifa
            .typeText('#txtIntIdIva', CODIGO)
             .typeText('#txtTarifaIva_Descripcion .dx-texteditor-input', DESCRIPCION)
            .typeText('#txtTarifaIva_Porcentaje .dx-texteditor-input', PORCENTAJE)
            .typeText('#txtTarifaIva_Porcentaje2 .dx-texteditor-input', PORCENTAJE2)
            .click(Selector('#BtnGuardarTarifaIva div').withText('Guardar'))
        //Se valida la creación 
            .wait(4000)
            .expect(Selector('#gridTarifasIva td').withText(CODIGO).exists).ok()
       //Se edita
            .click(Selector('#gridTarifasIva [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
             //Se comienza con la inserción de datos para la actualización del Tarifa Iva
            .click('#txtTarifaIva_Descripcion .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtTarifaIva_Descripcion .dx-texteditor-input', DESCRIPCION_EDIT)
            .click('#txtTarifaIva_Porcentaje2 .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtTarifaIva_Porcentaje2 .dx-texteditor-input', PORCENTAJE2_EDIT)
            .click('#BtnGuardarTarifaIva .dx-icon.dx-icon-save')
            .wait(4000)
        //Se elimina la tarifa
            ;
        await eliminarRegistroDesdeGrid(t, '#gridTarifasIva');
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `CRUD_TarifasDeIvaUX - Mi ERP`
    .page(miContableConfig.pagina);

test('Prueba Tarifas de IVA CRUD Mi Contable - Mi ERP', async t => {
    await ejecutarPruebaTarifasDeIva1(t, miContableConfig, ingresarAplicacionMiHappgi);
});

test('Prueba Tarifas de IVA CRUD Test Contable - Mi ERP', async t => {
    await ejecutarPruebaTarifasDeIva2(t, miContableConfig, ingresarAplicacionMiHappgi);
});

fixture `CRUD_TarifasDeIvaUX - Test Contable`
    .page(testContableConfig.pagina);

test('Prueba Tarifas de IVA CRUD Mi Contable - Test Contable', async t => {
    await ejecutarPruebaTarifasDeIva1(t, testContableConfig, ingresarAplicacion);
});

test('Prueba Tarifas de IVA CRUD Test Contable - Test Contable', async t => {
    await ejecutarPruebaTarifasDeIva2(t, testContableConfig, ingresarAplicacion);
});
