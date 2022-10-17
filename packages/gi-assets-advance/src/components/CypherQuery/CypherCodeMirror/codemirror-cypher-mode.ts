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

/* eslint-disable no-param-reassign */
// By the Neo4j Team and contributors.
// https://github.com/neo4j-contrib/CodeMirror

import CodeMirror from 'codemirror';
// @ts-ignore
import { CypherKeywords } from 'cypher-editor-support';

const operators = [
  ';',
  '(',
  ')',
  '{',
  '}',
  '[',
  ']',
  '$',
  ':',
  '.',
  '=',
  '<',
  '>',
  '+',
  '-',
  '*',
  '`',
  ',',
  '?',
  '|',
  '..',
  '+=',
  '<>',
  '!=',
  '<=',
  '>=',
  '/',
  '%',
  '^',
  '=~',
];

const keywordRegexes = CypherKeywords.map(w => new RegExp(w, 'i'));
const lineCommentRegex = /\/\/[^\r\n]*/;
const blockCommentRegex = /\/\*([\S\s]*?)\*\//;
const stringRegex = /('([^'\\]|\\.)*'|"([^"\\]|\\.)*")/;
const stringStartRegex = /('([^'\\]|\\.)*|"([^"\\]|\\.)*)/; // match just opened and not closed string as string
const integerRegex = /[+-]?(([1-9][0-9]+)|([0-9]))/;
const decimalRegex = /[+-]?(([1-9][0-9]+)|([0-9]))\.[0-9]+/;

CodeMirror.defineMode('cypher', config => {
  let curPunc;

  const tokenBase = stream => {
    if (stream.match(lineCommentRegex) || stream.match(blockCommentRegex)) {
      return 'comment';
    } else if (stream.match(stringRegex)) {
      return 'string';
    } else if (stream.match(integerRegex)) {
      return 'number';
    } else if (stream.match(decimalRegex)) {
      return 'number';
    } else if (operators.find(o => stream.match(o))) {
      return 'operator';
    } else if (keywordRegexes.find(k => stream.match(k))) {
      return 'keyword';
    } else if (stream.match(stringStartRegex)) {
      return 'string';
    }

    stream.next();
    stream.eatWhile(/[_\w\d]/);

    return 'variable';
  };
  const pushContext = (state, type, col) => {
    state.context = {
      prev: state.context,
      indent: state.indent,
      col,
      type,
    };
    return state.context;
  };
  const popContext = state => {
    state.indent = state.context.indent;
    state.context = state.context.prev;
    return state.context;
  };
  const indentUnit = config.indentUnit;

  return {
    startState() {
      return {
        tokenize: tokenBase,
        context: null,
        indent: 0,
        col: 0,
      };
    },
    token(stream, state) {
      if (stream.sol()) {
        if (state.context && state.context.align == null) {
          state.context.align = false;
        }
        state.indent = stream.indentation();
      }
      if (stream.eatSpace()) {
        return null;
      }
      const style = state.tokenize(stream, state);
      if (style !== 'comment' && state.context && state.context.align == null && state.context.type !== 'pattern') {
        state.context.align = true;
      }
      if (curPunc === '(') {
        pushContext(state, ')', stream.column());
      } else if (curPunc === '[') {
        pushContext(state, ']', stream.column());
      } else if (curPunc === '{') {
        pushContext(state, '}', stream.column());
      } else if (/[\]})]/.test(curPunc)) {
        while (state.context && state.context.type === 'pattern') {
          popContext(state);
        }
        if (state.context && curPunc === state.context.type) {
          popContext(state);
        }
      } else if (curPunc === '.' && state.context && state.context.type === 'pattern') {
        popContext(state);
      } else if (/atom|string|variable/.test(style) && state.context) {
        if (/[}\]]/.test(state.context.type)) {
          pushContext(state, 'pattern', stream.column());
        } else if (state.context.type === 'pattern' && !state.context.align) {
          state.context.align = true;
          state.context.col = stream.column();
        }
      }
      return style;
    },
    indent: (state, textAfter) => {
      const firstChar = textAfter && textAfter.charAt(0);
      let context = state.context;
      if (/[\]}]/.test(firstChar)) {
        while (context && context.type === 'pattern') {
          context = context.prev;
        }
      }
      const closing = context && firstChar === context.type;
      if (!context) return 0;
      if (context.type === 'keywords') return CodeMirror.commands.newlineAndIndent;
      if (context.align) return context.col + (closing ? 0 : 1);
      return context.indent + (closing ? 0 : indentUnit);
    },
  };
});

CodeMirror.modeExtensions.cypher = {
  autoFormatLineBreaks: text => {
    const lines = text.split('\n');
    const reProcessedPortion = /\s+\b(return|where|order by|match|with|skip|limit|create|delete|set)\b\s/g;
    for (let i = 0; i < lines.length; i++) {
      lines[i] = lines[i].replace(reProcessedPortion, ' \n$1 ').trim();
    }
    return lines.join('\n');
  },
};

CodeMirror.defineMIME('application/x-cypher-query', 'cypher');
