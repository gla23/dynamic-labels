## Dynamic Labels Display extension

This provides the same functionality as the built-in "Labels" Display, except it gets the parameters (icon, colour, name) from data in the related M2O table, rather than looking up hard coded values based on the string/integer value of a column.

### How the built-in "Lables" display works

For the normal "Labels" Display, you provide parameters like so:

```
[
  {
    "text": "Idea",
    "value": "idea",
    "icon": "lightbulb",
    "color": "#3399FF"
  },
  {
    "text": "Doing",
    "value": "doing",
    "icon": "construction",
    "color": "#FFC23B"
  },
  {
    "text": "Done",
    "value": "done",
    "icon": "check",
    "color": "#2ECDA7"
  }
]
```

Then a string or integer field (e.g. `status`) uses the Display to render it's string `value` e.g.

```
'doing'
```

The data is used to look up the correct parameters to render the fancy label.

## How this extension works

For this extension you provide parameters like so:

```
{
  "textColumn": "name",
  "iconColumn": "icon",
  "colorColumn": "colour",
}
```

Then a M2O field or a M2M field can use this display to render a related item e.g.

```
{
  "text": "Done",
  "icon": "check",
  "colour": "#2ECDA7"
}
```

# Why?

The data for which text, icon, colour to use is no longer hard coded in the admin settings. This means that we can use a real table to store this data 🎉

This really helps for these reasons:

- If we already have the display data in our data model, we can simply pull in the related values. There is no need to duplicate it in the admin settings.
- This data model can then be extended as usual and doesn't die within admin settings, unable to be linked to any other tables 😔
- The options in the list can be edited by non-admin users using the existing Directus permissions model

Downsides?

- The options are not included within a Directus snapshot when transfered between projects. The is usually fine though as it's common though to make core data get transfered using any of the community solutions.

# Technical notes

See `labels.vue` in the main repository.
