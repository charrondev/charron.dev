---
name: PHP for Javascript Developers - Syntax
slug: php-for-javscript-developers-syntax
excerpt: Here's a cheatsheet showing PHP Syntax for Javascript developers.
tags:
    - PHP
    - Javascript
    - Typescript
    - Guide
---

_This is part 1 of a multi-part series of posts. You can read the second part, [PHP for Javascript Developers - Runtime, here](/posts/php-for-javscript-developers-runtime)._

## Foreword

A few years ago I started as frontend developer at [Vanilla Forums](https://vanillaforums.com)
knowing only frontend technologies like Javascript, Typescript, CSS, and HTML.

I've grown a lot as a developer since then, and a large part of that was becoming familiar with
backend technologies like PHP & MySQL. Recently a colleague asked for a resource to be quickly get familiar
with PHP. I searched around and didn't find the existing resources sufficient, so I've decided to start writing
a series of posts on quickly picking up PHP from the perspective of a frontend developer.

This series assumes solid prior knowledge of javascript.

## Variables

The following are equivalent.

```js
var myStr = "test";
var myStr2 = "test";
var myBool = true;
var myInt = 1314;
var myFloat = 1.142;

// Multiple assignment
// In my view this is often confusing and considered bad practice.
var thing1, thing2;
thing1 = thing2 = 4211;
```

```php
$myStr = "test";
$myStr2 = 'test';
$myBool = true;
$myInt = 1314;
$myFloat = 1.142;

// Multiple assignment
// In my view this is often confusing and considered bad practice.
$thing1 = $thing2 = 4211;
```

### Notable differences

- Local variables in PHP are always preceded by a `$`.
- PHP has no local variable equivalent to `const` or `let` in javascript.
  Every local PHP variable is scoped similar to a `var` in javascript.

    For example they are available across blocks.

```php
if ($someBool) {
    $newVar = "foo";
}

try {
    $newVar = "foo";
} catch ($err) {
    $errVar = $err;
}

// Can use $newVar here sometimes.
// Although this if the if statement didn't occur this will be an error or warning (depending on PHP version).
someFunction($newVar);
someFunction($errVar);
```

## Semicolons

Semicolons are required in PHP and optional in Javascript. If you are familiar with the places that semicolons **can** be placed in Javascript, you are **required** to place semicolons in those places in PHP.

## Strings

Strings in javascript and PHP are relatively similar, at least as far as syntax goes.

They differ slighly when it comes to interpolation and concatenation though.

```js
// Single quotes and double quotes are interchangable.
var foo = "foo";
var bar = "bar";

var obj = { key: "val" };
function getBazObj() {
    return {
        key: "baz",
    };
}

// Concat with the + operator.
var str3 = foo + bar + obj.key; //foobarval

// Interpolation with backtick strings.
var str4 = `${foo}-${bar}-${obj.key}`; // foo-bar-val
// Any expression is allowed
var str5 = `${foo}-${getBazObj().key}`; // foo-baz
// Multiple lines allowed.
var str6 = `
Line 1
Line 2
`;
```

```php
// Single quotes and double quotes are have different escaping behaviour.
// Escape sequences (like \n or \t are not interpretted).
$foo = 'foo\n';
$bar = "bar\n";
// $foo !== $bar

$obj = new \stdClass();
$obj->key = "val";
$arr = ["key" => "val"];
function getBazObj() {
    return [
        "key" => "baz",
    ];
}

// Concat with the . operator.
$str3 = $foo . $bar . $obj->key; //foobarval

// Interpolation with double quotes.
// Note the required brackets for array and object access.
$str4 = "$foo-$bar-{$obj->key}";
$str4 = "$foo-$bar-{$arr['key']}";

// ERROR, expressions are not allowed.
$str5 = "$foo-{getBazObj()['key']}";

// Multiple lines allowed in HEREDoc
// https://www.php.net/manual/en/language.types.string.php#language.types.string.syntax.heredoc
$str6 = <<<SOME_PREFIX
Line 1
Line 2
SOME_PREFIX;
```

## Arrays

Numberically indexed array syntax is equivalent between PHP and Javascript.

Arrays can be made up of multiple types, and use the `[` and `]` symbols to indicate start and end.

```js
["item1", "item2", 1, true, ["nested"]];
```

Older versions of PHP (PHP {"<="} 5.3) didn't support this array syntax and used `array(` and `)` to indicate the start and end of an array.

```php
array("item1", "item2", 1, true, array("nested"));
```

Nowadays the short syntax is preferred.

## Array Access

Numerically indexed array access is equivalent between PHP and javascript as well.

```js
var items = ["item1", "item2"];
var index = 1;
items[0]; // "item1"
items[1]; // "item2"
items[index]; // "item2"
```

```php
$items = ["item1", "item2"];
$index = 1;
$items[0]; // "item1"
$items[1]; // "item2"
$items[$index]; // "item2"
```

## Objects (PHP Assosciative Arrays)

Here's our first major difference between the two languages.
In PHP "array" has additional meanings than in javascript.

In Javascript you can quickly construct an object with the following syntax.

```js
var obj = {
    field1: "value",
    field2: true,
};
```

Here's the equivalent in PHP.

```php
$obj = [
    "field1" => "value",
    "field2" => true
];

// PHP <= 5.3
$obj = array(
    "field1" => "value",
    "field2" => true
);
```

The main differences are:

- Use brackets (`[]`) instead of curly braces (`{}`).
- Use `=>` instead of `:`.
- String keys **must** be quoted in PHP.

### Differentiating assosciative and indexed arrays in PHP

While javascript has a syntax differences between quicly declaring arrays and objects,
they are actually objects internally. For example

```js
var arr = [1, 2, 3];
typeof arr === "object"; // true

// To actually check if something is an array.
Array.isArray(arr); // true.
```

In PHP the differentiator between the two types of arrays is purely in the keys of the array.
JS equivalents will be in the comments.

```php
// These are equivalent.
["item1", "item2"]; // ["item1", "item2"]
[0 => "item1", 1 => "item2"]; // ["item1", "item2"]

// Numerical strings are treated as numbers.
["0" => "item1", "1" => "item2"]; // ["item1", "item2"]

// Keys are out of order.
[1 => "item1", 0 => "item2"]; // {"1": "item1", "0": "item2"}

// There is a hole.
[0 => "item1", 2 => "item2"]; // {"0" :"item1", "2": "item2"}

// Has a non-numeric key.
[0 => "item1", "foo" => "item2"]; // {"0": "item1", foo: "item2"}
```

## PHP Objects

These rules can be a bit tricky. PHP does have first class objects (instances of a class),
but there is no short syntax for instantiating them currently. There is [an RFC though](https://wiki.php.net/rfc/object-initializer#anonymous_classes).

```php
// { field1: "value", field2: true }
$obj = new stdClass();
$obj->field1 = "value";
$obj->field2 = true;
```

## Object property access

Javascript object access and PHP assosciated can be quite similar.

```js
var obj = { field1: "value" };
var key = "field1";
obj["field1"]; // "value"
obj[key]; // "value"

// Only in javascript.
obj.field1; // "value"
```

```php
$obj = [ "field1" => "value" ];
$key = "field1";
$obj["field1"]; // "value"
$obj[$key]; // "value"
```

Notably though these **are not objects** in PHP. In PHP an object is only ever instantiated from a class
with the `new` keyword. Property access works a bit differently.

```php
$obj = new stdClass();
$obj->field1 = "value";

// Property access looks the same as assignment.
$obj->field1; // "value"
```

### Undefined and null

Javascript has both `undefined` and `null` as first class built in concerete types.

PHP has a built-in `null`, but anything that would result in `undefined` would normally be considered an notice, error or warning depending on the situation.

```js
var obj = {
    val: null,
    val2: undefined,
};
var arr = [null, undefined];

obj[142]; // undefined
obj["hello"]; // undefined
obj["val"]; // null
obj.hello; // undefined
obj.val2; // undefined
obj.val; // null.
arr[0]; // null
arr[5]; // undefined.
arr[1]; // undefined.

// Check if property exists and is defined.
var exists;
exists = "thing" in obj;
exists = !!obj.thing; // false

obj.hello.other; // Error: cannot access property "other" on undefined.
```

Undefined property and array access in PHP is an Exception in PHP 8+.

In prior versions of PHP, such things would created a "notice" (basically a logged warning)
and evaluate to `null`.

```php
$obj = new stdClass();
// No way to set "undefined".
$obj->val = null;
$arr = [null];

$obj->{142}; // Exception
$obj->hello; // Exception
$obj->val; // null
$arr[0]; // null
$arr[5]; // Exception.
$arr["key"]; // Exception.

// Check if property exists and is defined.
$exists = property_exists($obj, "thing"); // false.
$exists = array_key_exists($obj, 0); // true
$exists = array_key_exists($obj, 5); // false
$exists = isset($obj->thing->nested->thing); // false
$exists = isset($arr['key']['nested']); // false
$exists = isset($obj->val); // true
$exists = isset($arr[0]); // true
```

### Null Coalescing and nullsafe operator

Javascript and PHP both have a null coalescing operator and null-safe operator in recent versions.

```js
myObj?.thing?.other?.[0] ?? "fallback";
myObj?.doThing();

// No equivalent in PHP.
myObj?.doThing?.();
```

```php
// PHP 7+
$myObj->thing['other'][0] ?? "fallback";
// PHP 8+
$myObj?->doThing();
```

## Functions

Functions declaration works looks pretty similar in PHP and Javascript.

```js
function myFunction(property1, property2, ...extraProperties) {
    // Do something.

    return thing;
}

// call the function
myFunction("thing", true, "extra", "extra2");
```

```php
function myFunction($property1, $property2, ...$extraProperties) {
    // Do something.

    return $thing;
}

myFunction("thing", true, "extra", "extra2");
```

### Hoisting

One notable difference is that javascript has a feature called "hoisting" for functions
and variables declared with `var` (but not ones declared with `let` or `const`).

Essentially this means you can some things before you declare them, and the javascript runtime
will "hoist" or move the declaration up before the usage. There is no equivalent in PHP.
you must declare things before using them.

```js
// Totally valid
myFunction(thing);

function myFunction(arg1) {}
var thing = 2;
```

```php
// Fatal Error
myFunction($thing);

function myFunction($arg1) {}
var $thing = 2;
```

### Lambas / Anonymous Functions

PHP and javascript both have anonymous functions but the syntax is slightly different.

The following are equivalent.

```js
var myFunc = function (arg1) {
    return true;
};
myFunc("hello");

// Anonymous Callbacks
functionWithCallback(function (arg1) {
    return true;
});

// Arrow functions
var myFunc2 = (arg1) => true;
var myFunc3 = (arg2) => {
    return true;
};
```

```php
// Anonymous Callbacks
$myFunc = function ($arg1) { return true };
$myFunc("hello");

functionWithCallback(function ($arg1) { return true });

// Arrow functions
// PHP 7.4+
var myFunc2 = fn ($arg1) => true

// INVALID SYNTAX
// Inline return expressions only are allowed.
// No return keyword.
var myFunc3 = fn ($arg2) => { return true }
```

### Closures

One major difference in javascript and PHP is in how closures. Javascript _automatically_ closes
over any values you use in a lambda. In PHP you have to _manual_ specify them (except for arrow functions).

```js
const outerVariable = "foo";
const outer2 = "bar";
function myFunc() {
    // Can automatically access outside variable. ("Close over" the variable automatically).
    const newVar = outerVariable + outer2;
}
```

```php
$outerVariable = "foo";
$outer2 = "bar";
// Can automatically access outside variable. ("Close over" the variable automatically).
$myFunc = fn () => $outerVariable . $outer2;

function myFunc() {
    // ERROR. Can not access outside variable.
    $newVar = $outerVariable . $outer2;
}

function myFunc() use ($outerVariable, $outer2) {
    // Valid.
    $newVar = $outerVariable . "bar";
}

// To modify the outside variable you need to dereference it.

function myFunc() use (&$outerVariable, $outer2) {
    // Valid.
    $outerVariable = $outer2;
}
```

### Passing Variable References and by value

Another notable difference between javascript and PHP is how variable references.

I'll just be doing a brief overview, but you may come across a sticky situation in the future.
If you do, please consult [the PHP documentation on references](https://www.php.net/manual/en/language.references.php).

In short this really about the ability to modify a variable after passing it to a function.
In my view code is clearer when passed variables are not modified in place, but instead copied, modified, and returned.

Sometimes there can be performance (or memory) concerns with copying things, so it can be desirable to modify them in place.

Here are the javascript semantics.

```js
function passVar(obj1, num, arr) {
    obj1.prop = "laptop"; // will CHANGE original.
    obj2 = { prop: "computer" }; // will NOT affect original.
    num = num + 1; // will NOT affect original.
    arr[0] = "hello"; // will CHANGE original.
    arr = ["newArr"]; // will NOT affect original.
}
```

```php
function passVar($obj, $num, $arr) {
    $obj->prop = "computer"; // will CHANGE original.
    $obj = new stdClass(); // will NOT affect original.
    $num = num + 1; // will NOT affect original.
    $arr[0] = "hello"; // will NOT affect original.
    $arr['prop'] = "laptop"; // will NOT affect original.
    $arr = ["newArr"]; // will NOT affect original.
}
```

Things may look different, but they actually are quite similar. The simple rule here,
is **objects** can be modified after being passed. A javascript array can be modified,
but as seen previously, a javscript array _is an object_.

The parameters can be re-assigned, but do not affect anything outside of the scope of the function.

PHP has a special operator that changes these sementics though. The derefence operator (`&`).

```php
function passVar(&$obj, &$num, &$arr) {
    $obj->prop = "computer"; // will CHANGE original.
    $obj = new stdClass(); // will CHANGE original.
    $num = num + 1; // will CHANGE original.
    $arr[0] = "hello"; // will CHANGE original.
    $arr['prop'] = "laptop"; // will CHANGE original.
    $arr = ["newArr"]; // will CHANGE original.
}
```

When using this operator, all of these examples will change the original value outside of the function.

## Conditionals

Conditionals in PHP work very similarly to in javascript, even down to the automatic co-coercion of values.

The main difference is the addition of the `elseif` keyword in addition to `else if`.

The differences are subtle, but both are generally equivalent if you use curly braces. You can check [the PHP documentation for details](https://www.php.net/manual/en/control-structures.elseif.php).

### Equality

Similar to javascript, PHP has both a `==` and a `===` operator, with similar semantics.
It's recommended to use `===` to avoid WTF moments.

### Ternaries

PHP and javascript both have ternary exrpressions (if/else shorthand).

```js
var result = someConditional ? "if true" : "if false";

// Shorthand
var result = someConditional || "fallback";
// Equivalent to
var result = someConditional ? someConditional : "fallback";
```

```php
$result = $someConditional ? "if true" : "if false";

// PHP specific shorthand.
$result = $someConditional ?: "fallback";
// Equivalent to
$result = $someConditional ? $someConditional : "fallback";
```

## Switch Statements

Switch statements in javascript and PHP functional equivalently for the most part.

## Loops

Basic loops are functionally identical between PHP and javascript.

```js
for (let i = 0; i < 10; i++) {
    // Do thing.

    // Skip the rest of the loop.
    continue;

    // Break out of the loop.
    break;
}

while (someCondition) {
    // Do thing.

    // Skip the rest of the loop.
    continue;

    // Break out of the loop.
    break;
}
```

```php
for ($i = 0; $i < 10; $i++) {
    // Do thing.

    // Skip the rest of the loop.
    continue;

    // Break out of the loop.
    break;
}

while (someCondition) {
    // Do thing.

    // Skip the rest of the loop.
    continue;

    // Break out of the loop.
    break;
}
```

### Iteration

The most notable difference is in looping over iterators.

```js
// Iterate array.
// Arrays are implicitly iterators.
for (const item of [1, 2, 3]) {
    // Do thing.
}

// Iterate object.
// An iterator must be created from an object.
// Build utilties for this are `Object.entries()` `Object.keys()` and `Object.values()`.
for (const [key, value] of Object.entries(obj)) {
    // Do thing.
}
```

```php
// Iterate an indexed or assosciative array
foreach ([1, 2, 3] as $item) {
    // Do thing
}

foreach ([1, 2, 3] as $index => $item) {
    // Do thing
}

foreach (['key' => 'value'] as $index => $item) {
    // Do thing
}

// Objects can be iterated only if they implement `\Iterable`.
foreach ($someIterable as $index => $value) {
    // Do thing.
}
```

## Generators & Iterables

A generator is essentially a function that returns an iterable.

```js
function* myGenerator() {
    yield "val1";
    yield "val2";
    yield "val3";
}

for (const item of myGenerator()) {
}
```

```php
// No special syntax.
function myGenerator() {
    yield "val1";
    yield "val2";
    yield "val3";
}

foreach (myGenerator() as $item) {
}
```

## Classes and Properties

PHP classes work similar to classes in the latest versions of javascript.

**Older Javascript**

```js
function MyClass(property) {
    this.property = property;
    this.method = function () {
        return this.property;
    };

    this.otherMethod = function () {
        return this.method();
    };
}

MyClass.staticProperty = "static property";
MyClass.staticMethod = function () {
    return "static thing";
};
MyClass.staticOtherMethod = function () {
    return MyClass.staticMethod();
};
```

**Modern Javascript**

```js
class MyClass extends OtherClass {
    static staticProperty = "static property";
    property;

    constructor(property) {
        super();
        this.property = property;
    }

    method() {
        return this.property;
    }

    otherMethod() {
        // Call other method.
        return this.method();
    }

    static staticMethod() {
        return "static thing";
    }

    static staticOtherMethod() {
        // Refence specific static method.
        return MyClass.staticMethod();

        // Reference current static method, even in subclass.
        return this.staticMethod();
    }
}

MyClass.staticProperty; // "static property";
MyClass.staticMethod(); // "static thing";
var instance = new MyClass("foo");
instance.property; // "foo"
instance.method(); // "foo"
```

**PHP**

```php
class MyClass extends OtherClass {

    public const CLASS_CONSTANT = "thing"; // Doesn't exist in JS.

    public static $staticProperty = "static property";
    private $property;

    public function __construct(property)  {
        parent::__construct();
        $this->property = $property;
    }

    public function method() {
        return $this->property;
    }

    public function otherMethod() {
        // Call other method.
        return $this->method();
    }

    public static function staticMethod() {
        return "static thing";
    }

    public static function staticOtherMethod() {
        // Equivalent.
        // Reference our own or parent static method.
        return MyClass::staticMethod();
        return self::staticMethod();

        // Allows subclass to override `staticMethod()`
        return static::staticMethod();
    }
}

MyClass::CLASS_CONSTANT; // "thing"
MyClass::$staticProperty; // "static property";
MyClass::staticMethod(); // "static thing";
$instance = new MyClass("foo");
$instance->property; // ERROR (visibility is private).
$instance->method(); // "foo"
```

### Notable Differences

- PHP classes support constants.
- PHP classes support visibility modifiers
    - none specified - `public` is assumed. It's good practice to specify a modifier though, and be carefully consider raising internal details above `private`.
    - `public` - Anything can access.
    - `protected` - The current class and subclasses can access.
    - `private` - The current class only can access. Subclasses cannot access.
- The `function` keyword is required.
- Properties and methods are access with `->` instead of `.`.
- Static properties, constants, and methods are accessed with `::`.
    - Fun fact, you can access instance methods with `::` as well, but it can look a little weird.
- `$this` references the current instance instead of `this`.
- `self` and `static` are used to reference static properties.
    - `self` accesses the classes own items and those of parent classes.
    - `static` accesses the classes own items and those of parent classes, and those of subclasses.
- `__construct` is used instead of `__constructor`.
- Use `parent::` instead of `super`

### Traits

PHP traits are a feature with no language equivalent in javascript. They are essentially a "piece" of a class that gets duplicated everywhere they are used.

[PHP Trait Documentation](https://www.php.net/manual/en/language.oop5.traits.php)

```php
trait MyTrait {
    public function doThing() {}
}

class MyClass {
    use MyTrait;
}

$instance = new MyClass();
$instance->doThing();

// ERROR - You can't instantiate a trait.
new MyTrait();
```

## Passing references to classes, methods, and functions

Javascript has first class functions. That is in javascript a function is a type that can be passed as a variable.

PHP instead has a concept of a `callable` which is a reference to some function somewhere.

```js
function myFunction () {}

class MyClass {
    method() {}
    static staticMethod();
}

var lambda = function () {};
lambda();

var arrow = () => {};
arrow();

var altClass = MyClass;
new altClass();

var altFunc = myFunction;
altFunc();

var altStaticMethod = MyClass.staticMethod;
altStaticMethod();

var instance = new MyClass();
var altMethod = instance.method;
altMethod();
```

```php
function myFunction () {}

class MyClass {
    public function method() {}
    public static function staticMethod();
}

$lambda = function () {};
$lambda();
call_user_func($lambda);

$arrow = fn () => {};
$arrow();
call_user_func($arrow);

$altClass = MyClass::class;
new $altClass();

$altClass = 'MyClass';
new $altClass();

$altFunc = 'myFunction';
$altFunc();

$altStaticMethod = [MyClass::class, 'staticMethod'];
call_user_func($altStaticMethod, ['param1', 5])

$instance = new MyClass();
$altMethod = [$instance, 'method'];
call_user_func($altStaticMethod, ['param1', 5])
```

### Notable Differences

Passing functions and classes around in PHP genreally involves referencing something by it's string name rather than a concrete object.

Notably classes are passed by string names. Any PHP class automatically has a constant on it `::class`, that will give you the fully qualified class name. This is mainly useful when dealing with namespaced classes.

Methods are passed as an array of 2 items.

Notably there are 2 built in functions to deal with `callables`.

- `is_callable($maybeCallable)` - Determine is something is callable.
- `call_user_func($callable, $arguments)` - Call a callable with some arguments.

## Namespaces

In PHP it is a fatal error to declare mutliple symbols with the same name, and since all symbols get loaded into the same scope (which lives for the duration of the program) you need some way to prevent conflicts.

For javascript, the solution is modules, which each have their own scope. It's not an error to have a function call `doTheThing()` in multiple javascript files in one project as long as they aren't both used in the same file.

Instead of modules, PHP uses namespaces. The idea is to have some prefix on your class names to distinguish them.

In the early days of PHP this would be done with very long class names, often starting with the vendor name, and then additional pieces for what part of the program it was. For example, `PHPUnit` (a major testing framework of PHP), has base test class that used to be called `PHPUnit_Framework_TestCase`. Unfortunately names like this can get quite wordy, so PHP added a feature called namespaces.

So instead of this:

```php
class PHPUnit_Framework_TestCase {}

PHPUnit_Framework_TestCase::assert();
```

you can do this:

```php
namespace PHPUnit\Framework;

class TestCase {}

// Other file

use PHPUnit\Framework\TestCase;

TestCase::assert();
// Or the full name
\PHPUnit\Framework\TestCase::assert();
```

### Using namespaces

- After declaring a `namespace` in your file, all following symbols will be considered part of that namespace.
- A `use` statement brings a class into scope and allows to refer to it by a shorted name.
    - `use \PHPUnit\Framework` would allow you to call `Framework\TestCase::assert()`.
    - `use \PHPUnit\Framework\TestCase` allows you to call `TestCase::assert()`.
    - If you call a class starting with a `\` character, it will ignore any `use` statements.
    - If you call a class without a `\` character:
        - It will check if there is a use statement for that short name.
        - Then check if that symbol is the current namespace.
