import { Selector } from 'testcafe';
import { miNominaConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';
import { testNominaConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';
import {
    abrirHerramientas,
    cerrarPestana360,
    cerrarSesion360,
    eliminarRegistroDesdeGrid,
    ingresarAplicacion,
    
} from '../../../Funciones/HelpersHgi360Legacy.js';

const PERFIL_CODIGO = '0001';

async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    await abrirHerramientas(t, 'PERFILES');
    await t
        .typeText('#gridPerfiles .dx-texteditor-input', PERFIL_CODIGO)
        .wait(3000)
        .expect(Selector('#gridPerfiles td').withText(PERFIL_CODIGO).exists).ok('El perfil no existe');
    await eliminarRegistroDesdeGrid(t, '#gridPerfiles');
    await cerrarPestana360(t);
    await cerrarSesion360(t);
}

fixture('Eliminar registros de perfiles Hgi360 Nomina - MiHgi360')
    .page(miNominaConfig.pagina);

test('Mi Hgi360 - Eliminar Registros Perfiles', async t => {
    await ejecutarPrueba(t, miNominaConfig);
});

fixture('Eliminar registros de perfiles Hgi360 Nomina - Test Hgi360')
    .page(testNominaConfig.pagina);

test('Test Hgi360 - Eliminar Registros Perfiles', async t => {
    await ejecutarPrueba(t, testNominaConfig);
});
