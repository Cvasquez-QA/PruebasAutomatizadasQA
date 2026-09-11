import { Selector } from 'testcafe';
import {
    abrirHerramientas360,
    cerrarSesion360,
    ingresarAplicacion,
    seleccionarOpcion,
    cerrarPestana360
} from '../../../../Funciones/HelpersHgi360.js';
import { testAdminConfig } from '../../../../ParametrosPruebas/TestErpAdmin8902.js';
import { hgiAdminConfig } from '../../../../ParametrosPruebas/Hgi360Admin8888.js';

const FORMATO_I_VALOR = 'n1';
const FORMATO_I_CANTIDAD = 'n2';
const FORMATO_I_PRECIO = 'n3';
const FORMATO_VALOR = 'n4';
const FORMATO_VALOR_D = 'n5';
const FORMATO_PRECIO = 'n6';
const FORMATO_CANTIDAD = 'n7';
const FORMATO_PORCENTAJE = 'n8';
const DECIMALES_ADM = 'n9';
const DECIMALES_ADM_D = '123456';
const DECIMALES_CANTIDAD = '03';
const DECIMALES_PORCENTAJE = '.2';
const MODO_CONTABLE_ESPERADO = 'Solo NIIF';
const FORMATO_PORCENTAJE_GUARDADO = 'p8';
const DECIMALES_ADM_GUARDADO = '9';
const DECIMALES_ADM_D_GUARDADO = '10';
const DECIMALES_PRECIO_GUARDADO = '0';
const DECIMALES_CANTIDAD_GUARDADO = '3';
const DECIMALES_PORCENTAJE_GUARDADO = '0';
const MENSAJE_GUARDADO = 'Registro almacenado correctamente.';
const FORMATO_I_VALOR_RESTAURAR = 'n2';
const FORMATO_PRECIO_RESTAURAR = 'n0';
const FORMATO_CANTIDAD_RESTAURAR = 'n0';
const FORMATO_PORCENTAJE_RESTAURAR = 'p2';
const DECIMALES_ADM_RESTAURAR = '0';
const DECIMALES_CANTIDAD_RESTAURAR = '0';
const DECIMALES_PORCENTAJE_RESTAURAR = '2';
const VALUACION_ESPERADA = 'Promedio ponderado';
const COSTEO_ESPERADO = 'Desactivo';
const DIAS_BLOQUEO = '30';
const CARTERA_FORMA_ESPERADA = 'Tipo';
const CONTROL_DIAS_ESPERADO = 'Bloqueo';
const DESC_SERIE = 'seriee';
const DESC_SERIE1 = 'seriee1';
const DESC_SERIE2 = 'seriee2';
const DESC_SERIE3 = 'seriee3';
const IVA_GENERAL = '19%';
const DESC_SERIE_RESTAURAR = 'Serie';
const DESC_SERIE1_RESTAURAR = 'Serie1';
const DESC_SERIE2_RESTAURAR = 'Serie2';
const DESC_SERIE3_RESTAURAR = 'Serie3';
const IVA_SIN = 'Sin Iva';

async function ejecutarPruebaGeneral(t, config, ingresar) {
    await ingresar(t, config);
        await abrirHerramientas360(t, 'Parámetros');
        await t
            .wait(2000)
            .click(Selector('#BtnEditar span').withText('Editar'))
            .click(Selector('#TxtPrm_General_IntModoGral .dx-radiobutton-icon').nth(1))
            .click('#TxtPrm_General_StrFormatoIValor .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#TxtPrm_General_StrFormatoIValor .dx-texteditor-input', FORMATO_I_VALOR)
            .click('#TxtPrm_General_StrFormatoICantidad .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#TxtPrm_General_StrFormatoICantidad .dx-texteditor-input', FORMATO_I_CANTIDAD)
            .click('#TxtPrm_General_StrFormatoIPrecio .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#TxtPrm_General_StrFormatoIPrecio .dx-texteditor-input', FORMATO_I_PRECIO)
            .click('#TxtPrm_AdminGeneral_StrFormatoValor .dx-texteditor-input')
            .pressKey('backspace')
            .pressKey('ctrl+a')
            .typeText('#TxtPrm_AdminGeneral_StrFormatoValor .dx-texteditor-input', FORMATO_VALOR)
            .click('#TxtPrm_AdminGeneral_StrFormatoValorD .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#TxtPrm_AdminGeneral_StrFormatoValorD .dx-texteditor-input', FORMATO_VALOR_D)
            .click('#TxtPrm_AdminGeneral_StrFormatoPrecio .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#TxtPrm_AdminGeneral_StrFormatoPrecio .dx-texteditor-input', FORMATO_PRECIO)
            .click('#TxtPrm_AdminGeneral_StrFormatoCantidad .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#TxtPrm_AdminGeneral_StrFormatoCantidad .dx-texteditor-input', FORMATO_CANTIDAD)
            .click('#TxtPrm_AdminGeneral_StrFormatoPorcentaje .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#TxtPrm_AdminGeneral_StrFormatoPorcentaje .dx-texteditor-input', FORMATO_PORCENTAJE)
            .click('#TxtPrm_AdminGeneral_IntDecimalesAdm .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#TxtPrm_AdminGeneral_IntDecimalesAdm .dx-texteditor-input', DECIMALES_ADM)
            .click('#TxtPrm_AdminGeneral_IntDecimalesAdmD .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#TxtPrm_AdminGeneral_IntDecimalesAdmD .dx-texteditor-input', DECIMALES_ADM_D)
                //Campo int, por lo que si se inserta un valor no permitido el sistema guarda correctamentre pero le asigna un 0 por defecto
            .click('#TxtPrm_AdminGeneral_IntDecimalesPrecio .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
                //Campo se deja en vacío y el sistema le asigna un 0 por defecto
            .click('#TxtPrm_AdminGeneral_IntDecimalesCan .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#TxtPrm_AdminGeneral_IntDecimalesCan .dx-texteditor-input', DECIMALES_CANTIDAD)
                //Campo int, por lo que si se inserta un valor no permitido el sistema guarda correctamentre pero le asigna un 0 por defecto
            .click('#TxtPrm_AdminGeneral_IntDecimalesPorcentaje .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#TxtPrm_AdminGeneral_IntDecimalesPorcentaje .dx-texteditor-input', DECIMALES_PORCENTAJE)
            .click('#TxtPrm_AdminGeneral_IntFormatoTerceroPuntos .dx-lookup-field')
            .click(Selector('#BtnGuardar span').withText('Guardar'))
            .wait(2000)
            .expect((Selector('#swal2-content').innerText)).eql(MENSAJE_GUARDADO)
            .click(Selector('button').withText('Aceptar'))
            .wait(2000);
    
        await cerrarPestana360(t);
        await abrirHerramientas360(t, 'Parámetros');
        await t
            .click(Selector('#BtnEditar span').withText('Editar'))
            .wait(2000)
            const modoContable =Selector('#TxtPrm_General_IntModoGral [class^="dx-item dx-item-selected dx-radiobutton-checked dx"]');
            // Obtener el texto actual
            const textoActual = await modoContable.innerText;
            // Quitar un carácter específico (por ejemplo, eliminar un espacio)
            const textoModificado = textoActual.replace('\t\n', '');
            await t
            .wait(2000)
             .expect(textoModificado).eql(MODO_CONTABLE_ESPERADO,'El sistema no guardó los cambios')
            .expect(Selector('#TxtPrm_General_StrFormatoIValor .dx-texteditor-input').value).eql(FORMATO_I_VALOR,'El sistema no guardó el cambio')
            .expect(Selector('#TxtPrm_General_StrFormatoICantidad .dx-texteditor-input').value).eql(FORMATO_I_CANTIDAD,'El sistema no guardó el cambio')
            .expect(Selector('#TxtPrm_General_StrFormatoIPrecio .dx-texteditor-input').value).eql(FORMATO_I_PRECIO,'El sistema no guardó el cambio')
            .expect(Selector('#TxtPrm_AdminGeneral_StrFormatoValor .dx-texteditor-input').value).eql(FORMATO_VALOR,'El sistema no guardó el cambio')
            .expect(Selector('#TxtPrm_AdminGeneral_StrFormatoValorD .dx-texteditor-input').value).eql(FORMATO_VALOR_D,'El sistema no guardó el cambio')
            .expect(Selector('#TxtPrm_AdminGeneral_StrFormatoPrecio .dx-texteditor-input').value).eql(FORMATO_PRECIO,'El sistema no guardó el cambio') 
            .expect(Selector('#TxtPrm_AdminGeneral_StrFormatoCantidad .dx-texteditor-input').value).eql(FORMATO_CANTIDAD,'El sistema no guardó el cambio')
            .expect(Selector('#TxtPrm_AdminGeneral_StrFormatoPorcentaje .dx-texteditor-input').value).eql(FORMATO_PORCENTAJE_GUARDADO,'El sistema no guardó el cambio')
            .expect(Selector('#TxtPrm_AdminGeneral_IntDecimalesAdm .dx-texteditor-input').value).eql(DECIMALES_ADM_GUARDADO,'El sistema no guardó el cambio')
            .expect(Selector('#TxtPrm_AdminGeneral_IntDecimalesAdmD .dx-texteditor-input').value).eql(DECIMALES_ADM_D_GUARDADO,'El sistema no guardó el cambio')
    		.expect(Selector('#TxtPrm_AdminGeneral_IntDecimalesPrecio .dx-texteditor-input').value).eql(DECIMALES_PRECIO_GUARDADO,'El sistema no guardó el cambio')
            .expect(Selector('#TxtPrm_AdminGeneral_IntDecimalesCan .dx-texteditor-input').value).eql(DECIMALES_CANTIDAD_GUARDADO,'El sistema no guardó el cambio')
            .expect(Selector('#TxtPrm_AdminGeneral_IntDecimalesPorcentaje .dx-texteditor-input').value).eql(DECIMALES_PORCENTAJE_GUARDADO,'El sistema no guardó el cambio');
    
        await cerrarPestana360(t);
        await abrirHerramientas360(t, 'Parámetros');
        await t
            .click(Selector('#BtnEditar span').withText('Editar'))
            .click(Selector('#TxtPrm_General_IntModoGral .dx-radiobutton-icon').nth(1))
            .click('#TxtPrm_General_StrFormatoIValor .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#TxtPrm_General_StrFormatoIValor .dx-texteditor-input', FORMATO_I_VALOR_RESTAURAR)
            .click('#TxtPrm_General_StrFormatoICantidad .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#TxtPrm_General_StrFormatoICantidad .dx-texteditor-input', FORMATO_I_CANTIDAD)
            .click('#TxtPrm_General_StrFormatoIPrecio .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#TxtPrm_General_StrFormatoIPrecio .dx-texteditor-input', FORMATO_I_VALOR_RESTAURAR)
            .click('#TxtPrm_AdminGeneral_StrFormatoValor .dx-texteditor-input')
            .pressKey('backspace')
            .pressKey('ctrl+a')
            .typeText('#TxtPrm_AdminGeneral_StrFormatoValor .dx-texteditor-input', FORMATO_I_VALOR_RESTAURAR)
            .click('#TxtPrm_AdminGeneral_StrFormatoValorD .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#TxtPrm_AdminGeneral_StrFormatoValorD .dx-texteditor-input', FORMATO_I_VALOR_RESTAURAR)
            .click('#TxtPrm_AdminGeneral_StrFormatoPrecio .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#TxtPrm_AdminGeneral_StrFormatoPrecio .dx-texteditor-input', FORMATO_PRECIO_RESTAURAR)
            .click('#TxtPrm_AdminGeneral_StrFormatoCantidad .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#TxtPrm_AdminGeneral_StrFormatoCantidad .dx-texteditor-input', FORMATO_CANTIDAD_RESTAURAR)
            .click('#TxtPrm_AdminGeneral_StrFormatoPorcentaje .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#TxtPrm_AdminGeneral_StrFormatoPorcentaje .dx-texteditor-input', FORMATO_PORCENTAJE_RESTAURAR)
            .click('#TxtPrm_AdminGeneral_IntDecimalesAdm .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#TxtPrm_AdminGeneral_IntDecimalesAdm .dx-texteditor-input', DECIMALES_ADM_RESTAURAR)
            .click('#TxtPrm_AdminGeneral_IntDecimalesAdmD .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#TxtPrm_AdminGeneral_IntDecimalesAdmD .dx-texteditor-input', DECIMALES_ADM_RESTAURAR)
            .click('#TxtPrm_AdminGeneral_IntDecimalesPrecio .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .click('#TxtPrm_AdminGeneral_IntDecimalesCan .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#TxtPrm_AdminGeneral_IntDecimalesCan .dx-texteditor-input', DECIMALES_CANTIDAD_RESTAURAR)
            .click('#TxtPrm_AdminGeneral_IntDecimalesPorcentaje .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#TxtPrm_AdminGeneral_IntDecimalesPorcentaje .dx-texteditor-input', DECIMALES_PORCENTAJE_RESTAURAR)
            .click(Selector('#BtnGuardar span').withText('Guardar'))
            .wait(2000)
            .expect((Selector('#swal2-content').innerText)).eql(MENSAJE_GUARDADO)
            .click(Selector('button').withText('Aceptar'))
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

async function ejecutarPruebaInventario(t, config, ingresar) {
    await ingresar(t, config);
        await abrirHerramientas360(t, 'Parámetros');
        await t
            .wait(2000)
            .click('#tabs_parametrosAdmin_Inventarios')   
            .wait(2000) 
            .click('#BtnEditar .dx-icon.dx-icon-edit')
            .wait(4000)
        //Inventarios
            const kardex = Selector('#TxtParametrosGenerales_KardexPorDefecto');
            const kardexIsChecked = await kardex.getAttribute('aria-checked');
    
            if (kardexIsChecked === 'false') {
            await t.click(kardex);
            }
    
            const entradas = Selector('#TxtParametrosGenerales_PrimeroEntradas');
            const entradasIsChecked = await entradas.getAttribute('aria-checked');
    
            if (entradasIsChecked === 'false') {
            await t.click(entradas);
            }
          
            await t
            //.click('#TxtParametrosGenerales_Saldos .dx-checkbox-icon')
            //.click('#TxtParametrosGenerales_ValidaCosteoSalidas .dx-checkbox-icon')
            //Valuación
                .click(Selector('#TxtParametrosGenerales_Valuacion .dx-radiobutton-icon'))
                //.click(Selector('#TxtParametrosGenerales_Valuacion .dx-radiobutton-icon').nth(1))
            //Costeo
                .click(Selector('#TxtParametrosGenerales_Costeo .dx-radiobutton-icon'))
                //.click(Selector('#TxtParametrosGenerales_Costeo .dx-radiobutton-icon').nth(1))
                //.click(Selector('#TxtParametrosGenerales_Costeo .dx-radiobutton-icon').nth(2))
        //Costeo
            const descuento = Selector('#TxtParametrosGenerales_IncluyeDescuento');
            const descuentoIsChecked = await descuento.getAttribute('aria-checked');
    
            if (descuentoIsChecked === 'false') {
            await t.click(descuento);
            }
            /*
             if(!(Selector('#TxtParametrosGenerales_IncluyeDescuento .dx-checkbox-icon').getAttribute('aria-checked'))){
               await t.click('#TxtParametrosGenerales_IncluyeDescuento .dx-checkbox-icon')
            }
            .click('#TxtParametrosGenerales_IncluyeDescuento .dx-checkbox-icon')
            .click('#TxtParametrosGenerales_IncluyeDescuento .dx-checkbox-icon')
            //.click('#TxtParametrosGenerales_PorDivision .dx-checkbox-icon')
            //.click('#TxtParametrosGenerales_UtilidadVenta .dx-checkbox-icon')
            //.click('#TxtParametrosGenerales_UtilidadVenta .dx-checkbox-icon')
            */
            await t
            .wait(3000)
            .click(Selector('#BtnGuardar div').withText('Guardar'))    
            .click(Selector('button').withText('Aceptar'))
            .wait(2000);
    
        await cerrarPestana360(t);
        await abrirHerramientas360(t, 'Parámetros');
        await t
            .click('#tabs_parametrosAdmin_Inventarios')   
            .wait(2000) 
            .click('#BtnEditar .dx-icon.dx-icon-edit')
            .wait(2000)
        //Inventarios
            .expect(Selector('#TxtParametrosGenerales_KardexPorDefecto').getAttribute('aria-checked')).eql('true','El sistema no guardó el cambio')
            .expect(Selector('#TxtParametrosGenerales_PrimeroEntradas').getAttribute('aria-checked')).eql('true','El sistema no guardó el cambio')
            //.click('#TxtParametrosGenerales_KardexPorDefecto .dx-checkbox-icon')
            //.click('#TxtParametrosGenerales_PrimeroEntradas .dx-checkbox-icon')
            //.click('#TxtParametrosGenerales_Saldos .dx-checkbox-icon')
            //.click('#TxtParametrosGenerales_ValidaCosteoSalidas .dx-checkbox-icon')
            //Valuación
                const valuacion =Selector('#TxtParametrosGenerales_Valuacion [class^="dx-item dx-item-selected dx-radiobutton-checked dx"]');
                // Obtener el texto actual
                const textoActual = await valuacion.innerText;
                // Quitar un carácter específico (por ejemplo, eliminar un espacio)
                const textoModificado = textoActual.replace('\t\n', '');
                await t .expect(textoModificado).eql(VALUACION_ESPERADA,'El sistema no guardó los cambios');
            //Costeo
                const costeo =Selector('#TxtParametrosGenerales_Costeo [class^="dx-item dx-item-selected dx-radiobutton-checked dx"]');
                // Obtener el texto actual
                const textoActualcosteo = await costeo.innerText;
                // Quitar un carácter específico (por ejemplo, eliminar un espacio)
                const textoModificado2 = textoActualcosteo.replace('\t\n', '');
                await t .expect(textoModificado2).eql(COSTEO_ESPERADO,'El sistema no guardó los cambios')
        //Costeo
            .expect(Selector('#TxtParametrosGenerales_IncluyeDescuento').getAttribute('aria-checked')).eql('true','El sistema no guardó el cambio');
            await cerrarPestana360(t);
        await cerrarSesion360(t);
}

async function ejecutarPruebaCartera(t, config, ingresar) {
    await ingresar(t, config);
        await abrirHerramientas360(t, 'Parámetros');
        await t
            .click(Selector('#tabs_parametros_Admin'))
            .click('#tabs_parametrosAdmin_Cartera')
            .click(Selector('#BtnEditar div').withText('Editar'))
            .wait(2000)
            //FormaCxC
            .click('#TxtParametrosGenerales_CarteraFormaCxC .dx-radiobutton-icon')
            .click(Selector('#TxtParametrosGenerales_CarteraFormaCxC .dx-radiobutton-icon').nth(1))
            .click(Selector('#TxtParametrosGenerales_CarteraFormaCxC .dx-radio-value-container').nth(2))
            .click(Selector('#TxtParametrosGenerales_CarteraFormaCxC .dx-radiobutton-icon').nth(3))
            //Control dias
            .click('#TxtParametrosGenerales_ControlDias .dx-radiobutton-icon')
            .click(Selector('#TxtParametrosGenerales_ControlDias .dx-radiobutton-icon').nth(1))
            .click(Selector('#TxtParametrosGenerales_ControlDias .dx-radiobutton-icon').nth(2))
            //FormaCxP
            .click('#TxtParametrosGenerales_CarteraFormaCxP .dx-radiobutton-icon')
            .click(Selector('#TxtParametrosGenerales_CarteraFormaCxP .dx-radiobutton-icon').nth(1))
            .click(Selector('#TxtParametrosGenerales_CarteraFormaCxP .dx-radiobutton-icon').nth(2))
            .click(Selector('#TxtParametrosGenerales_CarteraFormaCxP .dx-radiobutton-icon').nth(3))
            //Dias Bloqueo
            .click(Selector('#TxtParametrosGenerales_DiasBloqueo .dx-texteditor-input'))
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#TxtParametrosGenerales_DiasBloqueo .dx-texteditor-input', DIAS_BLOQUEO)
            .click(Selector('#BtnGuardar span').withText('Guardar'))
            .click(Selector('button').withText('Aceptar'))
            .wait(2000);
    
        await cerrarPestana360(t);
        await abrirHerramientas360(t, 'Parámetros');
        await t
            .click(Selector('#tabs_parametros_Admin'))
            .click('#tabs_parametrosAdmin_Cartera')
            .click(Selector('#BtnEditar div').withText('Editar'))
            .wait(2000)
            //
            .expect(Selector('[class^="dx-item dx-item-selected dx-radiobutton-checked dx"]').nth(3).find('.dx-item-content').innerText).eql(CARTERA_FORMA_ESPERADA,'no guardó')
            .expect(Selector('[class^="dx-item dx-item-selected dx-radiobutton-checked dx"]').nth(4).find('.dx-item-content').innerText).eql(CARTERA_FORMA_ESPERADA,'no guardó')
            .expect(Selector('[class^="dx-item dx-item-selected dx-radiobutton-checked dx"]').nth(5).find('.dx-item-content').innerText).eql(CONTROL_DIAS_ESPERADO,'no guardó')
            .expect(Selector('#TxtParametrosGenerales_DiasBloqueo .dx-texteditor-input').value).eql(DIAS_BLOQUEO,'No guardó')
        //'Restaurar Parametros Generales - Cartera'
            .click(Selector('#tabs_parametros_Admin'))
            .click('#tabs_parametrosAdmin_Cartera')
            .click(Selector('#TxtParametrosGenerales_CarteraFormaCxC .dx-radiobutton-icon').nth(1))
            .click('#TxtParametrosGenerales_CarteraFormaCxP .dx-radiobutton-icon')
            .click('#TxtParametrosGenerales_ControlDias .dx-radiobutton-icon')
            .click(Selector('#TxtParametrosGenerales_DiasBloqueo .dx-texteditor-input'))
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#TxtParametrosGenerales_DiasBloqueo .dx-texteditor-input', DIAS_BLOQUEO)
            .click(Selector('#BtnGuardar span').withText('Guardar'))
            .click(Selector('button').withText('Aceptar'))
            .wait(2000);
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

async function ejecutarPruebaDocumentos(t, config, ingresar) {
    await ingresar(t, config);
        await abrirHerramientas360(t, 'Parámetros');
        await t
            .click(Selector('#tabs_parametros_Admin'))
            .click('#tabs_parametrosAdmin_Documentos')
            .click(Selector('#BtnEditar div').withText('Editar'))
            .wait(2000)
            ///.click('#tabs_parametros_Admin')
            .click('#TxtParametrosGenerales_IntDescLista .dx-checkbox-icon')
            .click('#TxtParametrosGenerales_StrDescSerie .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#TxtParametrosGenerales_StrDescSerie .dx-texteditor-input', DESC_SERIE)
            .click('#TxtParametrosGenerales_StrDescSerie1 .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#TxtParametrosGenerales_StrDescSerie1 .dx-texteditor-input', DESC_SERIE1)
            .click('#TxtParametrosGenerales_StrDescSerie2 .dx-texteditor-input')
            .pressKey('backspace')
            .pressKey('ctrl+a')
            .typeText('#TxtParametrosGenerales_StrDescSerie2 .dx-texteditor-input', DESC_SERIE2)
            .click('#TxtParametrosGenerales_StrDescSerie3 .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#TxtParametrosGenerales_StrDescSerie3 .dx-texteditor-input', DESC_SERIE3)
            .click(Selector('#TxtParametrosGenerales_StrIvaGeneral .dx-lookup-field'))
            .click(Selector('.dx-overlay-content .dx-list-item').withText(IVA_GENERAL).nth(0))
            .click(Selector('#BtnGuardar span').withText('Guardar'))
            .click(Selector('button').withText('Aceptar'))
            .wait(2000);
    
        await cerrarPestana360(t);
        await abrirHerramientas360(t, 'Parámetros');
        await t
            .click(Selector('#tabs_parametros_Admin'))
            .click('#tabs_parametrosAdmin_Documentos')
            .click(Selector('#BtnEditar div').withText('Editar'))
            .wait(2000)
            .expect(Selector('#TxtParametrosGenerales_StrDescSerie .dx-texteditor-input').value).eql(DESC_SERIE,'El sistema no guardó el cambio')
            .expect(Selector('#TxtParametrosGenerales_StrDescSerie1 .dx-texteditor-input').value).eql(DESC_SERIE1,'El sistema no guardó el cambio')
            .expect(Selector('#TxtParametrosGenerales_StrDescSerie2 .dx-texteditor-input').value).eql(DESC_SERIE2,'El sistema no guardó el cambio')
            .expect(Selector('#TxtParametrosGenerales_StrDescSerie3 .dx-texteditor-input').value).eql(DESC_SERIE3,'El sistema no guardó el cambio')
    
            .click('#tabs_parametros_Admin')
            .click('#tabs_parametrosAdmin_Documentos')
    //'Restaurar Parametros Generales - Documentos'
            .click('#TxtParametrosGenerales_IntDescLista .dx-checkbox-icon')
            .click('#TxtParametrosGenerales_StrDescSerie .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#TxtParametrosGenerales_StrDescSerie .dx-texteditor-input', DESC_SERIE_RESTAURAR)
            .click('#TxtParametrosGenerales_StrDescSerie1 .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#TxtParametrosGenerales_StrDescSerie1 .dx-texteditor-input', DESC_SERIE1_RESTAURAR)
            .click('#TxtParametrosGenerales_StrDescSerie2 .dx-texteditor-input')
            .pressKey('backspace')
            .pressKey('ctrl+a')
            .typeText('#TxtParametrosGenerales_StrDescSerie2 .dx-texteditor-input', DESC_SERIE2_RESTAURAR)
            .click('#TxtParametrosGenerales_StrDescSerie3 .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#TxtParametrosGenerales_StrDescSerie3 .dx-texteditor-input', DESC_SERIE3_RESTAURAR)
            .click(Selector('#TxtParametrosGenerales_StrIvaGeneral .dx-lookup-field'))
            .click(Selector('.dx-overlay-content .dx-list-item').withText(IVA_SIN).nth(0))
            .click(Selector('#BtnGuardar span').withText('Guardar'))
            .click(Selector('button').withText('Aceptar'))
            .wait(2000);
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `Prueba Parametros Generales - Test Hgi360`
    .page(testAdminConfig.pagina);

test('Prueba Parametros General - General - Test Hgi360', async t => {
    await ejecutarPruebaGeneral(t, testAdminConfig, ingresarAplicacion);
});

test('Prueba Parametros Generales - Inventario - Test Hgi360', async t => {
    await ejecutarPruebaInventario(t, testAdminConfig, ingresarAplicacion);
});

test('Prueba Parámetros Generales - Cartera - Test Hgi360', async t => {
    await ejecutarPruebaCartera(t, testAdminConfig, ingresarAplicacion);
});

test('Prueba Parámetros Generales - Documentos - Test Hgi360', async t => {
    await ejecutarPruebaDocumentos(t, testAdminConfig, ingresarAplicacion);
});

fixture `Prueba Parametros Generales - Hgi360 Admin`
    .page(hgiAdminConfig.pagina);

test('Prueba Parametros General - General - Hgi360 Admin', async t => {
    await ejecutarPruebaGeneral(t, hgiAdminConfig, ingresarAplicacion);
});

test('Prueba Parametros Generales - Inventario - Hgi360 Admin', async t => {
    await ejecutarPruebaInventario(t, hgiAdminConfig, ingresarAplicacion);
});

test('Prueba Parámetros Generales - Cartera - Hgi360 Admin', async t => {
    await ejecutarPruebaCartera(t, hgiAdminConfig, ingresarAplicacion);
});

test('Prueba Parámetros Generales - Documentos - Hgi360 Admin', async t => {
    await ejecutarPruebaDocumentos(t, hgiAdminConfig, ingresarAplicacion);
});
