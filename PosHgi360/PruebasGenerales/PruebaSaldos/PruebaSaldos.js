import { Selector } from 'testcafe';
import {
    cerrarSesion360,
    ingresarAplicacion,
    seleccionarOpcion,
    cerrarPestana360,
    limpiarCacheChromeTestCafe
} from '../../../Funciones/HelpersHgi360Legacy.js';
import { abrirMaestroPos360 as abrirMaestros360 } from '../../../Funciones/MenuMaestros360.js';
import { testPosConfig, hgiPosConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';
    //En mi happgi no se han publicado unos cambios, por lo que la pruebas fallan

const REPORTE = 'Kardex';
const ANIO = '2000';
const PRODUCTO = '01';
const BODEGA = '01';
const SALDO_ESPERADO = '1';

fixture `Prueba Saldos Happgi Pos - Test Hgi360`
    .page (testPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba sumatoria moviminetos reporte Inventario - Test Hgi360', async t => {
    await ingresarAplicacion(t, testPosConfig);
await t
        .click(Selector('a').withText('Reportes'))
        .click(Selector('span').withText('INVENTARIOS'))
        .wait(1500)
        .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
        .wait(1500)
        .click(Selector('.dx-lookup-field-wrapper div').withText('Seleccione un reporte'))
        ;
    await seleccionarOpcion(t, REPORTE);
    await t
        .click(Selector('.dx-radio-value-container').nth(1).find('.dx-radiobutton-icon'))
        .click(Selector('.dx-lookup-field-wrapper').nth(1).find('div').withText('2025'))
        ;
    await seleccionarOpcion(t, ANIO);
    await t
        .click(Selector('div').withText('Generar').nth(18))
        .wait(4000)
        .typeText((Selector('.dx-texteditor-input-container').nth(9).find('.dx-texteditor-input')),PRODUCTO)
        .typeText((Selector('.dx-texteditor-input-container').nth(6).find('.dx-texteditor-input')),BODEGA)
    .wait(3000)
        .click(Selector('.dx-column-indicators').nth(2).find('.dx-header-filter.dx-header-filter-empty'))
        .click(Selector('.dx-checkbox-icon').nth(28))
        .click(Selector('.dx-checkbox-icon').nth(29))
    .wait(3000)
        .click(Selector('.dx-checkbox-icon').nth(30))
        .click(Selector('.dx-checkbox-icon').nth(31))
    .wait(3000)
        .click(Selector('.dx-checkbox-icon').nth(33))
        .click(Selector('div').withText('Aceptar').nth(12))
        .click(Selector('.dx-checkbox-container').nth(1).find('.dx-checkbox-icon'))
        .wait(4000)
        //.click('#2350013_GridReportes .dx-checkbox-icon')
        .click(Selector('.dx-checkbox-container').nth(1).find('.dx-checkbox-icon'))
        .wait(4000)
        .click(Selector('td').withText('Fecha'))
        .wait(4000)
let iPar = 1;
let iImpar = 1;
let acumuladorPar = 0;
let acumuladorImpar = 0;
// Verificar si el primer elemento par existe
let selectorPar = Selector('[class^="dx-row dx-data-row dx-row-lines dx-column-lines pa"] td').nth(9);
let condicionPar = await selectorPar.exists;
//Ciclo para sumar los demás registros
while (condicionPar) {
    let valorPar = await selectorPar.innerText;
    // Parsear el valor a número, eliminando caracteres no numéricos si es necesario
    let valorParseado = parseInt(valorPar, 10);
    if (!isNaN(valorParseado)) {
        acumuladorPar += valorParseado;
    }
    // Verificar si el siguiente elemento par existe
    selectorPar = Selector('[class^="dx-row dx-data-row dx-row-lines dx-column-lines pa"]').nth(iPar).find('td').nth(9);
    condicionPar = await selectorPar.exists;
    iPar++;
}
// Verificar si el primer elemento impar existe
let selectorImpar = Selector('[class^="dx-row dx-data-row dx-row-lines dx-column-lines im"] td').nth(9);
let condicionImpar = await selectorImpar.exists;
while (condicionImpar) {
    let valorImpar = await selectorImpar.innerText;
    // Parsear el valor a número
    let valorParseado = parseInt(valorImpar, 10);
    if (!isNaN(valorParseado)) {
        acumuladorImpar += valorParseado; // Sumar al acumulador
    }
    // Verificar si el siguiente elemento impar existe
    selectorImpar = Selector('[class^="dx-row dx-data-row dx-row-lines dx-column-lines im"]').nth(iImpar).find('td').nth(9);
    condicionImpar = await selectorImpar.exists;
    iImpar++;
}
// Comparar la suma con el valor esperado de las entradas
let totalEntradas = acumuladorPar + acumuladorImpar;
await t.expect((totalEntradas).toString()).eql(await (Selector('.dx-datagrid-summary-item.dx-datagrid-text-content').nth(7)).innerText);

//Para las salidas
 iPar = 1;
 iImpar = 1;
 acumuladorPar = 0;
 acumuladorImpar = 0;

// Verificar si el primer elemento par existe
 selectorPar = Selector('[class^="dx-row dx-data-row dx-row-lines dx-column-lines pa"] td').nth(10);
 condicionPar = await selectorPar.exists;

//Ciclo para sumar los demás registros
while (condicionPar) {
   let  valorPar = await selectorPar.innerText;
    // Parsear el valor a número, eliminando caracteres no numéricos si es necesario
    let valorParseado = parseInt(valorPar, 10);
    if (!isNaN(valorParseado)) {
        acumuladorPar += valorParseado;
    }
    // Verificar si el siguiente elemento par existe
    selectorPar = Selector('[class^="dx-row dx-data-row dx-row-lines dx-column-lines pa"]').nth(iPar).find('td').nth(10);
    condicionPar = await selectorPar.exists;
    iPar++;
}
// Verificar si el primer elemento impar existe
 selectorImpar = Selector('[class^="dx-row dx-data-row dx-row-lines dx-column-lines im"] td').nth(10);
 condicionImpar = await selectorImpar.exists;
while (condicionImpar) {
    let valorImpar = await selectorImpar.innerText;
    // Parsear el valor a número
    let valorParseado = parseInt(valorImpar, 10);
    if (!isNaN(valorParseado)) {
        acumuladorImpar += valorParseado; // Sumar al acumulador
    }
    // Verificar si el siguiente elemento impar existe
    selectorImpar = Selector('[class^="dx-row dx-data-row dx-row-lines dx-column-lines im"]').nth(iImpar).find('td').nth(10);
    condicionImpar = await selectorImpar.exists;
    iImpar++;
}
// Comparar la suma con el valor esperado de las entradas
let totalSalidas = acumuladorPar + acumuladorImpar;
await t.expect((totalSalidas).toString()).eql(await (Selector('.dx-datagrid-summary-item.dx-datagrid-text-content').nth(8)).innerText);

// Comparar el valor total con el valor mostrado en la página
let valorSaldoFinal =''
if(iImpar>iPar){
    valorSaldoFinal = await (Selector('[class^="dx-row dx-data-row dx-row-lines dx-column-lines im"]').nth(iImpar-2).find('td').nth(11)).innerText;
}else{
    valorSaldoFinal = await (Selector('[class^="dx-row dx-data-row dx-row-lines dx-column-lines pa"]').nth(iPar-2).find('td').nth(11)).innerText;
}
await t
        .wait(5000)
.expect(valorSaldoFinal).eql((totalEntradas-totalSalidas).toString(), 'El valor mostrado no concuerda con el valor de la sumatoria de los movimientos')
        .wait(6000);
    //Se ingresa al maestro de productos

        await abrirMaestros360(t, 'Productos', 'productos');
    await t
        .typeText('#gridProductos .dx-texteditor-input', PRODUCTO)
        .wait(3000)
        .expect((Selector('#gridProductos td').withText(PRODUCTO)).exists).ok('El producto no se encuentra en el grid de productos')
        .click('#gridProductos [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]')
        .wait(3000)
        .click('#gridProductosSaldos .dx-icon.dx-icon-refresh')
        .wait(3000)
        .typeText('#gridProductosSaldos .dx-texteditor-input', BODEGA)
        .expect((Selector('#gridProductosSaldos td').withText(BODEGA)).exists).ok('No se encontró la bodega para este producto')
        .wait(3000)
        .expect(Selector('#gridProductosSaldos td').withText(SALDO_ESPERADO).nth(1).innerText).eql((totalEntradas-totalSalidas).toString(),'No coinciden los valores')
    await cerrarPestana360(t);
    await cerrarSesion360(t);
});

fixture `Prueba Saldos Happgi Pos - Hgi360 Pos`
    .page (hgiPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba sumatoria moviminetos reporte Inventario - Hgi360 Pos', async t => {
    await ingresarAplicacion(t, hgiPosConfig);
await t
        .click(Selector('a').withText('Reportes'))
        .click(Selector('span').withText('INVENTARIOS'))
        .wait(1500)
        .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
        .wait(1500)
        .click(Selector('.dx-lookup-field-wrapper div').withText('Seleccione un reporte'))
        ;
    await seleccionarOpcion(t, REPORTE);
    await t
        .click(Selector('.dx-radio-value-container').nth(1).find('.dx-radiobutton-icon'))
        .click(Selector('.dx-lookup-field-wrapper').nth(1).find('div').withText('2025'))
        ;
    await seleccionarOpcion(t, ANIO);
    await t
        .click(Selector('div').withText('Generar').nth(18))
        .wait(4000)
        .typeText((Selector('.dx-texteditor-input-container').nth(9).find('.dx-texteditor-input')),PRODUCTO)
        .typeText((Selector('.dx-texteditor-input-container').nth(6).find('.dx-texteditor-input')),BODEGA)
    .wait(3000)
        .click(Selector('.dx-column-indicators').nth(2).find('.dx-header-filter.dx-header-filter-empty'))
        .click(Selector('.dx-checkbox-icon').nth(28))
        .click(Selector('.dx-checkbox-icon').nth(29))
    .wait(3000)
        .click(Selector('.dx-checkbox-icon').nth(30))
        .click(Selector('.dx-checkbox-icon').nth(31))
    .wait(3000)
        .click(Selector('.dx-checkbox-icon').nth(33))
        .click(Selector('div').withText('Aceptar').nth(12))
        .click(Selector('.dx-checkbox-container').nth(1).find('.dx-checkbox-icon'))
        .wait(4000)
        //.click('#2350013_GridReportes .dx-checkbox-icon')
        .click(Selector('.dx-checkbox-container').nth(1).find('.dx-checkbox-icon'))
        .wait(4000)
        .click(Selector('td').withText('Fecha'))
        .wait(4000)
let iPar = 1;
let iImpar = 1;
let acumuladorPar = 0;
let acumuladorImpar = 0;
// Verificar si el primer elemento par existe
let selectorPar = Selector('[class^="dx-row dx-data-row dx-row-lines dx-column-lines pa"] td').nth(9);
let condicionPar = await selectorPar.exists;
//Ciclo para sumar los demás registros
while (condicionPar) {
    let valorPar = await selectorPar.innerText;
    // Parsear el valor a número, eliminando caracteres no numéricos si es necesario
    let valorParseado = parseInt(valorPar, 10);
    if (!isNaN(valorParseado)) {
        acumuladorPar += valorParseado;
    }
    // Verificar si el siguiente elemento par existe
    selectorPar = Selector('[class^="dx-row dx-data-row dx-row-lines dx-column-lines pa"]').nth(iPar).find('td').nth(9);
    condicionPar = await selectorPar.exists;
    iPar++;
}
// Verificar si el primer elemento impar existe
let selectorImpar = Selector('[class^="dx-row dx-data-row dx-row-lines dx-column-lines im"] td').nth(9);
let condicionImpar = await selectorImpar.exists;
while (condicionImpar) {
    let valorImpar = await selectorImpar.innerText;
    // Parsear el valor a número
    let valorParseado = parseInt(valorImpar, 10);
    if (!isNaN(valorParseado)) {
        acumuladorImpar += valorParseado; // Sumar al acumulador
    }
    // Verificar si el siguiente elemento impar existe
    selectorImpar = Selector('[class^="dx-row dx-data-row dx-row-lines dx-column-lines im"]').nth(iImpar).find('td').nth(9);
    condicionImpar = await selectorImpar.exists;
    iImpar++;
}
// Comparar la suma con el valor esperado de las entradas
let totalEntradas = acumuladorPar + acumuladorImpar;
await t.expect((totalEntradas).toString()).eql(await (Selector('.dx-datagrid-summary-item.dx-datagrid-text-content').nth(7)).innerText);

//Para las salidas
 iPar = 1;
 iImpar = 1;
 acumuladorPar = 0;
 acumuladorImpar = 0;

// Verificar si el primer elemento par existe
 selectorPar = Selector('[class^="dx-row dx-data-row dx-row-lines dx-column-lines pa"] td').nth(10);
 condicionPar = await selectorPar.exists;

//Ciclo para sumar los demás registros
while (condicionPar) {
   let  valorPar = await selectorPar.innerText;
    // Parsear el valor a número, eliminando caracteres no numéricos si es necesario
    let valorParseado = parseInt(valorPar, 10);
    if (!isNaN(valorParseado)) {
        acumuladorPar += valorParseado;
    }
    // Verificar si el siguiente elemento par existe
    selectorPar = Selector('[class^="dx-row dx-data-row dx-row-lines dx-column-lines pa"]').nth(iPar).find('td').nth(10);
    condicionPar = await selectorPar.exists;
    iPar++;
}
// Verificar si el primer elemento impar existe
 selectorImpar = Selector('[class^="dx-row dx-data-row dx-row-lines dx-column-lines im"] td').nth(10);
 condicionImpar = await selectorImpar.exists;
while (condicionImpar) {
    let valorImpar = await selectorImpar.innerText;
    // Parsear el valor a número
    let valorParseado = parseInt(valorImpar, 10);
    if (!isNaN(valorParseado)) {
        acumuladorImpar += valorParseado; // Sumar al acumulador
    }
    // Verificar si el siguiente elemento impar existe
    selectorImpar = Selector('[class^="dx-row dx-data-row dx-row-lines dx-column-lines im"]').nth(iImpar).find('td').nth(10);
    condicionImpar = await selectorImpar.exists;
    iImpar++;
}
// Comparar la suma con el valor esperado de las entradas
let totalSalidas = acumuladorPar + acumuladorImpar;
await t.expect((totalSalidas).toString()).eql(await (Selector('.dx-datagrid-summary-item.dx-datagrid-text-content').nth(8)).innerText);

// Comparar el valor total con el valor mostrado en la página
let valorSaldoFinal =''
if(iImpar>iPar){
    valorSaldoFinal = await (Selector('[class^="dx-row dx-data-row dx-row-lines dx-column-lines im"]').nth(iImpar-2).find('td').nth(11)).innerText;
}else{
    valorSaldoFinal = await (Selector('[class^="dx-row dx-data-row dx-row-lines dx-column-lines pa"]').nth(iPar-2).find('td').nth(11)).innerText;
}
await t
        .wait(5000)
.expect(valorSaldoFinal).eql((totalEntradas-totalSalidas).toString(), 'El valor mostrado no concuerda con el valor de la sumatoria de los movimientos')
        .wait(6000);
    //Se ingresa al maestro de productos

        await abrirMaestros360(t, 'Productos', 'productos');
    await t
        .typeText('#gridProductos .dx-texteditor-input', PRODUCTO)
        .wait(3000)
        .expect((Selector('#gridProductos td').withText(PRODUCTO)).exists).ok('El producto no se encuentra en el grid de productos')
        .click('#gridProductos [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]')
        .wait(3000)
        .click('#gridProductosSaldos .dx-icon.dx-icon-refresh')
        .wait(3000)
        .typeText('#gridProductosSaldos .dx-texteditor-input', BODEGA)
        .expect((Selector('#gridProductosSaldos td').withText(BODEGA)).exists).ok('No se encontró la bodega para este producto')
        .wait(3000)
        .expect(Selector('#gridProductosSaldos td').withText(SALDO_ESPERADO).nth(1).innerText).eql((totalEntradas-totalSalidas).toString(),'No coinciden los valores')
    await cerrarPestana360(t);
    await cerrarSesion360(t);
});
