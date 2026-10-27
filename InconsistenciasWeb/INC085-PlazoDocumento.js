import { Selector } from 'testcafe';
import { cerrarSesion360, ingresarAplicacion, limpiarCacheChromeTestCafe } from '../Funciones/HelpersHgi360Web.js';
import { elegirTerceroDocumento, nuevoDocumento360 } from '../Funciones/HelpersDocumentos360.js';
import { testAdminConfig } from '../ParametrosPruebas/ParametrosPruebas.js';

/**
 * INC085 - TX 085No: al elegir el tercero y escribir el plazo, la fecha de vencimiento del documento debe ser
 * la fecha del documento más el plazo en días. No se guarda nada.
 */

const PLAZO = 30;
const valor = id => Selector(`#txtDocumento_${id} .dx-texteditor-input`);

/** '2026-10-26', '26/10/2026' o '10/26/2026' -> Date (día/mes según el formato con 4 dígitos al final). */
const aFecha = texto => {
    const limpio = String(texto || '').trim();
    let m = limpio.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (m) {
        return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
    }
    m = limpio.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    if (m) {
        return new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]));
    }
    return null;
};

async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    await nuevoDocumento360(t, '085No', /^\s*(INC)?085No\w* -/i);
    await elegirTerceroDocumento(t, '811021438');
    await t
        .expect(valor('Plazo').exists).ok('La transacción 085No no muestra el campo Plazo')
        .click(valor('Plazo'))
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText(valor('Plazo'), String(PLAZO))
        .pressKey('tab')
        .wait(1500);
    const textoFecha = await valor('Fecha').value;
    const textoVence = await valor('Fecha_Vence').value;
    const fecha = aFecha(textoFecha);
    const vence = aFecha(textoVence);
    await t
        .expect(fecha).ok(`No se pudo leer la fecha del documento (${textoFecha})`)
        .expect(vence).ok(`No se pudo leer la fecha de vencimiento (${textoVence})`);
    const dias = Math.round((vence - fecha) / 86400000);
    await t.expect(dias).eql(PLAZO, `Con plazo ${PLAZO} la fecha de vencimiento quedó ${textoVence} (fecha ${textoFecha}, ${dias} días)`);
    await cerrarSesion360(t);
    const confirmar = Selector('button.swal2-confirm').filterVisible();
    if (await confirmar.with({ timeout: 3000 }).exists) {
        await t.click(confirmar);
    }
}

fixture `Prueba Plazo Documentos Admin - Test Hgi360`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba Plazo Documentos Admin - Test Hgi360', async t => {
    await ejecutarPrueba(t, testAdminConfig);
});
