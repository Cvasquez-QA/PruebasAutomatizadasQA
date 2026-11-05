import { Selector } from 'testcafe';
import {
    abrirCambioPeriodo360,
    cerrarSesion360,
    guardarPeriodo360,
    ingresarAplicacion,
    leerPeriodoEncabezado360,
    leerPeriodo360
} from '../Funciones/HelpersHgi360Web.js';
import { prepararNavegador360, limpiarCache360 } from '../Funciones/HelpersMaestros360.js';
import * as Parametros from '../ParametrosPruebas/ParametrosPruebas.js';

/* ============================================================================
 * Cambiar periodo de todos los usuarios Aut* (test.hgi360.com)
 *
 * Entra con cada usuario de automatización de cada módulo (AutAdmin, AutContable,
 * AutCRM, AutGourmet, AutNomina, AutPos, AutPH...) y lo cambia al periodo/año
 * indicados abajo. Si el periodo o el año no existen en Cambiar Periodo, la
 * prueba de ese usuario falla con "Periodo inexistente" sin guardar nada.
 *
 * Los usuarios se toman de ParametrosPruebas.js: todos los config cuya página es
 * test.hgi360.com y cuyo usuario empieza por "Aut". Si se agrega un módulo nuevo
 * allí, entra solo en esta prueba. Se omiten los que tienen clave 'COMPLETAR'.
 * ==========================================================================*/

// ---------------------- PARÁMETROS DE LA PRUEBA ----------------------
const PERIODO = '11';      // Número del periodo (también acepta '11 - Noviembre')
const ANIO = '2026';       // Año del periodo. Dejar '' para conservar el año actual del usuario
const AMBIENTE = 'https://test.hgi360.com';
// ---------------------------------------------------------------------

const escaparRegex = texto => String(texto).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const codigo = valor => String(valor).split(' - ')[0].trim();

/** Usuarios Aut* del ambiente, sin repetir empresa + usuario. */
const usuariosAut = () => {
    const vistos = new Set();
    return Object.entries(Parametros)
        .filter(([, c]) => c && typeof c === 'object' && c.pagina && c.usuario)
        .filter(([, c]) => c.pagina.startsWith(AMBIENTE) && /^Aut/i.test(c.usuario) && c.clave !== 'COMPLETAR')
        .map(([nombre, c]) => ({ nombre, config: { ...c, pagina: AMBIENTE } }))   // algunos apuntan al login antiguo
        .filter(({ config }) => {
            const llave = `${config.empresa}|${config.usuario.toLowerCase()}`;
            if (vistos.has(llave)) {
                return false;
            }
            vistos.add(llave);
            return true;
        });
};

/** true si la lista del lookup tiene la opción "valor" o "valor - ...". Deja la lista cerrada. */
const existeOpcion = async (t, contenedor, valor) => {
    await t.click(`${contenedor} .dx-lookup-field`);
    const lista = Selector('.dx-overlay-content').filterVisible().find('.dx-list-item');
    await t.expect(lista.with({ timeout: 10000 }).exists).ok(`No se abrió la lista de ${contenedor}`);
    const opcion = lista.withText(new RegExp(`^\\s*${escaparRegex(codigo(valor))}(\\s*-.*)?\\s*$`));
    const existe = await opcion.with({ timeout: 3000 }).exists;
    await t.pressKey('esc').wait(800);
    return existe;
};

/** Falla con "Periodo inexistente" si el año o el periodo no están en Cambiar Periodo. */
const validarPeriodoExiste = async (t, usuario) => {
    const descripcion = `${codigo(PERIODO)}${ANIO ? ` de ${ANIO}` : ''}`;
    await leerPeriodo360();   // esperar a que los lookups se llenen con el periodo vigente
    await t.wait(1500);
    if (ANIO) {
        await t.expect(await existeOpcion(t, '#TxtCambioPeriodo_Anyo', ANIO))
            .ok(`Periodo inexistente: el año ${ANIO} no existe para ${usuario}`);
        // Con un año distinto al vigente la lista de periodos cambia: se elige el año antes de revisar el periodo
        await t.click('#TxtCambioPeriodo_Anyo .dx-lookup-field');
        await t.click(Selector('.dx-overlay-content').filterVisible().find('.dx-list-item')
            .withText(new RegExp(`^\\s*${escaparRegex(codigo(ANIO))}(\\s*-.*)?\\s*$`)).nth(0)).wait(1500);
    }
    await t.expect(await existeOpcion(t, '#TxtCambioPeriodo_Periodo', PERIODO))
        .ok(`Periodo inexistente: el periodo ${descripcion} no existe para ${usuario}`);
};

async function ejecutarPrueba(t, config) {
    await t.expect(codigo(PERIODO)).notEql('', 'Falta el parámetro PERIODO');

    await ingresarAplicacion(t, config);
    const antes = await leerPeriodoEncabezado360(t);

    await abrirCambioPeriodo360(t);
    await validarPeriodoExiste(t, `${config.usuario} (empresa ${config.empresa})`);

    await guardarPeriodo360(t, PERIODO, ANIO || null);   // guarda y verifica el encabezado

    const despues = await leerPeriodoEncabezado360(t);
    await t
        .expect(despues.periodo).eql(codigo(PERIODO), `${config.usuario} quedó en el periodo ${despues.periodo}`)
        .expect(!ANIO || despues.anio === String(ANIO).trim()).ok(`${config.usuario} quedó en el año ${despues.anio}`);
    console.log(`${config.usuario} / ${config.empresa} (${config.modulo}): ${antes.periodo}-${antes.anio} -> ${despues.periodo}-${despues.anio}`);

    await cerrarSesion360(t);
}

fixture `Cambiar periodo usuarios Aut - Test Hgi360`
    .page(AMBIENTE)
    .beforeEach(async t => {
        await prepararNavegador360(t, AMBIENTE);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

const usuarios = usuariosAut();

if (!usuarios.length) {
    test('Cambiar periodo usuarios Aut - Test Hgi360', async t => {
        await t.expect(false).ok(`No hay usuarios Aut* para ${AMBIENTE} en ParametrosPruebas.js`);
    });
}

for (const { nombre, config } of usuarios) {
    test(`Cambiar periodo ${codigo(PERIODO)}${ANIO ? `-${ANIO}` : ''} ${config.usuario} ${config.modulo} empresa ${config.empresa} (${nombre}) - Test Hgi360`, async t => {
        await ejecutarPrueba(t, config);
    });
}
