import { test, expect } from '@playwright/test';
import {
    abrirHerramientas360,
    cerrarSesion360,
    ingresarAplicacion,
    seleccionarOpcion,
    cerrarPestana360,
    escribir
} from '../../../../Funciones/HelpersHgi360PW.js';
import { testAdminConfig, hgiAdminConfig } from '../../../../ParametrosPruebas/ParametrosPruebas.js';

const FORMATO_I_VALOR = 'n1';
const FORMATO_I_CANTIDAD = 'n2';
const FORMATO_I_PRECIO = 'n3';
const FORMATO_VALOR = 'n4';
const FORMATO_VALOR_D = 'n5';
const FORMATO_PRECIO = 'n6';
const FORMATO_CANTIDAD = 'n7';
const FORMATO_PORCENTAJE = 'n8';
const DECIMALES_ADM = 'n9';
const DECIMALES_ADM_D = '123456';
const DECIMALES_CANTIDAD = '03';
const DECIMALES_PORCENTAJE = '.2';
const MODO_CONTABLE_ESPERADO = 'Solo NIIF';
const FORMATO_PORCENTAJE_GUARDADO = 'p8';
const DECIMALES_ADM_GUARDADO = '9';
const DECIMALES_ADM_D_GUARDADO = '10';
const DECIMALES_PRECIO_GUARDADO = '0';
const DECIMALES_CANTIDAD_GUARDADO = '3';
const DECIMALES_PORCENTAJE_GUARDADO = '0';
const MENSAJE_GUARDADO = 'Registro almacenado correctamente.';
const FORMATO_I_VALOR_RESTAURAR = 'n2';
const FORMATO_PRECIO_RESTAURAR = 'n0';
const FORMATO_CANTIDAD_RESTAURAR = 'n0';
const FORMATO_PORCENTAJE_RESTAURAR = 'p2';
const DECIMALES_ADM_RESTAURAR = '0';
const DECIMALES_CANTIDAD_RESTAURAR = '0';
const DECIMALES_PORCENTAJE_RESTAURAR = '2';
const VALUACION_ESPERADA = 'Promedio ponderado';
const COSTEO_ESPERADO = 'Desactivo';
const DIAS_BLOQUEO = '30';
const CARTERA_FORMA_ESPERADA = 'Tipo';
const CONTROL_DIAS_ESPERADO = 'Bloqueo';
const DESC_SERIE = 'seriee';
const DESC_SERIE1 = 'seriee1';
const DESC_SERIE2 = 'seriee2';
const DESC_SERIE3 = 'seriee3';
const IVA_GENERAL = '19%';
const DESC_SERIE_RESTAURAR = 'Serie';
const DESC_SERIE1_RESTAURAR = 'Serie1';
const DESC_SERIE2_RESTAURAR = 'Serie2';
const DESC_SERIE3_RESTAURAR = 'Serie3';
const IVA_SIN = 'Sin Iva';

const ORDEN_NORMAL = ['Control+A', 'Backspace'];
const ORDEN_INVERTIDO = ['Backspace', 'Control+A'];

/**
 * Clic en el campo, pulsa las teclas indicadas y, si hay valor, lo escribe al final del contenido.
 * Sin valor solo deja el campo vacío.
 */
async function editarCampo(page, selector, valor, teclas = ORDEN_NORMAL) {
    await page.locator(selector).first().click();
    for (const tecla of teclas) {
        await page.keyboard.press(tecla);
    }
    if (valor !== undefined) {
        await escribir(page.locator(selector), valor, { reemplazar: false });
    }
}

async function ejecutarPruebaGeneral(page, config, ingresar) {
    await ingresar(page, config);
    await abrirHerramientas360(page, 'Parámetros');
    await page.waitForTimeout(2000);
    await page.locator('#BtnEditar span').filter({ hasText: 'Editar' }).first().click();
    await page.locator('#TxtPrm_General_IntModoGral .dx-radiobutton-icon').nth(1).click();
    await editarCampo(page, '#TxtPrm_General_StrFormatoIValor .dx-texteditor-input', FORMATO_I_VALOR);
    await editarCampo(page, '#TxtPrm_General_StrFormatoICantidad .dx-texteditor-input', FORMATO_I_CANTIDAD);
    await editarCampo(page, '#TxtPrm_General_StrFormatoIPrecio .dx-texteditor-input', FORMATO_I_PRECIO);
    await editarCampo(page, '#TxtPrm_AdminGeneral_StrFormatoValor .dx-texteditor-input', FORMATO_VALOR, ORDEN_INVERTIDO);
    await editarCampo(page, '#TxtPrm_AdminGeneral_StrFormatoValorD .dx-texteditor-input', FORMATO_VALOR_D);
    await editarCampo(page, '#TxtPrm_AdminGeneral_StrFormatoPrecio .dx-texteditor-input', FORMATO_PRECIO);
    await editarCampo(page, '#TxtPrm_AdminGeneral_StrFormatoCantidad .dx-texteditor-input', FORMATO_CANTIDAD);
    await editarCampo(page, '#TxtPrm_AdminGeneral_StrFormatoPorcentaje .dx-texteditor-input', FORMATO_PORCENTAJE);
    await editarCampo(page, '#TxtPrm_AdminGeneral_IntDecimalesAdm .dx-texteditor-input', DECIMALES_ADM);
    await editarCampo(page, '#TxtPrm_AdminGeneral_IntDecimalesAdmD .dx-texteditor-input', DECIMALES_ADM_D);
    //Campo int, por lo que si se inserta un valor no permitido el sistema guarda correctamentre pero le asigna un 0 por defecto
    await editarCampo(page, '#TxtPrm_AdminGeneral_IntDecimalesPrecio .dx-texteditor-input');
    //Campo se deja en vacío y el sistema le asigna un 0 por defecto
    await editarCampo(page, '#TxtPrm_AdminGeneral_IntDecimalesCan .dx-texteditor-input', DECIMALES_CANTIDAD);
    //Campo int, por lo que si se inserta un valor no permitido el sistema guarda correctamentre pero le asigna un 0 por defecto
    await editarCampo(page, '#TxtPrm_AdminGeneral_IntDecimalesPorcentaje .dx-texteditor-input', DECIMALES_PORCENTAJE);
    await page.locator('#TxtPrm_AdminGeneral_IntFormatoTerceroPuntos .dx-lookup-field').first().click();
    await page.locator('#BtnGuardar span').filter({ hasText: 'Guardar' }).first().click();
    await page.waitForTimeout(2000);
    await expect(page.locator('#swal2-content').first()).toHaveText(MENSAJE_GUARDADO);
    await page.locator('button').filter({ hasText: 'Aceptar' }).first().click();
    await page.waitForTimeout(2000);

    await cerrarPestana360(page);
    await abrirHerramientas360(page, 'Parámetros');
    await page.locator('#BtnEditar span').filter({ hasText: 'Editar' }).first().click();
    await page.waitForTimeout(2000);
    const modoContable = page.locator('#TxtPrm_General_IntModoGral [class^="dx-item dx-item-selected dx-radiobutton-checked dx"]');
    // Obtener el texto actual
    const textoActual = await modoContable.first().innerText();
    // Quitar un carácter específico (por ejemplo, eliminar un espacio)
    const textoModificado = textoActual.replace('\t\n', '');
    await page.waitForTimeout(2000);
    expect(textoModificado, 'El sistema no guardó los cambios').toEqual(MODO_CONTABLE_ESPERADO);
    await expect(page.locator('#TxtPrm_General_StrFormatoIValor .dx-texteditor-input').first(), 'El sistema no guardó el cambio').toHaveValue(FORMATO_I_VALOR);
    await expect(page.locator('#TxtPrm_General_StrFormatoICantidad .dx-texteditor-input').first(), 'El sistema no guardó el cambio').toHaveValue(FORMATO_I_CANTIDAD);
    await expect(page.locator('#TxtPrm_General_StrFormatoIPrecio .dx-texteditor-input').first(), 'El sistema no guardó el cambio').toHaveValue(FORMATO_I_PRECIO);
    await expect(page.locator('#TxtPrm_AdminGeneral_StrFormatoValor .dx-texteditor-input').first(), 'El sistema no guardó el cambio').toHaveValue(FORMATO_VALOR);
    await expect(page.locator('#TxtPrm_AdminGeneral_StrFormatoValorD .dx-texteditor-input').first(), 'El sistema no guardó el cambio').toHaveValue(FORMATO_VALOR_D);
    await expect(page.locator('#TxtPrm_AdminGeneral_StrFormatoPrecio .dx-texteditor-input').first(), 'El sistema no guardó el cambio').toHaveValue(FORMATO_PRECIO);
    await expect(page.locator('#TxtPrm_AdminGeneral_StrFormatoCantidad .dx-texteditor-input').first(), 'El sistema no guardó el cambio').toHaveValue(FORMATO_CANTIDAD);
    await expect(page.locator('#TxtPrm_AdminGeneral_StrFormatoPorcentaje .dx-texteditor-input').first(), 'El sistema no guardó el cambio').toHaveValue(FORMATO_PORCENTAJE_GUARDADO);
    await expect(page.locator('#TxtPrm_AdminGeneral_IntDecimalesAdm .dx-texteditor-input').first(), 'El sistema no guardó el cambio').toHaveValue(DECIMALES_ADM_GUARDADO);
    await expect(page.locator('#TxtPrm_AdminGeneral_IntDecimalesAdmD .dx-texteditor-input').first(), 'El sistema no guardó el cambio').toHaveValue(DECIMALES_ADM_D_GUARDADO);
    await expect(page.locator('#TxtPrm_AdminGeneral_IntDecimalesPrecio .dx-texteditor-input').first(), 'El sistema no guardó el cambio').toHaveValue(DECIMALES_PRECIO_GUARDADO);
    await expect(page.locator('#TxtPrm_AdminGeneral_IntDecimalesCan .dx-texteditor-input').first(), 'El sistema no guardó el cambio').toHaveValue(DECIMALES_CANTIDAD_GUARDADO);
    await expect(page.locator('#TxtPrm_AdminGeneral_IntDecimalesPorcentaje .dx-texteditor-input').first(), 'El sistema no guardó el cambio').toHaveValue(DECIMALES_PORCENTAJE_GUARDADO);

    await cerrarPestana360(page);
    await abrirHerramientas360(page, 'Parámetros');
    await page.locator('#BtnEditar span').filter({ hasText: 'Editar' }).first().click();
    await page.locator('#TxtPrm_General_IntModoGral .dx-radiobutton-icon').nth(1).click();
    await editarCampo(page, '#TxtPrm_General_StrFormatoIValor .dx-texteditor-input', FORMATO_I_VALOR_RESTAURAR);
    await editarCampo(page, '#TxtPrm_General_StrFormatoICantidad .dx-texteditor-input', FORMATO_I_CANTIDAD);
    await editarCampo(page, '#TxtPrm_General_StrFormatoIPrecio .dx-texteditor-input', FORMATO_I_VALOR_RESTAURAR);
    await editarCampo(page, '#TxtPrm_AdminGeneral_StrFormatoValor .dx-texteditor-input', FORMATO_I_VALOR_RESTAURAR, ORDEN_INVERTIDO);
    await editarCampo(page, '#TxtPrm_AdminGeneral_StrFormatoValorD .dx-texteditor-input', FORMATO_I_VALOR_RESTAURAR);
    await editarCampo(page, '#TxtPrm_AdminGeneral_StrFormatoPrecio .dx-texteditor-input', FORMATO_PRECIO_RESTAURAR);
    await editarCampo(page, '#TxtPrm_AdminGeneral_StrFormatoCantidad .dx-texteditor-input', FORMATO_CANTIDAD_RESTAURAR);
    await editarCampo(page, '#TxtPrm_AdminGeneral_StrFormatoPorcentaje .dx-texteditor-input', FORMATO_PORCENTAJE_RESTAURAR);
    await editarCampo(page, '#TxtPrm_AdminGeneral_IntDecimalesAdm .dx-texteditor-input', DECIMALES_ADM_RESTAURAR);
    await editarCampo(page, '#TxtPrm_AdminGeneral_IntDecimalesAdmD .dx-texteditor-input', DECIMALES_ADM_RESTAURAR);
    await editarCampo(page, '#TxtPrm_AdminGeneral_IntDecimalesPrecio .dx-texteditor-input');
    await editarCampo(page, '#TxtPrm_AdminGeneral_IntDecimalesCan .dx-texteditor-input', DECIMALES_CANTIDAD_RESTAURAR);
    await editarCampo(page, '#TxtPrm_AdminGeneral_IntDecimalesPorcentaje .dx-texteditor-input', DECIMALES_PORCENTAJE_RESTAURAR);
    await page.locator('#BtnGuardar span').filter({ hasText: 'Guardar' }).first().click();
    await page.waitForTimeout(2000);
    await expect(page.locator('#swal2-content').first()).toHaveText(MENSAJE_GUARDADO);
    await page.locator('button').filter({ hasText: 'Aceptar' }).first().click();
    await cerrarPestana360(page);
    await cerrarSesion360(page);
}

async function ejecutarPruebaInventario(page, config, ingresar) {
    await ingresar(page, config);
    await abrirHerramientas360(page, 'Parámetros');
    await page.waitForTimeout(2000);
    await page.locator('#tabs_parametrosAdmin_Inventarios').first().click();
    await page.waitForTimeout(2000);
    await page.locator('#BtnEditar .dx-icon.dx-icon-edit').first().click();
    await page.waitForTimeout(4000);
    //Inventarios
    const kardex = page.locator('#TxtParametrosGenerales_KardexPorDefecto');
    const kardexIsChecked = await kardex.first().getAttribute('aria-checked');

    if (kardexIsChecked === 'false') {
        await kardex.first().click();
    }

    const entradas = page.locator('#TxtParametrosGenerales_PrimeroEntradas');
    const entradasIsChecked = await entradas.first().getAttribute('aria-checked');

    if (entradasIsChecked === 'false') {
        await entradas.first().click();
    }

    //await page.locator('#TxtParametrosGenerales_Saldos .dx-checkbox-icon').first().click();
    //await page.locator('#TxtParametrosGenerales_ValidaCosteoSalidas .dx-checkbox-icon').first().click();
    //Valuación
    await page.locator('#TxtParametrosGenerales_Valuacion .dx-radiobutton-icon').first().click();
    //await page.locator('#TxtParametrosGenerales_Valuacion .dx-radiobutton-icon').nth(1).click();
    //Costeo
    await page.locator('#TxtParametrosGenerales_Costeo .dx-radiobutton-icon').first().click();
    //await page.locator('#TxtParametrosGenerales_Costeo .dx-radiobutton-icon').nth(1).click();
    //await page.locator('#TxtParametrosGenerales_Costeo .dx-radiobutton-icon').nth(2).click();
    //Costeo
    const descuento = page.locator('#TxtParametrosGenerales_IncluyeDescuento');
    const descuentoIsChecked = await descuento.first().getAttribute('aria-checked');

    if (descuentoIsChecked === 'false') {
        await descuento.first().click();
    }
    /*
    if (!(await page.locator('#TxtParametrosGenerales_IncluyeDescuento .dx-checkbox-icon').first().getAttribute('aria-checked'))) {
        await page.locator('#TxtParametrosGenerales_IncluyeDescuento .dx-checkbox-icon').first().click();
    }
    await page.locator('#TxtParametrosGenerales_IncluyeDescuento .dx-checkbox-icon').first().click();
    await page.locator('#TxtParametrosGenerales_IncluyeDescuento .dx-checkbox-icon').first().click();
    //await page.locator('#TxtParametrosGenerales_PorDivision .dx-checkbox-icon').first().click();
    //await page.locator('#TxtParametrosGenerales_UtilidadVenta .dx-checkbox-icon').first().click();
    //await page.locator('#TxtParametrosGenerales_UtilidadVenta .dx-checkbox-icon').first().click();
    */
    await page.waitForTimeout(3000);
    await page.locator('#BtnGuardar div').filter({ hasText: 'Guardar' }).first().click();
    await page.locator('button').filter({ hasText: 'Aceptar' }).first().click();
    await page.waitForTimeout(2000);

    await cerrarPestana360(page);
    await abrirHerramientas360(page, 'Parámetros');
    await page.locator('#tabs_parametrosAdmin_Inventarios').first().click();
    await page.waitForTimeout(2000);
    await page.locator('#BtnEditar .dx-icon.dx-icon-edit').first().click();
    await page.waitForTimeout(2000);
    //Inventarios
    await expect(page.locator('#TxtParametrosGenerales_KardexPorDefecto').first(), 'El sistema no guardó el cambio').toHaveAttribute('aria-checked', 'true');
    await expect(page.locator('#TxtParametrosGenerales_PrimeroEntradas').first(), 'El sistema no guardó el cambio').toHaveAttribute('aria-checked', 'true');
    //await page.locator('#TxtParametrosGenerales_KardexPorDefecto .dx-checkbox-icon').first().click();
    //await page.locator('#TxtParametrosGenerales_PrimeroEntradas .dx-checkbox-icon').first().click();
    //await page.locator('#TxtParametrosGenerales_Saldos .dx-checkbox-icon').first().click();
    //await page.locator('#TxtParametrosGenerales_ValidaCosteoSalidas .dx-checkbox-icon').first().click();
    //Valuación
    const valuacion = page.locator('#TxtParametrosGenerales_Valuacion [class^="dx-item dx-item-selected dx-radiobutton-checked dx"]');
    // Obtener el texto actual
    const textoActual = await valuacion.first().innerText();
    // Quitar un carácter específico (por ejemplo, eliminar un espacio)
    const textoModificado = textoActual.replace('\t\n', '');
    expect(textoModificado, 'El sistema no guardó los cambios').toEqual(VALUACION_ESPERADA);
    //Costeo
    const costeo = page.locator('#TxtParametrosGenerales_Costeo [class^="dx-item dx-item-selected dx-radiobutton-checked dx"]');
    // Obtener el texto actual
    const textoActualcosteo = await costeo.first().innerText();
    // Quitar un carácter específico (por ejemplo, eliminar un espacio)
    const textoModificado2 = textoActualcosteo.replace('\t\n', '');
    expect(textoModificado2, 'El sistema no guardó los cambios').toEqual(COSTEO_ESPERADO);
    //Costeo
    await expect(page.locator('#TxtParametrosGenerales_IncluyeDescuento').first(), 'El sistema no guardó el cambio').toHaveAttribute('aria-checked', 'true');
    await cerrarPestana360(page);
    await cerrarSesion360(page);
}

async function ejecutarPruebaCartera(page, config, ingresar) {
    await ingresar(page, config);
    await abrirHerramientas360(page, 'Parámetros');
    await page.locator('#tabs_parametros_Admin').first().click();
    await page.locator('#tabs_parametrosAdmin_Cartera').first().click();
    await page.locator('#BtnEditar div').filter({ hasText: 'Editar' }).first().click();
    await page.waitForTimeout(2000);
    //FormaCxC
    await page.locator('#TxtParametrosGenerales_CarteraFormaCxC .dx-radiobutton-icon').first().click();
    await page.locator('#TxtParametrosGenerales_CarteraFormaCxC .dx-radiobutton-icon').nth(1).click();
    await page.locator('#TxtParametrosGenerales_CarteraFormaCxC .dx-radio-value-container').nth(2).click();
    await page.locator('#TxtParametrosGenerales_CarteraFormaCxC .dx-radiobutton-icon').nth(3).click();
    //Control dias
    await page.locator('#TxtParametrosGenerales_ControlDias .dx-radiobutton-icon').first().click();
    await page.locator('#TxtParametrosGenerales_ControlDias .dx-radiobutton-icon').nth(1).click();
    await page.locator('#TxtParametrosGenerales_ControlDias .dx-radiobutton-icon').nth(2).click();
    //FormaCxP
    await page.locator('#TxtParametrosGenerales_CarteraFormaCxP .dx-radiobutton-icon').first().click();
    await page.locator('#TxtParametrosGenerales_CarteraFormaCxP .dx-radiobutton-icon').nth(1).click();
    await page.locator('#TxtParametrosGenerales_CarteraFormaCxP .dx-radiobutton-icon').nth(2).click();
    await page.locator('#TxtParametrosGenerales_CarteraFormaCxP .dx-radiobutton-icon').nth(3).click();
    //Dias Bloqueo
    await editarCampo(page, '#TxtParametrosGenerales_DiasBloqueo .dx-texteditor-input', DIAS_BLOQUEO);
    await page.locator('#BtnGuardar span').filter({ hasText: 'Guardar' }).first().click();
    await page.locator('button').filter({ hasText: 'Aceptar' }).first().click();
    await page.waitForTimeout(2000);

    await cerrarPestana360(page);
    await abrirHerramientas360(page, 'Parámetros');
    await page.locator('#tabs_parametros_Admin').first().click();
    await page.locator('#tabs_parametrosAdmin_Cartera').first().click();
    await page.locator('#BtnEditar div').filter({ hasText: 'Editar' }).first().click();
    await page.waitForTimeout(2000);
    //
    await expect(page.locator('[class^="dx-item dx-item-selected dx-radiobutton-checked dx"]').nth(3).locator('.dx-item-content').first(), 'no guardó').toHaveText(CARTERA_FORMA_ESPERADA);
    await expect(page.locator('[class^="dx-item dx-item-selected dx-radiobutton-checked dx"]').nth(4).locator('.dx-item-content').first(), 'no guardó').toHaveText(CARTERA_FORMA_ESPERADA);
    await expect(page.locator('[class^="dx-item dx-item-selected dx-radiobutton-checked dx"]').nth(5).locator('.dx-item-content').first(), 'no guardó').toHaveText(CONTROL_DIAS_ESPERADO);
    await expect(page.locator('#TxtParametrosGenerales_DiasBloqueo .dx-texteditor-input').first(), 'No guardó').toHaveValue(DIAS_BLOQUEO);
    //'Restaurar Parametros Generales - Cartera'
    await page.locator('#tabs_parametros_Admin').first().click();
    await page.locator('#tabs_parametrosAdmin_Cartera').first().click();
    await page.locator('#TxtParametrosGenerales_CarteraFormaCxC .dx-radiobutton-icon').nth(1).click();
    await page.locator('#TxtParametrosGenerales_CarteraFormaCxP .dx-radiobutton-icon').first().click();
    await page.locator('#TxtParametrosGenerales_ControlDias .dx-radiobutton-icon').first().click();
    await editarCampo(page, '#TxtParametrosGenerales_DiasBloqueo .dx-texteditor-input', DIAS_BLOQUEO);
    await page.locator('#BtnGuardar span').filter({ hasText: 'Guardar' }).first().click();
    await page.locator('button').filter({ hasText: 'Aceptar' }).first().click();
    await page.waitForTimeout(2000);
    await cerrarPestana360(page);
    await cerrarSesion360(page);
}

async function ejecutarPruebaDocumentos(page, config, ingresar) {
    await ingresar(page, config);
    await abrirHerramientas360(page, 'Parámetros');
    await page.locator('#tabs_parametros_Admin').first().click();
    await page.locator('#tabs_parametrosAdmin_Documentos').first().click();
    await page.locator('#BtnEditar div').filter({ hasText: 'Editar' }).first().click();
    await page.waitForTimeout(2000);
    ///await page.locator('#tabs_parametros_Admin').first().click();
    await page.locator('#TxtParametrosGenerales_IntDescLista .dx-checkbox-icon').first().click();
    await editarCampo(page, '#TxtParametrosGenerales_StrDescSerie .dx-texteditor-input', DESC_SERIE);
    await editarCampo(page, '#TxtParametrosGenerales_StrDescSerie1 .dx-texteditor-input', DESC_SERIE1);
    await editarCampo(page, '#TxtParametrosGenerales_StrDescSerie2 .dx-texteditor-input', DESC_SERIE2, ORDEN_INVERTIDO);
    await editarCampo(page, '#TxtParametrosGenerales_StrDescSerie3 .dx-texteditor-input', DESC_SERIE3);
    await page.locator('#TxtParametrosGenerales_StrIvaGeneral .dx-lookup-field').first().click();
    await page.locator('.dx-overlay-content .dx-list-item').filter({ hasText: IVA_GENERAL }).nth(0).click();
    await page.locator('#BtnGuardar span').filter({ hasText: 'Guardar' }).first().click();
    await page.locator('button').filter({ hasText: 'Aceptar' }).first().click();
    await page.waitForTimeout(2000);

    await cerrarPestana360(page);
    await abrirHerramientas360(page, 'Parámetros');
    await page.locator('#tabs_parametros_Admin').first().click();
    await page.locator('#tabs_parametrosAdmin_Documentos').first().click();
    await page.locator('#BtnEditar div').filter({ hasText: 'Editar' }).first().click();
    await page.waitForTimeout(2000);
    await expect(page.locator('#TxtParametrosGenerales_StrDescSerie .dx-texteditor-input').first(), 'El sistema no guardó el cambio').toHaveValue(DESC_SERIE);
    await expect(page.locator('#TxtParametrosGenerales_StrDescSerie1 .dx-texteditor-input').first(), 'El sistema no guardó el cambio').toHaveValue(DESC_SERIE1);
    await expect(page.locator('#TxtParametrosGenerales_StrDescSerie2 .dx-texteditor-input').first(), 'El sistema no guardó el cambio').toHaveValue(DESC_SERIE2);
    await expect(page.locator('#TxtParametrosGenerales_StrDescSerie3 .dx-texteditor-input').first(), 'El sistema no guardó el cambio').toHaveValue(DESC_SERIE3);

    await page.locator('#tabs_parametros_Admin').first().click();
    await page.locator('#tabs_parametrosAdmin_Documentos').first().click();
    //'Restaurar Parametros Generales - Documentos'
    await page.locator('#TxtParametrosGenerales_IntDescLista .dx-checkbox-icon').first().click();
    await editarCampo(page, '#TxtParametrosGenerales_StrDescSerie .dx-texteditor-input', DESC_SERIE_RESTAURAR);
    await editarCampo(page, '#TxtParametrosGenerales_StrDescSerie1 .dx-texteditor-input', DESC_SERIE1_RESTAURAR);
    await editarCampo(page, '#TxtParametrosGenerales_StrDescSerie2 .dx-texteditor-input', DESC_SERIE2_RESTAURAR, ORDEN_INVERTIDO);
    await editarCampo(page, '#TxtParametrosGenerales_StrDescSerie3 .dx-texteditor-input', DESC_SERIE3_RESTAURAR);
    await page.locator('#TxtParametrosGenerales_StrIvaGeneral .dx-lookup-field').first().click();
    await page.locator('.dx-overlay-content .dx-list-item').filter({ hasText: IVA_SIN }).nth(0).click();
    await page.locator('#BtnGuardar span').filter({ hasText: 'Guardar' }).first().click();
    await page.locator('button').filter({ hasText: 'Aceptar' }).first().click();
    await page.waitForTimeout(2000);
    await cerrarPestana360(page);
    await cerrarSesion360(page);
}

test.describe('Prueba Parametros Generales - Test Hgi360', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(testAdminConfig.pagina);
    });

    test('Prueba Parametros General - General - Test Hgi360', async ({ page }) => {
        await ejecutarPruebaGeneral(page, testAdminConfig, ingresarAplicacion);
    });

    test('Prueba Parametros Generales - Inventario - Test Hgi360', async ({ page }) => {
        await ejecutarPruebaInventario(page, testAdminConfig, ingresarAplicacion);
    });

    test('Prueba Parámetros Generales - Cartera - Test Hgi360', async ({ page }) => {
        await ejecutarPruebaCartera(page, testAdminConfig, ingresarAplicacion);
    });

    test('Prueba Parámetros Generales - Documentos - Test Hgi360', async ({ page }) => {
        await ejecutarPruebaDocumentos(page, testAdminConfig, ingresarAplicacion);
    });
});

test.describe('Prueba Parametros Generales - Hgi360 Admin', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(hgiAdminConfig.pagina);
    });

    test('Prueba Parametros General - General - Hgi360 Admin', async ({ page }) => {
        await ejecutarPruebaGeneral(page, hgiAdminConfig, ingresarAplicacion);
    });

    test('Prueba Parametros Generales - Inventario - Hgi360 Admin', async ({ page }) => {
        await ejecutarPruebaInventario(page, hgiAdminConfig, ingresarAplicacion);
    });

    test('Prueba Parámetros Generales - Cartera - Hgi360 Admin', async ({ page }) => {
        await ejecutarPruebaCartera(page, hgiAdminConfig, ingresarAplicacion);
    });

    test('Prueba Parámetros Generales - Documentos - Hgi360 Admin', async ({ page }) => {
        await ejecutarPruebaDocumentos(page, hgiAdminConfig, ingresarAplicacion);
    });
});
