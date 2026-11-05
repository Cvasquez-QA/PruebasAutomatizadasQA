import { Selector } from 'testcafe';
import { miNominaConfig } from '../../../../ParametrosPruebas/ParametrosPruebas.js';
import { testNominaConfig } from '../../../../ParametrosPruebas/ParametrosPruebas.js';
import {
    ingresarAplicacion,
    
    cerrarSesion360,
    seleccionarOpcion
} from '../../../../Funciones/HelpersHgi360Legacy.js';
import {
    ingresarParametros,
    editarParametros,
    reabrirParametros
} from '../HelpersNomina.js';

const TAB_NOMINA = '#tabs_parametros_Nomina';
const PERIODOS_NOMINA = '24';
const DECIMALES_INICIALES = '1';
const DECIMALES_FINALES = '2';
const FORMATO_CANTIDAD = 'n2';
const FORMATO_VALOR_INICIAL = '55';
const FORMATO_VALOR_FINAL = 'n2';
const FORMATO_DOCUMENTO = 'PLANILLA DE PAGO';

const ejecutarParametrosNomina = async (t, config, ingresar) => {
    await ingresarAplicacion(t, config);
    await ingresarParametros(t, TAB_NOMINA);
    await editarParametros(t);

    await t
        .click(Selector('.dx-item.dx-radiobutton').find('div').withText('Catorcenal').filterVisible())
        .click('#TxtPrm_Nomina_IntPeriodosNom .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#TxtPrm_Nomina_IntPeriodosNom .dx-texteditor-input', PERIODOS_NOMINA)
        .click('#TxtPrm_Nomina_IntDecimalesNom .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#TxtPrm_Nomina_IntDecimalesNom .dx-texteditor-input', DECIMALES_INICIALES)
        .click('#txt_lista_NominaIntFormatoDocumentoNom .dx-lookup-field')
        ;
    await seleccionarOpcion(t, FORMATO_DOCUMENTO);
    await t
        .click('#tabs_parametrosNom_Conceptos .icon-vcard.mr-2')
        .click('#tabs_parametrosNom_General .icon-compose.mr-2')
        .click('#TxtPrm_Nomina_StrFormatoCantidadN .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#TxtPrm_Nomina_StrFormatoCantidadN .dx-texteditor-input', FORMATO_CANTIDAD)
        .click('#TxtPrm_Nomina_StrFormatoValorN .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#TxtPrm_Nomina_StrFormatoValorN .dx-texteditor-input', FORMATO_VALOR_INICIAL)
        .click('#tabs_parametrosNom_Conceptos .icon-vcard.mr-2')
        .click('#BtnGuardar .dx-icon.dx-icon-save')
        .click(Selector('.swal2-actions button').withText('Aceptar'))
        .wait(2000);

    await reabrirParametros(t, TAB_NOMINA);

    await t
        .click(Selector('.dx-item.dx-radiobutton').find('div').withText('Quincenal').filterVisible())
        .click('#TxtPrm_Nomina_IntPeriodosNom .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#TxtPrm_Nomina_IntPeriodosNom .dx-texteditor-input', PERIODOS_NOMINA)
        .click('#TxtPrm_Nomina_IntDecimalesNom .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#TxtPrm_Nomina_IntDecimalesNom .dx-texteditor-input', DECIMALES_FINALES)
        .click('#TxtPrm_Nomina_StrFormatoCantidadN .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#TxtPrm_Nomina_StrFormatoCantidadN .dx-texteditor-input', FORMATO_CANTIDAD)
        .click('#TxtPrm_Nomina_StrFormatoValorN .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#TxtPrm_Nomina_StrFormatoValorN .dx-texteditor-input', FORMATO_VALOR_FINAL)
        .click('#BtnGuardar .dx-icon.dx-icon-save')
        .click(Selector('.swal2-actions button').withText('Aceptar'))
        .wait(2000);

    await reabrirParametros(t, TAB_NOMINA);

    await t
        .expect(Selector('#TxtPrm_Nomina_IntPeriodosNom .dx-texteditor-input').value).eql(PERIODOS_NOMINA)
        .expect(Selector('#TxtPrm_Nomina_IntDecimalesNom .dx-texteditor-input').value).eql(DECIMALES_FINALES)
        .expect(Selector('#TxtPrm_Nomina_StrFormatoCantidadN .dx-texteditor-input').value).eql(FORMATO_CANTIDAD)
        .expect(Selector('#TxtPrm_Nomina_StrFormatoValorN .dx-texteditor-input').value).eql(FORMATO_VALOR_FINAL)
        .click('#tabs_parametrosNom_Conceptos')
        .expect(Selector('#txt_lista_NominaStrConceptoBasico .dx-lookup-field').innerText).eql('Salario Básico')
        .expect(Selector('#txt_lista_NominaStrConceptoBasicoTurno .dx-lookup-field').innerText).eql('Salario Básico')
        .expect(Selector('#txt_lista_NominaStrCHorasOD .dx-lookup-field').innerText).eql('Salario Básico')
        .expect(Selector('#txt_lista_NominaStrCHorasON .dx-lookup-field').innerText).eql('Hora extra nocturna')
        .expect(Selector('#txt_lista_NominaStrCHorasFD div').innerText).eql('Horas extras dominicales y festivas diurnas')
        .expect(Selector('#txt_lista_NominaStrCHorasFN div').innerText).eql('Horas extras dominicales y festivas nocturas')
        .expect(Selector('#txt_lista_NominaStrCHorasED div').innerText).eql('Hora extra diurna')
        .expect(Selector('#txt_lista_NominaStrCHorasEN div').innerText).eql('Hora extra nocturna')
        .expect(Selector('#txt_lista_NominaStrCHorasEFD div').innerText).eql('Horas extras dominicales y festivas diurnas')
        .expect(Selector('#txt_lista_NominaStrCHorasEFN div').innerText).eql('Horas extras dominicales y festivas nocturas')
        .expect(Selector('#txt_lista_NominaStrConceptoCesantias div').innerText).eql('Cesantías')
        .expect(Selector('#txt_lista_NominaStrConceptoIntCesantias div').innerText).eql('Intereses de cesantías')
        .expect(Selector('#txt_lista_NominaStrConceptoPrima div').innerText).eql('Prima')
        .expect(Selector('#txt_lista_NominaStrConceptoVacaciones div').innerText).eql('Vacaciones')
        .expect(Selector('#txt_lista_NominaStrConceptoVacacionesCom div').innerText).eql('Vacaciones compensadas')
        .expect(Selector('#TxtPrm_Nomina_StrConceptoApoyoSostenimiento div').innerText).eql('Apoyo de Sostenimiento')
        .click(Selector('#BtnGuardar span').withText('Guardar'))
        .click(Selector('.swal2-actions button').withText('Aceptar'));

    await t.switchToMainWindow();
    await cerrarSesion360(t);
};

fixture `Prueba Parametros Nomina Hgi360 - MiHgi360 8893`
    .page(miNominaConfig.pagina);

test('[Mi Hgi360 8893] Parametros Nomina - guardar y validar persistencia', async t => {
    await ejecutarParametrosNomina(t, miNominaConfig, ingresarAplicacion);
});

fixture `Prueba Parametros Nomina Hgi360 - Test Hgi360 8902`
    .page(testNominaConfig.pagina);

test('[Test Hgi360 8902] Parametros Nomina - guardar y validar persistencia', async t => {
    await ejecutarParametrosNomina(t, testNominaConfig, ingresarAplicacion);
});
