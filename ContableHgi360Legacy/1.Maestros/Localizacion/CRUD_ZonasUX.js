import { Selector } from 'testcafe';
import { ingresarAplicacion, abrirMaestros360, eliminarRegistroSiExiste, cerrarSesion360, cerrarPestana360, eliminarRegistroDesdeGrid, ingresarAplicacionMiHappgi } from '../../../Funciones/HelpersHgi360Legacy.js';
import { miContableConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js'; 
import { testContableConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js'; 

const CODIGO = 'MiZona123';
const DESCRIPCION = 'DescripcionMiZona';
const DESCRIPCION_EDIT = 'NuevaDescripcionZona';


async function ejecutarPruebaZonas(t, config, ingresar) {
    await ingresar(t, config);
        await abrirMaestros360(t, 'Zonas');
        await eliminarRegistroSiExiste(t, '#gridZonas', CODIGO);
        await t
            .click(Selector('#gridZonas .dx-button-content').nth(1))
        //Se comienza con la inserción de datos para la creación
            .typeText('#txtZona_Codigofocus', CODIGO)
            .typeText('#txtZona_Descripcion .dx-texteditor-input', DESCRIPCION)
            .click(Selector('#BtnActualizarZona div').withText('Guardar'))
        //Se valida su creación
            .wait(4000)
            .expect(Selector('#gridZonas td').withText(CODIGO).exists).ok()
        //Se edita
            .click(Selector('#gridZonas [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
            .click('#txtZona_Descripcion .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')        
            .typeText('#txtZona_Descripcion .dx-texteditor-input', DESCRIPCION_EDIT)
            .click('#BtnActualizarZona .dx-icon.dx-icon-save')
        //Se elimina
            .wait(3000);
        await eliminarRegistroDesdeGrid(t, '#gridZonas');
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `CRUD_ZonasUX - Mi ERP`
    .page(miContableConfig.pagina);

test('Prueba Zonas Mi Contable CRUD - Mi ERP', async t => {
    await ejecutarPruebaZonas(t, miContableConfig, ingresarAplicacionMiHappgi);
});

fixture `CRUD_ZonasUX - Test Contable`
    .page(testContableConfig.pagina);

test('Prueba Zonas Mi Contable CRUD - Test Contable', async t => {
    await ejecutarPruebaZonas(t, testContableConfig, ingresarAplicacion);
});
