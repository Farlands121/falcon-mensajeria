# 🦅 Falcon Mensajería Femenina — Tablero de Pedidos

> Proyecto parcial — Desarrollo de Aplicaciones Empresariales  
> Unidades Tecnológicas de Santander (UTS)

---

## 📋 Entregable 1 — Análisis del referente

### Referente elegido: **Trello** — [https://trello.com](https://trello.com)

### Stack tecnológico verificado
Usando la extensión **Wappalyzer** se verifica que Trello está construido con:
- **Framework principal:** React
- **Bundler:** Webpack
- **Backend:** Java (Spring Boot)
- **Base de datos:** PostgreSQL (inferido por la arquitectura Atlassian)

### Descripción de la interfaz

Trello es una herramienta de gestión de tareas basada en el modelo Kanban. Su interfaz se organiza en **tableros**, que contienen **listas** (columnas), y cada lista contiene **tarjetas** (cards). El usuario puede arrastrar cualquier tarjeta de una lista a otra sin recargar la página.

### Patrón interactivo: ¿cómo funciona el drag & drop?

**¿Qué pasa con el estado?**

Trello mantiene en memoria (estado de React) un objeto que representa el tablero completo: listas y tarjetas con su posición actual. Cuando el usuario comienza a arrastrar una tarjeta, React marca esa tarjeta como "en arrastre" y le aplica un estilo visual distinto (opacidad reducida, sombra elevada). Mientras la tarjeta se mueve, Trello escucha los eventos `dragover` sobre cada lista y resalta visualmente la lista objetivo con una línea de inserción animada.

**¿Qué se actualiza?**

Al soltar la tarjeta (`drop`), React actualiza inmediatamente el estado local: la tarjeta se elimina del array de su lista de origen y se inserta en el array de la lista de destino, en la posición donde se soltó (reordenamiento preciso). Gracias a que React re-renderiza solo los componentes que cambiaron, **ninguna parte de la página se recarga**. El contador de tarjetas en el encabezado de cada lista también se actualiza al instante.

**¿Qué no se recarga?**

Absolutamente nada. Trello usa **UI optimista**: muestra el cambio de inmediato en el cliente y en segundo plano envía una petición a su API REST para persistir el nuevo orden. Si la petición falla, hace rollback en el estado local. El usuario percibe velocidad instantánea.

**Sincronización múltiple:** El movimiento de una tarjeta actualiza simultáneamente (a) la posición visual de la tarjeta, (b) el contador de la lista de origen, y (c) el contador de la lista de destino. Tres puntos del DOM cambian por una sola acción.

**Implementación técnica (React):**
- `onDragStart`: registra el `id` de la tarjeta en un ref/estado.
- `onDragOver`: previene el comportamiento default del navegador (`e.preventDefault()`), actualiza estado de columna resaltada.
- `onDrop`: lee el `id` del arrastre, crea un nuevo array de listas con la tarjeta reubicada, llama `setBoard(newState)`.
- `onDragEnd`: limpia el estado de arrastre en caso de que el usuario suelte fuera de una zona válida.

**Por qué es un buen referente:** Trello demuestra que el drag & drop no es decorativo — es el núcleo del modelo mental del producto. El estado es la única fuente de verdad, y la UI es un espejo fiel de ese estado en todo momento.

---

## 🚀 Proyecto: Tablero de Pedidos de Falcon Mensajería

### Contexto y usuario real
**Negocio:** Falcon Mensajería Femenina — servicio de mensajería operado por mujeres en Bucaramanga, Floridablanca, Piedecuesta y Girón (Santander, Colombia).

**Usuario:** El equipo operativo de Falcon (gerente y administradora) necesita visualizar y gestionar el estado de todos los pedidos del día en tiempo real, actualizando el estado de cada entrega conforme las mensajeras avanzan en su ruta.

**Problema que resuelve:** Sin un tablero visual, el equipo debía actualizar listas manuales en papel o WhatsApp. Esta interfaz centraliza el estado de todos los pedidos del día y permite moverlos entre etapas con un arrastre.

---

## 🧩 Componente interactivo: Kanban drag & drop (Nivel 3)

### Descripción
Tablero Kanban con tres columnas: **Recibido → En Ruta → Entregado**. Cada pedido es una tarjeta que se puede arrastrar entre columnas.

### Nivel alcanzado: **Nivel 3 — Sobresaliente**
Se implementaron las características adicionales del nivel 3:

1. **Sincronización en varios puntos:** Mover una tarjeta actualiza simultáneamente:
   - La posición visual de la tarjeta (columna de destino)
   - El contador numérico de la columna de origen (header de columna)
   - El contador numérico de la columna de destino (header de columna)
   - Los 3 contadores del `navbar` (visibles en todo momento)
   - La barra de resumen estadístico (pedidos en ruta, entregados, pendientes)
   - Una notificación toast que confirma el cambio

2. **Persistencia del estado:** Las tarjetas permanecen donde se soltaron mientras dura la sesión (estado en `useState` de React).

### ¿Cómo funciona el estado?

```jsx
// Estado central — única fuente de verdad
const [orders, setOrders] = useState(INITIAL_ORDERS);

// Al soltar una tarjeta
function handleDrop(e, colId) {
  e.preventDefault();
  setOrders(prev =>
    prev.map(o => o.id === dragId ? { ...o, status: colId } : o)
  );
}
```

`orders` es un array de objetos. Cada objeto tiene un campo `status` que indica en qué columna vive. Al hacer drop, se crea un nuevo array con el objeto actualizado (inmutabilidad de React). React re-renderiza solo los componentes afectados.

Los contadores del navbar se derivan del mismo estado:
```jsx
const counts = COLUMNS.reduce((acc, col) => {
  acc[col.id] = orders.filter(o => o.status === col.id).length;
  return acc;
}, {});
```

Un solo `setOrders` dispara la actualización de todos los contadores en el mismo render.

---

## 🛠️ Stack tecnológico

| Tecnología | Rol |
|------------|-----|
| **React 18** | Framework principal (hooks: `useState`, `useRef`) |
| **Vite** | Bundler y servidor de desarrollo |
| **HTML Drag & Drop API** | Implementación nativa del arrastre (sin librerías externas) |
| **CSS-in-JS inline** | Estilos directamente en JSX para portabilidad |

Se eligió React por:
- Manejo de estado con hooks (`useState`) — ideal para reflejar cambios en tiempo real
- Re-renderizado selectivo eficiente
- Es el framework más empleado en la industria (referente Trello lo usa)
- Facilidad para la sustentación en video al tener toda la lógica en un solo archivo

---

## 📁 Estructura del proyecto

```
falcon-mensajeria/
├── index.html          # Punto de entrada HTML
├── package.json        # Dependencias y scripts
├── vite.config.js      # Configuración de Vite
├── README.md           # Este archivo (Entregable 1)
└── src/
    ├── index.jsx       # Punto de entrada React
    ├── index.css       # Reset CSS global
    └── App.jsx         # Componente principal (tablero Kanban)
```

---

## ⚙️ Instalación y ejecución local

```bash
# 1. Clonar el repositorio
git clone https://github.com/TU_USUARIO/falcon-mensajeria.git
cd falcon-mensajeria

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm run dev
# → http://localhost:5173

# 4. Construir para producción
npm run build
```

---

## 🌐 Despliegue

La aplicación está desplegada en: **[URL de Vercel/Netlify aquí]**

### Desplegar en Vercel (recomendado)
1. Ir a [vercel.com](https://vercel.com) e iniciar sesión con GitHub
2. Importar el repositorio `falcon-mensajeria`
3. Framework preset: **Vite**
4. Click en **Deploy** — Vercel detecta Vite automáticamente

### Desplegar en Netlify
1. Ir a [netlify.com](https://netlify.com)
2. "New site from Git" → conectar repositorio
3. Build command: `npm run build`
4. Publish directory: `dist`

---

## 🎨 Decisiones de diseño

**Paleta de colores:** Se tomó directamente del branding de Falcon Mensajería:
- `#E8176F` — Rosa fucsia (color principal de la marca)
- `#A8D832` — Verde lima (color secundario de la marca)
- `#8B0A4A` — Magenta oscuro (acento y estados)
- `#1A1A1A` — Negro carbón (texto y contraste)

**Tipografía:** Segoe UI (sans-serif system font) — legible, rápida de cargar, coherente con un producto operativo.

**Decisión de riesgo:** Se mantuvo la identidad visual fuerte (rosa + lima) en lugar de neutralizarla, ya que Falcon tiene una marca muy definida y reconocible. El tablero operativo debe sentirse parte de esa identidad.

---

## 👥 Autores

- **Juan [Apellido]** — UTS, Ingeniería de Sistemas
- **Camilo Andrés Rojas Perales** — UTS, Ingeniería de Sistemas

Parcial — Desarrollo de Aplicaciones Empresariales  
Unidades Tecnológicas de Santander · 2025
