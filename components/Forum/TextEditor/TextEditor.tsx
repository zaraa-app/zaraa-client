"use dom";

import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { ListNode, ListItemNode } from "@lexical/list";

import ExampleTheme from "./ExampleTheme";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import { $getRoot, EditorState, $getSelection } from "lexical";
import React, { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

const placeholder = "Enter some rich text...";

const editorConfig = {
  namespace: "zaraa",
  nodes: [ListNode, ListItemNode],
  onError(error: Error) {
    throw error;
  },
  theme: ExampleTheme,
};
export default function Editor({
  setPlainText,
  setEditorState,
  isEditable = true,
  initialEditorState = null,
}: {
  setEditorState: React.Dispatch<React.SetStateAction<string | null>>;
  setPlainText?: React.Dispatch<React.SetStateAction<string>>;
  isEditable?: boolean;
  initialEditorState?: string | null;
}) {
  return (
    <>
      <LexicalComposer initialConfig={{ ...editorConfig, editable: isEditable }}>
        <EditorInitializer initialEditorState={initialEditorState} />
        <div className="editor-container">
          {isEditable && <ToolbarPlugin />}
          <div className="editor-inner">
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  className="editor-input"
                  aria-placeholder={placeholder}
                  placeholder={<div className="editor-placeholder">{placeholder}</div>}
                />
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
            <OnChangePlugin
              onChange={(editorState) => {
                editorState.read(() => {
                  if (!setPlainText) return;

                  const root = $getRoot();
                  const textContent = root.getTextContent();
                  setPlainText(textContent);
                });
                setEditorState(JSON.stringify(editorState.toJSON()));
              }}
              ignoreHistoryMergeTagChange
              ignoreSelectionChange
            />
            <HistoryPlugin />
            <AutoFocusPlugin />
            <ListPlugin />
          </div>
        </div>
      </LexicalComposer>
    </>
  );

  function EditorInitializer({ initialEditorState }: { initialEditorState?: string | null }) {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
      if (initialEditorState) {
        try {
          const parsedState = editor.parseEditorState(initialEditorState);
          editor.update(() => {
            editor.setEditorState(parsedState);
          });
        } catch (error) {
          console.error("Failed to parse initial editor state:", error);
        }
      }
    }, [editor, initialEditorState]);

    return null;
  }
}
