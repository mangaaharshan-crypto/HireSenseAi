#!/bin/bash
# Restore web application from backup

cd web

# The web app source files were accidentally deleted
# but the production build in dist/ folder still works

echo "Web application status:"
echo "- Production build: ✓ (web/dist/)"
echo "- Source files: Need restoration"
echo ""
echo "To run the production build:"
echo "  cd web && npx http-server dist -p 5173"
echo ""
echo "Or reinstall with:"
echo "  cd web && npx create-vite@latest . --template react --force"
echo "  Then copy source files from project documentation"
