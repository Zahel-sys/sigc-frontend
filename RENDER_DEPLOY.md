# 🚀 Deploy en Render - SIGC Frontend

## 📋 Configuración para Render

### 1. **Frontend en Render**

**Configuración básica:**
- **Repository:** Tu repositorio GitHub
- **Branch:** `main` 
- **Build Command:** `npm run build`
- **Publish Directory:** `dist`
- **Node Version:** `18`

### 2. **Variables de Entorno en Render**

En el dashboard de Render, configura estas variables:

```
VITE_API_URL=https://tu-backend-nombre.onrender.com
VITE_APP_NAME=SIGC - Sistema de Citas
NODE_ENV=production
```

### 3. **Configuración de redirecciones para SPA**

Crea `public/_redirects` para manejar rutas de React Router:

```
/*    /index.html   200
```

### 4. **Pasos para deployment**

1. **Conectar repositorio:**
   ```bash
   git add .
   git commit -m "feat: configuración para deploy en Render"
   git push origin main
   ```

2. **Crear servicio en Render:**
   - Ir a [render.com](https://render.com)
   - "New" → "Static Site"
   - Conectar tu repositorio GitHub
   - Configurar build settings

3. **Configurar variables de entorno:**
   - En el dashboard del sitio
   - Pestaña "Environment"
   - Agregar `VITE_API_URL` con la URL de tu backend

4. **Deploy automático:**
   - Render detectará cambios en `main`
   - Build y deploy automático

### 5. **URL resultante**
Tu frontend estará disponible en:
```
https://tu-frontend-nombre.onrender.com
```

### 6. **Configuración del Backend**
Asegúrate de que tu backend en Render:
- Tenga CORS configurado para tu frontend URL
- Exponga los endpoints correctos
- Use las variables de entorno adecuadas

## 🔧 Troubleshooting

### Error: "Failed to load module"
- Verificar que `base: './'` esté en `vite.config.js`

### Error: "404 en rutas" 
- Asegurar que existe `public/_redirects`

### Error: "CORS"
- Configurar CORS en backend con URL de frontend

### Error: "API calls failing"
- Verificar `VITE_API_URL` en variables de entorno
- Confirmar que backend esté corriendo

## 📞 URLs importantes

- **Frontend:** `https://tu-frontend.onrender.com`
- **Backend:** `https://tu-backend.onrender.com` 
- **Dashboard:** `https://dashboard.render.com`

---

**¡Tu SIGC estará listo en Render con esta configuración! 🎉**