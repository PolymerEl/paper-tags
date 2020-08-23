import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-icon-button/paper-icon-button';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-badge/paper-badge.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/polymer/polymer-legacy.js';
import {PaperTagsMixin} from './paper-tags-mixing';


class PaperTags extends PaperTagsMixin(PolymerElement){

    static get is() {
        return 'paper-tags';
      }

    
    static get properties () {
        return {

            itemClass: {
                type:String
            },

            icon: {
                type: String
            },

            classPath: {
                type: String
            },

            iconPath: {
                type: String
            },

            readonly: {
            type: Boolean
            },

            keyPath: {
                type: String,
                value: 'id'
            },

            labelPath: {
                type: String,
                value: 'label'
            },

            preventRemoveTag: {
                type: Boolean,
                value: false
            },

            items: {
            type: Array,
            notify: true,
            value: function() {
                return [];
            }
            },

            getStyle: {
            type: Function,
            value: function() {
                return this.getStyle.bind(this);
            }
            },
            getLabel: {
            type: Function,
            value: function() {
                return this.getLabel.bind(this);
            }
            }
        };
    }
    doGet(path, item, name) {
        if (!path && item && typeof item === 'string') {
        return item;
        }
        if(path && name) {
            return this.get(path, item) || this[name];
        }
        return '';
    }


    getLabel(item) {

        return this.doGet(this.labelPath, item, 'label');
    } 

    _removeTag(event) {
    event.stopPropagation();
    if (this.readonly) {
        return;
    }
    const index = this.items.indexOf(event.model.item);
    if (index > -1) {
        this.splice('items', index, 1);
    }
    }

    getStyle(item) {
    return '';
    }
    
    static get template () {
        return html `
        <style>
            [hidden] {
                display: none !important;
            }

            :host {
                display: block;
                @apply --paper-font-common-base;
                @apply --paper-tags;
            }

            div.paper-tag-item {
                margin-bottom: var(--paper-tag-margin, 3px);
                border: 1px solid var(--paper-tag-color, var(--primary-color));
                font-size: 13px;
                color: var(--paper-tag-text-color, var(--secondary-text-color));
                border-radius: 4px;
                @apply --paper-tag-item;
            }

            .paper-tag-item:last-of-type {
                margin-right: var(--paper-tag-margin, 3px);
            }

            paper-icon-button {
                color: var(--paper-tag-color, var(--primary-color));
                width: 20px;
                height: 20px;
                padding: 0;
            }

            .paper-tag-item-label {
                padding: var(--paper-tag-margin, 3px);
            }

            .paper-tag-item {
                display: inline-block;
            }
        </style>
        <template is="dom-repeat" items="[[items]]">
            <div style$="[[getStyle(item)]]" class$="paper-tag-item [[doGet(classPath, item, 'itemClass')]]">
                <span class="paper-tag-item-label">[[getLabel(item)]]</span>
                <paper-icon-button icon="[[doGet(iconPath, item, 'icon')]]"></paper-icon-button>
                <paper-icon-button icon="icons:close" hidden$="[[preventRemoveTag]]" on-tap="_removeTag"></paper-icon-button>
            </div>
        </template>
        `;
    }

}

customElements.define(PaperTags.is, PaperTags);