import { ingresarAplicacion, cerrarPestana360, cerrarSesion360 } from '../../../Funciones/HelpersHgi360Web.js';
import { prepararNavegador360, limpiarCache360 } from '../../../Funciones/HelpersMaestros360.js';
import {
    abrirMovimientosDeCaja360,
    actualizarMovimientosDeCaja360,
    cajaEstaAbierta360,
    cerrarCaja360,
    abrirCaja360,
    retiroParcialCaja360,
    leerEstadoCaja360,
    leerSesionesCaja360,
    CAJA_PV,
    CODIGO_CAJA_PV
} from '../../../Funciones/HelpersPos360.js';
import { numeroDesdeTexto as numero } from '../../../Funciones/HelpersDocumentos360.js';
import { testPosWebConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Movimientos > Movimientos de Caja (test.hgi360.com, AutPos), caja 10 - Caja Automatizacion.
// 1) Si la caja está abierta, la cierra (contando el total en caja en efectivo).
// 2) Abre la caja con Efectivo, cantidad 1, valor unitario 10.000. La app abre el documento en otra
//    pestaña: se vuelve a la página y se pulsa Actualizar.
// 3) Valida en la grid inferior la fecha de apertura (hoy) y el usuario de apertura, y que la Base Inicial
//    incluya la apertura. No se fija la base: la app suma a la apertura lo contado en el cierre anterior.
// 4) Retiro parcial de 2.000 en efectivo: Efectivo en Caja debe quedar en (Efectivo antes del retiro - 2.000)
//    y la columna Retiros de la grid debe subir 2.000.
// 5) Cierra la caja y valida en la grid la fecha y el usuario de cierre.
// Pasos revisados en el navegador el 21-oct-2026.

const BASE = 10000; // valor de apertura (no es el valor esperado de la base)
const RETIRO = 2000;

const hoy = () => {
    const d = new Date();
    const dos = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${dos(d.getMonth() + 1)}-${dos(d.getDate())}`;
};

/** Fila de la grid de sesiones de la caja (la abierta si cerrada=false; la de la apertura indicada si se pasa). */
async function filaSesion(t, { fechaApertura = null } = {}) {
    const filas = (await leerSesionesCaja360()).filter(f => String(f.caja || '').trim() === CODIGO_CAJA_PV);
    const fila = fechaApertura
        ? filas.find(f => f['fecha de apertura'] === fechaApertura)
        : filas.find(f => !f['fecha de cierre']);
    await t.expect(fila).ok(`No se encontró la sesión de la caja ${CODIGO_CAJA_PV} en la grid de movimientos`);
    return fila;
}

async function ejecutarPrueba(t, config) {
    const usuario = config.usuario;
    await ingresarAplicacion(t, config);
    await abrirMovimientosDeCaja360(t, CAJA_PV);

    // 1) Dejar la caja cerrada
    if (await cajaEstaAbierta360()) {
        await cerrarCaja360(t);
        await actualizarMovimientosDeCaja360(t);
    }
    await t.expect(await cajaEstaAbierta360()).notOk('La caja sigue abierta después de cerrarla');

    // 2) Apertura con 1 x 10.000 en efectivo
    await abrirCaja360(t, { cantidad: 1, valor: BASE });
    await actualizarMovimientosDeCaja360(t);
    await t.expect(await cajaEstaAbierta360()).ok('La caja no quedó abierta');

    // 3) Grid: fecha y usuario de apertura
    const abierta = await filaSesion(t);
    await t
        .expect(abierta['fecha de apertura']).contains(hoy(), `La fecha de apertura (${abierta['fecha de apertura']}) no es la de hoy`)
        .expect(abierta['usuario de apertura']).eql(usuario, `El usuario de apertura (${abierta['usuario de apertura']}) no es ${usuario}`)
        .expect(abierta['fecha de cierre']).eql('', 'La sesión abierta ya tiene fecha de cierre');
    const estadoApertura = await leerEstadoCaja360(t);
    await t
        .expect(estadoApertura.base).gte(BASE, `La Base Inicial (${estadoApertura.base}) no incluye la apertura de ${BASE}`)
        .expect(estadoApertura.efectivoCaja).eql(estadoApertura.base,
            `Recién abierta, Efectivo en Caja (${estadoApertura.efectivoCaja}) debería ser igual a la Base Inicial (${estadoApertura.base})`);

    // 4) Retiro parcial de 2.000 en efectivo (valores relativos al estado antes del retiro)
    const efectivoAntes = estadoApertura.efectivoCaja;
    const retirosAntes = numero(abierta.retiros);
    await retiroParcialCaja360(t, { cantidad: 1, valor: RETIRO });
    await actualizarMovimientosDeCaja360(t);
    const estadoRetiro = await leerEstadoCaja360(t);
    const conRetiro = await filaSesion(t, { fechaApertura: abierta['fecha de apertura'] });
    await t
        .expect(estadoRetiro.efectivoCaja).eql(efectivoAntes - RETIRO,
            `Después del retiro de ${RETIRO}, Efectivo en Caja debería ser ${efectivoAntes - RETIRO} y es ${estadoRetiro.efectivoCaja}`)
        .expect(numero(conRetiro.retiros)).eql(retirosAntes + RETIRO,
            `La columna Retiros de la grid debería ser ${retirosAntes + RETIRO} y es ${conRetiro.retiros}`);

    // 5) Cierre y validación en la grid
    await cerrarCaja360(t);
    await actualizarMovimientosDeCaja360(t);
    await t.expect(await cajaEstaAbierta360()).notOk('La caja no quedó cerrada');
    const cerrada = await filaSesion(t, { fechaApertura: abierta['fecha de apertura'] });
    await t
        .expect(cerrada['fecha de cierre']).contains(hoy(), `La fecha de cierre (${cerrada['fecha de cierre']}) no es la de hoy`)
        .expect(cerrada['usuario de cierre']).eql(usuario, `El usuario de cierre (${cerrada['usuario de cierre']}) no es ${usuario}`)
        .expect(cerrada['usuario de apertura']).eql(usuario, 'Cambió el usuario de apertura después del cierre');

    await cerrarPestana360(t);
    await cerrarSesion360(t);
}

fixture `Prueba Movimientos de Caja - Apertura, retiro y cierre - Test Hgi360`
    .page(testPosWebConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testPosWebConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Abrir, retiro parcial y cerrar caja - Test Hgi360', async t => {
    await ejecutarPrueba(t, testPosWebConfig);
});
