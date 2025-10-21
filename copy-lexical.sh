#!/bin/bash

# Copy ALL Lexical playground files properly
LEXICAL_DIR="docs/lexical-main/packages/lexical-playground/src"
SRC_DIR="src"

echo "Copying ALL Lexical playground files..."

# Copy all plugins (keep existing ones if modified)
echo "Copying plugins..."
for plugin in "$LEXICAL_DIR"/plugins/*; do
  plugin_name=$(basename "$plugin")
  if [[ -d "$plugin" ]]; then
    # It's a directory, copy all contents
    mkdir -p "$SRC_DIR/plugins/$plugin_name"
    cp -r "$plugin"/* "$SRC_DIR/plugins/$plugin_name/"
  else
    # It's a file
    cp "$plugin" "$SRC_DIR/plugins/"
  fi
done

# Copy all nodes
echo "Copying nodes..."
cp -r "$LEXICAL_DIR"/nodes/* "$SRC_DIR/nodes/" 2>/dev/null || true

# Copy all UI components (already done but ensure complete)
echo "Ensuring all UI components..."
for ui_file in "$LEXICAL_DIR"/ui/*; do
  ui_name=$(basename "$ui_file")
  if [[ ! -f "$SRC_DIR/ui/$ui_name" ]]; then
    cp "$ui_file" "$SRC_DIR/ui/"
  fi
done

# Copy all utils (already done but ensure complete)
echo "Ensuring all utils..."
for util_file in "$LEXICAL_DIR"/utils/*; do
  util_name=$(basename "$util_file")
  if [[ ! -f "$SRC_DIR/utils/$util_name" ]]; then
    cp "$util_file" "$SRC_DIR/utils/"
  fi
done

# Copy all context files
echo "Copying context files..."
cp -r "$LEXICAL_DIR"/context/* "$SRC_DIR/context/"

# Copy all hooks
echo "Copying hooks..."
mkdir -p "$SRC_DIR/hooks"
cp -r "$LEXICAL_DIR"/hooks/* "$SRC_DIR/hooks/" 2>/dev/null || true

echo "Done copying files. Now fix import paths..."

# Fix import paths in all copied files
find "$SRC_DIR" -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' \
  -e "s|from '\.\./\.\./|from '@/|g" \
  -e "s|from \"\.\./\.\./|from \"@/|g" \
  -e "s|from '\.\./|from '@/|g" \
  -e "s|from \"\.\./|from \"@/|g" \
  {} \;

echo "Import paths fixed. Check for any missing dependencies."