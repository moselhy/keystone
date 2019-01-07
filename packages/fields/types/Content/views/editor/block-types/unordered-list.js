import * as React from 'react';
import { ToolbarCheckbox } from '../toolbar-components';
import { hasAncestorBlock, hasBlock } from '../utils';
import * as listItem from './list-item';
import { type as defaultType } from './paragraph';
import { ListUnorderedIcon } from '@voussoir/icons';

// duplicated logic for now, make some of this functionality happen in the schema instead soon
let handleListButtonClick = (editor, editorState, type) => {
  let isListItem = hasBlock(editorState, listItem.type);
  let isOrderedList = hasAncestorBlock(editorState, type);

  let otherListType = type === 'ordered-list' ? 'unordered-list' : 'ordered-list';

  if (isListItem && isOrderedList) {
    editor.setBlocks(defaultType);
    editor.unwrapBlock(type);
  } else if (isListItem) {
    editor.unwrapBlock(otherListType);
    editor.wrapBlock(type);
  } else {
    editor.setBlocks(listItem.type).wrapBlock(type);
  }
};

export let type = 'unordered-list';

export function ToolbarElement({ editor, editorState }) {
  return (
    <ToolbarCheckbox
      id="unordered-list-input"
      isActive={hasAncestorBlock(editorState, type)}
      onChange={() => {
        handleListButtonClick(editor, editorState, type);
      }}
    >
      <ListUnorderedIcon title="Unordered List" />
    </ToolbarCheckbox>
  );
}

export let plugins = [
  {
    onKeyDown(event, editor, next) {
      // make it so when you press enter in an empty list item,
      // the block type will change to a paragraph
      if (
        event.keyCode === 13 &&
        hasAncestorBlock(editor.value, type) &&
        editor.value.focusText.text === ''
      ) {
        editor.setBlocks(defaultType).unwrapBlock(type);
        return;
      }
      next();
    },
  },
];

export function renderNode({ attributes, children }) {
  return <ul {...attributes}>{children}</ul>;
}

export let dependencies = [listItem];
