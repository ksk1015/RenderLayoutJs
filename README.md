# RenderLayoutJs

RenderLayoutJs is a lightweight JavaScript library that renders layouts without flickering on the client side, specifically for static HTML sites, without requiring a build process or server-side rendering.

```html
<!-- _layout.html -->
<header>
  <h1>RenderLayoutJs</h1>
</header>
<main>
  <!-- This slot element will be replaced with the content in the body -->
  <slot></slot>
</main>
<footer>
  <small>&copy; RenderLayoutJs</small>
</footer>
<script type="module">
  console.log('Layout is rendered')
</script>
```

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <title>RenderLayoutJs</title>
    <script src="./renderLayout.js" data-path="./_layout.html"></script>
  </head>
  <body>
    <p>Hello, this is content.</p>
  </body>
</html>
```

Result:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <title>RenderLayoutJs</title>
    <script src="./renderLayout.js" data-path="./_layout.html"></script>
  </head>
  <body>
    <header>
      <h1>RenderLayoutJs</h1>
    </header>
    <main>
      <p>Hello, this is content.</p>
    </main>
    <footer>
      <small>&copy; RenderLayoutJs</small>
    </footer>
    <script type="module">
      console.log('Layout is rendered')
    </script>
  </body>
</html>
```

## Usage

### Download RenderLayoutJs

Download the [renderLayout.js](https://raw.githubusercontent.com/ryota-murakami/render-layout-js/main/renderLayout.js) file and include it in your HTML file.

### Create a Layout File and load it in two ways

Set script tag with no defer, async, or type="module" attribute to render without flickering.

#### Call `renderLayout` function with Layout HTML string or function that returns the layout HTML string

```js
// layout.js
renderLayout(`
<header>
  <h1>RenderLayoutJs</h1>
</header>
<main>
  <slot></slot>
</main>
<footer>
  <small>&copy; RenderLayoutJs</small>
</footer>
<script type="module">
  console.log('Layout is rendered')
</script>
`)
```

```html
<script src="./renderLayout.js"></script>
<script src="./layout.js"></script>
```

#### Set `data-path` attribute to the layout text file

```html
<header>
  <h1>RenderLayoutJs</h1>
</header>
<main>
  <slot></slot>
</main>
<footer>
  <small>&copy; RenderLayoutJs</small>
</footer>
<script type="module">
  console.log('Layout is rendered')
</script>
```

```html
<script src="./renderLayout.js" data-path="./_layout.html"></script>
```

### Uses named slots to replace template content

No named slot is replaced with the content in the body, and the named slot is replaced with the content in the template element with the same id.

```html
<!-- _layout.html -->
<header>
  <h1>RenderLayoutJs</h1>
</header>
<main>
  <slot></slot>
</main>
<aside>
  <slot name="aside"></slot>
</aside>
<footer>
  <small>&copy; RenderLayoutJs</small>
</footer>
```

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <title>RenderLayoutJs</title>
    <script src="./renderLayout.js" data-path="./_layout.html"></script>
  </head>
  <body>
    <p>Hello, this is content.</p>
    <template id="aside">
      <p>This is aside content.</p>
    </template>
  </body>
</html>
```
