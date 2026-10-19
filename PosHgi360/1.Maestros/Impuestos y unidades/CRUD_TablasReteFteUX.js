import { Selector } from 'testcafe';
import {
    ingresarAplicacion,
    abrirMaestros360,
    eliminarRegistroSiExiste,
    cerrarSesion360,
    cerrarPestana360,
    eliminarRegistroDesdeGrid,
    limpiarCacheChromeTestCafe
} from '../../../Funciones/HelpersHgi360Legacy.js';
import { testPosConfig, hgiPosConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';


async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    await abrirMaestros360(t, 'Maestro de Retención', 'impuestos');
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

fixture `Prueba Tablas de Rte Fnte testErp Pos - Test Hgi360`
    .page(testPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Test Hgi360 - Prueba Rte Fnte CRUD mierp ', async t => {
    await ejecutarPrueba(t, testPosConfig);
});

fixture `Prueba Tablas de Rte Fnte testErp Pos - Hgi360 Pos`
    .page(hgiPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Test Hgi360 - Prueba Rte Fnte CRUD mierp ', async t => {
    await ejecutarPrueba(t, hgiPosConfig);
});
