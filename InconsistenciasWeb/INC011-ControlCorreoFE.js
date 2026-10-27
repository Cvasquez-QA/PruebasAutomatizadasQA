import { ClientFunction, Selector } from 'testcafe';
import { testPosWebConfig } from '../ParametrosPruebas/ParametrosPruebas.js';
import {
    abrirHerramientas360,
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
 * INC11 - Control del formato del Email de Factura Electrónica (test.hgi360.com, POS).
 *  - Herramientas > Parámetros > Defecto: los correos sin formato no se dejan guardar. Al final se
 *    vuelve a dejar el correo que tenía el parámetro.
 *  - Punto de Venta > crear tercero: el correo sin formato muestra el mensaje (se cancela sin crear el tercero).
 */

const MENSAJE = /Email de Factura Electr[oó]nica no tiene el format/i;
const CORREOS_INVALIDOS = ['pruebacorreo', 'pruebacorreo@', 'pruebacorreo@dominio'];
const CORREO_VALIDO = 'pruebacorreo@dominio.com';
const IDENTIFICACION = '10101010';
const emailParametro = Selector('#txtPG_EmailFE .dx-texteditor-input');
const btnEditar = Selector('#BtnEditar_btn, #BtnEditar').filterVisible().nth(0);
const btnGuardar = Selector('#BtnGuardar_btn, #BtnGuardar').filterVisible().nth(0);
const confirmar = Selector('button.swal2-confirm').filterVisible();
const textoPantalla = ClientFunction(() => document.body.innerText);

async function hayMensaje(t, espera = 6000) {
    for (const inicio = Date.now(); Date.now() - inicio < espera;) {
        if (MENSAJE.test(await textoPantalla())) {
            return true;
        }
        await t.wait(300);
    }
    return false;
}

async function cerrarAviso(t) {
    if (await confirmar.with({ timeout: 2000 }).exists) {
        await t.click(confirmar).wait(800);
    }
}

async function abrirParametrosDefecto(t) {
    await abrirHerramientas360(t, 'Parámetros');
    await t
        .click(Selector('#tabs_parametros_Defecto').with({ timeout: 20000 }))
        .expect(emailParametro.with({ timeout: 15000 }).exists).ok('No se ve el Email de Factura Electrónica en Parámetros > Defecto');
}

async function guardarEmailParametro(t, correo) {
    if (await btnEditar.exists) {
        await t.click(btnEditar).wait(1000);
    }
    await t.typeText(emailParametro, correo, { replace: true }).click(btnGuardar);
}

fixture `Inconsistencias Erp Web`
    .page(testPosWebConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC11-ControlCorreoFE', async t => {
    await ingresarAplicacion(t, testPosWebConfig);
    await abrirParametrosDefecto(t);
    const original = String(await emailParametro.value || '');

    try {
        for (const correo of CORREOS_INVALIDOS) {
            await guardarEmailParametro(t, correo);
            await t.expect(await hayMensaje(t)).ok(`Parámetros dejó guardar el Email de Factura Electrónica "${correo}" sin formato`);
            await cerrarAviso(t);
        }
        await guardarEmailParametro(t, CORREO_VALIDO);
        await t.expect(await hayMensaje(t, 3000)).notOk(`Parámetros rechazó el Email de Factura Electrónica válido "${CORREO_VALIDO}"`);
        await cerrarAviso(t);
    } finally {
        await cerrarAviso(t);
        if (String(await emailParametro.value || '') !== original || await btnGuardar.exists) {
            await guardarEmailParametro(t, original).catch(() => undefined);
            await cerrarAviso(t);
        }
    }
    await cerrarPestana360(t);

    await abrirMaestroConfig360(t, testPosWebConfig, 'Terceros', 'terceros');
    await eliminarFilaSiExiste360(t, 'gridTerceros', IDENTIFICACION);
    await cerrarPestana360(t);
    await abrirPuntoDeVenta360(t);
    await elegirTransaccionPV(t);
    const cancelarCreacion = Selector('#PuntoDeVenta_ModalCrearTerceros_BtnCancelar').filterVisible();
    try {
        await t
            .click('#PuntoDeVenta_Tercero .dx-lookup-field')
            .click(Selector('#PuntoDeVenta_Tercero_BtnCrear').filterVisible().with({ timeout: 10000 }))
            .expect(Selector('#PuntoDeVenta_CrearTercero_EmailFE').with({ timeout: 10000 }).visible)
            .ok('No se ve el Email de Factura Electrónica en la creación de terceros del Punto de Venta');
        // El formulario valida un campo a la vez: se llenan los obligatorios para que la validación llegue al correo
        await t
            .typeText('#PuntoDeVenta_CrearTercero_Identificacion .dx-texteditor-input', IDENTIFICACION, { replace: true })
            .pressKey('enter');
        await t.expect(Selector('.swal2-popup').filterVisible().withText(/ya existe un tercero/i).with({ timeout: 3000 }).exists)
            .notOk(`El tercero ${IDENTIFICACION} ya existe: no se borró antes de la prueba`);
        await t
            .typeText('#PuntoDeVenta_CrearTercero_PrimerApellido .dx-texteditor-input', 'Vasquez', { replace: true })
            .typeText('#PuntoDeVenta_CrearTercero_PrimerNombre .dx-texteditor-input', 'CAMILO', { replace: true })
            .click(Selector('#PuntoDeVenta_CrearTercero_DatosExtras .crear-tercero-pos-datos-extras__titulo'));
        await elegirEnLookup360(t, '#PuntoDeVenta_CrearTercero_TipoPersona', '1 - Natural');
        const emailTercero = Selector('#PuntoDeVenta_CrearTercero_EmailFE .dx-texteditor-input');
        const guardarTercero = Selector('#PuntoDeVenta_ModalCrearTerceros_BtnAceptar').filterVisible();
        const errorFormulario = Selector('.erp-form-error__text, .erp-toast[data-type="error"], .swal2-popup').filterVisible();
        for (const correo of CORREOS_INVALIDOS) {
            await t.typeText(emailTercero, correo, { replace: true }).pressKey('tab').click(guardarTercero);
            await t.expect(errorFormulario.with({ timeout: 6000 }).exists)
                .ok(`La creación de terceros del Punto de Venta guardó el tercero con el correo "${correo}" sin formato`);
            const texto = (await errorFormulario.innerText).replace(/\s+/g, ' ').trim();
            await t.expect(/correo|e-?mail/i.test(texto))
                .ok(`Con el correo "${correo}" el Punto de Venta no avisó del formato del correo sino: "${texto}"`);
            await cerrarAviso(t);
        }
    } finally {
        await cerrarAviso(t);
        if (await cancelarCreacion.exists) {
            await t.click(cancelarCreacion).wait(1000);
        }
        await cerrarAviso(t);
        if (await Selector('#PuntoDeVenta_BtnSalir').filterVisible().exists) {
            await salirPuntoDeVenta360(t);
        }
        // Si el ERP aceptó un correo sin formato, el tercero quedó creado
        await abrirMaestroConfig360(t, testPosWebConfig, 'Terceros', 'terceros').catch(() => undefined);
        await eliminarFilaSiExiste360(t, 'gridTerceros', IDENTIFICACION).catch(() => undefined);
        await cerrarPestana360(t).catch(() => undefined);
    }

    await cerrarSesion360(t);
});
