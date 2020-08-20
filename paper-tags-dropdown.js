import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import'@polymer/paper-menu-button/paper-menu-button';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu-shared-styles';
import '@polymer/paper-ripple/paper-ripple.js';
import '@polymer/paper-listbox/paper-listbox';
import '@polymer/paper-item/paper-item';
import './paper-tags-input';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/paper-input/paper-input.js';


class PaperTagsDropdown extends PolymerElement {

    static get is() {
        return 'paper-tags-dropdown';
      }

    static get properties() {
        return {
            /**
             * `valueArray` store value as array `["value1", "value2"]`
             */
            valueArray: {
            type: Array,
            notify: true,
            },

            keyPath: {
            type: String,
            value: 'id'
            },

            labelPath: {
            type: String,
            value: 'label'
            },

            iconPath: {
            type: String
            },

            classPath: {
            type: String
            },

            searchString: {
            type: String,
            value: ''
            },

            /* 
            * `allowSearch` true to allow filter items
            */
            allowSearch : {
                type:  Boolean,
                value: false
            },

            items: {
            type: Array,
            value: function() {
                return [];
            }
            },

            tagItems: {
            type: Array,
            value: function() {
                return [];
            }
            },

            /**
             * When true, `showCounter` display a counter counting the number of tags
             */
            showCounter: {
            type: String
            },

            /*
            * `maxTags` the maximum allowed number of tags
            */
            maxTags: {
            type: Number
            },

            /*
            * `minTags` the minimum allowed number of tags
            */
            minTags: {
            type: Number
            },

            /*
            * `readonly` - reflects to `disabled` when set to true.
            */
            readonly: {
            type: Boolean,
            observer: '_observeReadonly'
            },

            /**
             * `tagTpl` a template Object used when creating new tags (e.g. '{"id":null, "label":"hello"}'). If not defuned, new tags will jus be Strings
             */
            tagTpl: {
            type: Object
            },

            /**
             * The derived "label" of the currently selected item. This value
             * is the `label` property on the selected item if set, or else the
             * trimmed text content of the selected item.
             */
            // selectedItemLabel: {
            //   type: String,
            //   notify: true,
            //   readOnly: true
            // },

            /**
             * The label for the dropdown.
             */
            label: {
            type: String
            },

            /**
             * The placeholder for the dropdown.
             */
            placeholder: {
            type: String
            },

            /**
             * The error message to display when invalid.
             */
            errorMessage: {
            type: String
            },

            /**
             * True if the dropdown is open. Otherwise, false.
             */
            opened: {
            type: Boolean,
            notify: true,
            value: false,
            observer: '_openedChanged'
            },

                /**
             * By default, the dropdown will constrain scrolling on the page
             * to itself when opened.
             * Set to true in order to prevent scroll from being constrained
             * to the dropdown when it opens.
             */
            allowOutsideScroll: {
                type: Boolean,
                value: false
            },

            /**
             * Set to true to disable the floating label. Bind this to the
             * `<paper-input-container>`'s `noLabelFloat` property.
             */
            noLabelFloat: {
            type: Boolean,
            value: false,
            reflectToAttribute: true
            },

            /**
             * Set to true to always float the label. Bind this to the
             * `<paper-input-container>`'s `alwaysFloatLabel` property.
             */
            alwaysFloatLabel: {
            type: Boolean,
            value: false
            },

            /**
             * Set to true to disable animations when opening and closing the
             * dropdown.
             */
            noAnimations: {
            type: Boolean,
            value: false
            },

            /**
             * The orientation against which to align the menu dropdown
             * horizontally relative to the dropdown trigger.
             */
            horizontalAlign: {
            type: String,
            value: 'right'
            },

            /**
             * The orientation against which to align the menu dropdown
             * vertically relative to the dropdown trigger.
             */
            verticalAlign: {
            type: String,
            value: 'top'
            },

            /**
             * Overrides the vertical offset computed in
             * _computeMenuVerticalOffset.
             */
            verticalOffset: Number,

            /**
             * If true, the `horizontalAlign` and `verticalAlign` properties will
             * be considered preferences instead of strict requirements when
             * positioning the dropdown and may be changed if doing so reduces
             * the area of the dropdown falling outside of `fitInto`.
             */
            dynamicAlign: {
            type: Boolean
            },

            /**
             * Whether focus should be restored to the dropdown when the menu closes.
             */
            restoreFocusOnClose: {
            type: Boolean,
            value:true
            },

            keyTarget: {
            type: Object
            },

            /* 
            * `allowAdd`  true to allow adding custom tags (they will be reflected in items)
            */
            allowAdd: {
            type:Boolean
            },

            /*
            * `getLabel` label getter
            */
            getLabel: {
                type: Function,
                value: function() {
                return this.getLabel.bind(this);
                }
            },

            /*
            * `getName` Name getter
            */
            getName: {
                type: Function,
                value: function() {
                return this.getName.bind(this);
                }
            },
            /*
            * `getStyle` Style getter
            */
            getStyle: {
                type: Function,
                value: function() {
                return this.getStyle.bind(this);
                }
            },

            /*
            * `getTagStyle` Style getter for tag item
            */
            getTagStyle: {
                type: Function,
                value: function() {
                return this.getTagStyle.bind(this);
                }
            },
            

        };
    }

    static get listeners() {
        return {
            'tap': '_onTap'
        };
    }

    static get keyBindings() {
        return {
          'up down': 'open',
          'esc': 'close'
        };
    }
  
    static get hostAttributes() {
        return {
          role: 'combobox',
          'aria-autocomplete': 'none',
          'aria-haspopup': 'true'
        };
    }
  
    static get observers() {
        return [
          '_observeItems(items)',
          '_observeValueArray(valueArray.splices, items)'
          // '_observeValueArray(valueObject.*, items)'
        ];
    }

     _observeReadonly(readonly, old) {
        if (readonly) {
          this.disabled = true;
          // remember that disabled property depends on readonly for run-time changes
          this._disabledFromReadonly = true;
          return;
        }
        if (old && readonly === false && this._disabledFromReadonly) {
          this.disabled = false;
        }
    }
  
    _observeItems(items) {
        // run every time item is set or reset
        if (items) {
          this._isInitiatingItems = true;
          // we override labelPath and keyPath if items is composed of primitives
          if(items[0] && (typeof items[0] === 'string' || typeof items[0] === 'number')  ) {
            this.labelPath = '';
            this.keyPath = '';
          }
          this.set('tagItems', this._filterValueItems(this.valueArray));
          delete this._isInitiatingItems;
        }
    }
  
    _observeValueArray(splices) {
        // run on any change to the valueArray
        if(this.items) {
          this.set('tagItems', this._filterValueItems(this.valueArray));
        }
    }
  
    _filterValueItems(valueArray) {
        if (valueArray && this.items && this.items.length > 0) {
          return this.items.filter(item => {
            const val = this.getName(item) || (this.keyPath &&  this.get(this.keyPath, item))
            if (val) {
              return this.valueArray.indexOf(val + '') > -1;
            } else {
              return this.valueArray.indexOf(item) > -1;
            }
          });
        }
        return [];
    }
  
    ready() {
        super.ready();
        this.$.menuButton.ignoreSelect = true;
        this.$.tagInput.preventAdd = !this.allowAdd;
        if (this.valueObject && !this.valueArray) {
          this.set('valueArray', Object.keys(this.valueObject));
        }
    }
  
    connectedCallback() {
        super.connectedCallback();
  
        this.keyTarget = this.$.tagInput;
        // NOTE(cdata): Due to timing, a preselected value in a `IronSelectable`
        // child will cause an `iron-select` event to fire while the element is
        // still in a `DocumentFragment`. This has the effect of causing
        // handlers not to fire. So, we double check this value on attached:
        var contentElement = this.contentElement;
        if (contentElement && contentElement.selectedItem) {
          this._setSelectedItem(contentElement.selectedItem);
        }
    }
  
      /**
       * The content element that is contained by the dropdown menu, if any.
       */
    get contentElement() {
        // Polymer 2.x returns slot.assignedNodes which can contain text nodes.
        var nodes = Polymer.dom(this.$.content).getDistributedNodes();
        for (var i = 0, l = nodes.length; i < l; i++) {
          if (nodes[i].nodeType === Node.ELEMENT_NODE) {
            return nodes[i];
          }
        }
    }
  
      /**
       * Show the dropdown content.
       */
    open() {
        this.$.menuButton.open();
    }
  
      /**
       * Hide the dropdown content.
       */
    close() {
        this.$.menuButton.close();
    }
  
    _computeKeys() {
        var s = ' ';
        for (var i = 48; i <= 126; i++) {
          s += String.fromCharCode(i) + ' ';
        }
        //adding backspace
        s += 'backspace' + ' ';
        return s;
    }
  
    _computeFilter(string) {
        // return a filter function for the current search string
        if (!string) {
          return null;
        }
        string = string.toLowerCase();
        return (item) => {
          const label = this.doGet(this.labelPath, item);
          return label && label.toLowerCase().indexOf(string) > -1;
        };
  
    }
  
      /**
       * A handler that is called when the dropdown is tapped.
       *
       * @param {CustomEvent} event A tap event.
       */
    _onTap(event) {
        if (Polymer.Gestures.findOriginalTarget(event) === this) {
          this.open();
        }
    }
  
      /* 
       * `doGet` 
       */
    doGet(path, item) {
          if(!path) {
            return item;
          }
          return this.get(path, item);
    }
  
    getLabel(item) {
        if(this.labelPath) {
          return this.doGet(this.labelPath, item);
        }
    }  
      
    getName(item) {
        if(this.keyPath) {
          return this.doGet(this.keyPath, item);
        }
    }  
      
    getStyle(item) {
        return '';
    }  
  
    getTagStyle(item) {
        return '';
    }  
  
    _onAscii(event) {
        if(!this.allowAdd) {
          this.async(function() {
            this.set('searchString', this.$.tagInput.value);
            this.open();
            this.$.tagInput.$.tagInput.focus()
          }, 30);
        }
    }
  
      /**
       * Compute the vertical offset of the menu based on the value of
       * `noLabelFloat`.
       *
       * @param {boolean} noLabelFloat True if the label should not float
       * above the input, otherwise false.
       */
    _computeMenuVerticalOffset(noLabelFloat) {
        // NOTE(cdata): These numbers are somewhat magical because they are
        // derived from the metrics of elements internal to `paper-input`'s
        // template. The metrics will change depending on whether or not the
        // input has a floating label.
        return noLabelFloat ? -4 : 8;
    }
  
      /**
       * Returns false if the element is required and does not have a selection,
       * and true otherwise.
       * @param {*=} _value Ignored.
       * @return {boolean} true if `required` is false, or if `required` is true
       * and the element has a valid selection.
       */
    _getValidity(_value) {
        return this.disabled || !this.required || (this.required && !!this.value);
    }
  
    _openedChanged() {
        if(!this.opened) {
          this.searchString = ''  ;
          this.value = ''  ;
        }
        var e = this.contentElement;
        if (e) {
          e.setAttribute('aria-expanded', this.opened ? 'true' : 'false');
        }
    }
  
    _stopEventPropagation(e) {
          e.stopPropagation();
    }

    static get template () {
        return html `
        <style include="paper-dropdown-menu-shared-styles">
            :host {
                display: block;
            }

            paper-tags-input {
                apply --paper-tags-dropdown-input;
                --paper-input-container-shared-input-style_-_width: 100px;
            }

            #filterCt {
                color: var(--default-primary-color);
                padding: 2px 8px;
                margin-top: -14px;
            }

            paper-listbox {
                min-width: 150px;
                @apply --paper-listbox;
            }
        </style>
        <template>
            <div role="button"></div>
            <paper-menu-button 
                id="menuButton" 
                vertical-align="[[verticalAlign]]"
                horizontal-align="[[horizontalAlign]]"
                vertical-offset="[[_computeMenuVerticalOffset(noLabelFloat)]]" 
                disabled="[[disabled]]"
                no-animations="[[noAnimations]]"
                opened="{{opened}}"
                close-on-activate
                allow-outside-scroll="[[allowOutsideScroll]]"
                restore-focus-on-close="[[restoreFocusOnClose]]">

                <div slot="dropdown-trigger">

                    <paper-ripple></paper-ripple>
                    <!-- paper-input has type="text" for a11y, do not remove -->
                    <iron-a11y-keys id="a11y" target="[[keyTarget]]" keys="[[_computeKeys()]]" on-keys-pressed="_onAscii"></iron-a11y-keys>
                    <paper-tags-input 
                    id="tagInput" 
                    max-tags="[[maxTags]]" 
                    min-tags="[[minTags]]" 
                    prevent-remove-tag="[[preventRemoveTag]]" 
                    value-object="{{valueObject}}" 
                    value-array="{{valueArray}}" 
                    tag-tpl="[[tagTpl]]" 
                    items="[[tagItems]]" 
                    value="{{value}}" 
                    icon="[[icon]]" 
                    item-class="[[itemClass]]" 
                    class-path="[[classPath]]" 
                    label-path="[[labelPath]]" 
                    icon-path="[[iconPath]]" 
                    key-path="[[keyPath]]" 
                    invalid="[[invalid]]" 
                    readonly="[[readonly]]" 
                    disabled="[[disabled]]" 
                    placeholder="[[placeholder]]" 
                    always-float-label="[[alwaysFloatLabel]]"
                    no-label-float="[[noLabelFloat]]"
                    error-message="[[errorMessage]]" 
                    label="[[label]]" 
                    show-counter="[[showCounter]]"
                    get-style="[[getTagStyle]]"
                    get-label="[[getLabel]]"
                    get-name="[[getName]]">
                    <iron-icon icon="paper-dropdown-menu:arrow-drop-down" slot="suffix"></iron-icon>
                    </paper-tags-input>
                </div>
                <paper-listbox 
                    slot="dropdown-content" 
                    disabled="[[disabled]]" 
                    selected-values="{{valueArray}}" 
                    attr-for-selected="name" 
                    multi>
                    <template is="dom-if" if="[[allowSearch]]">
                    <paper-input id="filterCt" label="filter" value="{{searchString}}"
                        on-tap="_stopEventPropagation"
                        on-keydown="_stopEventPropagation"
                        on-keyup="_stopEventPropagation"></paper-input>
                    </template>
                    <template is="dom-repeat" items="[[items]]" filter="{{_computeFilter(searchString)}}">
                    <!-- <paper-item name="[[doGet(keyPath,item)]]">[[doGet(labelPath,item)]]</paper-item> -->
                    <paper-item style$="[[getStyle(item)]]" name="[[getName(item)]]">[[getLabel(item)]]</paper-item>
                    </template>
                </paper-listbox>
                <slot id="content" name="dropdown-content"></slot>
            </paper-menu-button>
        </template>
        `;
    }
    
}

window.customElements.define(PaperTagsDropdown.is, PaperTagsDropdown)