#!/bin/bash

# Search for any file that references 'client_instructions' table
echo "=== Files that reference 'client_instructions' ==="
grep -r "client_instructions" --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" . 2>/dev/null | grep -v node_modules | grep -v .next

echo ""
echo "=== Files with supabase.from queries ==="
grep -r "supabase.from" --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" . 2>/dev/null | grep -v node_modules | grep -v .next

echo ""
echo "=== Files with setInterval or setTimeout ==="
grep -r "setInterval\|setTimeout" --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" . 2>/dev/null | grep -v node_modules | grep -v .next

echo ""
echo "=== Check for React Query or SWR ==="
grep -r "useQuery\|useSWR\|useSubscription" --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" . 2>/dev/null | grep -v node_modules | grep -v .next