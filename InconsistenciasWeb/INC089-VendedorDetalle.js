import { Selector } from 'testcafe';
import { cerrarSesion360, ingresarAplicacion, limpiarCacheChromeTestCafe } from '../Funciones/HelpersHgi360Web.js';
import { eliminarDocumentoActual360, guardarDocumento360, nuevoDocumento360 } from '../Funciones/HelpersDocumentos360.js';
import { testAdminConfig } from '../ParametrosPruebas/ParametrosPruebas.js';

/** INC089 - TX INC089: la línea de captura del documento tiene el campo Vendedor y recibe el foco. El documento se elimina. */

const vendedor = Selector('#txtDocumento_Detalle_Vendedor_cursor_1');

async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    await nuevoDocumento360(t, 'INC089', /^\s*INC089 -/i);
    await guardarDocumento360(t);
    try {
        await t.expect(vendedor.filterVisible().exists).ok('No está el campo Vendedor en el detalle');
        const campo = await vendedor.tagName === 'input' ? vendedor : vendedor.find('input.dx-texteditor-input');
        await t
            .click(campo)
            .expect(campo.focused).ok('El foco no está en el campo Vendedor del detalle');
    } finally {
        await eliminarDocumentoActual360(t);
    }
    await cerrarSesion360(t);
}

fixture `Prueba Vendedor Detalle INC089 Admin - Test Hgi360`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba Vendedor Detalle INC089 Admin - Test Hgi360', async t => {
    await ejecutarPrueba(t, testAdminConfig);
});
