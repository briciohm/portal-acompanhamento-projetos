# Auditoria do cronograma de implantação — SAM Patrimônio

## Fonte de referência

A fonte é a imagem enviada pelo usuário com o título “Cronograma da Implantação” e o cabeçalho “2026 — ANO DE EXECUÇÃO”. A imagem apresenta seis etapas numeradas, datas de referência e um aviso operacional no rodapé.

## Transcrição da referência

| Ordem | Data exibida | Título | Descrição e observações |
|---:|---|---|---|
| 1 | 25/02 a 29/03 | Treinamento PRODESP | Capacitação das equipes no SAM Patrimônio. |
| 2 | 30/05 | Saneamento de pendências | Correção dos cadastros com código 99999 e demais inconsistências. Data de envio do material de apoio (manuais e vídeos): 27/03. |
| 3 | 30/07 | Inventário físico | Conferência entre bens existentes e registros patrimoniais. Data de envio do material de apoio (manuais e vídeos): 01/06. |
| 4 | 30/09 | Movimentações e incorporações | Registro de transferências, incorporações e baixas no sistema. Novas orientações: 07/06. |
| 5 | 30/10 | Conciliação contábil | Alinhamento entre a base patrimonial e a contabilidade. |
| 6 | 10/12 | Identificação patrimonial | Etiquetagem e identificação física dos bens. |

## Aviso operacional transcrito

“ATENÇÃO: CASO NÃO RECEBAM O MATERIAL NOS E-MAILS SETORIAIS ENTRAR EM CONTATO COM O DPAT CONFORME ORIENTADO NOS ENCONTROS VIA TEAMS.”

## Comparação com o banco

Os seis registros de `project_stages` do projeto `SECED-008` correspondem, em ordem, aos seis títulos da referência. As datas de vencimento foram normalizadas para o ano de 2026: 29/03, 30/05, 30/07, 30/09, 30/10 e 10/12. Os textos de descrição e as observações sobre materiais, código 99999 e novas orientações foram preservados nos campos das etapas.

Os seis registros de `project_milestones` usam os mesmos títulos e datas de referência. O aviso operacional foi inserido no campo `nextSteps` do projeto, sendo exibido no bloco “Próximos passos” do detalhamento.

## QA objetivo da rota

Na rota `/projeto/8`, a interface exibiu o projeto “SAM Patrimônio”, o prazo final de 10/12/2026, a seção “Cronograma de etapas” com seis itens numerados e suas datas, a seção “Linha do tempo de marcos” com seis referências temporais e o aviso operacional no bloco “Próximos passos”.

## Registro visual da captura

A captura full-page da rota `/projeto/8`, realizada após a inserção dos dados, mostra visualmente a seção “Cronograma de etapas” com seis itens numerados: 1 Treinamento PRODESP, 2 Saneamento de pendências, 3 Inventário físico, 4 Movimentações e incorporações, 5 Conciliação contábil e 6 Identificação patrimonial. Cada item apresenta sua data de vencimento, respectivamente 29/03/2026, 30/05/2026, 30/07/2026, 30/09/2026, 30/10/2026 e 10/12/2026.

Na coluna “Linha do tempo de marcos”, a captura mostra seis referências temporais correspondentes aos meses de março, maio, julho, setembro, outubro e dezembro de 2026. Ao final da página, o bloco destacado “Próximos passos” exibe o aviso para procurar o DPAT caso o material não seja recebido nos e-mails setoriais, conforme orientação dos encontros via Teams.

Essa observação visual confirma a correspondência entre os registros do banco e a apresentação do cronograma no drill-down do SAM Patrimônio.
