# Visibilidade de áreas e projetos no Back-Office

A seção **Visibilidade** do Back-Office permite ocultar temporariamente áreas e projetos sem excluir registros ou os documentos, KPIs, cronogramas, marcos e fotos associados.

## Comportamento público

Áreas e projetos marcados como ocultos não aparecem na Home, nos dashboards, nas carteiras, nos filtros públicos nem nos detalhes acessados diretamente por URL. A regra é aplicada no backend, e não apenas na interface, para evitar exposição por acesso direto.

## Administração

Administradores podem alternar entre **Todos**, **Visíveis** e **Ocultos**. Projetos ocultos continuam disponíveis no seletor de atualização e na aba de Visibilidade. Áreas ocultas podem ser editadas e reativadas pela mesma tela.

A ação **Reativar** restaura a visibilidade pública do item sem modificar seus demais dados. A ação **Ocultar** é reversível e não realiza exclusão física.

## Permissões e persistência

As operações de listagem administrativa, edição, ocultação e reativação usam procedimentos protegidos por perfil de administrador. O estado é persistido nos campos `isHidden` das tabelas de áreas e projetos, com valor padrão `false` para os registros existentes.
