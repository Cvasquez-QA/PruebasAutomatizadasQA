import { Selector } from 'testcafe';
import { testPosConfig } from '../../ParametrosPruebas/TestErpPos8902.js';
import {
    abrirMovimientos360,
    abrirTransaccion,
    buscarConsecutivoDoc,
    cerrarSesion360,
    descargarUnSoloPedido,
    eliminarDocumento,
    esperarValorVisible,
    filtrarPor,
    ingresarAplicacion,
    ingresarDetalle,
    selectorOpcion,
} from '../../Funciones/HelpersHgi360.js';

fixture `Inconsistencias Erp Web`
    .page(testPosConfig.pagina);

test('INC03-DescargaPedidosPos', async t => {
    await ingresarAplicacion(t, testPosConfig);
    await abrirMovimientos360(t, 'Documentos');

    await t.click('#ListagridDocumentos .dx-icon.dx-icon-add');

    await abrirTransaccion(t, '07QA');

    await t.click(Selector('#Documento_Tercero .dx-lookup-field'));
    await filtrarPor(t, 'hgi');
    await t
        .click(selectorOpcion('811021438 - HGI S.A.S - HGI S.A.S'))
        .click(Selector('#BtnGuardarDocumento span').withText('Guardar'))
        .wait(2000);

    await ingresarDetalle(t, '010203', '10');

    await t
        .click(Selector('#BtnGuardarDocumento span').withText('Guardar'))
        .wait(2000);

    const numeropedido = (await Selector('#txtDocumento .dx-texteditor-input').value).trim();

    await t
        .expect(numeropedido).notEql('', 'No se capturó el consecutivo del pedido')
        .click(Selector('#BtnNuevoDocumento span').withText('Nuevo'));

    await abrirTransaccion(t, '01QA');

    await t.click(Selector('#Documento_Tercero .dx-lookup-field'));
    await filtrarPor(t, 'hgi');
    await t
        .click(selectorOpcion('811021438 - HGI S.A.S - HGI S.A.S'))
        .click(Selector('#BtnGuardarDocumento div').withText('Guardar'))
        .wait(6000);

    await descargarUnSoloPedido(t, numeropedido);

    await t.wait(2000);
    await esperarValorVisible(t, '010203');
    await esperarValorVisible(t, '10,00');
    await eliminarDocumento(t);
    await abrirTransaccion(t, '07QA');
    await buscarConsecutivoDoc(t, numeropedido);
    await eliminarDocumento(t);
    await t.wait(2000);
    await cerrarSesion360(t);
});
