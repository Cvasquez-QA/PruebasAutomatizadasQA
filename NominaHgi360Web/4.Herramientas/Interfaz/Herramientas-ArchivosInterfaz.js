import { ClientFunction, Selector } from 'testcafe';
import {
    abrirHerramientas360,
    abrirMaestros360,
    cerrarSesion360,
    ingresarAplicacion,
    filtrarPorInput,
    limpiarCacheChromeTestCafe
} from '../../../Funciones/HelpersHgi360Web.js';
import { testNominaConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

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

const buscadorGrid = Selector('.dx-datagrid-search-panel .dx-texteditor-input').filterVisible();
const buscadorGridAlterno = Selector('.dx-datagrid .dx-texteditor-input').filterVisible();
const btnLimpiarBuscador = Selector('.dx-datagrid-search-panel .dx-icon.dx-icon-clear').filterVisible();
const btnConfirmarDialogo = Selector('button.swal2-confirm').filterVisible();
const btnConfirmarEliminar = Selector('button').withText('Eliminar').filterVisible();
const btnRefrescar = Selector('.dx-icon.dx-icon-refresh').filterVisible().nth(0);
const btnConfirmarDxDialogo = Selector('.dx-dialog-button').withText(/^(Sí|Si|Yes|Aceptar)$/).filterVisible();
const btnCerrarPestanas = Selector('#TabsMenu .dx-icon.dx-icon-close.erp-tab-close').filterVisible();
const tabDetalle = nombre => Selector('.dx-tab-text, .dx-tab, [role="tab"], .erp-tab-title span')
    .withExactText(nombre)
    .filterVisible()
    .nth(0);

const archivoImportar = caso => `${RUTA_UPLOADS}${caso.archivo}_ArchivoInterfaz_PRUEBA.xlsx`;
const archivoActualizar = caso => `${RUTA_UPLOADS}${caso.archivo}_ArchivoInterfaz_UPDATE_PRUEBA.xlsx`;

const escaparRegex = texto => String(texto).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** 10000 -> acepta "10000", "10.000", "10,000", "$ 10.000", "10.000,00", "10,000.00". */
const regexImporte = numero => {
    const miles = String(numero).replace(/\B(?=(\d{3})+(?!\d))/g, '[.,]?');
    return new RegExp(`^\\s*\\$?\\s*${miles}([.,]0+)?\\s*$`);
};

/** Celda con el valor esperado: exacta para textos (PSector no debe coincidir con PSectorN). */
const celdaConValor = (fila, valor) => typeof valor === 'number'
    ? fila.find('td').withText(regexImporte(valor))
    : fila.find('td').withText(new RegExp(`^\\s*${escaparRegex(valor)}\\s*$`));

const filaPorCodigo = codigo => Selector('tr.dx-data-row')
    .filterVisible()
    .find('td')
    .withExactText(String(codigo))
    .parent('tr');

/** Busca un texto en los valores de los inputs visibles del formulario abierto. */
const valorEnFormulario = ClientFunction(valor => {
    const buscado = String(valor).trim().toLowerCase();
    const visibles = Array.from(document.querySelectorAll('input, textarea'))
        .filter(el => el.offsetParent !== null);
    return visibles.some(el => String(el.value || '').trim().toLowerCase() === buscado);
});

/* ----------------------------------------------------------------------------
 * Pasos
 * --------------------------------------------------------------------------*/

async function seleccionarTabla(t, tabla) {
    await t.click('#txtTabla .dx-lookup-field');

    if (await filtrarPorInput.with({ timeout: 2000 }).exists) {
        await t.typeText(filtrarPorInput, tabla, { replace: true }).wait(1500);
    }

    const opcion = Selector('.dx-overlay-content')
        .filterVisible()
        .find('.dx-item-content')
        .withExactText(tabla);

    await t
        .expect(opcion.with({ timeout: 8000 }).exists).ok(`No existe la tabla "${tabla}" en Herramientas > Archivos`)
        .click(opcion);
}

async function importarArchivo(t, caso, archivo, actualizar = false) {
    await abrirHerramientas360(t, 'Archivos');
    await seleccionarTabla(t, caso.tabla);

    if (actualizar) {
        await t.click('#TxtArchivos_Actualizar .dx-checkbox-icon');
    } else {
        await t.click('#BtnDescargar_Estructura .dx-icon.dx-icon-download');
    }

    await t
        .click('#LinkExaminarArchivos')
        .setFilesToUpload('#InputImportarRuta', [archivo])
        .click(Selector('#BtnArchivos_Generar span, #BtnArchivos_Generar div').withText('Generar'));

    // Popup de resultado: "Importación finalizada" con tarjetas Procesados / Ingresados / Actualizados / Ignorados / No válidos
    const etapa = actualizar ? 'actualización' : 'carga';
    await t.expect(popupResultado.with({ timeout: 60000 }).exists)
        .ok(`[${caso.nombre}] No apareció el resultado de la ${etapa} de ${caso.archivo}`);

    const resumen = (await popupResultado.innerText).replace(/\s+/g, ' ').trim();
    const ingresados = await leerContador('Ingresados');
    const actualizados = await leerContador('Actualizados');
    console.log(`[${caso.nombre}] Resultado ${etapa}: ${resumen}`);

    if (actualizar) {
        await t.expect(actualizados > 0).ok(
            `[${caso.nombre}] La actualización no actualizó registros. Resultado: ${resumen}`
        );
    } else {
        await t.expect(ingresados > 0).ok(
            `[${caso.nombre}] La carga no ingresó registros (si salen IGNORADOS, el registro ya existía). Resultado: ${resumen}`
        );

        // Descargar el log de resultado (como en la prueba de Actividades Eco)
        if (await btnDescargarLog.with({ timeout: 5000 }).exists) {
            await t.click(btnDescargarLog);
            if (await swalDescarga.with({ timeout: 5000 }).exists) {
                await t.click(Selector('button').withText('Confirmar').filterVisible());
            }
        }
    }

    await t.click(btnAceptarResultado.with({ timeout: 10000 }));
    await cerrarTodasLasPestanas(t);
}

const popupResultado = Selector('.popup-Archivos-Resumen .adm-movimiento-resumen').filterVisible();
const btnDescargarLog = Selector('#BtnDescargarLogArchivos').filterVisible();
const btnAceptarResultado = Selector('#BtnAceptarPopupArchivos').filterVisible();
const swalDescarga = Selector('.swal2-popup').withText(MENSAJE_DESCARGA).filterVisible();

/** Valor numérico de una tarjeta del resultado (Procesados, Ingresados, Actualizados, Ignorados, No válidos). */
async function leerContador(titulo) {
    const tarjeta = popupResultado
        .find('.adm-movimiento-resumen__card')
        .withText(titulo);
    if (!await tarjeta.exists) {
        return 0;
    }
    return parseInt(await tarjeta.find('.adm-movimiento-resumen__card-valor').innerText, 10) || 0;
}

async function abrirMaestro(t, caso) {
    await abrirMaestros360(t, caso.maestro, caso.grupo);
    await t.expect(buscadorGridAlterno.with({ timeout: 15000 }).exists)
        .ok(`No cargó el grid del maestro ${caso.maestro}`);
}

/** Refresca el grid del maestro para que muestre lo que se acaba de cargar con el archivo. */
async function refrescarMaestro(t, caso) {
    await t
        .expect(btnRefrescar.with({ timeout: 10000 }).exists)
        .ok(`No apareció el botón refrescar en el maestro ${caso.maestro}`)
        .click(btnRefrescar)
        .wait(2500);
}

async function buscar(t, codigo) {
    const campo = await buscadorGrid.with({ timeout: 3000 }).exists ? buscadorGrid : buscadorGridAlterno;

    if (await btnLimpiarBuscador.exists) {
        await t.click(btnLimpiarBuscador);
    }
    await t
        .typeText(campo.nth(0), String(codigo), { replace: true })
        .pressKey('enter')
        .wait(2500);
}

async function validarRegistro(t, caso, registro, valor, etapa) {
    await buscar(t, registro.codigo);

    const fila = filaPorCodigo(registro.codigo);
    await t.expect(fila.with({ timeout: 15000 }).exists)
        .ok(`[${caso.nombre}] No se encontró ${registro.codigo} en el maestro luego de la ${etapa}`);

    if (caso.validarEn === 'formulario') {
        await t.click(fila.find('[data-tooltip="Editar"], [aria-label="Editar"], .dx-link-edit').nth(0)).wait(2500);
        await t.expect(valorEnFormulario(valor)).ok(
            `[${caso.nombre}] ${registro.codigo}: luego de la ${etapa} se esperaba "${valor}" en el formulario`
        );
        // Cerrar el formulario y volver al grid
        await cerrarTodasLasPestanas(t);
        await abrirMaestro(t, caso);
        return;
    }

    await t.expect(celdaConValor(fila, valor).with({ timeout: 10000 }).exists).ok(
        `[${caso.nombre}] ${registro.codigo}: luego de la ${etapa} se esperaba "${valor}"`
    );
}

/** Elimina la fila del código (y con el valor indicado, si se pasa) y valida que desaparezca. */
async function eliminarRegistro(t, caso, registro, valor = null) {
    await buscar(t, registro.codigo);

    let fila = filaPorCodigo(registro.codigo);
    if (valor !== null) {
        fila = celdaConValor(fila, valor).parent('tr');
    }
    if (!await fila.with({ timeout: 4000 }).exists) {
        return false;
    }

    const btnEliminar = fila.find('[data-tooltip="Eliminar"], [aria-label="Eliminar"]').nth(0);
    await t.click(btnEliminar);

    if (await btnConfirmarDialogo.with({ timeout: 5000 }).exists) {
        await t.click(btnConfirmarDialogo);
    } else {
        await t.click(btnConfirmarEliminar);
    }

    await t
        .wait(3000)
        .expect(fila.with({ timeout: 15000 }).exists)
        .notOk(`[${caso.nombre}] El registro ${registro.codigo} sigue en el maestro después de eliminarlo`);
    return true;
}

/** Deja el maestro sin los registros de prueba antes de cargar el archivo. */
async function limpiarRegistrosPrevios(t, caso) {
    await abrirMaestro(t, caso);
    for (const registro of caso.registros) {
        const valores = typeof registro.creado === 'number' ? [registro.creado, registro.actualizado] : [null];
        for (const valor of valores) {
            await eliminarRegistro(t, caso, registro, valor);
        }
    }
    await cerrarTodasLasPestanas(t);
}

/* ----------------------------------------------------------------------------
 * Registros que se validan en una pestaña del maestro (Productos Tercero -> Terceros > Precios)
 * --------------------------------------------------------------------------*/

const btnCerrarFormulario = Selector('button, .dx-button').withText('Cerrar').filterVisible();
const btnGuardarFormulario = Selector('button, .dx-button').withText('Guardar').filterVisible();

async function cerrarTodasLasPestanas(t) {
    await t.switchToMainWindow();
    // Primero cerrar el formulario del tercero con su botón "Cerrar"
    if (await btnCerrarFormulario.with({ timeout: 1500 }).exists) {
        await t.click(btnCerrarFormulario.nth(0)).wait(1500);
        if (await btnConfirmarDialogo.with({ timeout: 1500 }).exists) {
            await t.click(btnConfirmarDialogo).wait(1000);
        }
    }
    let intentos = 0;
    while (await btnCerrarPestanas.with({ timeout: 1500 }).exists && intentos < 5) {
        await t.click(btnCerrarPestanas.nth(0)).wait(1000);
        intentos++;
    }
}

/** Abre el maestro, refresca, edita el registro principal (tercero) y entra a la pestaña indicada. */
async function abrirPestanaDetalle(t, caso, registro) {
    await abrirMaestro(t, caso);
    await refrescarMaestro(t, caso);
    await buscar(t, registro.codigo);

    const fila = filaPorCodigo(registro.codigo);
    await t
        .expect(fila.with({ timeout: 15000 }).exists)
        .ok(`[${caso.nombre}] No se encontró ${registro.codigo} en el maestro ${caso.maestro}`)
        .click(fila.find('[data-tooltip="Editar"], [aria-label="Editar"], .dx-link-edit').nth(0))
        .wait(2500)
        .expect(tabDetalle(caso.pestana).with({ timeout: 15000 }).exists)
        .ok(`[${caso.nombre}] No apareció la pestaña "${caso.pestana}" en ${caso.maestro}`)
        .click(tabDetalle(caso.pestana))
        .wait(2500);

    // Refrescar el grid de la pestaña (icono refresh sobre el grid de Precios)
    const refrescarPestana = Selector('.dx-icon.dx-icon-refresh').filterVisible().nth(-1);
    if (await refrescarPestana.with({ timeout: 5000 }).exists) {
        await t.click(refrescarPestana).wait(2500);
    }
}

/**
 * Fila de la pestaña: producto + precio.
 * La columna Producto puede mostrar "01" o "01 - DESCRIPCIÓN", por eso se compara el inicio de la celda.
 */
const filaDetalle = (registro, valor) => celdaConValor(
    Selector('tr.dx-data-row')
        .filterVisible()
        .find('td')
        .withText(new RegExp(`^\\s*${escaparRegex(registro.producto)}(\\s|-|$)`))
        .parent('tr'),
    valor
).parent('tr');

async function eliminarFilaDetalle(t, caso, registro, valor) {
    const fila = filaDetalle(registro, valor);
    if (!await fila.with({ timeout: 4000 }).exists) {
        return false;
    }

    await t.click(fila.find('[data-tooltip="Eliminar"], [aria-label="Eliminar"], .dx-link-delete').nth(0));

    if (await btnConfirmarDialogo.with({ timeout: 4000 }).exists) {
        await t.click(btnConfirmarDialogo);
    } else if (await btnConfirmarDxDialogo.with({ timeout: 2000 }).exists) {
        await t.click(btnConfirmarDxDialogo);
    } else if (await btnConfirmarEliminar.with({ timeout: 2000 }).exists) {
        await t.click(btnConfirmarEliminar);
    }

    await t
        .wait(3000)
        .expect(fila.with({ timeout: 15000 }).exists)
        .notOk(`[${caso.nombre}] El producto ${registro.producto} (${valor}) sigue en la pestaña ${caso.pestana}`);

    // Grabar el cambio del tercero
    if (await btnGuardarFormulario.with({ timeout: 3000 }).exists) {
        await t.click(btnGuardarFormulario.nth(0)).wait(3000);
        if (await btnConfirmarDialogo.with({ timeout: 3000 }).exists) {
            await t.click(btnConfirmarDialogo).wait(1000);
        }
    }
    return true;
}

async function ejecutarCasoPestana(t, config, caso) {
    await ingresarAplicacion(t, config);

    // Limpieza previa
    for (const registro of caso.registros) {
        await abrirPestanaDetalle(t, caso, registro);
        await eliminarFilaDetalle(t, caso, registro, registro.creado);
        await eliminarFilaDetalle(t, caso, registro, registro.actualizado);
        await cerrarTodasLasPestanas(t);
    }

    // 1. Creación
    await importarArchivo(t, caso, archivoImportar(caso));
    await cerrarTodasLasPestanas(t);
    for (const registro of caso.registros) {
        await abrirPestanaDetalle(t, caso, registro);
        await t.expect(filaDetalle(registro, registro.creado).with({ timeout: 15000 }).exists).ok(
            `[${caso.nombre}] Luego de la carga no se encontró el producto ${registro.producto} con precio ${registro.creado} en ${caso.maestro} > ${caso.pestana}`
        );
        await cerrarTodasLasPestanas(t);
    }

    // 2. Actualización y 3. Eliminación
    await importarArchivo(t, caso, archivoActualizar(caso), true);
    await cerrarTodasLasPestanas(t);
    for (const registro of caso.registros) {
        await abrirPestanaDetalle(t, caso, registro);
        await t.expect(filaDetalle(registro, registro.actualizado).with({ timeout: 15000 }).exists).ok(
            `[${caso.nombre}] Luego de la actualización no se encontró el producto ${registro.producto} con precio ${registro.actualizado} en ${caso.maestro} > ${caso.pestana}`
        );
        await t.expect(await eliminarFilaDetalle(t, caso, registro, registro.actualizado)).ok(
            `[${caso.nombre}] No se pudo eliminar el producto ${registro.producto} de ${caso.pestana}`
        );
        await cerrarTodasLasPestanas(t);
    }

    await cerrarSesion360(t);
}

async function ejecutarCaso(t, config, caso) {
    if (caso.pestana) {
        await ejecutarCasoPestana(t, config, caso);
        return;
    }

    await ingresarAplicacion(t, config);

    await limpiarRegistrosPrevios(t, caso);

    // 1. Creación
    await importarArchivo(t, caso, archivoImportar(caso));
    await abrirMaestro(t, caso);
    await refrescarMaestro(t, caso);
    for (const registro of caso.registros) {
        await validarRegistro(t, caso, registro, registro.creado, 'carga');
    }
    await cerrarTodasLasPestanas(t);

    // 2. Actualización
    await importarArchivo(t, caso, archivoActualizar(caso), true);
    await abrirMaestro(t, caso);
    await refrescarMaestro(t, caso);
    for (const registro of caso.registros) {
        await validarRegistro(t, caso, registro, registro.actualizado, 'actualización');
    }

    // 3. Eliminación
    for (const registro of caso.registros) {
        const valor = typeof registro.actualizado === 'number' ? registro.actualizado : null;
        await t.expect(await eliminarRegistro(t, caso, registro, valor)).ok(
            `[${caso.nombre}] No se encontró ${registro.codigo} para eliminarlo`
        );
    }

    await cerrarTodasLasPestanas(t);
    await cerrarSesion360(t);
}

/* ----------------------------------------------------------------------------
 * Limpieza del navegador: caché HTTP (helper) + cookies + localStorage/sessionStorage
 * --------------------------------------------------------------------------*/

const limpiarStorage = ClientFunction(() => {
    try { window.localStorage.clear(); } catch (e) { /* sin acceso */ }
    try { window.sessionStorage.clear(); } catch (e) { /* sin acceso */ }
});

async function limpiarNavegador(t) {
    try {
        await limpiarCacheChromeTestCafe(t);
        const client = await t.getCurrentCDPSession();
        await client.Network.clearBrowserCookies();
    } catch (e) {
        console.log(`No se pudo limpiar caché/cookies por CDP: ${e.message}`);
    }
    try {
        await limpiarStorage();
    } catch (e) {
        console.log(`No se pudo limpiar localStorage/sessionStorage: ${e.message}`);
    }
}

/* ----------------------------------------------------------------------------
 * Fixtures: un test por archivo en cada ambiente
 * --------------------------------------------------------------------------*/

fixture `Prueba Herramientas Archivos Interfaz - Test Hgi360`
    .page(testNominaConfig.pagina)
    .beforeEach(async t => {
        await limpiarNavegador(t);
        // Recargar para que el login arranque sin sesión ni pestañas guardadas
        await t.navigateTo(testNominaConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarNavegador(t);
    });

for (const caso of CASOS) {
    test(`Prueba Archivos ${caso.nombre} - Test Hgi360`, async t => {
        await ejecutarCaso(t, testNominaConfig, caso);
    });
}
