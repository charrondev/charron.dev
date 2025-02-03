---
name: PHP for Javascript Developers - Runtime
slug: php-for-javscript-developers-runtime
excerpt: Here's a cheatsheet showing aspects of the PHP runtime for Javascript developers.
tags:
    - PHP
    - Javascript
    - Typescript
    - Guide
---

_This is part 2 of a multi-part series of posts. You can read the first part, [PHP for Javascript Developers - Syntax, here](/posts/php-for-javscript-developers-syntax)._

This post covers some of the runtime differences between PHP and javascript and equivalent parts of each languages standard library.

It's worth noting that PHP has an extensive standard library, far larger than common in javascript. For example, PHP has classes for many common data structures, extensive utilities for data manipulation, official extensions for database connections, file-handling, network requests, and more.

## Built-in string utilities

```js
var result = "someStr".replace("search", "replacement");
var result = "someStr".replace(/regex/, "replacement");
var matches = "someStr".match(/regex/);
var pieces = "someStr".split(",");
var length = "someStr".length;
var trimmed = "  someStr \n".trim();
var boolResult = "someStr".endsWith("Str");
var boolResult = "someStr".startsWith("some");
var boolResult = "someStr".includes("eSt");
var lower = "someStr".toLowerCase();
var upper = "someStr".toUpperCase();
```

```php
$result = str_replace("search", "replacement", "someStr");
$result = preg_replace("/regex/", "replacement", "someStr");
preg_match("/regex/", $matches);
$pieces = explode(",", "someStr");
$length = strlen("someStr");
// Optionally specify characters to trim.
$trimmed = trim("  someStr \n", " \t\n\r");
$boolResult = str_ends_with("someStr", "Str");
$boolResult = str_starts_with("someStr", "some");
$boolResult = str_contains("someStr", "mSt");
$lower = strtolower("someStr");
$upper = strtoupper("someStr");
```

## Built-in numeric utilities

```js
Number.isFinite(100);
Number.isInteger(100);
!Number.isInteger(100.52);
Number.parseInt("100");
Number.parseFloat("100.42");
```

```php
is_finite(100);
is_integer(100);
is_float(100.52);
intval("100");
floatval("100.42");
```

## Built-in array utilities

```js
[].forEach((item, index) => {});
var strJoined = [].join(", ");
var mergedArray = arr1.concat(arr2, arr3, arr4);

var boolResult = [].includes("someVal");
[].splice(3, 20);
[].sort((a, b) => {});
var mapped = [].map((item, index) => {});
var filtered = [].filter((item, index) => {});
[].reduce((accumulator, nextValue) => {}, []);
var found = [].find((item) => {});
[].push("newItem");

[].unshift("newItemAtStart");
var lastItem = [].pop();
var firstItem = [].shift();
var reversed = [].reverse();
var someMatches = [].some((item) => {});
var allMatch = [].every((item) => {});
```

```php
foreach ([] as $index => $item) {}
$strJoined = implode(", ", []);
$mergedArray = array_merge($arr1, $arr2, $arr3, $arr4);
$mergedArray = $arr4 + $arr3 + $arr2 + $arr1;
$boolResult = in_array("someVal", [], true); // 3rd param for strict equality.
$modified = array_splice($arr, 3, 20);
$sorted = usort([], function ($a, $b) {});
$mapped = array_map(function ($item) {}, []);
$filtered = array_filter([], function ($item) {});
$reduced = array_reduce([], function ($accumulator, $item) {}, []);
// No equivalent to JS [].search()
array_push($arr, "newItemAtEnd");
$arr []= "val1";
array_unshift($arr, "newItemAtStart");
$lastItem = array_pop($arr);
$firstItem = array_shift($arr);
$reversed = array_reverse($arr);
$someMatches = iterable_any([], function ($item) {}); // RFC https://wiki.php.net/rfc/any_all_on_iterable
$allMatch = iterable_some([], function ($item) {}); // RFC https://wiki.php.net/rfc/any_all_on_iterable
```

## Built-in object utilities

```js
var obj = {
    key: "val",
};

const keys = Object.keys({});

const values = Object.values({});

const entries = Object.entries({});

const merged = Object.assign({}, obj1, obj2);
```

```php
$obj = new \stdClass();
$obj->key = "val";
$arr = ['key' => 'val'];

$keys = array_keys((array) $obj); // Manges private and protected keys.
$keys = array_keys(get_object_vars($obj)); // Gets properties based on current access level.
$keys = array_keys($arr);
$values = array_values((array) $obj); // Manges private and protected keys.
$values = array_values(get_object_vars($obj)); // Gets properties based on current access level.
$values = array_values($arr);
$entries = new ArrayIterator((array) $obj); // Manges private and protected keys.
$entries = new ArrayIterator(get_object_vars($obj)); // Gets properties based on current access level.
$entries = new ArrayIterator($arr);
$merged = (object) array_merge((array) $obj, (array) $obj2); // Manges private and protected keys. Lossy (will be \stdClass at end).
$merged = (object) array_merge(get_object_vars($obj), get_object_vars($obj2)); // Gets properties based on current access level. Lossy (will be \stdClass at end).
$merged = array_merge($arr, $arr2);
```

## Breaking Code into Multiple Files

Javascript and PHP both offer methods of splitting items into multiple files.

### ES Modules

For javascript this is ES Modules.

For browser code, it is quite common to use some build-time tool to like webpack to link all the files together.
Modern browsers are able to do this without a build-time tool, but this is not widely supported.

**a.js**

```js
export default class A {}
export function funcA() {}
```

**b.js**

```js
import A, { funcA } from "./a.js";
```

### PHP require & include

The most basic form of splitting PHP code is using either `require` or `include`.

All of these:

- Locate the requested file.
- Parse it.
- Execute the top level code.
- If the are any symbols declared (like a function of class), these will become available for the rest of the duration of the runtime.

```php
// Fatal error if the file does not exist.
require "./fileA.php";

// Fatal error if the file does not exist.
// Does nothing if the file has already been required.
require_once "./fileA.php";

// Warning if the file does not exist.
include "./fileA.php";

// Warning if the file does not exist.
// Does nothing if the file has already been required.
include_once "fileB.php";
```

There are some major downsides to manually managing includes though:

- If a try to use a symbol from a file that hasn't been included yet, it will generate a fatal error.
- You end up essentially needing to manage 1 giant list of files at the start of your program.

### PHP Autoloading

Since PHP 5.1 a feature called class autoloading was added. This works **only for classes and not functions** and as a result PHP developers tend to use classes and methods on those classes instead of functions.

The way it works, is the language has a few places that may try to instantiate a class, check it's existance, or find out various properties about it. The language will then check for various for programmer defined functions called autoloaders. It will call each autoloader it finds, pass them the name of the requested class, and allow it to do whatever it needs to to (most commonly locating the file with that class on the filesytem, and requiring or including it).

Autoloaders are registered through a method called `spl_autoload_register()`.

A PHP program can become organized like this.

```php
spl_autoload_register(function (string $className) {
    // Try to load the class from somewhere.
})

// Application will get loaded from the autoloader.
// Any classes that it uses will then get autoloaded as well.
Application::start();
```

### Composer

[Composer](https://getcomposer.org/) is a commonly used tool for PHP developers. You can think of it as a mix between NPM/yarn and webpack.

- It is a dependency manager. It fetches packages from somewhere (a registry, a github repo, the filesystem) and links them into a `/vendor` directory.
- It tracks dependencies in a `composer.json` file (similar to `package.json`) and keeps a lockfile `composer.lock` (similar to NPM's `package-lock.json` or yarn's `yarn.lock` file).
- It generates an efficient class autoloader for all of the vendored dependencies.
- It allows you to specify for patterns for locating PHP files based on class names in the `composer.json` file.
- It generates an autoloader for your own classes.

With composer to the structure of PHP program then becomes more like

```php
require_once "./vendor/autoload.php";

// Application will get loaded from the autoloader.
// Any classes that it uses will then get autoloaded as well.
Application::start();
```

You can have multiple autoloaders in a PHP program, so it's still possible to register your own as well.

### PSR-0 and PSR-4

PHP has had 2 defined standards for organizing files and autoloading them, both based on namespaces. Composer supports generating autoloaders for both of these structures.

[PSR-0](https://www.php-fig.org/psr/psr-0/)(now deprecated) worked with classes before the introduction of the namespace feature of the language. It's mapping worked like this.

- `Piece_Of_NameSpace_ClassName` -> `/root/Piece/Of/NameSpace/ClassName.php`

[PSR-4](https://www.php-fig.org/psr/psr-4/) maps to the file system according to the `\` character in the namespaces.

- `Piece\Of\NameSpace\ClassName` -> `/root/Piece/Of/NameSpace/ClassName.php`

## Async

Unlike Javascript and some other languages, PHP does not have built-in support for powerful asyncronous primitives such as Promises, Futures, async/await etc. Instead almost all functions and methods in the PHP standard libary are blocking.

Instead PHP web servers often run muliple PHP processes at the same time. PHP's build in php-fpm module is one example.

In a web-server like node, you often run in a single event loop handling multiple requests at the same time. As a result it's a bad idea to block the entire process to wait for something like a file from the filesystem, results from the database, or network request. As a the primitives offered in javascript runtimes are often asyncronous, working heavily with callbacks and promises.

Additionally web servers in javascript (or languages like java, C#, etc) tend to start up once, and continue running for a long period of time, handling numerous requests to the same process.

PHP-FPM runs in a different model. Instead every request spins up a fresh process, with no initialized state, with multiple processes running in parallel.
