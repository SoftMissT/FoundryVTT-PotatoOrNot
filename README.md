# Batata ou Não

> Compatível com Foundry Virtual Tabletop v13 e verificado para v14.

![Downloads da versão](https://img.shields.io/github/downloads/SoftMissT/FoundryVTT-PotatoOrNot/latest/module.zip?color=2b82fc&label=DOWNLOADS&style=for-the-badge)
![Versão do Foundry](https://img.shields.io/badge/dynamic/json.svg?url=https%3A%2F%2Fraw.githubusercontent.com%2FSoftMissT%2FFoundryVTT-PotatoOrNot%2Fmain%2Fmodule.json&label=Foundry&query=$.compatibility.verified&colorB=orange&style=for-the-badge)
![Última versão](https://img.shields.io/badge/dynamic/json.svg?url=https%3A%2F%2Fraw.githubusercontent.com%2FSoftMissT%2FFoundryVTT-PotatoOrNot%2Fmain%2Fmodule.json&label=Vers%C3%A3o&prefix=v&query=$.version&colorB=red&style=for-the-badge)

![Samwise Gamgee dizendo Po-Ta-Toes](docs/po-ta-toes.gif)

Seu computador é uma batata? O computador dos seus jogadores sofre para renderizar o canvas?

**Batata ou Não** permite que cada jogador escolha entre três perfis de desempenho. O módulo aplica automaticamente as configurações gráficas adequadas e armazena a escolha localmente em cada navegador.

![Diálogo de seleção](docs/po-ta-toes.jpg)

## Instalação

Cole este endereço em **Instalar módulo** no Foundry:

```text
https://raw.githubusercontent.com/SoftMissT/FoundryVTT-PotatoOrNot/main/module.json
```

Depois de ativar o módulo, acesse:

**Configurações do jogo → Configurar ajustes → Configurações de módulo → Batata ou Não**

Cada jogador pode escolher seu próprio perfil. Quando **Perguntar aos novos usuários** estiver ativado, o seletor será aberto automaticamente para usuários que ainda não configuraram aquele navegador.

## Perfis disponíveis

| Perfil | Indicação | Resultado |
| --- | --- | --- |
| Batata Ruim | Notebook ou computador básico | Prioriza desempenho e reduz efeitos gráficos |
| Batata | Computador intermediário | Equilibra qualidade visual e desempenho |
| Batata Premium | Computador potente | Ativa a melhor qualidade visual disponível |

## Desenvolvimento

```bash
npm install
npm test
npm run build
```

O build pronto para distribuição será criado em `dist/`.

## API

O identificador técnico e a API continuam em inglês para preservar compatibilidade.

### `PotatoOrNot.quality`

Lê ou define o perfil atual usando um número entre `0` e `2`.

### `PotatoOrNotReady`

Executado quando a API do módulo está pronta:

```js
Hooks.once("PotatoOrNotReady", (api) => {
  api.addSetting(0, "meu-modulo", "efeitos", false);
});
```

### Métodos públicos

- `PotatoOrNot.showDialog()` — abre o seletor localmente.
- `PotatoOrNot.getSetting(qualityLevel, moduleId, setting)` — consulta uma configuração do perfil.
- `PotatoOrNot.addSetting(qualityLevel, moduleId, setting, value, force)` — adiciona uma configuração.
- `PotatoOrNot.removeSetting(qualityLevel, moduleId, setting)` — remove uma configuração.

## Créditos e licença

Projeto original de Fantasy Computerworks/Wasp, modernizado para Foundry v14 e localizado em português.

Distribuído sob a licença indicada em [LICENSE](LICENSE).
