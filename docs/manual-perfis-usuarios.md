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
