# 🚀 Deploy Instructions - SIGC Frontend

## 📋 Pre-requisitos

- ✅ Node.js 18+ instalado
- ✅ npm 9+ o yarn 1.22+
- ✅ Git configurado
- ✅ Cuenta en el proveedor de hosting elegido

---

## 🌐 Deploy en Netlify (Recomendado)

### Método 1: Netlify CLI

```bash
# 1. Instalar Netlify CLI
npm install -g netlify-cli

# 2. Construir el proyecto
npm run build

# 3. Login a Netlify
netlify login

# 4. Deploy inicial
netlify deploy --dir=dist

# 5. Deploy a producción
netlify deploy --prod --dir=dist
```

### Método 2: GitHub Integration

1. **Subir código a GitHub:**
   ```bash
   git add .
   git commit -m "feat: preparar para deploy"
   git push origin main
   ```

2. **Conectar en Netlify:**
   - Ir a [netlify.com](https://netlify.com)
   - "New site from Git" → Seleccionar repositorio
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`

3. **Variables de entorno:**
   ```
   VITE_API_URL=https://tu-backend-api.com
   VITE_APP_NAME=SIGC Producción
   VITE_LOG_LEVEL=error
   ```

### Configuración adicional Netlify

```toml
# netlify.toml
[build]
  publish = "dist"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## ⚡ Deploy en Vercel

### Método 1: Vercel CLI

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel

# 4. Deploy a producción
vercel --prod
```

### Método 2: GitHub Integration

1. **Conectar repositorio:**
   - Ir a [vercel.com](https://vercel.com)
   - "Import Project" → GitHub repo

2. **Configuración automática:**
   - Vercel detecta automáticamente Vite
   - **Framework:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

3. **Variables de entorno en Vercel:**
   ```bash
   # Desde CLI
   vercel env add VITE_API_URL
   vercel env add VITE_APP_NAME
   ```

---

## 🔥 Deploy en Firebase Hosting

```bash
# 1. Instalar Firebase CLI
npm install -g firebase-tools

# 2. Login
firebase login

# 3. Inicializar proyecto
firebase init hosting

# 4. Configuración firebase.json:
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}

# 5. Build y deploy
npm run build
firebase deploy
```

---

## 📦 Deploy en GitHub Pages

```bash
# 1. Instalar gh-pages
npm install --save-dev gh-pages

# 2. Agregar scripts en package.json:
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}

# 3. Configurar base en vite.config.js:
export default defineConfig({
  base: '/sigc-frontend/',
  plugins: [react()],
})

# 4. Deploy
npm run deploy
```

---

## 🐳 Deploy con Docker

### Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### nginx.conf

```nginx
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        location / {
            try_files $uri $uri/ /index.html;
        }

        location /api {
            proxy_pass http://backend:8080;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }
}
```

### Comandos Docker

```bash
# 1. Construir imagen
docker build -t sigc-frontend .

# 2. Ejecutar localmente
docker run -p 3000:80 sigc-frontend

# 3. Docker Compose (con backend)
docker-compose up -d
```

---

## ☁️ Deploy en AWS S3 + CloudFront

```bash
# 1. Instalar AWS CLI
# Descargar desde aws.amazon.com/cli/

# 2. Configurar credenciales
aws configure

# 3. Build del proyecto
npm run build

# 4. Crear bucket S3
aws s3 mb s3://sigc-frontend-prod

# 5. Subir archivos
aws s3 sync dist/ s3://sigc-frontend-prod --delete

# 6. Configurar bucket para hosting
aws s3 website s3://sigc-frontend-prod \
  --index-document index.html \
  --error-document index.html

# 7. Crear distribución CloudFront (opcional)
aws cloudfront create-distribution \
  --distribution-config file://cloudfront-config.json
```

---

## 🔧 Variables de Entorno por Ambiente

### 🌱 Desarrollo
```env
VITE_API_URL=http://localhost:8080
VITE_APP_NAME=SIGC - Desarrollo
VITE_LOG_LEVEL=debug
VITE_DEBUG_MODE=true
```

### 🧪 Testing/Staging
```env
VITE_API_URL=https://staging-api.sigc.com
VITE_APP_NAME=SIGC - Testing
VITE_LOG_LEVEL=warn
VITE_DEBUG_MODE=true
```

### 🚀 Producción
```env
VITE_API_URL=https://api.sigc.com
VITE_APP_NAME=SIGC - Sistema de Citas
VITE_LOG_LEVEL=error
VITE_DEBUG_MODE=false
```

---

## 📊 Monitoreo Post-Deploy

### Verificaciones Esenciales

```bash
# 1. Verificar que la app carga
curl -I https://tu-dominio.com

# 2. Verificar rutas SPA
curl -I https://tu-dominio.com/login
curl -I https://tu-dominio.com/dashboard

# 3. Verificar assets
curl -I https://tu-dominio.com/assets/index.js

# 4. Verificar API connectivity
# Abrir DevTools → Network → Verificar calls API
```

### Herramientas de Monitoreo

- **Lighthouse:** Auditorías de performance
- **Sentry:** Monitoring de errores
- **Google Analytics:** Análisis de uso
- **Pingdom:** Uptime monitoring

---

## 🔄 CI/CD Automático

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy Frontend

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: 18
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test:run
    
    - name: Build
      run: npm run build
      env:
        VITE_API_URL: ${{ secrets.VITE_API_URL }}
    
    - name: Deploy to Netlify
      uses: nwtgck/actions-netlify@v1.2
      with:
        publish-dir: './dist'
        production-deploy: true
      env:
        NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

---

## 🚨 Solución de Problemas

### Problema: "Failed to load module"
```bash
# Solución: Verificar paths en vite.config.js
export default defineConfig({
  base: './', // o '/sigc-frontend/' para subdirectorio
})
```

### Problema: "API calls failing"
```bash
# Verificar CORS en backend
# Verificar variable VITE_API_URL
# Verificar red/firewall
```

### Problema: "Routes not working (404)"
```bash
# Configurar redirects para SPA:

# Netlify (_redirects file):
/*    /index.html   200

# Apache (.htaccess):
RewriteEngine On
RewriteRule ^(?!.*\.).*$ /index.html [L]

# Nginx:
location / {
    try_files $uri $uri/ /index.html;
}
```

---

## 📞 Soporte Deploy

Si tienes problemas con el deploy:

1. **Revisar logs** del proveedor de hosting
2. **Verificar variables** de entorno
3. **Comprobar build** local: `npm run build && npm run preview`
4. **Contactar soporte:** leonardo@sigc.com

---

**🎉 ¡Felicitaciones! Tu aplicación SIGC está ahora en vivo 🎉**