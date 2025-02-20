---
title-prefix: Home
...

## Overview

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build status](https://ci.appveyor.com/api/projects/status/j8d19gt0vh16amhh/branch/master?svg=true)](https://ci.appveyor.com/project/Gregg/vue-tree/branch/master)

vue-tree is a Vue component that implements a TreeView control. Its aim is to provide common tree options in a way that is easy to use and easy to customize.

> From version 4.0.0 this component only works with Vue 3 and up. For Vue 2 support, use [version 3.x](https://grapoza.github.io/vue-tree/3.0.3/).

Features include:

- Works in modern browsers using the precompiled scripts, or can be included in your babel/webpack chain.
- Expandable nodes
- Checkboxes
- Radio buttons
- Node selection
- Addition and removal of nodes
- Slots for node content
- Skinning
- Asynchronous loading of nodes
- Follows ARIA guidelines for treeview accessibility
- Drag and drop (single nodes, works between trees)

For future plans, see the project's [Issues](https://github.com/grapoza/vue-tree/issues) page.

##  Installation

Install the component with your favorite package manager:
```shell
yarn add @grapoza/vue-tree
```
or
```shell
npm install --save @grapoza/vue-tree
```

## Usage

If you're using it in a .vue file:

```html
<template>
  <tree-view  id="my-tree" :initial-model="dataModel"></tree-view>
</template>

<script>
import TreeView from "@grapoza/vue-tree"

export default {
  components: {
    TreeView
  },
  data() {
    return {
      dataModel: [
        {id: "numberOrString", label: "Root Node", children: [
          {id: 1, label: "Child Node"},
          {id: "node2", label: "Second Child"}]
        }]
    }
  }
}
</script>
```

Or, import it into your application:

```javascript
import TreeView from "@grapoza/vue-tree"
Vue.use(TreeView)
```
Then add the component:
```html
<tree-view id="my-tree" :initial-model="dataModel"></tree-view>
```
```javascript
export default {
  data() {
    return {
      dataModel: [
        { id: "numberOrString", label: "Root Node", children: [
          { id: 1, label: "Child Node" },
          { id: "node2", label: "Second Child" }]
        }]
    }
  }
}
```

## Demos

To see it in action, try out the [demos](demos.html).

## Tree Props

| Prop              | Type     | Description                                                                                        | Default value                     | Required |
|:------------------|:---------|:---------------------------------------------------------------------------------------------------|:----------------------------------|:---------|
| initialModel      | Array    | The data model containing [model data](#model-data)                                                | `[]`                              |          |
| customAriaKeyMap  | Object   | An object, the properties of which are arrays to keyCodes for various actions                      | See [Aria](#setting-key-bindings) |          |
| loadNodesAsync    | Function | A function that is called on mount to asynchronously load [model data](#model-data)                | `null`                            |          |
| modelDefaults     | Object   | An object containing defaults for all nodes that do not specify the given properties               | `{}`                              |          |
| selectionMode     | String   | How selection should operate (see [Selection Mode](#selection-mode))                               | `null` (cannot select nodes)      |          |
| skinClass         | String   | A class name to apply to the tree that specifies a skin to use (see [Skins](#skins))               | `"grtv-default-skin"`             |          |

## Selection Mode

The `selectionMode` property defines how nodes should be selected within the treeview. Allowed values are `null`, `single`, `selectionFollowsFocus`, and `multiple`. Only nodes with the `selectable` model property set to `true` can be selected.

- If `null` (the default) then selection does not occur.
- If `single` then one node is selected at a time when the user clicks the node or using the selection keyboard binding (`Enter` by default).
- If `selectionFollowsFocus` then selection follows the focusable node within the treeview.
- if `mulitple` then multiple nodes can be selected when the user clicks each node or using the selection keyboard binding on each node.

When clicking on a node, it is only selected if the click target was not interactive (_e.g._, clicking a checkbox or expander won't select the node, but clicking a label will).

## Model Data

Model data can be loaded either synchronously through the `initialModel` property or asynchronously through the `loadNodesAsync` property. If both are specified then the data from `initialModel` is overwritten when the `loadNodesAsync` function returns data.

The data passed to the treeview's `initialModel` prop or returned from `loadNodesAsync` should be an array of nodes, where each node should have:

* Required: A property with a value that will be used as the node's ID (by default the node looks for a property named `id`)
* Required: A property with a value that will be used as the node's label (by default the node looks for a property named `label`)
* Optional: A property containing any subnodes (by default the node looks for a property named `children`)
* Optional: A `treeNodeSpec` property that contains any data about the node's capabilities and its initial state
* Optional: Any other data you want on your node

The `treeNodeSpec` of the objects in the data model passed to the treeview's `initialModel` property will be updated by the treeview nodes themselves on creation to include missing properties.

```javascript
{
  id: "node0",
  label: "A checkbox node",
  children: [],
  treeNodeSpec: {
    title: "This will be the value of the node text/label's 'title' attribute.",
    expandable: true,
    selectable: false,
    focusable: true,
    input: {
      type: 'checkbox'
    },
    state: {
      expanded: true,
      selected: false,
      input: {
        value: false,
        disabled: false
      }
    }
  }
},
{
  otherIdProp: "node1",
  textProp: "A radio button node",
  subThings: [],
  extraIrrelevantData: "February",
  treeNodeSpec: {
    idProperty: "otherIdProp", // Customize what model props are checked for the id, label, and children
    labelProperty: "textProp",
    childrenProperty: "subThings",
    expandable: true,
    selectable: false,
    input: {
      type: 'radio',
      name: 'rbGroup1',   // Used as the name attribute for the radio button
      value: 'thisValue', // Used as the value attribute for the radio button
      isInitialRadioGroupValue: true // Indicates this should be the initially selected value for the group
    },
    state: {
      expanded: true,
      selected: false
      // No input.value here; to let complex radio button groupings work, state value is
      // bound to an internal tree-level property. input.disabled, however, is valid here for radio buttons.
    },
    addChildCallback: () => Promise.resolve({ id: '1', label: 'label' })
  }
}
```

The properties below can be specified for each node. Note that `id`, `label`, and `children` are the default properties nodes look for to get data, but the names of the properties can be overridden using the `treeNodeSpec`.

| Prop                 | Type            | Description                                                                | Default value                      | Required |
|:---------------------|:----------------|:---------------------------------------------------------------------------|:-----------------------------------|:---------|
| id                   | Number/String   | An ID that uniquely identifies this node within the tree                   | -                                  | Yes      |
| label                | String          | The text to show in the treeview                                           | -                                  | Yes      |
| children             | Array\<Object\> | The child nodes of this node                                               | `[]`                               |          |
| treeNodeSpec         | Object          | The object containing data about the node's capabilities and initial state | See next table                     |          |

The `treeNodeSpec` property contains any data about the node's capabilities and its initial state. This keeps the tree-specific data separate from the data of the model itself. This makes it more convenient to drop data into the treeview as-is, potentially with a `modelDefaults` specified on the treeview to define common values used in the `treeNodeSpec` of every node.

| Prop                 | Type     | Description                                                                               | Default value                      | Required |
|:---------------------|:---------|:------------------------------------------------------------------------------------------|:-----------------------------------|:---------|
| idProperty           | String   | The name of the property with a value that will be used as the node's ID                  | `id`                               |          |
| labelProperty        | String   | The name of the property with a value that will be used as the node's label               | `label`                            |          |
| childrenProperty     | String   | The name of the property with a value that will be used as the node's subnodes            | `children`                         |          |
| title                | String   | The text of the node's text or label's title attribute                                    | `null`                             |          |
| expandable           | Boolean  | True to show a toggle for expanding nodes' subnode lists                                  | `true`                             |          |
| selectable           | Boolean  | True to allow the node to be selected                                                     | `false`                            |          |
| deletable            | Boolean  | True to allow the node to be deleted                                                      | `false`                            |          |
| focusable            | Boolean  | True to make the node the focus when the treeview is focused                              | See [Aria](#focusable) for details |          |
| draggable            | Boolean  | True to make this node draggable                                                          | `false`                            |          |
| allowDrop            | Boolean  | True to allow dropping TreeViewNode data onto this node                                   | `false`                            |          |
| expanderTitle        | String   | The text to use as the title for the expander button                                      | `null`                             |          |
| addChildTitle        | String   | The text to use as the title for the Add Child button                                     | `null`                             |          |
| deleteTitle          | String   | The text to use as the title for the Delete button                                        | `null`                             |          |
| input                | Object   | Contains data specific to the node's `input` element                                      | `null`                             |          |
| input.type           | String   | The type of input; valid values are `checkbox` or `radio`                                 | -                                  | Yes*     |
| input.name           | String   | The name attribute of the input; used with `radio` type                                   | `'unspecifiedRadioName'`           |          |
| input.value          | String   | The value attribute of the input; used with `radio` type                                  | `label`'s value**                  |          |
| input.isInitialRadioGroupValue | Boolean | Indicates this should be the initially selected value for the group              | `null`                             |          |
| state                | Object   | Contains the current state of the node                                                    | -                                  |          |
| state.expanded       | Boolean  | True if this node's subnode list is expanded                                              | `false`                            |          |
| state.selected       | Boolean  | True if the node is selected                                                              | `false`                            |          |
| state.input          | Object   | Contains any state related to the input field                                             | `{}` for checkbox, otherwise -     |          |
| state.input.value    | Boolean  | Contains the value of the input                                                           | `false` for checkbox, otherwise -  |          |
| state.input.disabled | Boolean  | True if the node's input field is disabled                                                | `false`                            |          |
| customizations       | Object   | A [customizations](#customizing-the-treeview) object                                      | `{}`                               |          |
| addChildCallback     | Function | An async function that resolves to a new node model (called by the add button). The function can take one argument, the model of the parent node. It should return the model of the new child node. | `null` | |
| loadChildrenAsync    | Function | An async function that resolves to a node's children (called when the parent is expanded). The function can take one argument, the model of the parent node. It should return the models of the children nodes. | `null` | |

\* If `input.type` is not supplied, `input` is forced to `null`.

\*\* If `input.value` is not supplied, it defaults to the node's label value replaced with the regular expression `/[\s&<>"'\/]/g, ''`

## Default Data

If specified, the `modelDefaults` property of the treeview will be merged with node model's `treeNodeSpec` data such that any data not explicitly specified for the node will be set to the value from `modelDefaults`. This is useful for situations where all (or most) nodes will use the same values. For instance, in a treeview that is all enabled, collapsed, unchecked checkboxes the user could use a `modelDefaults` of

```javascript
{
  expandable: true,
  selectable: true,
  input: {
    type: 'checkbox',
  },
  state: {
    expanded: false,
    selected: false,
    input: {
      value: false,
      disabled: false
    }
  }
}
```

## Public Methods

| Method                 | Description                                 | Parameters | Returns                                                     |
|:-----------------------|:--------------------------------------------|:-----------|:------------------------------------------------------------|
| getCheckedCheckboxes   | Gets models for checked checkbox nodes      |            | An `Array<Object>` of models for checked checkbox nodes     |
| getCheckedRadioButtons | Gets models for checked radio nodes         |            | An `Array<Object>` of models for checked radio button nodes |
| getSelected            | Gets models for selected nodes              |            | An `Array<Object>` of models for selected nodes             |
| getMatching            | Gets models for nodes that match a function | `matcherFunction`: A function that takes a node model and returns a boolean indicating whether that node should be returned. | An `Array<Object>` of models for matched nodes |

## Events

| Event                      | Description                                                    | Handler Parameters                                                     |
|:---------------------------|:---------------------------------------------------------------|:-----------------------------------------------------------------------|
| treeViewNodeAdd            | Emitted when a node is added                                   | `target` The model of the target (child) node <br/> `parent` The model of the parent node <br/> `event` The original event |
| treeViewNodeClick          | Emitted when a node is clicked                                 | `target` The model of the target node <br/> `event` The original event |
| treeViewNodeDblclick       | Emitted when a node is double clicked                          | `target` The model of the target node <br/> `event` The original event |
| treeViewNodeDelete         | Emitted when a node is deleted                                 | `target` The model of the target node <br/> `event` The original event |
| treeViewNodeCheckboxChange | Emitted when a node's checkbox emits a change event            | `target` The model of the target node <br/> `event` The original event |
| treeViewNodeRadioChange    | Emitted when a node's radio button emits a change event        | `target` The model of the target node <br/> `event` The original event |
| treeViewNodeExpandedChange | Emitted when a node is expanded or collapsed                   | `target` The model of the target node <br/> `event` The original event |
| treeViewNodeSelectedChange | Emitted when a node is selected or deselected                  | `target` The model of the target node <br/> `event` The original event |
| treeViewNodeChildrenLoad   | Emitted when a node's children are done loading asynchronously | `target` The model of the target node <br/> `event` The original event |
| treeViewRootNodesLoad      | Emitted when the root nodes are done loading asynchronously    |                                                                        |

## CSS Classes

The display of the treeview can be customized via CSS using the following classes. Class names are organized in a hierarchy, so a containing node's class is the prefix of its child classes.

| Class                                  | Affects                                                                          |
|:---------------------------------------|:---------------------------------------------------------------------------------|
| `grtv`                                 | The top-level treeview list                                                      |
| `grtv-wrapper`                         | The wrapper div around the list of root nodes and the loading placeholder        |
| `grtv-loading`                         | The placeholder shown when root nodes are loading asynchronously                 |
| `grtvn`                                | A single node's list item                                                        |
| `grtvn-self-selected`                  | A selected node                                                                  |
| `grtvn-self`                           | The div containing the current node's UI                                         |
| `grtvn-self-expander`                  | The button used to expand the children                                           |
| `grtvn-self-expanded`                  | Applied to the expander button when the node is expanded                         |
| `grtvn-self-expanded-indicator`        | The `<i>` element containing the expansion indicator                             |
| `grtvn-self-spacer`                    | An empty spacer to replace fixed-width elements, _e.g._ the expander or checkbox |
| `grtvn-self-label`                     | The label for the checkbox of checkable nodes                                    |
| `grtvn-self-input`                     | Any type of input field within the tree node                                     |
| `grtvn-self-checkbox`                  | The checkbox                                                                     |
| `grtvn-self-radio`                     | The radio button                                                                 |
| `grtvn-self-text`                      | The text for a non-input node                                                    |
| `grtvn-self-action`                    | The action buttons (e.g., add child or delete)                                   |
| `grtvn-self-add-child-icon`            | The `<i>` element containing the add child icon                                  |
| `grtvn-self-delete-icon`               | The `<i>` element containing the delete icon                                     |
| `grtvn-self-drop-target`               | A node has another node dragged over it and can accept drops                     |
| `grtvn-self-child-drop-target`         | A node has another node dragged over its child drop target                       |
| `grtvn-self-sibling-drop-target`       | Either the previous or next sibling node drop target                             |
| `grtvn-self-sibling-drop-target-hover` | A node has another node dragged over one of the sibling drop targets             |
| `grtvn-self-prev-target`               | The previous sibling node drop target                                            |
| `grtvn-self-next-target`               | The next sibling node drop target                                                |
| `grtvn-children-wrapper`               | The wrapper div around the list of child nodes and the loading placeholder       |
| `grtvn-children`                       | The list of child nodes                                                          |
| `grtvn-loading`                        | The placeholder shown when child nodes are loading asynchronously                |
| `grtvn-dragging`                       | The node is dragged as part of a drag and drop operation                         |

## Customizing the TreeView

### Customizations Property

It's often helpful to be able to make adjustments to the markup or styles for the tree. You can provide an object to the `modelDefaults.customizations` property of the tree to set a customization affecting all nodes, or to the `treeNodeSpec.customizations` property of a single node. Node-specific customizations will override `modelDefault` customizations.

A customizations object may have the following properties:

| Prop                                      | Type   | Description                                                                                  |
|:------------------------------------------|:-------|:---------------------------------------------------------------------------------------------|
| classes                                   | Object | Properties are classes to add for various parts of a node                                    |
| classes.treeViewNode                      | String | Classes to add to a node's list item                                                         |
| classes.treeViewNodeSelf                  | String | Classes to add to the div containing the current node's UI                                   |
| classes.treeViewNodeSelfSelected          | String | Classes to add to the `grtvn-self` div if the node is selected                               |
| classes.treeViewNodeSelfExpander          | String | Classes to add to the button used to expand the children                                     |
| classes.treeViewNodeSelfExpanded          | String | Classes to add to the expander button when the node is expanded                              |
| classes.treeViewNodeSelfExpandedIndicator | String | Classes to add to the `<i>` element containing the expansion indicator                       |
| classes.treeViewNodeSelfSpacer            | String | Classes to add to the fixed-width spacer                                                     |
| classes.treeViewNodeSelfLabel             | String | Classes to add to the label for the checkbox of checkable nodes                              |
| classes.treeViewNodeSelfInput             | String | Classes to add to an input field                                                             |
| classes.treeViewNodeSelfCheckbox          | String | Classes to add to the checkbox                                                               |
| classes.treeViewNodeSelfRadio             | String | Classes to add to the radio button                                                           |
| classes.treeViewNodeSelfText              | String | Classes to add to the text for a non-input node                                              |
| classes.treeViewNodeSelfAction            | String | Classes to add to the action buttons                                                         |
| classes.treeViewNodeSelfAddChild          | String | Classes to add to the add child buttons                                                      |
| classes.treeViewNodeSelfAddChildIcon      | String | Classes to add to the `<i>` element containing the add child icon                            |
| classes.treeViewNodeSelfDelete            | String | Classes to add to the delete button                                                          |
| classes.treeViewNodeSelfDeleteIcon        | String | Classes to add to the `<i>` element containing the delete icon                               |
| classes.treeViewNodeChildrenWrapper       | String | Classes to add to the wrapper div around the list of child nodes and the loading placeholder |
| classes.treeViewNodeChildren              | String | Classes to add to the list of child nodes                                                    |
| classes.treeViewNodeLoading               | String | Classes to add to the node children loading placeholder                                      |

### Skins

If adding classes isn't enough, the entire default styles of the TreeView can be overridden using the `skinClass` property of the TreeView. When this property is set, the TreeView's default class of `grtv-default-skin` is replaced with your own class name, causing all of the built-in style selectors to not match the tree. Instead, you can create your own stylesheet or modify a copy of the default styles to achieve complete control over the tree styling.

### Slots

Sometimes the entire content of a node (_e.g._, the checkbox or text) needs customization beyond what is available through classes. In this case, some slots are available in the TreeView to allow this customization.

| Slot Name    | Description                                                 | Props                                                                                              |
|:-------------|:------------------------------------------------------------|:---------------------------------------------------------------------------------------------------|
| loading-root | Replaces the span used when loading children asynchronously |                                                                                                    |
| text         | Replaces the span used for non-input content                | model - The TreeViewNode's model                                                                   |
|              |                                                             | customClasses - Any custom classes specified in `treeNodeSpec.customizations`                      |
| checkbox     | Replaces the label and content used for checkboxes          | model - The TreeViewNode's model                                                                   |
|              |                                                             | customClasses - Any custom classes specified in `treeNodeSpec.customizations`                      |
|              |                                                             | inputId - The ID for the input (as generated by the TreeViewNode)                                  |
|              |                                                             | checkboxChangeHandler - The handler for checkbox change events. You should fire this on `change`.  |
| radio        | Replaces the label and content used for radio buttons       | model - The TreeViewNode's model                                                                   |
|              |                                                             | customClasses - Any custom classes specified in `treeNodeSpec.customizations`                      |
|              |                                                             | inputId - The ID for the input (as generated by the TreeViewNode)                                  |
|              |                                                             | radioChangeHandler - The handler for radio button change events. You should fire this on `change`. |
| loading      | Replaces the span used when loading children asynchronously | model - The TreeViewNode's model                                                                   |
|              |                                                             | customClasses - Any custom classes specified in `treeNodeSpec.customizations`                      |

Example usage:

```html
<tree-view id="customtree" :initial-model="model">
  <template #text="{ model, customClasses }">
    <!-- The treeview node's model is available, and built-in classes and overrides are available -->
    <em :title="model.treeNodeSpec.title"
              class="grtvn-self-text"
              :class="customClasses.treeViewNodeSelfText">
          {{ model[model.treeNodeSpec.labelProperty] }}
    </em>
  </template>

  <template #checkbox="{ model, customClasses, inputId, checkboxChangeHandler }">
    <label :for="inputId"
        :title="model.treeNodeSpec.title"
        class="grtvn-self-label"
        :class="customClasses.treeViewNodeSelfLabel">

      <!-- The generated inputId for the node is available -->
      <input :id="inputId"
             class="my-awesome-checkbox-class"
             type="checkbox"
             :disabled="model.treeNodeSpec.state.input.disabled"
             v-model="model.treeNodeSpec.state.input.value"
             @change="checkboxChangeHandler" /> <!-- The TreeViewNode change handler is available -->

      <em>{{ "Slotted Content for " + model[model.treeNodeSpec.labelProperty] }}</em>
    </label>
  </template>
</tree-view>
```

## Asynchronous Loading

Child nodes can be loaded asynchronously by providing a method to the `treeNodeSpec.loadChildrenAsync` property of the model. The method will be called when the node is expanded, and the property containing the node's children will be _overwritten_ with the results of the async call. For example, the following could be used as `modelDefaults` that would have every node load children when it was expanded.

```javascript
{
  expandable: true,
  loadChildrenAsync: (m) => axios.get(`/children/${m.id}`)
}
```

The method may accept one argument, which will be the model of the node that has been expanded. It should resolve to an array of child node models.

The load method is called once, and after that the children are part of the model and are not reloaded.

## Drag and Drop

A user can drag and drop an individual TreeViewNode. A drag only affects the node where the dragging starts, and has nothing to do with any node selection within the tree. To make a node draggable, the node's `treeNodeSpec.draggable` must be `true`. To make a node accept drops, the node's `treeNodeSpec.allowDrop` must be `true`. Both Move and Copy operations are supported. To copy in most browsers hold down the `Ctrl` key while dragging.

When dropping a node on another node, there are three areas of the target node where a drop can occur. If dropped at the top of the target node in the shaded area then the node will be inserted before the target. If dropped at the bottom of the target node in the shaded area then the node will be inserted after the target. If dropped directly on the of the target node then the node will be inserted as a child of the target. The drop can occur on a node in the same tree or in a different tree as long as the receiving node allows drops.

The drop can also occur anywhere that allows dropping data with the `application/json` or `text/plain` MIME types (_e.g._, a simple text input field or a text editor).

When copying a node the newly created node will have its own unique identifier, will not be the currently focusable node even if the source node was the focusable node.

When moving a node within the same tree, the actual node is moved within the tree data. If the node is copied within the same tree, any function members of the node data (_e.g._, the addChildCallback) are copied.

When a node is moved or copied to a different tree, the node data that passes between trees does not contain any of the functions from the original node data.

## Aria

ARIA Accessibility recommendations have been implemented at a basic level. This means keyboard navigation follows ARIA recommendations, but the component has not been tested with a screen reader and, since many screen readers exhibit different behaviors for treeview controls anyway, it would be expected to fail articulation checks in many cases. Additionally, some recommended keyboard controls are not implemented (e.g., Expand All Nodes, Type-ahead Focusing). When using the component, there are only a couple of things you need to know.

### Setting Key Bindings

The keys used to navigate the treeview can be customized using the `customAriaKeyMap` prop of the TreeView component. The value of the prop is an object, with each attribute named for a type of action and its value as an Array of integer key codes that trigger that action.

| Attribute           | Description                                                                                            | Default value            |
|:--------------------|:-------------------------------------------------------------------------------------------------------|:-------------------------|
| activateItem        | Triggers the default action for input nodes (generally `click`)                                        | `[32]` (Space)           |
| selectItem          | Selects the currently focused item                                                                     | `[13]` (Enter)           |
| focusLastItem       | Sets focus to the last visible item in the tree                                                        | `[35]` (End)             |
| focusFirstItem      | Sets focus to the first visible item in the tree                                                       | `[36]` (Home)            |
| collapseFocusedItem | Collapses the currently focused item, if expanded; otherwise focuses the parent node if one exists     | `[37]` (Left)            |
| expandFocusedItem   | Expands the currently focused item, if collapsed; otherwise focuses the first child node if one exists | `[39]` (Right)           |
| focusPreviousItem   | Focuses the previous visible node* in the tree if one exists.                                          | `[38]` (Up)              |
| focusNextItem       | Focuses the next visible node** in the tree if one exists.                                             | `[40]` (Down)            |
| insertItem          | Fires the callback to add a new node if the callback exists                                            | `[45]` (Insert)          |
| deleteItem          | Deletes the current node, if deletable                                                                 | `[46]` (Delete)          |

\* The previous visible node is a)the focused node's previous sibling's last child if visible, b)the previous sibling if it has no children or is collapsed, or c)the parent node.

\*\* The next visible node is a)the focused node's first child if one exists and the focused node is expanded, b)the focused node's next sibling if one exists, or c)the focused node's parent's next sibling if one exists.

### Focusable

The treeview uses a roaming tab index to maintain focusability in the tree. A node model can specify a `treeNodeSpec.focusable` property of `true` in order for that node to be used as the initial target of keyboard focus within the treeview. If multiple node models specify this then only the first will have `treeNodeSpec.focusable` set to `true` once the treeview is intialized. If no models have it specified then the first selected node in the treeview is given a `treeNodeSpec.focusable` of `true`. If there are no selected nodes then the first node in the treeview is given a `treeNodeSpec.focusable` of `true`.

### More about ARIA TreeViews

[WAI-ARIA Authoring Best Practices, Tree View](https://www.w3.org/TR/wai-aria-practices-1.1/#TreeView)