import { Selector } from 'testcafe';
import { testPosWebConfig } from '../ParametrosPruebas/ParametrosPruebas.js';
import {
    accionFilaGrid360,
    buscarEnGrid360,
    castearValorEntero,
    cerrarPestana360,
    cerrarSesion360,
    elegirEnLookup360,
    eliminarFilaSiExiste360,
    ingresarAplicacion,
    limpiarCacheChromeTestCafe
} from '../Funciones/HelpersHgi360Web.js';
import { abrirMaestroConfig360 } from '../Funciones/MenuMaestros360.js';
import { abrirPuntoDeVenta360, elegirTransaccionPV, salirPuntoDeVenta360 } from '../Funciones/HelpersPos360.js';

/**
 * INC02 - Cupo del tercero creado desde el Punto de Venta (test.hgi360.com, POS).
 * Crea el tercero 10101010 con el "+" del lookup de terceros del POS y valida en el maestro
 * de Terceros que quedó con cupo 0. Borra el tercero antes (si quedó de otra corrida) y al final.
 */

const GRID = 'gridTerceros';
const IDENTIFICACION = '10101010';

async function abrirMaestroTerceros(t) {
    await abrirMaestroConfig360(t, testPosWebConfig, 'Terceros', 'terceros');
}

async function crearTerceroDesdePV(t) {
    await abrirPuntoDeVenta360(t);
    await elegirTransaccionPV(t);
    await t
        .click('#PuntoDeVenta_Tercero .dx-lookup-field')
        .click(Selector('#PuntoDeVenta_Tercero_BtnCrear').filterVisible().with({ timeout: 10000 }))
        .expect(Selector('#PuntoDeVenta_CrearTercero_Identificacion').with({ timeout: 10000 }).visible)
        .ok('No abrió la creación de terceros del Punto de Venta')
        .typeText('#PuntoDeVenta_CrearTercero_Identificacion .dx-texteditor-input', IDENTIFICACION, { replace: true })
        .pressKey('enter');
    const avisoYaExiste = Selector('.swal2-popup').filterVisible().withText(/ya existe un tercero/i);
    await t.expect(avisoYaExiste.with({ timeout: 3000 }).exists)
        .notOk(`El tercero ${IDENTIFICACION} ya existe: no se borró antes de la prueba`);
    await t
        .typeText('#PuntoDeVenta_CrearTercero_PrimerApellido .dx-texteditor-input', 'Vasquez', { replace: true })
        .typeText('#PuntoDeVenta_CrearTercero_SegundoApellido .dx-texteditor-input', 'Suarez', { replace: true })
        .typeText('#PuntoDeVenta_CrearTercero_PrimerNombre .dx-texteditor-input', 'CAMILO', { replace: true })
        .typeText('#PuntoDeVenta_CrearTercero_SegundoNombre .dx-texteditor-input', 'PRUEBA', { replace: true })
        // La identificación es CC: la persona debe ser natural (está en "Datos opcionales")
        .click(Selector('#PuntoDeVenta_CrearTercero_DatosExtras .crear-tercero-pos-datos-extras__titulo'));
    await elegirEnLookup360(t, '#PuntoDeVenta_CrearTercero_TipoPersona', '1 - Natural');
    await t
        .click(Selector('#PuntoDeVenta_ModalCrearTerceros_BtnAceptar').filterVisible())
        .expect(Selector('#PuntoDeVenta_ModalCrearTerceros_BtnAceptar').filterVisible().exists)
        .notOk('No se cerró la creación del tercero', { timeout: 15000 });
    await salirPuntoDeVenta360(t);
}

/** Si la prueba falló dentro del Punto de Venta, cierra avisos, la creación del tercero y el POS. */
async function cerrarPuntoDeVentaAbierto(t) {
    const confirmar = Selector('button.swal2-confirm').filterVisible();
    if (await confirmar.exists) {
        await t.click(confirmar).wait(1000);
    }
    const cancelarCreacion = Selector('#PuntoDeVenta_ModalCrearTerceros_BtnCancelar').filterVisible();
    if (await cancelarCreacion.exists) {
        await t.click(cancelarCreacion).wait(1000);
    }
    await t.pressKey('esc').wait(500);
    if (await Selector('#PuntoDeVenta_BtnSalir').filterVisible().exists) {
        await salirPuntoDeVenta360(t);
    }
}

fixture `Inconsistencias Erp Web`
    .page(testPosWebConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC02-CupoTerceroPv', async t => {
    await ingresarAplicacion(t, testPosWebConfig);
    await abrirMaestroTerceros(t);
    await eliminarFilaSiExiste360(t, GRID, IDENTIFICACION);
    await cerrarPestana360(t);

    try {
        await crearTerceroDesdePV(t);

        await abrirMaestroTerceros(t);
        await buscarEnGrid360(t, GRID, IDENTIFICACION);
        await accionFilaGrid360(t, GRID, IDENTIFICACION, 'Editar');
        // El cupo está en "Datos Adicionales" (historia del tercero)
        await t.click(Selector('#BtnTercero_DatosAdicionales_btn').filterVisible().with({ timeout: 15000 }));
        const cupo = Selector('#txtHistoriaTercero_CupoTotal');
        await t.expect(cupo.with({ timeout: 15000 }).exists).ok('No se ve el cupo del tercero en Datos Adicionales');
        const campoCupo = cupo.find('.dx-texteditor-input');
        const valorCupo = await campoCupo.exists ? await campoCupo.value : await cupo.innerText;
        await t.expect(castearValorEntero(valorCupo)).eql(0, `El tercero tiene un cupo distinto de 0,00 (${valorCupo})`);
        await t.pressKey('esc').wait(800);
        const cerrarTercero = Selector('#BtnCancelarTercero_btn').filterVisible();
        if (await cerrarTercero.exists) {
            await t.click(cerrarTercero);
        }
    } finally {
        await cerrarPuntoDeVentaAbierto(t).catch(() => undefined);
        await abrirMaestroTerceros(t).catch(() => undefined);
        await eliminarFilaSiExiste360(t, GRID, IDENTIFICACION).catch(() => undefined);
    }

    await cerrarPestana360(t);
    await cerrarSesion360(t);
});
