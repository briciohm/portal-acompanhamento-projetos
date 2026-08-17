# QA da carteira completa após a correção

## Home

A captura full-page da Home, realizada após a remoção do limite `slice(0, 9)` em `client/src/pages/Home.tsx`, mostrou o indicador de **12 projetos cadastrados** e a carteira em ordem crescente de código, distribuída em quatro linhas de três cartões:

| Ordem | Código | Nome |
|---:|---|---|
| 01 | SECED-001 | Imobiliário |
| 02 | SECED-002 | Zeladoria |
| 03 | SECED-003 | ONR |
| 04 | SECED-004 | Integração SAM e SED |
| 05 | SECED-005 | Site Educação DPAT |
| 06 | SECED-006 | Almoxarifado Órgão Central |
| 07 | SECED-007 | SAM Estoque Treinamento |
| 08 | SECED-008 | SAM Patrimônio |
| 09 | SECED-009 | Fluxo de Solicitação, Entrega e Controle de Notebooks |
| 10 | SECED-010 | Manual de Gestão Patrimonial |
| 11 | SECED-011 | Manual de Gestão Patrimonial Imobiliária |
| 12 | SECED-012 | Manual de Almoxarifado |

## Drill-down SECED-009

A captura da rota `/projeto/30001` mostrou o título **Fluxo de Solicitação, Entrega e Controle de Notebooks**, o selo de status **Estruturação**, o cartão de progresso atual em **0%**, responsável não informado, meta a definir, painéis vazios aguardando cadastro de KPIs/etapas/marcos e a mensagem “Nenhum próximo passo informado”. A rota carregou sem tela de erro.

## Checagem técnica

Após a correção da carteira, `pnpm test` passou com 3 arquivos e 3 testes, e `pnpm check` terminou sem erros.
