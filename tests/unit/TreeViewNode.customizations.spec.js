import { expect } from 'chai';
import { mount } from '@vue/test-utils';
import TreeViewNode from '../../src/components/TreeViewNode.vue';
import { generateNodes } from '../data/node-generator.js';
import SelectionMode from '../../src/enums/selectionMode';

const getDefaultPropsData = function () {
  return {
    ariaKeyMap: {
      activateItem: [32], // Space
      selectItem: [13], // Enter
      focusLastItem: [35], // End
      focusFirstItem: [36], // Home
      collapseFocusedItem: [37], // Left
      expandFocusedItem: [39], // Right
      focusPreviousItem: [38], // Up
      focusNextItem: [40], // Down
      insertItem: [45], // Insert
      deleteItem: [46] // Delete
    },
    initialModel: generateNodes(['ces'])[0],
    modelDefaults: {},
    depth: 0,
    treeId: 'tree-id',
    initialRadioGroupValues: {},
    isMounted: false
  }
};

function createWrapper(customPropsData, slotsData) {
  return mount(TreeViewNode, {
    sync: false,
    props: customPropsData || getDefaultPropsData(),
    slots: slotsData
  });
}

describe('TreeViewNode.vue (customizations)', () => {

  let wrapper = null;

  afterEach(() => {
    wrapper = null;
  });

  describe('when given custom classes', () => {

    const customizations = {
      classes: {
        treeViewNode: 'customnodeclass',
        treeViewNodeSelf: 'customnodeselfclass',
        treeViewNodeSelfExpander: 'customnodeselfexpanderclass',
        treeViewNodeSelfExpanded: 'customnodeselfexpandedclass',
        treeViewNodeSelfExpandedIndicator: 'customnodeselfexpandedindicatorclass',
        treeViewNodeSelfSelected: 'customnodeselfselectedclass',
        treeViewNodeSelfSpacer: 'customnodeselfspacerclass',
        treeViewNodeSelfLabel: 'customnodeselflabelclass',
        treeViewNodeSelfInput: 'customnodeselfinputclass',
        treeViewNodeSelfCheckbox: 'customnodeselfcheckboxclass',
        treeViewNodeSelfRadio: 'customnodeselfradioclass',
        treeViewNodeSelfText: 'customnodeselftextclass',
        treeViewNodeSelfAction: 'customnodeselfactionclass',
        treeViewNodeSelfAddChild: 'customnodeselfaddchildclass',
        treeViewNodeSelfAddChildIcon: 'customnodeselfaddchildiconclass',
        treeViewNodeSelfDelete: 'customnodeselfdeleteclass',
        treeViewNodeSelfDeleteIcon: 'customnodeselfdeleteiconclass',
        treeViewNodeChildrenWrapper: 'customnodechildrenwrapperclass',
        treeViewNodeChildren: 'customnodechildrenclass',
        treeViewNodeLoading: 'customnodeloadingclass'
      }
    };

    beforeEach(() => {
      let initialModel = generateNodes(['cEdS', ['res', 'esa']], "", () => Promise.resolve())[0];

      wrapper = createWrapper({
        ariaKeyMap: {},
        initialModel,
        modelDefaults: { customizations },
        depth: 0,
        treeId: 'tree',
        initialRadioGroupValues: {},
        selectionMode: SelectionMode.Single,
        isMounted: false
      });
    });

    it('should add the custom class to the tree view node\'s root element', () => {
      let target = wrapper.find('.grtvn.' + customizations.classes.treeViewNode);
      expect(target.exists()).to.be.true;
    });

    it('should add the custom class to the tree view node\'s self element', () => {
      let target = wrapper.find('.grtvn-self.' + customizations.classes.treeViewNodeSelf);
      expect(target.exists()).to.be.true;
    });

    it('should add the custom class to the tree view node\'s expander element', () => {
      let target = wrapper.find('.grtvn-self-expander.' + customizations.classes.treeViewNodeSelfExpander);
      expect(target.exists()).to.be.true;
    });

    it('should add the custom class to the tree view node\'s expanded element', () => {
      let target = wrapper.find('.grtvn-self-expanded.' + customizations.classes.treeViewNodeSelfExpanded);
      expect(target.exists()).to.be.true;
    });

    it('should add the custom class to the tree view node\'s expanded indicator element', () => {
      let target = wrapper.find('.grtvn-self-expanded-indicator.' + customizations.classes.treeViewNodeSelfExpandedIndicator);
      expect(target.exists()).to.be.true;
    });

    it('should add the custom class to the tree view node\'s selected element', () => {
      let target = wrapper.find('.grtvn-self-selected.' + customizations.classes.treeViewNodeSelfSelected);
      expect(target.exists()).to.be.true;
    });

    it('should add the custom class to the tree view node\'s spacer element', () => {
      let target = wrapper.find('.grtvn-self-spacer.' + customizations.classes.treeViewNodeSelfSpacer);
      expect(target.exists()).to.be.true;
    });

    it('should add the custom class to the tree view node\'s label element', () => {
      let target = wrapper.find('.grtvn-self-label.' + customizations.classes.treeViewNodeSelfLabel);
      expect(target.exists()).to.be.true;
    });

    it('should add the custom class to the tree view node\'s input element', () => {
      let target = wrapper.find('.grtvn-self-input.' + customizations.classes.treeViewNodeSelfInput);
      expect(target.exists()).to.be.true;
    });

    it('should add the custom class to the tree view node\'s checkbox element', () => {
      let target = wrapper.find('.grtvn-self-checkbox.' + customizations.classes.treeViewNodeSelfCheckbox);
      expect(target.exists()).to.be.true;
    });

    it('should add the custom class to the tree view node\'s radio button element', () => {
      let target = wrapper.find('.grtvn-self-radio.' + customizations.classes.treeViewNodeSelfRadio);
      expect(target.exists()).to.be.true;
    });

    it('should add the custom class to the tree view node\'s text element', () => {
      let target = wrapper.find('.grtvn-self-text.' + customizations.classes.treeViewNodeSelfText);
      expect(target.exists()).to.be.true;
    });

    it('should add the custom add child class to the tree view node\'s add child element', () => {
      let target = wrapper.find('.grtvn-self-action.' + customizations.classes.treeViewNodeSelfAddChild);
      expect(target.exists()).to.be.true;
    });

    it('should add the custom action class to the tree view node\'s add child element', () => {
      let target = wrapper.find('.grtvn-self-action.' + customizations.classes.treeViewNodeSelfAddChild + '.' + customizations.classes.treeViewNodeSelfAction);
      expect(target.exists()).to.be.true;
    });

    it('should add the custom class to the tree view node\'s add child icon element', () => {
      let target = wrapper.find('.grtvn-self-add-child-icon.' + customizations.classes.treeViewNodeSelfAddChildIcon);
      expect(target.exists()).to.be.true;
    });

    it('should add the custom delete class to the tree view node\'s delete element', () => {
      let target = wrapper.find('.grtvn-self-action.' + customizations.classes.treeViewNodeSelfDelete);
      expect(target.exists()).to.be.true;
    });

    it('should add the custom action class to the tree view node\'s delete element', () => {
      let target = wrapper.find('.grtvn-self-action.' + customizations.classes.treeViewNodeSelfDelete + '.' + customizations.classes.treeViewNodeSelfAction);
      expect(target.exists()).to.be.true;
    });

    it('should add the custom class to the tree view node\'s delete icon element', () => {
      let target = wrapper.find('.grtvn-self-delete-icon.' + customizations.classes.treeViewNodeSelfDeleteIcon);
      expect(target.exists()).to.be.true;
    });

    it('should add the custom class to the tree view node\'s children wrapper element', () => {
      let target = wrapper.find('.grtvn-children-wrapper.' + customizations.classes.treeViewNodeChildrenWrapper);
      expect(target.exists()).to.be.true;
    });

    it('should add the custom class to the tree view node\'s children element', () => {
      let target = wrapper.find('.grtvn-children.' + customizations.classes.treeViewNodeChildren);
      expect(target.exists()).to.be.true;
    });
  });

  describe('when using slots', () => {

    describe('and rendering a text node', () => {

      const customClasses = { treeViewNode: 'customnodeclass' };

      beforeEach(() => {
        let initialModel = generateNodes([''], "baseId")[0];

        wrapper = createWrapper(
          {
            ariaKeyMap: {},
            initialModel,
            modelDefaults: { customizations: { classes: customClasses } },
            depth: 0,
            treeId: 'tree',
            initialRadioGroupValues: {},
            isMounted: false
          },
          {
            text: '<template #text="props"><span :id="props.model.id" class="text-slot-content"><span class="slot-custom-classes">{{ JSON.stringify(props.customClasses) }}</span></span></template>',
          }
        );
      });

      it('should render the slot template', () => {
        expect(wrapper.find('.text-slot-content').exists()).to.be.true;
      });

      it('should have model data', () => {
        expect(wrapper.find('span#baseIdn0.text-slot-content').exists()).to.be.true;
      });

      it('should have custom classes data', () => {
        expect(wrapper.find('span.slot-custom-classes').text()).to.equal(JSON.stringify(customClasses));
      });
    });

    describe('and rendering a checkbox node', () => {

      const customClasses = { treeViewNode: 'customnodeclass' };

      beforeEach(() => {
        let initialModel = generateNodes(['c'], "baseId")[0];

        wrapper = createWrapper(
          {
            ariaKeyMap: {},
            initialModel,
            modelDefaults: { customizations: { classes: customClasses } },
            depth: 0,
            treeId: 'tree',
            initialRadioGroupValues: {},
            isMounted: false
          },
          {
            checkbox: `<template #checkbox="props"><span :id="props.model.id" class="text-slot-content">
                          <span class="slot-custom-classes">{{ JSON.stringify(props.customClasses) }}</span>
                          <span class="slot-input-id">{{ props.inputId }}</span>
                          <span class="slot-has-handler">{{ typeof props.checkboxChangeHandler == 'function' }}</span>
                        </span></template>`,
          }
        );
      });

      it('should render the slot template', () => {
        expect(wrapper.find('.text-slot-content').exists()).to.be.true;
      });

      it('should get a model property', () => {
        expect(wrapper.find('span#baseIdn0.text-slot-content').exists()).to.be.true;
      });

      it('should get a customClasses property', () => {
        expect(wrapper.find('span.slot-custom-classes').text()).to.equal(JSON.stringify(customClasses));
      });

      it('should get an inputId property', () => {
        expect(wrapper.find('span.slot-input-id').text()).to.equal('tree-baseIdn0-input');
      });

      it('should get a checkboxChangeHandler property function', () => {
        expect(wrapper.find('span.slot-has-handler').text()).to.equal('true');
      });
    });

    describe('and rendering a radiobutton node', () => {

      const customClasses = { treeViewNode: 'customnodeclass' };

      beforeEach(() => {
        let initialModel = generateNodes(['R'], "baseId")[0];

        wrapper = createWrapper(
          {
            ariaKeyMap: {},
            initialModel,
            modelDefaults: { customizations: { classes: customClasses } },
            depth: 0,
            treeId: 'tree',
            initialRadioGroupValues: {},
            isMounted: false
          },
          {
            radio: `<template #radio="props"><span :id="props.model.id" class="text-slot-content">
                      <span class="slot-custom-classes">{{ JSON.stringify(props.customClasses) }}</span>
                      <span class="slot-input-id">{{ props.inputId }}</span>
                      <span class="slot-has-handler">{{ typeof props.radioChangeHandler == 'function' }}</span>
                      <span class="slot-input-model">{{ JSON.stringify(props.inputModel) }}</span>
                    </span></template>`,
          }
        );
      });

      it('should render the slot template', () => {
        expect(wrapper.find('.text-slot-content').exists()).to.be.true;
      });

      it('should get a model property', () => {
        expect(wrapper.find('span#baseIdn0.text-slot-content').exists()).to.be.true;
      });

      it('should get a customClasses property', () => {
        expect(wrapper.find('span.slot-custom-classes').text()).to.equal(JSON.stringify(customClasses));
      });

      it('should get an inputId property', () => {
        expect(wrapper.find('span.slot-input-id').text()).to.equal('tree-baseIdn0-input');
      });

      it('should get an inputModel property', () => {
        expect(wrapper.find('span.slot-input-model').text()).to.equal('"baseIdn0-val"');
      });

      it('should get a radioChangeHandler property function', () => {
        expect(wrapper.find('span.slot-has-handler').text()).to.equal('true');
      });
    });

    describe('and rendering a custom loader message', () => {

      const customClasses = { treeViewNode: 'customnodeclass' };

      beforeEach(() => {
        let loadChildrenAsync = () => new Promise(resolve => setTimeout(resolve.bind(null, []), 1000));
        let initialModel = generateNodes(['e'], "baseId", null, loadChildrenAsync)[0];

        wrapper = createWrapper(
          {
            ariaKeyMap: {},
            initialModel,
            modelDefaults: { customizations: { classes: customClasses } },
            depth: 0,
            treeId: 'tree',
            initialRadioGroupValues: {},
            isMounted: false
          },
          {
            loading: '<template #loading="props"><span :id="props.model.id" class="loading-slot-content"><span class="slot-custom-classes">{{ JSON.stringify(props.customClasses) }}</span></span></template>',
          }
        );

        wrapper.find('#' + wrapper.vm.expanderId).trigger('click');
      });

      it('should render the slot template', () => {
        expect(wrapper.find('.loading-slot-content').exists()).to.be.true;
      });

      it('should have model data', () => {
        expect(wrapper.find('span#baseIdn0.loading-slot-content').exists()).to.be.true;
      });

      it('should have custom classes data', () => {
        expect(wrapper.find('span.slot-custom-classes').text()).to.equal(JSON.stringify(customClasses));
      });
    });
  });
});
