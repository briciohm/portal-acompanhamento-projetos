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

- [ ] Inspecionar a planilha UGEsativasxCadastradasnoSAMEstoque.xlsx e identificar abas, colunas, tipos e quantidade de registros.
- [ ] Definir o mapeamento entre os campos da planilha e as entidades do portal.
- [ ] Detectar registros duplicados, linhas vazias e inconsistências antes da importação.
- [ ] Preparar e executar a importação sem sobrescrever dados existentes indevidamente.
- [ ] Validar os registros importados no banco, na interface e nos testes automatizados.

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

- [ ] Salvar checkpoint após o QA visual final das rotas Home, Admin, AreaView e ProjectView já reestilizadas.
