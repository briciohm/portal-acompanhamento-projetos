# QA — Auditoria, matriz de permissões e escopo setorial

## Evidências visuais

- Desktop (1280×720, `/admin`, captura full-page): a matriz de permissões aparece antes dos formulários, com tabela horizontalmente contida; a lista de usuários e o painel de auditoria permanecem dentro da composição institucional.
- Mobile (375×812, `/admin`, captura full-page): os blocos empilham-se verticalmente; a tabela da matriz usa rolagem horizontal interna e os cartões permanecem legíveis, sem exigir largura fixa da página.

## Evidências técnicas

- `pnpm test`: 13 arquivos e 46 testes aprovados.
- `pnpm check`: aprovado sem erros TypeScript.
- `pnpm build`: build de produção concluído; permaneceu apenas o aviso informativo de chunk JavaScript acima de 500 kB.
- Servidor de desenvolvimento ativo e sem erros TypeScript no health check.
