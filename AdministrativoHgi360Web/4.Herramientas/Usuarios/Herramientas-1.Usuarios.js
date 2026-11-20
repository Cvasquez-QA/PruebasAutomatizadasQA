import { Selector } from 'testcafe';
import {
    abrirHerramientas360,
    accionFilaGrid360,
    buscarEnGrid360,
    cerrarPestana360,
    cerrarSesion360,
    eliminarRegistroSiExiste,
    filaGrid360,
    ingresarAplicacion,
    limpiarCacheChromeTestCafe,
    nuevoRegistroGrid360,
    seleccionarOpcion
} from '../../../Funciones/HelpersHgi360Web.js';
import { testAdminConfig, hgiAdminConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

/*
 * 17-nov-2026: ajustada contra test.hgi360.com (versión React).
 * - El grid ya no tiene id="gridUsuarios": tiene data-testid="gridUsuarios" (id PnlGridUsuarios).
 *   Se usan los helpers de grid (buscarEnGrid360, filaGrid360, accionFilaGrid360), que lo resuelven.
 * - Los campos cambiaron de id: Código = #txtUsuarios_StrIdUsuario, Nombre = #txtUsuarios_StrNombre,
 *   Clave = #txtUsuarios_StrClave (todos contenedores DevExtreme, se escribe en su .dx-texteditor-input).
 * - La clave debe tener al menos 12 caracteres, con mayúscula, minúscula y número ("123" ya no se acepta).
 * - Al crear, sale el aviso "Registro guardado ¿Deseas llenar la información adicional?": se responde "No".
 * - El campo Vendedor muestra solo el nombre ("GENERAL"), no "0 - GENERAL".
 * - Se validan Envío Email, Información Remitente y Tipo Lectura de Ticket (validarCamposAdicionales).
 * - El usuario NO se elimina al final: Herramientas-2.PermisosXUsuario.js lo necesita.
 */

const CODIGO_USUARIO = 'MiUsuarioQA';
const NOMBRE = 'NombreMiUsuarioQA';
const CORREO = 'MICORREO@gmail.COM';
const CORREO_SUFIJO_EDIT = '.co';
const CORREO_EDITADO = CORREO + CORREO_SUFIJO_EDIT;
const VENDEDOR = '0 - GENERAL';
const VENDEDOR_EN_CAMPO = 'GENERAL';
// Clave de prueba que cumple la política de claves de HGI360
const CLAVE = 'ClaveQaUsuario2026';

const GRID = '#gridUsuarios';
const campo = contenedor => Selector(`${contenedor} .dx-texteditor-input`).filterVisible();
const formUsuario = Selector('#frmUsuarios');
const btnGuardar = Selector('#BtnGuardarUsuario_btn').filterVisible();
const avisoNo = Selector('button.swal2-cancel').filterVisible().withText('No');

const TIPOS_LECTURA_TICKET = ['Servicio Balanza', 'Solo Ticket'];
const NOMBRE_REMITENTE = 'Remitente QA';
const EMAIL_RESPUESTA = 'remitente.qa@gmail.com';

const chkEnvioEmail = Selector('#txtUsuarios_IntEnvioEmail');
const txtNombreRemitente = '#txtUsuarios_StrNombreRemitente';
const txtEmailRespuesta = '#txtUsuarios_StrEmailRemitente';
const lkpTipoLecturaTicket = '#txtUsuarios_IntTipoLecturaTicket';

const etiquetaForm = texto => formUsuario.find('.dx-texteditor-label, .dx-checkbox-text, label, .erp-form-section-title, h1, h2, h3, h4, span')
    .withExactText(texto).filterVisible();
// hasClass se reintenta dentro de expect mientras el campo cambia de estado
const soloLectura = contenedor => Selector(contenedor).hasClass('dx-state-readonly');

const marcarEnvioEmail = async (t, marcar) => {
    if ((await chkEnvioEmail.getAttribute('aria-checked') === 'true') !== marcar) {
        await t.click(chkEnvioEmail.find('.dx-checkbox-icon'));
    }
    await t.expect(chkEnvioEmail.getAttribute('aria-checked')).eql(String(marcar), `Envío Email no quedó ${marcar ? 'marcado' : 'desmarcado'}`);
};

/**
 * Valida que Envío Email, Información Remitente (Nombre Remitente, Email Respuesta) y
 * Tipo Lectura de Ticket (Servicio Balanza, Solo Ticket) sean visibles y se puedan usar.
 * Los campos del remitente solo se habilitan con Envío Email marcado.
 * Al terminar se limpian el remitente y se desmarca Envío Email para no cambiar los datos que guarda la prueba.
 */
async function validarCamposAdicionales(t) {
    // Envío Email
    await t
        .expect(chkEnvioEmail.visible).ok('No se ve el check Envío Email')
        .expect(etiquetaForm('Envío Email').exists).ok('No se ve la etiqueta Envío Email');

    // Información Remitente
    await t
        .expect(etiquetaForm('Información Remitente').exists).ok('No se ve la sección Información Remitente')
        .expect(etiquetaForm('Nombre Remitente').exists).ok('No se ve la etiqueta Nombre Remitente')
        .expect(etiquetaForm('Email Respuesta').exists).ok('No se ve la etiqueta Email Respuesta')
        .expect(Selector(txtNombreRemitente).visible).ok('No se ve el campo Nombre Remitente')
        .expect(Selector(txtEmailRespuesta).visible).ok('No se ve el campo Email Respuesta');

    await marcarEnvioEmail(t, false);
    await t
        .expect(soloLectura(txtNombreRemitente)).ok('Nombre Remitente debería estar bloqueado sin Envío Email')
        .expect(soloLectura(txtEmailRespuesta)).ok('Email Respuesta debería estar bloqueado sin Envío Email');

    await marcarEnvioEmail(t, true);
    await t
        .expect(soloLectura(txtNombreRemitente)).notOk('Nombre Remitente no se habilitó con Envío Email')
        .expect(soloLectura(txtEmailRespuesta)).notOk('Email Respuesta no se habilitó con Envío Email')
        .typeText(campo(txtNombreRemitente), NOMBRE_REMITENTE, { replace: true })
        .expect(campo(txtNombreRemitente).value).eql(NOMBRE_REMITENTE, 'No se pudo escribir en Nombre Remitente')
        .typeText(campo(txtEmailRespuesta), EMAIL_RESPUESTA, { replace: true })
        .expect(campo(txtEmailRespuesta).value).eql(EMAIL_RESPUESTA, 'No se pudo escribir en Email Respuesta');

    // Se deja como estaba
    await t
        .selectText(campo(txtNombreRemitente)).pressKey('delete')
        .selectText(campo(txtEmailRespuesta)).pressKey('delete');
    await marcarEnvioEmail(t, false);

    // Tipo Lectura de Ticket
    await t
        .expect(etiquetaForm('Tipo Lectura de Ticket').exists).ok('No se ve la etiqueta Tipo Lectura de Ticket')
        .expect(Selector(lkpTipoLecturaTicket).visible).ok('No se ve el campo Tipo Lectura de Ticket');
    for (const tipo of TIPOS_LECTURA_TICKET) {
        await t.click(`${lkpTipoLecturaTicket} .dx-lookup-field`);
        const opcion = Selector('.dx-overlay-content').filterVisible().find('.dx-list-item').withExactText(tipo);
        await t
            .expect(opcion.with({ timeout: 10000 }).visible).ok(`No aparece la opción "${tipo}" en Tipo Lectura de Ticket`)
            .click(opcion)
            .expect(Selector(`${lkpTipoLecturaTicket} .dx-lookup-field`).withExactText(tipo).with({ timeout: 5000 }).exists)
            .ok(`No quedó seleccionado "${tipo}" en Tipo Lectura de Ticket`);
    }
}

async function guardarUsuario(t) {
    await t.click(btnGuardar);
    // Solo al crear aparece la pregunta de información adicional
    if (await avisoNo.with({ timeout: 8000 }).exists) {
        await t.click(avisoNo);
    }
    await t.expect(formUsuario.filterVisible().with({ timeout: 15000 }).exists)
        .notOk('El formulario de usuario no se cerró después de guardar');
}

async function ejecutarPrueba(t, config, ingresar) {
    await ingresar(t, config);

    // Crear
    await abrirHerramientas360(t, 'Usuarios');
    await eliminarRegistroSiExiste(t, GRID, CODIGO_USUARIO);
    await nuevoRegistroGrid360(t, GRID);
    await t
        .expect(formUsuario.filterVisible().with({ timeout: 15000 }).exists).ok('No se abrió el formulario de usuario')
        .typeText(campo('#txtUsuarios_StrIdUsuario'), CODIGO_USUARIO, { replace: true })
        .typeText(campo('#txtUsuarios_StrNombre'), NOMBRE, { replace: true })
        .typeText(campo('#txtUsuarios_StrMail'), CORREO, { replace: true });
    if (await Selector('#txtUsuario_Activo').getAttribute('aria-checked') !== 'true') {
        await t.click('#txtUsuario_Activo .dx-checkbox-icon');
    }
    await t.click('#Usuarios_Vendedor .dx-lookup-field');
    await seleccionarOpcion(t, VENDEDOR);
    await t
        .expect(Selector('#Usuarios_Vendedor .dx-lookup-field').withText(VENDEDOR_EN_CAMPO).exists)
        .ok(`No quedó el vendedor ${VENDEDOR}`, { timeout: 10000 })
        .typeText(campo('#txtUsuarios_StrClave'), CLAVE, { replace: true });
    await validarCamposAdicionales(t);
    await guardarUsuario(t);
    await cerrarPestana360(t);

    // Validar y editar el correo
    await abrirHerramientas360(t, 'Usuarios');
    await buscarEnGrid360(t, GRID, CODIGO_USUARIO);
    await t.expect(filaGrid360(GRID, CODIGO_USUARIO).with({ timeout: 10000 }).exists)
        .ok(`No se creó el usuario ${CODIGO_USUARIO}`);
    await accionFilaGrid360(t, GRID, CODIGO_USUARIO, 'Editar');
    await t
        .expect(campo('#txtUsuarios_StrMail').with({ timeout: 15000 }).value).eql(CORREO, 'El correo cargado no es el esperado')
        // El campo es type="email": TestCafe no puede ubicar el cursor al final, así que se escribe el correo completo
        .typeText(campo('#txtUsuarios_StrMail'), CORREO_EDITADO, { replace: true })
        .expect(campo('#txtUsuarios_StrMail').value).eql(CORREO_EDITADO, 'No quedó escrito el correo editado');
    await guardarUsuario(t);
    // Al guardar, el grid se recarga y borra el buscador: se reabre la opción antes de validar
    await cerrarPestana360(t);

    await abrirHerramientas360(t, 'Usuarios');
    await buscarEnGrid360(t, GRID, CODIGO_USUARIO);
    const fila = filaGrid360(GRID, CODIGO_USUARIO);
    await t.expect(fila.with({ timeout: 10000 }).exists).ok(`No apareció ${CODIGO_USUARIO} al validar la edición`);
    const textoFila = (await fila.innerText).replace(/\s+/g, ' ').trim();
    await t.expect(textoFila).contains(CORREO_EDITADO, `No quedó guardado el correo editado. Fila: "${textoFila}"`);

    /* No se elimina: Herramientas-2.PermisosXUsuario.js usa este usuario.
    await eliminarFilaGrid360(t, GRID, CODIGO_USUARIO);
    */
    await cerrarPestana360(t);
    await cerrarSesion360(t);
}

fixture `Prueba Usuarios - Test Hgi360`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba Usuarios - Test Hgi360', async t => {
    await ejecutarPrueba(t, testAdminConfig, ingresarAplicacion);
});
