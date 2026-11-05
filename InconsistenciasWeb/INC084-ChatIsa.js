import { Selector } from 'testcafe';
import { cerrarSesion360, ingresarAplicacion, limpiarCacheChromeTestCafe } from '../Funciones/HelpersHgi360Web.js';
import { testAdminConfig, testPosWebConfig, testNominaConfig } from '../ParametrosPruebas/ParametrosPruebas.js';

/**
 * [03-nov-2026] El formulario de registro del chat ya no tiene id="nit" / id="directorCedula": se busca el campo por
 * id, por name o por la etiqueta que tiene encima ("NIT de la Empresa", "Cédula ...").
 */
async function escribirCampoChat(t, id, etiqueta, valor) {
    let campo = Selector(`#${id}, input[name="${id}"]`).filterVisible();
    if (!await campo.with({ timeout: 5000 }).exists) {
        campo = Selector('label, span, p, div').withText(etiqueta).parent().find('input').filterVisible();
    }
    await t
        .expect(campo.with({ timeout: 10000 }).exists).ok(`No se encontró el campo "${etiqueta}" en el registro del chat Isa`)
        .typeText(campo.nth(0), valor, { replace: true })
        .pressKey('enter')
        .wait(2000);
    const verificar = Selector('button').withText(/^Verificar/i).filterVisible();
    if (await verificar.exists) {
        await t.click(verificar.nth(0)).wait(2000);
    }
}

const validarChatIsa = async t => {
    await t.click('#isa-widget-drag-surface');
    await escribirCampoChat(t, 'nit', /NIT de la Empresa/i, '811021438');
    await escribirCampoChat(t, 'directorCedula', /C[eé]dula/i, '39214891');
    await t
        .expect(Selector('.registration-form-fields .success-message').visible).ok('no está el texto visible')
        .expect(Selector('#root span').withText('HGI360 Contable').visible).ok('no está el texto visible')
        .expect(Selector('#root span').withText('HGI360 Nómina').visible).ok('no está el texto visible')
        .expect(Selector('#root span').withText('HGI360 POS').visible).ok('no está el texto visible')
        .expect(Selector('#root span').withText('HGI360 Administrativo').visible).ok('no está el texto visible')
        .expect(Selector('#root span').withText('HGI360 CRM').visible).ok('no está el texto visible')
        .click(Selector('#root span').withText('HGI360 Contable'))
        .wait(2000)
        .click(Selector('#root span').withText('Chatear con un agente'))
        .wait(2000)
        .expect(
            Selector('#root p')
                .withText('Estás en cola: cuando un asesor tome tu conversación podrás enviar mensajes')
                .visible
        )
        .ok('no está el texto visible')
        .click(Selector('#root button').withText('×'));

    await cerrarSesion360(t);
};

fixture `Prueba CHAT test HGI360 Admin`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba CHAT test HGI360 Admin', async t => {
    await ingresarAplicacion(t, testAdminConfig);
    await t.wait(2000);
    await validarChatIsa(t);
});

fixture `Prueba CHAT test HGI360 Pos`
    .page(testPosWebConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba CHAT test HGI360 Pos', async t => {
    await ingresarAplicacion(t, testPosWebConfig);
    await t.wait(2000);
    await validarChatIsa(t);
});

fixture `Prueba CHAT test HGI360 Nomina`
    .page(testNominaConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba CHAT test HGI360 Nomina', async t => {
    await ingresarAplicacion(t, testNominaConfig);
    await t.wait(2000);
    await validarChatIsa(t);
});
