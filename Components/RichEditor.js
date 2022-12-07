import { ContentState, convertToRaw, EditorState, Modifier } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { useEffect, useState, Fragment } from 'react';
import { Editor } from 'react-draft-wysiwyg';

const RichEditor = ({ onChange, value }) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [updated, setUpdated] = useState(false);

  useEffect(() => {
    if (!updated) {
      const defaultValue = value ? value : '';
      const blocksFromHtml = htmlToDraft(defaultValue);
      const contentState = ContentState.createFromBlockArray(
        blocksFromHtml.contentBlocks,
        blocksFromHtml.entityMap
      );
      const newEditorState = EditorState.createWithContent(contentState);
      setEditorState(newEditorState);
    }
  }, [value, updated]);

  const onEditorStateChange = (editorState) => {
    setUpdated(true);
    setEditorState(editorState);

    return onChange(draftToHtml(convertToRaw(editorState.getCurrentContent())));
  };


  return (
    <Fragment>
      <div className="border border-1 border-gray rounded editor">
        <Editor
          spellCheck
          editorState={editorState}
          onEditorStateChange={onEditorStateChange}
          toolbar={{options: ['inline', 'blockType', 'fontSize', 'list', 'textAlign', 'emoji', 'remove', 'history']}}
        />
      </div>
    </Fragment>
  );
};

export default RichEditor;