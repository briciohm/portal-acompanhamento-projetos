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
