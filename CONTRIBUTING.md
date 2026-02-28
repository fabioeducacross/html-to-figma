# Guia de Contribuição

## Workflow

1. Crie uma branch para sua feature: `git checkout -b feat/sua-feature`
2. Faça commit das mudanças: `git commit -m "feat: descrição"`
3. Faça push para a branch: `git push origin feat/sua-feature`
4. Abra um Pull Request

## Convenções de Commit

- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Documentação
- `test:` Testes
- `refactor:` Refatoração
- `perf:` Performance
- `security:` Segurança

## Padrões de Código

- TypeScript com tipos explícitos
- ESLint + Prettier
- Testes para novas funcionalidades
- JSDoc para funções públicas
- Considerar segurança sempre

## Testes

```bash
npm test
```

## Build

```bash
npm run build
```
