#!/bin/bash
# Script de deployment automático para producción
# Uso: bash deploy.sh

echo "🚀 INICIANDO DEPLOYMENT..."

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 1. VERIFICAR GIT
echo -e "${YELLOW}📝 Verificando Git...${NC}"
if ! git status > /dev/null 2>&1; then
  echo -e "${RED}❌ No estás en un repositorio Git${NC}"
  exit 1
fi

# 2. VERIFICAR CAMBIOS SIN GUARDAR
if ! git diff-index --quiet HEAD --; then
  echo -e "${YELLOW}⚠️  Tienes cambios sin guardar${NC}"
  read -p "¿Quieres continuar? (s/n): " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Ss]$ ]]; then
    exit 1
  fi
fi

# 3. BUILD FRONTEND
echo -e "${YELLOW}🏗️  Building frontend...${NC}"
cd frontend
npm run build
if [ $? -ne 0 ]; then
  echo -e "${RED}❌ Build fallido${NC}"
  exit 1
fi
echo -e "${GREEN}✅ Frontend compilado${NC}"
cd ..

# 4. VERIFICAR BACKEND
echo -e "${YELLOW}🔍 Verificando backend...${NC}"
cd backend
npm install --production
if [ $? -ne 0 ]; then
  echo -e "${RED}❌ Error instalando dependencias${NC}"
  exit 1
fi
echo -e "${GREEN}✅ Backend verificado${NC}"
cd ..

# 5. GIT COMMIT
echo -e "${YELLOW}📤 Haciendo commit a GitHub...${NC}"
git add .
git commit -m "🚀 Deploy a producción - $(date +'%Y-%m-%d %H:%M:%S')"
git push origin main

if [ $? -ne 0 ]; then
  echo -e "${RED}❌ Error en push a GitHub${NC}"
  exit 1
fi

echo -e "${GREEN}✅ Push a GitHub exitoso${NC}"

# 6. RESUMEN
echo ""
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ DEPLOYMENT COMPLETADO!${NC}"
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo ""
echo "📱 Frontend: https://servi-collantas.vercel.app"
echo "🔌 Backend: https://servi-collantas-api.onrender.com"
echo ""
echo "Vercel y Render mostrarán el nuevo deployment automáticamente"
echo "Espera 1-2 minutos para que se complete"
echo ""
echo -e "${YELLOW}⏱️  Puedes ver el progreso en:${NC}"
echo "   Vercel: https://vercel.com/dashboard"
echo "   Render: https://dashboard.render.com"
