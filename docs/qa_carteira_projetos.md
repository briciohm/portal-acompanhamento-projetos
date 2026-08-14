# QA objetivo da carteira de projetos

## Rota validada

A rota `/` foi capturada em viewport desktop de 1470 × 900 após o cadastro dos projetos. A seção “Carteira atual” exibiu oito cartões, organizados em grade de três colunas e duas linhas incompletas.

## Sequência observada na interface

| Posição | Código visível | Nome visível | Status visível |
|---:|---|---|---|
| 01 | SECED-001 | IMOBILIÁRIO | ESTRUTURAÇÃO |
| 02 | SECED-002 | ZELADORIA | ESTRUTURAÇÃO |
| 03 | SECED-003 | ONR | ESTRUTURAÇÃO |
| 04 | SECED-004 | INTEGRAÇÃO SAM E SED | ESTRUTURAÇÃO |
| 05 | SECED-005 | SITE EDUCAÇÃO DPAT | ANDAMENTO |
| 06 | SECED-006 | ALMOXARIFADO ÓRGÃO CENTRAL | CONCLUÍDO |
| 07 | SECED-007 | SAM ESTOQUE TREINAMENTO | EXECUÇÃO |
| 08 | SECED-008 | SAM PATRIMÔNIO | EXECUÇÃO |

## Drill-downs validados

Foram capturadas as rotas `/projeto/1`, `/projeto/7` e `/projeto/8`. As páginas abriram com os respectivos títulos no cabeçalho, status, progresso atual, responsável e áreas de evolução de indicadores. O projeto `/projeto/7` também exibiu o texto de treinamento no bloco “Próximos passos”.

## Resultado

A listagem da Home apresenta oito cartões na sequência SECED-001 → SECED-008. A implementação também ordena a carteira no frontend por `code` com comparação numérica, garantindo a sequência mesmo que a ordem de retorno do banco seja diferente.
