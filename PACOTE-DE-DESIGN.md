# Pacote de design: Tania Vital, consultora educacional UniBF

Documento único da Fase 5. Escrito antes de qualquer geração, consumido pela construção na Fase 8.
Toda a copy aqui vai para a página **exatamente como está escrita**. Os números de faixa são pontos de partida, validados depois pelo teste de flick.

Conceito aprovado: **"A mesa que acende"** (Tier 1, um plano contínuo).

---

## 1. A premissa da marca

**Educação transforma sonhos em caminhos.** A frase é dela, tirada da própria arte de capa, e é a única ideia que a página inteira ensina e vende. Ninguém conquista um diploma sozinho: o que a Tania vende não é curso, é companhia no caminho. Cada seção serve essa ideia. Se uma seção não serve, ela sai da página.

O vídeo é o caminho: a câmera desce até a mesa dela e a luz vai acendendo na descida. A pessoa rola e percorre esse trajeto.

---

## 2. A paleta em tokens CSS

Direção tirada do mundo da filmagem: madeira quente, papel creme, flores secas, dourado de joia, sombra de manhã. **Valores provisórios.** Os finais saem amostrados do vídeo aprovado, depois do portão.

Desvio declarado: creme com serifada e acento terracota é um visual que o skill proíbe como padrão, porque é a cara de site feito por IA. A exceção prevista se aplica aqui, porque este é o mundo material real dela, não um atalho. Para ganhar a exceção: cores amostradas da filmagem, elemento de assinatura próprio, e fuga do layout de template. As três coisas estão neste pacote.

```css
:root{
  --canvas:#f6efe4;        /* creme de papel, nunca branco puro */
  --panel:#fffaf2;         /* cartões e superfícies elevadas */
  --ink:#2a1f18;           /* texto principal, marrom tinta */
  --text-primary:#2a1f18;
  --text-secondary:#6b5c4e;
  --deep:#4a2418;          /* madeira escura, fundos de seção */
  --deep-2:#2a1410;        /* o mais escuro, rodapé */
  --accent:#b8860f;        /* dourado de joia, o CTA e a ênfase rara */
  --accent-hover:#9a710b;
  --accent-muted:#e8d5a8;  /* dourado no sussurro: bordas, brilhos, partículas */
  --whatsapp:#22c55e;
  --whatsapp-deep:#16a34a;
}
```

O acento aparece em doses raras: o botão de WhatsApp, o foco do teclado, o caminho de assinatura, e uma ou duas palavras por seção. Acento em tudo não é acento.

---

## 3. O trio tipográfico

| Papel | Fonte | Pesos em uso |
|---|---|---|
| Display | **Instrument Serif** | 400, 400 itálico |
| Corpo | **Figtree** | 400, 500, 600, 700 |
| Rótulos pequenos | **DM Mono** | 400, 500 |

Instrument Serif tem contraste alto e ar editorial, que conversa com a arte de capa dela. Figtree é humanista e quente, sem ser o Inter automático. DM Mono dá o toque de ficha técnica nos rótulos e nos números.

---

## 4. O mapa de faixas do herói

Herói de **700vh** (faixa de rolagem de 600vh). Quatro faixas, cada uma com platô cheio de cerca de 110vh e rampas de 20vh.

Regra de posição obedecida: o assunto da página é ela, então o topo fala na voz confiante dela. A linguagem de dor dos compradores entra nas seções de baixo.

| # | Faixa | Momento da filmagem | Copy (verbatim) | Entrada |
|---|---|---|---|---|
| 1 | 0.00 a 0.24 | mesa ainda em penumbra, câmera começa a descer | **"Sou Tania Vital."**<br>sub: "Consultora educacional da UniBF." | Blur-to-sharp (a névoa clareia, igual à luz acendendo) |
| 2 | 0.27 a 0.49 | descida em curso, luz crescendo sobre a mesa | **"Trinta anos na educação me ensinaram que ninguém se forma sozinho."** | Drift-down (as palavras descem junto com a câmera) |
| 3 | 0.52 a 0.74 | a luz varre a página do caderno | **"Por isso eu vou junto. Do primeiro oi até o diploma na sua mão."** | Grid snap-align (letras entram na horizontal, igual à luz varrendo) |
| 4 | 0.78 a 1.00 | chegada, a mesa em repouso na luz dourada | **"Mais de 500 pessoas já começaram aqui."**<br>sub: "Comece o seu."<br>botão: "Fale comigo no WhatsApp" | Word-by-word rise em três chegadas (título, sub, botão) |

Faixa 1 não tem ease-in de opacidade e ganha rampa de montagem por tempo no carregamento, para abrir já assentada. Faixa 4 não tem ease-out.

Zona de texto: **metade esquerda do quadro**, sobre a superfície vazia e quente da mesa. A faixa de ação (caderno, flores, laptop) fica à direita e permanece livre.

---

## 5. Bloco de copy do herói estático

Para celular e movimento reduzido, sobre o quadro final:

- Título: **"Sou Tania Vital. Do primeiro oi até o diploma na sua mão."**
- Sub: **"Consultora educacional da UniBF. Mais de 500 pessoas já começaram aqui."**
- Botão: **"Fale comigo no WhatsApp"**

---

## 6. O roteiro abaixo da dobra

Ordem das seções, cada uma com a copy final. Tudo afunila para **uma única ação: a conversa no WhatsApp**.

### 6.1 Faixa de confiança
Quatro selos, linha única: **Autorizado pelo MEC** (registro institucional oficial) · **Início imediato** (você começa quando quiser) · **100% flexível** (estude do celular ou do notebook) · **Mais de 500 alunos** (acompanhados pessoalmente por mim)

### 6.2 O que trava (seção nova, e a que mais converte)
Aqui entra a linguagem real dos compradores que a pesquisa levantou.

Kicker: **A verdade sobre voltar a estudar**
Título: **"O que trava não é o curso. É o resto."**

Três blocos, dor na palavra deles e resposta na dela:

| A dor | A resposta |
|---|---|
| **"Não tenho tempo."** Trabalho, casa, filhos. O diploma vai ficando pra ano que vem, e o ano que vem vira cinco. | Você estuda quando dá. De manhã, de madrugada, no ônibus. Sem horário fixo de aula, sem perder o emprego. |
| **"E se eu não der conta?"** O medo de não acompanhar fala mais alto que a vontade. | Você não vai sozinho. Tem tutor na plataforma e tem eu no WhatsApp, do primeiro dia até o último. |
| **"Vou ser o mais velho da turma."** Muita gente ouve dúvida quando conta que vai voltar a estudar. | Em EAD ninguém mede sua idade. E maturidade vira vantagem: quem volta depois dos 30 sabe exatamente por que está ali. |

Fecho da seção: **"E a pergunta que mais me fazem: diploma EAD vale? Vale. O diploma não escreve EAD em lugar nenhum, e a validade é a mesma do presencial."**

### 6.3 O caminho (o momento interativo)
Kicker: **O caminho**
Título: **"De hoje até o diploma, em quatro passos."**
Instrução: **"Segure o botão e percorra comigo."**

Quatro etapas que acendem em sequência enquanto a pessoa segura:
1. **Você me chama** · Me conta seu momento. Eu indico o curso que encaixa na sua vida.
2. **A gente se inscreve junto** · Processo seletivo simplificado, sem sair de casa. Eu faço com você.
3. **Você estuda no seu ritmo** · Plataforma aberta 24 horas, tutor online, e eu por perto.
4. **O diploma sai no seu nome** · Reconhecido pelo MEC, com o mesmo valor de qualquer diploma presencial.

Ao completar: **"Pronto. Esse é o caminho inteiro, e eu ando ele com você."** + botão.

### 6.4 Modalidades
Kicker: **Modalidades**
Título: **"Qual caminho combina com a sua rotina?"**
Lede: **"Seis formas de estudar na UniBF. Me conta seu momento que eu te indico a melhor, e cuido da inscrição com você, do início ao fim."**

Seis cartões, copy atual mantida verbatim (Graduação a Distância, Graduação Semipresencial, Segunda Graduação, Pós-Graduação, Cursos Livres, Transferência). Foto da Tania apontando fica ao lado do título, como está hoje.

### 6.5 Catálogo de cursos
Kicker: **Escolha sua graduação**
Título: **"EAD ou semipresencial, com início imediato: a escolha é sua."**
Painel de ficha com abas por categoria e busca global. Mantido como está, que já funciona bem.

### 6.6 Pós-Graduação
Título: **"Conclusão a partir de 4 meses."** Dois destaques (4 meses, certificado a um clique) e os onze chips de área de atuação, cada um abrindo o WhatsApp com a área no texto.

### 6.7 Cursos Livres (oferta)
Título: **"Até 30% OFF nos cursos de extensão."** Selo de conclusão a partir de 15 dias, tabela por carga horária, tabela de combos, e a nota de pagamento.

### 6.8 Prova social
Kicker: **Prova social**
Título: **"Quem já acelerou a carreira com a UniBF"**
Os quatro depoimentos reais do site da UniBF, verbatim, com as fotos reais.

### 6.9 Sobre a Tania
Kicker: **Sobre a Tania**
Citação: **"30 anos transformando vidas na educação pública. Hoje, 100% dedicada à UniBF: já ajudei mais de 500 pessoas a conquistarem sua graduação ou pós."**
Apoio: **"Aposentada da rede pública depois de quase 20 anos à frente de uma escola em Campo Grande (MS), hoje sou Consultora Educacional da UniBF em tempo integral desde 2019."**

### 6.10 Dúvidas
Título: **"Ainda com dúvidas?"**
As seis perguntas atuais, mais uma nova no topo, que é a objeção número um da pesquisa:

**"Diploma EAD tem o mesmo valor?"**
Tem. O diploma é emitido por instituição credenciada pelo MEC e não traz nenhuma distinção entre EAD e presencial. Vale para concurso público, para pós-graduação e para qualquer processo seletivo, no Brasil e fora dele.

### 6.11 Chamada final
Título: **"Vamos conversar sobre o seu futuro?"**
Lede: **"Sem formulário, sem espera. Me chame agora e eu te ajudo a dar o próximo passo na sua formação."**
Botão: **"Fale comigo no WhatsApp"**

### 6.12 Formulário
**Não tem formulário.** A página inteira afunila para o WhatsApp, que é o canal real dela. Decisão consciente: um formulário em site estático ou não envia nada, ou manda para um serviço que ela não usa. O WhatsApp já é a caixa de entrada dela, e cada botão abre a conversa com a mensagem certa já escrita.

### 6.13 Rodapé
Logo UniBF, uma linha sobre a página, Instagram e Facebook dela, WhatsApp, e a nota de que é página independente de embaixadora, que não substitui os canais oficiais da UniBF. Sem aviso de imagem gerada por IA, decidido com a cliente.

---

## 7. A camada vetorial

**O elemento de assinatura: o caminho dourado.** Um traço SVG contínuo que desce pela página inteira, desenhando-se conforme a rolagem avança. Ele sai do fim do vídeo, atravessa cada seção passando ao lado dos títulos, e termina no botão da chamada final. Tire ele e a página muda de verdade: ele é a premissa virando desenho.

Também na camada:
- Partículas de poeira dourada no nível de sussurro sobre o fundo fixo, à deriva lenta, ciclo de 60 segundos ou mais.
- Divisórias desenhadas à mão entre seções, em vez de linhas retas: um traço leve que segue o caminho.
- Um brilho suave atrás dos números grandes e do selo de MEC.

Tudo honra movimento reduzido: estados finais mostrados, motores parados.

---

## 8. A lista de engenharia

Nada aqui é opcional. Tudo está detalhado em `scrub-pipeline.md`:

- Vídeo buscado como Blob, com anel de progresso se passar de 8 MB
- Lerp normalizado por dt no laço de rAF, que descansa quando converge
- Seeks com portão, sem sobreposição, com escape de deadlock no erro
- Escrita no DOM só na mudança, com delta-gate
- Ritmo das faixas em vh, validado pelo teste de flick (120px, 240px, 360px)
- Sistema de legibilidade em quatro camadas, com auditoria do pior quadro a 3.5:1
- Os cinco portões do herói estático, vivos por listener de mudança, idênticos em CSS e JS
- Página completa e bonita sem o vídeo
- O padrão do site inteiro animado, e o piso de qualidade inteiro

---

## 9. O portão de copy

Toda linha voltada ao visitante escrita acima vai para a página **verbatim**. Antes de mostrar a página para qualquer pessoa, ela precisa passar no portão da Fase 9: zero travessões, zero palavras de catálogo, e a varredura de vícios de IA no corpo do texto. Os recursos de marca deliberados deste pacote são ofício e ficam.
