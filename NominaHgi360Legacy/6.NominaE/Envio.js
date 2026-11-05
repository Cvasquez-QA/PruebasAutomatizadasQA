import { Selector } from 'testcafe';
import { miNominaConfig } from '../../ParametrosPruebas/ParametrosPruebas.js';
import { testNominaConfig } from '../../ParametrosPruebas/ParametrosPruebas.js';
import {
    abrirNominaE,
    cerrarPestana360,
    cerrarSesion360,
    ingresarAplicacion
} from '../../Funciones/HelpersHgi360Legacy.js';

const AMBIENTE_HABILITACION = '2 - Habilitación';
const ID_SET_ENVIO = '1';
const ID_SET_CONSULTA = '2';

const probarEnvioNominaE = async (t, config, ingresar) => {
    await ingresarAplicacion(t, config);
    await abrirNominaE(t, 'ENVIO');
    await t
        .click('#Documentos_Electronicos_Ambiente .dx-lookup-field')
        .click(Selector('div').withText(AMBIENTE_HABILITACION).nth(9))
        .typeText('#Documentos_NominaElectronica_IdSetDian_Cursor', ID_SET_ENVIO)
        .click(Selector('#DocumentosNominaElectronicaConsultaController div').withText('Cargar').nth(5))
        .wait(2000)
        .typeText('#ListagridDocumentosNominaElectronica .dx-texteditor-input', config.idEmpleado)
        .wait(2000)
        .click(Selector('#ListagridDocumentosNominaElectronica .dx-checkbox-icon'))
        .click(Selector('#BtnEnvioDianEnvios div').withText('Enviar'))
        .wait(3000);
    await cerrarPestana360(t);
    await abrirNominaE(t, 'ENVIO');
    await t
        .wait(2000)
        .click('#tabs_documento_Consulta')
        .click('#Documentos_Electronicos_Ambiente .dx-lookup-field')
        .click(Selector('div').withText(AMBIENTE_HABILITACION).nth(9))
        .typeText(Selector('#Documentos_NominaElectronica_IdSetDian_Cursor'), ID_SET_CONSULTA)
        .click(Selector('#DocumentosNominaElectronicaConsultaController div').withText('Cargar').nth(5))
        .wait(2000)
        .typeText(Selector('#ListagridDocumentosNominaElectronicaEnviados .dx-texteditor-input'), config.idEmpleado)
        .wait(2000)
        .expect((Selector('#ListagridDocumentosNominaElectronicaEnviados td').withText(config.idEmpleado)).exists).ok('No se envió correctamente')
        ;
    await cerrarSesion360(t);
};

fixture('Prueba Nomina E Hgi360 Nomina - MiHgi360')
    .page(miNominaConfig.pagina);

test('Mi Hgi360 - Prueba Enviar NominaE', async t => {
    await probarEnvioNominaE(t, miNominaConfig, ingresarAplicacion);
});

fixture('Prueba Nomina E Hgi360 Nomina - Test Hgi360')
    .page(testNominaConfig.pagina);

test('Test Hgi360 - Prueba Enviar NominaE', async t => {
    await probarEnvioNominaE(t, testNominaConfig, ingresarAplicacion);
});
