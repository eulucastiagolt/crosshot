# Publicação no NPM

## Pré-requisitos

1. **Criar conta no NPM:**
   - Acesse: https://www.npmjs.com/signup
   - Ou use: `npm adduser`

2. **Login no NPM:**
   ```bash
   npm login
   ```

3. **Verificar se está logado:**
   ```bash
   npm whoami
   ```

## Passos para Publicação

### 1. Teste Local
```bash
# Teste o pacote localmente
npm test

# Teste o que será publicado (dry-run)
npm run publish:dry
```

### 2. Publicação
```bash
# Publique o pacote
npm run publish:npm

# Ou diretamente:
npm publish
```

### 3. Verificação
```bash
# Instale globalmente para testar
npm install -g @ltcode/crosshot

# Teste o comando
crosshot --version
crosshot --help
```

## Atualizações Futuras

### Para novas versões:
```bash
# Versão patch (1.0.0 -> 1.0.1)
npm version patch

# Versão minor (1.0.0 -> 1.1.0)
npm version minor

# Versão major (1.0.0 -> 2.0.0)
npm version major

# Publicar nova versão
npm publish
```

## Informações do Pacote

- **Nome:** @ltcode/crosshot
- **Repositório:** https://github.com/ltcodedev/crosshot
- **Comando CLI:** crosshot
- **Tamanho:** ~36.6 kB descomprimido, ~9.9 kB comprimido

## Comandos Úteis

```bash
# Ver informações do pacote
npm view @ltcode/crosshot

# Ver todas as versões
npm view @ltcode/crosshot versions

# Despublicar (cuidado!)
npm unpublish @ltcode/crosshot@1.0.0
```
