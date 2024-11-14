import styled from "styled-components"

export const Container = styled.div`
  display: flex;
  position: relative;
`

export const LeftContainer = styled.div`
  display: flex;
  flex: 1%;
`

export const RightContainer = styled.div`
  display: flex;
  flex: 2;
`

export const MarkdownEditorContainer = styled.div`
  .w-md-editor {
    height: 500px !important;
  }

  .w-md-editor-text {
    height: 500px !important;
  }

  .w-md-editor-text-input {
    -webkit-text-fill-color: unset !important;
    overflow: scroll !important;
  }

  .w-md-editor-text .wmde-markdown-color{
    visibility: hidden !important;
  }

  .w-md-editor-area.w-md-editor-input {
    overflow: hidden !important;
  }

  .w-md-editor-preview .wmde-markdown.wmde-markdown-color {
    pre {
      white-space: pre-wrap;
      padding: 1rem;
      overflow: auto;
      font-size: 85%;
      line-height: 1.45;
      color: #1f2328;
      background-color: #f6f8fa;
      border-radius: 6px;
    }
  }
`
