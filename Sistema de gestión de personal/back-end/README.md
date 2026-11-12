# Back-end: sistema de gestión de personal

API construida con **NestJS** y **MongoDB Atlas** para el curso SOFT-11 Proyecto integrador 1.

## Requisitos

- Node.js 20 o superior (`node -v`)
- Una cuenta y un clúster en MongoDB Atlas

## Cómo ejecutarlo

```bash
# 1. Instalar las dependencias (crea la carpeta node_modules)
npm install

# 2. Crear el archivo .env a partir del ejemplo y completar usuario y contraseña de Atlas
#    Windows (PowerShell):  copy .env.example .env
#    macOS / Linux:         cp .env.example .env

# 3. Levantar el servidor en modo desarrollo (se reinicia al guardar)
npm run start:dev
```

Resultado esperado en la terminal: `Servidor corriendo en http://localhost:3000`.

Si no conecta con Atlas, revise el usuario y la contraseña del `.env` y, en Atlas,
**Network Access → Add IP Address → Allow Access from Anywhere**.

## Estructura

```
back-end/
├── src/
│   ├── main.ts                    ← inicia el servidor
│   ├── app.module.ts              ← configuración y módulos
│   ├── common/utilidades.ts       ← funciones compartidas
│   ├── certificaciones/           ← schemas/, dto/, controller, service, module
│   ├── proyectos/
│   ├── empleados/
│   └── estadisticas/              ← módulo sin esquema: consulta las otras colecciones
├── pruebas.http                   ← peticiones de prueba
├── .env.example                   ← plantilla de variables de entorno
├── package.json
└── tsconfig.json
```

## Endpoints

| Requerimiento | Método y ruta | Pantalla del front-end |
|---|---|---|
| Registrar certificación | `POST /certificaciones` | certificacion-registrar.html |
| Certificaciones para un select | `GET /certificaciones/opciones` | asignar-certificacion.html, busqueda.html |
| Primeras N certificaciones | `GET /certificaciones/primeras/:cantidad` | (solo API) |
| Instituciones con más certificaciones | `GET /certificaciones/top-instituciones/:top` | certificaciones-instituciones.html |
| Certificaciones por vencer | `GET /certificaciones/por-vencer?dias=30` | certificaciones-por-vencer.html |
| Registrar proyecto | `POST /proyectos` | proyecto-registrar.html |
| Proyectos para un select | `GET /proyectos/opciones` | asignar-proyecto.html |
| Tecnologías registradas | `GET /proyectos/tecnologias` | proyecto-registrar.html, busqueda.html |
| Registrar empleado | `POST /empleados` | empleado-registrar.html |
| Directorio por páginas con búsqueda | `GET /empleados/listado?pagina=1&limite=10&buscar=ana` | empleados.html |
| Empleados para un select | `GET /empleados/opciones` | asignar-certificacion.html, asignar-proyecto.html |
| Asignar certificación | `PATCH /empleados/:correo/certificaciones` | asignar-certificacion.html |
| Asignar proyecto | `PATCH /empleados/:correo/proyectos` | asignar-proyecto.html |
| Buscar por tecnologías, por certificaciones o por ambas | `GET /empleados/busqueda?tecnologias=react,node.js&certificaciones=scrum master` (al menos uno de los dos) | busqueda.html |
| Todos los empleados | `GET /empleados` | listados.html |
| Todas las certificaciones | `GET /certificaciones` | listados.html |
| Todos los proyectos | `GET /proyectos` | listados.html |
| Eliminar empleado | `DELETE /empleados/:id` | empleados.html |
| Resumen general (totales, agrupaciones, últimos registros) | `GET /estadisticas/resumen?dias=30` | index.html |

Los listados completos (`GET /empleados`, `/certificaciones`, `/proyectos`) no responden a
un requerimiento: se agregaron para revisar los datos. Con muchos registros conviene usar
consultas filtradas o por páginas.

Las rutas `opciones` devuelven solo los campos necesarios para llenar un `<select>`
(por ejemplo, nombre y correo), no el documento completo. El directorio devuelve
**una página** de empleados, no todos.

El archivo `pruebas.http` tiene todas las peticiones, incluidos los casos de error.
Se ejecutan con la extensión **REST Client** de VS Code o se copian a Thunder Client o Postman.

Ningún módulo usa los 5 métodos genéricos (CRUD) que puede generar el CLI:
cada módulo tiene solo los métodos que piden los requerimientos.

## Generar un módulo nuevo

```bash
nest g resource departamentos --no-spec
# Transport layer: REST API
# Generate CRUD entry points: n   ← solo se crean los métodos que piden los requerimientos
```
