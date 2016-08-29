import Ember from 'ember';
import layout from './template';
import Selection from 'canvas-editor/lib/selection';

const { run } = Ember;

/**
 * A component that allows for the editing of a canvas in realtime.
 *
 * @class CanvasEditor.CanvasEditorComponent
 * @extends Ember.Component
 */
export default Ember.Component.extend({
  classNames: ['canvas-editor'],
  layout,

  /**
   * A dummy handler for an action that receives an index and a block after the
   * block was inserted locally.
   *
   * @method onNewBlockInsertedLocally
   * @param {number} index The index the new block was inserted at
   * @param {CanvasEditor.RealtimeCanvas.Block} newBlock The new block
   */
  onNewBlockInsertedLocally: Ember.K,

  /**
   * Focus at the beginning of the element that represents the block with the
   * given ID.
   *
   * @method focusBlock
   * @param {CanvasEditor.CanvasRealtime.Block} block The block to find and
   *   focus the element for
   */
  focusBlock(block) {
    this.$(`[data-block-id="${block.get('id')}"]`).focus();
  },

  actions: {
    /**
     * Called when the user wishes to navigate down to the next block from the
     * currently focused block.
     *
     * @method
     * @param {CanvasEditor.CanvasRealtime.Block} block The block that the user
     *   wishes to navigate down *from*
     * @param {ClientRect} rangeRect The client rect for the current user range
     */
    navigateDown(block, rangeRect) {
      const blockIndex = this.get('canvas.blocks').indexOf(block);
      const nextBlock = this.get('canvas.blocks').objectAt(blockIndex + 1);
      if (!nextBlock) return; // `block` is the last block
      Selection.navigateDownToBlock(this.$(), nextBlock, rangeRect);
    },

    /**
     * Called when the user wishes to navigate up to the previous block from the
     * currently focused block.
     *
     * @method
     * @param {CanvasEditor.CanvasRealtime.Block} block The block that the user
     *   wishes to navigate up *from*
     * @param {ClientRect} rangeRect The client rect for the current user range
     */
    navigateUp(block, rangeRect) {
      const blockIndex = this.get('canvas.blocks').indexOf(block);
      const prevBlock = this.get('canvas.blocks').objectAt(blockIndex - 1);
      if (!prevBlock) return; // `block` is the first block
      Selection.navigateUpToBlock(this.$(), prevBlock, rangeRect);
    },

    /**
     * Called when a new block was added after `prevBlock` and the canvas model
     * needs to be updated.
     *
     * @method
     * @param {CanvasEditor.CanvasRealtime.Block} prevBlock The block that the
     *   new block should be inserted after
     * @param {CanvasEditor.CanvasRealtime.Block} newBlock The new block
     */
    newBlockInsertedLocally(prevBlock, newBlock) {
      const index = this.get('canvas.blocks').indexOf(prevBlock) + 1;
      this.get('canvas.blocks').replace(index, 0, [newBlock]);
      this.get('onNewBlockInsertedLocally')(index, newBlock);
      run.scheduleOnce('afterRender', this, 'focusBlock', newBlock);
    }
  }
});
