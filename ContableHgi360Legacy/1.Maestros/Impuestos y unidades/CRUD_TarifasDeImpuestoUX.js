import { Selector } from 'testcafe';
import { ingresarAplicacion, abrirMaestros360, eliminarRegistroSiExiste, cerrarSesion360, cerrarPestana360, eliminarRegistroDesdeGrid, ingresarAplicacionMiHappgi } from '../../../Funciones/HelpersHgi360Legacy.js';
import { miContableConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js'; 
import { testContableConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js'; 

const CODIGO = 'micodigo123';
const DESCRIPCION = 'midectaridaimpuyesto';
const PORCENTAJE = '333';
const DESCRIPCION_EDIT = 'minuevadesc';
const PORCENTAJE_EDIT = '12,2';


async function ejecutarPruebaTarifasDeImpuesto1(t, config, ingresar) {
    await ingresar(t, config);
        await abrirMaestros360(t, 'Tarifas De Impuesto');
        await eliminarRegistroSiExiste(t, '#gridTarifasImpto1', CODIGO);
        await t
            .click('#gridTarifasImpto1 .dx-icon.dx-icon-add')
            .typeText('#txtIntIdCodigo', CODIGO)
            .typeText('#txtTarifaImpto1_Descripcion .dx-texteditor-input', DESCRIPCION)
            .typeText('#txtTarifaImpto1_Porcentaje .dx-texteditor-input', PORCENTAJE)
            //El sistema permite guardar una tarifa de impuesto con un porcentaje mayor a 100
            .click(Selector('#BtnGuardarTarifaImpto1 span').withText('Guardar'))
        //Se valida la creación
            .wait(4000)
            .expect(Selector('#gridTarifasImpto1 td').withText(CODIGO).exists).ok()
        //Se edita
            .click(Selector('#gridTarifasImpto1 [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
            .click('#txtTarifaImpto1_Descripcion .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtTarifaImpto1_Descripcion .dx-texteditor-input', DESCRIPCION_EDIT)
            .click('#txtTarifaImpto1_Porcentaje .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtTarifaImpto1_Porcentaje .dx-texteditor-input', PORCENTAJE_EDIT)
            .click(Selector('#BtnGuardarTarifaImpto1 span').withText('Guardar'))
            .wait(4000)
        //Se elimina la tarifa de impuesto
            ;
        await eliminarRegistroDesdeGrid(t, '#gridTarifasImpto1');
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

async function ejecutarPruebaTarifasDeImpuesto2(t, config, ingresar) {
    await ingresar(t, config);
        await abrirMaestros360(t, 'Tarifas De Impuesto');
        await eliminarRegistroSiExiste(t, '#gridTarifasImpto1', CODIGO);
        await t
            .click('#gridTarifasImpto1 .dx-icon.dx-icon-add')
            .typeText('#txtIntIdCodigo', CODIGO)
            .typeText('#txtTarifaImpto1_Descripcion .dx-texteditor-input', DESCRIPCION)
            .typeText('#txtTarifaImpto1_Porcentaje .dx-texteditor-input', PORCENTAJE)
            //El sistema permite guardar una tarifa de impuesto con un porcentaje mayor a 100
            .click(Selector('#BtnGuardarTarifaImpto1 span').withText('Guardar'))
        //Se valida la creación
            .wait(4000)
            .expect(Selector('#gridTarifasImpto1 td').withText(CODIGO).exists).ok()
        //Se edita
            .click(Selector('#gridTarifasImpto1 [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
            .click('#txtTarifaImpto1_Descripcion .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtTarifaImpto1_Descripcion .dx-texteditor-input', DESCRIPCION_EDIT)
            .click('#txtTarifaImpto1_Porcentaje .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtTarifaImpto1_Porcentaje .dx-texteditor-input', PORCENTAJE_EDIT)
            .click(Selector('#BtnGuardarTarifaImpto1 span').withText('Guardar'))
            .wait(4000)
        //Se elimina la tarifa de impuesto
            ;
        await eliminarRegistroDesdeGrid(t, '#gridTarifasImpto1');
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `CRUD_TarifasDeImpuestoUX - Mi ERP`
    .page(miContableConfig.pagina);

test('Prueba Tarifa de Impuesto Mi Contable CRUD - Mi ERP', async t => {
    await ejecutarPruebaTarifasDeImpuesto1(t, miContableConfig, ingresarAplicacionMiHappgi);
});

test('Prueba Tarifa de Impuesto Test Contable - Mi ERP', async t => {
    await ejecutarPruebaTarifasDeImpuesto2(t, miContableConfig, ingresarAplicacionMiHappgi);
});

fixture `CRUD_TarifasDeImpuestoUX - Test Contable`
    .page(testContableConfig.pagina);

test('Prueba Tarifa de Impuesto Mi Contable CRUD - Test Contable', async t => {
    await ejecutarPruebaTarifasDeImpuesto1(t, testContableConfig, ingresarAplicacion);
});

test('Prueba Tarifa de Impuesto Test Contable - Test Contable', async t => {
    await ejecutarPruebaTarifasDeImpuesto2(t, testContableConfig, ingresarAplicacion);
});
