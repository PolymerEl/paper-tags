# seed-element

An element providing a starting point for your own reusable Polymer elements.


## Dependencies

Element dependencies are managed via [Bower](http://bower.io/). You can
install that via:

    npm install -g bower

Then, go ahead and download the element's dependencies:

    bower install


## Playing With Your Element

If you wish to work on your element in isolation, we recommend that you use
[Polyserve](https://github.com/PolymerLabs/polyserve) to keep your element's
bower dependencies in line. You can install it via:

    npm install -g polyserve

And you can run it via:

    polyserve

Once running, you can preview your element at
`http://localhost:8080/components/seed-element/`, where `seed-element` is the name of the directory containing it.


## Testing Your Element

Simply navigate to the `/test` directory of your element to run its tests. If
you are using Polyserve: `http://localhost:8080/components/seed-element/test/`

### web-component-tester

The tests are compatible with [web-component-tester](https://github.com/Polymer/web-component-tester).
Install it via:

    npm install -g web-component-tester

Then, you can run your tests on _all_ of your local browsers via:

    wct

#### WCT Tips

`wct -l chrome` will only run tests in chrome.

`wct -p` will keep the browsers alive after test runs (refresh to re-run).

`wct test/some-file.html` will test only the files you specify.


## still TODO
~~- input tags as behavior~~
~~- tags renamed items ?~~
~~- listen to iron-select and deselect~~
~~- fire unselect when close a tag~~
~~- do not toggle menu when click on close~~
~~- filter menu when change input~~
~~- include menu within the component ! ~~
~~- prevent close menu when tap on input~~
~~- open menu when input~~
~~- keep focus on input when click on input~~
~~- label up when tags ~~
~~- indicate the menu is filtered~~
~~- array and object-value~~
~~- value as a concatenation of arrayValue~~
~~- handle validator correctly (minTags and maxTags)~~
~~- documentation~~
~~- publish to bower~~
- implement validator for minItems and maxItems