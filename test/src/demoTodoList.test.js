import { makeIsolatedComponent } from '../_helpers';
import { expect } from 'chai';

describe('components/demoTodoList', function () {

  this.timeout(100000);

  /**
   * Generic integration style testing by interacting with the component.
   */
  context('display and data store association', () => {
    /**
     * Inspect the DOM to confirm things were rendered as expected.
     */
    it('should render', done => {
      makeIsolatedComponent('demoTodoList', (app, component) => {
        // initially we expect there to only be one <li> with the input
        expect(component.$el.querySelectorAll('li').length).to.equal(1);
        expect(component.$el.querySelector('input[type="text"]')).to.be.ok;
        app.$destroy();
      }, done);
    });

    /**
     * Ensure the component is coupled to the app-wide $store instance,
     * and reflects changes when the store updated.
     */
    it('should update store programatically and update view', done => {
      makeIsolatedComponent('demoTodoList', (app, component) => {
        // dispatch store mutations
        app.$store.dispatch('LIST.ADD', 'firsties');
        app.$store.dispatch('LIST.ADD', 'secondsies');
        // expect store state and associated getters to update
        expect(app.$store.state.list._entries).to.include('firsties');
        expect(app.$store.getters.listEntries).to.include('firsties');
        expect(app.$store.state.list._entries).to.include('secondsies');
        expect(app.$store.getters.listEntries).to.include('secondsies');
        // inspect the DOM for Vue to have rendered updates
        setImmediate(() => {
          let LIs = component.$el.querySelectorAll('ul li.item');
          expect(LIs.length).to.equal(2);
          expect(LIs[0].innerHTML).to.include('firsties');
          expect(LIs[1].innerHTML).to.include('secondsies');
          app.$destroy();
        });
      }, done);
    });
  });

  /**
   * Interact with the component API directly (result of component
   * definition becomes accessible).
   * 
   * @note: this contains two it() blocks, the second of which depends on the
   * state remaining from the first; hence these should always be placed into
   * a context() or describe() block with proper setup/teardown functions if
   * any assertions fail.
   */
  context('interacting with the component API', () => {
    let _app, _component;

    before(done => {
      makeIsolatedComponent('demoTodoList', (app, component) => {
        _app = app;
        _component = component;
        done();
      });
    });

    after(() => {
      _app.$destroy();
      _app = _component = null;
    });

    /**
     * Use the component API to add stuff (simulates what would be invoked
     * by pressing buttons, assuming event bindings/mappings are correct).
     */
    it('should add list items via component API and update view', done => {
      // initially we expect there to only be one <li> with the input
      expect(_component.$el.querySelectorAll('li').length).to.equal(1);
      // get the "add" button element so we can trigger events on it
      // (eg. simulate real user interaction)
      let addBtn = _component.$el.querySelector('form button');
      // Now we have access to the component's API
      _component.newItem = 'lorem'; addBtn.click();
      _component.newItem = 'ipsum'; addBtn.click();
      _component.newItem = 'dolor'; addBtn.click();
      setImmediate(() => {
        // Check that the DOM updated as we expected...
        let LIs = _component.$el.querySelectorAll('ul li.item');
        expect(LIs.length).to.equal(3);
        expect(LIs[0].innerHTML).to.include('lorem');
        expect(LIs[1].innerHTML).to.include('ipsum');
        expect(LIs[2].innerHTML).to.include('dolor');
        done();
      }); 
    });

    it('should remove list items and reflect in render', done => {
      // confirm we still have 3 items from the previous it()
      expect(_component.$el.querySelectorAll('ul li.item').length).to.equal(3);
      // get the "remove" button element of the *second* <li> (of the
      // three) so we can simulate clicking it. this should remove the
      // *second* item in the array (index 1)
      let secondLI = _component.$el.querySelectorAll('ul li.item')[1];
      let removeBtn = secondLI.querySelector('button');
      removeBtn.click();
      setImmediate(() => {
        expect(_component.$el.querySelectorAll('ul li.item').length).to.equal(2);
        expect(_component.$el.querySelectorAll('ul li.item')[0].innerHTML).to.include('lorem');
        expect(_component.$el.querySelectorAll('ul li.item')[1].innerHTML).to.include('dolor');
        done();
      });
    });
  });

});