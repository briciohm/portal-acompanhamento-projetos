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
