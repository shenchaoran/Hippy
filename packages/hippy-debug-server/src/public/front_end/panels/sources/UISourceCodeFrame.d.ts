import * as Common from '../../core/common/common.js';
import * as Persistence from '../../models/persistence/persistence.js';
import * as TextUtils from '../../models/text_utils/text_utils.js';
import * as Workspace from '../../models/workspace/workspace.js';
import * as IconButton from '../../ui/components/icon_button/icon_button.js';
import * as SourceFrame from '../../ui/legacy/components/source_frame/source_frame.js';
import type * as TextEditor from '../../ui/legacy/components/text_editor/text_editor.js';
import * as UI from '../../ui/legacy/legacy.js';
import type { Plugin } from './Plugin.js';
export declare class UISourceCodeFrame extends SourceFrame.SourceFrame.SourceFrameImpl {
    _uiSourceCode: Workspace.UISourceCode.UISourceCode;
    _diff: SourceFrame.SourceCodeDiff.SourceCodeDiff | undefined;
    _muteSourceCodeEvents: boolean;
    _isSettingContent: boolean;
    _persistenceBinding: Persistence.Persistence.PersistenceBinding | null;
    _rowMessageBuckets: Map<number, RowMessageBucket>;
    _typeDecorationsPending: Set<string>;
    _uiSourceCodeEventListeners: Common.EventTarget.EventDescriptor[];
    _messageAndDecorationListeners: Common.EventTarget.EventDescriptor[];
    _boundOnBindingChanged: () => void;
    _errorPopoverHelper: UI.PopoverHelper.PopoverHelper;
    _plugins: Plugin[];
    constructor(uiSourceCode: Workspace.UISourceCode.UISourceCode);
    _installMessageAndDecorationListeners(): void;
    uiSourceCode(): Workspace.UISourceCode.UISourceCode;
    setUISourceCode(uiSourceCode: Workspace.UISourceCode.UISourceCode): void;
    _unloadUISourceCode(): void;
    _initializeUISourceCode(): void;
    wasShown(): void;
    willHide(): void;
    _refreshHighlighterType(): void;
    _canEditSource(): boolean;
    _onNetworkPersistenceChanged(): void;
    commitEditing(): void;
    setContent(content: string | null, loadError: string | null): void;
    _allMessages(): Set<Workspace.UISourceCode.Message>;
    onTextChanged(oldRange: TextUtils.TextRange.TextRange, newRange: TextUtils.TextRange.TextRange): void;
    _onWorkingCopyChanged(_event: Common.EventTarget.EventTargetEvent): void;
    _onWorkingCopyCommitted(_event: Common.EventTarget.EventTargetEvent): void;
    _ensurePluginsLoaded(): void;
    _disposePlugins(): void;
    _onBindingChanged(): void;
    _updateStyle(): void;
    _innerSetContent(content: string): void;
    populateTextAreaContextMenu(contextMenu: UI.ContextMenu.ContextMenu, editorLineNumber: number, editorColumnNumber: number): Promise<void>;
    dispose(): void;
    _onMessageAdded(event: Common.EventTarget.EventTargetEvent): void;
    _getClampedEditorLineNumberForMessage(message: Workspace.UISourceCode.Message): number;
    _addMessageToSource(message: Workspace.UISourceCode.Message): void;
    _onMessageRemoved(event: Common.EventTarget.EventTargetEvent): void;
    _removeMessageFromSource(message: Workspace.UISourceCode.Message): void;
    _getErrorPopoverContent(event: Event): UI.PopoverHelper.PopoverRequest | null;
    _updateBucketDecorations(): void;
    _onLineDecorationAdded(event: Common.EventTarget.EventTargetEvent): void;
    _onLineDecorationRemoved(event: Common.EventTarget.EventTargetEvent): void;
    _decorateTypeThrottled(type: string): void;
    _decorateAllTypes(): void;
    toolbarItems(): Promise<UI.Toolbar.ToolbarItem[]>;
    populateLineGutterContextMenu(contextMenu: UI.ContextMenu.ContextMenu, lineNumber: number): Promise<void>;
}
export declare class RowMessage {
    private message;
    private repeatCount;
    element: HTMLDivElement;
    private icon;
    private repeatCountElement;
    constructor(message: Workspace.UISourceCode.Message);
    getMessage(): Workspace.UISourceCode.Message;
    callClickHandler(): void;
    getRepeatCount(): number;
    setRepeatCount(repeatCount: number): void;
    _updateMessageRepeatCount(): void;
}
export declare class RowMessageBucket {
    _sourceFrame: UISourceCodeFrame;
    private textEditor;
    _lineHandle: TextEditor.CodeMirrorTextEditor.TextEditorPositionHandle;
    _decoration: HTMLDivElement;
    _wave: HTMLElement;
    _errorIcon: IconButton.Icon.Icon;
    _issueIcon: IconButton.Icon.Icon;
    _decorationStartColumn: number | null;
    _messagesDescriptionElement: HTMLDivElement;
    _messages: RowMessage[];
    _level: Workspace.UISourceCode.Message.Level | null;
    private bookmark?;
    private iconsElement;
    constructor(sourceFrame: UISourceCodeFrame, textEditor: SourceFrame.SourcesTextEditor.SourcesTextEditor, editorLineNumber: number);
    _updateWavePosition(editorLineNumber: number, columnNumber: number): void;
    _messageDescription(levels: Set<Workspace.UISourceCode.Message.Level>): Element;
    detachFromEditor(): void;
    uniqueMessagesCount(): number;
    _issueClickHandler(): void;
    addMessage(message: Workspace.UISourceCode.Message): void;
    removeMessage(message: Workspace.UISourceCode.Message): void;
    _updateDecoration(): void;
    private getPopoverMessages;
    static getPopover(eventTarget: HTMLElement, mouseEvent: MouseEvent): UI.PopoverHelper.PopoverRequest | null;
}
export declare enum Events {
    ToolbarItemsChanged = "ToolbarItemsChanged"
}