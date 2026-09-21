import { Selector } from 'testcafe';
import * as HelpersHgi360 from '../../Funciones/HelpersHgi360.js';
import * as HelpersHappgi from '../../Funciones/HelpersHappgi.js';
import { testNominaConfig } from '../../ParametrosPruebas/TestErpNomina8902.js';
import { testHappgiNominaConfig } from '../../ParametrosPruebas/TestHappgiNomina8902.js';

const helpersDe = (config) =>
    String(config?.pagina || '').toLowerCase().includes('hgi360')
        ? HelpersHgi360
        : HelpersHappgi;

const esHgi360 = (config) =>
    String(config?.pagina || '').toLowerCase().includes('hgi360');

let abrirMaestros = HelpersHappgi.abrirMaestros;
let cerrarSesion = HelpersHappgi.cerrarSesion;
let ingresarAplicacion = HelpersHappgi.ingresarAplicacion;

const usarHelpersDe = (config) => {
    const h = helpersDe(config);
    abrirMaestros = esHgi360(config) ? h.abrirMaestros360 : h.abrirMaestros;
    cerrarSesion = esHgi360(config)
        ? (h.cerrarSesion360 || HelpersHgi360.cerrarSesion360)
        : h.cerrarSesion;
    ingresarAplicacion = h.ingresarAplicacion;
}; 




fixture `INC081 Campos Maestro Empleados Nomina HGI360`
    .page (testNominaConfig.pagina)

test('INC081 Campos Maestro Empleados Nomina HGI360', async t => {
    usarHelpersDe(testNominaConfig);
    await ingresarAplicacion(t, testNominaConfig);
    await abrirMaestros(t, esHgi360(testNominaConfig) ? 'Empleados' : 'EMPLEADOS');
    await t
         //Se ingresa
         .wait(2000)
         .typeText(Selector('.dx-texteditor-input-container .dx-texteditor-input'),'1000099598')
         .wait(1500)
         .click(Selector('[class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
 
		//Se validan los campos
    .expect(Selector('#panelEmpleadoFotoPreview').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_CiudadNac .dx-lookup-field').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_FechaNac .dx-texteditor-input').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_CiudadResidencia .dx-lookup-field').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_Telefono .dx-texteditor-input').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_Celular .dx-texteditor-input').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_EstadoCivil .dx-texteditor-input').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_Conyuge .dx-texteditor-input').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_Escolaridad .dx-lookup-field').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_NumHijos .dx-texteditor-input').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_TipoSangre .dx-texteditor-input').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_Vivienda .dx-texteditor-input').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_Vehiculo .dx-texteditor-input').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_TipoIdAnt div').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_IdentificacionAnt .dx-texteditor-input').visible).ok('no se encontró el campo')
    .click('#tabs_Empleado_Laboral')
    .expect(Selector('#txtEmpleado_Cargo .dx-lookup-field').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_Regimen .dx-texteditor-input').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_Sucursal .dx-lookup-field').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_CCosto .dx-lookup-field').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_SubCCosto .dx-lookup-field').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_Puesto .dx-texteditor-input').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_UpcAdicional .dx-texteditor-input').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_ValorHora .dx-texteditor-input').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_BeneficiarioPacto .dx-texteditor-input').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_CondicionEspecial .dx-texteditor-input').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_Marcado span').withText('Marcado').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_Pignoracion span').withText('Pignoración').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_ExtranjeroNoPension span').withText('Extranjero no pensión').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_ColombianoExterior span').withText('Colombiano en el exterior').visible).ok('no se encontró el campo')
    .click('#tabs_Empleado_Nomina')
    .expect(Selector('#txtEmpleado_CiudadBanco .dx-lookup-field').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_CodigoBanco .dx-texteditor-input').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_FondoPension .dx-lookup-field').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_FondoCesantias .dx-lookup-field').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_EPS .dx-lookup-field').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_CCF .dx-lookup-field').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_TarifaArl .dx-lookup-field').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_SubActividad .dx-texteditor-input').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_ReteProcedimiento .dx-dropdowneditor-icon').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_ReteDevengado .dx-texteditor-input').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_ReteApSalud .dx-texteditor-input').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_ReteApPension .dx-texteditor-input').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_ReteApVolPension .dx-texteditor-input').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_ReteApAfc .dx-texteditor-input').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_ReteMPre .dx-texteditor-input').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_ReteEdViv .dx-texteditor-input').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_ReteConRentaEx .dx-texteditor-input').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_RetePorcentaje .dx-texteditor-input').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_ReteAudita .dx-checkbox-icon').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_RetePersCargo .dx-checkbox-icon').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_ReteDeclRenta .dx-checkbox-icon').visible).ok('no se encontró el campo')
    //**Se valida la grid */
    await t
    .expect(Selector('#Panel_EmpleadosSalarios').visible).ok() //.withText('Contrato')
/*
        .expect(Selector('#dx-col-26').visible).ok() //.withText('Contrato')
    await t
        .expect(Selector('#dx-col-27').visible).ok() //.withText('Fecha')
    await t
        .expect(Selector('#dx-col-28').visible).ok() //.withText('Salario')
*/
        .switchToMainWindow();
    await cerrarSesion(t);
});

/*
+++++++++++++++++++++++++++++++++++++++++++++
+++++++++++++++++++++++++++++++++++++++++++++
+++++++++++++++++++++++++++++++++++++++++++++
*/



fixture `INC081 Campos Maestro Empleados Nomina Happgi`
    .page (testHappgiNominaConfig.pagina)

test('INC081 Campos Maestro Empleados Nomina Happgi', async t => {
    usarHelpersDe(testHappgiNominaConfig);
    await ingresarAplicacion(t, testHappgiNominaConfig);
    await abrirMaestros(t, esHgi360(testHappgiNominaConfig) ? 'Empleados' : 'EMPLEADOS');
    await t
         //Se ingresa
         .wait(2000)
         .typeText(Selector('.dx-texteditor-input-container .dx-texteditor-input'),'1000099598')
         .wait(1500)
         .click(Selector('[class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
 
		//Se validan los campos
    .expect(Selector('#panelEmpleadoFotoPreview').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_CiudadNac .dx-lookup-field').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_FechaNac .dx-texteditor-input').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_CiudadResidencia .dx-lookup-field').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_Telefono .dx-texteditor-input').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_Celular .dx-texteditor-input').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_EstadoCivil .dx-texteditor-input').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_Conyuge .dx-texteditor-input').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_Escolaridad .dx-lookup-field').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_NumHijos .dx-texteditor-input').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_TipoSangre .dx-texteditor-input').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_Vivienda .dx-texteditor-input').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_Vehiculo .dx-texteditor-input').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_TipoIdAnt div').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_IdentificacionAnt .dx-texteditor-input').visible).ok('no se encontró el campo')
    .click('#tabs_Empleado_Laboral')
    .expect(Selector('#txtEmpleado_Cargo .dx-lookup-field').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_Regimen .dx-texteditor-input').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_Sucursal .dx-lookup-field').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_CCosto .dx-lookup-field').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_SubCCosto .dx-lookup-field').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_Puesto .dx-texteditor-input').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_UpcAdicional .dx-texteditor-input').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_ValorHora .dx-texteditor-input').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_BeneficiarioPacto .dx-texteditor-input').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_CondicionEspecial .dx-texteditor-input').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_Marcado span').withText('Marcado').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_Pignoracion span').withText('Pignoración').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_ExtranjeroNoPension span').withText('Extranjero no pensión').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_ColombianoExterior span').withText('Colombiano en el exterior').visible).ok('no se encontró el campo')
    .click('#tabs_Empleado_Nomina')
    .expect(Selector('#txtEmpleado_CiudadBanco .dx-lookup-field').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_CodigoBanco .dx-texteditor-input').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_FondoPension .dx-lookup-field').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_FondoCesantias .dx-lookup-field').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_EPS .dx-lookup-field').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_CCF .dx-lookup-field').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_TarifaArl .dx-lookup-field').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_SubActividad .dx-texteditor-input').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_ReteProcedimiento .dx-dropdowneditor-icon').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_ReteDevengado .dx-texteditor-input').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_ReteApSalud .dx-texteditor-input').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_ReteApPension .dx-texteditor-input').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_ReteApVolPension .dx-texteditor-input').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_ReteApAfc .dx-texteditor-input').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_ReteMPre .dx-texteditor-input').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_ReteEdViv .dx-texteditor-input').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_ReteConRentaEx .dx-texteditor-input').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_RetePorcentaje .dx-texteditor-input').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_ReteAudita .dx-checkbox-icon').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_RetePersCargo .dx-checkbox-icon').visible).ok('no se encontró el campo')
    .expect(Selector('#txtEmpleado_ReteDeclRenta .dx-checkbox-icon').visible).ok('no se encontró el campo')
    //**Se valida la grid */Selector('#tabs_Empleado_content_Nomina div').withText('Contrato').nth(1)
    //
    await t
    //Selector('div').withText('Contrato').nth(42)
    .expect(Selector('#Panel_EmpleadosSalarios').visible).ok() //.withText('Contrato')
/*
        .expect(Selector('#dx-col-26').visible).ok() //.withText('Contrato')
    await t//Selector('#dx-col-27 div').withText('Fecha') o Selector('div').withText('Fecha').nth(44)
        .expect(Selector('#dx-col-27').visible).ok() //.withText('Fecha')
    await t
        .expect(Selector('#dx-col-28').visible).ok() //.withText('Salario') //Selector('td').withText('Salario').nth(1)
*/
        .switchToMainWindow();
    await cerrarSesion(t);
});

/*
+++++++++++++++++++++++++++++++++++++++++++++
+++++++++++++++++++++++++++++++++++++++++++++
+++++++++++++++++++++++++++++++++++++++++++++
*/