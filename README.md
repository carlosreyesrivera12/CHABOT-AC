# 🤖 ChatBot IA Multiidioma — Guía de instalación

Un chatbot con IA que responde preguntas desde un Excel, en cualquier idioma, con diseño pastel.

---

## 📁 Estructura del proyecto

```
chatbot-ia/
├── frontend/
│   └── index.html        ← La web del chatbot (diseño pastel)
├── api/
│   └── chat.js           ← Función backend (proxy seguro a la IA)
├── vercel.json           ← Configuración de despliegue
└── README.md
```

---

## 🚀 Pasos para publicar (15 minutos)

### PASO 1 — Obtén tu clave de API de Anthropic

1. Ve a [console.anthropic.com](https://console.anthropic.com)
2. Crea una cuenta (o inicia sesión)
3. Ve a **API Keys** → **Create Key**
4. Copia la clave (empieza con `sk-ant-...`) — guárdala, solo se muestra una vez

---

### PASO 2 — Sube el proyecto a GitHub

1. Ve a [github.com](https://github.com) y crea una cuenta si no tienes
2. Haz clic en **New repository**
3. Nombre: `chatbot-ia` (o el que prefieras)
4. Marca **Public**
5. Haz clic en **Create repository**
6. Sube los archivos:
   - Haz clic en **uploading an existing file**
   - Arrastra toda la carpeta `chatbot-ia`
   - Haz clic en **Commit changes**

---

### PASO 3 — Despliega en Vercel (gratis)

1. Ve a [vercel.com](https://vercel.com) y crea cuenta con tu GitHub
2. Haz clic en **Add New Project**
3. Selecciona el repositorio `chatbot-ia`
4. Haz clic en **Deploy**
5. Espera ~1 minuto — Vercel te dará una URL como:
   ```
   https://chatbot-ia-tuusuario.vercel.app
   ```

---

### PASO 4 — Agrega tu clave de API de forma segura

1. En Vercel, ve a tu proyecto → **Settings** → **Environment Variables**
2. Agrega:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** `sk-ant-xxxxxxxxxx` (tu clave de Anthropic)
3. Haz clic en **Save**
4. Ve a **Deployments** → haz clic en los tres puntos del último deploy → **Redeploy**

---

### PASO 5 — Actualiza la URL en el HTML

1. En GitHub, abre `frontend/index.html`
2. Busca esta línea (cerca del final del archivo):
   ```javascript
   const API_URL = "https://TU-PROYECTO.vercel.app/api/chat";
   ```
3. Reemplaza `TU-PROYECTO` con el nombre real de tu proyecto en Vercel
4. Haz clic en **Commit changes**
5. Vercel redesplegará automáticamente en ~30 segundos

---

### PASO 6 — ¡Crea tu QR!

1. Copia tu URL de Vercel: `https://chatbot-ia-tuusuario.vercel.app`
2. Ve a [qr-code-generator.com](https://www.qr-code-generator.com) o [qrcode-monkey.com](https://www.qrcode-monkey.com)
3. Pega la URL y genera tu QR
4. ¡Descárgalo e imprímelo para tus clientes! 🎉

---

## 📊 Formato del Excel

| Pregunta (Columna A) | Respuesta (Columna B) |
|---|---|
| ¿Cuál es el horario? | Atendemos de lunes a viernes de 9:00 a 18:00 |
| ¿Tienen envío gratis? | Sí, en pedidos mayores a $50 |
| ¿Cómo hago una devolución? | Escríbenos a soporte@empresa.com |

> La fila 1 es el encabezado (se ignora automáticamente)

---

## 💰 Costos

| Servicio | Costo |
|---|---|
| GitHub | **Gratis** |
| Vercel | **Gratis** (hasta 100GB de ancho de banda/mes) |
| Anthropic API | ~$0.001 por consulta (muy económico) |

---

## 🌍 Idiomas soportados

El chatbot detecta automáticamente el idioma del usuario y responde en ese mismo idioma. Compatible con cualquier idioma que soporte Claude: español, inglés, francés, alemán, portugués, italiano, japonés, chino, árabe, y muchos más.

---

## ❓ Preguntas frecuentes

**¿Puedo cambiar el nombre del bot?**
Sí, desde la misma interfaz web en la sección "Personaliza tu asistente".

**¿Puedo actualizar el Excel sin redesplegar?**
Sí, el Excel se carga desde el navegador del usuario cada vez que abre el chatbot.

**¿Es segura mi clave de API?**
Sí. La clave está almacenada como variable de entorno en Vercel y nunca se expone al navegador.

**¿Qué pasa si un cliente pregunta algo que no está en el Excel?**
El bot responde amablemente que no tiene información sobre ese tema.
