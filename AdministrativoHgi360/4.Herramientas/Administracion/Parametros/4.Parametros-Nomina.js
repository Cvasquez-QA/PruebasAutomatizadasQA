import { Selector } from 'testcafe';
import {
    abrirHerramientas360,
    cerrarSesion360,
    filtrarPor,
    ingresarAplicacion,
    seleccionarOpcion,
    cerrarPestana360
} from '../../../../Funciones/HelpersHgi360.js';
import { testAdminConfig } from '../../../../ParametrosPruebas/TestErpAdmin8902.js';
import { hgiAdminConfig } from '../../../../ParametrosPruebas/Hgi360Admin8888.js';

const PERIODOS_NOM = '32768';
const DECIMALES_NOM = '999999999';
const FORMATO_DOCUMENTO = '130 - PLANILLA GRUPO SOF';
const FORMATO_DOCUMENTO_ESPERADO = 'PLANILLA GRUPO SOF';
const FORMATO_CANTIDAD = '55';
const FORMATO_CANTIDAD_ESPERADO = 'n5';
const FORMATO_VALOR = '6';
const FORMATO_VALOR_ESPERADO = 'n6';
const CONCEPTO_AUXILIO = '130 - Auxilio';
const CONCEPTO_AUXILIO_ESPERADO = 'Auxilio';
const PERIODO_ESPERADO = 'Mensual';
const DECIMALES_NOM_ESPERADO = '10';
const PERIODOS_NOM_RESTAURAR = '24';
const DECIMALES_NOM_RESTAURAR = '2';
const FORMATO_DOCUMENTO_RESTAURAR = '7 - Planilla de Pago';
const FORMATO_CANTIDAD_RESTAURAR = '2';
const FORMATO_VALOR_RESTAURAR = '2';
const FILTRO_SALARIO = '001';
const SALARIO_BASICO = '001 - Salario Basico';
const FILTRO_GENERAL = 'general';
const GENERAL = '0 - GENERAL';
const FILTRO_HORAS_EXTRAS = '002';
const HORAS_EXTRAS = '002 - Horas Extras Diurnas';
const HORAS_EXTRAS_FESTIVAS = '003 - Horas extras festivas diurnas';
const FILTRO_CESANTIAS = '120';
const CESANTIAS = '120 - Cesantias';
const FILTRO_INTERESES_CESANTIAS = '007';
const INTERESES_CESANTIAS = '007 - Intereses Cesantias';
const FILTRO_PRIMA = '004';
const PRIMA_SERVICIOS = '004 - Prima de Servicios';
const FILTRO_VACACIONES = '020';
const VACACIONES = '020 - Vacaciones';
const FILTRO_VACACIONES_COMP = '117';
const VACACIONES_COMPENSADAS = '117 - Vacaciones Compensadas';

async function ejecutarPrueba4ParametrosNomina(t, config) {
    await ingresarAplicacion(t, config);
        await abrirHerramientas360(t, 'Parámetros');
        await t
            .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
            .wait(1500)
            .click('#tabs_parametros_Nomina')
            .click(Selector('#BtnEditar span').withText('Editar'))
            .click('#TxtPrm_Nomina_IntInTerValo .dx-radiobutton-icon')
            .click(Selector('#TxtPrm_Nomina_IntInTerValo .dx-radiobutton-icon').nth(1))
            .click(Selector('#TxtPrm_Nomina_IntInTerValo .dx-radiobutton-icon').nth(2))
            .click(Selector('#TxtPrm_Nomina_IntInTerValo .dx-radiobutton-icon').nth(3))
            .click(Selector('#TxtPrm_Nomina_IntInTerValo .dx-radiobutton-icon').nth(4))
            .click('#TxtPrm_Nomina_IntPeriodosNom .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#TxtPrm_Nomina_IntPeriodosNom .dx-texteditor-input', PERIODOS_NOM)
            .click('#TxtPrm_Nomina_IntDecimalesNom .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#TxtPrm_Nomina_IntDecimalesNom .dx-texteditor-input', DECIMALES_NOM)
            .click('#txt_lista_NominaIntFormatoDocumentoNom .dx-lookup-field')
            ;
    await seleccionarOpcion(t, FORMATO_DOCUMENTO);
    await t
            .click('#TxtPrm_Nomina_StrFormatoCantidadN .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#TxtPrm_Nomina_StrFormatoCantidadN .dx-texteditor-input', FORMATO_CANTIDAD)
            .click('#TxtPrm_Nomina_StrFormatoValorN .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#TxtPrm_Nomina_StrFormatoValorN .dx-texteditor-input', FORMATO_VALOR)
            .click('#tabs_parametrosNom_Conceptos')
            .click(Selector('#txt_lista_NominaStrConceptoBasico .dx-lookup-field'))
            ;
    await seleccionarOpcion(t, CONCEPTO_AUXILIO);
    await t
            .click(Selector('#txt_lista_NominaStrConceptoBasicoTurno .dx-lookup-field'))
            ;
    await seleccionarOpcion(t, CONCEPTO_AUXILIO);
    await t
            .click(Selector('#txt_lista_NominaStrCHorasOD .dx-lookup-field'))
            ;
    await seleccionarOpcion(t, CONCEPTO_AUXILIO);
    await t
            .click(Selector('#txt_lista_NominaStrCHorasON .dx-lookup-field'))
            ;
    await seleccionarOpcion(t, CONCEPTO_AUXILIO);
    await t
            .click(Selector('#txt_lista_NominaStrCHorasFD .dx-lookup-field'))
            ;
    await seleccionarOpcion(t, CONCEPTO_AUXILIO);
    await t
            .click(Selector('#txt_lista_NominaStrCHorasFN .dx-lookup-field'))
            ;
    await seleccionarOpcion(t, CONCEPTO_AUXILIO);
    await t
            .click(Selector('#txt_lista_NominaStrCHorasED .dx-lookup-field'))
            ;
    await seleccionarOpcion(t, CONCEPTO_AUXILIO);
    await t
            .click(Selector('#txt_lista_NominaStrCHorasEN .dx-lookup-field'))
            ;
    await seleccionarOpcion(t, CONCEPTO_AUXILIO);
    await t
            .click(Selector('#txt_lista_NominaStrCHorasEFD .dx-lookup-field'))
            ;
    await seleccionarOpcion(t, CONCEPTO_AUXILIO);
    await t
            .click(Selector('#txt_lista_NominaStrCHorasEFN .dx-lookup-field'))
            ;
    await seleccionarOpcion(t, CONCEPTO_AUXILIO);
    await t
            .click(Selector('#txt_lista_NominaStrConceptoCesantias .dx-lookup-field'))
            ;
    await seleccionarOpcion(t, CONCEPTO_AUXILIO);
    await t
            .click(Selector('#txt_lista_NominaStrConceptoIntCesantias .dx-lookup-field'))
            ;
    await seleccionarOpcion(t, CONCEPTO_AUXILIO);
    await t
            .click(Selector('#txt_lista_NominaStrConceptoPrima .dx-lookup-field'))
            ;
    await seleccionarOpcion(t, CONCEPTO_AUXILIO);
    await t
            .click(Selector('#txt_lista_NominaStrConceptoVacaciones .dx-lookup-field'))
            ;
    await seleccionarOpcion(t, CONCEPTO_AUXILIO);
    await t
            .click(Selector('#txt_lista_NominaStrConceptoVacacionesCom .dx-lookup-field'))
            ;
    await seleccionarOpcion(t, CONCEPTO_AUXILIO);
    await t
            .click(Selector('#TxtPrm_Nomina_StrConceptoApoyoSostenimiento .dx-lookup-field'))
            ;
    await seleccionarOpcion(t, CONCEPTO_AUXILIO);
    await t
            .click('#tabs_parametros_Nomina')
            .click(Selector('#BtnGuardar span').withText('Guardar'))
            .click(Selector('button').withText('Aceptar').nth(1));
            //Se validan los datops guardados

        await cerrarPestana360(t);
        await abrirHerramientas360(t, 'Parámetros');
        await t
            .click('#tabs_parametros_Nomina')
            .click(Selector('#BtnEditar span').withText('Editar'))
            .click(Selector('#TxtPrm_Nomina_IntInTerValo div').withText('Mensual').nth(2))
            .click('#TxtPrm_Nomina_IntPeriodosNom .dx-texteditor-input')

            .expect(Selector('[class^="dx-item dx-item-selected dx-radiobutton-checked dx"]').nth(6).find('.dx-item-content').innerText).eql(PERIODO_ESPERADO,'no guard� el valor seleccionado')
            .expect(Selector('#TxtPrm_Nomina_IntPeriodosNom .dx-texteditor-input').value).eql(PERIODOS_NOM,'no guard� el valor seleccionado')
            .expect(Selector('#TxtPrm_Nomina_IntDecimalesNom .dx-texteditor-input').value).eql(DECIMALES_NOM_ESPERADO,'no guard� el valor seleccionado')
            .expect(Selector('#txt_lista_NominaIntFormatoDocumentoNom .dx-lookup-field').innerText).eql(FORMATO_DOCUMENTO_ESPERADO,'no guard� el valor seleccionado')
            .expect(Selector('#TxtPrm_Nomina_StrFormatoCantidadN .dx-texteditor-input').value).eql(FORMATO_CANTIDAD_ESPERADO,'El sistema no guard� el cambio')
            .expect(Selector('#TxtPrm_Nomina_StrFormatoValorN .dx-texteditor-input').value).eql(FORMATO_VALOR_ESPERADO,'El sistema no guard� el cambio')
            .click('#tabs_parametrosNom_Conceptos')
            .expect(Selector('#txt_lista_NominaStrConceptoBasico .dx-lookup-field').innerText).eql(CONCEPTO_AUXILIO_ESPERADO,'El sistema no guard� el cambio')
            .expect(Selector('#txt_lista_NominaStrConceptoBasicoTurno .dx-lookup-field').innerText).eql(CONCEPTO_AUXILIO_ESPERADO,'El sistema no guard� el cambio')
            .expect(Selector('#txt_lista_NominaStrCHorasOD .dx-lookup-field').innerText).eql(CONCEPTO_AUXILIO_ESPERADO,'El sistema no guard� el cambio')
            .expect(Selector('#txt_lista_NominaStrCHorasON .dx-lookup-field').innerText).eql(CONCEPTO_AUXILIO_ESPERADO,'El sistema no guard� el cambio')
            .expect(Selector('#txt_lista_NominaStrCHorasFD .dx-lookup-field').innerText).eql(CONCEPTO_AUXILIO_ESPERADO,'El sistema no guard� el cambio')
            .expect(Selector('#txt_lista_NominaStrCHorasFN .dx-lookup-field').innerText).eql(CONCEPTO_AUXILIO_ESPERADO,'El sistema no guard� el cambio')
            .expect(Selector('#txt_lista_NominaStrCHorasED .dx-lookup-field').innerText).eql(CONCEPTO_AUXILIO_ESPERADO,'El sistema no guard� el cambio')
            .expect(Selector('#txt_lista_NominaStrCHorasEN .dx-lookup-field').innerText).eql(CONCEPTO_AUXILIO_ESPERADO,'El sistema no guard� el cambio')
            .expect(Selector('#txt_lista_NominaStrCHorasEFD .dx-lookup-field').innerText).eql(CONCEPTO_AUXILIO_ESPERADO,'El sistema no guard� el cambio')
            .expect(Selector('#txt_lista_NominaStrCHorasEFN .dx-lookup-field').innerText).eql(CONCEPTO_AUXILIO_ESPERADO,'El sistema no guard� el cambio')
            .expect(Selector('#txt_lista_NominaStrConceptoCesantias .dx-lookup-field').innerText).eql(CONCEPTO_AUXILIO_ESPERADO,'El sistema no guard� el cambio')
            .expect(Selector('#txt_lista_NominaStrConceptoIntCesantias .dx-lookup-field').innerText).eql(CONCEPTO_AUXILIO_ESPERADO,'El sistema no guard� el cambio')
            .expect(Selector('#txt_lista_NominaStrConceptoPrima .dx-lookup-field').innerText).eql(CONCEPTO_AUXILIO_ESPERADO,'El sistema no guard� el cambio')
            .expect(Selector('#txt_lista_NominaStrConceptoVacaciones .dx-lookup-field').innerText).eql(CONCEPTO_AUXILIO_ESPERADO,'El sistema no guard� el cambio')
            .expect(Selector('#txt_lista_NominaStrConceptoVacacionesCom .dx-lookup-field').innerText).eql(CONCEPTO_AUXILIO_ESPERADO,'El sistema no guard� el cambio')
            .expect(Selector('#TxtPrm_Nomina_StrConceptoApoyoSostenimiento .dx-lookup-field').innerText).eql(CONCEPTO_AUXILIO_ESPERADO,'El sistema no guard� el cambio')

            //Se restauran los valores
            .click('#tabs_parametros_Nomina')
            .click('#tabs_parametrosNom_General')
            .click(Selector('#TxtPrm_Nomina_IntInTerValo .dx-radiobutton-icon').nth(3))
            .click('#TxtPrm_Nomina_IntPeriodosNom .dx-texteditor-input')
            .pressKey('backspace')
            .pressKey('ctrl+a')
            .typeText('#TxtPrm_Nomina_IntPeriodosNom .dx-texteditor-input', PERIODOS_NOM_RESTAURAR)
            .click('#TxtPrm_Nomina_IntDecimalesNom .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#TxtPrm_Nomina_IntDecimalesNom .dx-texteditor-input', DECIMALES_NOM_RESTAURAR)
            //.click('#TxtPrm_Nomina_IntPeriodosNom .dx-texteditor-input')
            //.doubleClick(Selector('#txt_lista_NominaIntFormatoDocumentoNom .dx-lookup-field'))
            .wait(2000)
            .click(Selector('#txt_lista_NominaIntFormatoDocumentoNom .dx-lookup-field'))
            ;
    await seleccionarOpcion(t, FORMATO_DOCUMENTO_RESTAURAR);
    await t
            .click('#TxtPrm_Nomina_StrFormatoCantidadN .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#TxtPrm_Nomina_StrFormatoCantidadN .dx-texteditor-input', FORMATO_CANTIDAD_RESTAURAR)
            .click('#TxtPrm_Nomina_StrFormatoValorN .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#TxtPrm_Nomina_StrFormatoValorN .dx-texteditor-input', FORMATO_VALOR_RESTAURAR)

            .click('#tabs_parametrosNom_Conceptos')
            .click(Selector('#txt_lista_NominaStrConceptoBasico .dx-lookup-field'));

            await filtrarPor(t, FILTRO_SALARIO);
            await t
            .wait(2000)
            ;
    await seleccionarOpcion(t, SALARIO_BASICO);
    await t
            .click(Selector('#txt_lista_NominaStrConceptoBasicoTurno .dx-lookup-field'));

            await filtrarPor(t, FILTRO_SALARIO);
            await t
            .wait(2000)
            ;
    await seleccionarOpcion(t, SALARIO_BASICO);
    await t
            .click(Selector('#txt_lista_NominaStrCHorasOD .dx-lookup-field'));

            await filtrarPor(t, FILTRO_SALARIO);
            await t
            .wait(2000)
            ;
    await seleccionarOpcion(t, SALARIO_BASICO);
    await t
            .click(Selector('#txt_lista_NominaStrCHorasON .dx-lookup-field'));

            await filtrarPor(t, FILTRO_GENERAL);
            await t
            .wait(2000)
            ;
    await seleccionarOpcion(t, GENERAL);
    await t
            .click(Selector('#txt_lista_NominaStrCHorasFD .dx-lookup-field'));

            await filtrarPor(t, FILTRO_GENERAL);
            await t
            .wait(2000)
            ;
    await seleccionarOpcion(t, GENERAL);
    await t
            .click(Selector('#txt_lista_NominaStrCHorasFN .dx-lookup-field'));

            await filtrarPor(t, FILTRO_GENERAL);
            await t
            .wait(2000)
            ;
    await seleccionarOpcion(t, GENERAL);
    await t
            .click(Selector('#txt_lista_NominaStrCHorasED .dx-lookup-field'));

            await filtrarPor(t, FILTRO_HORAS_EXTRAS);
            await t
            .wait(2000)
            ;
    await seleccionarOpcion(t, HORAS_EXTRAS);
    await t
            .click(Selector('#txt_lista_NominaStrCHorasEN .dx-lookup-field'));

            await filtrarPor(t, FILTRO_HORAS_EXTRAS);
            await t
            .wait(2000)
            ;
    await seleccionarOpcion(t, HORAS_EXTRAS);
    await t
            .click(Selector('#txt_lista_NominaStrCHorasEFD .dx-lookup-field'));

            await filtrarPor(t, FILTRO_HORAS_EXTRAS);
            await t
            .wait(2000)
            ;
    await seleccionarOpcion(t, HORAS_EXTRAS_FESTIVAS);
    await t
            .click(Selector('#txt_lista_NominaStrCHorasEFN .dx-lookup-field'));

            await filtrarPor(t, FILTRO_GENERAL);
            await t
            .wait(2000)
            ;
    await seleccionarOpcion(t, GENERAL);
    await t
            .click(Selector('#txt_lista_NominaStrConceptoCesantias .dx-lookup-field'));

            await filtrarPor(t, FILTRO_CESANTIAS);
            await t
            .wait(2000)
            ;
    await seleccionarOpcion(t, CESANTIAS);
    await t
            .click(Selector('#txt_lista_NominaStrConceptoIntCesantias .dx-lookup-field'));

            await filtrarPor(t, FILTRO_INTERESES_CESANTIAS);
            await t
            .wait(2000)
            ;
    await seleccionarOpcion(t, INTERESES_CESANTIAS);
    await t
            .click(Selector('#txt_lista_NominaStrConceptoPrima .dx-lookup-field'));

            await filtrarPor(t, FILTRO_PRIMA);
            await t
            .wait(2000)
            ;
    await seleccionarOpcion(t, PRIMA_SERVICIOS);
    await t
            .click(Selector('#txt_lista_NominaStrConceptoVacaciones .dx-lookup-field'));

            await filtrarPor(t, FILTRO_VACACIONES);
            await t
            .wait(2000)
            ;
    await seleccionarOpcion(t, VACACIONES);
    await t
            .click(Selector('#txt_lista_NominaStrConceptoVacacionesCom .dx-lookup-field'));

            await filtrarPor(t, FILTRO_VACACIONES_COMP);
            await t
            .wait(2000)
            ;
    await seleccionarOpcion(t, VACACIONES_COMPENSADAS);
    await t
            .click(Selector('#TxtPrm_Nomina_StrConceptoApoyoSostenimiento .dx-lookup-field'));

            await filtrarPor(t, FILTRO_SALARIO);
            await t
            .wait(2000)
            ;
    await seleccionarOpcion(t, SALARIO_BASICO);
    await t
            .click(Selector('#BtnGuardar span').withText('Guardar'))
            .click(Selector('button').withText('Aceptar').nth(1));
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `4.Parametros-Nomina - Test Hgi360`
    .page(testAdminConfig.pagina);

test('Prueba Parametros Nomina ERP POS - Test Hgi360', async t => {
    await ejecutarPrueba4ParametrosNomina(t, testAdminConfig);
});

fixture `4.Parametros-Nomina - Hgi360 Admin`
    .page(hgiAdminConfig.pagina);

test('Prueba Parametros Nomina ERP POS - Hgi360 Admin', async t => {
    await ejecutarPrueba4ParametrosNomina(t, hgiAdminConfig);
});
