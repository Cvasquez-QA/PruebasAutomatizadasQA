/**
 * Inventario de Herramientas > Parámetros (test.hgi360.com, empresa 8902, AutAdmin).
 * Levantado en el navegador el 29-oct-2026 con la pantalla en modo Editar.
 *
 * Cada línea de `campos` es:  id | tipo | etiqueta | sección | marcas | opciones
 *  - id: data-testid del control (también es su id).
 *  - tipo: checkbox, radiogroup, textbox, numberbox, lookup, datebox, textarea.
 *  - etiqueta: texto visible del parámetro (vacío cuando el control no tiene etiqueta propia,
 *    p. ej. los anchos de Datos de terceros/productos). En radiogroup es el título de la sección.
 *  - sección: título de la sección donde está el control (.erp-form-section-title).
 *  - marcas: D = deshabilitado aun en modo Editar (se valida que siga así, no se pulsa).
 *  - opciones: solo radiogroup, separadas por ';'.
 *
 * Varias etiquetas se ven con asteriscos literales ("**Superior**"): es un defecto de la interfaz
 * (Markdown sin interpretar). Se dejan tal cual se ven; ver PERMITIR_ASTERISCOS en HelpersParametros360.js.
 */

export const PESTANAS_PARAMETROS = {
    Admin: { nombre: 'General', subpestanas: [
        { id: null, nombre: null, contenido: 'tabs_parametros_content_Admin', campos: `
TxtParametrosGenerales_General_IntMargenSup|numberbox|**Superior**|Márgenes
TxtParametrosGenerales_General_IntMargenInf|numberbox|**Inferior**|Márgenes
TxtParametrosGenerales_General_IntMargenIzq|numberbox|**Izquierda**|Márgenes
TxtParametrosGenerales_General_IntMargenDer|numberbox|**Derecha**|Márgenes
TxtParametrosGenerales_General_BitAgrupaSeccion|checkbox|**Agrupa Sección**|Márgenes
TxtPrm_General_IntModoGral|radiogroup|Modo Contable|Modo Contable||Solo PCGA;Solo NIIF;Mixto
TxtPrm_General_StrFormatoIValor|textbox|Valor|Formatos Informes
TxtPrm_General_StrFormatoICantidad|textbox|Cantidad|Formatos Informes
TxtPrm_General_StrFormatoIPrecio|textbox|Precio|Formatos Informes
TxtParametrosGenerales_GenMaestros_LogoEnInformes|checkbox|**Logo en Informes**|Formatos Informes
TxtParametrosGenerales_GenMaestros_IntPlantillaDefault|checkbox|**Carga Plantilla Default**|Formatos Informes
TxtPrm_AdminGeneral_StrFormatoValor|textbox|Valor|Formatos Documento
TxtPrm_AdminGeneral_StrFormatoValorD|textbox|Valor D|Formatos Documento
TxtPrm_AdminGeneral_StrFormatoPrecio|textbox|Precio|Formatos Documento
TxtPrm_AdminGeneral_StrFormatoCantidad|textbox|Cantidad|Formatos Documento
TxtPrm_AdminGeneral_StrFormatoPorcentaje|textbox|Porcentaje|Formatos Documento
TxtPrm_AdminGeneral_IntDecimalesAdm|numberbox|Valor|Decimales Documento
TxtPrm_AdminGeneral_IntDecimalesAdmD|numberbox|Valor D|Decimales Documento
TxtPrm_AdminGeneral_IntDecimalesPrecio|numberbox|Precio|Decimales Documento
TxtPrm_AdminGeneral_IntDecimalesCan|numberbox|Cantidad|Decimales Documento
TxtPrm_AdminGeneral_IntDecimalesPorcentaje|numberbox|Porcentaje|Decimales Documento
TxtPrm_AdminPos_Banco|checkbox|Bancos en Forma de Pago|Punto de Venta
TxtPrm_AdminGeneral_IntFormatoTerceroPuntos|lookup|Puntos|Formatos de impresión
TxtParametrosGenerales_Pos_IntCreaMaestroPV|checkbox|Crea Maestro desde Doc|Maestros
TxtParametrosGenerales_GenMaestros_IntConcatenaNombreTercero|checkbox|**Concatena Nombre**|Maestros
TxtParametrosGenerales_GenMaestros_IntSeguridadEnCampos|checkbox|**Seguridad en Campos**|Maestros
TxtParametrosGenerales_GenMaestros_BitConsultaInactivos|checkbox|**Consulta Inactivos**|Maestros
TxtParametrosGenerales_GenMaestros_IntPermiteDatoCero|checkbox|**Permite Dato Cero (0) Doc**|Reglas Generales
TxtParametrosGenerales_GenMaestros_IntPermiteDatoCeroTbl|checkbox|**Permite Dato Cero (0) Maestros**|Reglas Generales
TxtParametrosGenerales_GenMaestros_BitMaximizaConsulta|checkbox|**Maximiza Consulta**|Reglas Generales
TxtParametrosGenerales_GenMaestros_IntImagenes|checkbox|**Almacena Imagen**|Reglas Generales
TxtParametrosGenerales_GenMaestros_bitEliminaAuditoria|checkbox|**Administrar Auditoria**|Reglas Generales|D
txtParametrosGenerales_GenMaestros_intMesesEliminacionAu|lookup|Meses|Reglas Generales
TxtParametrosGenerales_General_IntGridAltoTit|numberbox|**Título**|Documentos
TxtParametrosGenerales_General_IntGridAltoFila|numberbox|**Filas**|Documentos
TxtParametrosGenerales_GenMaestros_IntGridAltoAnchar|checkbox|**Auto Ancho**|Documentos
txtParametrosGenerales_Gen_IntPh|lookup|Personalización
TxtParametrosGenerales_General_IntDecimalesEnsamble|numberbox|Cantidad|Decimales Ensamble
TxtParametrosGenerales_ValidaCaso|checkbox|Valida Vigencia Contrato
TxtParametrosGenerales_GenMaestros_IntInformacionXempresa|checkbox|Información por Empresa
TxtParametrosGenerales_General_IntTiempoTareas|numberbox|**Tiempo Tareas**` }
    ] },

    Params: { nombre: 'Parámetros', subpestanas: [
        { id: null, nombre: null, contenido: 'tabs_parametros_content_Params', campos: `
TxtParametrosGenerales_Params_StrTerceroDato0|textbox|Dato 0|Terceros
TxtParametrosGenerales_Params_IntTerceroAnchoDato0|numberbox||Terceros
TxtParametrosGenerales_Params_StrTerceroDato1|textbox|Dato 1|Terceros
TxtParametrosGenerales_Params_IntTerceroAnchoDato1|numberbox||Terceros
TxtParametrosGenerales_Params_StrTerceroDato2|textbox|Dato 2|Terceros
TxtParametrosGenerales_Params_IntTerceroAnchoDato2|numberbox||Terceros
TxtParametrosGenerales_Params_StrTerceroDato3|textbox|Dato 3|Terceros
TxtParametrosGenerales_Params_IntTerceroAnchoDato3|numberbox||Terceros
TxtParametrosGenerales_Params_StrTerceroDato4|textbox|Dato 4|Terceros
TxtParametrosGenerales_Params_IntTerceroAnchoDato4|numberbox||Terceros
TxtParametrosGenerales_Params_StrTerceroDato5|textbox|Dato 5|Terceros
TxtParametrosGenerales_Params_IntTerceroAnchoDato5|numberbox||Terceros
TxtParametrosGenerales_Params_StrTerceroDato6|textbox|Dato 6|Terceros
TxtParametrosGenerales_Params_IntTerceroAnchoDato6|numberbox||Terceros
TxtParametrosGenerales_Params_StrTerceroDato7|textbox|Dato 7|Terceros
TxtParametrosGenerales_Params_IntTerceroAnchoDato7|numberbox||Terceros
TxtParametrosGenerales_Params_StrTerceroDatoN1|textbox|Dato N1|Terceros
TxtParametrosGenerales_Params_IntTerceroAnchoDatoN1|numberbox||Terceros
TxtParametrosGenerales_Params_StrTerceroDatoN2|textbox|Dato N2|Terceros
TxtParametrosGenerales_Params_IntTerceroAnchoDatoN2|numberbox||Terceros
TxtParametrosGenerales_Params_BitTerceroConsultaDato1|checkbox|Consulta Dato1|Terceros
TxtParametrosGenerales_Params_IntMaestrosMemoria|checkbox|Maestros en Memoria|Terceros
TxtParametrosGenerales_Params_StrNombreContactoTecnico1|textbox|Dato 8|Terceros
TxtParametrosGenerales_Params_StrNombreContactoTecnico2|textbox|Dato 9|Terceros
TxtParametrosGenerales_Params_StrNombreContactoTecnico3|textbox|Dato 10|Terceros
TxtParametrosGenerales_Params_StrNombreContactoTecnico4|textbox|Dato 11|Terceros
TxtParametrosGenerales_Params_StrNombreContactoTecnico5|textbox|Dato 12|Terceros
TxtParametrosGenerales_Params_StrTerceroParametro1|textbox|Parámetro 1|Terceros
TxtParametrosGenerales_Params_StrTerceroParametro2|textbox|Parámetro 2|Terceros
TxtParametrosGenerales_Params_StrTerceroParametro3|textbox|Parámetro 3|Terceros
TxtParametrosGenerales_Params_StrTerceroParametro4|textbox|Parámetro 4|Terceros
TxtParametrosGenerales_Params_StrTerceroParametro5|textbox|Parámetro 5|Terceros
TxtParametrosGenerales_Params_StrParam1Producto|textbox|Dato 1|Productos
TxtParametrosGenerales_Params_IntParam1ProductoAncho|numberbox||Productos
TxtParametrosGenerales_Params_StrParam2Producto|textbox|Dato 2|Productos
TxtParametrosGenerales_Params_IntParam2ProductoAncho|numberbox||Productos
TxtParametrosGenerales_Params_StrParam3Producto|textbox|Dato 3|Productos
TxtParametrosGenerales_Params_IntParam3ProductoAncho|numberbox||Productos
TxtParametrosGenerales_Params_StrParam4Producto|textbox|Dato 4|Productos
TxtParametrosGenerales_Params_IntParam4ProductoAncho|numberbox||Productos
TxtParametrosGenerales_Params_StrParam5Producto|textbox|Dato 5|Productos
TxtParametrosGenerales_Params_IntParam5ProductoAncho|numberbox||Productos
TxtParametrosGenerales_Params_StrParam6Producto|textbox|Dato 6|Productos
TxtParametrosGenerales_Params_IntParam6ProductoAncho|numberbox||Productos
TxtParametrosGenerales_Params_StrParam7Producto|textbox|Dato 7|Productos
TxtParametrosGenerales_Params_IntParam7ProductoAncho|numberbox||Productos
TxtParametrosGenerales_Params_StrParam8Producto|textbox|Dato 8|Productos
TxtParametrosGenerales_Params_IntParam8ProductoAncho|numberbox||Productos
TxtParametrosGenerales_Params_StrParam9Producto|textbox|Dato 9|Productos
TxtParametrosGenerales_Params_IntParam9ProductoAncho|numberbox||Productos
TxtParametrosGenerales_Params_BitProductoConsultaCodAlt|checkbox|Consulta Código Alterno|Productos
TxtParametrosGenerales_Params_IntLabel1Doc|lookup|Campo 1|Mostrar en documentos
TxtParametrosGenerales_Params_IntLabel2Doc|lookup|Campo 2|Mostrar en documentos
TxtParametrosGenerales_Params_IntLabel3Doc|lookup|Campo 3|Mostrar en documentos
TxtParametrosGenerales_Params_StrDocParametro1|textbox|ParamDoc 1|Mostrar en documentos
TxtParametrosGenerales_Params_StrProductoParametro1|textbox|Parámetro 1|Productos
TxtParametrosGenerales_Params_StrProductoParametro2|textbox|Parámetro 2|Productos
TxtParametrosGenerales_Params_StrProductoParametro3|textbox|Parámetro 3|Productos
TxtParametrosGenerales_Params_StrProductoParametro4|textbox|Parámetro 4|Productos
TxtParametrosGenerales_Params_StrProductoParametro5|textbox|Parámetro 5|Productos
TxtParametrosGenerales_Params_StrProductoParametro6|textbox|Parámetro 6|Productos
TxtParametrosGenerales_Params_IntF4ListasDePrecio|checkbox|Lista de Precios F4|Productos
TxtParametrosGenerales_Params_StrF4Dato1|lookup|Campo 1|Cargar con F4
TxtParametrosGenerales_Params_StrF4Dato2|lookup|Campo 2|Cargar con F4
TxtParametrosGenerales_Params_IntF4TodasListas|checkbox|Todas las listas de precio|Cargar con F4
TxtParametrosGenerales_Params_StrF8Dato1|lookup|Campo 1|Cargar con F6
TxtParametrosGenerales_Params_StrF8Dato2|lookup|Campo 2|Cargar con F6
TxtParametrosGenerales_Params_IntF8SoloBodega|checkbox|Solo Bodega|Cargar con F6
TxtParametrosGenerales_Params_IntF6TodasListas|checkbox|Todas las listas de precio|Cargar con F6
TxtParametrosGenerales_Params_IntF6ProdutosSinSaldo|checkbox|Muestra productos sin saldo|Cargar con F6` }
    ] },

    Administrativo: { nombre: 'Administrativo', subpestanas: [
        { id: 'tabs_parametrosAdmin_Inventarios', nombre: 'Inventarios', contenido: 'tabs_parametrosAdmin_content_Inventarios', campos: `
TxtParametrosGenerales_KardexPorDefecto|checkbox|Kardex por defecto|Inventarios
TxtParametrosGenerales_PrimeroEntradas|checkbox|Primero entradas|Inventarios
TxtParametrosGenerales_ValidaCosteoSalidas|checkbox|Valida costeo salidas|Inventarios
TxtParametrosGenerales_CostoSaldoNegativo|checkbox|Costo con Saldo Negativo|Inventarios
TxtParametrosGenerales_CostoBodega|checkbox|Costo por Bodega|Inventarios
TxtParametrosGenerales_Valuacion|radiogroup|Valuación|Valuación||Promedio ponderado;Último costo
TxtParametrosGenerales_Costeo|radiogroup|Costeo|Costeo||Desactivo;Registro;Documento
TxtParametrosGenerales_IntInventarioLote|checkbox|Lote|Saldos
TxtParametrosGenerales_StrNombreLote|textbox|Nombre lote|Saldos
TxtParametrosGenerales_IntInvTalla|checkbox|Talla|Saldos
TxtParametrosGenerales_StrInvDesTalla|textbox|Desc. talla|Saldos
TxtParametrosGenerales_IntInvColor|checkbox|Color|Saldos
TxtParametrosGenerales_StrInvDesColor|textbox|Desc. color|Saldos
TxtParametrosGenerales_GenInv_IntInvUbicacion|checkbox|**Ubicación**|Saldos
TxtParametrosGenerales_IntFechaLote|checkbox|Fecha Vence|Maneja en lote
TxtParametrosGenerales_GenInv_IntUbicacionLote|checkbox|**Ubicación**|Maneja en lote
TxtParametrosGenerales_GenInv_IntPesoLote|checkbox|**Peso**|Maneja en lote
TxtParametrosGenerales_IntCostoLote|checkbox|Costo x Lote|Maneja en lote
TxtParametrosGenerales_GenInv_IntUltUbicacionLote|checkbox|**Ultima Ubicación**|Maneja en lote
TxtParametrosGenerales_IntFactorLote|checkbox|Factor|Maneja en lote
TxtParametrosGenerales_GenInv_IntUsuarioLote|checkbox|**Usuario Ubicación**|Maneja en lote
TxtParametrosGenerales_IncluyeDescuento|checkbox|Incluye Descuento|Costeo
TxtParametrosGenerales_PorDivision|checkbox|Por División|Costeo
TxtParametrosGenerales_UtilidadVenta|checkbox|% Utilidad Sobre Venta|Costeo
TxtParametrosGenerales_PrecioCosto|checkbox|Precio 1% Costo
TxtParametrosGenerales_ActualizacionAutomatica|checkbox|Actualización Automática
TxtParametrosGenerales_Redondear|lookup|Redondear
TxtParametrosGenerales_IntPedidosXBodega|checkbox|Por Bodega|Pedidos
TxtParametrosGenerales_IntPedidosXLote|checkbox|Por Lote|Pedidos
TxtParametrosGenerales_IntPedidosXSerie|checkbox|Por Serie|Pedidos
TxtParametrosGenerales_IntPedidosXDctoRef|checkbox|Por Doc Ref|Pedidos
TxtParametrosGenerales_IntPedidosXVinculado|checkbox|Por Dependencia|Pedidos
TxtParametrosGenerales_IntPedidosXTalla|checkbox|Por Talla|Pedidos
TxtParametrosGenerales_IntPedidosXColor|checkbox|Por Color|Pedidos
TxtParametrosGenerales_IntPedidosSoloSaldo|checkbox|Solo Saldos|Pedidos
TxtParametrosGenerales_IntPedidoParcial|checkbox|Parciales|Pedidos
TxtParametrosGenerales_IntPedidoIniciaEnPeriodo|checkbox|Inicia en Periodo|Pedidos
TxtParametrosGenerales_IntPedidosXSerie1|checkbox|Serie 1|Pedidos
TxtParametrosGenerales_IntPedidoCargaCeros|checkbox|Carga Ceros|Pedidos
TxtParametrosGenerales_IntPedidoIgnoraNegativos|checkbox|Ignora Negativos|Pedidos
TxtParametrosGenerales_IntPedidosSoloTercero|checkbox|Solo Tercero|Pedidos
TxtParametrosGenerales_CtlExistenciasPedidos|radiogroup|Control saldo pedidos|Control saldo pedidos||No;Alerta;Bloqueo` },
        { id: 'tabs_parametrosAdmin_Cartera', nombre: 'Cartera', contenido: 'tabs_parametrosAdmin_content_Cartera', campos: `
TxtParametrosGenerales_CarteraFormaCxC|radiogroup|Forma CxC|Forma CxC||General;Cuotas;Grupo;Tipo
TxtParametrosGenerales_CarteraFormaCxP|radiogroup|Forma CxP|Forma CxP||General;Cuotas;Grupo;Tipo
TxtParametrosGenerales_DiasBloqueo|numberbox|Dias|Control Dias
TxtParametrosGenerales_ControlDias|radiogroup|Control Dias|Control Dias||No;Alerta;Bloqueo
TxtInteresesPorFraccion|checkbox|Por Fracción|Intereses
TxtInteresesEnPago|checkbox|En Pago|Intereses
TxtParametrosGenerales_TipoCartera|checkbox|Tipo Cartera
TxtParametrosGenerales_IntInfColumna1|numberbox|Columna 1|Reporte Cartera
TxtParametrosGenerales_IntInfColumna1_1|numberbox|A|Reporte Cartera
TxtParametrosGenerales_IntInfColumna2|numberbox|Columna 2|Reporte Cartera
TxtParametrosGenerales_IntInfColumna2_1|numberbox|A|Reporte Cartera
TxtParametrosGenerales_IntInfColumna3|numberbox|Columna 3|Reporte Cartera
TxtParametrosGenerales_IntInfColumna3_1|numberbox|A|Reporte Cartera
TxtParametrosGenerales_IntInfColumna4|numberbox|Columna 4|Reporte Cartera
TxtParametrosGenerales_IntInfColumna4_1|numberbox|A|Reporte Cartera
TxtParametrosGenerales_IntInfColumna5|numberbox|Columna 5|Reporte Cartera
TxtParametrosGenerales_IntInfColumna5_1|numberbox|A|Reporte Cartera
TxtParametrosGenerales_Cartera6Col|checkbox|6 Columnas|Reporte Cartera
TxtParametrosGenerales_IntInfColumna6|numberbox|Columna 6 > A|Reporte Cartera
TxtParametrosGenerales_StrCargoCartera|lookup|Cargo|Reporte Cartera` },
        { id: 'tabs_parametrosAdmin_Documentos', nombre: 'Documentos', contenido: 'tabs_parametrosAdmin_content_Documentos', campos: `
TxtParametrosGenerales_StrIvaGeneral|lookup|Iva General
TxtParametrosGenerales_IntRestaNotasComisiones|checkbox|Resta Notas|Comisiones
TxtParametrosGenerales_IntImprimeComisionCero|checkbox|Imprime Recaudo Cero|Comisiones
TxtParametrosGenerales_IntComisionFechaVence|checkbox|Fecha Vence|Comisiones
TxtParametrosGenerales_IntComisionRecProC|checkbox|Recaudo por Tipo|Comisiones
TxtParametrosGenerales_IntDescLista|checkbox|Descuento Lista|Documentos
TxtParametrosGenerales_StrDescSerie|textbox|Serie|Documentos
TxtParametrosGenerales_StrDescSerie1|textbox|Serie 1|Documentos
TxtParametrosGenerales_StrDescSerie2|textbox|Serie 2|Documentos
TxtParametrosGenerales_StrDescSerie3|textbox|Serie 3|Documentos
TxtParametrosGenerales_CausacionImpuestos|checkbox|Impuestos en Detalle|Causaciones
TxtParametrosGenerales_IntCausacionClaseEnDetalle|checkbox|Clase en Detalle|Causaciones
TxtParametrosGenerales_IntReteIcaDetalle|checkbox|ReteIca en Detalle|Causaciones` }
    ] },

    Contable: { nombre: 'Contable', subpestanas: [
        { id: null, nombre: null, contenido: 'tabs_parametros_content_Contable', campos: `
TxtPrm_Contable_IntInterfazLinea|checkbox|Contabilización en Línea
TxtPrm_Contable_IntIndirectosXtercero|checkbox|Indirectos por Tercero
TxtPrm_Contable_IntTercero2|checkbox|Tercero 2
TxtPrm_Contable_IntActualizaValorConBase|checkbox|Actualiza Vr Con Base
TxtPrm_Contable_IntConCuadra|checkbox|Cuadra Documentos
TxtPrm_Contable_IntDescuadreInterfaz|checkbox|Descuadre Interfaz
TxtPrm_Contable_IntMaestrosXempresa|checkbox|Maestro por empresas
TxtPrm_Contable_IntPasaValorCero|checkbox|Pasa Valor Cero
TxtPrm_Contable_StrDetCarteraCtaGasto|lookup|Cta Gasto|Deterioro Cartera
TxtPrm_Contable_StrDetCarteraCtaDeterioro|lookup|Cta Deterioro|Deterioro Cartera
TxtParametrosGenerales_Params_IntTipoArchivoPlano|lookup|Tipo Archivo Plano|Deterioro Cartera
TxtParametrosGenerales_Params_IntBloqueoDocumentoInterfaz|lookup|Bloqueo Documentos|Deterioro Cartera
TxtPrm_Contable_IntDecimalesCon|numberbox|Decimales|Valores
TxtPrm_Contable_StrFormatoValorContable|textbox|Formato|Valores
TxtPrm_Contable_IntFormatoDocumentoCon|lookup|Formato de impresión
TxtPrm_Contable_StrRepLegal|lookup|Rep. Legal
TxtPrm_Contable_StrContador|lookup|Contador
TxtPrm_Contable_StrTerceroDian|lookup|Tercero Dian
TxtPrm_Contable_StrRevisorFiscal|lookup|Revisor Fiscal
TxtParametrosGenerales_Params_StrNombreActParametro1|textbox|Parametro 1|Activos Fijos` }
    ] },

    Nomina: { nombre: 'Nómina', subpestanas: [
        { id: 'tabs_parametrosNom_General', nombre: 'General', contenido: 'tabs_parametrosNom_content_General', campos: `
TxtPrm_Nomina_StrArp|lookup|ARL
TxtPrm_Nomina_StrNovedadProducto|lookup|Producto
TxtPrm_Nomina_StrProductoSeguridadSocial|lookup|P. Seg. Social
TxtPrm_Nomina_StrProdutoPrestacionesSociales|lookup|P. Pres. Social
TxtPrm_Nomina_IntInTerValo|radiogroup|Intervalo|Intervalo||Semanal;Decadal;Catorcenal;Quincenal;Mensual
TxtPrm_Nomina_IntPeriodosNom|numberbox|Periodos
TxtPrm_Nomina_IntDecimalesNom|numberbox|Decimales
TxtPrm_Nomina_IntNaturalezaJuridica|lookup|Naturaleza Jurídica
TxtPrm_Nomina_StrCondicionEspecial|textbox|Condición Especial
TxtPrm_Nomina_IntFormulasLiqDef|checkbox|Formulas|Liquidación Definitiva
TxtPrm_Nomina_IntFormatoDocumentoNom|lookup|Formato planilla|Formatos de impresión
TxtPrm_Nomina_IntFormatoPrima|lookup|Formato prima|Formatos de impresión
TxtPrm_Nomina_IntFormatoCesantias|lookup|Formato cesantías|Formatos de impresión
TxtPrm_Nomina_IntFormatoCesantiasAnt|lookup|Formato cesantías anticipadas|Formatos de impresión
TxtPrm_Nomina_IntFormatoLiquidacionDef|lookup|Formato liquidación definitiva|Formatos de impresión
TxtPrm_Nomina_IntFormatoCertificadoLab|lookup|Formato certificado laboral|Formatos de impresión
TxtPrm_Nomina_IntFormatoSaldoContable|lookup|Formato saldo contable|Formatos de impresión
TxtPrm_Nomina_StrFormatoCantidadN|textbox|Cantidad|Formatos
TxtPrm_Nomina_StrFormatoValorN|textbox|Valor|Formatos
TxtPrm_Nomina_IntCuentaDia31Vac|checkbox|Cuenta dia 31|Vacaciones
TxtPrm_Nomina_IntPagaDia31Vac|checkbox|Paga dia 31|Vacaciones
TxtPrm_Nomina_IntFestivosVacComp|checkbox|Festivos en Comp|Vacaciones
TxtPrm_Nomina_IntVacAnticipadas|checkbox|Pago Anticipado|Vacaciones
TxtPrm_Nomina_IntFestivoVacaciones|checkbox|Festivos en Vacaciones|Vacaciones
TxtPrm_Nomina_IntVacOtroPeriodo|checkbox|Pago en Otro Periodo|Vacaciones
TxtPrm_Nomina_IntVacPromBasico|checkbox|Promedio + Básico|Vacaciones
TxtPrm_Nomina_IntVacacionesNomina|checkbox|Vacaciones en Nómina|Vacaciones
TxtPrm_Nomina_IntDedVacacionesIBC|checkbox|Deduccion Seg. Social|Vacaciones
TxtPrm_Nomina_IntCargaVac|radiogroup|Vacaciones|Vacaciones||Compensadas;Periodo Fiscal
TxtPrm_Nomina_IntPrimaAuxTte|checkbox|Prima|Aux Transporte
TxtPrm_Nomina_IntCesantiasAuxTte|checkbox|Cesantias|Aux Transporte
TxtPrm_Nomina_IntNovedadesPeriodo|checkbox|Tiempo x Periodo|Novedades
TxtPrm_Nomina_IntLiqPorFecha|checkbox|Fecha|Novedades
TxtPrm_Nomina_IntRecargoNovedad|checkbox|Recargo|Novedades
TxtPrm_Nomina_IntVlrFondoSolidaridad|checkbox|Vlr Base F. Solidaridad y Rte Fte|Novedades
TxtPrm_Nomina_IntDestajo|checkbox|Destajo|Novedades
TxtPrm_Nomina_IntIdentificacionAlt|checkbox|Identificacion alterna|Novedades
TxtPrm_Nomina_IntLey1429|checkbox|Ley 1429|Seguridad Social
TxtPrm_Nomina_IntLey1604|checkbox|Ley 1607|Seguridad Social
TxtPrm_Nomina_DatFechaExoneracion|datebox|Fecha|Seguridad Social
TxtPrm_Nomina_IntTipoAportante|lookup|Tipo Aportante|Seguridad Social
TxtPrm_Nomina_IntAportesSLN|lookup|Aportes en Novedad|Seguridad Social
TxtPrm_Nomina_IntAjustaDias|checkbox|Ajusta Días En Planilla|Seguridad Social
TxtPrm_Nomina_IntIbcVacacionesMes|checkbox|Vacaciones IBC del Mes|Seguridad Social
TxtPrm_Nomina_IntVacacionesIBCParafiscales|checkbox|Vacaciones Base Parafiscales|Seguridad Social
TxtPrm_Nomina_IntRegimenEspPlanU|checkbox|Regimen Especial Parafiscales|Seguridad Social
TxtPrm_Nomina_IntDeduccionRteFte|checkbox|Deducción del Salario|Rte Fte` },
        { id: 'tabs_parametrosNom_Conceptos', nombre: 'Conceptos', contenido: 'tabs_parametrosNom_content_Conceptos', campos: `
TxtPrm_Nomina_StrConceptoBasico|lookup|Básico
TxtPrm_Nomina_StrConceptoBasicoTurno|lookup|Básico Turno
TxtPrm_Nomina_StrCHorasOD|lookup|Horas OD
TxtPrm_Nomina_StrCHorasON|lookup|Horas ON
TxtPrm_Nomina_StrCHorasFD|lookup|Horas FD
TxtPrm_Nomina_StrCHorasFN|lookup|Horas FN
TxtPrm_Nomina_StrCHorasED|lookup|Horas ED
TxtPrm_Nomina_StrCHorasEN|lookup|Horas EN
TxtPrm_Nomina_StrConceptoEG|lookup|EG Inicial
TxtPrm_Nomina_IntDiasEGInicial|numberbox|Días
TxtPrm_Nomina_StrConceptoEGFinal|lookup|EG Final
TxtPrm_Nomina_StrConceptoLM|lookup|LM
TxtPrm_Nomina_StrConceptoLNR|lookup|LNR
TxtPrm_Nomina_StrConceptoAUS|lookup|AUS
TxtPrm_Nomina_StrConceptoAT|lookup|AT
TxtPrm_Nomina_StrCHorasEFD|lookup|Horas EFD
TxtPrm_Nomina_StrCHorasEFN|lookup|Horas EFN
TxtPrm_Nomina_StrConceptoCesantias|lookup|Cesantías
TxtPrm_Nomina_StrConceptoIntCesantias|lookup|Int Cesantías
TxtPrm_Nomina_StrConceptoPrima|lookup|Prima
TxtPrm_Nomina_StrConceptoIndemnizacion|lookup|Indemnización
TxtPrm_Nomina_StrConceptoVacaciones|lookup|Vacaciones
TxtPrm_Nomina_StrConceptoVacacionesCom|lookup|Vacaciones C.
TxtPrm_Nomina_StrConceptoVacacionesDef|lookup|Vacaciones C. Def
TxtPrm_Nomina_StrConceptoVacacionesAnt|lookup|Vacaciones Año Ant.
TxtPrm_Nomina_StrConceptoVacaAnticipada|lookup|Vacaciones Anticipadas
TxtPrm_Nomina_StrConceptoPriVac|lookup|Prima de Vacaciones
TxtPrm_Nomina_StrConceptoApoyoSostenimiento|lookup|Apoyo Sostenimiento
TxtPrm_Nomina_IntVacNominaE|radiogroup|Prestaciones NominaE|Prestaciones NominaE||Vacaciones Disfrutadas;Vacaciones Compensadas` },
        { id: 'tabs_parametrosNom_Dispositivos', nombre: 'Dispositivos', contenido: 'tabs_parametrosNom_content_Dispositivos', campos: '' }
    ] },

    Pos: { nombre: 'Pos', subpestanas: [
        { id: null, nombre: null, contenido: 'tabs_parametros_content_Pos', campos: `
TxtParametrosGenerales_Pos_Parametro1|textbox|Parámetro 1|Punto de Venta
TxtParametrosGenerales_Pos_Parametro2|textbox|Parámetro 2|Punto de Venta
TxtParametrosGenerales_Pos_Formato|lookup|Formato|Punto de Venta
TxtParametrosGenerales_Pos_IntTempxUsuario|checkbox|Temporales por usuario|Punto de Venta
TxtParametrosGenerales_Pos_IntPBalanza|lookup|Puerto|Puerto Serial
TxtParametrosGenerales_Pos_IntPBalanzaBs|lookup|Bits/Seg|Puerto Serial
TxtParametrosGenerales_Pos_IntPBalanzaBDatos|lookup|Bits de datos|Puerto Serial
TxtParametrosGenerales_Pos_IntPBalanzaParidad|lookup|Paridad|Puerto Serial
TxtParametrosGenerales_Pos_IntPBalanzaBParada|lookup|Bit de parada|Puerto Serial` }
    ] },

    CRM: { nombre: 'CRM', subpestanas: [
        { id: null, nombre: null, contenido: 'tabs_parametros_content_CRM', campos: `
TxtPrm_AdminCRM_Parametro1|textbox|Parámetro 1|Oportunidades
TxtPrm_AdminCRM_Parametro2|textbox|Parámetro 2|Oportunidades
TxtPrm_AdminCRM_Parametro3|textbox|Parámetro 3|Agenda
TxtPrm_AdminCrm_MostrarTransDoc|checkbox|Mostrar Transacción y Documento|Casos
TxtPrm_AdminCrm_MostrarFecVen|checkbox|Mostrar Fecha Vencimiento|Casos
TxtPrm_AdminCrm_ModFechas|checkbox|Modificar Fechas|Casos
TxtPrm_AdminCrm_Fecha1|checkbox|Fecha 1|Casos
TxtPrm_AdminCRM_DesFecha1|textbox||Casos
TxtPrm_AdminCrm_Fecha2|checkbox|Fecha 2|Casos
TxtPrm_AdminCRM_DesFecha2|textbox||Casos
TxtPrm_AdminCrm_Fecha3|checkbox|Fecha 3|Casos
TxtPrm_AdminCRM_DesFecha3|textbox||Casos
TxtPrm_AdminCrm_Fecha4|checkbox|Fecha 4|Casos
TxtPrm_AdminCRM_DesFecha4|textbox||Casos
TxtPrm_AdminCRM_Parametro4|textbox|Parámetro 4|Casos
TxtPrm_AdminCrm_ColorEstado|lookup|Color Grid|Casos
txtCRM_TblActividadDef|lookup|Actividad|Parámetros por defecto
txtCRM_TblCausasDef|lookup|Causa|Parámetros por defecto
txtCRM_TblDiagnosticosDef|lookup|Diagnóstico|Parámetros por defecto
txtCRM_TblTiposEventoDef|lookup|Tipo Evento|Parámetros por defecto
txtCRM_TblNivelEventoDef|lookup|Nivel|Parámetros por defecto
txtCRM_TblEstadosDef|lookup|Estado|Parámetros por defecto
txtCRM_TblReferenciasDef|lookup|Referencia|Parámetros por defecto
txtCRM_TblEstadosCierre|lookup|Estado Caso|Parámetros por defecto` }
    ] },

    Movil: { nombre: 'Móvil / Servicios', subpestanas: [
        { id: null, nombre: null, contenido: 'tabs_parametros_content_Movil', campos: `
TxtParametrosGenerales_Movil_IntMovilCampo1|lookup|Campo 1|Campos Visibles Producto
TxtParametrosGenerales_Movil_IntMovilCampo2|lookup|Campo 2|Campos Visibles Producto
TxtParametrosGenerales_Movil_IntMovilCampo3|lookup|Campo 3|Campos Visibles Producto
TxtParametrosGenerales_Movil_IntMovilCampo4|lookup|Campo 4|Campos Visibles Producto
TxtParametrosGenerales_Movil_IntTiempoSincronizacion|lookup|Tiempo Sincronizacion GPS
TxtParametrosGenerales_Movil_IntMostrarSaldoCero|checkbox|Muestra saldos Cero
TxtParametrosGenerales_Movil_IntEstadoPedidoMovil|checkbox|Ultimo Estado del pedido
TxtParametrosGenerales_Movil_IntTiempoToken|numberbox|Tiempo|Servicios Web` }
    ] },

    PH: { nombre: 'PH', subpestanas: [
        { id: null, nombre: null, contenido: 'tabs_parametros_content_PH', campos: `
txtParametrosGenerales_Gen_IntPhTerceroAux|lookup|Tercero Aux|Ph
TxtParametrosGenerales_General_IntPhTiempoAsamblea|numberbox|Tiempo Asamblea|Ph
TxtParametrosGenerales_GenMaestros_PhFacturaxInmueble|checkbox|Factura por Inmueble / Doc|Ph
txtParametrosGenerales_Gen_IntDocVal1|lookup|Valor 1|Documentos
txtParametrosGenerales_Gen_IntDocVal2|lookup|Valor 2|Documentos
txtParametrosGenerales_Gen_IntDocVal3|lookup|Valor 3|Documentos
txtParametrosGenerales_Gen_IntDocVal4|lookup|Valor 4|Documentos
TxtParametrosGenerales_Gen_IntDocValST|checkbox|Solo Transacción|Documentos
txtParametrosGenerales_Gen_IntIncentivoModo|lookup|Modo|Incentivos
TxtParametros_IntIncentivoPorDia|numberbox|% Día|Incentivos
TxtTransaccion_IntIncentivoPorFestivo|numberbox|% Festivo|Incentivos
TxtParametros_General_TblIncentivoProducto|lookup|Producto|Incentivos
TxtParametrosGenerales_GenMaestros_IntOperacionIncentivo|checkbox|Suma Incentivo|Incentivos
TxtParametrosGenerales_General_IntDecimalesVotos|numberbox|Votos|Decimales
TxtParametrosGenerales_GenMaestros_IntSepararIntereses|checkbox|Separar Intereses|Decimales
TxtParametrosGenerales_GenMaestros_IntFacturaxIva|checkbox|Factura por Tarifa de IVA|Decimales` }
    ] },

    Defecto: { nombre: 'Defecto', subpestanas: [
        { id: null, nombre: null, contenido: 'tabs_parametros_content_Defecto', campos: `
PG_TerceroDef|lookup|Tercero|Tercero
PG_TipoIdDefecto|lookup|Tipo de identificación|Tercero
PG_DireccionDef|textbox|Dirección|Tercero
txtPG_EmailFE|textbox|Email Factura Electrónica|Tercero
PG_TelefonoDef|textbox|Teléfono|Tercero
txtPG_CodPostalDIANDef|lookup|Código postal|Tercero
PG_RegimenDef|lookup|Régimen|Tercero
PG_TipoPersonaDef|lookup|Tipo Persona
txtPG_TipoTercero|lookup|Tipo de tercero
txtPG_Vendedor|lookup|Vendedor
txtPG_Ciudad|lookup|Ciudad
txtPG_Sector|lookup|Sector
txtPG_Barrio|lookup|Barrio
txtPG_Entidad|lookup|Entidad financiera
txtPG_Sucursal|lookup|Sucursal|General
txtPG_CCosto|lookup|Centro de costo|General
txtPG_SubCCosto|lookup|Subcentro de costo|General
txtPG_Lineas|lookup|Línea|Productos
txtPG_Grupo|lookup|Grupo|Productos
txtPG_Unidad|lookup|Unidad|Productos
txtPG_TarifaIva|lookup|Tarifa IVA|Productos
txtPG_FormasDePagoDef|lookup|Forma Pago|Pagos
txtPG_TblCptoCambioMoneda|lookup|Cambio Moneda Débito|Pagos
txtPG_TblCptoCambioMonedaCred|lookup|Cambio Moneda Crédito|Pagos` }
    ] },

    Mensajes: { nombre: 'Mensajes', subpestanas: [
        { id: null, nombre: null, contenido: 'tabs_parametros_content_Mensajes', campos: '' }
    ] },

    Plantilla: { nombre: 'Plantillas', subpestanas: [
        { id: null, nombre: null, contenido: 'tabs_parametros_content_Plantilla', campos: '' }
    ] }
};

/** Grids de la pantalla (CRUD por popup "Edit form"; cada fila se guarda sola, sin el Guardar general). */
export const GRIDS_PARAMETROS = {
    Mensajes: {
        pestana: 'Mensajes', subpestana: null, grid: 'ParametrosGeneralesCorreos', titulo: 'Mensajes de parámetros',
        columnas: ['Gestión', 'Tipo', 'Email Remite', 'Nombre Remite', 'Cuenta', 'Email CCO']
    },
    Plantillas: {
        pestana: 'Plantilla', subpestana: null, grid: 'gridParametrosGeneralesPlantillas', titulo: 'Plantillas de parámetros',
        columnas: ['Gestión', 'Plantilla', 'Título', 'Mensaje']
    },
    NominaDispositivos: {
        pestana: 'Nomina', subpestana: 'tabs_parametrosNom_Dispositivos', grid: 'Grid_ParametrosGenerales_Nomina_Dispositivos',
        titulo: 'Dispositivos de nómina',
        columnas: ['Gestión', 'Código', 'Descripción', 'IP', 'Modelo', 'Puerto', 'Contraseña']
    },
    PosPendientes: {
        pestana: 'Pos', subpestana: null, grid: 'Grid_ParametrosGenerales_Pos_Pendientes', titulo: 'Pendientes de punto de venta',
        columnas: ['Gestión', 'Documento']
    }
};

/** Convierte el texto de `campos` en objetos { id, tipo, etiqueta, seccion, deshabilitado, opciones }. */
export const camposDe = subpestana => String(subpestana.campos || '')
    .split('\n')
    .map(linea => linea.trim())
    .filter(Boolean)
    .map(linea => {
        const [id, tipo, etiqueta = '', seccion = '', marcas = '', opciones = ''] = linea.split('|');
        return {
            id, tipo, etiqueta, seccion,
            deshabilitado: marcas.includes('D'),
            opciones: opciones ? opciones.split(';') : []
        };
    });
