import { Selector } from 'testcafe';
import { miNominaConfig } from '../../../../ParametrosPruebas/ParametrosPruebas.js';
import { testNominaConfig } from '../../../../ParametrosPruebas/ParametrosPruebas.js';
import {
    ingresarAplicacion,
    
    cerrarSesion360,
    seleccionarOpcion
} from '../../../../Funciones/HelpersHgi360Legacy.js';
import {
    ingresarParametros,
    editarParametros,
    guardarParametros,
    reabrirParametros
} from '../HelpersNomina.js';

const IVA_SIN_IMPUESTO = 'Sin Iva';
const IVA_GENERAL = '19';

const ejecutarParametrosGeneral = async (t, config, ingresar) => {
    await ingresarAplicacion(t, config);
    await ingresarParametros(t);
    await editarParametros(t);

    await t
        .click(Selector('#TxtPrm_General_IntModoGral .dx-radiobutton-icon').nth(1))
        .click('#TxtPrm_General_StrFormatoIValor .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#TxtPrm_General_StrFormatoIValor .dx-texteditor-input', 'n1')
        .click('#TxtPrm_General_StrFormatoICantidad .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#TxtPrm_General_StrFormatoICantidad .dx-texteditor-input', 'n2')
        .click('#TxtPrm_General_StrFormatoIPrecio .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#TxtPrm_General_StrFormatoIPrecio .dx-texteditor-input', 'n3')
        .click('#TxtPrm_AdminGeneral_StrFormatoValor .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#TxtPrm_AdminGeneral_StrFormatoValor .dx-texteditor-input', 'n4')
        .click('#TxtPrm_AdminGeneral_StrFormatoValorD .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#TxtPrm_AdminGeneral_StrFormatoValorD .dx-texteditor-input', 'n5')
        .click('#TxtPrm_AdminGeneral_StrFormatoPrecio .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#TxtPrm_AdminGeneral_StrFormatoPrecio .dx-texteditor-input', 'n6')
        .click('#TxtPrm_AdminGeneral_StrFormatoCantidad .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#TxtPrm_AdminGeneral_StrFormatoCantidad .dx-texteditor-input', 'n7')
        .click('#TxtPrm_AdminGeneral_StrFormatoPorcentaje .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#TxtPrm_AdminGeneral_StrFormatoPorcentaje .dx-texteditor-input', 'n8')
        .click('#TxtPrm_AdminGeneral_IntDecimalesAdm .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#TxtPrm_AdminGeneral_IntDecimalesAdm .dx-texteditor-input', 'n9')
        .click('#TxtPrm_AdminGeneral_IntDecimalesAdmD .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#TxtPrm_AdminGeneral_IntDecimalesAdmD .dx-texteditor-input', '123456')
        .click('#TxtPrm_AdminGeneral_IntDecimalesPrecio .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .click('#TxtPrm_AdminGeneral_IntDecimalesCan .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#TxtPrm_AdminGeneral_IntDecimalesCan .dx-texteditor-input', '03')
        .click('#TxtPrm_AdminGeneral_IntDecimalesPorcentaje .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#TxtPrm_AdminGeneral_IntDecimalesPorcentaje .dx-texteditor-input', '.2')
        .click('#TxtPrm_AdminPos_Banco .dx-checkbox-icon');

    await t
        .click(Selector('#BtnGuardar span').withText('Guardar'))
        .wait(2000)
        .expect(Selector('#swal2-content').innerText).eql('Registro almacenado correctamente.')
        .click(Selector('.swal2-actions button').withText('Aceptar'))
        .wait(2000);

    await reabrirParametros(t);

    const modoContable = Selector('#TxtPrm_General_IntModoGral [class^="dx-item dx-item-selected dx-radiobutton-checked dx"]');
    const textoModificado = (await modoContable.innerText).replace('\t\n', '');

    await t
        .expect(textoModificado).eql('Solo NIIF', 'El sistema no guardó los cambios')
        .expect(Selector('#TxtPrm_General_StrFormatoIValor .dx-texteditor-input').value).eql('n1', 'El sistema no guardó el cambio')
        .expect(Selector('#TxtPrm_General_StrFormatoICantidad .dx-texteditor-input').value).eql('n2', 'El sistema no guardó el cambio')
        .expect(Selector('#TxtPrm_General_StrFormatoIPrecio .dx-texteditor-input').value).eql('n3', 'El sistema no guardó el cambio')
        .expect(Selector('#TxtPrm_AdminGeneral_StrFormatoValor .dx-texteditor-input').value).eql('n4', 'El sistema no guardó el cambio')
        .expect(Selector('#TxtPrm_AdminGeneral_StrFormatoValorD .dx-texteditor-input').value).eql('n5', 'El sistema no guardó el cambio')
        .expect(Selector('#TxtPrm_AdminGeneral_StrFormatoPrecio .dx-texteditor-input').value).eql('n6', 'El sistema no guardó el cambio')
        .expect(Selector('#TxtPrm_AdminGeneral_StrFormatoCantidad .dx-texteditor-input').value).eql('n7', 'El sistema no guardó el cambio')
        .expect(Selector('#TxtPrm_AdminGeneral_StrFormatoPorcentaje .dx-texteditor-input').value).eql('p8', 'El sistema no guardó el cambio')
        .expect(Selector('#TxtPrm_AdminGeneral_IntDecimalesAdm .dx-texteditor-input').value).eql('9', 'El sistema no guardó el cambio')
        .expect(Selector('#TxtPrm_AdminGeneral_IntDecimalesAdmD .dx-texteditor-input').value).eql('10', 'El sistema no guardó el cambio')
        .expect(Selector('#TxtPrm_AdminGeneral_IntDecimalesPrecio .dx-texteditor-input').value).eql('0', 'El sistema no guardó el cambio')
        .expect(Selector('#TxtPrm_AdminGeneral_IntDecimalesCan .dx-texteditor-input').value).eql('3', 'El sistema no guardó el cambio')
        .expect(Selector('#TxtPrm_AdminGeneral_IntDecimalesPorcentaje .dx-texteditor-input').value).eql('0', 'El sistema no guardó el cambio');

    await reabrirParametros(t);

    await t
        .click(Selector('#TxtPrm_General_IntModoGral .dx-radiobutton-icon').nth(1))
        .click('#TxtPrm_General_StrFormatoIValor .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#TxtPrm_General_StrFormatoIValor .dx-texteditor-input', 'n2')
        .click('#TxtPrm_General_StrFormatoICantidad .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#TxtPrm_General_StrFormatoICantidad .dx-texteditor-input', 'n2')
        .click('#TxtPrm_General_StrFormatoIPrecio .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#TxtPrm_General_StrFormatoIPrecio .dx-texteditor-input', 'n2')
        .click('#TxtPrm_AdminGeneral_StrFormatoValor .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#TxtPrm_AdminGeneral_StrFormatoValor .dx-texteditor-input', 'n2')
        .click('#TxtPrm_AdminGeneral_StrFormatoValorD .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#TxtPrm_AdminGeneral_StrFormatoValorD .dx-texteditor-input', 'n2')
        .click('#TxtPrm_AdminGeneral_StrFormatoPrecio .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#TxtPrm_AdminGeneral_StrFormatoPrecio .dx-texteditor-input', 'n0')
        .click('#TxtPrm_AdminGeneral_StrFormatoCantidad .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#TxtPrm_AdminGeneral_StrFormatoCantidad .dx-texteditor-input', 'n0')
        .click('#TxtPrm_AdminGeneral_StrFormatoPorcentaje .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#TxtPrm_AdminGeneral_StrFormatoPorcentaje .dx-texteditor-input', 'p2')
        .click('#TxtPrm_AdminGeneral_IntDecimalesAdm .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#TxtPrm_AdminGeneral_IntDecimalesAdm .dx-texteditor-input', '0')
        .click('#TxtPrm_AdminGeneral_IntDecimalesAdmD .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#TxtPrm_AdminGeneral_IntDecimalesAdmD .dx-texteditor-input', '0')
        .click('#TxtPrm_AdminGeneral_IntDecimalesPrecio .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .click('#TxtPrm_AdminGeneral_IntDecimalesCan .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#TxtPrm_AdminGeneral_IntDecimalesCan .dx-texteditor-input', '0')
        .click('#TxtPrm_AdminGeneral_IntDecimalesPorcentaje .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#TxtPrm_AdminGeneral_IntDecimalesPorcentaje .dx-texteditor-input', '2')
        .click('#TxtPrm_AdminPos_Banco .dx-checkbox-icon');

    await guardarParametros(t);
    await t.switchToMainWindow();
    await cerrarSesion360(t);
};

const ejecutarParametrosInventario = async (t, config, ingresar) => {
    await ingresarAplicacion(t, config);
    await ingresarParametros(t, '#tabs_parametrosAdmin_Inventarios');
    await editarParametros(t);

    if (!(await Selector('#TxtParametrosGenerales_KardexPorDefecto .dx-checkbox-icon').getAttribute('aria-checked'))) {
        await t.click('#TxtParametrosGenerales_KardexPorDefecto .dx-checkbox-icon');
    }

    if (!(await Selector('#TxtParametrosGenerales_PrimeroEntradas .dx-checkbox-icon').getAttribute('aria-checked'))) {
        await t.click('#TxtParametrosGenerales_PrimeroEntradas .dx-checkbox-icon');
    }

    await t
        .click(Selector('#TxtParametrosGenerales_Valuacion .dx-radiobutton-icon'))
        .click(Selector('#TxtParametrosGenerales_Costeo .dx-radiobutton-icon'))
        .click('#TxtParametrosGenerales_IncluyeDescuento .dx-checkbox-icon')
        .click('#TxtParametrosGenerales_IncluyeDescuento .dx-checkbox-icon')
        .wait(3000)
        .click(Selector('#BtnGuardar div').withText('Guardar'))
        .click(Selector('.swal2-actions button').withText('Aceptar'))
        .wait(2000);

    await reabrirParametros(t, '#tabs_parametrosAdmin_Inventarios');

    await t
        .expect(Selector('#TxtParametrosGenerales_KardexPorDefecto').getAttribute('aria-checked')).eql('true', 'El sistema no guardó el cambio')
        .expect(Selector('#TxtParametrosGenerales_PrimeroEntradas').getAttribute('aria-checked')).eql('true', 'El sistema no guardó el cambio');

    const valuacion = Selector('#TxtParametrosGenerales_Valuacion [class^="dx-item dx-item-selected dx-radiobutton-checked dx"]');
    const textoValuacion = (await valuacion.innerText).replace('\t\n', '');
    await t.expect(textoValuacion).eql('Promedio ponderado', 'El sistema no guardó los cambios');

    const costeo = Selector('#TxtParametrosGenerales_Costeo [class^="dx-item dx-item-selected dx-radiobutton-checked dx"]');
    const textoCosteo = (await costeo.innerText).replace('\t\n', '');
    await t
        .expect(textoCosteo).eql('Desactivo', 'El sistema no guardó los cambios')
        .expect(Selector('#TxtParametrosGenerales_IncluyeDescuento').getAttribute('aria-checked')).eql('false', 'El sistema no guardó el cambio');

    await t.switchToMainWindow();
    await cerrarSesion360(t);
};

const ejecutarParametrosDocumentos = async (t, config, ingresar) => {
    await ingresarAplicacion(t, config);
    await ingresarParametros(t);

    await t
        .click(Selector('#tabs_parametros_Admin'))
        .click('#tabs_parametrosAdmin_Documentos');

    await editarParametros(t);

    await t
        .click(Selector('#TxtParametrosGenerales_StrIvaGeneral .dx-lookup-field'))
        ;
    await seleccionarOpcion(t, IVA_SIN_IMPUESTO);
    await t
        .click(Selector('#BtnGuardar div').withText('Guardar'))
        .click(Selector('.swal2-actions button').withText('Aceptar'))
        .wait(2000);

    await reabrirParametros(t);
    await t.click(Selector('#tabs_parametros_Admin')).click('#tabs_parametrosAdmin_Documentos');
    await editarParametros(t);

    await t
        .expect(Selector('#TxtParametrosGenerales_StrIvaGeneral .dx-lookup-field').innerText).eql(IVA_SIN_IMPUESTO, 'El sistema no guardó el cambio')
        .click(Selector('#TxtParametrosGenerales_StrIvaGeneral .dx-lookup-field'))
        ;
    await seleccionarOpcion(t, IVA_GENERAL);
    await t
        .click(Selector('#BtnGuardar div').withText('Guardar'))
        .click(Selector('.swal2-actions button').withText('Aceptar'));

    await t.switchToMainWindow();
    await cerrarSesion360(t);
};

fixture `Prueba Parametros General Hgi360 Nomina - MiHgi360 8893`
    .page(miNominaConfig.pagina);

test('[Mi Hgi360 8893] Parametros General - General (guardar y validar persistencia)', async t => {
    await ejecutarParametrosGeneral(t, miNominaConfig, ingresarAplicacion);
});

test('[Mi Hgi360 8893] Parametros General - Inventario (guardar y validar persistencia)', async t => {
    await ejecutarParametrosInventario(t, miNominaConfig, ingresarAplicacion);
});

test('[Mi Hgi360 8893] Parametros General - Documentos (guardar y validar persistencia)', async t => {
    await ejecutarParametrosDocumentos(t, miNominaConfig, ingresarAplicacion);
});

fixture `Prueba Parametros General Hgi360 Nomina - Test Hgi360 8902`
    .page(testNominaConfig.pagina);

test('[Test Hgi360 8902] Parametros General - General (guardar y validar persistencia)', async t => {
    await ejecutarParametrosGeneral(t, testNominaConfig, ingresarAplicacion);
});

test('[Test Hgi360 8902] Parametros General - Inventario (guardar y validar persistencia)', async t => {
    await ejecutarParametrosInventario(t, testNominaConfig, ingresarAplicacion);
});

test('[Test Hgi360 8902] Parametros General - Documentos (guardar y validar persistencia)', async t => {
    await ejecutarParametrosDocumentos(t, testNominaConfig, ingresarAplicacion);
});
