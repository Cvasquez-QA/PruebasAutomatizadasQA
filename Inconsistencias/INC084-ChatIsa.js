import { Selector } from 'testcafe';
import {
    cerrarSesion360,
    ingresarAplicacion,
} from '../../Funciones/HelpersHgi360.js';
import { testAdminConfig } from '../../ParametrosPruebas/TestErpAdmin8902.js';
import { testPosConfig } from '../../ParametrosPruebas/TestErpPos8902.js';
import { testNominaConfig } from '../../ParametrosPruebas/TestErpNomina8902.js';

const validarChatIsa = async t => {
    await t
        .click('#isa-widget-drag-surface')
        .switchToIframe('#isa-chatbot-widget')
        .click('#nit')
        .typeText('#nit', '811021438')
        .pressKey('enter')
        .wait(2000)
        .click('#directorCedula')
        .typeText('#directorCedula', '39214891')
        .pressKey('enter')
        .wait(2000)
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
    .page(testAdminConfig.pagina);

test('Prueba CHAT test HGI360 Admin', async t => {
    await ingresarAplicacion(t, testAdminConfig);
    await t.wait(2000);
    await validarChatIsa(t);
});

fixture `Prueba CHAT test HGI360 Pos`
    .page(testPosConfig.pagina);

test('Prueba CHAT test HGI360 Pos', async t => {
    await ingresarAplicacion(t, testPosConfig);
    await t.wait(2000);
    await validarChatIsa(t);
});

fixture `Prueba CHAT test HGI360 Nomina`
    .page(testNominaConfig.pagina);

test('Prueba CHAT test HGI360 Nomina', async t => {
    await ingresarAplicacion(t, testNominaConfig);
    await t.wait(2000);
    await validarChatIsa(t);
});
