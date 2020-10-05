---
name: "Getting to know QuillJS (Parchment, Blots, and Lifecycle)"
updated: 2020/10/04
tags:
    - Javascript
    - contenteditable
    - QuillJS
    - Parchment
---

_Note: This series is targeted at people trying to gain an advanced understanding of Quill and Parchment. If you're just trying to get started with an easy, well-featured editor, it might be good idea to check out Quill's [Quickstart Guide](https://quilljs.com/docs/quickstart/) or [Cloning Medium with Parchment guide](https://quilljs.com/guides/cloning-medium-with-parchment/)._

## What is Quill?

[QuillJS](https://quilljs.com/) is a modern rich text editor built for compatibility and extensibility. It was created by [Jason Chen](https://twitter.com/jhchen) and [Byron Milligan](https://twitter.com/byronmilligan) and open sourced by Salesforce. Since then it has been used by hundreds of other companies and people to build fast, reliable, and rich editing experiences in a browser.

Quill is a mostly batteries-included library with support for most common formatting options such **bold**, _italics_, ~~strike~~, underline, custom fonts and colors, dividers, headings, `inline code`, code blocks, blockquotes, lists (bulleted, numbered, checkboxes), formulas, images, as well as embedded videos.

## What more could you want?

A few months ago, the company I work for, [Vanilla Forums](https://github.com/vanilla) began planning a new editor for our product. Our current editor supported numerous different text entry formats, including

-   Markdown
-   BBCode
-   HTML
-   WYSIWYG HTML (using an iFrame to render the contents)

We had different parsers, renderers, and frontend javascript for all of these formats, so we set out to create new editor to replace them all with a single new unified, rich editing experience.

We chose Quill as the base of our new editor due to its browser compatibility and extensibility, but quickly realized that it was not going to have all of the functionality we needed out of the box. Notably lacking was multiline block type structures like block-quotes (missing nesting and multiline support). We have some other formatting items such as Spoilers with similar requirements.

We also had some extended functionality to add in the form of rich link embeds, and special formatting options and functionality for images and videos.

So I set to out to learn [Quill](https://github.com/quilljs/quill) and its underlying data library [Parchment](https://github.com/quilljs/parchment) inside and out. This series of posts represents my understanding of Parchment and QuillJS. I am not a maintainer of the project, so if something is incorrect here, I encourage you to point it out.

## Data Formats

Quill has 2 forms of data-formats. [Parchment](https://github.com/quilljs/parchment) (Blots), and [Delta](https://github.com/quilljs/delta).

Parchment is used as an in-memory data structure made up primarily of LinkedLists in a tree structure. Its tree of Blots should map 1:1 with the browser's tree of DOM Nodes.

Deltas are used to store persistant data from the editor and takes the form of a relatively flat JSON array. Each item in the array represents an operation, that could affect or represent multiple DOM Nodes or Blots. This is the form of data that you will generally store in your Database or persistent storage. It is also used to represent diffence between one state and another.

## What is a Blot?

Blots are the building blocks of a Parchment document. They are one of the most powerful abstractions of Quill, as they allow the editor and API users to consume and modify the document's contents without needing to touch the DOM directly. Blots have a simpler and more expressive interface than a DOM Node which can make consuming and creating them easier to reason about.

Each Blot must implement the interface `Blot` and every existing Blot in Quill and Parchment is a class that inherits from `ShadowBlot`.

In order to make it possible to look around the document from the perspective of a Blot, every Blot has the following references

-   `.parent` - The Blot that contains this Blot. If this Blot is the top level Blot, `parent` will be `null`.
-   `.prev` - The previous sibling Blot in the tree from this Blot's parent. If this iBlotis the first child directly under its `parent`, `prev` will be `null`.
-   `.next` - The next sibling Blot in the tree form this Blot's parent. If this Blot is the last child directly under its `parent`, `next` will be `null`.
-   `.scroll` - The scroll is the top level Blot in Parchment's data structure. More info about the Scroll Blot will be provided later.
-   `.domNode` - Since Parchment's tree maps 1:1 with the DOM's tree, each Blot has access to the `Node` it represents. Additionally these DOM Nodes will have a reference to their Blot (with `.__blot`).

## The Blot Lifecycle

Each Blot has several "lifecycle methods" that you can override to run code at particular times in the process. You generally will still want to call `super.<OVERRIDEN_METHOD>` before or after inserting your own custom code though. This component lifecycle is broken up into multiple sections.

### Creation

There are multiple steps in properly creating a Blot, but these can all be replaced with calling `Parchment.create()`

#### `Blot.create()`

Each Blot has a `static create()` function that creates a DOM Node from an initial value. This is also good place to set initial values on a DOM Node that are unrelated to the actual Blot instance.

The returned DOM Node is not actually attached anywhere, and the Blot is still not yet created. This is because Blots are created _from_ a DOM Node, so this function puts one together in case there isn't already one. Blots are not necesarilly always constructed with their create function. For example, when a user copy/pastes text (either from Quill or from another source) the copied HTML structure is passed to `Parchment.create()`. Parchment will skip calling create() and use the passed DOM Node, skipping to the next step.

```js
import Block from "quill/blots/block";

class ClickableSpan extends Inline {
    // ...

    static tagName = "span";
    static className = "ClickableSpan";

    static create(initialValue) {
        // Allow the parent create function to give us a DOM Node
        // The DOM Node will be based on the provided tagName and className.
        // E.G. the Node is currently <code class="ClickableSpan">{initialValue}</code>
        const node = super.create();

        // Set an attribute on the DOM Node.
        node.setAttribute("spellcheck", false);

        // Add an additional class
        node.classList.add("otherClass");

        // Returning <code class="ClickableSpan otherClass">{initialValue}</code>
        return node;
    }

    // ...
}
```

#### `constructor(domNode)`

Takes a DOM Node (often made in the `static create()` function, but not always) and creates a Blot from it.

This is the place to instantiate anything you might want to keep a reference to inside of a Blot. This is a good place to register an event listener or do anything you might normally do in a class constructor.

After the constructor is called, our Blot is still not in the DOM tree or in our Parchment document.

```js
class ClickableSpan extends Inline {
    // ...

    constructor(domNode) {
        super(domNode);

        // Bind our click handler to the class.
        this.clickHandler = this.clickHandler.bind(this);
        domNode.addEventListener(this.clickHandler);
    }

    clickHandler(event) {
        console.log("ClickableSpan was clicked. Blot: ", this);
    }

    // ...
}
```

---

### Registration

Parchment keeps a registry of all of your Blots to simplify creation of them. Using this registry, Parchment exposes a function `Parchment.create()` which can create a Blot either from its name - using the Blot's `static create()` function - or from an existing DOM Node.

In order to use this registry you need register your Blots using `Parchment.register()`. With Quill its better to use `Quill.register()`, which will call `Parchment.register()` internally. For more details on Quill's `register` function see [Quill's excellent documentation](https://quilljs.com/docs/api/#register).

```js
import Quill from "quill";

// Our Blot from earlier
class ClickableSpan extends Inline {
    /* ... */
}

Quill.register(ClickableSpan);
```

#### Ensuring Blots have Unique Identifiers

When creating a Blot with `Parchment.create(blotName)` and passing in a sting corresponding to a register `blotName`, you will always get the correct class instantiated. You could have 2 otherwise identical Blots with separate blotNames, and `Parchment.create(blotName)` will work correctly. However undefined behaviour can occur when using the other form of the method `Parchment.create(domNode)`.

While you might know the `blotName` when manually instantiating a Blot, there are instances where Quill needs to create a Blot from DOM Node, such as copy/pasting. In these cases your Blots need to be differentiated in one of 2 ways.

#### By tagName

```js
import Inline from "quill/blots/inline";

// Matches to <strong ...>...</strong>
class Bold extends Inline {
    static tagName = "strong";
    static blotName = "bold";
}

// Matches to <em ...>...</em>
class Italic extends Inline {
    static tagName = "em";
    static blotName = "italic";
}

// Matches to <em ...>...</em>
class AltItalic extends Inline {
    static tagName = "em";
    static blotName = "alt-italic";

    // Returns <em class="alt-italic">...</em>
    static create() {
        const node = super.create();
        node.classList.add("Italic--alt");
    }
}

// ... Registration here
```

In this case Parchment can easily distinguish between the `Bold` and `Italic` Blots when passed a DOM Node with the tag `em` or `strong`, but will be unable to make this distinction between `Italic` and `AltItalic`.

Currently the only other way for Parchment to tell the difference between these HTML structures is by setting a `static className` that matches an expected CSS class on the DOM Node passed in. If this is not provided you may find yourself manually creating an instance of a custom Blot through its `blotName` only to find an undo/redo or copy/paste action changes your Blot into a different type. This especially common when using a common `tagName` like `span` or `div`.

#### By className

```js
// ... Bold and Italic Blot from the previous example.

// Matches to <em class="alt-italic">...</em>
class AltItalic extends Inline {
    static tagName = "em";
    static blotName = "alt-italic";
    static className = "Italic--alt";

    // Returns <em class="alt-italic">...</em>
}
```

In this case the `static className` has been set. This means parent `ShadowBlot` will automatically apply the `className` to the element's DOM Node in the `static create()` function, and that Parchment will be able to differentiate between the 2 Blots.

---

### Insertion and Attachment

Now that a Blot is created we need to attach it both to Quill's document tree and the DOM tree. There are multiple ways to insert a Blot into the document.

#### `insertInto(parentBlot, refBlot)`

```js
const newBlot = Parchment.create("someBlotName", initialBlotValue);
const parentBlot = /* Get a reference to the desired parent Blot in some way */;
newBlot.insertInto(parentBlot);
```

This is the primary insertion method. The other insertion methods all call this one. It handles inserting a Blot into a parent Blot. By default this method will insert the `newBlot` at the end of the `parentBlot`'s children. Its DOM Node will also be appended to `parentBlot.domNode`.

If `refBlot` is passed as well, the `newBlot` will be inserted into the parent, except, instead of being inserted at the end of the `parentBlot`, the Blot will be inserted before `refBlot` and `newBlot.domNode` will be inserted before `refBlot.domNode`.

Additionally `newBlot.scroll` will be set at the end of this call using the `attach()` method. Details on that can be found later in this post.

#### `insertAt(index, name, value)`

This method is only available on Blots inheriting from `ContainerBlot`. A later post will cover `ContainerBlot` in more detail, but the most common of these Blots are `BlockBlot`, `InlineBlot`, and `ScrollBlot`. `EmbedBlot` and `TextBlot` do not inherit from `ContainerBlot`.

This method will call `Parchment.create()` for you with the passed `name`, and `value`. That newly created Blot will be inserted at the given `index`. If there nested containers at the given index, the call will be passed to container deepest in the tree and inserted there.

#### `insertBefore(childBlot, refBlot)`

This method is similar to `insertInto()` except reversed. Instead of a child inserting itself into a parent, the parent inserts the child into itself. Internally `insertInto()` is called and `refBlot` serves the same purpose here.

#### `attach()`

`attach()` attaches the calling Blot's parent's `ScrollBlot` to itself as the `.scroll` property. If the calling Blot is a container, it will also call attach on all of its children after setting its own `ScrollBlot`.

---

### Updates and Optimization

_Note: My understanding of this part of Parchment is still not complete. I will update it in future as I gain a better understanding. If anyone can help fill in the gaps, especially around how many times optimize() may called on children it would be much appreciated._

The `ScrollBlot` is the top level `ContainerBlot`. It holds all of the other Blots and is responsible for managing changes made inside of the [contenteditable](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Editable_content). In order to stay in control of the editor's contents, the `ScrollBlot` sets up a [MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver).

The `ScrollBlot` tracks the [MutationRecords](https://developer.mozilla.org/en-US/docs/Web/API/MutationRecord) and calls the `update()` method on every Blot who's DOM Node was the `target` of a `MutationRecord`. The relevant MutationRecords are passed as the parameter. Additionally a shared context is passed with every `update` call.

Then the `ScrollBlot` takes the same MutationRecords and calls the `optimize()` method on every affected Blot _as well as each of that Blot's children recursively to the bottom of the tree_. The releveant MutationRecords are passed in as well as the same shared context.

#### `update(mutations: MutationRecord[], sharedContext: Object)`

A Blot's update method is called with the MutationRecords targetting its DOM Node. A single context is shared among every Blot in a single update cycle.

There are 3 primary implementations of this method in different core Blots.

##### ContainerBlot

The `ContainerBlot` checks for changes that modify its direct children and will either:

-   Remove Blots from the document whose DOM Nodes have been deleted.
-   Add Blots for DOM Nodes that have been added.

If a new DOM Node is added that doesn't match any registered Blots, the container will remove that DOM Node and replace it with DOM Node corresponding to the `InlineBlot` (basically a plain text Blot) with the text content from the originally inserted DOM Node.

##### TextBlot

The `TextBlot` will replace its `value` with the new contents from the DOM Node as it exists in the DOM tree.

##### EmbedBlot

The `EmbedBlot` in parchment doesn't implement `update()`. Parchment's `EmbedBlot` and its descendant class in Quill `BlockEmbed` both have no control over Mutations of their child DOM Nodes.

Quill's other `EmbedBlot` descendant class `Embed` wraps its contents with 0-width space characters and sets `contenteditable=false` on the inner children. Inside of its `update()` method it checks if a MutationRecord would affect the `characterData` of these space characters. It it would, the Blot restores the original character data of the affected Node and inserts the change as text before or after itself.

#### `optimize(context)`

The `optimize()` method is called after an update pass completes. It is important to note that the `optimize` call should **_never_** change the length or value of the document. This is a good place to reduce the complexity of the document however.

To simplify, the `Delta` of a document should always be the same before or after an optimization pass.

By default Blots only cleanup leftover data from the update process, although a few Blots make some additional changes here.

##### Container

Empty `Containers` either remove themselves or add back their default child. Since the length of the document must be the same before and after the changes, the default child Blot must be a 0-length child. In the case of Quill's `Block` Blot, that child is a break.

##### Inline and List

Quill's `Inline` and `List` Blots both use optimize to simplify and make the DOM Tree more consistent.

As an example, the same Delta

```json
[
    {
        "insert": "bold",
        "attributes": {
            "bold": true
        }
    },
    {
        "insert": "bold italic",
        "attributes": {
            "bold": true,
            "italic": true
        }
    }
]
```

could be be rendered in 3 different ways.

```html
<strong>bold</strong><strong><em>bold italic</em></strong>
<!-- or -->
<strong>bold</strong><em><strong>bold italic</strong></em>
<!-- or -->
<strong>bold<em>bold italic</em></strong>
```

The Delta is the same, and this will generally be rendered mostly the same way, but the [optimize implementation in FormatBlot](https://github.com/quilljs/quill/blob/develop/blots/inline.js#L31-L40) ensures that these items always render consistently.

---

### Deletion and Detachment

#### `remove()`

The `remove()` method is often the simplest way to wholly remove a Blot and its DOM Node(s). It removes the Blot's `.domNode` from the DOM tree, then calls `detach()`.

#### `removeChild(blot)`

This method is only available on `ContainerBlot` and its descendant classes. Removes the passed Blot from the calling Blot's `.children`.

#### `deleteAt()`

Delete the Blot or contents at the specified index. Calls `remove()` internally.

#### `detach()`

Remove all references Quill has to the Blot. This includes removing the Blot from its parent with `removeChild()`. Also calls `detach()` on any child Blot's if applicable.

---

## Wrapping Up

This concludes the primary life cycle. Additional Blot methods such as `replace()`, `replaceWith()`, `wrap()`, and `unwrap()` will be covered in the next article in this series, "Containers - Creating a Mutliline Block".
