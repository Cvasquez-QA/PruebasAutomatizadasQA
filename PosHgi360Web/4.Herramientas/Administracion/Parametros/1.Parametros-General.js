import {
    CONFIG_PARAMETROS,
    conParametros360,
    antesDeCadaParametros,
    despuesDeCadaParametros
} from '../../../../Funciones/FlujoParametrosPos360.js';
import { validarPestanaParametros360, cambiarGuardarYRestaurar360 } from '../../../../Funciones/HelpersParametros360.js';

// Herramientas > Parámetros, pestañas General y Administrativo (Inventarios, Cartera, Documentos).
// test.hgi360.com, AutPos, 8902. Revisado en el navegador el 29-oct-2026.
//  - Nombres: valida que existan todos los parámetros con su etiqueta, sección y opciones; que sin Editar estén en
//    solo lectura y que en modo edición respondan al clic sin dejar cambios (Guardar sigue deshabilitado).
//  - Guardar: cambia algunos parámetros, guarda, valida lo guardado y restaura los valores originales.
// Antes las pruebas usaban ids que ya no existen (#txt_lista_..., iframes, "Sí" del aviso viejo) y restauraban
// valores fijos en vez de los que había. Ya no se cambia el Modo Contable (afecta toda la contabilidad).

fixture `Parámetros - General y Administrativo - Pos Web - Test Hgi360`
    .page(CONFIG_PARAMETROS.pagina)
    .beforeEach(antesDeCadaParametros)
    .afterEach(despuesDeCadaParametros);

test('Parámetros General - nombres y parámetros clickeables - Pos Web - Test Hgi360', async t => {
    await conParametros360(t, async () => {
        await validarPestanaParametros360(t, 'Admin');
    });
});

test('Parámetros Administrativo (Inventarios, Cartera, Documentos) - nombres y parámetros clickeables - Pos Web - Test Hgi360', async t => {
    await conParametros360(t, async () => {
        await validarPestanaParametros360(t, 'Administrativo');
    });
});

test('Parámetros General - guardar y restaurar - Pos Web - Test Hgi360', async t => {
    await conParametros360(t, async () => {
        await cambiarGuardarYRestaurar360(t, 'Admin', null, [
            { id: 'TxtPrm_General_StrFormatoIValor', tipo: 'texto', valor: 'n1', alterno: 'n3' },
            { id: 'TxtPrm_AdminGeneral_StrFormatoCantidad', tipo: 'texto', valor: 'n2', alterno: 'n4' },
            { id: 'TxtParametrosGenerales_GenMaestros_LogoEnInformes', tipo: 'check' }
        ]);
    });
});

test('Parámetros Administrativo > Inventarios - guardar y restaurar - Pos Web - Test Hgi360', async t => {
    await conParametros360(t, async () => {
        await cambiarGuardarYRestaurar360(t, 'Administrativo', 'tabs_parametrosAdmin_Inventarios', [
            { id: 'TxtParametrosGenerales_StrNombreLote', tipo: 'texto', valor: 'LoteQA', alterno: 'LoteQA2' },
            { id: 'TxtParametrosGenerales_KardexPorDefecto', tipo: 'check' }
        ]);
    });
});

test('Parámetros Administrativo > Cartera - guardar y restaurar - Pos Web - Test Hgi360', async t => {
    await conParametros360(t, async () => {
        await cambiarGuardarYRestaurar360(t, 'Administrativo', 'tabs_parametrosAdmin_Cartera', [
            { id: 'TxtParametrosGenerales_DiasBloqueo', tipo: 'texto', valor: '30', alterno: '31' },
            { id: 'TxtParametrosGenerales_ControlDias', tipo: 'radio', valor: 'Alerta', alterno: 'Bloqueo' }
        ]);
    });
});

test('Parámetros Administrativo > Documentos - guardar y restaurar - Pos Web - Test Hgi360', async t => {
    await conParametros360(t, async () => {
        await cambiarGuardarYRestaurar360(t, 'Administrativo', 'tabs_parametrosAdmin_Documentos', [
            { id: 'TxtParametrosGenerales_StrDescSerie', tipo: 'texto', valor: 'SerieQA', alterno: 'SerieQA2' },
            { id: 'TxtParametrosGenerales_StrDescSerie1', tipo: 'texto', valor: 'Serie1QA', alterno: 'Serie1QA2' },
            { id: 'TxtParametrosGenerales_IntDescLista', tipo: 'check' }
        ]);
    });
});
