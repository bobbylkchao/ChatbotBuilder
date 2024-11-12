import React, { forwardRef, useImperativeHandle, useState, useEffect } from 'react'
import Editor, { OnMount } from '@monaco-editor/react'
import * as monaco from 'monaco-editor'

export interface ICodeEditorRef {
  getValue: () => string,
  setValue: (value: string) => void,
}

const CodeEditor = forwardRef<ICodeEditorRef>((_, ref): React.ReactElement => {
  const [currentValue, setCurrentValue] = useState<string>('')
  const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor | null>(null)

  const handleEditorDidMount: OnMount = (editor) => {
    setEditor(editor)
  }

  useImperativeHandle(ref, () => ({
    getValue: () => {
      return currentValue
    },
    setValue: (value: string) => {
      setCurrentValue(value)
    },
  }))

  useEffect(() => {
    if (editor) {
      setTimeout(() => {
        editor.getAction('editor.action.formatDocument')?.run()
      }, 100)
    }
  }, [editor])

  return (
    <Editor
      defaultLanguage='javascript'
      language='javascript'
      defaultValue={currentValue}
      value={currentValue}
      onChange={(value='') => setCurrentValue(value)}
      options={{
        wordWrap: 'on',
        automaticLayout: true,
        formatOnType: true,
        formatOnPaste: true,
        autoIndent: 'full',
        tabSize: 2,
      }}
      onMount={handleEditorDidMount}
    />
  )
})

export default CodeEditor
