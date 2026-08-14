# Auditoria dos projetos da referência visual

## Fonte analisada

Foram considerados os dois quadros visuais enviados pelo usuário com o título “Projetos em andamento — Painel de Projetos.”. Os cartões foram transcritos na ordem visual apresentada, de 01 a 08.

## Transcrição auditável e mapeamento

| Ordem | Código no portal | Nome no quadro | Status no quadro | Descrição transcrita | Registro no banco |
|---:|---|---|---|---|---|
| 01 | SECED-001 | IMOBILIÁRIO | EM ESTRUTURAÇÃO | Atualização dos materiais orientativos destinados ao Órgão Central, às Unidades Regionais de Ensino e às Escolas. | Conferido por consulta SQL |
| 02 | SECED-002 | ZELADORIA | EM ESTRUTURAÇÃO | Elaboração de Nova Resolução e definição de novas documentação para autorização, controle, cessação e desocupação de imóveis. | Conferido por consulta SQL |
| 03 | SECED-003 | ONR | EM ESTRUTURAÇÃO | Operador Nacional do Sistema de Registro Eletrônico de Imóveis é uma entidade que une e digitalize todos os cartórios de Registro de Imóveis do Brasil. | Conferido por consulta SQL |
| 04 | SECED-004 | INTEGRAÇÃO SAM E SED | EM ESTRUTURAÇÃO | Estudo de integração entre os sistemas Sam Patrimônio e SED, visando à migração automatizada das informações de bens permanentes adquiridos por PDDE. | Conferido por consulta SQL |
| 05 | SECED-005 | SITE EDUCAÇÃO DPAT | EM ANDAMENTO | Desenvolvimento e atualização do DPAT, com disponibilização de materiais orientativos, comunicativos, pílulas do conhecimento e POP’s. | Conferido por consulta SQL |
| 06 | SECED-006 | ALMOXARIFADO ÓRGÃO CENTRAL | CONCLUÍDO | Organização física, logística e controle de materiais finalizados. | Conferido por consulta SQL |
| 07 | SECED-007 | SAM ESTOQUE TREINAMENTO | EM EXECUÇÃO | Diagnóstico realizado por meio de formulário eletrônico, com treinamentos e materiais de apoio em fase de elaboração. | Conferido por consulta SQL |
| 08 | SECED-008 | SAM PATRIMÔNIO | EM EXECUÇÃO | Migração do GEMAT em andamento, com a realização das etapas de saneamento de pendências, inventário físico, movimentações patrimoniais e conciliação contábil. | Conferido por consulta SQL |

## Observação complementar

O quadro também apresenta a faixa de treinamento associada ao projeto SAM Estoque: 1ª turma em 26, 27 e 28/08; 2ª turma em 23, 24 e 25/09; 3ª turma em 14, 15 e 16/10; 4ª turma em 21, 22 e 23/10; e 5ª turma em 11, 12 e 13/11. Essa informação foi registrada no campo `nextSteps` do projeto SECED-007.

## Resultado da comparação

Os oito nomes, códigos, status e descrições foram inseridos no banco na mesma ordem da referência. A única normalização aplicada foi a conversão dos rótulos visuais para os valores do enum do portal: “EM ESTRUTURAÇÃO” para `estruturação`, “EM ANDAMENTO” para `andamento`, “EM EXECUÇÃO” para `execução` e “CONCLUÍDO” para `concluído`.
