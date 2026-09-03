#!/bin/bash

echo "========================================="
echo "🔍 COMPLETE LOADING DETECTION"
echo "========================================="
echo ""

echo "📁 1. Files with 'loading' variable:"
grep -rl "const.*loading.*useState" app/ --include="*.jsx" --include="*.js" 2>/dev/null | grep -v node_modules

echo ""
echo "📁 2. Files with 'Loading' component:"
grep -rl "<Loading\|Loading\.\.\." app/ --include="*.jsx" --include="*.js" 2>/dev/null | grep -v node_modules

echo ""
echo "📁 3. Files with 'setLoading' calls:"
grep -rl "setLoading" app/ --include="*.jsx" --include="*.js" 2>/dev/null | grep -v node_modules

echo ""
echo "📁 4. Files with conditional loading renders:"
grep -rl "if.*loading.*return" app/ --include="*.jsx" --include="*.js" 2>/dev/null | grep -v node_modules

echo ""
echo "📁 5. Files with spinner/loader:"
grep -rl "spinner\|loader" app/ --include="*.jsx" --include="*.js" 2>/dev/null | grep -v node_modules

echo ""
echo "========================================="
echo "📍 FILES WITH LOADING STATES:"
echo "========================================="

# Get unique files
files=$(grep -rl "loading\|setLoading\|Loading\|spinner\|loader" app/ --include="*.jsx" --include="*.js" 2>/dev/null | grep -v node_modules | sort -u)

if [ -z "$files" ]; then
  echo "✅ No loading states found!"
else
  echo "$files" | while read file; do
    echo "  📄 $file"
    echo "     Lines with loading:"
    grep -n "loading\|setLoading\|Loading" "$file" 2>/dev/null | head -3
    echo ""
  done
fi
