import {
    CONFIG_PARAMETROS,
    conParametros360,
    antesDeCadaParametros,
    despuesDeCadaParametros
} from '../../../../Funciones/FlujoParametros360.js';
import {
    abrirPestanaParametros360,
    editarParametros360,
    validarColumnasGrid360,
    agregarFilaGrid360,
    editarFilaGrid360,
    escribirCampoPopupParametros,
    elegirOpcionLibrePopupParametros,
    guardarPopupParametros,
    eliminarFilaGridParametros360,
    eliminarFilaSiExisteParametros360,
    filaGridParametros,
    textosColumnaGrid360
} from '../../../../Funciones/HelpersParametros360.js';
import { GRIDS_PARAMETROS } from '../../../../Funciones/InventarioParametros360.js';

// Herramientas > Parámetros > Mensajes: CRUD del grid de correos (#ParametrosGeneralesCorreos).
// test.hgi360.com, AutAdmin, 8902. Revisado en el navegador el 29-oct-2026.
// - El popup "Mensajes de parámetros" tiene Tipo (Todos, Administrativo, Contable, Nomina, CRM, Servicios Web),
//   Email Remite, Nombre Remite, Cuenta y Email CCO. Cada fila se guarda sola ("Registro almacenado con éxito").
// - Hay un correo por Tipo: la prueba usa el primer Tipo que no esté en uso y lo borra al final.
// - La fila de la prueba se identifica por su Email Remite (EMAIL), así nunca toca los correos reales.
// - Ojo: quedó una fila "Administrativo | NuevoCorreoRemitente | NuevoNombreRemitente..." de la prueba anterior;
//   esta prueba no la toca (puede que haya reemplazado el correo real de Administrativo).

const GRID = GRIDS_PARAMETROS.Mensajes;
const EMAIL = 'qa.parametros@prueba.com';
const NOMBRE = 'QA Parametros';
const NOMBRE_EDITADO = 'QA Parametros editado';
const CUENTA = 'QACUENTA';
const EMAIL_CCO = 'qa.cco@prueba.com';

fixture `Parámetros - Mensajes - Test Hgi360`
    .page(CONFIG_PARAMETROS.pagina)
    .beforeEach(antesDeCadaParametros)
    .afterEach(despuesDeCadaParametros);

test('Parámetros Mensajes - CRUD de correos - Test Hgi360', async t => {
    await conParametros360(t, async () => {
        await editarParametros360(t);
        await abrirPestanaParametros360(t, GRID.pestana);
        await validarColumnasGrid360(t, GRID.grid, GRID.columnas);
        // Restos de una corrida anterior
        await eliminarFilaSiExisteParametros360(t, GRID.grid, EMAIL);

        // Tipo libre
        const usados = await textosColumnaGrid360(GRID.grid, 1);
        await agregarFilaGrid360(t, GRID.grid);
        const tipo = await elegirOpcionLibrePopupParametros(t, usados);
        await t.expect(tipo).ok(`Todos los tipos de correo ya están en uso (${usados.join(', ')}): no se puede crear uno de prueba`);

        // Crear (el tipo ya quedó elegido)
        await escribirCampoPopupParametros(t, 'StrMailEnvio', EMAIL);
        await escribirCampoPopupParametros(t, 'StrMailEnvioNombre', NOMBRE);
        await escribirCampoPopupParametros(t, 'StrCuentaEnvio', CUENTA);
        await escribirCampoPopupParametros(t, 'StrMailEnvioCCO', EMAIL_CCO);
        await guardarPopupParametros(t);
        const fila = filaGridParametros(GRID.grid, EMAIL);
        await t
            .expect(fila.with({ timeout: 15000 }).exists).ok('No aparece el correo creado')
            .expect(fila.find('td').withExactText(tipo).exists).ok(`El correo creado no quedó con el Tipo ${tipo}`)
            .expect(fila.find('td').withExactText(NOMBRE).exists).ok('El correo creado no quedó con el Nombre Remite');

        // Editar
        await editarFilaGrid360(t, GRID.grid, EMAIL);
        await escribirCampoPopupParametros(t, 'StrMailEnvioNombre', NOMBRE_EDITADO);
        await guardarPopupParametros(t);
        await t.expect(filaGridParametros(GRID.grid, EMAIL).find('td').withExactText(NOMBRE_EDITADO).with({ timeout: 15000 }).exists)
            .ok('No se guardó el Nombre Remite editado');

        // Eliminar
        await eliminarFilaGridParametros360(t, GRID.grid, EMAIL);
    });
});
