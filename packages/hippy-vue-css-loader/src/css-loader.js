/*
 * Tencent is pleased to support the open source community by making
 * Hippy available.
 *
 * Copyright (C) 2017-2022 THL A29 Limited, a Tencent company.
 * All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import crypto from 'crypto';
import { getOptions } from 'loader-utils';
import { GLOBAL_STYLE_NAME, GLOBAL_DISPOSE_STYLE_NAME } from '@vue/runtime/constants';
import parseCSS from './css-parser';
import translateColor, { names as colorNames } from './color-parser';

let sourceId = 0;

const typeMap = {
  stylesheet: 1,
  comment: 2,
  declaration: 3,
  keyframe: 4,
  keyframes: 5,
  supports: 6,
  host: 7,
  media: 8,
  'custom-media': 9,
  page: 10,
  document: 11,
  'font-face': 12,
  rule: 13,
};

const typeValueMap = {
  1: 'stylesheet',
  2: 'comment',
  3: 'declaration',
  4: 'keyframe',
  5: 'keyframes',
  6: 'supports',
  7: 'host',
  8: 'media',
  9: 'custom-media',
  10: 'page',
  11: 'document',
  12: 'font-face',
  13: 'rule',
};

const NATIVE_WIN32_PATH = /^[A-Z]:[/\\]|^\\\\/i;

function isUrlRequestable(url) {
  // Protocol-relative URLs
  if (/^\/\//.test(url)) {
    return false;
  }

  // `file:` protocol
  if (/^file:/i.test(url)) {
    return true;
  }

  // Absolute URLs
  if (/^[a-z][a-z0-9+.-]*:/i.test(url) && !NATIVE_WIN32_PATH.test(url)) {
    return false;
  }

  // `#` URLs
  if (/^#/.test(url)) {
    return false;
  }

  return true;
};

/**
 * 替换编译后的样式css中backgroundImage中的图片链接
 * @param {string} source
 * @example  {\"t\":\"declaration\",\"p\":\"backgroundImage\",\"v\":\"\"}
 * @return {string} source
 */
function loader(source) {
  const regexp = /"p":"backgroundImage","v":"([^"]*)"/g;
  return source.replace(regexp, ($0, $1) => {
    if ($1 !== 'none' && isUrlRequestable($1)) return '"p":"backgroundImage","v":require("'.concat($1, '")');
    return $0;
  });
}

/**
 * Convert the CSS text to AST that able to parse by selector parser.
 */
function hippyVueCSSLoader(source) {
  const options = getOptions(this);
  const parsed = parseCSS(source, { source: sourceId });

  const majorNodeVersion = parseInt(process.versions.node.split('.')[0], 10);
  const hashType = majorNodeVersion >= 17 ? 'md5' : 'md4';
  const hash = crypto.createHash(hashType);
  const contentHash = hash.update(source).digest('hex')
    .slice(0, 8);
  sourceId += 1;
  const rulesAst = parsed.stylesheet.rules.filter(n => n.type === 'rule').map(n => ({
    h: contentHash,
    s: n.selectors,
    ds: n.declarations.map((dec) => {
      let { value } = dec;
      const isVariableColor = dec.property && dec.property.startsWith('-') && typeof value === 'string'
        && (
          value.includes('#')
          || value.includes('rgb')
          || value.includes('hls')
          || value.includes('hue')
          || value.trim() in colorNames
        );
      if (dec.property && (dec.property.toLowerCase().indexOf('color') > -1 || isVariableColor)) {
        value = translateColor(value, options);
      }

      return {
        t: typeMap[dec.type],
        p: dec.property,
        v: value,
      };
    }),
  }));
  const minifiedAst = loader(JSON.stringify(rulesAst));
  const code = `(function() {
    if (!global['${GLOBAL_STYLE_NAME}']) {
      global['${GLOBAL_STYLE_NAME}'] = [];
    }
    const minifiedAst = ${minifiedAst};
    const typeValueMap = ${JSON.stringify(typeValueMap)};
    const rawAst = minifiedAst.map(v => ({
      hash: v.h,
      selectors: v.s,
      declarations: v.ds.map(d => {
        return {
          type: typeValueMap[d.t],
          property: d.p,
          value: d.v,
        }
      })
    }))
    global['${GLOBAL_STYLE_NAME}'] = global['${GLOBAL_STYLE_NAME}'].concat(rawAst);

    if(module.hot) {
      module.hot.dispose(() => {
        console.log('disposeHandlers');
        if(!global['${GLOBAL_DISPOSE_STYLE_NAME}']) {
          global['${GLOBAL_DISPOSE_STYLE_NAME}'] = [];
        }
        global['${GLOBAL_DISPOSE_STYLE_NAME}'] = global['${GLOBAL_DISPOSE_STYLE_NAME}'].concat('${contentHash}');
      })
    }
  })()`;
  return `module.exports=${code}`;
}

export default hippyVueCSSLoader;
