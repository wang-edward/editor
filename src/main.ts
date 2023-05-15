import { autocompletion, closeBrackets, closeBracketsKeymap, completionKeymap } from '@codemirror/autocomplete'
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'
import { python } from '@codemirror/lang-python'
import { bracketMatching, defaultHighlightStyle, foldGutter, foldKeymap, indentOnInput, syntaxHighlighting } from '@codemirror/language'
import { lintKeymap } from '@codemirror/lint'
import { highlightSelectionMatches, searchKeymap } from '@codemirror/search'
import { EditorState } from '@codemirror/state'
import { crosshairCursor, drawSelection, dropCursor, EditorView, highlightActiveLine, highlightActiveLineGutter, highlightSpecialChars, keymap, lineNumbers, rectangularSelection } from '@codemirror/view'

import axios from 'axios'
import qs from 'qs'

const initialText = `# this is a comment

print("cmajor is awesome!")

for i in range(5):
  print(i)


`
const targetElement = document.querySelector('#editor')!

let state = EditorState.create({
    doc: initialText,
    extensions: [
      lineNumbers(),
      highlightActiveLineGutter(),
      highlightSpecialChars(),
      history(),
      foldGutter(),
      drawSelection(),
      dropCursor(),
      EditorState.allowMultipleSelections.of(true),
      indentOnInput(),
      syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
      bracketMatching(),
      closeBrackets(),
      autocompletion(),
      rectangularSelection(),
      crosshairCursor(),
      highlightActiveLine(),
      highlightSelectionMatches(),
      keymap.of([
        ...closeBracketsKeymap,
        ...defaultKeymap,
        ...searchKeymap,
        ...historyKeymap,
        ...foldKeymap,
        ...completionKeymap,
        ...lintKeymap,
      ]),
      python(),
    ],
  })


let view = new EditorView({
  parent: targetElement,
  state: state})

function run() {
  var data = qs.stringify({
    'code': view.state.doc.toString(),
    'language': 'py',
    'input': '7'
  })
  var config = {
    method: 'post',
    url: 'https://api.codex.jaagrav.in',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    data : data
  }

  var ans = {}

  axios(config)
    .then(function (response) {
      ans = response.data;
      console.log(ans)
      document.getElementById('output').innerHTML = ans["output"]
      document.getElementById('error').innerHTML = ans["error"]
    })
    .catch(function (error) {
      console.log(error);
    });


}

document.getElementById("but").onclick = run
