# Sistema de Gestión de Personal

Proyecto completo para el curso SOFT-11 Proyecto integrador 1:

- **back-end/**: API con **NestJS**, **Mongoose** y **MongoDB Atlas**.
- **front-end/**: páginas con **HTML, CSS y JavaScript** (sin frameworks) que consumen la API con `fetch`.

## Estructura

```
gestion-personal/
├── back-end/                       ← API (ver back-end/README.md)
│   ├── src/
│   │   ├── certificaciones/
│   │   ├── proyectos/
│   │   ├── empleados/
│   │   └── estadisticas/       ← resumen para el panel principal
│   ├── pruebas.http
│   └── .env.example
└── front-end/
    ├── css/
    │   └── estilos.css             ← estilos de todas las páginas
    ├── js/
    │   ├── comun.js                ← dirección del API, mensajes, accesibilidad
    │   └── (un archivo .js por página)
    ├── index.html                  ← panel principal (dashboard)
    ├── empleados.html              ← directorio de empleados
    ├── empleado-registrar.html
    ├── asignar-certificacion.html
    ├── asignar-proyecto.html
    ├── certificacion-registrar.html
    ├── certificaciones-por-vencer.html
    ├── certificaciones-instituciones.html
    ├── proyecto-registrar.html
    ├── busqueda.html
    └── listados.html               ← todos los empleados, certificaciones y proyectos
```

## Cómo ejecutarlo

### 1. Back-end

```bash
cd back-end
npm i
npm run start:dev
```

Resultado esperado: `Servidor corriendo en http://localhost:3000`

### 2. Front-end

1. Abrir la carpeta **front-end** en VS Code.
2. Clic derecho sobre `index.html` → **Open with Live Server**.
3. Se abre en `http://127.0.0.1:5500/index.html`.

El back-end tiene `app.enableCors()`. Esa línea permite que la página (puerto 5500)
consulte la API (puerto 3000).

Si el back-end usa otro puerto, solo se cambia la constante `API_URL` en `front-end/js/comun.js`.

### 3. Datos de ejemplo

Para tener datos en las pantallas, ejecute las peticiones de `back-end/pruebas.http`
(extensión **REST Client** de VS Code) en este orden: certificaciones → proyectos →
empleados → asignaciones. También puede registrarlos desde las pantallas.

## Pantallas y endpoints

| Pantalla | Qué hace | Endpoints |
|---|---|---|
| `index.html` | Panel principal: totales, proyectos por estado, tecnologías y certificaciones más usadas, últimos empleados | `GET /estadisticas/resumen?dias=30` |
| `empleados.html` | Directorio por páginas, búsqueda, ver detalle y eliminar | `GET /empleados/listado`, `DELETE /empleados/:id` |
| `empleado-registrar.html` | Registrar un empleado con su dirección | `POST /empleados` |
| `asignar-certificacion.html` | Asignar una certificación a un empleado | `GET /empleados/opciones`, `GET /certificaciones/opciones`, `PATCH /empleados/:correo/certificaciones` |
| `asignar-proyecto.html` | Asignar un proyecto a un empleado | `GET /empleados/opciones`, `GET /proyectos/opciones`, `PATCH /empleados/:correo/proyectos` |
| `certificacion-registrar.html` | Registrar una certificación con su vigencia | `POST /certificaciones` |
| `certificaciones-por-vencer.html` | Certificaciones que vencen en N días | `GET /certificaciones/por-vencer?dias=` |
| `certificaciones-instituciones.html` | Instituciones con más certificaciones | `GET /certificaciones/top-instituciones/:top` |
| `proyecto-registrar.html` | Registrar un proyecto y ver las tecnologías ya registradas | `POST /proyectos`, `GET /proyectos/tecnologias` |
| `busqueda.html` | Empleados por tecnologías, por certificaciones o por ambas | `GET /proyectos/tecnologias`, `GET /certificaciones/opciones`, `GET /empleados/busqueda` |
| `listados.html` | Tablas con todos los empleados, certificaciones y proyectos (pestañas) | `GET /empleados`, `GET /certificaciones`, `GET /proyectos` |

## Cómo está hecho el JavaScript de cada página

Todas las páginas siguen la misma lógica:

1. **Seleccionar los elementos** con `document.getElementById()`, `document.querySelector()`
   o `document.querySelectorAll()`.
2. **Cargar los datos** del servidor con `fetch` (por ejemplo, para llenar un `<select>`).
3. **Validar** el formulario: los campos con error reciben la clase `invalido`
   (borde rojo y mensaje) y el atributo `aria-invalid`.
4. **Enviar** con `fetch` (`POST` o `PATCH`) y el objeto convertido con `JSON.stringify`.
5. **Mostrar el resultado** con SweetAlert2 (no se usa `alert()`). Si el servidor responde
   con error (400, 404, 409), se muestra el mensaje que envía Nest.

## Accesibilidad

- Botones para cambiar el tamaño de letra (- A +) y para el modo oscuro. La preferencia
  se guarda en `localStorage`.
- Enlace "Saltar al contenido", visible al presionar Tab.
- Etiquetas `<label>` en todos los campos y mensajes de error asociados con `aria-describedby`.
- Contorno visible al navegar con el teclado.
- Diseño adaptable al celular.
