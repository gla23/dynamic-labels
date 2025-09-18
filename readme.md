## Dynamic Labels Display extension

This provides the same functionality as the built-in "Labels" Display, except it gets the parameters (icon, colour, name) from data in the related M2O or M2M table, rather than looking up hard coded values based on the string/integer value of a column.

### How the built-in "Lables" display works

For the normal "Labels" Display, you provide parameters in the data model settings for a string/integer field like so:

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

This defines what kind of label to display for each `value` within the column.
For example a string field called `status` contains a `value` of

```
'doing'
```

This data is used to look up the correct parameters in the array above, which then renders the fancy label.

## How this extension works

For this extension you provide parameters like so:

```
{
  "textColumn": "name",
  "iconColumn": "icon",
  "colorColumn": "colour",
  "showAsDot": false
}
```

Then a M2O field or a M2M field can use this display to render a related item in another table, such as

```
{
  "text": "Done",
  "icon": "check",
  "colour": "#2ECDA7"
}
```

You define which columns to look up and use that data within the same label component.

To do: Show screenshot of the Table Layout displaying the single label for a M2O field, and multiple labels for a M2M field.
To do: Show how the single and multiple labels are replaced by dots if you choose the show as dots instead

# Why?

To do: Show video of how to replace the admin settings method with the dynamic labels method

When you use this extension the data for which text, icon, colour to use in each label is no longer hard coded in the admin settings. This means that we can use a standard table to store this data 🎉

This really helps for multiple reasons:

- If we already have the display data in our data model, we can simply pull in the related values. There is no need to duplicate it in the admin settings.
- This data model can then be extended as usual. It doesn't die within admin settings, unable to be linked to any other tables 😔
- The options in the list can be edited by non-admin users using the existing Directus infrastructure and permissions model.

Are there downsides?

- The options are not included within a Directus snapshot when transfered between projects. The is usually fine though as it's common though to make core data get transfered using any of the community solutions.

# Technical notes

See `labels.vue` in the main Directus repository for where most of the code came from.
