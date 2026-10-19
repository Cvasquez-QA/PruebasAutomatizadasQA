import { test, expect } from '@playwright/test';
import {
    abrirHerramientas360,
    abrirMaestros360,
    cerrarSesion360,
    ingresarAplicacion,
    filtrarPorInput,
    btnConfirmarDialogo,
    escaparRegex,
    textoExacto,
    existe,
    escribir,
    rutaArchivo
} from '../../../Funciones/HelpersHgi360PW.js';
import { testAdminConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

/**
 * Herramientas > Archivos (Interfaz): carga y actualización de TODOS los archivos de _uploads_.
 *
 * Por cada tabla:
 *   1. Limpia el registro si quedó de una ejecución anterior.
 *   2. Importa <Tabla>_ArchivoInterfaz_PRUEBA.xlsx y valida en el maestro el valor de creación.
 *   3. Importa <Tabla>_ArchivoInterfaz_UPDATE_PRUEBA.xlsx (check "Actualizar") y valida el valor actualizado.
 *   4. Elimina el registro y valida que ya no exista.
 *
 * Basado en Herramientas-ArchivosActividadesEco.js.
 */

const RUTA_UPLOADS = '..\\..\\..\\Planos\\_uploads_\\';
const MENSAJE_DESCARGA = 'El archivo que se descargó contiene el resultado d';

/**
 * Configuración por archivo.
 *  - tabla:     texto de la opción en el combo "Tabla" de Herramientas > Archivos.
 *  - maestro:   texto del maestro en el menú Maestros (abrirMaestros360).
 *  - grupo:     tarjeta "ver más" del menú Maestros: 'productos' | 'terceros' | 'localizacion' | 'impuestos'.
 *  - registros: código a buscar en el grid + valor esperado tras la carga y tras la actualización.
 *               Si el valor es número se valida como importe (acepta 10000, 10.000, $ 10.000,00 ...).
 *  - validarEn: 'grid' (por defecto) busca el valor en la fila del grid;
 *               'formulario' abre Editar y busca el valor en los campos (para columnas que no muestra el grid).
 */
const CASOS = [
    {
        nombre: 'Actividades Eco',
        archivo: 'TblActividadEco',
        tabla: 'Actividad Eco',
        maestro: 'Actividades Eco',
        grupo: 'terceros',
        registros: [
            { codigo: '102030', creado: 'Prueba0', actualizado: 'Prueba0Nuevo' },
            { codigo: '112233', creado: 'Prueba1', actualizado: 'Prueba1Nuevo' },
            { codigo: '112033', creado: 'Prueba2', actualizado: 'Prueba2Nuevo' }
        ]
    },
    {
        nombre: 'Barrios',
        archivo: 'TblBarrios',
        tabla: 'Barrios',
        maestro: 'Barrios',
        grupo: 'localizacion',
        registros: [{ codigo: '102030', creado: 'Pbarrio', actualizado: 'PbarrioN' }]
    },
    {
        nombre: 'Ciudades',
        archivo: 'TblCiudades',
        tabla: 'Ciudad',
        maestro: 'Ciudades',
        grupo: 'localizacion',
        registros: [{ codigo: '102030', creado: 'PCiudad', actualizado: 'PCiudadN' }]
    },
    {
        nombre: 'Clases',
        archivo: 'TblClases',
        tabla: 'Clases',
        maestro: 'Clases',
        grupo: 'productos',
        registros: [{ codigo: '102030', creado: 'PClase', actualizado: 'PClaseN' }]
    },
    {
        nombre: 'Entidades',
        archivo: 'TblEntidades',
        tabla: 'Entidades',
        maestro: 'Entidades Financieras',
        grupo: 'impuestos',
        registros: [{ codigo: '102030', creado: 'PEntidad', actualizado: 'PEntidadN' }]
    },
    {
        nombre: 'Productos',
        archivo: 'TblProductos',
        tabla: 'Productos',
        maestro: 'Productos',
        grupo: 'productos',
        registros: [{ codigo: '102030', creado: 'PProducto', actualizado: 'PProductoN' }]
    },
    {
        // Se valida en Maestros > Terceros: se edita el tercero y en la pestaña "Precios"
        // se ubica la fila del producto 01 con su precio (IntPrecio 10000 -> 20000).
        nombre: 'Terceros Precio Producto',
        archivo: 'TblProductosTercero',
        tabla: 'Terceros Precio Producto',
        maestro: 'Terceros',
        grupo: 'terceros',
        pestana: 'Precios',
        registros: [{ codigo: '1000099598', producto: '01', creado: 10000, actualizado: 20000 }]
    },
    {
        nombre: 'Sectores',
        archivo: 'TblSectores',
        tabla: 'Sectores',
        maestro: 'Sectores',
        grupo: 'localizacion',
        registros: [{ codigo: '102030', creado: 'PSector', actualizado: 'PSectorN' }]
    },
    {
        // Cambia StrDireccion; el grid de terceros no muestra la dirección, se valida en el formulario.
        nombre: 'Terceros',
        archivo: 'TblTerceros',
        tabla: 'Terceros',
        maestro: 'Terceros',
        grupo: 'terceros',
        validarEn: 'formulario',
        registros: [{ codigo: '1000099596', creado: 'CR 51 b # 67 a -11', actualizado: 'CALLE 11A 15-23' }]
    },
    {
        nombre: 'Tipos Tercero',
        archivo: 'TblTiposTercero',
        tabla: 'Tipos Tercero',
        maestro: 'Tipos Tercero',
        grupo: 'terceros',
        registros: [{ codigo: '102030', creado: 'PTTercero', actualizado: 'PTTerceroN' }]
    },
    {
        nombre: 'Vendedores',
        archivo: 'TblVendedores',
        tabla: 'Vendedores',
        maestro: 'Vendedores',
        grupo: 'terceros',
        registros: [{ codigo: '102030', creado: 'PVendedor', actualizado: 'PVendedorN' }]
    },
    {
        nombre: 'Zonas',
        archivo: 'TblZonas',
        tabla: 'Zonas',
        maestro: 'Zonas',
        grupo: 'localizacion',
        registros: [{ codigo: '102030', creado: 'PZona', actualizado: 'PZonaN' }]
    }
];

/* ----------------------------------------------------------------------------
 * Selectores genéricos (solo hay un maestro abierto a la vez)
 * --------------------------------------------------------------------------*/

const buscadorGrid = page => page.locator('.dx-datagrid-search-panel .dx-texteditor-input').filter({ visible: true });
const buscadorGridAlterno = page => page.locator('.dx-datagrid .dx-texteditor-input').filter({ visible: true });
const btnLimpiarBuscador = page => page.locator('.dx-datagrid-search-panel .dx-icon.dx-icon-clear').filter({ visible: true });
const btnConfirmarEliminar = page => page.locator('button').filter({ hasText: 'Eliminar' }).filter({ visible: true });
const btnRefrescar = page => page.locator('.dx-icon.dx-icon-refresh').filter({ visible: true }).nth(0);
const btnConfirmarDxDialogo = page => page.locator('.dx-dialog-button').filter({ hasText: /^(Sí|Si|Yes|Aceptar)$/ }).filter({ visible: true });
const btnCerrarPestanas = page => page.locator('#TabsMenu .dx-icon.dx-icon-close.erp-tab-close').filter({ visible: true });
const tabDetalle = (page, nombre) => page.locator('.dx-tab-text, .dx-tab, [role="tab"], .erp-tab-title span')
    .filter({ hasText: textoExacto(nombre) })
    .filter({ visible: true })
    .nth(0);

const archivoImportar = caso => `${RUTA_UPLOADS}${caso.archivo}_ArchivoInterfaz_PRUEBA.xlsx`;
const archivoActualizar = caso => `${RUTA_UPLOADS}${caso.archivo}_ArchivoInterfaz_UPDATE_PRUEBA.xlsx`;

/** 10000 -> acepta "10000", "10.000", "10,000", "$ 10.000", "10.000,00", "10,000.00". */
const regexImporte = numero => {
    const miles = String(numero).replace(/\B(?=(\d{3})+(?!\d))/g, '[.,]?');
    return new RegExp(`^\\s*\\$?\\s*${miles}([.,]0+)?\\s*$`);
};

/** Celda con el valor esperado: exacta para textos (PSector no debe coincidir con PSectorN). */
const celdaConValor = (fila, valor) => typeof valor === 'number'
    ? fila.locator('td').filter({ hasText: regexImporte(valor) })
    : fila.locator('td').filter({ hasText: new RegExp(`^\\s*${escaparRegex(valor)}\\s*$`) });

const filaPorCodigo = (page, codigo) => page.locator('tr.dx-data-row')
    .filter({ visible: true })
    .locator('td')
    .filter({ hasText: textoExacto(String(codigo)) })
    .locator('xpath=ancestor::tr[1]');

/** Busca un texto en los valores de los inputs visibles del formulario abierto. */
const valorEnFormulario = (page, valor) => page.evaluate(valor => {
    const buscado = String(valor).trim().toLowerCase();
    const visibles = Array.from(document.querySelectorAll('input, textarea'))
        .filter(el => el.offsetParent !== null);
    return visibles.some(el => String(el.value || '').trim().toLowerCase() === buscado);
}, valor);

/* ----------------------------------------------------------------------------
 * Pasos
 * --------------------------------------------------------------------------*/

async function seleccionarTabla(page, tabla) {
    await page.locator('#txtTabla .dx-lookup-field').first().click();

    if (await existe(filtrarPorInput(page), 2000)) {
        await escribir(filtrarPorInput(page), tabla);
        await page.waitForTimeout(1500);
    }

    const opcion = page.locator('.dx-overlay-content')
        .filter({ visible: true })
        .locator('.dx-item-content')
        .filter({ hasText: textoExacto(tabla) });

    await expect(opcion.first(), `No existe la tabla "${tabla}" en Herramientas > Archivos`).toBeAttached({ timeout: 8000 });
    await opcion.first().click();
}

async function importarArchivo(page, caso, archivo, actualizar = false) {
    await abrirHerramientas360(page, 'Archivos');
    await seleccionarTabla(page, caso.tabla);

    if (actualizar) {
        await page.locator('#TxtArchivos_Actualizar .dx-checkbox-icon').first().click();
    } else {
        await page.locator('#BtnDescargar_Estructura .dx-icon.dx-icon-download').first().click();
    }

    await page.locator('#LinkExaminarArchivos').first().click();
    await page.locator('#InputImportarRuta').first().setInputFiles(rutaArchivo(archivo));
    await page.locator('#BtnArchivos_Generar span, #BtnArchivos_Generar div').filter({ hasText: 'Generar' }).first().click();

    // Popup de resultado: "Importación finalizada" con tarjetas Procesados / Ingresados / Actualizados / Ignorados / No válidos
    const etapa = actualizar ? 'actualización' : 'carga';
    await expect(popupResultado(page).first(), `[${caso.nombre}] No apareció el resultado de la ${etapa} de ${caso.archivo}`)
        .toBeAttached({ timeout: 60000 });

    const resumen = (await popupResultado(page).first().innerText()).replace(/\s+/g, ' ').trim();
    const ingresados = await leerContador(page, 'Ingresados');
    const actualizados = await leerContador(page, 'Actualizados');
    console.log(`[${caso.nombre}] Resultado ${etapa}: ${resumen}`);

    if (actualizar) {
        expect(actualizados > 0,
            `[${caso.nombre}] La actualización no actualizó registros. Resultado: ${resumen}`
        ).toBeTruthy();
    } else {
        expect(ingresados > 0,
            `[${caso.nombre}] La carga no ingresó registros (si salen IGNORADOS, el registro ya existía). Resultado: ${resumen}`
        ).toBeTruthy();

        // Descargar el log de resultado (como en la prueba de Actividades Eco)
        if (await existe(btnDescargarLog(page), 5000)) {
            await btnDescargarLog(page).first().click();
            if (await existe(swalDescarga(page), 5000)) {
                await page.locator('button').filter({ hasText: 'Confirmar' }).filter({ visible: true }).first().click();
            }
        }
    }

    await btnAceptarResultado(page).first().click({ timeout: 10000 });
    await cerrarTodasLasPestanas(page);
}

const popupResultado = page => page.locator('.popup-Archivos-Resumen .adm-movimiento-resumen').filter({ visible: true });
const btnDescargarLog = page => page.locator('#BtnDescargarLogArchivos').filter({ visible: true });
const btnAceptarResultado = page => page.locator('#BtnAceptarPopupArchivos').filter({ visible: true });
const swalDescarga = page => page.locator('.swal2-popup').filter({ hasText: MENSAJE_DESCARGA }).filter({ visible: true });

/** Valor numérico de una tarjeta del resultado (Procesados, Ingresados, Actualizados, Ignorados, No válidos). */
async function leerContador(page, titulo) {
    const tarjeta = popupResultado(page)
        .locator('.adm-movimiento-resumen__card')
        .filter({ hasText: titulo });
    if (!await existe(tarjeta)) {
        return 0;
    }
    return parseInt(await tarjeta.first().locator('.adm-movimiento-resumen__card-valor').first().innerText(), 10) || 0;
}

async function abrirMaestro(page, caso) {
    await abrirMaestros360(page, caso.maestro, caso.grupo);
    await expect(buscadorGridAlterno(page).first(), `No cargó el grid del maestro ${caso.maestro}`)
        .toBeAttached({ timeout: 15000 });
}

/** Refresca el grid del maestro para que muestre lo que se acaba de cargar con el archivo. */
async function refrescarMaestro(page, caso) {
    await expect(btnRefrescar(page), `No apareció el botón refrescar en el maestro ${caso.maestro}`)
        .toBeAttached({ timeout: 10000 });
    await btnRefrescar(page).click();
    await page.waitForTimeout(2500);
}

async function buscar(page, codigo) {
    const campo = await existe(buscadorGrid(page), 3000) ? buscadorGrid(page) : buscadorGridAlterno(page);

    if (await existe(btnLimpiarBuscador(page))) {
        await btnLimpiarBuscador(page).first().click();
    }
    await escribir(campo.nth(0), String(codigo));
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2500);
}

async function validarRegistro(page, caso, registro, valor, etapa) {
    await buscar(page, registro.codigo);

    const fila = filaPorCodigo(page, registro.codigo);
    await expect(fila.first(), `[${caso.nombre}] No se encontró ${registro.codigo} en el maestro luego de la ${etapa}`)
        .toBeAttached({ timeout: 15000 });

    if (caso.validarEn === 'formulario') {
        await fila.locator('[data-tooltip="Editar"], [aria-label="Editar"], .dx-link-edit').nth(0).click();
        await page.waitForTimeout(2500);
        await expect.poll(() => valorEnFormulario(page, valor),
            `[${caso.nombre}] ${registro.codigo}: luego de la ${etapa} se esperaba "${valor}" en el formulario`
        ).toBeTruthy();
        // Cerrar el formulario y volver al grid
        await cerrarTodasLasPestanas(page);
        await abrirMaestro(page, caso);
        return;
    }

    await expect(celdaConValor(fila, valor).first(),
        `[${caso.nombre}] ${registro.codigo}: luego de la ${etapa} se esperaba "${valor}"`
    ).toBeAttached({ timeout: 10000 });
}

/** Elimina la fila del código (y con el valor indicado, si se pasa) y valida que desaparezca. */
async function eliminarRegistro(page, caso, registro, valor = null) {
    await buscar(page, registro.codigo);

    let fila = filaPorCodigo(page, registro.codigo);
    if (valor !== null) {
        fila = celdaConValor(fila, valor).locator('xpath=ancestor::tr[1]');
    }
    if (!await existe(fila, 4000)) {
        return false;
    }

    const btnEliminar = fila.locator('[data-tooltip="Eliminar"], [aria-label="Eliminar"]').nth(0);
    await btnEliminar.click();

    if (await existe(btnConfirmarDialogo(page), 5000)) {
        await btnConfirmarDialogo(page).first().click();
    } else {
        await btnConfirmarEliminar(page).first().click();
    }

    await page.waitForTimeout(3000);
    await expect(fila, `[${caso.nombre}] El registro ${registro.codigo} sigue en el maestro después de eliminarlo`)
        .toHaveCount(0, { timeout: 15000 });
    return true;
}

/** Deja el maestro sin los registros de prueba antes de cargar el archivo. */
async function limpiarRegistrosPrevios(page, caso) {
    await abrirMaestro(page, caso);
    for (const registro of caso.registros) {
        const valores = typeof registro.creado === 'number' ? [registro.creado, registro.actualizado] : [null];
        for (const valor of valores) {
            await eliminarRegistro(page, caso, registro, valor);
        }
    }
    await cerrarTodasLasPestanas(page);
}

/* ----------------------------------------------------------------------------
 * Registros que se validan en una pestaña del maestro (Productos Tercero -> Terceros > Precios)
 * --------------------------------------------------------------------------*/

const btnCerrarFormulario = page => page.locator('button, .dx-button').filter({ hasText: 'Cerrar' }).filter({ visible: true });
const btnGuardarFormulario = page => page.locator('button, .dx-button').filter({ hasText: 'Guardar' }).filter({ visible: true });

async function cerrarTodasLasPestanas(page) {
    // Primero cerrar el formulario del tercero con su botón "Cerrar"
    if (await existe(btnCerrarFormulario(page), 1500)) {
        await btnCerrarFormulario(page).nth(0).click();
        await page.waitForTimeout(1500);
        if (await existe(btnConfirmarDialogo(page), 1500)) {
            await btnConfirmarDialogo(page).first().click();
            await page.waitForTimeout(1000);
        }
    }
    let intentos = 0;
    while (await existe(btnCerrarPestanas(page), 1500) && intentos < 5) {
        await btnCerrarPestanas(page).nth(0).click();
        await page.waitForTimeout(1000);
        intentos++;
    }
}

/** Abre el maestro, refresca, edita el registro principal (tercero) y entra a la pestaña indicada. */
async function abrirPestanaDetalle(page, caso, registro) {
    await abrirMaestro(page, caso);
    await refrescarMaestro(page, caso);
    await buscar(page, registro.codigo);

    const fila = filaPorCodigo(page, registro.codigo);
    await expect(fila.first(), `[${caso.nombre}] No se encontró ${registro.codigo} en el maestro ${caso.maestro}`)
        .toBeAttached({ timeout: 15000 });
    await fila.locator('[data-tooltip="Editar"], [aria-label="Editar"], .dx-link-edit').nth(0).click();
    await page.waitForTimeout(2500);
    await expect(tabDetalle(page, caso.pestana), `[${caso.nombre}] No apareció la pestaña "${caso.pestana}" en ${caso.maestro}`)
        .toBeAttached({ timeout: 15000 });
    await tabDetalle(page, caso.pestana).click();
    await page.waitForTimeout(2500);

    // Refrescar el grid de la pestaña (icono refresh sobre el grid de Precios)
    const refrescarPestana = page.locator('.dx-icon.dx-icon-refresh').filter({ visible: true }).last();
    if (await existe(refrescarPestana, 5000)) {
        await refrescarPestana.click();
        await page.waitForTimeout(2500);
    }
}

/**
 * Fila de la pestaña: producto + precio.
 * La columna Producto puede mostrar "01" o "01 - DESCRIPCIÓN", por eso se compara el inicio de la celda.
 */
const filaDetalle = (page, registro, valor) => celdaConValor(
    page.locator('tr.dx-data-row')
        .filter({ visible: true })
        .locator('td')
        .filter({ hasText: new RegExp(`^\\s*${escaparRegex(registro.producto)}(\\s|-|$)`) })
        .locator('xpath=ancestor::tr[1]'),
    valor
).locator('xpath=ancestor::tr[1]');

async function eliminarFilaDetalle(page, caso, registro, valor) {
    const fila = filaDetalle(page, registro, valor);
    if (!await existe(fila, 4000)) {
        return false;
    }

    await fila.locator('[data-tooltip="Eliminar"], [aria-label="Eliminar"], .dx-link-delete').nth(0).click();

    if (await existe(btnConfirmarDialogo(page), 4000)) {
        await btnConfirmarDialogo(page).first().click();
    } else if (await existe(btnConfirmarDxDialogo(page), 2000)) {
        await btnConfirmarDxDialogo(page).first().click();
    } else if (await existe(btnConfirmarEliminar(page), 2000)) {
        await btnConfirmarEliminar(page).first().click();
    }

    await page.waitForTimeout(3000);
    await expect(fila, `[${caso.nombre}] El producto ${registro.producto} (${valor}) sigue en la pestaña ${caso.pestana}`)
        .toHaveCount(0, { timeout: 15000 });

    // Grabar el cambio del tercero
    if (await existe(btnGuardarFormulario(page), 3000)) {
        await btnGuardarFormulario(page).nth(0).click();
        await page.waitForTimeout(3000);
        if (await existe(btnConfirmarDialogo(page), 3000)) {
            await btnConfirmarDialogo(page).first().click();
            await page.waitForTimeout(1000);
        }
    }
    return true;
}

async function ejecutarCasoPestana(page, config, caso) {
    await ingresarAplicacion(page, config);

    // Limpieza previa
    for (const registro of caso.registros) {
        await abrirPestanaDetalle(page, caso, registro);
        await eliminarFilaDetalle(page, caso, registro, registro.creado);
        await eliminarFilaDetalle(page, caso, registro, registro.actualizado);
        await cerrarTodasLasPestanas(page);
    }

    // 1. Creación
    await importarArchivo(page, caso, archivoImportar(caso));
    await cerrarTodasLasPestanas(page);
    for (const registro of caso.registros) {
        await abrirPestanaDetalle(page, caso, registro);
        await expect(filaDetalle(page, registro, registro.creado).first(),
            `[${caso.nombre}] Luego de la carga no se encontró el producto ${registro.producto} con precio ${registro.creado} en ${caso.maestro} > ${caso.pestana}`
        ).toBeAttached({ timeout: 15000 });
        await cerrarTodasLasPestanas(page);
    }

    // 2. Actualización y 3. Eliminación
    await importarArchivo(page, caso, archivoActualizar(caso), true);
    await cerrarTodasLasPestanas(page);
    for (const registro of caso.registros) {
        await abrirPestanaDetalle(page, caso, registro);
        await expect(filaDetalle(page, registro, registro.actualizado).first(),
            `[${caso.nombre}] Luego de la actualización no se encontró el producto ${registro.producto} con precio ${registro.actualizado} en ${caso.maestro} > ${caso.pestana}`
        ).toBeAttached({ timeout: 15000 });
        expect(await eliminarFilaDetalle(page, caso, registro, registro.actualizado),
            `[${caso.nombre}] No se pudo eliminar el producto ${registro.producto} de ${caso.pestana}`
        ).toBeTruthy();
        await cerrarTodasLasPestanas(page);
    }

    await cerrarSesion360(page);
}

async function ejecutarCaso(page, config, caso) {
    if (caso.pestana) {
        await ejecutarCasoPestana(page, config, caso);
        return;
    }

    await ingresarAplicacion(page, config);

    await limpiarRegistrosPrevios(page, caso);

    // 1. Creación
    await importarArchivo(page, caso, archivoImportar(caso));
    await abrirMaestro(page, caso);
    await refrescarMaestro(page, caso);
    for (const registro of caso.registros) {
        await validarRegistro(page, caso, registro, registro.creado, 'carga');
    }
    await cerrarTodasLasPestanas(page);

    // 2. Actualización
    await importarArchivo(page, caso, archivoActualizar(caso), true);
    await abrirMaestro(page, caso);
    await refrescarMaestro(page, caso);
    for (const registro of caso.registros) {
        await validarRegistro(page, caso, registro, registro.actualizado, 'actualización');
    }

    // 3. Eliminación
    for (const registro of caso.registros) {
        const valor = typeof registro.actualizado === 'number' ? registro.actualizado : null;
        expect(await eliminarRegistro(page, caso, registro, valor),
            `[${caso.nombre}] No se encontró ${registro.codigo} para eliminarlo`
        ).toBeTruthy();
    }

    await cerrarTodasLasPestanas(page);
    await cerrarSesion360(page);
}

/* ----------------------------------------------------------------------------
 * Fixtures: un test por archivo en cada ambiente
 * --------------------------------------------------------------------------*/

test.describe('Prueba Herramientas Archivos Interfaz - Test Hgi360', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(testAdminConfig.pagina);
    });

    for (const caso of CASOS) {
        test(`Prueba Archivos ${caso.nombre} - Test Hgi360`, async ({ page }) => {
            await ejecutarCaso(page, testAdminConfig, caso);
        });
    }
});
