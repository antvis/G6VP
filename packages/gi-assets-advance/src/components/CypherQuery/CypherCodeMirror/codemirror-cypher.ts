// @ts-nocheck
/*
 * Copyright (c) 2002-2017 "Neo Technology,"
 * Network Engine for Objects in Lund AB [http://neotechnology.com]
 *
 * This file is part of Neo4j.
 *
 * Neo4j is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import codemirror from 'codemirror';
import {
  CypherEditorSupport,
  // @ts-ignore
  TreeUtils,
  parse as importedParse,
  extractStatements as importedExtractStatements,
} from 'cypher-editor-support';
import './codemirror-cypher-mode';
// 样式文件
import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/lint/lint';
import 'codemirror/addon/lint/lint.css';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/edit/closebrackets';
import './codemirror-cypher.css';

function translatePosition(from, to) {
  return {
    from: { line: from.line - 1, ch: from.column },
    to: { line: to.line - 1, ch: to.column },
  };
}

function getPosition(element, editorSupport) {
  const { start, stop } = TreeUtils.getPosition(element) || {
    start: 0,
    stop: 0,
  };
  const from = editorSupport.positionConverter.toRelative(start);
  const to = editorSupport.positionConverter.toRelative(stop + 1);
  return translatePosition(from, to);
}

function fixColors(editor, editorSupport) {
  const markers = editor.cypherMarkers;

  markers.forEach(m => m.clear());
  if (editorSupport.parseTree == null) {
    return;
  }

  editorSupport.applyHighlighthing((element, type) => {
    const { from, to } = getPosition(element, editorSupport);
    markers.push(
      editor.markText(from, to, {
        className: `cm-p-${type}`,
      }),
    );
  });
}

codemirror.registerHelper('lint', 'cypher', (text, options, editor) => {
  const editorSupport = editor.editorSupport;
  if (!editorSupport) return [];
  const version = editor.newContentVersion();
  editorSupport.update(text, version);

  fixColors(editor, editorSupport);

  return (editorSupport.parseErrors || []).map(({ line, col, msg }) => ({
    severity: 'error',
    from: {
      line: line - 1,
      ch: Math.min(editor.getLine(line - 1).length - 1, col),
    },
    to: { line, ch: 0 },
    message: msg,
  }));
});

codemirror.registerHelper('hint', 'cypher', editor => {
  const editorSupport = editor.editorSupport;
  if (!editorSupport) return {};
  editorSupport.update(editor.getValue());

  const { line, ch } = editor.getCursor();
  const { items, from, to } = editorSupport.getCompletion(line + 1, ch);

  const position = translatePosition(from, to);
  const render = (element, self, data) => {
    // eslint-disable-next-line no-param-reassign
    element.innerHTML += `<b>${data.displayText}</b>${data.postfix ? data.postfix : ''}`;
  };

  return {
    list: items.map(({ type, view, content, postfix }) => ({
      text: content,
      displayText: view,
      className: `cm-hint-${type}`,
      type,
      postfix,
      render,
    })),
    ...position,
  };
});

export function createCypherEditor(input, settings) {
  const editorSupport = new CypherEditorSupport('');

  const editor = codemirror(input, { ...settings, value: '' });
  editor.cypherMarkers = [];
  editor.editorSupport = editorSupport;
  editor.version = 1;
  editor.newContentVersion = function newContentVersion() {
    this.version += 1;
    return this.version;
  };
  editor.newContentVersion.bind(editor);
  editor.setValue(settings.value || '');

  return { editor, editorSupport };
}

export const parse = importedParse;
export const extractStatements = importedExtractStatements;
