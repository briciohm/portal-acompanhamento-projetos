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
