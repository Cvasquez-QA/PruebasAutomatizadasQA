import { Selector } from 'testcafe';
import {
    ingresarAplicacion,
    abrirMaestros360,
    eliminarRegistroSiExiste,
    cerrarSesion360,
    cerrarPestana360,
    eliminarRegistroDesdeGrid
} from '../../../Funciones/HelpersHgi360.js';
import { testAdminConfig } from '../../../ParametrosPruebas/TestErpAdmin8902.js';
import { hgiAdminConfig } from '../../../ParametrosPruebas/Hgi360Admin8888.js';

const CODIGO = 'MISector';
const DESCRIPCION = 'MIDESCRIPCION';
const DESCRIPCION_EDIT = 'MINUEVADESCRIPCION';

async function ejecutarPrueba(t, config, ingresar) {
    await ingresar(t, config);
        await abrirMaestros360(t, 'Sectores', 'localizacion');
        await eliminarRegistroSiExiste(t, '#gridSectores', CODIGO);
        await t
            .click('#gridSectores .dx-icon.dx-icon-add')
            .typeText('#txtSector_Codigofocus', CODIGO)
            .typeText('#txtSector_Descripcion .dx-texteditor-input', DESCRIPCION)
            .click(Selector('#BtnActualizarSector span').withText('Guardar'))
            .wait(3000)
            .expect(Selector('#gridSectores td').withText(CODIGO).exists).ok()
            .click(Selector('#gridSectores [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
            .click('#txtSector_Descripcion .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtSector_Descripcion .dx-texteditor-input', DESCRIPCION_EDIT)
            .click(Selector('#BtnActualizarSector div').withText('Guardar'))
            .wait(4000);
        await eliminarRegistroDesdeGrid(t, '#gridSectores');;
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `Prueba Sectores - Test Hgi360`
    .page(testAdminConfig.pagina);

test('Prueba Sectores Test Hgi360 CRUD - Test Hgi360', async t => {
    await ejecutarPrueba(t, testAdminConfig, ingresarAplicacion);
});

fixture `Prueba Sectores - Hgi360 Admin`
    .page(hgiAdminConfig.pagina);

test('Prueba Sectores CRUD - Hgi360 Admin', async t => {
    await ejecutarPrueba(t, hgiAdminConfig, ingresarAplicacion);
});
