# 💳 CreditSmart - Sistema de Gestión de Créditos

**Desarrollado por:** Hernando Angel Perez Fernandez

## 📋 Descripción del Proyecto

CreditSmart es una aplicación web interactiva para la simulación y solicitud de créditos financieros. Usa Firebase/Firestore como backend (BaaS) para almacenar productos y solicitudes de forma persistente y multiusuario.

La aplicación ofrece una experiencia de usuario completa con filtrado dinámico, búsqueda en tiempo real, simulación de pagos y un formulario de solicitud con validaciones exhaustivas. Incluye un panel de administración para CRUD de productos y gestión de solicitudes.

## 🚀 Características Principales

- ✅ **Catálogo de Productos**: Visualización de 5 tipos de créditos (Libre Inversión, Vehículo, Vivienda, Educativo, Empresarial)
- 🔍 **Búsqueda y Filtros**: Búsqueda por nombre, filtros por rango de monto y tasa de interés en tiempo real
- 📊 **Simulador Interactivo**: Sliders para ajustar monto y plazo con cálculo automático de cuotas
- 📝 **Formulario Completo**: Solicitud de crédito con validaciones en tiempo real
- ✨ **Resumen Pre-envío**: Vista previa de la solicitud antes de confirmar
- 💾 **Persistencia en Firestore**: Productos y solicitudes se almacenan en la base de datos NoSQL de Firebase
- ✅ **Mensaje de Éxito**: Confirmación visual con animación y redirección automática
- 📱 **Diseño Responsive**: Totalmente adaptable a dispositivos móviles y tablets

## 🛠️ Tecnologías Utilizadas

### Core
- **React 19.2.0** - Biblioteca principal para la interfaz de usuario
- **React Router DOM 7.1.1** - Navegación y enrutamiento SPA
- **Firebase / Firestore** - Backend BaaS y base de datos NoSQL
- **Vite 7.2.4** - Build tool y servidor de desarrollo

### Desarrollo
- **ESLint 9.39.1** - Linter para calidad de código
- **@vitejs/plugin-react 5.1.1** - Plugin de React para Vite
- **JavaScript ES6+** - Lenguaje de programación

### Características de React Utilizadas
- Hooks: `useState`, `useEffect`, `useParams`, `useNavigate`, `useLocation`
- Componentes funcionales
- Props y destructuring
- Renderizado condicional
- Manejo de eventos
- Métodos de array: `.map()`, `.filter()`, `.sort()`, `.find()`

## 📦 Instalación

### Prerrequisitos
- Node.js (versión 16 o superior)
- npm (viene con Node.js)

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone <url-del-repositorio>
cd CreditSmart
```

2. **Configurar variables de entorno (Firebase)**
  - Copia `.env.example` a `.env.local` y completa con tus credenciales de Firebase (nunca las subas al repo).

3. **Instalar dependencias**
```bash
npm install
```

4. **Iniciar el servidor de desarrollo**
```bash
npm run dev
```

5. **Abrir en el navegador**
```
http://localhost:5173
```

## 📝 Scripts Disponibles

```bash
# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build

# Previsualizar build de producción
npm run preview

# Ejecutar linter
npm run lint
```

## 📂 Estructura del Proyecto

```
CreditSmart/
├── public/                 # Archivos estáticos
├── src/
│   ├── components/        # Componentes reutilizables
│   │   ├── navbar.jsx     # Barra de navegación
│   │   └── creditCard.jsx # Tarjeta de producto
│   ├── services/
│   │   └── firestore.js   # Helpers CRUD para productos y solicitudes
│   ├── pages/             # Páginas principales
│   │   ├── Home.jsx       # Página de inicio
│   │   ├── Simulador.jsx  # Búsqueda y filtros
│   │   ├── Simular.jsx    # Simulación detallada
│   │   ├── Solicitar.jsx  # Formulario de solicitud
│   │   └── Admin.jsx      # Panel para CRUD de productos/solicitudes
│   ├── App.jsx            # Componente raíz con rutas
│   ├── App.css            # Estilos globales
│   ├── main.jsx           # Punto de entrada
│   └── index.css          # Estilos base
├── package.json           # Dependencias y scripts
├── vite.config.js         # Configuración de Vite
├── eslint.config.js       # Configuración de ESLint
└── README.md              # Este archivo
```

## 🎯 Funcionalidades por Página

### 🏠 Home
- Muestra todos los productos de crédito disponibles
- Usa `.map()` para renderizar las tarjetas
- Componente `CreditCard` reutilizable con props
- Links a simulación para cada producto

### 🔍 Simulador
- Búsqueda en tiempo real por nombre
- Filtro por rango de monto (Bajo, Medio, Alto)
- Filtro por tasa de interés (Baja, Media, Alta)
- Ordenamiento automático por tasa (menor a mayor)
- Mensaje "No hay créditos disponibles" cuando no hay resultados
- Usa `useState`, `filter()` y `sort()`

### 📊 Simular
- Sliders interactivos para monto y plazo
- Cálculo automático de:
  - Tasa efectiva mensual
  - Cuota mensual aproximada
  - Total a pagar
  - Intereses totales
- Botón para solicitar el crédito con datos pre-llenados

### 📝 Solicitar
- Formulario con 7 campos (nombre, email, teléfono, cédula, tipo, monto, plazo)
- Validaciones en tiempo real:
  - Nombre: mínimo 3 caracteres
  - Email: formato válido
  - Teléfono: 10 dígitos
  - Cédula: 6-10 dígitos
  - Monto: mínimo $500.000
  - Plazo: 1-240 meses
- Cálculo automático de cuota al cambiar monto/plazo
- Resumen completo antes de enviar
- Almacenamiento en array (memoria)
- Mensaje de éxito animado
- Limpieza automática del formulario
- Redirección después de 3 segundos

## 🎨 Diseño y Estilos

- **Paleta de colores**: Gradientes morados y azules (#667eea, #764ba2)
- **Tipografía**: Segoe UI
- **Efectos**: Hover, transforms, shadows, animaciones
- **Layout**: CSS Grid y Flexbox
- **Responsive**: Media queries para móviles

## 📸 Capturas de Pantalla

### Página de Inicio
![Página de Inicio - Catálogo completo de productos crediticios](./src/assets/Captura%20de%20pantalla/inicio.png)

*Muestra el hero section con bienvenida y el catálogo completo de 5 productos crediticios con diseño de tarjetas elegantes.*

### Simulador con Filtros
![Simulador - Búsqueda y filtros en tiempo real](./src/assets/Captura%20de%20pantalla/simulador.png)

*Vista del simulador con búsqueda por nombre, filtros por rango de monto y tasa de interés. Permite ordenar y filtrar productos dinámicamente.*

### Formulario de Solicitud
![Formulario de Solicitud - Validaciones en tiempo real](./src/assets/Captura%20de%20pantalla/solicitar.png)

*Formulario completo con 7 campos, validaciones en tiempo real, cálculo automático de cuota mensual y resumen antes de enviar.*

## 🧪 Conceptos Implementados

1. **Componentes Funcionales**: Sintaxis moderna en todo el proyecto
2. **Hooks React**: `useState`, `useEffect`, `useMemo`, `useParams`, `useNavigate`, `useLocation`
3. **Routing**: SPA con rutas públicas y ruta de administración
4. **Parámetros dinámicos**: URLs como `/simular/:id`
5. **Renderizado condicional**: Estados de carga, vacíos y errores
6. **Métodos de array**: map, filter, sort, find
7. **Formularios controlados y validaciones**: Inputs sincronizados y reglas básicas
8. **Integración Firestore**: CRUD de productos y solicitudes a través de `services/firestore.js`
9. **Persistencia y multiusuario**: Datos compartidos entre usuarios al estar en Firestore
10. **Buenas prácticas de secretos**: Configuración Firebase en `.env.local` (no se versiona)

## ⚠️ Notas sobre Firebase

- No subas credenciales al repositorio. Usa `.env.local` (ya ignorado en `.gitignore`).
- Firestore tiene límites gratuitos aproximados: 50K lecturas/día y 20K escrituras/día.
- Si habilitas Analytics, se ejecuta sólo en navegador y si el entorno lo soporta.

## 👨‍💻 Autor

**Hernando Angel Perez Fernandez**

---

## 📄 Licencia

Este proyecto fue desarrollado con fines educativos.

---

## 🤝 Contribuciones

Este es un proyecto académico. Las sugerencias y mejoras son bienvenidas.