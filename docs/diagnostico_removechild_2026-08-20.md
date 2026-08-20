# Diagnóstico do erro removeChild — 20/08/2026

A rota publicada testada foi https://projportal-vxnzxstr.manus.space/admin. O carregamento inicial ocorreu sem erro fatal na sessão de teste. Ao abrir a aba “Atualizar projeto” e o Select “Escolha um projeto”, a lista foi renderizada em um portal Radix sob `document.body`. A sessão de inspeção visual mostrou uma camada externa com bordas pontilhadas e marcadores numerados sobre cabeçalho, abas, campos e rodapé; essa camada não é renderizada pelo código do portal e pode alterar ou inspecionar o DOM fora do ciclo React.

O Select contém os projetos DPAT-001 a DPAT-016, incluindo “DPAT-002 · Projeto Zeladoria”. Ao fechar a lista e retornar ao estado vazio, não foi observada nova tela fatal na sessão. A evidência indica que o próximo passo deve separar mutações do inspetor/ambiente externo de desmontagens próprias do portal, testar o fluxo com o Select aberto e revisar todos os portais Radix antes de remover o workaround global.
