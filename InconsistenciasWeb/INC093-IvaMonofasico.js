import { Selector } from 'testcafe';
import {
    abrirMaestros360,
    accionFilaGrid360,
    buscarEnGrid360,
    cerrarPestana360,
    cerrarSesion360,
    desmarcarCheckboxSiEsta,
    editarTransaccion360,
    guardarMaestro360,
    ingresarAplicacion,
    limpiarCacheChromeTestCafe,
    marcarCheckboxSiNoEsta
} from '../Funciones/HelpersHgi360Web.js';
import {
    agregarLineaDocumento,
    asegurarDependenciaDocumento360,
    eliminarDocumentoActual360,
    elegirTerceroDocumento,
    guardarDocumento360,
    leerTotalesDocumento,
    nuevoDocumento360
} from '../Funciones/HelpersDocumentos360.js';
import {
    abrirPuntoDeVenta360,
    agregarProductoPV,
    elegirTransaccionPV,
    eliminarTemporalPV,
    limpiarTemporalPV,
    salirPuntoDeVenta360
} from '../Funciones/HelpersPos360.js';
import { testAdminConfig, testPosWebConfig } from '../ParametrosPruebas/ParametrosPruebas.js';

/**
 * INC093 - IVA monofásico. Deja el producto 010204 marcado como IVA monofásico, la TX de venta 0101Doc con
 * "IVA monofásico" y la de compra 05QA sin él (misma configuración que dejaba la prueba legacy). La compra no debe
 * calcular IVA y la venta sí (1.000). En el POS la 0101 cobra IVA y la 0101.2 no. Los documentos se eliminan.
 */

const PRODUCTO = '010204';

async function exigir(t, selector, descripcion) {
    await t.expect(Selector(selector).with({ timeout: 10000 }).exists).ok(`No está el campo ${descripcion} (${selector})`);
}

async function configurar(t) {
    await abrirMaestros360(t, 'Productos', 'productos');
    await buscarEnGrid360(t, 'gridProductos', PRODUCTO);
    await t.wait(2000);
    await accionFilaGrid360(t, 'gridProductos', PRODUCTO, 'Editar');
    await exigir(t, '#txtMaestroProductos_IvaMonofasico', 'IVA monofásico del producto');
    await marcarCheckboxSiNoEsta(t, '#txtMaestroProductos_IvaMonofasico');
    await guardarMaestro360(t, 'Producto');
    await cerrarPestana360(t);

    await editarTransaccion360(t, '0101Doc', 'Documentos');
    await exigir(t, '#TxtTransaccion_Tribu_Iva_Monofasico', 'IVA monofásico de la transacción');
    await marcarCheckboxSiNoEsta(t, '#TxtTransaccion_Tribu_Iva_Monofasico');
    await guardarMaestro360(t, 'Transaccion');
    await cerrarPestana360(t);

    await editarTransaccion360(t, '05QA', 'Documentos');
    await exigir(t, '#TxtTransaccion_Tribu_Iva_Monofasico', 'IVA monofásico de la transacción');
    await desmarcarCheckboxSiEsta(t, '#TxtTransaccion_Tribu_Iva_Monofasico');
    await guardarMaestro360(t, 'Transaccion');
    await cerrarPestana360(t);
}

async function ivaDeDocumento(t, filtro, texto, { tercero = null, dependencia = false, valor = null }) {
    await nuevoDocumento360(t, filtro, texto);
    if (tercero) {
        await elegirTerceroDocumento(t, tercero);
    }
    if (dependencia) {
        await asegurarDependenciaDocumento360(t);
    }
    await guardarDocumento360(t);
    try {
        await agregarLineaDocumento(t, PRODUCTO, { cantidad: 1, valor });
        await t.wait(3000);
        return (await leerTotalesDocumento()).iva;
    } finally {
        await eliminarDocumentoActual360(t);
        await cerrarPestana360(t);
    }
}

fixture `INC093 Iva Monofasico Admin - Test Hgi360`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC093 Iva Monofasico Admin - Test Hgi360', async t => {
    await ingresarAplicacion(t, testAdminConfig);
    await configurar(t);
    const ivaCompra = await ivaDeDocumento(t, '05QA', /^\s*05QA -/i, { tercero: '811021438', valor: 100 });
    // La dependencia la trae el tercero: con el tercero por defecto (0 - GENERAL) queda vacía
    const ivaVenta = await ivaDeDocumento(t, '0101Doc', /^\s*0101Doc -/i, { tercero: '811021438', dependencia: true });
    await t
        .expect(ivaCompra).eql(0, `La compra (05QA) no debe traer IVA y trajo ${ivaCompra}`)
        .expect(ivaVenta).eql(1000, `La venta (0101Doc) debe traer IVA de 1.000 y trajo ${ivaVenta}`);
    await cerrarSesion360(t);
});

fixture `INC093 Iva Monofasico Pos - Test Hgi360`
    .page(testPosWebConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC093 Iva Monofasico Punto de Venta - Test Hgi360', async t => {
    await ingresarAplicacion(t, testPosWebConfig);
    await abrirPuntoDeVenta360(t);
    const totales = {};
    try {
        for (const [filtro, texto] of [['0101', '0101 - PRUEBA FACTURA PV'], ['0101.2', '0101.2 - PRUEBA FACTURA PV']]) {
            await elegirTransaccionPV(t, filtro, texto);
            await limpiarTemporalPV(t);
            totales[filtro] = await agregarProductoPV(t, PRODUCTO, '1');
            await eliminarTemporalPV(t);
        }
    } finally {
        await salirPuntoDeVenta360(t);
    }
    await t.expect(totales['0101']).gt(totales['0101.2'],
        `La 0101 (con IVA, total ${totales['0101']}) debería costar más que la 0101.2 (sin IVA, total ${totales['0101.2']})`);
    await cerrarSesion360(t);
});
