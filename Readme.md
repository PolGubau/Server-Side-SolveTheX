# SolveTheX Server-Side 

Backend and Api part of a complete challenge from [SolveTheX](https://solvethex.com/) 

## Getting Started

Si quieres correr el proyecto en tu maquina local, sigue los siguientes pasos.
1. Descarga el proyecto
2. Instala las dependencias con `npm install`
3. Corre el proyecto con `npm run dev`



### Prerequisites

Tener instalado algún manejador de paquetes de node, como npm o yarn.

### Instalación

```
$ npm i
$ npm run dev
```

## Uso

El proyecto se basa en un archivo `index.ts` que continene los endpoints de la api. en formato TypeScript.

### Construcción del archivo index.ts
1. Se reclaman los modulos necesarios, así como la configuración de CORS, el paquete de jwt, y el servidor de express.

2. Se ejecutan las configuraciones de CORS y el servidor de express.

3. Se crea una base de datos siempre que no exista llamado y te conecta a ella.

4. Endpoint de auth, que recibe un usuario y devuelve un token de acceso.

5. function que verifica el token de acceso, será llamada en cada endpoint que requiera autenticación.

6. Endpoint de devulta de todos los registros, requiere autenticación.

7. Endpoint de devuelta de un solo registro, requiere un ID cogido de la url, requiere autenticación.

8. endpoint de creación de un registro, requiere un json con el name y stock y un token de autenticación.

9. Endpoint de actualización de un registro, requiere un json con el name y stock y un token de autenticación.

10. Endpoint de eliminación de un registro, requiere un ID cogido de la url y un token de autenticación.

11. Se menciona el puerto adjudicado al servidor y se muestra por consola.

### Uso de typechecker.ts
El archivo typechecker.ts es un archivo que contiene funciones que verifican el tipo de dato de una variable.
Es llamado desde el archivo index.ts para verificar el tipo de dato de las variables que se reciben en los endpoints.


## Construido por Pol Gubau Amores a septiembre 2022 para completar un reto de SolveTheX