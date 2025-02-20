import { expect } from 'chai';
import { shallowMount } from '@vue/test-utils';
import TreeView from '../../src/components/TreeView.vue';
import { generateNodes } from '../data/node-generator.js';
import SelectionMode from '../../src/enums/selectionMode';

function createWrapper(customPropsData, customAttrs, slotsData) {
  return shallowMount(TreeView, {
    sync: false,
    props: customPropsData || {},
    attrs: customAttrs,
    slots: slotsData
  });
}

describe('TreeView.vue', () => {

  let wrapper = null;

  afterEach(() => {
    wrapper = null;
  });

  describe('when on an element with an ID', () => {

    beforeEach(() => {
      wrapper = createWrapper(null, { id: 'my-id' });
    });

    it('should have a uniqueId of the root element ID', () => {
      expect(wrapper.vm.uniqueId).to.equal(wrapper.attributes('id'));
    });
  });

  describe('when on an element without an ID', () => {

    let newDiv;

    beforeEach(() => {
      // Add a node that uses the first auto-generated ID to test collision logic.
      newDiv = document.createElement('div');
      newDiv.id = 'grtv-1';
      document.body.appendChild(newDiv);

      wrapper = createWrapper();
    });

    afterEach(() => {
      document.body.removeChild(newDiv);
      newDiv = null;
    });

    it('should have a uniqueId prefixed with grtv-', () => {
      expect(wrapper.vm.uniqueId).to.be.a('string').and.match(/^grtv-/i);
    });

    it('should increment the uniqueId counter until no collisions are encountered', () => {
      expect(wrapper.vm.uniqueId).to.equal('grtv-2');
    });
  });

  describe('when not passed a skinClass prop', () => {

    beforeEach(() => {
      wrapper = createWrapper();
    });

    it('should have a class of grtv-default-skin', () => {
      expect(wrapper.vm.skinClass).to.equal('grtv-default-skin');
      let target = wrapper.find('.grtv-wrapper.grtv-default-skin');
      expect(target.exists()).to.be.true;
    });
  });

  describe('when passed a skinClass prop', () => {

    beforeEach(() => {
      wrapper = createWrapper({ skinClass: "my-skin" });
    });

    it('should have a class of my-skin', () => {
      expect(wrapper.vm.skinClass).to.equal('my-skin');
      let target = wrapper.find('.grtv-wrapper.my-skin');
      expect(target.exists()).to.be.true;
    });

    it('should not have a class of grtv-default-skin', () => {
      let target = wrapper.find('.grtv-wrapper.grtv-default-skin');
      expect(target.exists()).to.be.false;
    });
  });

  describe('when getCheckedCheckboxes() is called', () => {

    beforeEach(() => {
      wrapper = createWrapper({ initialModel: generateNodes(['ecs', 'eCs', ['eCs', 'ecs']]) });
    });

    it('should return checked checkbox nodes', () => {
      let nodes = wrapper.vm.getCheckedCheckboxes();
      expect(nodes.length).to.equal(2);
    });
  });

  describe('when getCheckedRadioButtons() is called', () => {

    beforeEach(() => {
      let nodes = generateNodes(['ers', 'eRs', ['eRs', 'ers']]);
      wrapper = createWrapper({ initialModel: nodes });

      // Fake the setup of the radio storage since we're shallow mounting
      wrapper.vm.radioGroupValues = {};
      wrapper.vm.radioGroupValues[nodes[1].treeNodeSpec.input.name] = nodes[1].treeNodeSpec.input.value;
      wrapper.vm.radioGroupValues[nodes[1].children[0].treeNodeSpec.input.name] = nodes[1].children[0].treeNodeSpec.input.value;
    });

    it('should return checked radiobutton nodes', () => {
      let nodes = wrapper.vm.getCheckedRadioButtons();
      expect(nodes.length).to.equal(2);
    });
  });

  describe('when getMatching() is called', () => {

    describe('and there are nodes present', () => {

      beforeEach(() => {
        wrapper = createWrapper({ initialModel: generateNodes(['es', 'ES', ['es', 'eS']]), selectionMode: SelectionMode.Multiple });
      });

      it('should return nodes matched by the function argument', () => {
        let nodes = wrapper.vm.getMatching((nodeModel) =>
          nodeModel.treeNodeSpec.expandable
          && nodeModel.treeNodeSpec.state.expanded
          && nodeModel.treeNodeSpec.selectable
          && nodeModel.treeNodeSpec.state.selected);

        expect(nodes.length).to.equal(1);
      });
    });

    describe('and there are no nodes present', () => {

      beforeEach(() => {
        wrapper = createWrapper();
      });

      it('should return an empty array', () => {
        let nodes = wrapper.vm.getMatching(() => true);
        expect(nodes.length).to.equal(0);
      });
    });
  });

  describe('when getSelected() is called', () => {

    beforeEach(() => {
      wrapper = createWrapper({ initialModel: generateNodes(['es', 'eS', ['es', 'eS']]), selectionMode: SelectionMode.Multiple });
    });

    it('should return selected nodes', () => {
      let nodes = wrapper.vm.getSelected();
      expect(nodes.length).to.equal(2);
    });
  });

  describe('when selectionMode is null', () => {

    beforeEach(() => {
      wrapper = createWrapper({ initialModel: generateNodes(['es', 'eS', ['es', 'eS']]), selectionMode: SelectionMode.None });
    });

    it('should not have an aria-multiselectable attribute', () => {
      expect(wrapper.find('.grtv').element.attributes['aria-multiselectable']).to.be.undefined;
    });

    it('should ignore the selected state of nodes', () => {
      let nodes = wrapper.vm.getSelected();
      expect(nodes.length).to.equal(0);
    });
  });

  describe('when selectionMode is `single`', () => {

    beforeEach(() => {
      wrapper = createWrapper({ initialModel: generateNodes(['es', 'eS', ['es', 'eS']]), selectionMode: SelectionMode.Single });
    });

    it('should have an aria-multiselectable attribute of false', () => {
      expect(wrapper.find('.grtv').element.attributes['aria-multiselectable'].value).to.equal('false');
    });

    it('should only keep the selectable=true state for the first node with that in the initial model', () => {
      expect(wrapper.vm.model[1].treeNodeSpec.state.selected).to.be.true;
      expect(wrapper.vm.model[1].children[1].treeNodeSpec.state.selected).to.be.false;
    });
  });

  describe('when selectionMode is `selectionFollowsFocus`', () => {

    beforeEach(() => {
      wrapper = createWrapper({ initialModel: generateNodes(['es', 'eS', ['es', 'eS']]), selectionMode: SelectionMode.SelectionFollowsFocus });
    });

    it('should have an aria-multiselectable attribute of false', () => {
      expect(wrapper.find('.grtv').element.attributes['aria-multiselectable'].value).to.equal('false');
    });
  });

  describe('when selectionMode is `multiple`', () => {

    beforeEach(() => {
      wrapper = createWrapper({ initialModel: generateNodes(['es', 'eS', ['es', 'eS']]), selectionMode: SelectionMode.Multiple });
    });

    it('should have an aria-multiselectable attribute of true', () => {
      expect(wrapper.find('.grtv').element.attributes['aria-multiselectable'].value).to.equal('true');
    });
  });

  describe('when a function is passed for loadNodesAsync', () => {

    let loadNodesPromise = null;

    beforeEach(() => {
      jest.useFakeTimers();
      loadNodesPromise = new Promise(resolve => setTimeout(resolve.bind(null, generateNodes(['', ''])), 1000));
      wrapper = createWrapper({ loadNodesAsync: () => loadNodesPromise, selectionMode: SelectionMode.Single });
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    describe('and the loadNodesAsync Promise has not returned', () => {

      it('should display the loading placeholder', () => {
        expect(wrapper.find('.grtv-loading').exists()).to.be.true;
      });

      describe('and rendering a custom loader message', () => {

        beforeEach(() => {
          wrapper = createWrapper(
            {
              loadNodesAsync: () => loadNodesPromise
            },
            null,
            {
              'loading-root': '<span class="loading-slot-content">custom</span>',
            }
          );
        });

        it('should render the slot template', () => {
          expect(wrapper.find('.loading-slot-content').exists()).to.be.true;
        });
      });
    });

    describe('and the loadNodesAsync Promise returns', () => {

      beforeEach(async () => {
        jest.runAllTimers();
        await wrapper.vm.$nextTick();
      });

      it('should splice those nodes in as the model', () => {
        expect(wrapper.find('.grtv-loading').exists()).to.be.false;
        expect(wrapper.vm.model.length).to.equal(2);
      });

      it('should emit the treeViewRootNodesLoad event', () => {
        expect(wrapper.emitted().treeViewRootNodesLoad).to.be.an('array').that.has.length(1);
      });
    });
  });
});
