import { Selector } from 'testcafe';
import { ingresarAplicacion, abrirMaestros360, eliminarRegistroSiExiste, cerrarSesion360, cerrarPestana360, eliminarRegistroDesdeGrid, ingresarAplicacionMiHappgi } from '../../../Funciones/HelpersHgi360Legacy.js';
import { miContableConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js'; 
import { testContableConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js'; 

const CODIGO = 'MISector';
const DESCRIPCION = 'MIDESCRIPCION';
const DESCRIPCION_EDIT = 'MINUEVADESCRIPCION';

/*
+++++++++++++++++++++++++++++++++++++++++++++
+++++++++++++++++++++++++++++++++++++++++++++
+++++++++++++++++++++++++++++++++++++++++++++
*/


async function ejecutarPruebaSectores(t, config, ingresar) {
    await ingresar(t, config);
        await abrirMaestros360(t, 'Sectores');
        await eliminarRegistroSiExiste(t, '#gridSectores', CODIGO);
        await t
            .click('#gridSectores .dx-icon.dx-icon-add')
        //Se comienza con la inserción de datos para la creación de la Sector
            .typeText('#txtSector_Codigofocus', CODIGO)
            .typeText('#txtSector_Descripcion .dx-texteditor-input', DESCRIPCION)
            .click(Selector('#BtnActualizarSector span').withText('Guardar'))
            //El sistema NO permite guardar una Sector sin zona
    //Se valida la creación
            .wait(3000)
            .expect(Selector('#gridSectores td').withText(CODIGO).exists).ok()
    //Se edita la Sector
            .click(Selector('#gridSectores [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
        //Se comienza con la inserción de datos para la actualización de la Sector
            .click('#txtSector_Descripcion .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtSector_Descripcion .dx-texteditor-input', DESCRIPCION_EDIT)
            .click(Selector('#BtnActualizarSector div').withText('Guardar'))
    //Se elimina la Sector
            .wait(4000);
        await eliminarRegistroDesdeGrid(t, '#gridSectores');
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `CRUD_SectoresUX - Mi ERP`
    .page(miContableConfig.pagina);

test('Prueba Sectores Mi Contable CRUD - Mi ERP', async t => {
    await ejecutarPruebaSectores(t, miContableConfig, ingresarAplicacionMiHappgi);
});

fixture `CRUD_SectoresUX - Test Contable`
    .page(testContableConfig.pagina);

test('Prueba Sectores Mi Contable CRUD - Test Contable', async t => {
    await ejecutarPruebaSectores(t, testContableConfig, ingresarAplicacion);
});
