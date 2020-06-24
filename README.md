# ckeditor5-classic-image-resize
CKEditor5 Classic Image Resize Plugin

This plugin allows you to edit the size of an image using width and height input, as well as providing an aspect ratio lock tool that makes it easy to scale without distorting the image.

# Issues
Feel free to submit issues and enhancement requests.

# Installation

```
Coming soon...
```


# Usage

Update src/ckeditor.js with:
```javascript
import ClassicImageResize from 'ckeditor5-classic-image-resize';

Editor.builtinPlugins = [
  // ...
  ClassicImageResize,
  // ...
];

Editor.defaultConfig = {
  // ...
  image: {
    toolbar: [
      // ...
      'imageSize:lockAspectRatio',
      'imageSize:width',
      'imageSize:height',
      // ...
    ]
  },
  // ...
};
```
Then
```
npm run build
```
or
```
yarn build
```

