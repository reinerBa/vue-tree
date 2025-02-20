import { expect } from 'chai';
import { mount } from '@vue/test-utils';
import TreeView from '../../src/components/TreeView.vue';
import { generateNodes } from '../data/node-generator.js';
import SelectionMode from '../../src/enums/selectionMode';

const getDefaultPropsData = function () {
  return {
    initialModel: []
  }
};

function createWrapper(customPropsData, customAttrs) {
  return mount(TreeView, {
    sync: false,
    props: customPropsData || getDefaultPropsData(),
    attrs: customAttrs
  });
}

describe('TreeView.vue (ARIA)', () => {

  let wrapper = null;

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
  });

  afterEach(() => {
    jest.restoreAllMocks();
    wrapper = null;
  });

  describe('always', () => {

    beforeEach(() => {
      wrapper = createWrapper();
    });

    it('should have an ARIA role of tree', () => {
      expect(wrapper.find('.grtv').element.attributes.role.value).to.equal('tree');
    });
  });

  describe('when calculating the ARIA key mappings', () => {

    describe('and no customizations are provided', () => {

      beforeEach(() => {
        wrapper = createWrapper();
      });

      it('should have an ARIA key mapping', () => {
        const keyMap = wrapper.vm.ariaKeyMap;
        expect(keyMap).to.have.own.property('activateItem');
        expect(keyMap).to.have.own.property('selectItem');
        expect(keyMap).to.have.own.property('focusLastItem');
        expect(keyMap).to.have.own.property('focusFirstItem');
        expect(keyMap).to.have.own.property('collapseFocusedItem');
        expect(keyMap).to.have.own.property('expandFocusedItem');
        expect(keyMap).to.have.own.property('focusPreviousItem');
        expect(keyMap).to.have.own.property('focusNextItem');
        expect(keyMap).to.have.own.property('insertItem');
        expect(keyMap).to.have.own.property('deleteItem');
      });
    });

    describe('and valid customizations are provided', () => {

      const customKeyMap = {
        activateItem: [1],
        selectItem: [2],
        focusLastItem: [3],
        focusFirstItem: [4],
        collapseFocusedItem: [5],
        expandFocusedItem: [6],
        focusPreviousItem: [7],
        focusNextItem: [8],
        insertItem: [9],
        deleteItem: [10]
      };

      beforeEach(() => {
        wrapper = createWrapper({
          initialModel: [],
          customAriaKeyMap: customKeyMap
        });
      });

      it('should use the custom ARIA key mapping', () => {
        const keyMap = wrapper.vm.ariaKeyMap;
        expect(keyMap).to.deep.equal(customKeyMap);
      });
    });

    describe('and invalid non-array customizations are provided', () => {

      const customKeyMap = {
        activateItem: 1
      };

      beforeEach(() => {
        wrapper = createWrapper({
          initialModel: [],
          customAriaKeyMap: customKeyMap
        });
      });

      it('should log an error', () => {
        expect(console.error.mock.calls[0][0])
          .to.equal('customAriaKeyMap properties must be Arrays of numbers (corresponding to keyCodes); property \'activateItem\' fails check.');
      });
    });
  });

  describe('when created without a focusable node specified', () => {

    describe('and no selected nodes', () => {

      beforeEach(() => {
        wrapper = createWrapper({ initialModel: generateNodes(['ecs', 'eCs', ['eCs', 'ecs']]), selectionMode: SelectionMode.Multiple });
      });

      it('should set the first node as focusable', () => {
        expect(wrapper.vm.model[0].treeNodeSpec.focusable).to.be.true;
      });
    });

    describe('and selected nodes', () => {

      beforeEach(() => {
        wrapper = createWrapper({ initialModel: generateNodes(['ecs', 'eCs', ['eCS', 'ecs']]), selectionMode: SelectionMode.Multiple });
      });

      it('should set the first selected node as focusable', () => {
        expect(wrapper.vm.model[1].children[0].treeNodeSpec.focusable).to.be.true;
      });
    });
  });

  describe('when created with a focusable node specified', () => {

    describe('always', () => {

      beforeEach(() => {
        wrapper = createWrapper({ initialModel: generateNodes(['ecs', 'eCsf', ['eCsf', 'ecs']]), selectionMode: SelectionMode.Multiple });
      });

      it('should keep that node as focusable', () => {
        expect(wrapper.vm.model[1].treeNodeSpec.focusable).to.be.true;
      });

      it('should set focusble to false for any further nodes', () => {
        expect(wrapper.vm.model[1].children[0].treeNodeSpec.focusable).to.be.false;
      });
    });

    describe('and with a selectionMode of selectionFollowsFocus', () => {

      describe('and a selectable focusable node', () => {

        beforeEach(() => {
          wrapper = createWrapper({ initialModel: generateNodes(['ecs', 'eCsf']), selectionMode: SelectionMode.SelectionFollowsFocus });
        });

        it('should select the focused node', () => {
          expect(wrapper.vm.model[1].treeNodeSpec.state.selected).to.be.true;
        });
      });

    });
  });

  describe('when handling a focus change', () => {

    beforeEach(() => {
      wrapper = createWrapper({ initialModel: generateNodes(['ecsf', 'eCs']) });
      wrapper.vm.$_grtvAria_handleFocusableChange(wrapper.vm.model[1]);
    });

    it('should remove focusable from the previous focusable node', () => {
      expect(wrapper.vm.model[0].treeNodeSpec.focusable).to.be.false;
    });

    it('should set the new node as the current focusable node', () => {
      expect(wrapper.vm.focusableNodeModel).to.deep.equal(wrapper.vm.model[1]);
    });
  });

  describe('when focusing the first node', () => {

    beforeEach(() => {
      wrapper = createWrapper({ initialModel: generateNodes(['ecs', 'eCsf']) });
      wrapper.vm.$_grtvAria_focusFirstNode();
    });

    it('should set the focusable attribute of the first node to true', () => {
      expect(wrapper.vm.model[0].treeNodeSpec.focusable).to.be.true;
    });
  });

  describe('when focusing the last node', () => {

    it('should focus the last visible node', () => {
      wrapper = createWrapper({ initialModel: generateNodes(['ecsf', 'eCs']) });
      wrapper.vm.$_grtvAria_focusLastNode();

      expect(wrapper.vm.model[1].treeNodeSpec.focusable).to.be.true;
    });

    it('should ignore non-expanded child nodes', () => {
      wrapper = createWrapper({ initialModel: generateNodes(['ecsf', 'eCs', 'ecs', ['ecs']]) });
      wrapper.vm.$_grtvAria_focusLastNode();

      expect(wrapper.vm.model[2].treeNodeSpec.focusable).to.be.true;
    });

    it('should focus the deepest last node', () => {
      wrapper = createWrapper({ initialModel: generateNodes(['ecsf', 'eCs', 'Ecs', ['ecs']]) });
      wrapper.vm.$_grtvAria_focusLastNode();

      expect(wrapper.vm.model[2].children[0].treeNodeSpec.focusable).to.be.true;
    });
  });

  describe('when a node is getting deleted', () => {

    describe('and the node is not the currently focusable node', () => {

      beforeEach(() => {
        wrapper = createWrapper({ initialModel: generateNodes(['ecsf', 'eCs', 'ecs']) });
        wrapper.vm.$_grtvAria_handleNodeDeletion(wrapper.vm.model[1]);
      });

      it('should not change the focusable node', () => {
        expect(wrapper.vm.model[0].treeNodeSpec.focusable).to.be.true;
      });
    });

    describe('and the node is not the last node', () => {

      beforeEach(() => {
        wrapper = createWrapper({ initialModel: generateNodes(['ecsf', 'eCs', 'ecs']) });
        wrapper.vm.$_grtvAria_handleNodeDeletion(wrapper.vm.model[0]);
      });

      it('should set the next node as focusable', () => {
        expect(wrapper.vm.model[1].treeNodeSpec.focusable).to.be.true;
      });
    });

    describe('and the node is the last node', () => {

      beforeEach(() => {
        wrapper = createWrapper({ initialModel: generateNodes(['ecs', 'eCs', 'ecsf']) });
        wrapper.vm.$_grtvAria_handleNodeDeletion(wrapper.vm.model[2]);
      });

      it('should set the previous node as focusable', () => {
        expect(wrapper.vm.model[1].treeNodeSpec.focusable).to.be.true;
      });
    })
  });

  describe('when focusing the previous node', () => {

    describe('and the first node is focused', () => {

      beforeEach(() => {
        wrapper = createWrapper({ initialModel: generateNodes(['ecsf', 'eCs']) });
        wrapper.vm.$_grtvAria_handlePreviousFocus(wrapper.vm.model[0]);
      });

      it('should not change focusableness', () => {
        expect(wrapper.vm.model[0].treeNodeSpec.focusable).to.be.true;
      });
    });

    describe('and the previous node does not have any expanded children', () => {

      beforeEach(() => {
        wrapper = createWrapper({ initialModel: generateNodes(['ecs', ['ecs', 'ecs'], 'ecsf']) });
        wrapper.vm.$_grtvAria_handlePreviousFocus(wrapper.vm.model[1]);
      });

      it('should set the previous node as focusable', () => {
        expect(wrapper.vm.model[0].treeNodeSpec.focusable).to.be.true;
      });
    });

    describe('and the previous node has expanded children', () => {

      beforeEach(() => {
        wrapper = createWrapper({ initialModel: generateNodes(['Ecs', ['ecs', 'ecs'], 'ecsf']) });
        wrapper.vm.$_grtvAria_handlePreviousFocus(wrapper.vm.model[1]);
      });

      it('should set the last expanded previous node as focusable', () => {
        expect(wrapper.vm.model[0].children[1].treeNodeSpec.focusable).to.be.true;
      });
    });
  });

  describe('when focusing the next node', () => {

    describe('and the last node is focused', () => {

      beforeEach(() => {
        wrapper = createWrapper({ initialModel: generateNodes(['ecs', 'eCsf']) });
        wrapper.vm.$_grtvAria_handleNextFocus(wrapper.vm.model[1]);
      });

      it('should not change focusableness', () => {
        expect(wrapper.vm.model[1].treeNodeSpec.focusable).to.be.true;
      });
    });

    describe('and the current node does not have any expanded children', () => {

      beforeEach(() => {
        wrapper = createWrapper({ initialModel: generateNodes(['ecsf', ['ecs', 'ecs'], 'ecs']) });
        wrapper.vm.$_grtvAria_handleNextFocus(wrapper.vm.model[0]);
      });

      it('should set the next sibling node as focusable', () => {
        expect(wrapper.vm.model[1].treeNodeSpec.focusable).to.be.true;
      });
    });

    describe('and the current node has expanded children', () => {

      beforeEach(() => {
        wrapper = createWrapper({ initialModel: generateNodes(['Ecsf', ['ecs', 'ecs'], 'ecs']) });
      });

      it('should set the first expanded child node as focusable', () => {
        wrapper.vm.$_grtvAria_handleNextFocus(wrapper.vm.model[0]);
        expect(wrapper.vm.model[0].children[0].treeNodeSpec.focusable).to.be.true;
      });

      describe('and the children are explicitly ignored', () => {

        if ('sets the next sibling node as focusable', () => {
          wrapper.vm.$_grtvAria_handleNextFocus(wrapper.vm.model[0], true);
          expect(wrapper.vm.model[1].treeNodeSpec.focusable).to.be.true;
        });
      });
    });
  });

  describe('when selectionMode changes to selectionFollowsFocus', () => {

    beforeEach(async () => {
      wrapper = createWrapper({ initialModel: generateNodes(['Ecsf', ['ecS', 'ecs'], 'ecs']), selectionMode: SelectionMode.Single });
      await wrapper.setProps({ selectionMode: SelectionMode.SelectionFollowsFocus });
      await wrapper.vm.$nextTick();
    });

    it('should select the focused node', () => {
      expect(wrapper.vm.model[0].treeNodeSpec.state.selected).to.be.true;
    });

    it('should deselect the previously selected node', () => {
      expect(wrapper.vm.model[0].children[0].treeNodeSpec.state.selected).to.be.false;
    });
  });

  describe('when selectionMode is Single', () => {

    beforeEach(async () => {
      wrapper = createWrapper({ initialModel: generateNodes(['ecS', 'ecs']), selectionMode: SelectionMode.Single });
    });

    describe('and a node is already selected', () => {

      describe('and a new node is selected', () => {

        beforeEach(async () => {
          wrapper.vm.model[1].treeNodeSpec.state.selected = true;
          await wrapper.vm.$nextTick();
        });

        it('should deselect the previously selected node', () => {
          expect(wrapper.vm.model[0].treeNodeSpec.state.selected).to.be.false;
        });
      });
    });
  });
});
