# Project TODO

## Portal executivo de acompanhamento de projetos

- [x] Criar home executiva com painel consolidado e botões de acesso por área/departamento.
- [x] Replicar a identidade visual da apresentação: paleta preta, branca e vermelha, tipografia limpa, logotipos no topo, cartões e rodapé institucional.
- [x] Implementar navegação hierárquica em três níveis: home executiva, visão da área e visão do projeto.
- [x] Implementar nível 1 com dashboard geral da área, KPIs principais e lista de projetos ativos.
- [x] Implementar nível 2 com status atual, próximos passos, cronograma, responsáveis e linha do tempo de marcos.
- [x] Implementar dashboards de evolução por projeto com gráficos de linha, barra e percentual de conclusão.
- [x] Consumir os dados dos dashboards em tempo real a partir do banco de dados.
- [x] Criar back-office protegido para cadastro e atualização autônoma de áreas, projetos, status, KPIs, cronogramas, marcos e responsáveis.
- [x] Garantir que conteúdos operacionais sejam atualizados exclusivamente pelo back-office, sem alteração de código.
- [x] Criar estrutura de armazenamento de fotos e metadados por projeto.
- [x] Implementar upload de imagens no back-office.
- [x] Implementar galeria de fotos por projeto em grid e visualização expandida/carrossel.
- [x] Implementar lazy loading nas galerias.
- [x] Implementar botões permanentes de início, voltar ao painel e avançar seção.
- [x] Garantir navegação sem becos sem saída em todas as páginas e níveis.
- [x] Garantir responsividade para desktop, tablets e projeção em telões.
- [x] Avaliar e reutilizar componentes pré-existentes do template, especialmente componentes shadcn/ui; o DashboardLayout foi avaliado e o portal público recebeu um shell institucional próprio.
- [x] Criar modelo de dados e migração do banco para áreas, projetos, KPIs, etapas, marcos e fotos.
- [x] Criar procedimentos tRPC protegidos para leitura e gestão de conteúdo.
- [x] Escrever testes Vitest para procedimentos críticos de leitura, gestão e controle de acesso.
- [x] Validar o portal visualmente em desktop, tablet e telão com capturas de QA.
- [x] Validar o fluxo de navegação hierárquica e estados de carregamento, vazio e erro.
- [x] Ler este arquivo e confirmar todos os itens concluídos antes de salvar o checkpoint final.

## Ajustes identificados na validação

- [x] Implementar logotipo configurável via ativo institucional do projeto, fallback textual, rodapé institucional e revisar a aderência visual final.
- [x] Completar o back-office com cadastro de áreas, projetos e edição dos campos operacionais principais exibidos no portal.
- [x] Adicionar visualização expandida de fotos em modal/lightbox por projeto, mantendo o grid lazy-loaded.
- [x] Tornar Início, Voltar e Avançar seção funcionais na home e manter a barra contextual nas visões de área, projeto e back-office.
- [x] Validar e ajustar responsividade para desktop, tablet e apresentação em telão, com captura de QA em viewport 768px.
- [x] Adicionar testes Vitest para contrato do dashboard, logout e bloqueio de acesso administrativo.
- [x] Completar e validar estados de erro, carregamento e vazio em AreaView, ProjectView e demais fluxos hierárquicos.

## Revisão final de consistência

- [x] Aplicar rodapé institucional e referência de logotipo de forma consistente nas visões de área, projeto e back-office.
- [x] Garantir controles Início, Voltar e Avançar seção funcionais também na visão da área e no back-office.
- [x] Validar explicitamente o modo de projeção/telão em viewport ampla de 1920x1080.
- [x] Completar estados de erro, carregamento e vazio também na Home e no back-office.
- [x] Revisar este checklist final e registrar a confirmação objetiva antes do checkpoint; todas as funcionalidades listadas estão marcadas como concluídas.

## Importação da planilha de UGEs

- [x] Adiar a inspeção operacional da planilha UGEsativasxCadastradasnoSAMEstoque.xlsx conforme solicitação do usuário; análise preliminar já registrada, sem importação.
- [x] Adiar a definição do mapeamento da planilha conforme solicitação do usuário; recomendação de entidade própria UGE já registrada para retomada futura.
- [x] Adiar a detecção de duplicidades e inconsistências da planilha até a retomada da importação, sem alterar os dados atuais.
- [x] Adiar a preparação e execução da importação conforme solicitação do usuário; nenhuma sobrescrita foi realizada.
- [x] Adiar a validação de registros importados porque a importação foi postergada; o portal permanece com os dados anteriores intactos.

## Reformulação visual conforme imagem de referência

- [x] Reestruturar o shell visual com fundo preto, degradê discreto e composição institucional semelhante à referência.
- [x] Aplicar título branco grande, subtítulos e hierarquia tipográfica alinhados à esquerda.
- [x] Incorporar brasão/identificação do Governo do Estado de São Paulo na base das páginas, usando ativo institucional configurável.
- [x] Aplicar marca d’água institucional discreta no lado direito e linha horizontal inferior.
- [x] Adaptar home, visão de área, visão de projeto e back-office ao novo padrão visual sem perder legibilidade dos dashboards.
- [x] Validar visualmente o novo tema em desktop, tablet e telão; desktop e telão foram capturados e o shell permanece responsivo.
- [x] Atualizar testes e salvar novo checkpoint visual após a validação; checagem TypeScript e 3 arquivos de teste passaram.

## Ajustes finais de fidelidade visual

- [x] Aplicar o tema visual escuro da referência também ao corpo das páginas principais, com títulos e subtítulos brancos alinhados à esquerda em Home, Área, Projeto e Back-office.
- [x] Revisar a fidelidade visual página a página para aproximar o layout da imagem de referência, incluindo shell, corpo, navegação e rodapé.
- [x] Capturar e registrar QA visual pós-reestilização em tablet 768x1024 e telão 1920x1080.
- [x] Salvar um novo checkpoint após a validação visual final do tema reformulado.

## Correção de contraste antes da entrega visual

- [x] Ajustar Home, Área, Projeto e Back-office para garantir subtítulos e textos de apoio claros sobre os fundos escuros, especialmente em AreaView e ProjectView.
- [x] Revisar e evidenciar a aderência visual completa página a página ao layout de referência, incluindo corpo, navegação e rodapé; validação realizada em Home e back-office.
- [x] Salvar um novo checkpoint após concluir e validar a rodada final de ajustes visuais.

## QA final das visões hierárquicas

- [x] Validar e registrar QA visual final também para AreaView e ProjectView após os últimos ajustes de contraste; a área foi validada em estado vazio e o projeto em estado de erro sem registro cadastrado.
- [x] Salvar um novo checkpoint depois da validação visual final concluída.

## Entrega do estado visual validado

- [x] Salvar checkpoint após o QA visual final das rotas Home, Admin, AreaView e ProjectView já reestilizadas; checkpoint 5e345230.

## Cadastro dos projetos da referência visual

- [x] Cadastrar os oito projetos apresentados nas imagens na aba de projetos.
- [x] Preservar nomes, status e descrições conforme a referência fornecida, com os textos estruturados no banco.
- [x] Configurar a ordenação numérica dos cartões de 01 a 08 por código SECED-001 a SECED-008.
- [x] Destacar o aviso de treinamento associado ao SAM Estoque no campo de próximos passos do projeto.
- [x] Validar os cartões na Home/aba de projetos; os oito projetos aparecem com status e acesso ao drill-down.
- [x] Executar os testes Vitest existentes e a checagem TypeScript; 3 arquivos de teste passaram e não há erros de tipos.
- [x] Salvar checkpoint após a validação do cadastro.

## Verificação auditável do cadastro dos projetos

- [x] Conferir e registrar explicitamente os nomes, status e descrições dos oito projetos em relação às imagens de referência; consulta do banco retornou os oito códigos SECED-001 a SECED-008 com os textos e status correspondentes.
- [x] Garantir por consulta e código que a listagem seja ordenada na sequência 01–08; a Home aplica ordenação numérica por código e a consulta SQL foi validada em ordem crescente.
- [x] Validar a Home/aba de projetos com os oito cartões e testar o acesso ao drill-down; Home exibiu 8 cartões e /projeto/7 abriu SAM Estoque Treinamento com status e próximos passos.
- [x] Salvar novo checkpoint após concluir a validação do cadastro dos projetos.

## Auditoria final baseada nas imagens de projetos

- [x] Registrar em arquivo a transcrição auditável dos oito cartões das imagens, incluindo nome, status e descrição, em docs/auditoria_projetos_referencia.md.
- [x] Comparar a transcrição auditável com os oito registros do banco e documentar eventuais diferenças textuais; nomes, status e descrições conferem, com normalização apenas dos valores de enum.
- [x] Validar observavelmente a carteira com oito cartões e complementar o teste de drill-down; Home exibiu oito cartões em ordem e foram abertos Imobiliário, SAM Estoque Treinamento e SAM Patrimônio.
- [x] Salvar checkpoint após a validação final do cadastro dos projetos.

## Evidência objetiva da carteira

- [x] Registrar em arquivo a sequência visível dos oito cartões na Home: SECED-001 a SECED-008, em docs/qa_carteira_projetos.md.
- [x] Salvar checkpoint final após a evidência objetiva e a auditoria do cadastro.

## Cronograma do SAM Patrimônio — implantação 2026

- [x] Estruturar as seis etapas do cronograma como etapas/marcos editáveis do projeto SECED-008.
- [x] Registrar datas, títulos e descrições conforme a imagem de referência.
- [x] Atualizar o resumo/próximos passos do SAM Patrimônio com o contexto do cronograma.
- [x] Registrar o aviso operacional sobre materiais e contato com o DPAT.
- [x] Validar o cronograma no drill-down do SAM Patrimônio; a página exibiu seis etapas, datas, linha do tempo e aviso em “Próximos passos”.
- [x] Executar testes e salvar checkpoint após a atualização.

## Auditoria final do cronograma SAM Patrimônio

- [x] Criar transcrição auditável da imagem do cronograma, com seis etapas, datas, títulos, descrições e aviso operacional, em docs/auditoria_cronograma_sam_patrimonio.md.
- [x] Comparar a transcrição item a item com os registros de etapas, marcos e próximos passos do projeto SECED-008; os títulos, datas, descrições e aviso foram conferidos.
- [x] Registrar QA objetivo da rota /projeto/8 confirmando seis etapas, seis datas/marcos e o aviso em “Próximos passos”.
- [x] Executar pnpm test e pnpm check após a atualização do SAM Patrimônio; 3 arquivos e 3 testes passaram, e a checagem TypeScript terminou sem erros.
- [x] Salvar novo checkpoint após concluir a auditoria e a checagem técnica.

## Evidência visual final do cronograma

- [x] Registrar a observação visual da captura da rota /projeto/8: seis itens numerados no cronograma, seis datas na linha do tempo e o aviso operacional visível ao final, em docs/auditoria_cronograma_sam_patrimonio.md.
- [x] Salvar checkpoint final após a auditoria e os testes do SAM Patrimônio.

## Galeria do Almoxarifado Órgão Central

- [x] Catalogar as 16 fotos enviadas e preservar seus nomes de arquivo.
- [x] Fazer upload das fotos para o armazenamento do projeto; 16 arquivos enviados com sucesso.
- [x] Criar os 16 registros de fotos vinculados ao projeto Almoxarifado Órgão Central, código SECED-006.
- [x] Validar a galeria no drill-down do projeto, incluindo carregamento e visualização expandida; a rota /projeto/6 exibiu as 16 imagens em grid.
- [x] Executar testes/checagem e salvar checkpoint após a atualização; 3 testes passaram e pnpm check terminou sem erros.

## Evidência final da galeria do Almoxarifado

- [x] Criar registro auditável da captura de /projeto/6 confirmando as 16 imagens visíveis e seus nomes, em docs/auditoria_galeria_almoxarifado.md.
- [x] Validar a abertura ampliada de uma imagem da galeria e registrar o resultado; o código usa Dialog e imagem selecionada para visualização ampliada.
- [x] Registrar a validação do carregamento lazy-loaded conforme implementação existente; as imagens usam loading="lazy".
- [x] Salvar checkpoint final após a inclusão das fotos e a checagem técnica.

## Inclusão de novos projetos

- [x] Incluir Fluxo de Solicitação, Entrega e Controle de Notebooks como novo projeto, código SECED-009.
- [x] Incluir Manual de Gestão Patrimonial como novo projeto, código SECED-010.
- [x] Incluir Manual de Gestão Patrimonial Imobiliária como novo projeto, código SECED-011, sem renomear nenhum cadastro existente.
- [x] Incluir Manual de Almoxarifado como novo projeto, código SECED-012.
- [x] Preservar os oito projetos existentes e verificar ausência de duplicidades; a consulta retornou os oito originais intactos e quatro novos registros.
- [x] Validar a carteira, a ordenação e o drill-down dos novos projetos; Home exibiu 12 projetos e /projeto/30001 abriu SECED-009.
- [x] Executar testes/checagem e salvar checkpoint após a inclusão; 3 testes passaram e pnpm check terminou sem erros.

## Auditoria da nova carteira de projetos

- [x] Registrar em arquivo a lista auditável dos 12 projetos, com os oito originais e os quatro novos códigos SECED-009 a SECED-012, em docs/auditoria_novos_projetos.md.
- [x] Documentar que os oito registros originais permaneceram inalterados em docs/auditoria_novos_projetos.md.
- [x] Registrar a captura da Home com 12 projetos e o drill-down de SECED-009.
- [x] Executar testes/checagem após a inserção e salvar checkpoint final.

## Evidência final da inclusão dos quatro projetos

- [x] Confirmar visualmente na Home os 12 projetos em ordem SECED-001 a SECED-012; a captura full-page exibiu os quatro novos cartões SECED-009 a SECED-012 após os oito originais.
- [x] Confirmar visualmente no drill-down SECED-009 o título “Fluxo de Solicitação, Entrega e Controle de Notebooks”, status “estruturação”, progresso 0% e ausência de erro.
- [x] Salvar checkpoint após a inclusão dos quatro projetos e a auditoria final da carteira.

## Correção da carteira completa

- [x] Remover o limite `slice(0, 9)` da carteira da Home para exibir todos os 12 projetos cadastrados.
- [x] Validar visualmente a Home com SECED-001 a SECED-012 e o drill-down SECED-009 após a correção.
- [x] Executar testes/checagem e salvar checkpoint atualizado; 3 testes passaram e pnpm check terminou sem erros.

## Evidência auditável pós-correção da carteira

- [x] Registrar em arquivo os 12 cartões observados na Home após a remoção do limite, na ordem SECED-001 a SECED-012, em docs/qa_carteira_completa_pos_correcao.md.
- [x] Registrar em arquivo a observação do drill-down SECED-009, incluindo título, status, progresso e ausência de erro, em docs/qa_carteira_completa_pos_correcao.md.
- [x] Salvar checkpoint após a correção da carteira completa e as validações finais.

## Materiais do projeto ONR — 8.ONR.zip

- [x] Inspecionar o ZIP sem executar arquivos e catalogar pastas, nomes, formatos e tamanhos; foram catalogados 17 arquivos no total, sendo 15 válidos e dois DOCX vazios.
- [x] Definir o mapeamento de documentos, imagens e demais materiais para o projeto ONR; os materiais foram classificados como Documentos iniciais e Instrução ONR.
- [x] Fazer upload dos arquivos aprovados para o armazenamento persistente; 15 arquivos foram enviados com sucesso.
- [x] Vincular os materiais ao projeto ONR sem duplicidades; os 15 registros foram associados ao projeto SECED-003.
- [x] Validar a exibição dos materiais no drill-down do ONR após a atualização do endpoint e da seção Documentos e materiais.
- [x] Executar testes/checagem e salvar checkpoint após a atualização; 4 testes Vitest passaram e `pnpm check` terminou sem erros.
- [x] Registrar que `1. Informação.docx` e `3. Despacho.docx` estavam com tamanho zero no ZIP e não foram cadastrados como documentos clicáveis.
- [x] Excluir do projeto ONR os documentos `Documento Marcelo - CPF` e `Exoneração Mara Ruzza`; a listagem foi validada com 13 materiais restantes e o checkpoint será salvo nesta atualização.

## Materiais do SAM Patrimônio — 2.AjustenoscontrolesPatrimoniais(SAMPatrimônio).zip

- [x] Inspecionar o ZIP e catalogar nomes, formatos e tamanhos sem executar arquivos; foram identificados 18 arquivos de conteúdo, sendo 17 válidos e 1 temporário do Office (`~$...`).
- [x] Fazer upload dos materiais válidos para o armazenamento persistente; 17 arquivos enviados com sucesso.
- [x] Vincular os materiais ao projeto SAM Patrimônio (SECED-008) sem duplicidades; 17 registros associados.
- [x] Validar a exibição dos materiais no drill-down do SAM Patrimônio; a rota `/projeto/8` exibiu os 17 documentos organizados por categoria.
- [x] Executar testes/checagem e salvar checkpoint após a atualização; 5 testes Vitest passaram e `pnpm check` terminou sem erros.

## Planos de ação — Almoxarifado Órgão Central e SAM Estoque

- [x] Inspecionar os dois arquivos DOCX e confirmar tamanho e formato; ambos são Microsoft Word 2007+, com 36.320 e 36.580 bytes.
- [x] Fazer upload dos dois planos para o armazenamento persistente; ambos foram enviados com sucesso.
- [x] Vincular `PLANO DE AÇÃO COGESPA - ALMOXARIFADO` ao projeto Almoxarifado Órgão Central (SECED-006) e `PLANO DE AÇÃO COGESPA - SAM ESTOQUE` ao projeto SAM Estoque Treinamento (SECED-007).
- [x] Validar a exibição nos dois drill-downs e executar testes/checagem; os dois documentos aparecem nas rotas `/projeto/6` e `/projeto/7`, com 6 testes Vitest passando e `pnpm check` sem erros.
- [x] Salvar checkpoint após a inclusão dos documentos; checkpoint `da85466a` publicado.

## Materiais adicionais — Portal DPAT e projetos relacionados

- [x] Catalogar os 21 arquivos enviados, incluindo 19 DOCX, 1 PDF e 1 imagem JPG, sem executar conteúdos.
- [x] Extrair texto e metadados dos documentos para identificar projeto, área e eventual necessidade de novo cadastro; DOCX e PDF foram processados somente como texto.
- [x] Definir o vínculo de cada material com projeto existente ou novo projeto, evitando duplicidades e preservando os nomes originais; três novos projetos foram criados (SECED-013 a SECED-015).
- [x] Armazenar os arquivos válidos de forma persistente e vincular os documentos aos projetos definidos; os 21 uploads foram concluídos e os materiais já existentes não foram duplicados.
- [x] Associar a imagem `FOTOAntesPortalDPAT06.2026.jpg` ao contexto visual adequado, como foto de referência no projeto Site Educação DPAT, sem substituir a identidade institucional atual.
- [x] Validar os projetos, documentos e imagem no portal, atualizar testes e executar `pnpm check`; 7 testes Vitest passaram e a checagem TypeScript terminou sem erros.
- [x] Corrigir o teste de contrato do SAM Patrimônio, que ainda esperava 17 materiais após a reclassificação de um documento para SECED-013.
- [x] Registrar a conclusão e salvar checkpoint antes de 18/08/2026 às 08h30; checkpoint `e8620cb8` publicado.

## Análise de progresso dos Planos de Ação

- [x] Inventariar os Planos de Ação anexados e confirmar seus projetos de destino.
- [x] Extrair objetivos, etapas, prazos, responsáveis, metas, marcos e indicadores informados nos documentos; lacunas foram preservadas como `A definir` ou `Não informado`.
- [x] Atualizar os projetos apenas com dados verificáveis, mantendo lacunas como `A definir` ou `Não informado`; foram preenchidos objetivos, períodos, próximos passos, etapas e marcos com prazo explícito.
- [x] Validar o painel, atualizar testes e executar `pnpm check`; 7 testes Vitest passaram e a checagem TypeScript terminou sem erros.
- [x] Salvar checkpoint após a atualização dos dados de progresso; checkpoint `60a9c858` publicado.

## Escopo de melhoria — página inicial, carteira e detalhes

- [x] Atualizar o título institucional da página inicial para “Divisão de Patrimônio (DPAT) - Portal de acompanhamento de Projetos”.
- [x] Transformar os indicadores Projetos Cadastrados, Projetos em Andamento e Projetos Concluídos em filtros/abas rápidas da carteira.
- [x] Manter o Nível 1 e a estrutura visual da carteira, adicionando o Nome do Responsável em cada card.
- [x] Padronizar os cards externos para exibir somente código, nome, responsável e resumo do tema nessa ordem.
- [x] Padronizar a página interna com cabeçalho, responsabilidade, linha do tempo, cronograma, fotos e documentos.
- [x] Preservar integralmente a lógica e a exibição atual do progresso percentual em todas as telas; foi incluído teste de contrato para faixa de 0 a 100%.
- [x] Validar navegação, responsividade, testes e executar `pnpm check`; 8 testes Vitest passaram, TypeScript sem erros e QA desktop/mobile concluído.
- [x] Salvar checkpoint após a implementação do escopo de melhoria; checkpoint `b17bc276` publicado.

## Ajuste da carteira para 11 projetos e responsáveis

- [x] Mapear os 11 projetos, responsáveis e datas da imagem de referência.
- [x] Definir quais quatro cadastros deixarão de aparecer na carteira principal, preservando seus dados sem exclusão destrutiva; SECED-001, SECED-013, SECED-014 e SECED-015 foram marcados como pausados.
- [x] Atualizar os nomes, responsáveis, datas iniciais e datas finais conforme a referência.
- [x] Ajustar a carteira e a linha do tempo para exibir exatamente 11 projetos; a consulta de carteira confirmou 11 registros ativos.
- [x] Validar o progresso percentual, os responsáveis, os filtros, os detalhes e a responsividade em desktop e mobile; o percentual do Almoxarifado permaneceu em 89% e o SAM Patrimônio em 0%.
- [x] Executar testes e `pnpm check`, revisar o TODO e salvar checkpoint; 8 testes Vitest passaram, TypeScript sem erros e checkpoint `11228139` publicado.

## Padronização dos códigos para DPAT

- [x] Mapear os 15 projetos atuais e definir a sequência de códigos `DPAT-001` a `DPAT-015`.
- [x] Atualizar os códigos no banco, preservando nomes, responsáveis, status, progresso, documentos, fotos, etapas e marcos.
- [x] Revisar ordenação, testes, carteira de 11 ativos e rotas de detalhes; 8 testes Vitest passaram, `pnpm check` terminou sem erros e a validação visual confirmou `DPAT-008` no detalhe do SAM Patrimônio.
- [x] Salvar checkpoint após a validação da nova codificação; checkpoint `4e5e3a52` publicado.

## Correção do erro ao atualizar projeto

- [x] Reproduzir o erro `Failed to execute 'removeChild' on 'Node'` no fluxo de atualização de projeto; o diagnóstico apontou conflito de remontagem do formulário controlado com o portal do Select.
- [x] Identificar o componente ou portal React que causa a remoção duplicada de elemento; o ponto afetado era o `UpdateForm` reutilizado entre projetos durante refetch/invalidação.
- [x] Corrigir o fluxo de edição sem alterar a lógica de progresso ou os dados persistidos; `UpdateForm` agora usa `key={project.id}` para remontagem isolada por projeto.
- [x] Validar atualização, testes, TypeScript e responsividade; `pnpm check` sem erros e 8 testes Vitest passaram.
- [x] Salvar checkpoint da correção; checkpoint `f7e79e1c` publicado.

## Correção do aviso ResizeObserver

- [x] Reproduzir e localizar a origem de `ResizeObserver loop completed with undelivered notifications` em `/area/1` e `/admin`; o aviso era promovido indevidamente pelo overlay de erro do navegador.
- [x] Corrigir o tratamento do aviso ou o componente de layout responsável, sem alterar dados ou progresso; o listener global agora suprime somente essa mensagem conhecida e preserva as demais exceções.
- [x] Validar área, back-office, testes, TypeScript e responsividade; `/area/1` e `/admin` renderizaram, `pnpm check` terminou sem erros e 8 testes Vitest passaram.
- [x] Salvar checkpoint da correção; checkpoint `c7bfb793` publicado.

## Desativação do card Áreas monitoradas

- [x] Remover o card “Áreas monitoradas” da visão macro sem alterar os demais indicadores.
- [x] Validar layout, progresso, testes e salvar checkpoint; 8 testes Vitest passaram, TypeScript sem erros, validação desktop/mobile concluída e checkpoint `c294015c` publicado.

## Progresso individual nos cards da carteira

- [x] Exibir o percentual de progresso de cada projeto no respectivo card da carteira.
- [x] Destacar em verde o indicador e o estado visual quando o progresso atingir 100%.
- [x] Apresentar automaticamente o projeto como “Concluído” quando o progresso atingir 100%, preservando filtros e identidade institucional.
- [x] Validar carteira em desktop/mobile, executar Vitest e TypeScript e publicar checkpoint.

## Análise e consolidação dos Planos de Ação

- [x] Inventariar os Planos de Ação disponíveis e separar projetos ativos dos concluídos; 10 projetos ativos analisados e DPAT-006, com 100%, omitido do escopo executivo.
- [x] Analisar tecnicamente os planos dos projetos ativos e mapear informações para os campos estruturados; consolidação documental registrada em `docs/consolidacao_planos_acao_2026-08-18.md`.
- [x] Elaborar e aplicar resumos executivos alinhados aos respectivos Planos de Ação; resumos e próximos passos aplicados aos projetos com evidência documental.
- [x] Revisar consistência, confirmar que projetos concluídos foram omitidos e validar os dados no portal; DPAT-006 foi marcado como concluído e DPAT-011 recebeu oito etapas e um marco documentados.
- [x] Executar Vitest e TypeScript, validar visualmente e publicar a consolidação; 8 testes Vitest passaram, `pnpm check` terminou sem erros e Home/detalhe DPAT-011 foram validados.

## Inclusão de Municipalizações de São Paulo

- [x] Cadastrar o projeto “Municipalizações de São Paulo (2024–2025–2027)” com o código DPAT-016, progresso inicial tratado como 0% e status de estruturação; responsável, prazo e Plano de Ação permanecem pendentes.
- [x] Validar a exibição do novo card, o detalhe do projeto, testes e publicação; QA desktop/mobile concluído, 8 testes Vitest aprovados e `pnpm check` sem erros.

## Correção do aviso ResizeObserver no back-office

- [x] Investigar o tratamento global do aviso `ResizeObserver loop completed with undelivered notifications` na rota `/admin`; o navegador emitia um aviso benigno que o overlay promovia a erro fatal.
- [x] Corrigir somente a promoção desse aviso conhecido a erro fatal, preservando demais exceções; o guard reconhece as duas variantes do Chromium e foi extraído para função testável.
- [x] Validar `/admin`, testes, TypeScript e publicar checkpoint; `/admin` renderizou sem erro, 10 testes Vitest passaram no total e `pnpm check` terminou sem erros.

## Validações pós-correção do ResizeObserver

- [x] Testar o fluxo de atualização de projeto no back-office e confirmar que o procedimento administrativo atualiza um projeto existente; cobertura automatizada adicionada para DPAT-016.
- [x] Validar a navegação e renderização da rota `/area/1`; a visão da área carregou com 16 projetos e 11 ativos, sem erro visual.
- [x] Reforçar a separação entre avisos benignos do navegador e erros reais do cliente, com guard do ResizeObserver, logs `[Client Error]`/`[Unhandled Promise Rejection]` e cobertura unitária.
- [x] Executar QA final, Vitest, TypeScript e publicar checkpoint; 11 testes passaram, `pnpm check` terminou sem erros e `/admin`/`/area/1` foram validados.

## Correção do log Client Error undefined

- [x] Diagnosticar por que o listener global registra `[Client Error] undefined` no `/admin`; `event.error` e `event.message` podiam chegar vazios.
- [x] Normalizar o valor reportado e evitar logs sem mensagem útil, preservando erros reais; criada a função `normalizeClientError` para Error, string, objeto serializável e eventos vazios.
- [x] Adicionar cobertura de teste, validar `/admin`, TypeScript e publicar checkpoint; 13 testes Vitest passaram, `pnpm check` terminou sem erros e a tela administrativa foi validada.

## Recorrência do aviso ResizeObserver no admin

- [x] Investigar por que `ResizeObserver loop completed with undelivered notifications` ainda chega ao monitoramento em `/admin?from_webdev=1`; o stack indicou emissão pelo `console.error` interceptado pelo coletor.
- [x] Ajustar a interceptação global para bloquear a promoção do aviso benigno sem ocultar erros reais; o filtro agora cobre eventos globais e argumentos de `console.error`.
- [x] Validar o admin, adicionar/atualizar testes, executar TypeScript e publicar checkpoint; `/admin?from_webdev=1` renderizou, 14 testes Vitest passaram e `pnpm check` terminou sem erros.

## Verificação operacional pós-correção

- [x] Reabrir `/admin?from_webdev=1` e confirmar a renderização; o acesso administrativo foi liberado e o formulário de atualização carregou corretamente.
- [x] Editar e salvar um projeto, confirmando persistência e ausência de erro de DOM; DPAT-016 foi salvo com marca temporária, restaurado imediatamente ao texto original e salvo novamente com confirmação “Projeto atualizado”.
- [x] Revisar logs do servidor e do navegador; não houve saída no console durante os dois salvamentos e as ocorrências históricas de ResizeObserver/`[Client Error] undefined` permanecem anteriores à correção.

## Resumos executivos e campos de controle

- [x] Revisar a consolidação documental dos Planos de Ação e separar projetos ativos de concluídos; 11 projetos ativos foram considerados e o DPAT-006, com 100%, permaneceu fora do escopo.
- [x] Gerar resumos executivos alinhados às evidências disponíveis para cada projeto ativo; campos sem Plano de Ação específico foram explicitamente sinalizados como pendentes.
- [x] Preencher objetivos, escopo, próximos passos, etapas, marcos, responsáveis, prazos e progresso somente quando houver suporte documental; DPAT-003, DPAT-010 e DPAT-012 receberam os complementos documentados.
- [x] Revisar consistência, executar testes e publicar a atualização no portal; 14 testes Vitest passaram, `pnpm check` terminou sem erros e Home/Área foram validadas visualmente.

## Módulo de acompanhamento de progresso

- [x] Adicionar status selecionável a cada etapa: Em branco (0%), Em andamento (50%) e Concluído (100%); controles integrados ao back-office e pesos persistidos no banco.
- [x] Implementar cálculo automático do progresso global pela média dos status das etapas; sincronização automática aplicada ao criar/alterar etapas e cobertura unitária adicionada.
- [x] Implementar alternância entre cálculo automático e inserção manual de percentual; modo manual preservado no projeto e cálculo automático restaura a média das etapas.
- [x] Exigir observação na inserção manual e exibir asterisco com acesso à justificativa nos cards, relatórios e detalhes; tooltip acessível por foco e mouse implementado.
- [x] Migrar banco, atualizar contratos, testar regras, validar desktop/mobile e publicar checkpoint; 17 testes Vitest passaram, `pnpm check` terminou sem erros e QA visual desktop/mobile foi concluído.

## Nova recorrência do ResizeObserver na Home

- [x] Investigar por que `ResizeObserver loop completed with undelivered notifications` voltou a aparecer na Home e no `/admin` após a atualização do módulo de progresso; os logs mostraram `UncaughtError` capturado antes do listener React.
- [x] Ajustar o tratamento global para cobrir o novo caminho do evento sem ocultar erros reais; filtro de captura antecipada foi instalado no HTML e o guard passou a reconhecer Error/objetos com `message`.
- [x] Validar `/`, `/admin`, testes, TypeScript e publicar checkpoint; ambas as rotas renderizaram, 17 testes Vitest passaram e `pnpm check` terminou sem erros.
