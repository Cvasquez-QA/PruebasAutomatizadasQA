import { Selector } from 'testcafe';
import { ingresarAplicacion, abrirMaestros360, eliminarRegistroSiExiste, cerrarSesion360, cerrarPestana360, eliminarRegistroDesdeGrid, ingresarAplicacionMiHappgi } from '../../../Funciones/HelpersHgi360Legacy.js';
import { miContableConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js'; 
import { testContableConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js'; 

const CODIGO = '1234567';
const DESCRIPCION = 'MIDESC123';
const PORCENTAJE_TARIFA = '87500';
const DESCRIPCION_EDIT = 'MINUEVADESC';
const PORCENTAJE_TARIFA_EDIT = '10278';

/*
**************
*********************
*************************
*/


async function ejecutarPruebaTarifasAutRetencion1(t, config, ingresar) {
    await ingresar(t, config);
        await abrirMaestros360(t, 'Tarifas Aut. Retención');
        await eliminarRegistroSiExiste(t, '#gridTarifasCree', CODIGO);
        await t
            .click('#gridTarifasCree .dx-icon.dx-icon-add')
            .typeText('#txtTarifaCree_Idfoco', CODIGO)
            .typeText('#txtTarifaCree_Descripcion .dx-texteditor-input', DESCRIPCION)
            .typeText('#txtTarifaCree_PorTar .dx-texteditor-input', PORCENTAJE_TARIFA)
            //El sistema permite guardar una Tarifa CREE con un porcentaje mayor a 100 PERO este lo redondea
            .click(Selector('#BtnGuardarTarifaCree span').withText('Guardar'))
        //Se valida la creación
            .wait(4000)
            .expect(Selector('#gridTarifasCree td').withText(CODIGO).exists).ok()
        //Se edita
            .click(Selector('#gridTarifasCree [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
            .click('#txtTarifaCree_Descripcion .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtTarifaCree_Descripcion .dx-texteditor-input', DESCRIPCION_EDIT)
            .click('#txtTarifaCree_PorTar .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtTarifaCree_PorTar .dx-texteditor-input', PORCENTAJE_TARIFA_EDIT)
            .click(Selector('#BtnGuardarTarifaCree span').withText('Guardar'))
        //Se celiminar
            .wait(2000);
        await eliminarRegistroDesdeGrid(t, '#gridTarifasCree');
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

async function ejecutarPruebaTarifasAutRetencion2(t, config, ingresar) {
    await ingresar(t, config);
        await abrirMaestros360(t, 'Tarifas Aut. Retención');
        await eliminarRegistroSiExiste(t, '#gridTarifasCree', CODIGO);
        await t
            .click('#gridTarifasCree .dx-icon.dx-icon-add')
            .typeText('#txtTarifaCree_Idfoco', CODIGO)
            .typeText('#txtTarifaCree_Descripcion .dx-texteditor-input', DESCRIPCION)
            .typeText('#txtTarifaCree_PorTar .dx-texteditor-input', PORCENTAJE_TARIFA)
            //El sistema permite guardar una Tarifa CREE con un porcentaje mayor a 100 PERO este lo redondea
            .click(Selector('#BtnGuardarTarifaCree span').withText('Guardar'))
        //Se valida la creación
            .wait(4000)
            .expect(Selector('#gridTarifasCree td').withText(CODIGO).exists).ok()
        //Se edita
            .click(Selector('#gridTarifasCree [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
            .click('#txtTarifaCree_Descripcion .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtTarifaCree_Descripcion .dx-texteditor-input', DESCRIPCION_EDIT)
            .click('#txtTarifaCree_PorTar .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtTarifaCree_PorTar .dx-texteditor-input', PORCENTAJE_TARIFA_EDIT)
            .click(Selector('#BtnGuardarTarifaCree span').withText('Guardar'))
        //Se celiminar
            .wait(2000);
        await eliminarRegistroDesdeGrid(t, '#gridTarifasCree');
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `CRUD_TarifasAutRetencionUX - Mi ERP`
    .page(miContableConfig.pagina);

test('Prueba Tarifa AUT. RETENCIÓN Mi Contable - Mi ERP', async t => {
    await ejecutarPruebaTarifasAutRetencion1(t, miContableConfig, ingresarAplicacionMiHappgi);
});

test('Prueba Tarifa AUT. RETENCIÓN Test Contable - Mi ERP', async t => {
    await ejecutarPruebaTarifasAutRetencion2(t, miContableConfig, ingresarAplicacionMiHappgi);
});

fixture `CRUD_TarifasAutRetencionUX - Test Contable`
    .page(testContableConfig.pagina);

test('Prueba Tarifa AUT. RETENCIÓN Mi Contable - Test Contable', async t => {
    await ejecutarPruebaTarifasAutRetencion1(t, testContableConfig, ingresarAplicacion);
});

test('Prueba Tarifa AUT. RETENCIÓN Test Contable - Test Contable', async t => {
    await ejecutarPruebaTarifasAutRetencion2(t, testContableConfig, ingresarAplicacion);
});
