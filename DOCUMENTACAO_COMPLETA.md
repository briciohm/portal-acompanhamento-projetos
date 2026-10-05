# Compilação integral da documentação

Portal de Acompanhamento de Projetos — DPAT/COGESPA

Compilado em 01/10/2026.

---

# Apresentação — Perfis de Usuário do Portal

_Arquivo de origem: `apresentacao-perfis-usuarios.md`_

# Apresentação — Perfis de Usuário do Portal

## Slide 1 — Perfis de usuário
**Portal de Acompanhamento de Projetos**

Guia visual de responsabilidades, permissões e segurança.

Documento orientativo e não oficial do projeto.

## Slide 2 — Por que existem perfis?
- Distribuir responsabilidades com clareza.
- Evitar acessos indevidos e elevação de privilégios.
- Organizar a atuação por função e setor.
- Manter rastreabilidade das operações administrativas.

## Slide 3 — Hierarquia de perfis
| Nível | Perfil | Pode criar ou atribuir |
|---:|---|---|
| 4 | Administrador Geral | Gestor de Setor, Editor de Projetos e Consulta |
| 3 | Gestor de Setor | Editor de Projetos e Consulta |
| 2 | Editor de Projetos | Consulta |
| 1 | Consulta | Nenhum perfil |

Regra central: cada usuário só pode atribuir perfis estritamente inferiores ao próprio nível.

## Slide 4 — Administrador Geral
- Acesso completo ao Back-Office.
- Administra usuários, perfis, setores, projetos e configurações.
- Gerencia documentos, evidências, cronogramas e indicadores.
- Consulta e acompanha a auditoria.
- Não pode remover o próprio perfil nem desativar a própria proteção administrativa.

## Slide 5 — Gestor de Setor
- Acompanha projetos dos setores vinculados.
- Pode editar projetos, etapas, marcos, indicadores, fotos e documentos do escopo permitido.
- Pode criar Editor de Projetos e Consulta.
- Visualiza somente usuários relacionados aos seus setores.

## Slide 6 — Editor de Projetos e Consulta
### Editor de Projetos
Atualiza conteúdo operacional dos projetos, sem administrar usuários, setores ou configurações estruturais. Pode criar usuários de Consulta.

### Consulta
Possui acesso somente para leitura. Consulta projetos, indicadores, cronogramas, documentos, evidências, históricos e diagnósticos.

## Slide 7 — Vínculos setoriais e segurança
- Gestores podem ser vinculados a um ou mais setores.
- O vínculo define o alcance de visualização e operação.
- Perfis iguais ou superiores são bloqueados no servidor.
- A interface apresenta somente opções permitidas ao usuário atual.

## Slide 8 — Auditoria e tentativas bloqueadas
- Criações e alterações registram autor, alvo, ação, perfis, setores, status e data.
- Tentativas de elevação são registradas como **Tentativa bloqueada**.
- A auditoria pode ser filtrada por autor, tipo de ação e período.
- Um bloqueio significa que a alteração foi recusada, não executada.

## Slide 9 — Como solicitar suporte
| Necessidade | Ponto de contato |
|---|---|
| Acesso, perfil ou permissão | Administrador Geral |
| Projeto ou operação de um setor | Gestor de Setor |
| Documento, foto ou atualização operacional | Editor de Projetos |
| Erro técnico ou comportamento inesperado | Suporte Técnico do Portal |
| Tentativa bloqueada ou suspeita | Administrador Geral e Suporte Técnico do Portal |

Ao solicitar suporte, informe usuário, perfil, setor, página, horário, operação e mensagem apresentada. Nunca compartilhe senhas ou tokens.

## Slide 10 — Mensagem final
Perfis claros, escopo setorial e auditoria formam uma camada integrada de governança do portal.

Consulte o Administrador Geral quando uma permissão não estiver disponível ou quando houver dúvida sobre o fluxo correto.

Copyright © 2026 Gufs Tech. Todos os direitos reservados.
Desenvolvido e mantido por Fabrício Gustavo Ferreira.

---

# Auditoria do cronograma de implantação — SAM Patrimônio

_Arquivo de origem: `auditoria_cronograma_sam_patrimonio.md`_

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

---

# Auditoria da galeria — Almoxarifado Órgão Central

_Arquivo de origem: `auditoria_galeria_almoxarifado.md`_

# Auditoria da galeria — Almoxarifado Órgão Central

## Projeto

A galeria foi vinculada ao projeto `SECED-006 — Almoxarifado Órgão Central`.

## Evidência visual

A captura full-page da rota `/projeto/6` exibiu a seção “Galeria de fotos” com 16 imagens em uma grade de quatro colunas, mantendo os títulos derivados dos arquivos enviados: `Sala14-b2`, `Sala14-b`, `c1`, `Sala14-f1`, `a1`, `e1`, `f1`, `d1`, `e2`, `b2`, `d2`, `b1`, `a2`, `c2`, `f2` e `Sala14-f2`.

## Armazenamento e vínculo

Os 16 arquivos foram enviados ao armazenamento persistente e os 16 registros foram inseridos em `project_photos` com `projectId = 6`, incluindo `storageKey` e URL `/manus-storage/` correspondente. A contagem anterior do projeto era zero, portanto não houve duplicidade na inclusão desta carga.

## Comportamentos da galeria

A implementação da galeria utiliza `loading="lazy"` nas imagens. Cada cartão possui interação de clique que atualiza a foto selecionada e abre um `Dialog` com a imagem em tamanho ampliado, usando `object-contain` para preservar sua proporção.

## Resultado

A galeria do Almoxarifado Órgão Central está preenchida com as 16 fotos enviadas, com armazenamento persistente, carregamento lazy e visualização ampliada disponíveis no drill-down do projeto.

---

# Auditoria da inclusão dos novos projetos

_Arquivo de origem: `auditoria_novos_projetos.md`_

# Auditoria da inclusão dos novos projetos

## Resultado

A carteira passou de oito para doze projetos. Os oito registros originais permanecem presentes com os mesmos códigos e nomes: SECED-001 Imobiliário, SECED-002 Zeladoria, SECED-003 ONR, SECED-004 Integração SAM e SED, SECED-005 Site Educação DPAT, SECED-006 Almoxarifado Órgão Central, SECED-007 SAM Estoque Treinamento e SECED-008 SAM Patrimônio.

Foram incluídos quatro novos registros, todos na área existente e com status inicial “estruturação”, progresso 0 e sem responsável ou próximos passos preenchidos, para que o back-office possa completar os dados sem inventar informações operacionais:

| Código | Projeto |
|---|---|
| SECED-009 | Fluxo de Solicitação, Entrega e Controle de Notebooks |
| SECED-010 | Manual de Gestão Patrimonial |
| SECED-011 | Manual de Gestão Patrimonial Imobiliária |
| SECED-012 | Manual de Almoxarifado |

## Validação

A consulta ao banco retornou 12 registros em ordem crescente de código, sem duplicidades. A Home foi capturada com o indicador “12 projetos cadastrados” e o drill-down de SECED-009 foi aberto com o título “Fluxo de Solicitação, Entrega e Controle de Notebooks”, status “estruturação” e progresso 0%.

Os testes Vitest passaram: 3 arquivos e 3 testes. A checagem TypeScript (`pnpm check`) também terminou sem erros.

---

# Auditoria dos projetos da referência visual

_Arquivo de origem: `auditoria_projetos_referencia.md`_

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

---

# Autoria e copyright

_Arquivo de origem: `autoria_e_copyright.md`_

# Autoria e copyright

O Portal de Acompanhamento de Projetos identifica no rodapé institucional o seguinte aviso de copyright e manutenção:

> Copyright © 2026 Gufs Tech. Todos os direitos reservados. Desenvolvido e mantido por Fabrício Gustavo Ferreira.

Este aviso registra a titularidade declarada de Gufs Tech e a autoria de manutenção de Fabrício Gustavo Ferreira, devendo permanecer associado às versões distribuídas do sistema, salvo autorização expressa dos titulares.

O aviso de copyright é uma identificação de autoria. Ele não substitui contratos de cessão ou licenciamento, acordos institucionais, registro formal ou orientação jurídica especializada sobre titularidade, obras produzidas no contexto profissional e direitos patrimoniais.

---

# Consolidação documental dos Planos de Ação — 18/08/2026

_Arquivo de origem: `consolidacao_planos_acao_2026-08-18.md`_

# Consolidação documental dos Planos de Ação — 18/08/2026

## Critério de escopo
Foram considerados ativos os projetos com status diferente de `pausado` e progresso inferior a 100%. O projeto DPAT-006 — Organização dos estoques e Almoxarifados — foi omitido da consolidação executiva por estar com progresso de 100%, sendo tratado como concluído pela regra vigente do portal, ainda que o cadastro histórico mantenha status antigo.

## Carteira ativa analisada
DPAT-002 Zeladoria; DPAT-003 ONR; DPAT-004 Estudo de novas tecnologias para controle patrimonial de almoxarifados (Integração SED-SAM); DPAT-005 Site Educação - DPAT; DPAT-007 SAM Estoque - Treinamento; DPAT-008 Implantação (SAM Patrimônio); DPAT-009 Fluxo de Solicitação, Entrega e Controle de Notebooks; DPAT-010 Manual de Gestão Patrimonial móvel; DPAT-011 Manual de Gestão Patrimonial Imobiliária; DPAT-012 Manual de Almoxarifado.

## Evidências e mapeamento

### DPAT-002 — Zeladoria
Fonte: `Iniciação-NomedoProjeto-Zeladoria.docx` e `PLANODEAÇÃOCOGESPA-ZELADORIA.docx`.
Problema: ausência de fluxo administrativo padronizado para autorização, controle e cessação da ocupação de dependências de zeladoria, com processos SEI heterogêneos, insegurança jurídica, dúvidas sobre cobrança/isenção e ocupações irregulares.
Objetivo: implantar fluxo padronizado, checklist documental, manual, critérios de isenção/cobrança e procedimento de desocupação.
Etapas: diagnóstico normativo e operacional; mapeamento do fluxo atual; estruturação do fluxo SEI; checklist/manual; validação institucional; divulgação e capacitação das UREs; monitoramento contínuo.
Responsáveis documentais: DPAT/COGESPA/SUCOR, com participação de UREs, diretores, Casa Civil e PGE. O documento aponta Hemarteson Lemos Muniz como responsável conforme hierarquia; o cadastro do portal preserva o responsável operacional informado anteriormente.
Prazo informado: início em 2026; sem data final explícita no documento.

### DPAT-004 — Estudo de integração SED-SAM
Fonte: `PLANODEAÇÃOCOGESPA-4.1EstudodeNovasTecnologiasparaControlePatrimonialAlmoxarifados.docx`.
Objetivo: estudar a viabilidade de automatizar o envio de bens permanentes registrados na SED para o Relatório de Pendências do SAM, sinalizando “Novo Bem” para incorporação.
Etapas: mapear fluxo atual; identificar retrabalho; definir dados mínimos; propor regra de classificação consumo/permanente; desenhar fluxo integrado; validar com áreas/PRODESP; definir tratamento no relatório; piloto; ajustes; formalização final.
Responsáveis documentais: DPAT/COGESPA/área técnica, com PRODESP nas validações. Prazo: documento de 08/06/2026, execução até 30/06/2027.

### DPAT-005 — Site Educação - DPAT
Fonte: `PLANODEAÇÃOCOGESPA-ATUALIZAÇÃOPORTALDPAT.docx`.
Objetivo: estruturar o Portal DPAT como canal oficial de materiais orientativos para Escolas, UREs e Órgão Central.
Etapas: desenhar estrutura; definir três perfis de consulta; mapear materiais; organizar por categoria; publicar POPs; publicar pílulas; criar controle de versão; validar navegação; disponibilizar; manter atualização contínua.
Responsável documental: DPAT/UREs na validação. Prazo: 08/06/2026 a 15/11/2026.

### DPAT-007 — SAM Estoque - Treinamento
Fonte: `PLANODEAÇÃOCOGESPA-SAMESTOQUE.docx`.
Objetivo: verificar o uso do SAM Estoque, identificar unidades com dificuldades ou sem uso, encaminhar informações à PRODESP, organizar treinamento e publicar materiais de apoio.
Etapas: Forms; consolidação; identificação de unidades; encaminhamento à PRODESP; planejamento/agendamento; treinamento; levantamento de temas; criação/validação de POPs e pílulas; publicação no Portal DPAT.
Responsáveis documentais: DPAT, com PRODESP e UREs. Prazo: a definir conforme Forms, encaminhamento, agenda e materiais.

### DPAT-008 — Implantação SAM Patrimônio
Fonte: `PLANODEAÇÃOCOGESPA-1.SAMPATRIMÔNIO.docx`, `2.1RELATÓRIODEPENDÊNCIAS`, `3.1INVENTÁRIOFÍSICOEAJUSTESDEDIVERGÊNCIAS`, `4.1MOVIMENTAÇÃO...`, `5.1CONCILIAÇÃO...`, `6.1IDENTIFICAÇÃO...` e `SIAFEM2026-SAMPatrimônio..docx`.
Objetivo: acompanhar treinamento, pendências, inventário físico, ajustes de divergências, movimentações/incorporações/transferências/baixas, conciliação contábil e identificação patrimonial.
Etapas consolidadas: treinamento; relatório de pendências e suporte; inventário e divergências; movimentações patrimoniais; conciliação e saldo contábil; identificação patrimonial.
Responsáveis documentais: DPAT e UREs; materiais registram reuniões semanais, CRM/e-mail e ajustes de cronograma devido à lentidão do SAM.
Prazo principal: 25/02/2026 a 10/12/2026. O cadastro do portal mantém o cronograma detalhado já incluído anteriormente.

### DPAT-009 — Fluxo de notebooks
Fonte: `PLANODEAÇÃOCOGESPA-FLUXODEPEDIDONOTEBOOK.docx`, `Comunicado_Geral_Fluxo_Solicitacao_Notebooks_Atualizado.docx` e `ModelodeSolicitaçãodeNotebook2026.docx`.
Objetivo: padronizar solicitação, disponibilização, controle, responsabilidade, entrega e devolução de notebooks.
Etapas: critérios de atendimento; atualização do Termo de Responsabilidade; revisão semestral; solicitação por e-mail; checklist DPAT; registro de entrega; devolução; exceções autorizadas; comunicação às áreas.
Prazo do plano: até 30/08/2026. Responsáveis: DPAT, solicitante e superiores competentes.

### DPAT-011 — Manual de Gestão Patrimonial Imobiliária
Fonte: `PLANODEAÇÃOCOGESPA-IMOBILIARIO.docx` e `CEPAT_APRESENTAÇÃOIMOBILIÁRIO.pdf`.
Objetivo operacional documentado: organizar, acompanhar e dar suporte aos processos imobiliários, com levantamento, classificação/priorização, conferência documental, análise de finalidade pública, orientação, encaminhamento jurídico-administrativo e acompanhamento.
Prazo do plano: 01/01/2026 a 02/07/2026. O cadastro permanece ativo/histórico conforme carteira; o resumo deve refletir suporte processual e não inventar responsável nominal ausente.

### DPAT-012 — Manual de Almoxarifado
Fonte: `PLANODEAÇÃOCOGESPA-ALMOXARIFADO.docx` e materiais `PLANODEAÇÃOCOGESPA-PROCEDIMENTOSOPERACIONAISPADRÃO.docx`.
O plano de organização do Almoxarifado já está concluído no cadastro DPAT-006; para DPAT-012, a consolidação deve tratar o manual como produto normativo/orientativo, sem transferir o progresso do projeto físico concluído.

### DPAT-010 — Manual de Gestão Patrimonial móvel
Não foi localizado no conjunto extraído um Plano de Ação específico com esse título. O projeto deve permanecer ativo sem criação de fatos, percentuais, prazos ou responsáveis não documentados; pode receber apenas indicação de que o detalhamento documental está pendente.

### DPAT-003 — ONR
Os materiais do ONR foram incorporados anteriormente ao portal, mas não foi localizado neste conjunto um Plano de Ação específico adicional para alterar os campos executivos. O cadastro deve permanecer sem inferências novas.

## Projetos omitidos
DPAT-006 — Organização dos estoques e Almoxarifados — progresso 100%; omitido dos resumos executivos desta rodada conforme o filtro de escopo.

## Regra de qualidade
Nenhum percentual novo foi inventado. Datas, responsáveis e status somente devem ser atualizados quando expressamente suportados pelos documentos; campos sem evidência permanecem como estão ou recebem indicação de detalhamento pendente.

---

# Diagnóstico do erro removeChild — 20/08/2026

_Arquivo de origem: `diagnostico_removechild_2026-08-20.md`_

# Diagnóstico do erro removeChild — 20/08/2026

A rota publicada testada foi https://projportal-vxnzxstr.manus.space/admin. O carregamento inicial ocorreu sem erro fatal na sessão de teste. Ao abrir a aba “Atualizar projeto” e o Select “Escolha um projeto”, a lista foi renderizada em um portal Radix sob `document.body`. A sessão de inspeção visual mostrou uma camada externa com bordas pontilhadas e marcadores numerados sobre cabeçalho, abas, campos e rodapé; essa camada não é renderizada pelo código do portal e pode alterar ou inspecionar o DOM fora do ciclo React.

O Select contém os projetos DPAT-001 a DPAT-016, incluindo “DPAT-002 · Projeto Zeladoria”. Ao fechar a lista e retornar ao estado vazio, não foi observada nova tela fatal na sessão. A evidência indica que o próximo passo deve separar mutações do inspetor/ambiente externo de desmontagens próprias do portal, testar o fluxo com o Select aberto e revisar todos os portais Radix antes de remover o workaround global.

---

# Guia rápido de perfis de usuário

_Arquivo de origem: `manual-perfis-usuarios.md`_

# Guia rápido de perfis de usuário

> **Documento orientativo e não oficial do projeto.** Este material explica, em linguagem simples, como os perfis funcionam no Portal de Acompanhamento de Projetos. As regras efetivas são sempre as aplicadas pelo sistema.

## 1. Como funciona a hierarquia

O sistema trabalha com cinco perfis. Um usuário somente pode criar ou atribuir perfis que estejam abaixo do seu próprio nível. Não é permitido criar um perfil igual ao seu, promover alguém para um nível superior ou replicar o perfil Administrador Master.

| Nível | Perfil | Pode criar ou atribuir |
|---:|---|---|
| 5 | Administrador Master | Administrador Geral, Gestor de Setor, Editor de Projetos e Consulta; o próprio Master é exclusivo e não pode ser replicado |
| 4 | Administrador Geral | Gestor de Setor, Editor de Projetos e Consulta |
| 3 | Gestor de Setor | Editor de Projetos e Consulta |
| 2 | Editor de Projetos | Consulta |
| 1 | Consulta | Nenhum perfil |

## 2. Administrador Master

O **Administrador Master** é o nível máximo de administração e está reservado exclusivamente à conta proprietária vinculada ao e-mail `gustavocvc0810@gmail.com`. Ele possui controle integral da plataforma, incluindo conteúdo, estrutura, usuários, permissões, auditoria e configurações administrativas.

A exclusividade é aplicada no servidor: nenhuma outra conta pode receber o perfil, mesmo que tente enviar a alteração diretamente à API. O Back-Office apresenta o Master na matriz de permissões para fins de transparência, mas não oferece esse perfil como opção de criação ou replicação.

## 3. Administrador Geral

É o perfil administrativo amplo abaixo do Master. Possui acesso ao Back-Office e pode administrar áreas, projetos, setores, usuários, permissões, documentos, evidências, cronogramas, indicadores, visibilidade e registros de auditoria, respeitando a proteção da conta Master.

Também pode criar e alterar usuários de níveis inferiores. Por segurança, o Administrador Geral não pode criar, atribuir, alterar ou desativar a conta Master, nem remover o próprio perfil, desativar o próprio acesso ou alterar a própria proteção administrativa.

## 4. Gestor de Setor

Gerencia o acompanhamento dos projetos dos setores aos quais está vinculado. Pode editar projetos, etapas, marcos, indicadores, fotos e documentos dentro do escopo permitido pelo sistema.

Pode criar e administrar usuários com perfil Editor de Projetos ou Consulta, mas somente quando os vínculos estiverem relacionados aos seus próprios setores. Não pode criar outro Gestor de Setor, Administrador Geral ou Administrador Master. Também não visualiza usuários fora dos setores aos quais está vinculado.

## 5. Editor de Projetos

Executa alterações operacionais no conteúdo dos projetos, como atualização de etapas, cronogramas, marcos, indicadores, evidências fotográficas e documentos/materiais. Não administra usuários, setores, permissões ou configurações estruturais.

Pode criar usuários de Consulta, mas não pode criar outro Editor de Projetos, Gestor de Setor, Administrador Geral ou Administrador Master.

## 6. Consulta

Possui acesso somente para leitura. Pode consultar projetos, setores, indicadores, cronogramas, evidências, documentos, históricos e diagnósticos disponibilizados pelo sistema, mas não pode salvar alterações, cadastrar usuários ou modificar permissões.

## 7. Vínculos de setores

O vínculo de setores define o alcance administrativo do Gestor de Setor. Ao atribuir um Gestor, selecione um ou mais setores compatíveis. O sistema usa esses vínculos para limitar a visualização e as alterações de usuários e projetos.

Para Editores e usuários de Consulta, o perfil define principalmente a capacidade de editar ou consultar. A atribuição de setores pode ser usada pelo sistema para organizar o escopo, conforme a regra administrativa adotada.

## 8. Auditoria e segurança

Criações e alterações de perfis são registradas na auditoria com autor, usuário-alvo, ação, perfis, setores, status e data. A atribuição inicial do Administrador Master também foi registrada no histórico. Tentativas de atribuir um perfil igual ou superior, incluindo tentativas de replicar o Master, são registradas como **Tentativa bloqueada**, com o motivo da rejeição.

Na tela de auditoria, utilize os filtros de autor, tipo de ação e período para localizar rapidamente uma operação. Eventos bloqueados não significam que uma alteração foi realizada; significam que a tentativa foi recusada e registrada para rastreabilidade.

## 9. Orientação prática

Antes de criar ou editar um usuário, confirme o perfil necessário, selecione apenas os setores pertinentes e revise a matriz de permissões exibida no formulário. Se uma opção não aparecer, isso normalmente significa que a hierarquia do seu perfil não permite aquela atribuição. O perfil Master aparece apenas como referência institucional na matriz e não pode ser selecionado para outro usuário.

Em caso de dúvida sobre uma permissão, consulte o Administrador Master ou o Administrador Geral e verifique o registro correspondente na auditoria. Este guia não substitui normas internas, políticas de segurança ou decisões administrativas da instituição.

## 10. Resumo executivo e pontos de contato para suporte

O Portal de Acompanhamento de Projetos utiliza uma hierarquia de perfis para distribuir responsabilidades com segurança. O **Administrador Master** é o responsável exclusivo pela conta proprietária e pelas decisões de maior nível da plataforma. O **Administrador Geral** responde pela administração ampla do sistema, exceto pela conta Master. O **Gestor de Setor** é o ponto de apoio operacional para projetos e usuários vinculados aos seus setores. O **Editor de Projetos** deve ser procurado para dúvidas sobre atualização de etapas, cronogramas, indicadores, documentos, fotos e demais evidências. O perfil **Consulta** utiliza o portal para leitura e, quando identificar uma inconsistência, deve comunicar o responsável pelo setor ou a administração.

| Necessidade | Primeiro ponto de contato | Encaminhamento |
|---|---|---|
| Conta Master, segurança ou decisão administrativa máxima | Administrador Master | Registrar a solicitação e consultar a auditoria quando aplicável. |
| Acesso, perfil, usuário ou permissão operacional | Administrador Geral | Escalar ao Administrador Master quando envolver a conta proprietária ou a hierarquia máxima. |
| Projeto, etapa, marco ou indicador de um setor | Gestor de Setor | Encaminhar ao Editor de Projetos quando a alteração for operacional. |
| Documento, foto, cronograma ou evidência | Editor de Projetos | Escalar ao Gestor de Setor se houver dúvida de escopo ou aprovação. |
| Erro técnico, tela indisponível ou comportamento inesperado | Suporte Técnico do Portal | Informar rota, horário, usuário, ação realizada e mensagem apresentada. |
| Tentativa bloqueada ou suspeita de elevação de privilégio | Administrador Master, Administrador Geral e Suporte Técnico | Consultar o registro de auditoria e preservar a mensagem do sistema. |

Para solicitar suporte técnico, a equipe deve informar, sempre que possível, o nome do usuário, o perfil atribuído, o setor relacionado, a página acessada, a data e o horário aproximados, a operação realizada e uma captura ou transcrição da mensagem de erro. Não devem ser compartilhadas senhas, tokens, documentos pessoais ou outros dados sensíveis em canais não autorizados.

Este resumo utiliza contatos funcionais — **Administrador Master**, **Administrador Geral**, **Suporte Técnico do Portal** e **responsável pelo setor** — para permanecer válido mesmo quando houver mudança de pessoas ou equipes. Este documento continua sendo orientativo e não oficial; normas internas, políticas de segurança e decisões administrativas da instituição prevalecem sobre este guia.

---

# Matriz de KPIs dos projetos DPAT

_Arquivo de origem: `matriz_kpis_dpat.md`_

# Matriz de KPIs dos projetos DPAT

## Critério de utilização

Esta matriz foi construída para os projetos não concluídos da carteira DPAT. Os **valores iniciais iguais a zero não representam desempenho negativo**: indicam que ainda não há medição operacional registrada no portal. As metas abaixo são **propostas de gestão**, devendo ser ajustadas quando houver Plano de Ação, série histórica ou prazo formal aprovado.

| Código | Projeto | KPI | Fórmula ou critério | Unidade | Valor inicial | Meta proposta | Periodicidade | Evidência sugerida |
|---|---|---|---|---:|---:|---:|---|---|
| DPAT-001 | Imobiliário | Processos imobiliários com triagem concluída | Processos triados / processos recebidos | % | 0 | 100 | Mensal | Planilha ou relatório de processos |
| DPAT-001 | Imobiliário | Processos com documentação conferida | Processos conferidos / processos triados | % | 0 | 95 | Mensal | Checklist documental |
| DPAT-001 | Imobiliário | Prazo médio de encaminhamento | Soma dos dias até encaminhamento / processos encaminhados | dias | 0 | 15 | Mensal | Registro SEI ou controle de tramitação |
| DPAT-002 | Zeladoria | Diagnóstico de unidades concluído | Unidades diagnosticadas / unidades previstas | % | 0 | 100 | Mensal | Relatório de diagnóstico |
| DPAT-002 | Zeladoria | Fluxos e checklist validados | Entregáveis validados / entregáveis previstos | % | 0 | 100 | Mensal | Ata ou versão aprovada |
| DPAT-002 | Zeladoria | UREs capacitadas | UREs capacitadas / UREs previstas | % | 0 | 100 | Trimestral | Lista de presença e material de capacitação |
| DPAT-003 | ONR | Plano de Ação específico localizado | Plano localizado e anexado ao projeto | un | 0 | 1 | Mensal | Documento do Plano de Ação |
| DPAT-003 | ONR | Entregáveis do projeto definidos | Entregáveis definidos / entregáveis necessários | % | 0 | 100 | Mensal | Matriz de escopo |
| DPAT-003 | ONR | Documentos de referência classificados | Documentos classificados / documentos recebidos | % | 0 | 100 | Mensal | Índice documental |
| DPAT-004 | Integração SED-SAM | Fluxo atual mapeado | Etapas do fluxo mapeadas / etapas identificadas | % | 0 | 100 | Mensal | Fluxograma aprovado |
| DPAT-004 | Integração SED-SAM | Campos e regras de negócio definidos | Campos/regras definidos / itens previstos | % | 0 | 100 | Mensal | Especificação funcional |
| DPAT-004 | Integração SED-SAM | Piloto validado | Resultado do piloto aprovado | % | 0 | 100 | Mensal | Relatório de teste e aceite |
| DPAT-005 | Site Educação - DPAT | Conteúdos classificados | Materiais classificados / materiais identificados | % | 0 | 100 | Mensal | Inventário de conteúdos |
| DPAT-005 | Site Educação - DPAT | Conteúdos publicados e versionados | Conteúdos publicados / conteúdos aprovados | % | 0 | 100 | Mensal | URL, versão, data e responsável |
| DPAT-005 | Site Educação - DPAT | Usuários ou UREs atendidos | Acessos ou públicos atendidos no período | un | 0 | 100 | Mensal | Analytics ou registro de atendimento |
| DPAT-007 | SAM Estoque - Treinamento | Turmas ou sessões realizadas | Sessões realizadas / sessões planejadas | % | 0 | 100 | Mensal | Agenda e listas de presença |
| DPAT-007 | SAM Estoque - Treinamento | Participantes capacitados | Participantes capacitados / participantes previstos | % | 0 | 100 | Mensal | Lista de presença |
| DPAT-007 | SAM Estoque - Treinamento | Aproveitamento pós-treinamento | Participantes aprovados / participantes avaliados | % | 0 | 85 | Por turma | Avaliação ou formulário |
| DPAT-008 | Implantação (SAM Patrimônio) | Unidades com implantação concluída | Unidades implantadas / unidades previstas | % | 0 | 100 | Mensal | Termo ou relatório de implantação |
| DPAT-008 | Implantação (SAM Patrimônio) | Cadastros patrimoniais regularizados | Cadastros regularizados / cadastros selecionados | % | 0 | 95 | Mensal | Relatório do SAM |
| DPAT-008 | Implantação (SAM Patrimônio) | Pendências solucionadas | Pendências solucionadas / pendências abertas | % | 0 | 90 | Mensal | Relatório de pendências |
| DPAT-009 | Fluxo de Notebooks | Fluxo aprovado | Fluxo formalizado e aprovado | % | 0 | 100 | Mensal | Fluxograma e despacho de aprovação |
| DPAT-009 | Fluxo de Notebooks | Solicitações atendidas dentro do prazo | Solicitações no prazo / solicitações concluídas | % | 0 | 95 | Mensal | Registro de pedidos e entregas |
| DPAT-009 | Fluxo de Notebooks | Rastreabilidade das entregas | Entregas com termo e registro / entregas realizadas | % | 0 | 100 | Mensal | Termo de entrega e controle patrimonial |
| DPAT-010 | Manual de Gestão Patrimonial móvel | Capítulos elaborados | Capítulos elaborados / capítulos previstos | % | 0 | 100 | Mensal | Versão controlada do manual |
| DPAT-010 | Manual de Gestão Patrimonial móvel | Revisões concluídas | Revisões concluídas / revisões previstas | % | 0 | 100 | Mensal | Registro de revisão |
| DPAT-010 | Manual de Gestão Patrimonial móvel | Manual publicado e divulgado | Manual publicado e ações de divulgação concluídas | % | 0 | 100 | Mensal | URL, comunicado ou lista de divulgação |
| DPAT-011 | Manual de Gestão Patrimonial Imobiliária | Etapas do Plano de Ação concluídas | Etapas concluídas / etapas previstas | % | 0 | 100 | Mensal | Cronograma do projeto |
| DPAT-011 | Manual de Gestão Patrimonial Imobiliária | Conteúdo técnico validado | Seções validadas / seções previstas | % | 0 | 100 | Mensal | Matriz de validação |
| DPAT-011 | Manual de Gestão Patrimonial Imobiliária | Versão publicada | Manual aprovado e publicado | % | 0 | 100 | Mensal | Documento final |
| DPAT-012 | Manual de Almoxarifado | Procedimentos documentados | Procedimentos documentados / procedimentos previstos | % | 0 | 100 | Mensal | Manual e POPs |
| DPAT-012 | Manual de Almoxarifado | Validação com áreas concluída | Áreas que validaram / áreas previstas | % | 0 | 100 | Mensal | Ata ou registro de validação |
| DPAT-012 | Manual de Almoxarifado | Unidades orientadas | Unidades orientadas / unidades previstas | % | 0 | 100 | Trimestral | Comunicados e listas de presença |
| DPAT-013 | Depósitos Casa Verde e São Domingos | Diagnóstico físico concluído | Depósitos diagnosticados / depósitos previstos | % | 0 | 100 | Mensal | Relatório e registro fotográfico |
| DPAT-013 | Depósitos Casa Verde e São Domingos | Pendências de adequação tratadas | Pendências tratadas / pendências identificadas | % | 0 | 90 | Mensal | Plano de ação e evidências |
| DPAT-013 | Depósitos Casa Verde e São Domingos | Ocupação ou organização regularizada | Itens/áreas regularizados / itens/áreas avaliados | % | 0 | 95 | Mensal | Inventário e planta de ocupação |
| DPAT-014 | Procedimentos Operacionais Padrão | POPs elaborados | POPs elaborados / POPs previstos | % | 0 | 100 | Mensal | Repositório de POPs |
| DPAT-014 | Procedimentos Operacionais Padrão | POPs validados | POPs validados / POPs elaborados | % | 0 | 100 | Mensal | Registro de aprovação |
| DPAT-014 | Procedimentos Operacionais Padrão | POPs publicados com controle de versão | POPs publicados com data e responsável / POPs previstos | % | 0 | 100 | Mensal | Repositório versionado |
| DPAT-015 | Pílulas do Conhecimento | Pílulas produzidas | Pílulas produzidas / pílulas previstas | % | 0 | 100 | Mensal | Roteiro ou arquivo publicado |
| DPAT-015 | Pílulas do Conhecimento | Pílulas publicadas | Pílulas publicadas / pílulas produzidas | % | 0 | 100 | Mensal | URL ou registro de publicação |
| DPAT-015 | Pílulas do Conhecimento | Alcance das publicações | Visualizações ou acessos no período | un | 0 | 100 | Mensal | Analytics do portal |
| DPAT-016 | Municipalizações de São Paulo | Plano de Ação localizado e anexado | Plano localizado e anexado ao projeto | un | 0 | 1 | Mensal | Plano de Ação oficial |
| DPAT-016 | Municipalizações de São Paulo | Municípios ou frentes mapeados | Municípios/frentes mapeados / total previsto | % | 0 | 100 | Mensal | Matriz de municipalizações |
| DPAT-016 | Municipalizações de São Paulo | Marcos do cronograma cumpridos | Marcos cumpridos / marcos previstos | % | 0 | 100 | Mensal | Cronograma e atas |

## Regra de atualização

O valor de cada KPI deverá ser atualizado somente quando houver evidência correspondente. Quando não houver medição, o responsável deverá manter o valor inicial e registrar a justificativa na documentação operacional, evitando interpretar ausência de dado como ausência de execução.

---

# QA — Auditoria, matriz de permissões e escopo setorial

_Arquivo de origem: `qa-perfis-auditoria-2026-08-26.md`_

# QA — Auditoria, matriz de permissões e escopo setorial

## Evidências visuais

- Desktop (1280×720, `/admin`, captura full-page): a matriz de permissões aparece antes dos formulários, com tabela horizontalmente contida; a lista de usuários e o painel de auditoria permanecem dentro da composição institucional.
- Mobile (375×812, `/admin`, captura full-page): os blocos empilham-se verticalmente; a tabela da matriz usa rolagem horizontal interna e os cartões permanecem legíveis, sem exigir largura fixa da página.

## Evidências técnicas

- `pnpm test`: 13 arquivos e 46 testes aprovados.
- `pnpm check`: aprovado sem erros TypeScript.
- `pnpm build`: build de produção concluído; permaneceu apenas o aviso informativo de chunk JavaScript acima de 500 kB.
- Servidor de desenvolvimento ativo e sem erros TypeScript no health check.

---

# QA da carteira completa após a correção

_Arquivo de origem: `qa_carteira_completa_pos_correcao.md`_

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

---

# QA objetivo da carteira de projetos

_Arquivo de origem: `qa_carteira_projetos.md`_

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

---

# QA publicado — erro removeChild

_Arquivo de origem: `qa_removechild_publicado_2026-08-20.md`_

# QA publicado — erro removeChild

**URL:** https://projportal-vxnzxstr.manus.space/admin

Após a publicação da versão e o carregamento completo, a rota `/admin` renderizou sem tela de erro. A aba **Atualizar projeto** foi aberta, o seletor de projeto foi expandido e o registro **DPAT-002 · Projeto Zeladoria** foi selecionado. O formulário de atualização foi montado com status, modo de progresso, responsável, próximos passos, KPIs e cronograma de etapas visíveis. Até este ponto da sessão publicada, não houve nova exceção `NotFoundError/removeChild` nem queda no ErrorBoundary.

A validação final ainda exige executar o salvamento sem alteração de conteúdo, alternar as abas administrativas após o formulário estar montado e consultar o console/logs imediatamente depois.

## Resultado após o fluxo publicado

Após o carregamento, seleção do DPAT-002 e tentativa de salvamento, o console da sessão não registrou `removeChild`, erro de React ou rejeição de atualização. A consulta aos logs de produção em 2026-08-20T16:35Z retornou apenas inicializações normais do servidor e quatro mensagens `[Auth] Missing session cookie`, sem exceção DOM. A troca de aba acionada diretamente pelo DOM não alterou visualmente o painel na sessão com a camada de inspeção ativa; portanto, essa etapa deve ser repetida em uma sessão de navegador sem o overlay de inspeção para separar interferência do ambiente de teste de falha do portal.

---

# Referência de posição do botão Back-Office

_Arquivo de origem: `referencia_posicao_backoffice.md`_

# Referência de posição do botão Back-Office

A imagem fornecida indica que o botão deve ficar no canto superior direito da seção hero da Home, dentro do bloco escuro principal, acima do painel “Atualização em tempo real” e abaixo do cabeçalho institucional global. A marcação verde não indica a área da seção “Visão macro”; portanto, o botão deve ser movido do bloco branco de visão macro para a composição do hero, com alinhamento à direita e espaçamento seguro em relação ao cabeçalho e ao indicador de progresso.

## Validação visual

Após a implementação, o botão aparece no canto superior direito do hero, na mesma região indicada pela marcação verde. Em desktop ele permanece acima do indicador de progresso; em mobile fica abaixo do cabeçalho e acima do título, sem sobreposição ou transbordamento.

## Validação do rótulo da visão

O rótulo exibido abaixo do hero foi confirmado como “VISÃO GERAL” em desktop e mobile, mantendo o alinhamento, o espaçamento e a identidade visual da Home.

## Validação dos filtros e gráficos

A Home foi conferida em desktop e mobile. A Visão Geral apresenta quatro ações: projetos cadastrados, projetos em andamento, projetos concluídos e Gráficos. Os três primeiros mantêm a carteira como destino dos filtros, enquanto Gráficos aponta para a seção `#graficos`; os dashboards e a carteira permanecem visíveis e responsivos.

## Validação da exibição sob demanda

Na Home, o estado inicial foi conferido em desktop e mobile. Os cards de dashboards não são renderizados inicialmente; os botões de filtros e o botão “Gráficos” permanecem visíveis, e a carteira de projetos continua acessível. O botão “Gráficos” abre a seção condicional e a ação “Ocultar gráficos” retorna à carteira.

---

# Verificação operacional do ResizeObserver — 2026-08-19

_Arquivo de origem: `verificacao_resizeobserver_2026-08-19.md`_

# Verificação operacional do ResizeObserver — 2026-08-19

## Rotas verificadas

A Home (`https://3000-izf943s8gte2ic2np7kw5-74ca6c20.us3.manus.computer/`) carregou com 12 projetos cadastrados, 11 em andamento e 1 concluído, sem erro visual no carregamento observado. O `/admin` também carregou com a aba Atualizar projeto e o cronograma de etapas disponível.

## Controle de etapas

No DPAT-007 — SAM Estoque - Treinamento, o cronograma apresentou sete dropdowns com as opções Em branco (0%), Em andamento (50%) e Concluído (100%). Uma etapa foi alterada temporariamente para Em andamento (50%), a interface confirmou “Status da etapa atualizado” e a etapa passou a exibir Peso: 50%, comprovando a atualização automática pelo controle.

## Evidência

A verificação ocorreu na sessão autenticada administrativa, com a rota `/admin` carregando o formulário de atualização e o cronograma. A etapa deverá ser restaurada para Em branco (0%) antes da conclusão do teste, para não deixar alteração temporária no projeto.

Fonte: portal local publicado em `https://3000-izf943s8gte2ic2np7kw5-74ca6c20.us3.manus.computer/`.

---

# Visibilidade de áreas e projetos no Back-Office

_Arquivo de origem: `visibilidade_backoffice.md`_

# Visibilidade de áreas e projetos no Back-Office

A seção **Visibilidade** do Back-Office permite ocultar temporariamente áreas e projetos sem excluir registros ou os documentos, KPIs, cronogramas, marcos e fotos associados.

## Comportamento público

Áreas e projetos marcados como ocultos não aparecem na Home, nos dashboards, nas carteiras, nos filtros públicos nem nos detalhes acessados diretamente por URL. A regra é aplicada no backend, e não apenas na interface, para evitar exposição por acesso direto.

## Administração

Administradores podem alternar entre **Todos**, **Visíveis** e **Ocultos**. Projetos ocultos continuam disponíveis no seletor de atualização e na aba de Visibilidade. Áreas ocultas podem ser editadas e reativadas pela mesma tela.

A ação **Reativar** restaura a visibilidade pública do item sem modificar seus demais dados. A ação **Ocultar** é reversível e não realiza exclusão física.

## Permissões e persistência

As operações de listagem administrativa, edição, ocultação e reativação usam procedimentos protegidos por perfil de administrador. O estado é persistido nos campos `isHidden` das tabelas de áreas e projetos, com valor padrão `false` para os registros existentes.

---

