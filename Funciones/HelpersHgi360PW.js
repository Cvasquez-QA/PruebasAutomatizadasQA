import path from 'path';
import { expect, test } from '@playwright/test';

/**
 * Helpers Playwright para mi.hgi360.com (ERP web en React).
 * Equivalen a HelpersHgi360Web.js (TestCafe) y reciben `page` en lugar de `t`.
 * Usan los selectores de esa versión: data-testid en los grids, aria-label
 * en las acciones de fila, placeholders en el login y el menú lateral
 * #ErpSidebarModulos. No entran a iframes de pestaña.
 */

/* ----------------------------- utilidades ----------------------------- */

export const escaparRegex = texto => String(texto).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** RegExp para comparar el texto completo de un elemento (equivale a withExactText de TestCafe). */
export const textoExacto = texto => new RegExp(`^\\s*${escaparRegex(texto)}\\s*$`);

/** true si el locator aparece en el DOM antes de `timeout` ms. */
export const existe = async (locator, timeout = 0) => {
    if (!timeout) return (await locator.count()) > 0;
    return locator.first().waitFor({ state: 'attached', timeout }).then(() => true, () => false);
};

/** true si el locator está visible antes de `timeout` ms. */
export const esVisible = async (locator, timeout = 0) => {
    if (!timeout) return locator.first().isVisible();
    return locator.first().waitFor({ state: 'visible', timeout }).then(() => true, () => false);
};

/**
 * Escribe en un campo. Por defecto reemplaza el contenido (como typeText con replace: true);
 * con { reemplazar: false } agrega el texto al final.
 */
export const escribir = async (locator, texto, { reemplazar = true } = {}) => {
    const campo = locator.first();
    await campo.click();
    if (reemplazar) {
        await campo.press('Control+A');
        await campo.press('Backspace');
    } else {
        await campo.press('End');
    }
    await campo.pressSequentially(String(texto));
};

/** Ruta absoluta de un archivo relativo al archivo de prueba en ejecución (como setFilesToUpload). */
export const rutaArchivo = relativa => path.resolve(path.dirname(test.info().file), relativa);

/* ------------------------------ selectores ----------------------------- */

const selectorGrid = (page, gridId) => {
    const id = String(gridId).replace(/^#/, '');
    return page.locator(`[data-testid="${id}"]`).filter({ visible: true });
};

/** Confirmación del aviso nuevo (SweetAlert): el botón de la acción, p. ej. Eliminar. */
export const btnConfirmarDialogo = page => page.locator('button.swal2-confirm').filter({ visible: true });

export const filtrarPorInput = page => page.locator('.dx-overlay-content')
    .filter({ visible: true })
    .locator('.dx-texteditor-input');

export const TX_DOCUMENTO = '01FE';
export const TX_DOCUMENTO_TEXTO = '01FE - PRUEBA FACTURA DE VENTA ELECTRONICA QA';
export const TERCERO = '1000099598';
// El nombre está guardado con doble espacio entre "Vasquez" y "Suarez"; así se muestra en los combos.
export const TERCERO_TEXTO = '1000099598 - Vasquez  Suarez Camilo';
export const PRODUCTO = '010203';

export const filtrarPor = async (page, texto) => {
    await filtrarPorInput(page).first().pressSequentially(String(texto));
    await page.waitForTimeout(2000);
};

export const selectorOpcion = (page, texto) => page.locator('.dx-overlay-content')
    .filter({ visible: true })
    .locator('.dx-item-content')
    .filter({ hasText: texto });

export const seleccionarOpcion = async (page, texto) => {
    await selectorOpcion(page, texto).first().click();
};

/* -------------------------------- grids -------------------------------- */

/** Fila del grid cuya celda tiene exactamente el texto indicado. */
export const filaGrid360 = (page, gridId, texto) =>
    selectorGrid(page, gridId)
        .locator('tr.dx-data-row')
        .filter({ has: page.locator('td').filter({ hasText: textoExacto(texto) }) });

/** Escribe en el buscador general del grid ("Buscar..."). */
export const buscarEnGrid360 = async (page, gridId, texto) => {
    const grid = selectorGrid(page, gridId);
    const campo = grid.locator('.dx-datagrid-search-panel .dx-texteditor-input');

    await expect(grid.first(), `No apareció el grid ${gridId}`).toBeAttached({ timeout: 15000 });
    await expect(campo.first(), `No apareció el buscador del grid ${gridId}`).toBeAttached({ timeout: 10000 });
    await escribir(campo, texto);
};

/** Clic en el botón Nuevo del maestro abierto (#BtnNuevo<Maestro>). */
export const nuevoRegistroGrid360 = async (page, gridId) => {
    const btnNuevo = page.locator('[id^="BtnNuevo"]').filter({ visible: true });
    const esqueleto = page.locator('.erp-page-skeleton-toolbar').filter({ visible: true });

    await expect(btnNuevo.first(), `No apareció el botón Nuevo del maestro (${gridId})`)
        .toBeAttached({ timeout: 15000 });
    const inicio = Date.now();
    while (await existe(esqueleto) && Date.now() - inicio < 8000) {
        await page.waitForTimeout(400);
    }
    await page.evaluate(() => {
        document.querySelectorAll('.erp-page-skeleton-toolbar').forEach(nodo => nodo.remove());
        const btn = document.querySelector('[id^="BtnNuevo"]');
        if (btn) btn.click();
    });
};

/** Clic en una acción de la fila: 'Editar' | 'Eliminar' | 'Ver'. */
export const accionFilaGrid360 = async (page, gridId, texto, accion) => {
    const fila = filaGrid360(page, gridId, texto);
    const boton = fila.locator(`[aria-label="${accion}"]`);

    await expect(fila.first(), `No se encontró la fila "${texto}" en ${gridId}`).toBeAttached({ timeout: 15000 });
    await expect(boton.first(), `No apareció la acción "${accion}" en la fila "${texto}"`)
        .toBeAttached({ timeout: 10000 });
    await boton.first().click();
};

/** Elimina la fila indicada y valida que desaparezca. */
export const eliminarFilaGrid360 = async (page, gridId, texto) => {
    await accionFilaGrid360(page, gridId, texto, 'Eliminar');
    await btnConfirmarDialogo(page).first().click({ timeout: 10000 });
    await expect(filaGrid360(page, gridId, texto), `La fila "${texto}" sigue en ${gridId} después de eliminarla`)
        .toHaveCount(0, { timeout: 15000 });
};

/** Busca el registro en el grid y lo elimina solo si existe. */
export const eliminarFilaSiExiste360 = async (page, gridId, texto) => {
    await buscarEnGrid360(page, gridId, texto);
    if (await existe(filaGrid360(page, gridId, texto), 4000)) {
        await eliminarFilaGrid360(page, gridId, texto);
    }
};

/** Elimina la primera fila visible del grid y confirma el aviso. */
export const eliminarRegistroDesdeGrid = async (page, gridId) => {
    const boton = selectorGrid(page, gridId).locator('[aria-label="Eliminar"]').filter({ visible: true });

    await expect(boton.first(), `No apareció Eliminar en ${gridId}`).toBeAttached({ timeout: 10000 });
    await boton.first().click();
    await btnConfirmarDialogo(page).first().click({ timeout: 10000 });
};

/** Busca el código en el grid y elimina la fila si existe. */
export const eliminarRegistroSiExiste = eliminarFilaSiExiste360;

/** Escribe una fecha (yyyy-MM-dd) en un DateBox y la confirma con Enter. */
export const escribirFecha360 = async (page, contenedor, fecha) => {
    const input = page.locator(`${contenedor} .dx-texteditor-input`).first();
    await escribir(input, fecha);
    await input.press('Enter');
    await expect(input, `No quedó la fecha ${fecha} en ${contenedor}`).toHaveValue(fecha);
};

/* -------------------------------- menús -------------------------------- */

export const verMasProductos360 = async page => {
    await page.locator('.erp-menu-card-vermas').nth(0).click();
};

export const verMasTerceros360 = async page => {
    await page.locator('.erp-menu-card-vermas').nth(1).click();
};

export const verMasLocalizacion360 = async page => {
    await page.locator('.erp-menu-card-vermas').nth(2).click();
};

export const verMasImpuestos360 = async page => {
    await page.locator('.erp-menu-card-vermas').nth(3).click();
};

const abrirMenu360 = async (page, modulo, opcion) => {
    await page.locator('#ErpSidebarModulos span').filter({ hasText: modulo }).first().click();
    await page.locator('#ErpMenuCardGrid span').filter({ hasText: opcion }).first().click();
    await page.waitForTimeout(1500);
};

/**
 * Abre un maestro del menú lateral.
 * grupo (opcional): 'productos' | 'terceros' | 'localizacion' | 'impuestos'
 */
export const abrirMaestros360 = async (page, nombreMaestro, grupo = null) => {
    await page.locator('#ErpSidebarModulos span').filter({ hasText: 'Maestros' }).first().click();

    const opcionMenu = page.locator('#ErpMenuCardGrid .erp-menu-child-text')
        .filter({ hasText: textoExacto(nombreMaestro), visible: true });

    const yaVisible = await existe(opcionMenu, 2000);

    if (!yaVisible && grupo) {
        if (grupo === 'productos') {
            await verMasProductos360(page);
        } else if (grupo === 'terceros') {
            await verMasTerceros360(page);
        } else if (grupo === 'localizacion') {
            await verMasLocalizacion360(page);
        } else if (grupo === 'impuestos') {
            await verMasImpuestos360(page);
        }
        await page.waitForTimeout(1500);
    }

    await expect(opcionMenu.first(),
        `No se encontró el maestro "${nombreMaestro}" en el menú (grupo=${grupo || 'ninguno'})`
    ).toBeAttached({ timeout: 8000 });
    await opcionMenu.first().click();
    await page.waitForTimeout(1500);
};

export const abrirMovimientos360 = async (page, nombreMovimiento) => {
    await abrirMenu360(page, 'Movimientos', nombreMovimiento);
};

export const abrirMovimiento360 = abrirMovimientos360;

export const abrirHerramientas360 = async (page, nombreHerramienta) => {
    await abrirMenu360(page, 'Herramientas', nombreHerramienta);
};

export const abrirProcesos360 = async (page, nombreProceso) => {
    await abrirMenu360(page, 'Procesos', nombreProceso);
};

export const abrirReportes360 = async (page, nombreReporte) => {
    await abrirMenu360(page, 'Reportes', nombreReporte);
};

export const abrirUtilitarios360 = async (page, nombreUtilitario) => {
    await abrirMenu360(page, 'Utilitarios', nombreUtilitario);
};

export const abrirNominaE360 = async (page, nombreOpcion) => {
    await abrirMenu360(page, 'NominaE', nombreOpcion);
};

export const abrirAyuda360 = async (page, nombreOpcion) => {
    await abrirMenu360(page, 'Ayuda', nombreOpcion);
};

export const abrirIA360 = async (page, nombreOpcion) => {
    await abrirMenu360(page, 'IA', nombreOpcion);
};

/* ------------------------------- avisos -------------------------------- */

export async function confirmarProceso(page) {
    if (await esVisible(btnConfirmarDialogo(page))) {
        await btnConfirmarDialogo(page).first().click();
        await page.waitForTimeout(1500);
    }
}

export async function aceptarValidacionesSiExisten(page) {
    await confirmarProceso(page);
    await confirmarProceso(page);
}

/* ------------------------------- valores ------------------------------- */

export const castearValorEntero = valor => {
    const limpio = String(valor ?? '').replace(/[$\s]/g, '');
    const parteEntera = limpio.split(',')[0].replace(/\./g, '').trim();
    return parseInt(parteEntera, 10) || 0;
};

export const parseTextoNumerico = texto => castearValorEntero(texto);

/** Lee el valor numérico de un input (o su texto) y lo convierte a entero. */
export const parseValorNumerico = async (page, selector) => {
    const elemento = page.locator(selector).first();
    const valor = await elemento.evaluate(el => ('value' in el ? el.value : ''));
    if (valor !== undefined && valor !== null && String(valor).trim() !== '') {
        return castearValorEntero(valor);
    }
    return castearValorEntero(await elemento.innerText());
};

/* ------------------------------- sesión -------------------------------- */

export const cerrarPestana360 = async page => {
    await page.locator('#TabsMenu .dx-icon.dx-icon-close.erp-tab-close').first().click();
};

export const cerrarSesion360 = async page => {
    await page.locator('#divpanelmaster .dropdown-toggle.erp-user-trigger').first().click();
    await page.locator('#divpanelmaster span').filter({ hasText: 'Cerrar sesión' }).first().click();
};

export const ingresarAplicacion = async (page, config) => {
    await page.waitForTimeout(2000);
    const empresa = page.locator('input.dx-texteditor-input[placeholder="Identificación Empresa"]');
    const usuario = page.locator('input.dx-texteditor-input[placeholder="Usuario"]');
    const clave = page.locator('input.dx-texteditor-input[placeholder="Contraseña"]');

    await expect(empresa, 'No apareció el campo Empresa en el login').toBeAttached({ timeout: 15000 });
    await empresa.fill(String(config.empresa));
    await page.waitForTimeout(1000);
    await usuario.fill(String(config.usuario));
    await page.waitForTimeout(1000);
    await clave.fill(String(config.clave));
    await page.waitForTimeout(1000);
    await page.locator('#buttonAutenticar').click();
    await page.waitForTimeout(3000);
};

/* ----------------------------- documentos ------------------------------ */

/** Abre Movimientos > Documentos, pulsa Nuevo y elige la transacción TX_DOCUMENTO. */
const abrirNuevoDocumento360 = async page => {
    await abrirMovimientos360(page, 'Documentos');
    await expect(page.locator('.erp-page-skeleton-toolbar').filter({ visible: true })).toHaveCount(0, { timeout: 20000 });
    await page.locator('#BtnNuevoDocumento').filter({ visible: true }).first().click();
    await expect(page.locator('#Documento_Transaccion .dx-lookup-field').first(), 'No se abrió el formulario de documentos')
        .toBeVisible({ timeout: 15000 });
    await page.locator('#Documento_Transaccion .dx-lookup-field').first().click();
    await filtrarPor(page, TX_DOCUMENTO);
    await seleccionarOpcion(page, TX_DOCUMENTO_TEXTO);
};

export const eliminarDocumento360 = async (page, numeroDocumento) => {
    await abrirNuevoDocumento360(page);
    const numero = page.locator('#txtDocumento .dx-texteditor-input').first();
    await escribir(numero, numeroDocumento);
    await numero.press('Enter');
    await page.waitForTimeout(3000);
    await expect(page.locator('#Documento_Tercero').filter({ hasText: TERCERO }).first(),
        `No cargó el documento ${numeroDocumento} para eliminarlo`).toBeAttached();
    await page.locator('#BtnEliminarDocumento_btn').first().click();
    await btnConfirmarDialogo(page).first().click({ timeout: 10000 });
    await page.waitForTimeout(3000);
};

export const crearDocumento360 = async page => {
    await abrirNuevoDocumento360(page);
    await page.locator('#Documento_Tercero .dx-lookup-field').first().click();
    await filtrarPor(page, TERCERO);
    // Por el código: el nombre trae doble espacio y según el combo se ve con uno o con dos
    await seleccionarOpcion(page, new RegExp(`^\\s*${TERCERO} -`));

    // Encabezado
    await page.locator('#BtnGuardarDocumento_btn').first().click();
    await page.waitForTimeout(3000);

    // Detalle: producto, cantidad 1, valor unitario 1000.
    // Al confirmar el producto la app lo carga (~0,7 s), reinicia cantidad/valor y pasa el foco a Remesa:
    // se espera eso antes de escribir cantidad y valor.
    const producto = page.locator('#txtDocumento_Detalle_Producto_cursor_1');
    await escribir(producto, PRODUCTO);
    await producto.press('Enter');
    await expect(page.locator('#txtDocumento_Detalle_Producto_Remesa_1'), `No terminó de cargar el producto ${PRODUCTO}`)
        .toBeFocused({ timeout: 10000 });
    await page.waitForTimeout(500);
    await escribir(page.locator('#txtDocumento_Detalle_Cantidad_cursor_1'), '1');
    await escribir(page.locator('#txtDocumento_Detalle_ValorUnitario_cursor_1'), '1000');
    await page.locator('#txtDocumento_Detalle_Boton_1 .dx-icon-save').first().click();

    // El total se recalcula entre 2 y 5 s después de grabar la línea
    let valorDocumento = 0;
    for (const inicio = Date.now(); valorDocumento <= 0 && Date.now() - inicio < 15000;) {
        await page.waitForTimeout(500);
        valorDocumento = await parseValorNumerico(page, '#txtDocumento_Total .dx-texteditor-input');
    }
    expect(valorDocumento, 'El total del documento quedó en 0').toBeGreaterThan(0);

    await page.locator('#BtnGuardarDocumento_btn').first().click();
    await page.waitForTimeout(4000);

    const numeroDocumento = await page.locator('#txtDocumento .dx-texteditor-input').first().inputValue();
    expect(numeroDocumento, 'El documento no quedó con número').toBeTruthy();

    await cerrarPestana360(page);

    return { valorDocumento, numeroDocumento };
};
