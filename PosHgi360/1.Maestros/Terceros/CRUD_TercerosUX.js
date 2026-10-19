import { Selector } from 'testcafe';
import {
    ingresarAplicacion,
    abrirMaestros360,
    eliminarRegistroSiExiste,
    cerrarPestana360,
    cerrarSesion360,
    eliminarRegistroDesdeGrid,
    limpiarCacheChromeTestCafe
} from '../../../Funciones/HelpersHgi360Legacy.js';
import { testPosConfig, hgiPosConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

const CODIGO = '1010101010';
async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    await abrirMaestros360(t, 'Terceros', 'terceros');
        await eliminarRegistroSiExiste(t, '#gridTerceros', CODIGO, 1);
        await t
            .click(Selector('#gridTerceros .dx-icon.dx-icon-add'))
            //Se comienza con la inserción de datos para la creación del tercero
            .typeText('#txtTercero_Id .dx-texteditor-input', CODIGO)
            .pressKey('enter')
            .click(Selector('#txtTercero_Tipo_Id .dx-lookup-field'))
            .click(Selector('div').withText('CC - Cedula de Ciudadania').nth(9))//Cédula de ciudadanía
             .click(Selector('#txtTercero_Tipo_Persona .dx-lookup-field'))
            .click(Selector('[data-bind="dxControlsDescendantBindings: true"] div').withText('1 - Natural').nth(8))
            //.click(Selector('#txt_lista_TipoPersonaTercero div').withText('Natural').nth(1))
            .typeText('#txtTercero_PApellido .dx-texteditor-input', 'Monsalve')
            .typeText('#txtTercero_SApellido .dx-texteditor-input', 'QA')
            .typeText('#txtTercero_PNombre .dx-texteditor-input', 'Yesica')
            .typeText('#txtTercero_Direccion .dx-texteditor-input', 'la Casa De Yesica')
            .typeText('#txtTercero_Celular .dx-texteditor-input', '2.3')
            .typeText('#txtTercero_Email .dx-texteditor-input', 'correo@gmail.com')
            .typeText('#txtTercero_Telefono .dx-texteditor-input','123123123')
                //.typeText('#txtTercero_Telefono .dx-texteditor-input', '!"#$#$%&/')
                 //No permite el ingreso de letras pero si de caracteres como #$%
                //Cuando se ingresa "." seguido de un número, permite guardar el tercero como decimal y lo mismo ocurre con ","
                //a la hora de ingresar "." o ",", seguido de un entero, y luego otra vez "." o "," el sistema borra los números después de este
                 //El sistema permite el grabado de un tercero ingresando cualquier caracter
            .typeText('#txtTercero_Fax .dx-texteditor-input','.,qwerty')
            .doubleClick(Selector('#txtTercero_EmailFE .dx-texteditor-input'))
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtTercero_EmailFE .dx-texteditor-input', 'correoFE@gmail.com')
            //No permite guardarlo sin el formato de correo ni caracteres especiales
            .typeText('#txtTercero_Web .dx-texteditor-input', 'notiene')
            //El sistema está permitiendo el guardado del tercero con un sitio web inválido o sin el formato correcto
            .click(Selector('#txtTercero_TipoTercero .dx-lookup-field'))
            .click(Selector('div').withText('2 - Clientes').nth(9))
            .click(Selector('#txtTercero_Ciudad .dx-lookup-field'))
            .click(Selector('div').withText('03 - ABRIAQUI').nth(9))
            .click(Selector('#txtTercero_Sector .dx-lookup-field'))
            .typeText(Selector('[data-bind="dxControlsDescendantBindings: true"] .dx-texteditor-input'),'general')
            .wait(2000)
            .click(Selector('[data-bind="dxControlsDescendantBindings: true"] div').withText('0 - GENERAL').nth(8))
            .click(Selector('#txtTercero_Sucursal div').withText('MEDELLIN').nth(1))
            .click(Selector('[data-bind="dxControlsDescendantBindings: true"] div').withText('0 - No Sucursal').nth(8))
            .click(Selector('#txtTercero_Barrio .dx-lookup-field'))
            .click(Selector('[data-bind="dxControlsDescendantBindings: true"] div').withText('0 - GENERAL').nth(8))
            .click(Selector('#txtTercero_Vendedor .dx-lookup-field'))
            .typeText(Selector('[data-bind="dxControlsDescendantBindings: true"] .dx-texteditor-input'),'45')
            .wait(3000)
            .click(Selector('[data-bind="dxControlsDescendantBindings: true"] div').withText('45 - HGI SAS').nth(8))
            .typeText('#txtTercero_LineaNegocio .dx-texteditor-input','MiLineaNegocio')
            .typeText('#txtTercero_Descuento .dx-texteditor-input', '50')
            .typeText('#txtTercero_DocumentoAuxiliar .dx-texteditor-input', '10')
            .typeText('#txtTercero_Cupo .dx-texteditor-input', '1000')
            .typeText('#txtTercero_Plazo .dx-texteditor-input', '8')
            .typeText('#txtTercero_DiasGracia .dx-texteditor-input', '5')
            .click(Selector('#txtTercero_CodigoPostalDIAN .dx-lookup-field-wrapper'))
            .click(Selector('div').withText('050005 - 050005').nth(9))
            .typeText('#txtTercero_Direccion2 .dx-texteditor-input','otra casa')
            .click(Selector('#txtTercero_Estado .dx-lookup-field'))
            .click(Selector('div').withText('0 - Inactivo').nth(9))
            .click(Selector('#txtTercero_CausaRetiro .dx-lookup-field'))
            .typeText(Selector('[data-bind="dxControlsDescendantBindings: true"] .dx-texteditor-input'),'retirado')
            .wait(2000)
            .click(Selector('[data-bind="dxControlsDescendantBindings: true"] div').withText('1 - RETIRADO').nth(8))
            .typeText('#txtTercero_FechaRetiro','2024-10-27')
    //
             .click('#tabs_tercero_Tributaria')
            .click(Selector('#txtTercero_Regimen_Ventas .dx-lookup-field'))
            .click(Selector('[data-bind="dxControlsDescendantBindings: true"] div').withText('0 - 00 - Ninguno').nth(8))
            .click('#txtTercero_Resp05 .dx-checkbox-icon')
            .click('#txtTercero_Resp07 .dx-checkbox-icon')
            .click('#txtTercero_Resp09 .dx-checkbox-icon')
            .click('#txtTercero_Resp13 .dx-checkbox-icon')
            .click('#txtTercero_Resp15 .dx-checkbox-icon')
            .click('#txtTercero_Resp35 .dx-checkbox-icon')
            .click('#txtTercero_RetenedorIca .dx-checkbox-icon')
            .click('#txtTercero_NoManejaBaseReteIva .dx-checkbox-icon')
            .click('#txtTercero_NoManejaBaseReteFte .dx-checkbox-icon')
            .click('#txtTercero_ContratoEstabilidadJuridica .dx-checkbox-icon')
            .click(Selector('#txtTercero_Actividad_Economica .dx-lookup-field'))
            .click(Selector('[data-bind="dxControlsDescendantBindings: true"] div').withText('1313 - Acabado de productos textiles').nth(8))
    //
            .click('#TxtTerceros_Observaciones .dx-texteditor-input')
            .typeText('#TxtTerceros_Observaciones .dx-texteditor-input', 'Prueba Tercero Observacion')
            .typeText('#txtTercero_Cuenta .dx-texteditor-input', '24006124228')
            .click(Selector('#txtTipo .dx-lookup-field'))
            .click(Selector('[data-bind="dxControlsDescendantBindings: true"] div').withText('2 - Ahorros').nth(8))
            .click(Selector('#txtTercero_Entidad .dx-lookup-field'))
            .click(Selector('[data-bind="dxControlsDescendantBindings: true"] div').withText('02 - BANCOLOMBIA').nth(8))
            .click(Selector('#txtTercero_CiudadBanco div div'))
            .typeText(Selector('[data-bind="dxControlsDescendantBindings: true"] .dx-texteditor-input'),'medell')
            .wait(2000)
            .click(Selector('[data-bind="dxControlsDescendantBindings: true"] div').withText('01 - MEDELLIN').nth(8))
            .typeText('#txtTercero_CodigoBanco .dx-texteditor-input', '11111')
            .typeText('#TxtTerceros_StrDato0 .dx-texteditor-input', '22222')
            .typeText('#TxtTerceros_StrDato1 .dx-texteditor-input', '33333')
            .typeText('#TxtTerceros_StrDato2 .dx-texteditor-input', '44444')
            .typeText('#TxtTerceros_StrDato3 .dx-texteditor-input', '55555')
            .typeText('#TxtTerceros_StrDato4 .dx-texteditor-input', '66666')
            .typeText('#TxtTerceros_StrDato5 .dx-texteditor-input', '77777')
            .typeText('#TxtTerceros_StrDato6 .dx-texteditor-input', '88888')
            .typeText('#TxtTerceros_StrDato7 .dx-texteditor-input', '99999')
            .typeText('#TxtTerceros_StrContactoTecnico1 .dx-texteditor-input', '11112')
            .typeText('#TxtTerceros_StrContactoTecnico2 .dx-texteditor-input', '11113')
            .typeText('#TxtTerceros_StrRepLegal .dx-texteditor-input', '11114')
            .typeText('#TxtTerceros_StrContactoComercal .dx-texteditor-input', '11115')
            .typeText('#TxtTerceros_StrContactoCartera .dx-texteditor-input', '11116')
            .typeText('#TxtTerceros_StrEan .dx-texteditor-input', '11117')
            .typeText('#TxtTerceros_IntDato1 .dx-texteditor-input', '11118')
            .typeText('#TxtTerceros_IntDato2 .dx-texteditor-input', '11119')
            .click(Selector('#txtTercero_StrRepresentante .dx-lookup-field'))
            .typeText(Selector('[data-bind="dxControlsDescendantBindings: true"] .dx-texteditor-input'),'hgi')
            .wait(2000)
            .click(Selector('[data-bind="dxControlsDescendantBindings: true"] div').withText('811021438 - HGI S.A.S - HGI S.A.S').nth(8))
            .click(Selector('#txtTercero_StrProvTecnologico .dx-lookup-field'))
            .typeText(Selector('[data-bind="dxControlsDescendantBindings: true"] .dx-texteditor-input'),'hgi')
            .wait(2000)
            .click(Selector('[data-bind="dxControlsDescendantBindings: true"] div').withText('811021438 - HGI SAS').nth(8))
            .click(Selector('#txtTercero_StrParametro1 .dx-lookup-field'))
            .click(Selector('[data-bind="dxControlsDescendantBindings: true"] div').withText('02 - ABARROTES / MINIMERCADOS / RETAIL').nth(8))
            .click(Selector('#txtTercero_StrParametro2 .dx-lookup-field'))
            .click(Selector('[data-bind="dxControlsDescendantBindings: true"] div').withText('0 - general').nth(8))
            .click(Selector('#txtTercero_StrParametro3 .dx-lookup-field'))
            .click(Selector('[data-bind="dxControlsDescendantBindings: true"] div').withText('0 - General').nth(8))
            .click(Selector('#txtTercero_StrParametro4 .dx-lookup-field'))
            .click(Selector('[data-bind="dxControlsDescendantBindings: true"] div').withText('0 - General').nth(8))
            .click(Selector('#txtTercero_StrParametro5 .dx-lookup-field'))
            .click(Selector('[data-bind="dxControlsDescendantBindings: true"] div').withText('0 - General').nth(8))
            //El sistema permite guardar un tercero activo con fecha de retiro
            .click(Selector('#BtnGuardarTercero div').withText('Guardar'))

        //Se valida la creación del tercero
            .wait(4000)
            .expect(Selector('#gridTerceros td').withText(CODIGO).exists).ok()
        //Se edita el tercero
            .click(Selector('#gridTerceros [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
            .wait(2000)
            //Selector('#gridTerceros div div').nth(170).find('div div div div table tbody tr td div a')
            .click('#txtTercero_Telefono .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtTercero_Telefono .dx-texteditor-input', '654321')
            .click(Selector('#BtnGuardarTercero div').withText('Guardar'))
        //Se elimina el tercero
            .wait(3000);
        await eliminarRegistroDesdeGrid(t, '#gridTerceros');

        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `Prueba Terceros testERP Pos - Test Hgi360`
    .page(testPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Test Hgi360 - Prueba CRUD Terceros TestPos', async t => {
    await ejecutarPrueba(t, testPosConfig);
});

fixture `Prueba Terceros testERP Pos - Hgi360 Pos`
    .page(hgiPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Test Hgi360 - Prueba CRUD Terceros TestPos', async t => {
    await ejecutarPrueba(t, hgiPosConfig);
});
