import { test, expect } from '@playwright/test';
import {
    abrirHerramientas360,
    cerrarSesion360,
    filtrarPor,
    ingresarAplicacion,
    seleccionarOpcion,
    cerrarPestana360,
    escribir
} from '../../../../Funciones/HelpersHgi360PW.js';
import { testAdminConfig, hgiAdminConfig } from '../../../../ParametrosPruebas/ParametrosPruebas.js';

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

async function ejecutarPrueba4ParametrosNomina(page, config) {
    await ingresarAplicacion(page, config);
        await abrirHerramientas360(page, 'Parámetros');
        const frame = page.frameLocator('iframe[id^="iframe_tab_"]');
        await page.waitForTimeout(1500);
        await frame.locator('#tabs_parametros_Nomina').first().click();
        await frame.locator('#BtnEditar span').filter({ hasText: 'Editar' }).first().click();
        await frame.locator('#TxtPrm_Nomina_IntInTerValo .dx-radiobutton-icon').first().click();
        await frame.locator('#TxtPrm_Nomina_IntInTerValo .dx-radiobutton-icon').nth(1).click();
        await frame.locator('#TxtPrm_Nomina_IntInTerValo .dx-radiobutton-icon').nth(2).click();
        await frame.locator('#TxtPrm_Nomina_IntInTerValo .dx-radiobutton-icon').nth(3).click();
        await frame.locator('#TxtPrm_Nomina_IntInTerValo .dx-radiobutton-icon').nth(4).click();
        await frame.locator('#TxtPrm_Nomina_IntPeriodosNom .dx-texteditor-input').first().click();
        await page.keyboard.press('Control+A');
        await page.keyboard.press('Backspace');
        await escribir(frame.locator('#TxtPrm_Nomina_IntPeriodosNom .dx-texteditor-input'), PERIODOS_NOM, { reemplazar: false });
        await frame.locator('#TxtPrm_Nomina_IntDecimalesNom .dx-texteditor-input').first().click();
        await page.keyboard.press('Control+A');
        await page.keyboard.press('Backspace');
        await escribir(frame.locator('#TxtPrm_Nomina_IntDecimalesNom .dx-texteditor-input'), DECIMALES_NOM, { reemplazar: false });
        await frame.locator('#txt_lista_NominaIntFormatoDocumentoNom .dx-lookup-field').first().click();
    await seleccionarOpcion(frame, FORMATO_DOCUMENTO);
        await frame.locator('#TxtPrm_Nomina_StrFormatoCantidadN .dx-texteditor-input').first().click();
        await page.keyboard.press('Control+A');
        await page.keyboard.press('Backspace');
        await escribir(frame.locator('#TxtPrm_Nomina_StrFormatoCantidadN .dx-texteditor-input'), FORMATO_CANTIDAD, { reemplazar: false });
        await frame.locator('#TxtPrm_Nomina_StrFormatoValorN .dx-texteditor-input').first().click();
        await page.keyboard.press('Control+A');
        await page.keyboard.press('Backspace');
        await escribir(frame.locator('#TxtPrm_Nomina_StrFormatoValorN .dx-texteditor-input'), FORMATO_VALOR, { reemplazar: false });
        await frame.locator('#tabs_parametrosNom_Conceptos').first().click();
        await frame.locator('#txt_lista_NominaStrConceptoBasico .dx-lookup-field').first().click();
    await seleccionarOpcion(frame, CONCEPTO_AUXILIO);
        await frame.locator('#txt_lista_NominaStrConceptoBasicoTurno .dx-lookup-field').first().click();
    await seleccionarOpcion(frame, CONCEPTO_AUXILIO);
        await frame.locator('#txt_lista_NominaStrCHorasOD .dx-lookup-field').first().click();
    await seleccionarOpcion(frame, CONCEPTO_AUXILIO);
        await frame.locator('#txt_lista_NominaStrCHorasON .dx-lookup-field').first().click();
    await seleccionarOpcion(frame, CONCEPTO_AUXILIO);
        await frame.locator('#txt_lista_NominaStrCHorasFD .dx-lookup-field').first().click();
    await seleccionarOpcion(frame, CONCEPTO_AUXILIO);
        await frame.locator('#txt_lista_NominaStrCHorasFN .dx-lookup-field').first().click();
    await seleccionarOpcion(frame, CONCEPTO_AUXILIO);
        await frame.locator('#txt_lista_NominaStrCHorasED .dx-lookup-field').first().click();
    await seleccionarOpcion(frame, CONCEPTO_AUXILIO);
        await frame.locator('#txt_lista_NominaStrCHorasEN .dx-lookup-field').first().click();
    await seleccionarOpcion(frame, CONCEPTO_AUXILIO);
        await frame.locator('#txt_lista_NominaStrCHorasEFD .dx-lookup-field').first().click();
    await seleccionarOpcion(frame, CONCEPTO_AUXILIO);
        await frame.locator('#txt_lista_NominaStrCHorasEFN .dx-lookup-field').first().click();
    await seleccionarOpcion(frame, CONCEPTO_AUXILIO);
        await frame.locator('#txt_lista_NominaStrConceptoCesantias .dx-lookup-field').first().click();
    await seleccionarOpcion(frame, CONCEPTO_AUXILIO);
        await frame.locator('#txt_lista_NominaStrConceptoIntCesantias .dx-lookup-field').first().click();
    await seleccionarOpcion(frame, CONCEPTO_AUXILIO);
        await frame.locator('#txt_lista_NominaStrConceptoPrima .dx-lookup-field').first().click();
    await seleccionarOpcion(frame, CONCEPTO_AUXILIO);
        await frame.locator('#txt_lista_NominaStrConceptoVacaciones .dx-lookup-field').first().click();
    await seleccionarOpcion(frame, CONCEPTO_AUXILIO);
        await frame.locator('#txt_lista_NominaStrConceptoVacacionesCom .dx-lookup-field').first().click();
    await seleccionarOpcion(frame, CONCEPTO_AUXILIO);
        await frame.locator('#TxtPrm_Nomina_StrConceptoApoyoSostenimiento .dx-lookup-field').first().click();
    await seleccionarOpcion(frame, CONCEPTO_AUXILIO);
        await frame.locator('#tabs_parametros_Nomina').first().click();
        await frame.locator('#BtnGuardar span').filter({ hasText: 'Guardar' }).first().click();
        await frame.locator('button').filter({ hasText: 'Aceptar' }).nth(1).click();
            //Se validan los datops guardados

        await cerrarPestana360(page);
        await abrirHerramientas360(page, 'Parámetros');
        await page.locator('#tabs_parametros_Nomina').first().click();
        await page.locator('#BtnEditar span').filter({ hasText: 'Editar' }).first().click();
        await page.locator('#TxtPrm_Nomina_IntInTerValo div').filter({ hasText: 'Mensual' }).nth(2).click();
        await page.locator('#TxtPrm_Nomina_IntPeriodosNom .dx-texteditor-input').first().click();

        await expect(page.locator('[class^="dx-item dx-item-selected dx-radiobutton-checked dx"]').nth(6).locator('.dx-item-content').first(), 'no guard� el valor seleccionado').toHaveText(PERIODO_ESPERADO);
        await expect(page.locator('#TxtPrm_Nomina_IntPeriodosNom .dx-texteditor-input').first(), 'no guard� el valor seleccionado').toHaveValue(PERIODOS_NOM);
        await expect(page.locator('#TxtPrm_Nomina_IntDecimalesNom .dx-texteditor-input').first(), 'no guard� el valor seleccionado').toHaveValue(DECIMALES_NOM_ESPERADO);
        await expect(page.locator('#txt_lista_NominaIntFormatoDocumentoNom .dx-lookup-field').first(), 'no guard� el valor seleccionado').toHaveText(FORMATO_DOCUMENTO_ESPERADO);
        await expect(page.locator('#TxtPrm_Nomina_StrFormatoCantidadN .dx-texteditor-input').first(), 'El sistema no guard� el cambio').toHaveValue(FORMATO_CANTIDAD_ESPERADO);
        await expect(page.locator('#TxtPrm_Nomina_StrFormatoValorN .dx-texteditor-input').first(), 'El sistema no guard� el cambio').toHaveValue(FORMATO_VALOR_ESPERADO);
        await page.locator('#tabs_parametrosNom_Conceptos').first().click();
        await expect(page.locator('#txt_lista_NominaStrConceptoBasico .dx-lookup-field').first(), 'El sistema no guard� el cambio').toHaveText(CONCEPTO_AUXILIO_ESPERADO);
        await expect(page.locator('#txt_lista_NominaStrConceptoBasicoTurno .dx-lookup-field').first(), 'El sistema no guard� el cambio').toHaveText(CONCEPTO_AUXILIO_ESPERADO);
        await expect(page.locator('#txt_lista_NominaStrCHorasOD .dx-lookup-field').first(), 'El sistema no guard� el cambio').toHaveText(CONCEPTO_AUXILIO_ESPERADO);
        await expect(page.locator('#txt_lista_NominaStrCHorasON .dx-lookup-field').first(), 'El sistema no guard� el cambio').toHaveText(CONCEPTO_AUXILIO_ESPERADO);
        await expect(page.locator('#txt_lista_NominaStrCHorasFD .dx-lookup-field').first(), 'El sistema no guard� el cambio').toHaveText(CONCEPTO_AUXILIO_ESPERADO);
        await expect(page.locator('#txt_lista_NominaStrCHorasFN .dx-lookup-field').first(), 'El sistema no guard� el cambio').toHaveText(CONCEPTO_AUXILIO_ESPERADO);
        await expect(page.locator('#txt_lista_NominaStrCHorasED .dx-lookup-field').first(), 'El sistema no guard� el cambio').toHaveText(CONCEPTO_AUXILIO_ESPERADO);
        await expect(page.locator('#txt_lista_NominaStrCHorasEN .dx-lookup-field').first(), 'El sistema no guard� el cambio').toHaveText(CONCEPTO_AUXILIO_ESPERADO);
        await expect(page.locator('#txt_lista_NominaStrCHorasEFD .dx-lookup-field').first(), 'El sistema no guard� el cambio').toHaveText(CONCEPTO_AUXILIO_ESPERADO);
        await expect(page.locator('#txt_lista_NominaStrCHorasEFN .dx-lookup-field').first(), 'El sistema no guard� el cambio').toHaveText(CONCEPTO_AUXILIO_ESPERADO);
        await expect(page.locator('#txt_lista_NominaStrConceptoCesantias .dx-lookup-field').first(), 'El sistema no guard� el cambio').toHaveText(CONCEPTO_AUXILIO_ESPERADO);
        await expect(page.locator('#txt_lista_NominaStrConceptoIntCesantias .dx-lookup-field').first(), 'El sistema no guard� el cambio').toHaveText(CONCEPTO_AUXILIO_ESPERADO);
        await expect(page.locator('#txt_lista_NominaStrConceptoPrima .dx-lookup-field').first(), 'El sistema no guard� el cambio').toHaveText(CONCEPTO_AUXILIO_ESPERADO);
        await expect(page.locator('#txt_lista_NominaStrConceptoVacaciones .dx-lookup-field').first(), 'El sistema no guard� el cambio').toHaveText(CONCEPTO_AUXILIO_ESPERADO);
        await expect(page.locator('#txt_lista_NominaStrConceptoVacacionesCom .dx-lookup-field').first(), 'El sistema no guard� el cambio').toHaveText(CONCEPTO_AUXILIO_ESPERADO);
        await expect(page.locator('#TxtPrm_Nomina_StrConceptoApoyoSostenimiento .dx-lookup-field').first(), 'El sistema no guard� el cambio').toHaveText(CONCEPTO_AUXILIO_ESPERADO);

            //Se restauran los valores
        await page.locator('#tabs_parametros_Nomina').first().click();
        await page.locator('#tabs_parametrosNom_General').first().click();
        await page.locator('#TxtPrm_Nomina_IntInTerValo .dx-radiobutton-icon').nth(3).click();
        await page.locator('#TxtPrm_Nomina_IntPeriodosNom .dx-texteditor-input').first().click();
        await page.keyboard.press('Backspace');
        await page.keyboard.press('Control+A');
        await escribir(page.locator('#TxtPrm_Nomina_IntPeriodosNom .dx-texteditor-input'), PERIODOS_NOM_RESTAURAR, { reemplazar: false });
        await page.locator('#TxtPrm_Nomina_IntDecimalesNom .dx-texteditor-input').first().click();
        await page.keyboard.press('Control+A');
        await page.keyboard.press('Backspace');
        await escribir(page.locator('#TxtPrm_Nomina_IntDecimalesNom .dx-texteditor-input'), DECIMALES_NOM_RESTAURAR, { reemplazar: false });
            //await page.locator('#TxtPrm_Nomina_IntPeriodosNom .dx-texteditor-input').first().click();
            //await page.locator('#txt_lista_NominaIntFormatoDocumentoNom .dx-lookup-field').first().dblclick();
        await page.waitForTimeout(2000);
        await page.locator('#txt_lista_NominaIntFormatoDocumentoNom .dx-lookup-field').first().click();
    await seleccionarOpcion(page, FORMATO_DOCUMENTO_RESTAURAR);
        await page.locator('#TxtPrm_Nomina_StrFormatoCantidadN .dx-texteditor-input').first().click();
        await page.keyboard.press('Control+A');
        await page.keyboard.press('Backspace');
        await escribir(page.locator('#TxtPrm_Nomina_StrFormatoCantidadN .dx-texteditor-input'), FORMATO_CANTIDAD_RESTAURAR, { reemplazar: false });
        await page.locator('#TxtPrm_Nomina_StrFormatoValorN .dx-texteditor-input').first().click();
        await page.keyboard.press('Control+A');
        await page.keyboard.press('Backspace');
        await escribir(page.locator('#TxtPrm_Nomina_StrFormatoValorN .dx-texteditor-input'), FORMATO_VALOR_RESTAURAR, { reemplazar: false });

        await page.locator('#tabs_parametrosNom_Conceptos').first().click();
        await page.locator('#txt_lista_NominaStrConceptoBasico .dx-lookup-field').first().click();

            await filtrarPor(page, FILTRO_SALARIO);
            await page.waitForTimeout(2000);
    await seleccionarOpcion(page, SALARIO_BASICO);
        await page.locator('#txt_lista_NominaStrConceptoBasicoTurno .dx-lookup-field').first().click();

            await filtrarPor(page, FILTRO_SALARIO);
            await page.waitForTimeout(2000);
    await seleccionarOpcion(page, SALARIO_BASICO);
        await page.locator('#txt_lista_NominaStrCHorasOD .dx-lookup-field').first().click();

            await filtrarPor(page, FILTRO_SALARIO);
            await page.waitForTimeout(2000);
    await seleccionarOpcion(page, SALARIO_BASICO);
        await page.locator('#txt_lista_NominaStrCHorasON .dx-lookup-field').first().click();

            await filtrarPor(page, FILTRO_GENERAL);
            await page.waitForTimeout(2000);
    await seleccionarOpcion(page, GENERAL);
        await page.locator('#txt_lista_NominaStrCHorasFD .dx-lookup-field').first().click();

            await filtrarPor(page, FILTRO_GENERAL);
            await page.waitForTimeout(2000);
    await seleccionarOpcion(page, GENERAL);
        await page.locator('#txt_lista_NominaStrCHorasFN .dx-lookup-field').first().click();

            await filtrarPor(page, FILTRO_GENERAL);
            await page.waitForTimeout(2000);
    await seleccionarOpcion(page, GENERAL);
        await page.locator('#txt_lista_NominaStrCHorasED .dx-lookup-field').first().click();

            await filtrarPor(page, FILTRO_HORAS_EXTRAS);
            await page.waitForTimeout(2000);
    await seleccionarOpcion(page, HORAS_EXTRAS);
        await page.locator('#txt_lista_NominaStrCHorasEN .dx-lookup-field').first().click();

            await filtrarPor(page, FILTRO_HORAS_EXTRAS);
            await page.waitForTimeout(2000);
    await seleccionarOpcion(page, HORAS_EXTRAS);
        await page.locator('#txt_lista_NominaStrCHorasEFD .dx-lookup-field').first().click();

            await filtrarPor(page, FILTRO_HORAS_EXTRAS);
            await page.waitForTimeout(2000);
    await seleccionarOpcion(page, HORAS_EXTRAS_FESTIVAS);
        await page.locator('#txt_lista_NominaStrCHorasEFN .dx-lookup-field').first().click();

            await filtrarPor(page, FILTRO_GENERAL);
            await page.waitForTimeout(2000);
    await seleccionarOpcion(page, GENERAL);
        await page.locator('#txt_lista_NominaStrConceptoCesantias .dx-lookup-field').first().click();

            await filtrarPor(page, FILTRO_CESANTIAS);
            await page.waitForTimeout(2000);
    await seleccionarOpcion(page, CESANTIAS);
        await page.locator('#txt_lista_NominaStrConceptoIntCesantias .dx-lookup-field').first().click();

            await filtrarPor(page, FILTRO_INTERESES_CESANTIAS);
            await page.waitForTimeout(2000);
    await seleccionarOpcion(page, INTERESES_CESANTIAS);
        await page.locator('#txt_lista_NominaStrConceptoPrima .dx-lookup-field').first().click();

            await filtrarPor(page, FILTRO_PRIMA);
            await page.waitForTimeout(2000);
    await seleccionarOpcion(page, PRIMA_SERVICIOS);
        await page.locator('#txt_lista_NominaStrConceptoVacaciones .dx-lookup-field').first().click();

            await filtrarPor(page, FILTRO_VACACIONES);
            await page.waitForTimeout(2000);
    await seleccionarOpcion(page, VACACIONES);
        await page.locator('#txt_lista_NominaStrConceptoVacacionesCom .dx-lookup-field').first().click();

            await filtrarPor(page, FILTRO_VACACIONES_COMP);
            await page.waitForTimeout(2000);
    await seleccionarOpcion(page, VACACIONES_COMPENSADAS);
        await page.locator('#TxtPrm_Nomina_StrConceptoApoyoSostenimiento .dx-lookup-field').first().click();

            await filtrarPor(page, FILTRO_SALARIO);
            await page.waitForTimeout(2000);
    await seleccionarOpcion(page, SALARIO_BASICO);
        await page.locator('#BtnGuardar span').filter({ hasText: 'Guardar' }).first().click();
        await page.locator('button').filter({ hasText: 'Aceptar' }).nth(1).click();
        await cerrarPestana360(page);
        await cerrarSesion360(page);
}

test.describe('4.Parametros-Nomina - Test Hgi360', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(testAdminConfig.pagina);
    });

    test('Prueba Parametros Nomina ERP POS - Test Hgi360', async ({ page }) => {
        await ejecutarPrueba4ParametrosNomina(page, testAdminConfig);
    });
});

test.describe('4.Parametros-Nomina - Hgi360 Admin', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(hgiAdminConfig.pagina);
    });

    test('Prueba Parametros Nomina ERP POS - Hgi360 Admin', async ({ page }) => {
        await ejecutarPrueba4ParametrosNomina(page, hgiAdminConfig);
    });
});
