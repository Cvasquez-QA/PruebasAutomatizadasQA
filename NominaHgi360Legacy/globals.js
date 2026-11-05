export const configuracionAplicacion = Object.freeze({
    pagina: 'https://test.happgi.com',
    modulo: 'Nomina',
    empresa: '8902',
    usuario: 'h20',
    clave: '1'
});

export const empleadoPrueba = Object.freeze({
    idEmpleado: '000001',
    nombEmpleado: 'Camilo',
    apellido1Empleado: 'Prueba1',
    apellido2Empleado: 'QA',
    nombreEmpleado: 'Prueba1 QA Camilo',
    codTurno: '101'
});

Object.assign(global, configuracionAplicacion, empleadoPrueba);