<template>
  <!--
      A Component meant to be used internally by the TreeView component. See the documentation
      for a description of the expected data format.
  -->
  <li :id="nodeId"
      ref="nodeElement"
      class="grtvn"
      :class="[customClasses.treeViewNode,
               tns._.dragging ? 'grtvn-dragging' : '']"
      role="treeitem"
      :tabindex="ariaTabIndex"
      :aria-expanded="ariaExpanded"
      :aria-selected="ariaSelected"
      @keydown="$_grtvnAria_onKeyDown">

    <div class="grtvn-self"
         :class="[customClasses.treeViewNodeSelf,
                  isEffectivelySelected ? 'grtvn-self-selected' : '',
                  isEffectivelySelected ? customClasses.treeViewNodeSelfSelected : '',
                  tns._.isDropTarget ? 'grtvn-self-drop-target': '',
                  tns._.isChildDropTarget ? 'grtvn-self-child-drop-target': '']"
         :draggable="tns.draggable"
         :dragging="tns._.dragging"
         @click="$_grtvn_onClick"
         @dblclick="$_grtvn_onDblclick"
         @dragend="$_grtvnDnd_onDragend"
         @dragenter="$_grtvnDnd_onDragenter"
         @dragleave="$_grtvnDnd_onDragleave"
         @dragover="$_grtvnDnd_onDragover"
         @dragstart="$_grtvnDnd_onDragstart"
         @drop="$_grtvnDnd_onDrop">

      <!-- Top Drop Target -->
      <div class="grtvn-self-sibling-drop-target grtvn-self-prev-target"
           :class="[tns._.isPrevDropTarget ? 'grtvn-self-sibling-drop-target-hover': '']"></div>

      <!-- Expander -->
      <button :id="expanderId"
              type="button"
              v-if="canExpand"
              aria-hidden="true"
              tabindex="-1"
              :title="tns.expanderTitle"
              class="grtvn-self-expander"
              :class="[customClasses.treeViewNodeSelfExpander,
                       tns.state.expanded ? 'grtvn-self-expanded' : '',
                       tns.state.expanded ? customClasses.treeViewNodeSelfExpanded : '']"
              @click="$_grtvn_onExpandedChange">
              <i class="grtvn-self-expanded-indicator"
                 :class="customClasses.treeViewNodeSelfExpandedIndicator"></i></button>
      <span v-else
            class="grtvn-self-spacer"
            :class="customClasses.treeViewNodeSelfSpacer"></span>

      <!-- Inputs and labels -->
      <!-- Checkbox -->
      <slot v-if="tns.input && tns.input.type === 'checkbox'"
            name="checkbox"
            :model="model"
            :customClasses="customClasses"
            :inputId="inputId"
            :checkboxChangeHandler="$_grtvn_onCheckboxChange">

        <label :for="inputId"
               :title="tns.title"
               class="grtvn-self-label"
               :class="customClasses.treeViewNodeSelfLabel">

          <input :id="inputId"
                 tabindex="-1"
                 class="grtvn-self-input grtvn-self-checkbox"
                 :class="[customClasses.treeViewNodeSelfInput, customClasses.treeViewNodeSelfCheckbox]"
                 type="checkbox"
                 :disabled="tns.state.input.disabled"
                 v-model="tns.state.input.value"
                 @change="$_grtvn_onCheckboxChange" />

          {{ label }}
        </label>
      </slot>

      <!-- Radiobutton -->
      <slot v-else-if="tns.input && tns.input.type === 'radio'"
            name="radio"
            :model="model"
            :customClasses="customClasses"
            :inputId="inputId"
            :inputModel="radioGroupValues[tns.input.name]"
            :radioChangeHandler="$_grtvn_onRadioChange">

        <label :for="inputId"
               :title="tns.title"
               class="grtvn-self-label"
               :class="customClasses.treeViewNodeSelfLabel">

          <input :id="inputId"
                 tabindex="-1"
                 class="grtvn-self-input grtvn-self-radio"
                 :class="[customClasses.treeViewNodeSelfInput, customClasses.treeViewNodeSelfRadio]"
                 type="radio"
                 :name="tns.input.name"
                 :value="tns.input.value"
                 :disabled="tns.state.input.disabled"
                 v-model="radioGroupValues[tns.input.name]"
                 @change="$_grtvn_onRadioChange" />

          {{ label }}
        </label>
      </slot>

      <!-- Text (if not an input) -->
      <slot v-else
            name="text"
            :model="model"
            :customClasses="customClasses">

        <span :title="tns.title"
              class="grtvn-self-text"
              :class="customClasses.treeViewNodeSelfText">
          {{ label }}
        </span>
      </slot>

      <!-- Add Child button -->
      <button :id="addChildId"
              type="button"
              v-if="tns.addChildCallback"
              aria-hidden="true"
              tabindex="-1"
              :title="tns.addChildTitle"
              class="grtvn-self-action"
              :class="[customClasses.treeViewNodeSelfAction, customClasses.treeViewNodeSelfAddChild]"
              @click="$_grtvn_onAddChild">
        <i class="grtvn-self-add-child-icon"
            :class="customClasses.treeViewNodeSelfAddChildIcon"></i>
      </button>

      <!-- Delete button -->
      <button :id="deleteId"
              type="button"
              v-if="tns.deletable"
              aria-hidden="true"
              tabindex="-1"
              :title="tns.deleteTitle"
              class="grtvn-self-action"
              :class="[customClasses.treeViewNodeSelfAction, customClasses.treeViewNodeSelfDelete]"
              @click="$_grtvn_onDelete">
        <i class="grtvn-self-delete-icon"
            :class="customClasses.treeViewNodeSelfDeleteIcon"></i>
      </button>

      <!-- Bottom Drop Target -->
      <div class="grtvn-self-sibling-drop-target grtvn-self-next-target"
           :class="[tns._.isNextDropTarget ? 'grtvn-self-sibling-drop-target-hover': '']"></div>
    </div>

    <!-- Children and Loading Placholder -->
    <div class="grtvn-children-wrapper"
            :class="customClasses.treeViewNodeChildrenWrapper">
      <slot v-if="tns.state.expanded && !areChildrenLoaded"
            name="loading"
            :model="model"
            :customClasses="customClasses">

        <span class="grtvn-loading"
              :class="customClasses.treeViewNodeLoading">
          ...
        </span>
      </slot>
      <ul v-show="tns.state.expanded"
          v-if="this.hasChildren"
          class="grtvn-children"
          :class="customClasses.treeViewNodeChildren"
          role="group"
          :aria-hidden="!tns.state.expanded">
        <TreeViewNode v-for="nodeModel in children"
                      :key="nodeModel[tns && tns.idProperty ? tns.idProperty : 'id']"
                      :depth="depth + 1"
                      :initial-model="nodeModel"
                      :model-defaults="modelDefaults"
                      :parent-id="id"
                      :selection-mode="selectionMode"
                      :tree-id="treeId"
                      :initial-radio-group-values="radioGroupValues"
                      :aria-key-map="ariaKeyMap"
                      :is-mounted="isMounted"
                      @treeViewNodeClick="(t, e)=>$emit(TvEvent.Click, t, e)"
                      @treeViewNodeDblclick="(t, e)=>$emit(TvEvent.DoubleClick, t, e)"
                      @treeViewNodeCheckboxChange="(t, e)=>$emit(TvEvent.CheckboxChange, t, e)"
                      @treeViewNodeRadioChange="(t, e)=>$emit(TvEvent.RadioChange, t, e)"
                      @treeViewNodeExpandedChange="(t, e)=>$emit(TvEvent.ExpandedChange, t, e)"
                      @treeViewNodeChildrenLoad="(t, e)=>$emit(TvEvent.ChildrenLoad, t, e)"
                      @treeViewNodeSelectedChange="(t, e)=>$emit(TvEvent.SelectedChange, t, e)"
                      @treeViewNodeAdd="(t, p, e)=>$emit(TvEvent.Add, t, p, e)"
                      @treeViewNodeDelete="$_grtvn_handleChildDeletion"
                      @treeViewNodeAriaFocusableChange="(t)=>$emit(TvEvent.FocusableChange, t)"
                      @treeViewNodeAriaRequestParentFocus="$_grtvnAria_focus"
                      @treeViewNodeAriaRequestFirstFocus="()=>$emit(TvEvent.RequestFirstFocus)"
                      @treeViewNodeAriaRequestLastFocus="()=>$emit(TvEvent.RequestLastFocus)"
                      @treeViewNodeAriaRequestPreviousFocus="$_grtvnAria_handlePreviousFocus"
                      @treeViewNodeAriaRequestNextFocus="$_grtvnAria_handleNextFocus"
                      @treeViewNodeDragMove="$_grtvnDnd_dragMoveChild"
                      @treeViewNodeDrop="$_grtvnDnd_drop">
          <template #checkbox="{ model, customClasses, inputId, checkboxChangeHandler }">
            <slot name="checkbox" :model="model" :customClasses="customClasses" :inputId="inputId" :checkboxChangeHandler="checkboxChangeHandler"></slot>
          </template>
          <template #radio="{ model, customClasses, inputId, inputModel, radioChangeHandler }">
            <slot name="radio" :model="model" :customClasses="customClasses" :inputId="inputId" :inputModel="inputModel" :radioChangeHandler="radioChangeHandler"></slot>
          </template>
          <template #text="{ model, customClasses }">
            <slot name="text" :model="model" :customClasses="customClasses"></slot>
          </template>
          <template #loading="{ model, customClasses }">
            <slot name="loading" :model="model" :customClasses="customClasses"></slot>
          </template>
        </TreeViewNode>
      </ul>
    </div>
  </li>
</template>

<script>
  import NodeDataNormalizer from '../mixins/NodeDataNormalizer';
  import TreeViewNodeAria from '../mixins/TreeViewNodeAria';
  import TreeViewNodeDragAndDrop from '../mixins/TreeViewNodeDragAndDrop';
  import SelectionMode from '../enums/selectionMode';
  import TvEvent from '../enums/event';

  export default {
    name: 'TreeViewNode',
    mixins: [
      NodeDataNormalizer,
      TreeViewNodeAria,
      TreeViewNodeDragAndDrop
    ],
    props: {
      depth: {
        type: Number,
        required: true
      },
      initialModel: {
        type: Object,
        required: true
      },
      isMounted: {
        type: Boolean,
        required: true
      },
      modelDefaults: {
        type: Object,
        required: true
      },
      initialRadioGroupValues: {
        type: Object,
        required: true
      },
      selectionMode: {
        type: String,
        required: false,
        default: SelectionMode.None,
        validator: function (value) {
          return Object.values(SelectionMode).includes(value);
        }
      },
      treeId: {
        type: String,
        required: true
      }
    },
    emits: [
      TvEvent.Add,
      TvEvent.Click,
      TvEvent.CheckboxChange,
      TvEvent.ChildrenLoad,
      TvEvent.Delete,
      TvEvent.DoubleClick,
      TvEvent.ExpandedChange,
      TvEvent.FocusableChange,
      TvEvent.RadioChange,
      TvEvent.RequestFirstFocus,
      TvEvent.RequestLastFocus,
      TvEvent.SelectedChange
    ],
    data() {
      return {
        elementsThatIgnoreClicks: 'input, .grtvn-self-expander, .grtvn-self-expander *, .grtvn-self-action, .grtvn-self-action *',
        model: this.initialModel,
        radioGroupValues: this.initialRadioGroupValues
      }
    },
    computed: {
      addChildId() {
        return `${this.nodeId}-add-child`;
      },
      areChildrenLoaded() {
        const tns = this.tns;
        return typeof tns.loadChildrenAsync !== 'function' || tns._.state.areChildrenLoaded;
      },
      ariaExpanded() {
        return this.canExpand ? this.tns.state.expanded : null;
      },
      ariaSelected() {
        // If selection isn't allowed, don't add an aria-selected attribute.
        // If the tree contains nodes that are not selectable, those nodes do not have the aria-selected state.
        if (this.selectionMode === SelectionMode.None || !this.tns.selectable) {
          return null;
        }

        // https://www.w3.org/TR/wai-aria-practices-1.1/#tree_roles_states_props
        // If the tree does not support multiple selection, aria-selected is set to true
        // for the selected node and it is not present on any other node in the tree.
        if (this.selectionMode !== SelectionMode.Multiple) {
          return this.tns.state.selected ? true : null;
        }

        // If the tree supports multiple selection:
        //   All selected nodes have aria-selected set to true.
        //   All nodes that are selectable but not selected have aria-selected set to false.
        return this.tns.state.selected;
      },
      canExpand() {
        // A node can be expanded if it is expandable and either has children or has not
        // yet had the asynchronous loader for children called.
        return this.mayHaveChildren && this.tns.expandable;
      },
      children() {
        return this.model[this.childrenPropName];
      },
      childrenPropName() {
        return this.tns.childrenProperty || 'children';
      },
      customClasses() {
        return (this.tns.customizations || {}).classes || {};
      },
      deleteId() {
        return `${this.nodeId}-delete`;
      },
      expanderId() {
        return `${this.nodeId}-exp`;
      },
      hasChildren() {
        return this.children && this.children.length > 0;
      },
      id() {
        return this.model[this.idPropName];
      },
      idPropName() {
        return this.tns.idProperty || 'id';
      },
      inputId() {
        return `${this.nodeId}-input`;
      },
      isEffectivelySelected() {
        return this.selectionMode !== SelectionMode.None && this.tns.selectable && this.tns.state.selected;
      },
      label() {
        return this.model[this.labelPropName];
      },
      labelPropName() {
        return this.tns.labelProperty || 'label';
      },
      mayHaveChildren() {
        return this.hasChildren || !this.areChildrenLoaded;
      },
      nodeId() {
        return `${this.treeId}-${this.id}`;
      },
      tns() {
        return this.model.treeNodeSpec;
      },
      TvEvent() {
        return TvEvent;
      }
    },
    created() {
      this.$_grndn_normalizeNodeData();

      // id and label are required; notify the user. Validation is done here instead
      // of at the prop level due to dependency on multiple props at once and defaulting
      // that takes place in the normalization process
      if (!this.id || (typeof this.id !== 'number' && typeof this.id !== 'string')) {
        console.error(`initialModel id is required and must be a number or string. Expected prop ${this.idPropName} to exist on the model.`);
      }
      if(!this.label || typeof this.label !== 'string') {
        console.error(`initialModel label is required and must be a string. Expected prop ${this.labelPropName} to exist on the model.`);
      }
    },
    watch: {
      'model.treeNodeSpec.state.selected': function(newValue) {
          this.$emit(TvEvent.SelectedChange, this.model);
      }
    },
    methods: {
      /**
       * Pass the event for checkbox changes up from the node.
       * Emits a treeViewNodeCheckboxChange event
       * @param {Event} event The event that triggered the change
       */
      $_grtvn_onCheckboxChange(event) {
        this.$emit(TvEvent.CheckboxChange, this.model, event);
      },
      /**
       * Pass the event for radio button changes up from the node.
       * Emits a treeViewNodeRadioChange event
       * @param {Event} event The event that triggered the change
       */
      $_grtvn_onRadioChange(event) {
        this.$emit(TvEvent.RadioChange, this.model, event);
      },
      /**
       * Expand the children of this node, starting an asynchronous load if needed.
       * Emits a treeViewNodeExpandedChange event. When children are loaded asynchronously,
       * Emits a treeViewNodeChildrenLoad event.
       * @param {Event} event The event that triggered the expansion toggle
       */
      async $_grtvn_onExpandedChange(event) {
        let spec = this.tns;

        // First expand the node (to show either children or a "loading" indicator)
        spec.state.expanded = !spec.state.expanded;
        this.$emit(TvEvent.ExpandedChange, this.model, event);

        // If children need to be loaded asynchronously, load them.
        if (spec.state.expanded && !spec._.state.areChildrenLoaded && !spec._.state.areChildrenLoading) {

          spec._.state.areChildrenLoading = true;
          var childrenResult = await spec.loadChildrenAsync(this.model);

          if (childrenResult) {
            spec._.state.areChildrenLoaded = true;
            this.children.splice(0, this.children.length, ...childrenResult);
            this.$emit(TvEvent.ChildrenLoad, this.model, event);
          }

          spec._.state.areChildrenLoading = false;
        }
      },
      /**
       * Handle toggling the selected state for this node for Single and Multiple selection modes.
       * Note that for SelectionFollowsFocus mode the selection change is already handled by the
       * "model.treeNodeSpec.focusable" watcher method in TreeViewNodeAria.
       * @param {Event} event The event that triggered the selection toggle
       */
      $_grtvn_toggleSelected(event) {
        if (this.tns.selectable && [SelectionMode.Single, SelectionMode.Multiple].includes(this.selectionMode)) {
          this.tns.state.selected = !this.tns.state.selected;
        }
      },
      /**
       * Handles clicks on the node. It only performs actions if the click happened on an element
       * that does not have node clicks explicitly ingored (e.g., the expander button).
       * Emits a treeViewNodeClick event.
       * @param {Event} event The click event
       */
      $_grtvn_onClick(event) {
        // Don't fire this if the target is an element which has its own events
        if (!matches(event.target, this.elementsThatIgnoreClicks)) {
          this.$emit(TvEvent.Click, this.model, event);
          this.$_grtvn_toggleSelected(event);
        }

        this.$_grtvnAria_onClick();
      },
      /**
       * Handles double clicks on the node. It only performs actions if the double click happened on an
       * element that does not have node clicks explicitly ingored (e.g., the expander button).
       * Emits a treeViewNodeDblclick event.
       * @param {Event} event The dblclick event
       */
      $_grtvn_onDblclick(event) {
        // Don't fire this if the target is an element which has its own events
        if (!matches(event.target, this.elementsThatIgnoreClicks)) {
          this.$emit(TvEvent.DoubleClick, this.model, event);
        }
      },
      /**
       * Add a child node to the end of the child nodes list. The child node data is
       * supplied by an async callback which is the addChildCallback parameter of this node's model.
       * Emits a treeViewNodeAdd if a node is added
       * @param {Event} event The event that triggered the add
       */
      async $_grtvn_onAddChild(event) {
        if (this.tns.addChildCallback) {
          var childModel = await this.tns.addChildCallback(this.model);

          if (childModel) {
            this.children.push(childModel);
            this.$emit(TvEvent.Add, childModel, this.model, event);
          }
        }
      },
      $_grtvn_onDelete(event) {
        if (this.tns.deletable) {
          this.$emit(TvEvent.Delete, this.model, event);
        }
      },
      /**
       * Removes the given node from the array of children if found.
       * Note that only the node that was deleted fires these, not any subnode, so
       * this comes from a request from the child node for this node to delete it.
       * This emits the treeViewNodeDelete event.
       * @param node {TreeViewNode} The node to remove
       * @param event {Event} The initial event that triggered the deletion
       */
      $_grtvn_handleChildDeletion(node, event) {
        // Remove the node from the array of children if this is an immediate child.
        // Note that only the node that was deleted fires these, not any subnode.
        let targetIndex = this.children.indexOf(node);
        if (targetIndex > -1) {
          this.$_grtvnAria_handleChildDeletion(node);
          this.children.splice(targetIndex, 1);
        }

        this.$emit(TvEvent.Delete, node, event);
      }
    },
  };

  /**
   * Returns true if the given element matches the given selector.
   * @param {Element} target The target element to check
   * @param {string} selector The selector to check the target against
   * @returns {Boolean} True if the target element matches the selector, false otherwise.
   */
  function matches(target, selector) {
    let matchFn = target.matches || target.msMatchesSelector || target.webkitMatchesSelector;
    return matchFn && matchFn.call(target, selector);
  }

</script>

<style>
  .grtvn {
  	 --baseHeight: 1.2rem;
  	 --itemSpacing: 1.2rem;
  }
   .grtv-wrapper.grtv-default-skin .grtvn {
  	 padding-left: 0;
  }
   .grtv-wrapper.grtv-default-skin .grtvn:first-child {
  	 margin-top: 0;
  }
   .grtv-wrapper.grtv-default-skin .grtvn[role="treeitem"]:focus {
  	 outline: 0;
  }
   .grtv-wrapper.grtv-default-skin .grtvn[role="treeitem"]:focus > .grtvn-self {
  	 outline: black dotted 1px;
  }
   .grtv-wrapper.grtv-default-skin .grtvn-self {
  	 display: flex;
  	 align-items: flex-start;
  	 line-height: var(--baseHeight);
  }
   .grtv-wrapper.grtv-default-skin .grtvn-dragging .grtvn-self {
  	 opacity: 0.5;
  }
   .grtv-wrapper.grtv-default-skin .grtvn-self-drop-target {
  	 flex-wrap: wrap;
  }
   .grtv-wrapper.grtv-default-skin .grtvn-self-drop-target.grtvn-self-child-drop-target {
  	 opacity: 0.5;
  }
   .grtv-wrapper.grtv-default-skin .grtvn-self-drop-target .grtvn-self-sibling-drop-target {
  	 width: 100%;
  	 height: 7px;
  	 background-color: #ddd;
  }
   .grtv-wrapper.grtv-default-skin .grtvn-self-drop-target .grtvn-self-sibling-drop-target.grtvn-self-sibling-drop-target-hover {
	 background-color: #bbb;
  }
   .grtv-wrapper.grtv-default-skin .grtvn-self-expander {
  	 padding: 0;
  	 background: none;
  	 border: none;
  	 height: var(--baseHeight);
  }
   .grtv-wrapper.grtv-default-skin .grtvn-self-expander i.grtvn-self-expanded-indicator {
  	 font-style: normal;
  }
   .grtv-wrapper.grtv-default-skin .grtvn-self-expander i.grtvn-self-expanded-indicator::before {
  	 content: '+';
  }
   .grtv-wrapper.grtv-default-skin .grtvn-self-expander.grtvn-self-expanded i.grtvn-self-expanded-indicator::before {
  	 content: '-';
  }
   .grtv-wrapper.grtv-default-skin .grtvn-self-selected {
  	 background-color: #f0f0f8;
  }
  .grtv-wrapper.grtv-default-skin .grtvn-self-expander, .grtv-wrapper.grtv-default-skin .grtvn-self-checkbox, 
  .grtv-wrapper.grtv-default-skin .grtvn-self-radio, .grtv-wrapper.grtv-default-skin .grtvn-self-spacer, 
  .grtv-wrapper.grtv-default-skin .grtvn-self-action {
	   min-width: 1rem;
  }
   .grtv-wrapper.grtv-default-skin .grtvn-self-expander, .grtv-wrapper.grtv-default-skin .grtvn-self-spacer {
  	 margin: 0;
  }
   .grtv-wrapper.grtv-default-skin .grtvn-self-checkbox, .grtv-wrapper.grtv-default-skin .grtvn-self-radio {
  	 margin: 0 0 0 -var(--itemSpacing);
  }
   .grtv-wrapper.grtv-default-skin .grtvn-self-text, .grtv-wrapper.grtv-default-skin .grtvn-self-label {
  	 margin-left: var(--itemSpacing);
  }
   .grtv-wrapper.grtv-default-skin .grtvn-self-action {
  	 padding: 0;
  	 background: none;
  	 border: none;
  	 height: var(--baseHeight);
  }
   .grtv-wrapper.grtv-default-skin i.grtvn-self-add-child-icon {
  	 font-style: normal;
  }
   .grtv-wrapper.grtv-default-skin i.grtvn-self-add-child-icon::before {
  	 content: '+';
  }
   .grtv-wrapper.grtv-default-skin i.grtvn-self-delete-icon {
  	 font-style: normal;
  }
   .grtv-wrapper.grtv-default-skin i.grtvn-self-delete-icon::before {
  	 content: 'x';
  }
   .grtv-wrapper.grtv-default-skin .grtvn-children-wrapper {
  	 margin: 0 0 0 1remvar(--itemSpacing);
  }
   .grtv-wrapper.grtv-default-skin .grtvn-children {
  	 padding: 0;
  	 list-style: none;
  }
</style>
