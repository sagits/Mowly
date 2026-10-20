# LawnStarter PoC — plano

Combo das ideias 1 e 2 do `07-build-to-hire.md`:

1. **A skill pública** (`/Library/workspace/build-to-hire`): o pipeline da PoC da Turno empacotado como skill do Claude Code. Screenshots → PRD → tickets → build por ticket com testes → polish → web build → link.
2. **O clone**, construído com essa skill: o app de **cliente** do LawnStarter com outro nome, universal (iOS + web do mesmo código).

A vaga pede "um workflow de agente que outros times adotam" e documenta tudo internamente como skills do Claude Code. Então a skill é a prova principal, e o clone é a prova de que ela funciona. Os dois links vão juntos na candidatura.

## Ordem

1. Renato tira os screenshots (roteiro abaixo) e põe em `screenshots/`
2. Rodar a skill neste diretório para gerar `PRD.md` a partir dos screenshots
3. Renato revisa o PRD (nome do app, stack, escopo)
4. Repo novo para o clone, PRD + screenshots dentro de `poc/`, e o agente constrói
5. Polish com os pedidos anotados palavra por palavra em `FEATURES.md`
6. Deploy web na Vercel, vídeo curto no Loom e README com o aviso de que não tem afiliação
7. Publicar a skill (repo público + post) e aplicar no Workable com os dois links
8. Achar um EM ou engenheiro do LawnStarter no LinkedIn e mandar o link direto

## Roteiro de screenshots

App: **LawnStarter** na App Store (o de cliente, não o "LawnStarter for Providers").

**Regras**
- Nomear em ordem de fluxo, com dois dígitos: `01-onboarding-welcome.png`, `02-address-entry.png`...
- Uma tela por arquivo. Se a tela rola, tirar uma por dobra (`14-quote-1.png`, `14-quote-2.png`)
- Tirar o estado vazio *e* o estado com conteúdo quando existirem os dois
- Tirar os loadings também, se der tempo (skeleton, spinner). Eles entram no clone
- Se puder, gravar um vídeo de tela do fluxo inteiro (`flow.mov`), porque animações e transições não aparecem no print
- **Não pagar nada e não agendar serviço de verdade.** Parar no checkout. Criar a conta e fazer login fica com você
- O preço sai de um endereço nos EUA (eles medem o terreno por satélite). Dá para usar qualquer endereço residencial público só para ver o orçamento

**Telas, em ordem**

| # | Fluxo | O que capturar |
|---|---|---|
| 01–03 | Abertura | Splash, welcome/onboarding, tela de login/cadastro (só a tela, sem dados) |
| 04–05 | Endereço | Campo de endereço, autocomplete aberto, confirmação no mapa/satélite |
| 06–08 | Serviços | Lista/catálogo de serviços (mowing, leaf removal, bush trimming...), detalhe de um serviço |
| 09–12 | Orçamento | Preço instantâneo, escolha de frequência (semanal, quinzenal, avulso), opções extras, tamanho do gramado |
| 13–15 | Agendamento | Calendário/data do primeiro serviço, observações para o pro (portão, cachorro), resumo |
| 16 | Checkout | Tela de pagamento **sem preencher**. Só o layout |
| 17–20 | Home logado | Dashboard: próximos serviços, estado vazio, banners/promos |
| 21–23 | Serviço agendado | Detalhe do serviço, pro atribuído (perfil, nota, reviews), status |
| 24–25 | Pós-serviço | Histórico, fotos do serviço feito, avaliar o pro, gorjeta (se existir sem ter serviço, pular) |
| 26–27 | Mensagens | Lista de conversas e chat com o pro |
| 28–30 | Conta | Perfil, propriedades/endereços, métodos de pagamento (lista, sem dados), indique e ganhe, settings |
| 31+ | Extra | Qualquer tela que não caiba acima: notificações, ajuda, cross-sell de outros serviços |

O que não der para ver sem ter um serviço agendado (pro atribuído, fotos, avaliação) pode vir de screenshots da página da App Store ou do site. Nesse caso, salvar em `screenshots/appstore/` com o mesmo esquema de números.
