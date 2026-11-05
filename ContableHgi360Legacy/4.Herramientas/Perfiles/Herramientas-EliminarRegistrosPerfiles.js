import { Selector } from 'testcafe';
import { abrirHerramientas, cerrarSesion360, ingresarAplicacion, cerrarPestana360, eliminarRegistroDesdeGrid, ingresarAplicacionMiHappgi } from '../../../Funciones/HelpersHgi360Legacy.js';
import { miContableConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js'; 
import { testContableConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js'; 

const CODIGO_PERFIL = '0001';


async function ejecutarPruebaHerramientasEliminarRegistrosPerfiles(t, config, ingresar) {
    await ingresar(t, config);
        await abrirHerramientas(t, 'PERFILES');
        await t
            .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
            .wait(1500)
            .typeText('#gridPerfiles .dx-texteditor-input', CODIGO_PERFIL)
            .wait(3000)
            .expect(Selector('#gridPerfiles td').withText(CODIGO_PERFIL).exists).ok('El perfil no existe');
        await eliminarRegistroDesdeGrid(t, '#gridPerfiles');
            
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `Herramientas-EliminarRegistrosPerfiles - Mi ERP`
    .page(miContableConfig.pagina);

test('Prueba Herramientas - Eliminar Registros - Mi ERP', async t => {
    await ejecutarPruebaHerramientasEliminarRegistrosPerfiles(t, miContableConfig, ingresarAplicacionMiHappgi);
});

fixture `Herramientas-EliminarRegistrosPerfiles - Test Contable`
    .page(testContableConfig.pagina);

test('Prueba Herramientas - Eliminar Registros - Test Contable', async t => {
    await ejecutarPruebaHerramientasEliminarRegistrosPerfiles(t, testContableConfig, ingresarAplicacion);
});
