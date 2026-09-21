import { Selector } from 'testcafe';
import {
    abrirMovimientos360,
    abrirTransaccion,
    cerrarSesion360,
    ingresarAplicacion,
} from '../../Funciones/HelpersHgi360.js';
import { hgi360AdminConfig } from '../../ParametrosPruebas/Hgi360Admin8888.js';
import { hgi360PosConfig } from '../../ParametrosPruebas/Hgi360Pos8888.js';

const TX = '0101';

const ejecutarPrueba = async (t, config) => {
    await ingresarAplicacion(t, config);
    await abrirMovimientos360(t, 'Documentos');

    await t.click('#ListagridDocumentos .dx-icon.dx-icon-add');
    await abrirTransaccion(t, TX);

    await t
        .click(Selector('#BtnGuardarDocumento span').withText('Guardar'))
        .expect(Selector('#Documento_ModalValidacionDIAN h5').withText('Validación Tercero').visible).ok('No está saliendo el control del tercero')
        .click(Selector('#Documento_ModalValidacionDIAN_BtnCancelar span').withText('Cancelar'))
        .wait(2000)
        .expect(Selector('.swal2-content div').withText('Tercero 222222222222 no existe, debe crearlo.').visible).ok('no salió el mensaje de 22222 no existe')
        .click(Selector('button').withText('Aceptar'))
        .wait(3000);

    await cerrarSesion360(t);
};

fixture `Prueba INC073 Mensaje Consumidor Final no Existe HGI360 Admin`
    .page(hgi360AdminConfig.pagina);

test('Prueba INC073 Mensaje Consumidor Final no Existe', async t => {
    await ejecutarPrueba(t, hgi360AdminConfig);
});

fixture `Prueba INC073 Mensaje Consumidor Final no Existe HGI360 Pos`
    .page(hgi360PosConfig.pagina);

test('Prueba INC073 Mensaje Consumidor Final no Existe', async t => {
    await ejecutarPrueba(t, hgi360PosConfig);
});
