# 🟡 The Simpsons API

## 📖 Descripción del Proyecto

**The Simpsons API** es una aplicación web interactiva que permite explorar el universo de la icónica serie animada **The Simpsons**.  
El sistema ofrece información detallada sobre los **personajes**, **episodios** y **locaciones**, con una interfaz amigable y organizada por pestañas.

La API proporciona acceso estructurado a los datos, incluyendo retratos, frases célebres, episodios de aparición y descripciones completas de cada personaje.

---

## 👥 Integrantes del Equipo

| Rol | Nombre |
|------|--------|
| 🧭 **Project Manager (PM)** | **Luis Emilio García** |
| 💻 **Developer 1** | **Junior Velaustegui** |
| 💻 **Developer 2** | **Alexis Benítez** |

---

## 🚀 Características Principales

- 🧍 **Visualización completa de personajes:** nombre, edad, ocupación, género, estado y frases memorables.  
- 📺 **Listado de episodios:** título, temporada, sinopsis, número de episodio y fecha de emisión.  
- 🏙️ **Locaciones icónicas:** lugares emblemáticos de Springfield y sus descripciones.  
- 🔍 **Búsqueda y filtrado dinámico:** permite encontrar personajes por nombre, género o estado (alive/dead).  
- 📱 **Diseño responsivo:** compatible con dispositivos móviles, tablets y escritorio.  
- ⚡ **Consumo de API REST:** comunicación mediante endpoints estructurados y eficientes.

---

## 🧩 Estructura de la API

### Endpoints principales

| Endpoint | Descripción |
|-----------|-------------|
| `/characters` | Lista paginada de personajes |
| `/characters/:id` | Detalle completo de un personaje |
| `/episodes` | Lista completa de episodios |
| `/episodes/:id` | Detalle de un episodio específico |
| `/locations` | Listado de locaciones en Springfield |

> ⚙️ **Nota:** Las rutas pueden variar según el entorno o configuración del servidor.  
Las imágenes se obtienen a través del prefijo `environment.imageBaseUrl`.

---

## 🛠️ Tecnologías Utilizadas

| Categoría | Tecnologías |
|------------|--------------|
| **Frontend** | Ionic + Angular + TypeScript |
| **Backend / API** | Node.js (Express) |
| **Base de Datos** | MongoDB / JSON mock (según entorno) |
| **Control de Versiones** | Git + GitHub |
| **Diseño y UI** | HTML5, CSS3, Tailwind / SCSS |
| **Testing & DevTools** | Postman, VS Code, Git Bash |

---

## 💾 Instalación y Ejecución

```bash
# 1️⃣ Clonar el repositorio
git clone https://github.com/usuario/TheSimpsonsAPI.git

# 2️⃣ Acceder al directorio
cd TheSimpsonsAPI

# 3️⃣ Instalar dependencias
npm install

# 4️⃣ Ejecutar el proyecto
ionic serve (por defecto en: http://localhost:8100/)