import React from 'react'
import { connect } from 'react-redux'
import editor from '../'
import favorites from '../../../sidebar/favorites'
import { getHistory, getEditorContent } from '../../../selectors'
import Codemirror from 'react-codemirror'
import 'codemirror/mode/cypher/cypher'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/monokai.css'

export class EditorComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      code: '',
      historyIndex: -1,
      buffer: null
    }
  }
  focusEditor () {
    const cm = this.codeMirror
    cm.focus()
    cm.setCursor(cm.lineCount(), 0)
  }
  handleEnter (cm) {
    if (cm.lineCount() === 1) {
      return this.execCurrent(cm)
    }
    this.newlineAndIndent(cm)
  }
  newlineAndIndent (cm) {
    this.codeMirrorInstance.commands.newlineAndIndent(cm)
  }
  execCurrent (cm) {
    this.props.onExecute(cm.getValue())
    this.setEditorValue(cm, '')
    this.setState({historyIndex: -1, buffer: null})
  }
  historyPrev (cm) {
    if (!this.props.history.length) return
    if (this.state.historyIndex + 1 === this.props.history.length) return
    if (this.state.historyIndex === -1) { // Save what's currently in the editor
      this.setState({buffer: cm.getValue()})
    }
    this.setState({historyIndex: this.state.historyIndex + 1})
    this.setEditorValue(cm, this.props.history[this.state.historyIndex].cmd)
  }
  historyNext (cm) {
    if (!this.props.history.length) return
    if (this.state.historyIndex <= -1) return
    if (this.state.historyIndex === 0) { // Should read from buffer
      this.setState({historyIndex: -1})
      this.setEditorValue(cm, this.state.buffer)
      return
    }
    this.setState({historyIndex: this.state.historyIndex - 1})
    this.setEditorValue(cm, this.props.history[this.state.historyIndex].cmd)
  }
  componentWillReceiveProps (nextProps) {
    if (nextProps.content !== null && nextProps.content !== this.state.code) {
      this.setEditorValue(this.codeMirror, nextProps.content)
    }
    if (nextProps.content !== null) {
      this.props.updateContent(null)
    }
  }
  componentDidMount () {
    this.codeMirror = this.refs.editor.getCodeMirror()
    this.codeMirrorInstance = this.refs.editor.getCodeMirrorInstance()
    this.codeMirrorInstance.keyMap['default']['Enter'] = this.handleEnter.bind(this)
    this.codeMirrorInstance.keyMap['default']['Shift-Enter'] = this.newlineAndIndent.bind(this)
    this.codeMirrorInstance.keyMap['default']['Cmd-Enter'] = this.execCurrent.bind(this)
    this.codeMirrorInstance.keyMap['default']['Ctrl-Enter'] = this.execCurrent.bind(this)
    this.codeMirrorInstance.keyMap['default']['Cmd-Up'] = this.historyPrev.bind(this)
    this.codeMirrorInstance.keyMap['default']['Ctrl-Up'] = this.historyPrev.bind(this)
    this.codeMirrorInstance.keyMap['default']['Cmd-Down'] = this.historyNext.bind(this)
    this.codeMirrorInstance.keyMap['default']['Ctrl-Down'] = this.historyNext.bind(this)
  }
  setEditorValue (cm, cmd) {
    this.codeMirror.setValue(cmd)
    this.updateCode(cmd, () => this.focusEditor())
  }
  updateCode (newCode, cb = () => {}) {
    this.setState({
      code: newCode
    }, cb)
  }
  render () {
    const options = {
      lineNumbers: true,
      mode: 'cypher',
      theme: 'neo',
      gutters: ['cypher-hints'],
      lineWrapping: true,
      autofocus: true
    }
    return (
      <div id='editor'>
        <Codemirror
          ref='editor'
          value={this.state.code}
          onChange={this.updateCode.bind(this)}
          options={options}
        />
        <input type='button' value='+' onClick={() => this.props.onFavortieClick(this.props.content)}/>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onFavortieClick: (cmd) => {
      dispatch(favorites.actions.addFavorite(cmd))
    },
    onExecute: (cmd) => {
      dispatch(editor.actions.executeCommand(cmd))
    },
    updateContent: (cmd) => {
      dispatch(editor.actions.setContent(cmd))
    }
  }
}

const mapStateToProps = (state) => {
  return {
    content: getEditorContent(state),
    history: getHistory(state)
  }
}

export const Editor = connect(mapStateToProps, mapDispatchToProps)(EditorComponent)
