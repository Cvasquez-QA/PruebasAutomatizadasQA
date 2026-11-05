import { Selector } from 'testcafe';
import { ingresarAplicacion, abrirMaestros360, eliminarRegistroSiExiste, cerrarSesion360, cerrarPestana360, eliminarRegistroDesdeGrid, ingresarAplicacionMiHappgi } from '../../../Funciones/HelpersHgi360Legacy.js';
import { miContableConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js'; 
import { testContableConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js'; 

const CODIGO = 'codReteFte';
const DESCRIPCION = 'DESCRIPCIONRETEFUENTE';
const BASE_RTE_FTE = '5314';
const PORCENTAJE_ND = '801';
const PORCENTAJE_DECL = '100';
const BASE_RTE_ICA = '896';
const PORCENTAJE = '5664';
const DESCRIPCION_EDIT = 'NuevaDescripciónReteFuente';
const BASE_RTE_FTE_EDIT = '5000';
const BASE_RTE_ICA_EDIT = '800069';
const PORCENTAJE_EDIT = '8411';

/*
**************
*********************
*************************
*/


async function ejecutarPruebaTablasReteFte1(t, config, ingresar) {
    await ingresar(t, config);
        await abrirMaestros360(t, 'Tabla De Retención En La Fte');
        await eliminarRegistroSiExiste(t, '#gridTarifasRetenciones', CODIGO);
        await t
            .click('#gridTarifasRetenciones .dx-icon.dx-icon-add')
        //Se comienza con la inserción de datos para la creación de la Tabla
            .typeText('#txtIntIdRetencion', CODIGO)
            .click('#txtTarifasRetencion_Descripcion .dx-texteditor-input')
            .typeText('#txtTarifasRetencion_Descripcion .dx-texteditor-input', DESCRIPCION)
            .typeText('#txtTarifasRetencion_BaseRteFte .dx-texteditor-input', BASE_RTE_FTE)
            .typeText('#txtTarifasRetencion_PorcentajeND .dx-texteditor-input', PORCENTAJE_ND)
            .typeText('#txtTarifasRetencion_PorcentajeDecl .dx-texteditor-input', PORCENTAJE_DECL)
            .typeText('#txtTarifasRetencion_BaseRteIca .dx-texteditor-input', BASE_RTE_ICA)
            .typeText('#txtTarifasRetencion_Porcentaje .dx-texteditor-input', PORCENTAJE)
            //El sistema no permite que se guarde un porcentaje mayor a 100, por lo que si se ingresa un valor mayor, el sistema le asigna el 100 por defecto
            .click(Selector('#BtnGuardarTarifasRetencion span').withText('Guardar'))
        //Se valida la creación 
            .wait(4000)
            .expect(Selector('#gridTarifasRetenciones td').withText(CODIGO).exists).ok()
       //Se edita
            .wait(2000)
            .click(Selector('#gridTarifasRetenciones [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
             //Se comienza con la inserción de datos para la actualización del Tabla RTE FTE
            .click('#txtTarifasRetencion_Descripcion .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtTarifasRetencion_Descripcion .dx-texteditor-input', DESCRIPCION_EDIT)
            //El sistema no permite el ingreso de información cuando el cursor está a la derecha
            .click(Selector('#txtTarifasRetencion_BaseRteFte .dx-texteditor-input'))
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtTarifasRetencion_BaseRteFte .dx-texteditor-input', BASE_RTE_FTE_EDIT)
            .click(Selector('#txtTarifasRetencion_BaseRteIca .dx-texteditor-input'))
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtTarifasRetencion_BaseRteIca .dx-texteditor-input', BASE_RTE_ICA_EDIT)
            .click(Selector('#txtTarifasRetencion_Porcentaje .dx-texteditor-input'))
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtTarifasRetencion_Porcentaje .dx-texteditor-input', PORCENTAJE_EDIT)
            .click(Selector('#BtnGuardarTarifasRetencion div').withText('Guardar'))
        //Se elimina 
            .wait(2000);
        await eliminarRegistroDesdeGrid(t, '#gridTarifasRetenciones');
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

async function ejecutarPruebaTablasReteFte2(t, config, ingresar) {
    await ingresar(t, config);
        await abrirMaestros360(t, 'Tabla De Retención En La Fte');
        await eliminarRegistroSiExiste(t, '#gridTarifasRetenciones', CODIGO);
        await t
            .click('#gridTarifasRetenciones .dx-icon.dx-icon-add')
        //Se comienza con la inserción de datos para la creación de la Tabla
            .typeText('#txtIntIdRetencion', CODIGO)
            .click('#txtTarifasRetencion_Descripcion .dx-texteditor-input')
            .typeText('#txtTarifasRetencion_Descripcion .dx-texteditor-input', DESCRIPCION)
            .typeText('#txtTarifasRetencion_BaseRteFte .dx-texteditor-input', BASE_RTE_FTE)
            .typeText('#txtTarifasRetencion_PorcentajeND .dx-texteditor-input', PORCENTAJE_ND)
            .typeText('#txtTarifasRetencion_PorcentajeDecl .dx-texteditor-input', PORCENTAJE_DECL)
            .typeText('#txtTarifasRetencion_BaseRteIca .dx-texteditor-input', BASE_RTE_ICA)
            .typeText('#txtTarifasRetencion_Porcentaje .dx-texteditor-input', PORCENTAJE)
            //El sistema no permite que se guarde un porcentaje mayor a 100, por lo que si se ingresa un valor mayor, el sistema le asigna el 100 por defecto
            .click(Selector('#BtnGuardarTarifasRetencion span').withText('Guardar'))
        //Se valida la creación 
            .wait(4000)
            .expect(Selector('#gridTarifasRetenciones td').withText(CODIGO).exists).ok()
       //Se edita
            .wait(2000)
            .click(Selector('#gridTarifasRetenciones [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
             //Se comienza con la inserción de datos para la actualización del Tabla RTE FTE
            .click('#txtTarifasRetencion_Descripcion .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtTarifasRetencion_Descripcion .dx-texteditor-input', DESCRIPCION_EDIT)
            //El sistema no permite el ingreso de información cuando el cursor está a la derecha
            .click(Selector('#txtTarifasRetencion_BaseRteFte .dx-texteditor-input'))
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtTarifasRetencion_BaseRteFte .dx-texteditor-input', BASE_RTE_FTE_EDIT)
            .click(Selector('#txtTarifasRetencion_BaseRteIca .dx-texteditor-input'))
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtTarifasRetencion_BaseRteIca .dx-texteditor-input', BASE_RTE_ICA_EDIT)
            .click(Selector('#txtTarifasRetencion_Porcentaje .dx-texteditor-input'))
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtTarifasRetencion_Porcentaje .dx-texteditor-input', PORCENTAJE_EDIT)
            .click(Selector('#BtnGuardarTarifasRetencion div').withText('Guardar'))
        //Se elimina 
            .wait(2000);
        await eliminarRegistroDesdeGrid(t, '#gridTarifasRetenciones');
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `CRUD_TablasReteFteUX - Mi ERP`
    .page(miContableConfig.pagina);

test('Prueba Rte Fnte CRUD Mi Contable - Mi ERP', async t => {
    await ejecutarPruebaTablasReteFte1(t, miContableConfig, ingresarAplicacionMiHappgi);
});

test('Prueba Rte Fnte CRUD Test Contable - Mi ERP', async t => {
    await ejecutarPruebaTablasReteFte2(t, miContableConfig, ingresarAplicacionMiHappgi);
});

fixture `CRUD_TablasReteFteUX - Test Contable`
    .page(testContableConfig.pagina);

test('Prueba Rte Fnte CRUD Mi Contable - Test Contable', async t => {
    await ejecutarPruebaTablasReteFte1(t, testContableConfig, ingresarAplicacion);
});

test('Prueba Rte Fnte CRUD Test Contable - Test Contable', async t => {
    await ejecutarPruebaTablasReteFte2(t, testContableConfig, ingresarAplicacion);
});
