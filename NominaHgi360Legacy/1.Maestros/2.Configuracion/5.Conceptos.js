import { Selector } from 'testcafe';
import { miNominaConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';
import { testNominaConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';
import {
    abrirMaestros360,
    cerrarSesion360,
    eliminarRegistroDesdeGrid,
    eliminarRegistroSiExiste,
    ingresarAplicacion,
    
    seleccionarOpcion,
} from '../../../Funciones/HelpersHgi360Legacy.js';
    //En mi happgi no se han publicado unos cambios, por lo que la pruebas fallan

const CODIGO_CONCEPTO = 'CodigoConceptoNom';
const DESCRIPCION_CONCEPTO = 'DescConc';
const DESCRIPCION_CONCEPTO_EDITADA = 'NuevaDescConc';
const CODIGO_DIAN_INICIAL = 'Anticipos de Nómina.';
const CODIGO_DIAN_FINAL = 'Deduccion por Anticipos de Nómina.';
const FORMA_LIQUIDACION = 'Salario Básico';
const TIPO_CONCEPTO = 'Deducción';
const PERIODICIDAD = 'Mensual';
const GRUPO = 'Salud';
const TIPO_AUSENTISMO = 'Enfermedad';

async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    await abrirMaestros360(t, 'Conceptos');
    await eliminarRegistroSiExiste(t, '#gridConceptosNom', CODIGO_CONCEPTO);

    await t
        .click('#gridConceptosNom .dx-icon.dx-icon-add')
        .typeText(Selector('#txtConceptosNom_StrIdConcepto').nth(1), CODIGO_CONCEPTO)
        .click(Selector('#txtConceptosNom_StrCodigoDian .dx-lookup-field'))
        ;
    await seleccionarOpcion(t, CODIGO_DIAN_INICIAL);
    await t
        .click('#txtConceptosNom_StrDescripcion .dx-texteditor-input')
        .typeText('#txtConceptosNom_StrDescripcion .dx-texteditor-input', DESCRIPCION_CONCEPTO)
        .click(Selector('#txtConceptosNom_IntFormaLiquida .dx-lookup-field'))
        ;
    await seleccionarOpcion(t, FORMA_LIQUIDACION);
    await t
        .click('#txtConceptosNom_IntRestaHorasBase .dx-checkbox-icon')
        .click(Selector('#txt_lista_ConceptosNomTipoConcepto .dx-lookup-field'))
        ;
    await seleccionarOpcion(t, TIPO_CONCEPTO);
    await t
        .click('#txtConceptosNom_IntEstado .dx-checkbox-icon')
        .click('#txtConceptosNom_IntPeriodicidad .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtConceptosNom_IntPeriodicidad .dx-texteditor-input', '1')
        .click('#txtConceptosNom_IntPrioridad .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtConceptosNom_IntPrioridad .dx-texteditor-input', '1')
        .click(Selector('#txtConceptosNom_IntOperacionHoras .dx-radiobutton-icon').nth(1))
        .click(Selector('#txtConceptosNom_IntOperacionHoras .dx-radiobutton-icon').nth(2))
        .click('#txtConceptosNom_IntOperacionHoras .dx-radiobutton-icon')
        .click(Selector('#txtConceptosNom_StrPeriodicidad .dx-lookup-field'))
        ;
    await seleccionarOpcion(t, PERIODICIDAD);
    await t
        .click(Selector('#txtConceptosNom_IntGrupo .dx-lookup-field'))
        ;
    await seleccionarOpcion(t, GRUPO);
    await t
        .click(Selector('#txtConceptosNom_IntTipoAusentismo .dx-lookup-field'))
        ;
    await seleccionarOpcion(t, TIPO_AUSENTISMO);
    await t
        .click(Selector('#txtConceptosNom_IntEstado .dx-checkbox-icon'))
        .click(Selector('#BtnGuardarConceptosNom span').withText('Guardar'))
        .click(Selector('#txtConceptosNom_StrCodigoDian .dx-lookup-field'))
        ;
    await seleccionarOpcion(t, CODIGO_DIAN_FINAL);
    await t
        .click(Selector('#BtnGuardarConceptosNom span').withText('Guardar'))
        .click(Selector('button').withText('Aceptar'))
    //Se edita el registro
        .click(Selector('#gridConceptosNom .dx-icon.dx-icon-refresh'))
        .wait(2000) 
        .typeText(Selector('#gridConceptosNom .dx-texteditor-input'), CODIGO_CONCEPTO)
        .wait(2000)
        .click(Selector('#gridConceptosNom [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
        .click('#txtConceptosNom_StrDescripcion .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtConceptosNom_StrDescripcion .dx-texteditor-input', DESCRIPCION_CONCEPTO_EDITADA)
        .click('#Tab_ConceptosNom_BaseAcumulados')
        .click(Selector('#txtConceptosNom_IntOperacion .dx-radiobutton-icon'))
        .click(Selector('#BtnGuardarConceptosNom span').withText('Guardar'))
        .click(Selector('button').withText('Aceptar'))
        .wait(2000)
        .expect((Selector('#gridConceptosNom td').withText(DESCRIPCION_CONCEPTO_EDITADA)).exists).ok('no se actualizó el registro')
    //Se elimina el registro
        ;
    await eliminarRegistroDesdeGrid(t, '#gridConceptosNom');
    await t.switchToMainWindow();
    await cerrarSesion360(t);
}

fixture `Prueba Conceptos Nom Hgi360 Nomina - MiHgi360`
    .page(miNominaConfig.pagina);

test('Prueba Conceptos Nom - MiHgi360', async t => {
    await ejecutarPrueba(t, miNominaConfig);
});

fixture `Prueba Conceptos Nom Hgi360 Nomina - Test Hgi360`
    .page(testNominaConfig.pagina);

test('Prueba Conceptos Nom - Test Hgi360', async t => {
    await ejecutarPrueba(t, testNominaConfig);
});