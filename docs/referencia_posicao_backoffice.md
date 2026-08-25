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
