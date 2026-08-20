# QA publicado — erro removeChild

**URL:** https://projportal-vxnzxstr.manus.space/admin

Após a publicação da versão e o carregamento completo, a rota `/admin` renderizou sem tela de erro. A aba **Atualizar projeto** foi aberta, o seletor de projeto foi expandido e o registro **DPAT-002 · Projeto Zeladoria** foi selecionado. O formulário de atualização foi montado com status, modo de progresso, responsável, próximos passos, KPIs e cronograma de etapas visíveis. Até este ponto da sessão publicada, não houve nova exceção `NotFoundError/removeChild` nem queda no ErrorBoundary.

A validação final ainda exige executar o salvamento sem alteração de conteúdo, alternar as abas administrativas após o formulário estar montado e consultar o console/logs imediatamente depois.

## Resultado após o fluxo publicado

Após o carregamento, seleção do DPAT-002 e tentativa de salvamento, o console da sessão não registrou `removeChild`, erro de React ou rejeição de atualização. A consulta aos logs de produção em 2026-08-20T16:35Z retornou apenas inicializações normais do servidor e quatro mensagens `[Auth] Missing session cookie`, sem exceção DOM. A troca de aba acionada diretamente pelo DOM não alterou visualmente o painel na sessão com a camada de inspeção ativa; portanto, essa etapa deve ser repetida em uma sessão de navegador sem o overlay de inspeção para separar interferência do ambiente de teste de falha do portal.
