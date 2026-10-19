import { Selector } from 'testcafe';
import {
    abrirMovimientos360,
    cerrarPestana360,
    cerrarSesion360,
    filtrarPor,
    ingresarAplicacion,
    parseValorNumerico,
    limpiarCacheChromeTestCafe,
    TERCERO
} from '../../../Funciones/HelpersHgi360Web.js';
import { testNominaConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

/**
 * Causaciones (test.hgi360.com, empresa 8902)
 *  1. Crea una causación "09 - CAJA MENOR" al tercero 1000099598, clase 01, sucursal 0 - GENERAL,
 *     con una referencia única para no chocar con "El Documento Referencia ... ya existe".
 *  2. Agrega una línea con la cuenta 11050501 por 1000 y la graba.
 *  3. Vuelve a la consulta, carga la causación por número y valida el total.
 *  4. La elimina.
 *
 * Selectores validados contra la versión React de test.hgi360.com.
 */

const TX_CAUSACION = '09';
const CLASE = '01';
const SUCURSAL = '0';
const FILTRO_SUCURSAL = 'GENERAL';
const CUENTA = '11050501';
const DETALLE = 'pruebaCausacion';
const VALOR = '1000';

const btnConfirmarDialogo = Selector('button.swal2-confirm').filterVisible();
const esqueleto = Selector('.erp-page-skeleton-toolbar').filterVisible();
const toast = texto => Selector('.erp-toast').withText(texto).filterVisible();
const numeroCausacion = Selector('#txtDocumentoCausacion .dx-texteditor-input');
const totalCausacion = '#txtDocumentoCausacion_Total .dx-texteditor-input';

/** Opción visible de un lookup cuyo texto empieza por "<codigo> -". */
const opcionCodigo = codigo => Selector('.dx-overlay-content')
    .filterVisible()
    .find('.dx-item-content')
    .withText(new RegExp(`^\\s*${codigo} -`));

async function elegirEnLookup(t, lookup, filtro, codigo) {
    await t.click(`${lookup} .dx-lookup-field`);
    await filtrarPor(t, filtro);
    await t
        .expect(opcionCodigo(codigo).with({ timeout: 10000 }).exists)
        .ok(`No apareció la opción "${codigo} - ..." en ${lookup}`)
        .click(opcionCodigo(codigo));
}

/** Referencia única por ejecución (p. ej. QA1015172200). */
const referenciaUnica = () => `QA${String(Date.now()).slice(-10)}`;

async function nuevaCausacion(t) {
    await t
        .click('#BtnNuevoCausacionConsulta')
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
        await t.wait(1000);
    }
    await t.expect(numeroCausacion.value).ok('La causación no quedó guardada (sin número de documento)');
}

async function agregarLinea(t) {
    // Cuenta desde el buscador (F4) de la celda
    const cuentaEnPopup = Selector('.dx-popup-content').filterVisible().find('td').withExactText(CUENTA);
    await t
        .click('#txtCausacion_Detalle_Cuenta_cursor_1 [aria-label="Buscar"]')
        .expect(cuentaEnPopup.with({ timeout: 10000 }).exists).ok(`No apareció la cuenta ${CUENTA} en el buscador`)
        .doubleClick(cuentaEnPopup)
        .wait(2000)
        .expect(Selector('#txtCausacion_Detalle_Cuenta_cursor_1 .dx-texteditor-input').value).eql(CUENTA, `No quedó la cuenta ${CUENTA} en la línea`);

    await t
        .typeText('#txtdocumento_detalle_causacion_cursor_1 .dx-texteditor-input', DETALLE, { replace: true })
        .pressKey('enter')
        .typeText('#txtdocumento_detalle_causacion_Valor_cursor_1 .dx-texteditor-input', VALOR, { replace: true })
        .pressKey('enter')
        .wait(1000)
        .click('#txtdocumento_detalle_causacion_Boton_1')
        .wait(3000);
}

async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);

    await abrirMovimientos360(t, 'Causaciones');
    await t.expect(esqueleto.exists).notOk({ timeout: 20000 });

    // 1. Encabezado
    await nuevaCausacion(t);
    await elegirEnLookup(t, '#Causacion_Tercero', TERCERO, TERCERO);
    await elegirEnLookup(t, '#Causacion_Clase', CLASE, CLASE);
    await elegirEnLookup(t, '#Causacion_Sucursal', FILTRO_SUCURSAL, SUCURSAL);
    await guardarEncabezado(t);
    const numero = await numeroCausacion.value;

    // 2. Detalle
    await agregarLinea(t);
    const totalCreado = await parseValorNumerico(totalCausacion);
    await t.expect(totalCreado).eql(parseInt(VALOR, 10), `El total de la causación ${numero} debería ser ${VALOR}`);

    // 3. Volver a la consulta y cargar la causación por número
    await t
        .click('#BtnAtrasCausacion')
        .wait(2000);
    await nuevaCausacion(t);
    await t
        .typeText(numeroCausacion, numero, { replace: true })
        .pressKey('enter')
        .wait(3000)
        .expect(Selector('#Causacion_Tercero').withText(TERCERO).exists)
        .ok(`No cargó la causación ${numero}`);
    const valorCausacion = await parseValorNumerico(totalCausacion);
    await t.expect(valorCausacion).eql(parseInt(VALOR, 10), 'El valor no es el total de la causación creada previamente');

    // 4. Eliminar
    await t
        .click('#BtnEliminarCausacion')
        .click(btnConfirmarDialogo.with({ timeout: 10000 }))
        .expect(toast('eliminado').with({ timeout: 10000 }).exists)
        .ok(`No se confirmó la eliminación de la causación ${numero}`)
        .wait(1000);

    await cerrarPestana360(t);
    await cerrarSesion360(t);
}

fixture `Prueba Causaciones - Test Hgi360`
    .page(testNominaConfig.pagina)
    .beforeEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    })
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba Causaciones admin - Test Hgi360', async t => {
    await ejecutarPrueba(t, testNominaConfig);
});
