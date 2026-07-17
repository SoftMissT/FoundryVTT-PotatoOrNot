# Potato Or Not

> Compatible with Foundry Virtual Tabletop v13 and verified for v14.

![Latest Release Download Count](https://img.shields.io/github/downloads/Haxxer/FoundryVTT-PotatoOrNot/latest/module.zip?color=2b82fc&label=DOWNLOADS&style=for-the-badge) [![Forge Installs](https://img.shields.io/badge/dynamic/json?label=Forge%20Installs&query=package.installs&suffix=%25&url=https%3A%2F%2Fforge-vtt.com%2Fapi%2Fbazaar%2Fpackage%2Fpotato-or-not&colorB=006400&style=for-the-badge)](https://forge-vtt.com/bazaar#package=potato-or-not) ![Foundry Core Compatible Version](https://img.shields.io/badge/dynamic/json.svg?url=https%3A%2F%2Fgithub.com%2FHaxxer%2FFoundryVTT-PotatoOrNot%2Freleases%2Flatest%2Fdownload%2Fmodule.json&label=Foundry%20Version&query=$.compatibility.verified&colorB=orange&style=for-the-badge) ![Latest Version](https://img.shields.io/badge/dynamic/json.svg?url=https%3A%2F%2Fgithub.com%2FHaxxer%2FFoundryVTT-PotatoOrNot%2Freleases%2Flatest%2Fdownload%2Fmodule.json&label=Latest%20Release&prefix=v&query=$.version&colorB=red&style=for-the-badge)

---

<img src="https://app.fantasy-calendar.com/resources/computerworks-logo-full.png" alt="Fantasy Computerworks Logo" style="width:250px;"/>

A module made by Fantasy Computerworks.

Other works by us:

- [Fantasy Calendar](https://app.fantasy-calendar.com) - The best calendar creator and management app on the internet
- [Sequencer](https://foundryvtt.com/packages/sequencer) - Wow your players by playing visual effects on the canvas
- [Item Piles](https://foundryvtt.com/packages/item-piles) - Drag & drop items into the scene to drop item piles that you can then easily pick up
- [Tagger](https://foundryvtt.com/packages/tagger) - Tag objects in the scene and retrieve them with a powerful API
- [Token Ease](https://foundryvtt.com/packages/token-ease) - Make your tokens _feel good_ to move around on the board

Like what we've done? Buy us a coffee!

<a href='https://ko-fi.com/H2H2LCCQ' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://cdn.ko-fi.com/cdn/kofi1.png?v=3' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>

---

![Samwise Gamgee Saying Po-Ta-Toes](docs/po-ta-toes.gif)

Is your computer a potato? Is your players' computers potatoes? Are they scared of navigating interfaces?

Presenting, **Potato Or Not**!

This module asks players what class of computer they use and applies an appropriate graphics preset. Settings are stored per browser/client, so each player can choose independently.

## Installation

Paste this manifest URL into Foundry's **Install Module** dialog:

```text
https://github.com/SoftMissT/FoundryVTT-PotatoOrNot/releases/latest/download/module.json
```

After enabling the module, open **Game Settings → Configure Settings → Module Settings → Potato Or Not** to change the preset. New clients are prompted automatically while **Prompt All New Users** is enabled.

![The Dialog](docs/po-ta-toes.jpg)

---

# API Documentation

## Constants

### <code>PotatoOrNot.quality</code>

Sets the graphic quality of the client and update settings associated with that quality level

| Param | Type | Range |
| --- | --- | --- |
| quality | <code>number</code> | 0-2 |

---

## Hooks

### <code>PotatoOrNotReady</code>

Called after the module API has been instantiated. The API instance is passed as the first argument.

```js
Hooks.once("PotatoOrNotReady", (api) => api.addSetting(0, "my-module", "effects", false));
```

---

## Functions

### <code>PotatoOrNot.showDialog</code>

Locally prompts the dialogue

Returns <code>Promise&lt;ApplicationV2&gt;</code>.

---

### <code>PotatoOrNot.getSetting</code>

Gets the value of a setting of a module at a quality level

| Param | Type |
| --- | --- |
| quality_level | <code>number</code> |
| module | <code>string</code> |
| setting | <code>string</code> |

Returns <code>\*</code> on success

---

### <code>PotatoOrNot.addSetting</code>

Adds a setting to be applied on a quality level - can be forced to be applied immediately (if quality level matches)

| Param | Type |
| --- | --- |
| quality_level | <code>number</code> |
| module | <code>string</code> |
| setting | <code>string</code> |
| value | <code>\*</code> |
| force | <code>bool</code> |

Returns <code>bool</code> on success

---

### <code>PotatoOrNot.removeSetting</code>

Removes a setting from a quality level

| Param | Type |
| --- | --- |
| quality_level | <code>number</code> |
| module | <code>string</code> |
| setting | <code>string</code> |

Returns <code>bool</code> on success
