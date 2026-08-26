# Guia rápido de perfis de usuário

> **Documento orientativo e não oficial do projeto.** Este material explica, em linguagem simples, como os perfis funcionam no Portal de Acompanhamento de Projetos. As regras efetivas são sempre as aplicadas pelo sistema.

## 1. Como funciona a hierarquia

O sistema trabalha com quatro perfis. Um usuário somente pode criar ou atribuir perfis que estejam abaixo do seu próprio nível. Não é permitido criar um perfil igual ao seu, promover alguém para um nível superior ou transformar um usuário operacional em Administrador Geral.

| Nível | Perfil | Pode criar ou atribuir |
|---:|---|---|
| 4 | Administrador Geral | Gestor de Setor, Editor de Projetos e Consulta |
| 3 | Gestor de Setor | Editor de Projetos e Consulta |
| 2 | Editor de Projetos | Consulta |
| 1 | Consulta | Nenhum perfil |

## 2. Administrador Geral

É o perfil de maior responsabilidade. Possui acesso completo ao Back-Office, pode administrar áreas, projetos, setores, usuários, permissões, documentos, evidências, cronogramas, indicadores, visibilidade e registros de auditoria.

Também pode criar e alterar usuários de níveis inferiores. Por segurança, o Administrador Geral não pode remover o próprio perfil, desativar o próprio acesso ou alterar a própria proteção administrativa.

## 3. Gestor de Setor

Gerencia o acompanhamento dos projetos dos setores aos quais está vinculado. Pode editar projetos, etapas, marcos, indicadores, fotos e documentos dentro do escopo permitido pelo sistema.

Pode criar e administrar usuários com perfil Editor de Projetos ou Consulta, mas somente quando os vínculos estiverem relacionados aos seus próprios setores. Não pode criar outro Gestor de Setor nem Administrador Geral. Também não visualiza usuários fora dos setores aos quais está vinculado.

## 4. Editor de Projetos

Executa alterações operacionais no conteúdo dos projetos, como atualização de etapas, cronogramas, marcos, indicadores, evidências fotográficas e documentos/materiais. Não administra usuários, setores, permissões ou configurações estruturais.

Pode criar usuários de Consulta, mas não pode criar outro Editor de Projetos, Gestor de Setor ou Administrador Geral.

## 5. Consulta

Possui acesso somente para leitura. Pode consultar projetos, setores, indicadores, cronogramas, evidências, documentos, históricos e diagnósticos disponibilizados pelo sistema, mas não pode salvar alterações, cadastrar usuários ou modificar permissões.

## 6. Vínculos de setores

O vínculo de setores define o alcance administrativo do Gestor de Setor. Ao atribuir um Gestor, selecione um ou mais setores compatíveis. O sistema usa esses vínculos para limitar a visualização e as alterações de usuários e projetos.

Para Editores e usuários de Consulta, o perfil define principalmente a capacidade de editar ou consultar. A atribuição de setores pode ser usada pelo sistema para organizar o escopo, conforme a regra administrativa adotada.

## 7. Auditoria e segurança

Criações e alterações de perfis são registradas na auditoria com autor, usuário-alvo, ação, perfis, setores, status e data. Tentativas de atribuir um perfil igual ou superior também são registradas como **Tentativa bloqueada**, com o motivo da rejeição.

Na tela de auditoria, utilize os filtros de autor, tipo de ação e período para localizar rapidamente uma operação. Eventos bloqueados não significam que uma alteração foi realizada; significam que a tentativa foi recusada e registrada para rastreabilidade.

## 8. Orientação prática

Antes de criar ou editar um usuário, confirme o perfil necessário, selecione apenas os setores pertinentes e revise a matriz de permissões exibida no formulário. Se uma opção não aparecer, isso normalmente significa que a hierarquia do seu perfil não permite aquela atribuição.

Em caso de dúvida sobre uma permissão, consulte o Administrador Geral e verifique o registro correspondente na auditoria. Este guia não substitui normas internas, políticas de segurança ou decisões administrativas da instituição.
