import { ClientFunction, Selector } from 'testcafe';
import {
    abrirCambioPeriodo360,
    abrirMovimientos360,
    cerrarPestana360,
    cerrarSesion360,
    escribirFecha360,
    filtrarPor,
    guardarPeriodo360,
    ingresarAplicacion,
    leerPeriodoEncabezado360,
    limpiarCacheChromeTestCafe,
    TERCERO
} from '../Funciones/HelpersHgi360Web.js';
import { testAdminConfig } from '../ParametrosPruebas/ParametrosPruebas.js';

/**
 * INC116 - Causación creada en un periodo anterior conserva la clase.
 *  1. Cambia al periodo anterior al de trabajo.
 *  2. Crea una causación "09 - CAJA MENOR" con la clase 01 y una línea.
 *  3. Vuelve al periodo de trabajo, consulta la causación por número y valida que tenga la clase 01.
 * Al final elimina la causación y deja el periodo de trabajo original.
 */

const TX_CAUSACION = '09';
const CLASE = '01';
const SUCURSAL = '0';
const FILTRO_SUCURSAL = 'GENERAL';
const CUENTA = '11050501';
const DETALLE = 'pruebaINC116';
const VALOR = '1000';

const btnConfirmarDialogo = Selector('button.swal2-confirm').filterVisible();
const esqueleto = Selector('.erp-page-skeleton-toolbar').filterVisible();
const toast = texto => Selector('.erp-toast').withText(texto).filterVisible();
const numeroCausacion = Selector('#txtDocumentoCausacion .dx-texteditor-input');
const claseCausacion = Selector('#Causacion_Clase .dx-lookup-field');

const opcionCodigo = codigo => Selector('.dx-overlay-content')
    .filterVisible()
    .find('.dx-item-content')
    .withText(new RegExp(`^\\s*${codigo} -`));

const referenciaUnica = () => `QA${String(Date.now()).slice(-10)}`;

/** Periodo anterior al indicado (del periodo 1 pasa al 12 del año anterior). */
const periodoAnterior = ({ periodo, anio }) => {
    const p = parseInt(periodo, 10);
    return p > 1
        ? { periodo: String(p - 1), anio: String(anio) }
        : { periodo: '12', anio: String(parseInt(anio, 10) - 1) };
};

/** La causación toma la fecha de hoy: en el periodo anterior se usa el día 15 de ese periodo. */
const fechaDelPeriodo = ({ periodo, anio }) => `${anio}-${String(periodo).padStart(2, '0')}-15`;

/** Id del DateBox "Fecha" del encabezado (no el de Vence). */
const idFechaCausacion = ClientFunction(() => {
    const cajas = Array.from(document.querySelectorAll('.dx-datebox[id]'))
        .filter(caja => caja.getClientRects().length && !/Venc/i.test(caja.id));
    const conFecha = cajas.find(caja => /Fecha/i.test(caja.id));
    return (conFecha || cajas[0] || {}).id || '';
});

async function cambiarPeriodo(t, { periodo, anio }) {
    await abrirCambioPeriodo360(t);
    await guardarPeriodo360(t, periodo, anio);
}

async function elegirEnLookup(t, lookup, filtro, codigo) {
    await t.click(`${lookup} .dx-lookup-field`);
    await filtrarPor(t, filtro);
    await t
        .expect(opcionCodigo(codigo).with({ timeout: 10000 }).exists)
        .ok(`No apareció la opción "${codigo} - ..." en ${lookup}`)
        .click(opcionCodigo(codigo));
}

async function abrirCausaciones(t) {
    await abrirMovimientos360(t, 'Causaciones');
    await t.expect(esqueleto.exists).notOk({ timeout: 20000 });
}

async function nuevaCausacion(t) {
    await t
        .click(Selector('#BtnNuevoCausacionConsulta').with({ timeout: 15000 }))
        .expect(Selector('#Causacion_Transaccion .dx-lookup-field').with({ timeout: 15000 }).visible)
        .ok('No se abrió el formulario de causaciones');
    await elegirEnLookup(t, '#Causacion_Transaccion', TX_CAUSACION, TX_CAUSACION);
}

async function guardarEncabezado(t) {
    // Si la referencia ya existe la app avisa con un toast; se reintenta con otra referencia
    for (let intento = 1; intento <= 3; intento++) {
        await t
            .typeText('#txtDocumentoCausacion_Referencia .dx-texteditor-input', referenciaUnica(), { replace: true })
            .click('#BtnGuardarCausacion')
            .wait(3000);
        if (await numeroCausacion.value) {
            return;
        }
        if (!await toast('ya existe').exists) {
            break;
        }
    }
    const aviso = Selector('.erp-toast, .swal2-popup, .erp-form-error__text').filterVisible();
    const detalle = await aviso.exists ? `: ${(await aviso.nth(0).innerText).replace(/\s+/g, ' ').trim()}` : '';
    await t.expect(numeroCausacion.value).ok(`La causación no quedó guardada en el periodo anterior${detalle}`);
}

async function agregarLinea(t) {
    const cuentaEnPopup = Selector('.dx-popup-content').filterVisible().find('td').withExactText(CUENTA);
    await t
        .click('#txtCausacion_Detalle_Cuenta_cursor_1 [aria-label="Buscar"]')
        .expect(cuentaEnPopup.with({ timeout: 10000 }).exists).ok(`No apareció la cuenta ${CUENTA} en el buscador`)
        .doubleClick(cuentaEnPopup)
        .wait(2000)
        .typeText('#txtdocumento_detalle_causacion_cursor_1 .dx-texteditor-input', DETALLE, { replace: true })
        .pressKey('enter')
        .typeText('#txtdocumento_detalle_causacion_Valor_cursor_1 .dx-texteditor-input', VALOR, { replace: true })
        .pressKey('enter')
        .wait(1000)
        .click('#txtdocumento_detalle_causacion_Boton_1')
        .wait(3000);
}

/** Abre la causación por número; devuelve false si no cargó. */
async function cargarCausacion(t, numero) {
    await nuevaCausacion(t);
    await t
        .typeText(numeroCausacion, numero, { replace: true })
        .pressKey('enter')
        .wait(3000);
    return Selector('#Causacion_Tercero').withText(TERCERO).with({ timeout: 10000 }).exists;
}

async function eliminarCausacionAbierta(t) {
    await t.click('#BtnEliminarCausacion');
    if (await btnConfirmarDialogo.with({ timeout: 10000 }).exists) {
        await t.click(btnConfirmarDialogo);
    }
    return toast('eliminado').with({ timeout: 10000 }).exists;
}

async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    const original = await leerPeriodoEncabezado360(t);
    const anterior = periodoAnterior(original);
    let enAnterior = false;
    let numero = '';
    let eliminada = false;
    let claseConsultada = '';
    let cargada = false;

    try {
        // 1. Periodo anterior
        await cambiarPeriodo(t, anterior);
        enAnterior = true;

        // 2. Causación con clase
        await abrirCausaciones(t);
        await nuevaCausacion(t);
        await elegirEnLookup(t, '#Causacion_Tercero', TERCERO, TERCERO);
        await elegirEnLookup(t, '#Causacion_Clase', CLASE, CLASE);
        await elegirEnLookup(t, '#Causacion_Sucursal', FILTRO_SUCURSAL, SUCURSAL);
        const idFecha = await idFechaCausacion();
        await t.expect(idFecha).ok('No se encontró el campo Fecha de la causación');
        await escribirFecha360(t, `#${idFecha}`, fechaDelPeriodo(anterior));
        await guardarEncabezado(t);
        numero = await numeroCausacion.value;
        await agregarLinea(t);
        await t.expect(claseCausacion.innerText).match(new RegExp(`^\\s*${CLASE} -`),
            `La causación ${numero} no quedó con la clase ${CLASE} al crearla`);
        await cerrarPestana360(t);

        // 3. Periodo de trabajo: consultar la causación
        await cambiarPeriodo(t, original);
        enAnterior = false;
        await abrirCausaciones(t);
        cargada = await cargarCausacion(t, numero);
        if (cargada) {
            claseConsultada = (await claseCausacion.innerText).replace(/\s+/g, ' ').trim();
            eliminada = await eliminarCausacionAbierta(t);
        }
        await cerrarPestana360(t);
    } finally {
        // Si no se pudo eliminar desde el periodo de trabajo, se elimina desde el periodo en que se creó
        if (numero && !eliminada) {
            if (!enAnterior) {
                await cambiarPeriodo(t, anterior);
                enAnterior = true;
            }
            await abrirCausaciones(t);
            if (await cargarCausacion(t, numero)) {
                eliminada = await eliminarCausacionAbierta(t);
            }
            await cerrarPestana360(t);
        }
        if (enAnterior) {
            await cambiarPeriodo(t, original);
        }
    }

    await t
        .expect(cargada).ok(`No se pudo consultar la causación ${numero} desde el periodo ${original.periodo} de ${original.anio}`)
        .expect(claseConsultada).match(new RegExp(`^${CLASE} -`),
            `La causación ${numero} (creada en el periodo ${anterior.periodo} de ${anterior.anio}) quedó con la clase "${claseConsultada}" y debía ser ${CLASE}`)
        .expect(eliminada).ok(`No se pudo eliminar la causación ${numero}`);
    await cerrarSesion360(t);
}

fixture `INC116 Clase causación periodo anterior - Test Hgi360 Admin`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC116 Clase causación periodo anterior - Test Hgi360 Admin', async t => {
    await ejecutarPrueba(t, testAdminConfig);
});
