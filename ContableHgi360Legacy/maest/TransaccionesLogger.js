
import { testAdminConfig } from '../../ParametrosPruebas/ParametrosPruebas.js'; 



/*
**********************************************************************
**********************************************************************
*/


/*
**********************************************************************
**********************************************************************
*/

import { RequestLogger, Selector } from 'testcafe';

const apiTransacciones = RequestLogger(
  /\/api\/Transacciones\/ConsultarNew\?/i,
  { logResponseBody: false }
);

const moduleTransacciones = RequestLogger(
  /ModuleWrapper\.html\?module=Transacciones/i,
  { logResponseBody: false }
);

fixture`Transacciones`
  .page('https://testerp.hgi.com.co/Views/Masters/Master.html')
  .requestHooks(apiTransacciones, moduleTransacciones);

test('Medir carga real', async t => {
  await t
    .typeText('#TxtEmpresaIdentificacion .dx-texteditor-input', testAdminConfig.empresa)    
        .wait(1000)
        .typeText('#TxtUsuarioCodigo .dx-texteditor-input', testAdminConfig.usuario)
        .wait(1000)
        .typeText('#TxtUsuarioClave .dx-texteditor-input', testAdminConfig.clave)
        .click(Selector('#buttonAutenticar div').withText('Ingresar'))
        .wait(3000)

    .click(Selector('a').withText('Maestros'))
    .click(Selector('span').withText('TRANSACCIONES'));

  // Espera a que al menos dispare el XHR de la grid
  await t.expect(apiTransacciones.requests.length).gte(1, { timeout: 30000 });

  const lastApi = apiTransacciones.requests.at(-1);
  console.log('API timeMs:', lastApi.response?.timeMs, 'status:', lastApi.response?.statusCode);

  const lastModule = moduleTransacciones.requests.at(-1);
  console.log('MODULE timeMs:', lastModule?.response?.timeMs, 'status:', lastModule?.response?.statusCode);
});

/*
**************************









*************************************
*/

const anyApi = RequestLogger(/\/+api\//i);

fixture`Debug`
  .page('https://testerp.hgi.com.co/Views/Masters/Master.html')
  .requestHooks(anyApi);

test('ver urls api', async t => {
    await t
  .typeText('#TxtEmpresaIdentificacion .dx-texteditor-input', testAdminConfig.empresa)    
        .wait(1000)
        .typeText('#TxtUsuarioCodigo .dx-texteditor-input', testAdminConfig.usuario)
        .wait(1000)
        .typeText('#TxtUsuarioClave .dx-texteditor-input', testAdminConfig.clave)
        .click(Selector('#buttonAutenticar div').withText('Ingresar'))
        .wait(3000)

    .click(Selector('a').withText('Maestros'))
    .click(Selector('span').withText('TRANSACCIONES'));
  await t
  .wait(2000); // solo en debug

  console.log(anyApi.requests.map(r => r.request.url).join('\n'));
});