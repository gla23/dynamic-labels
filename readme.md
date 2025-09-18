## Dynamic Labels

This Directus extension provides the same functionality as the built-in "Labels" Display, except it gets the parameters (icon, icon colour, and text) from data in a related M2O or M2M item, rather than looking up hard coded values based on the value of a string/integer column.

There is also an option to just display the dot like in the Labels component. In that case, you only choose the column for the colour.

### How the built-in "Lables" display works

For the standard "Labels" Display, you provide parameters in the data model settings like so:

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
For example a string field called `status` might contain a `value` of

```
'doing'
```

This data is used to look up the correct parameters in the array, which are then used to render the fancy label.

## How this extension works

For this "Dynamic Labels" extension, you instead provide parameters like so:

```
{
  "textColumn": "text",
  "iconColumn": "icon",
  "colorColumn": "colour",
  "showAsDot": false
}
```

Then a M2O field or a M2M field can use this display to render their related item(s), such as

```
{
  "text": "Done",
  "icon": "check",
  "colour": "#2ECDA7"
}
```

The admin settings define which keys in the related item(s) to use as props for the Label component.

<!-- To do: A screenshot of the Table Layout displaying the single label for a M2O field, and multiple labels for a M2M field. -->

<!-- To do: Show how the single and multiple labels are replaced by dots if you choose "Show as dot" instead. -->

# Why?

When you use this extension, the label's text, icon and colour is no longer hard coded within admin settings. Instead, the data is stored in a standard table 🎉

This is really helpful for many reasons:

- If we already have the data we want in our data model, we can simply pull in all the values. There is no need to duplicate this data in admin settings.
- The same options can be reused for multiple fields, even across different tables. Updates to the option set will immediately propogate across each context. You can even use the "Interface Filter" on each M2O or M2M field to choose a sub-set of items to be available in each context. You can therefore combine option sets into one big table and choose which ones go in each context.
- The options table data model can be extended! If you need to add relations to your table containing the options, you can do this as usual. Normally the options data dies within admin settings, unable to be linked to any other tables 😔
- The options in your custom lists can be edited by non-admin users with the existing Directus infrastructure and permissions model. Normally they're stuck in admin settings where only an admin user can edit them!

Are there downsides?

- The options are not included within a Directus snapshot when transfered between projects. The is usually fine though as it's common though to make core data get transfered using any of the community solutions.

# Installation

Use the Directus Marketplace to install the extension.

This extension is then available to choose within the Display tab of a M2O or M2M field. Pick the relevant columns and you're good to go.

# Bugs

M2M fields are buggy right now 😔 There's an issue that stops the labels rendering in the Table Layout when swapping collections or going to the next page of results. A refresh makes them display... until you move page again. The console gives `[useStores]: The stores could not be found.`, a fix for which is out of my Directus depth right now. PR fix accepted!

<!-- # Technical notes -->

<!-- See `labels.vue` in the main Directus repository for where most of the code came from. -->
