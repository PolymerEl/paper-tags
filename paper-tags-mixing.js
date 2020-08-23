/**
@license
Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import './value-array-firebase-mixin';
/**
 * `Polymer.PaperTagsMixin` defines recurent properties in paper-tags family (paper-tags, paper-tags-input, paper-tags-dropdown)
 *
 * @demo demo/index.html
 */
export const PaperTagsMixin = function(superClass) {
    return class extends ValueArrayFirebaseMixin(superClass) {
        static get properties() {
            return  {
                /**
                 * `itemClass` the class applied to tag items.  If `classAccessor` is defined, `classAccessor` will have precedence
                 */
                itemClass: String,
            
                /**
                 * `icon` icon to be applied to the tag item when it is not removable. If `iconAccessor` is defined, `iconAccessor` will have precedence
                 */
                icon: String,
            
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
                classPath: String,
                
                /**
                 * `iconPath` key for retrieving the `icon` from item data object
                 */
                iconPath: String,
            
                /**
                 * `preventRemoveTag` hide the `close` icon and prevent removing a tag when true. 
                 */
                preventRemoveTag: {
                  type: Boolean,
                  value: false
                }
              };
        }
    };
}