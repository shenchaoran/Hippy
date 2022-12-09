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

// Most nodes test is executed in node-ops.test.js
// here just test the lacked testing for HippyNode for coverage.

import test, { before } from 'ava';
import { isFunction } from '@vue/shared';
import { HippyNode, NodeType } from '../../../src/runtime/node/hippy-node';
import { HippyElement } from '../../../src/runtime/element/hippy-element';

before(() => {
  global.__GLOBAL__ = {
    nodeId: 101,
  };
});

const logWhenFail = async (t, cb, err) => {
  const tryTest = await t.try((t) => {
    cb(t);
  });

  if (!tryTest.passed) {
    t.log(err);
  }
  tryTest.commit();
};

test('HippyElement API', async (t) => {
  await logWhenFail(t, (t) => {
    const node = new HippyElement('div');

    t.true(isFunction(node.appendChild));
    t.true(isFunction(node.insertBefore));
    t.true(isFunction(node.moveChild));
    t.true(isFunction(node.removeChild));

    t.true(node.classList instanceof Set);
    t.true(node.style instanceof Object);
    t.true(node.attributes instanceof Object);
  }, 'HippyElement APIs have breaking changes, please update const variable \'BEFORE_RENDER_TO_NATIVE_HOOK_VERSION\' to disable this hook');
});

test('HippyNode API', async (t) => {
  await logWhenFail(t, (t) => {
    const node = new HippyNode(NodeType.ElementNode);

    t.true(isFunction(node.appendChild));
    t.true(isFunction(node.insertBefore));
    t.true(isFunction(node.moveChild));
    t.true(isFunction(node.removeChild));

    const childNode1 = new HippyNode(NodeType.ElementNode);
    const childNode2 = new HippyNode(NodeType.ElementNode);
    node.appendChild(childNode1);
    node.appendChild(childNode2);
    t.true(node.firstChild === childNode1);
    t.true(node.lastChild === childNode2);
  }, 'HippyNode APIs have breaking changes, please update const variable \'BEFORE_RENDER_TO_NATIVE_HOOK_VERSION\' to disable this hook');
});
