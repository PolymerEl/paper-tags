import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-badge/paper-badge.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-icons/social-icons.js';
import '@polymer/paper-input/paper-input.js';
import './paper-tags';
import '@polymer/iron-a11y-keys/iron-a11y-keys.js';

class PaperTagsInput extends PolymerElement {
    static get is() {
        return 'paper-tags-input'
      }
    static get properties() {
        return {
    
            /**
             * The label for this input. If you're using PaperInputBehavior to
             * implement your own paper-input-like element, bind this to
             * `<label>`'s content and `hidden` property, e.g.
             * `<label hidden$="[[!label]]">[[label]]</label>` in your `template`
             */
            label: {
                type: String
            },

            /**
             * `itemClass` the class applied to tag items.  If `classAccessor` is defined, `classAccessor` will have precedence
             */
            itemClass: {
                type: String
            },
                
            /**
             * `icon` icon to be applied to the tag item when it is not removable. If `iconAccessor` is defined, `iconAccessor` will have precedence
             */
            icon: {
                type:String
            },

            /**
             * `preventRemoveTag` hide the `close` icon and prevent removing a tag when true.
             */
            preventRemoveTag: {
                type: Boolean,
                value: false
            },

            /**
			* `keyPath` key for retrieving the `id` from item data object
			*/
            keyPath: {
                type: String,
                value: 'id'
            },

            /**
			* `labelPath` key for retrieving the `label` from item data object
			*/
            labelPath: {
                type: String,
                value: 'label'
            },

            /**
			* `classPath` key for retrieving the `class` from item data object
			*/
			classPath:{
                type: String
            },
			    
            /**
             * `iconPath` key for retrieving the `icon` from item data object
             */
            iconPath: {
                type: String
            },

          /**
           * `items` the Array of tags
           */
          items: {
            type: Array,
            notify: true
          },
          /**
           * `delimiter` defaults to comma (,)
           */
          delimiter: {
            type: String,
            value: ','
          },
          /**
           * `showCounter` display a paper-badge with `showCounter` as textContent
           */
          showCounter: {
              type: String
            },
    
          /**
           * `maxTags` The maximum allowed number of tags (yet to be implemented)
           */
          maxTags: {
              type:Number
          },
    
          /**
           * `minTags` The minimum allowed number of tags (yet to be implemented)
           */
          minTags: {
              type:Number
          },
    
          /**
           * `tagTpl` a template Object used when creating new tags. If not defuned, new tags will jus be Strings
           */
          tagTpl: {
              type: Object
          },
    
          /**
           * `value` the underlying paper-input value
           */
          value: {
            type: String,
            notify: true
          },
    
          /**
           * `preventAdd` prevents new tags to be added, mostly useful in context of paper-tags-dropdown (allowAdd)
           */
          preventAdd: {
            type: Boolean
          },
    
          /*
           * `getStyle` Style getter
           */
           getStyle: {
             type: Function
          },
           /*
           * `getName` Name getter
           */
           getName: {
             type: Function
          },
          /*
           * `getLabel` Label getter
           */
           getStyle: {
             type: Function
          },
        };
    }
    static get observers() {
        return [
          '_observeTagItemsInit(items)',
          '_observeTagItems(items.splices)'
        ];
    }
    
    connectedCallback() {
        super.connectedCallback();
          // this.super.connectedCallback();
          this.target = this.$.tagInput;
    }
    
    _observeTagItemsInit(items) {
    
        if(items[0] && (typeof items[0] === 'string' || typeof items[0] === 'number')  ) {
             this.labelPath = '';
             this.keyPath = '';
        }
        
        if (items && !this.valueArray) {
          this._observeTagItems(items);
        }
    
    }
    _observeTagItems(splices) {
        if (!splices) {
          return;
        }
        var keys = [];
       
        this.items.forEach((item) => {
            const type = typeof item;
          const id = type === 'string' || type ==='number' ? item  : this.getName ? this.getName(item) : this.get(this.keyPath, item);
          keys.push(id + '');
        });
    
        this.syncValueArrayWithKeys(keys);
    }
    
    _removeLast() {
          this.pop('items');
        // var last = this.items.pop();
        // this.items = this.items.slice();
        // this.fire('tag-removed', last);
    }
    
    findTag(tag) {
        return this.items.includes(tag);
    }
    
    _addTag(tag) {
        if (this.tagTpl) {
          var id = tag;
          tag = JSON.parse(JSON.stringify(this.tagTpl));
          tag[this.keyPath] = id + '';
          if (this.labelPath) {
            tag[this.labelPath] = id;
          }
        }
        this.push('items', tag);
        // this.items = this.items.slice();
        // this.fire('tag-added', tag);
    }
    
      /* 
       * `onEnter` add a new tag if key not already existing
       */
    onEnter() {
          if(this.readonly || this.perventAdd) {
              return;
          }
          const val = this.value;
          if(val && this.valueArray.indexOf(val) <= -1) {
              this._addTag(val);
              this.value = '';
          }
    
    }
    
    onBackspace() {
          if(this.readonly) {
              return;
          }
          const val = this.value;
          if(val === '') {
              this._removeLast();
          }
    
    }
    
         // Note(cg): we stop propagation to allow add items, even in the context of paper-tags-dropdown
    _onInputTap(e, d) {
          if(e.composedPath()[0].localName === 'input') {
              e.stopPropagation();
          }
          // console.info('INPUT',e, d);
          // if(e.srcElement.localName === 'paper-input' && !this.preventAdd) {
          // }
    }
    
      /**
       * Returns a reference to the focusable element.
       */
    get _focusableElement() {
        return this.$.tagInput.inputElement;
    }

    static get template() {
        return html `
        <style>
            :host {
                display: block;
                --paper-tag-margin: 3px;
            }

            paper-input {
                --paper-input-container-input: {
                    margin-bottom: var(--paper-tag-margin);
                }
            }

            paper-tags[readonly] {
                opacity: 0.6;
            }

            paper-badge {
                display: inline-block;
                position: inherit;
            }

            .paper-tags-counter {
                text-align: right;
                @apply --paper-font-caption;
                @apply --paper-input-char-counter;
            }
        </style>
        <template>
            <iron-a11y-keys id="a11y" target="[[target]]" keys="enter" on-keys-pressed="onEnter"></iron-a11y-keys>
                <iron-a11y-keys id="a11y" target="[[target]]" keys="backspace" on-keys-pressed="onBackspace"></iron-a11y-keys>
                <paper-input 
                    id="tagInput" 
                    always-float-label 
                    readonly$="[[readonly]]" 
                    placeholder$="[[placeholder]]" 
                    disabled$="[[disabled]]" 
                    label="[[label]]" 
                    value="{{value}}" 
                    on-tap="_onInputTap"
                    maxlength$="[[maxlength]]" 
                    error-message="[[errorMessage]]" 
                    minlength$="[[minlength]]" 
                    invalid="{{invalid}}">
                    <slot name="prefix" slot="prefix"></slot>
                    <paper-tags 
                        id="paperTags" 
                        readonly$="[[readonly]]" 
                        items="{{items}}" 
                        icon="[[icon]]"
                        get-style="[[getStyle]]"
                        get-name="[[getName]]"
                        get-label="[[getLabel]]"
                        item-class="[[itemClass]]" 
                        class-path="[[classPath]]" 
                        label-path="[[labelPath]]" 
                        icon-path="[[iconPath]]" 
                        prevent-remove-tag="[[preventRemoveTag]]" 
                        slot="prefix">
                    </paper-tags>
                    <slot name="suffix" slot="suffix"></slot>
                </paper-input>
                <template is="dom-if" if="{{showCounter}}">
                <div class="paper-tags-counter" >
                    <paper-badge class="paper-tags-badge" label="[[items.length]]"></paper-badge> [[showCounter]]
                </div>
                </template>
        </template>
        `;
    }
}

window.customElements.define(PaperTagsInput.is,PaperTagsInput)