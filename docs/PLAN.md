# Plan: CMS propio con templates para sitios de clientes

> Objetivo: ofrecer sitios web lindos, rápidos y fáciles de editar, que se armen en horas y no den los problemas de WordPress (plugins, actualizaciones, hackeos, lentitud).

---

## 1. Decisiones de base

| Tema | Decisión | Por qué |
|---|---|---|
| Framework | **Astro 7**, sitio 100% estático | Rapidísimo, sin base de datos ni servidor: no hay nada que hackear ni actualizar. Es la versión que usan los temas que bajamos. |
| Estilos | **Tailwind CSS 4** + variables de diseño (tokens) | Casi todos los temas de inspiración usan Tailwind, así copiamos y adaptamos secciones fácil. Los tokens permiten cambiar colores y fuentes por cliente sin tocar código. |
| Panel para clientes | **Pages CMS** (versión hosteada en app.pagescms.org) | Invitás al cliente **por email, sin que necesite cuenta de GitHub**. Edita textos e imágenes en un panel simple. No requiere servidor: el sitio sigue siendo estático. Tiene campo "Block" para armar páginas por bloques. Es open source: si algún día cambia, se puede autohostear. |
| Código | **GitHub**: un repo plantilla + un repo por cliente | Cada cliente queda aislado. Nuevo cliente = "Use this template" en GitHub. |
| Hosting | **Cloudflare** (Pages/Workers) conectado a GitHub | Gratis para sitios chicos, HTTPS y CDN incluidos. Cada cambio del cliente se publica solo en 1–2 minutos. |
| Formularios | **Web3Forms** o **Formspree** (plan gratis) | Los mensajes de contacto llegan al email del cliente sin servidor propio. |
| Analítica | **Cloudflare Web Analytics** | Gratis, sin cookies, sin banner molesto. |

**Costo fijo para vos: $0.** Lo único que paga cada cliente es su dominio (~USD 10–15/año), y vos cobrás diseño + mantenimiento.

---

## 2. Cómo funciona (flujo completo)

```
Vos (repo plantilla en GitHub)
   │  "Use this template"
   ▼
Repo del cliente ──► Cloudflare compila y publica ──► www.cliente.com
   ▲
   │  guarda cambios (commit automático)
Pages CMS ◄── el cliente entra con su email y edita textos/fotos
```

El cliente **solo edita contenido** (textos, fotos, servicios, precios, horarios). El diseño lo controlás vos, así no puede "romper" el sitio.

---

## 3. Arquitectura del repo plantilla

```
sitio-base/
├── .pages.yml              ← configuración del panel (qué puede editar el cliente)
├── astro.config.mjs
├── src/
│   ├── content/
│   │   ├── sitio.yaml      ← nombre, logo, tema elegido, color, contacto, redes, WhatsApp
│   │   └── paginas/        ← una página = lista de bloques (inicio.yaml, servicios.yaml…)
│   ├── temas/              ← un archivo de tokens por tema (colores, fuentes, bordes, sombras)
│   ├── bloques/            ← componentes Astro: Hero, Servicios, Testimonios… con variantes
│   ├── layouts/
│   └── pages/[...slug].astro  ← arma cada página leyendo sus bloques
└── public/images/          ← fotos que sube el cliente
```

**Tema = tokens + variantes de bloque.** Ejemplo: el tema "Sabor" usa fuente serif, colores cálidos y el Hero con foto de fondo; el tema "Startup" usa sans-serif, fondo oscuro y Hero centrado. Los bloques son los mismos y solo cambia el estilo, así que cualquier contenido funciona con cualquier tema.

---

## 4. Biblioteca de bloques (v1)

| Bloque | Variantes | Rubros |
|---|---|---|
| Header / menú | simple, con botón destacado | todos |
| Hero (portada) | centrado, dividido con imagen, foto de fondo | todos |
| Servicios / características | grilla de tarjetas, lista con íconos | todos |
| Sobre nosotros | imagen + texto, con estadísticas | todos |
| Números / logros | 3–4 cifras grandes | profesionales, empresas |
| Testimonios | tarjetas, carrusel simple | todos |
| Logos de clientes | fila de logos | empresas |
| Equipo | tarjetas con foto | profesionales |
| Precios / planes | 2–4 columnas | empresas, servicios |
| Carta / menú | por categorías con precios | gastronomía |
| Galería | grilla de fotos | gastronomía, comercios |
| Preguntas frecuentes | acordeón | todos |
| Llamado a la acción | banda con botón | todos |
| Contacto | formulario + mapa + horarios | todos |
| Footer | simple, con columnas | todos |
| Botón WhatsApp flotante | — | todos (clave en Argentina) |

### Colecciones (contenido que se repite)
Además de los bloques, algunos rubros necesitan **listas de cosas** que el cliente carga una por una desde el panel:

| Colección | Qué carga el cliente | Genera en el sitio |
|---|---|---|
| Propiedades | fotos, precio, venta/alquiler, ambientes, m², barrio, ubicación | listado con filtros + ficha de cada propiedad + "consultar por WhatsApp" |
| Productos / carta | foto, nombre, precio, categoría, disponible sí/no | catálogo por categorías + "pedir por WhatsApp" |
| Servicios | nombre, descripción, precio opcional | página por servicio (sirve para SEO) |
| Equipo | foto, nombre, cargo | sección de equipo |
| Novedades / blog | título, foto, texto | listado + artículo |

---

## 4b. Cómo se "duplica": núcleo + kits por rubro

**Un solo sistema (núcleo)** con todos los bloques, colecciones y temas. Encima, **kits por rubro** que son combinaciones listas para usar:

```
                ┌── Kit Inmobiliaria: tema Profesional + colección Propiedades + páginas (Inicio, Propiedades, Tasaciones, Contacto)
NÚCLEO ─────────┼── Kit Panadería:    tema Sabor + colección Productos + páginas (Inicio, Productos, Pedidos, Local)
(bloques +      ├── Kit Estudio prof.: tema Profesional + Servicios + Equipo + turnos
 colecciones +  ├── Kit Restaurante:  tema Sabor + Carta + galería + reservas
 temas)         └── Kit Startup:      tema Startup + precios + FAQ
```

- Cada kit trae **contenido de ejemplo realista** (textos y estructura). Al cliente nuevo solo se le reemplazan los datos.
- Cliente nuevo = copiar la plantilla → elegir kit → elegir tema y color → cargar sus datos → publicar.
- Si un cliente necesita algo distinto (por ejemplo, una panadería con sección de "tortas por encargo"), se combina con bloques existentes. Si es algo nuevo de verdad, se agrega al núcleo y queda disponible para todos los clientes futuros.
- **Las mejoras del núcleo se pueden pasar a los sitios ya vendidos** (mantenimiento = ingreso recurrente).

---

## 5. Temas v1 (5) e inspiración

| Tema | Para quién | Estilo | Inspiración (biblioteca) |
|---|---|---|---|
| **Profesional** | abogados, contadores, consultoras | sobrio, confiable, azul/gris, serif en títulos | astroplate, accessible-astro-starter |
| **Bienestar** | consultorios, psicólogos, coaches, estética | suave, redondeado, tonos verdes/pastel | astrowind, astro-sphere |
| **Startup** | SaaS, productos, pymes tech | moderno, oscuro o claro, degradados | foxi, screwfast, astrowind, blackspike-landing |
| **Sabor** | restaurantes, cafés, panaderías | cálido, fotos grandes, serif, carta | odyssey (estructura) + diseño propio |
| **Barrio** | comercios locales, oficios, talleres | contraste alto, botones grandes, WhatsApp | brutal (versión suavizada), moon-landing |

### Licencias de la biblioteca (importante para revender)
- **MIT**: podés copiar y adaptar código. Hay que conservar el aviso de copyright dentro del código (no se ve en el sitio).
- **GPL-3.0** (astroship, dante, blog-template): **solo como inspiración visual**. No copiar código.
- **CC BY 4.0** (blackspike-landing): se puede usar, pero exige dar crédito al autor.

Regla práctica: **los bloques los escribimos nosotros**, mirando los temas como referencia. Así el sistema es 100% tuyo y no hay sorpresas legales.

---

## 6. Fases

### Fase 0 — Preparación (1 sesión, guiada paso a paso)
- [ ] Crear cuenta de GitHub (o una organización para tu agencia)
- [ ] Crear cuenta de Cloudflare
- [ ] Instalar Node.js 22+, VS Code y GitHub Desktop
- [ ] Elegir carpeta de trabajo en tu PC (disco D o E)

### Fase 1 — Primer sitio funcionando
- [ ] Repo plantilla con 1 tema (Profesional) y 8 bloques básicos
- [ ] Contenido de ejemplo
- [ ] Subir a GitHub y publicar en Cloudflare (URL de demo)
- [ ] Conectar Pages CMS y probar invitar un email como "cliente"
- **Resultado:** un sitio real editable desde el panel.

### Fase 2 — Biblioteca completa
- [ ] Los 16 bloques con sus variantes
- [ ] Colecciones: Propiedades, Productos/carta, Servicios, Equipo, Novedades
- [ ] Los 5 temas
- [ ] Primeros 2 kits completos: **Inmobiliaria** y **Panadería** (con demo publicada de cada uno para mostrar a clientes)
- [ ] Selector de tema y color principal desde el panel
- [ ] **Vitrina de temas**: una página demo para mostrarle a los clientes ("elegí tu estilo")

### Fase 3 — Proceso por cliente (objetivo: sitio listo en 2–4 horas)
- [ ] Checklist de alta: crear repo desde la plantilla, elegir tema, cargar contenido, conectar Cloudflare, dominio, invitar al cliente
- [ ] Formulario de onboarding para el cliente (logo, colores, textos, fotos, WhatsApp, horarios)
- [ ] SEO básico automático (títulos, descripción, imagen para redes, sitemap)
- [ ] Guía de 1 página para el cliente: "cómo editar tu sitio"

### Fase 4 — Lado comercial
- [ ] Paquetes (ej.: Landing / Sitio básico / Sitio + mantenimiento)
- [ ] Precio de mantenimiento mensual
- [ ] Tu propio sitio de agencia, hecho con el mismo sistema

### Fase 5 — Más adelante (si el volumen lo justifica)
- Script que crea el repo y el deploy de un cliente nuevo en un paso
- Más temas por rubro
- Panel único para todos tus clientes

---

## 7. Riesgos y cómo los cubrimos

| Riesgo | Cobertura |
|---|---|
| Pages CMS hosteado cambia condiciones | Es open source: se autohostea. El contenido está en archivos del repo, así que se puede migrar a otro CMS sin perder nada. |
| Límites del plan gratis de Cloudflare | Sobran para sitios chicos. Si un cliente crece, se pasa a plan pago o se cobra aparte. |
| El cliente rompe el diseño | El panel solo expone campos de contenido. Además, Git guarda todo el historial, así que se puede volver atrás en un clic. |
| Poca experiencia técnica | Todo guiado. La parte técnica se hace una vez en la plantilla, y después cada cliente es repetir un checklist. |
