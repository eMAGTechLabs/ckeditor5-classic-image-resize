# ckeditor5-classic-image-resize
CKEditor5 Classic Image Resize Plugin

This plugin allows you to edit the size of an image using width and height input, as well as providing an aspect ratio lock tool that makes it easy to scale without distorting the image.


# Installation

```
npm i @emagtechlabs/ckeditor5-classic-image-resize
```
or
```
yarn add @emagtechlabs/ckeditor5-classic-image-resize
```

# Usage

Update src/ckeditor.js with:
```javascript
import ClassicImageResize from '@emagtechlabs/ckeditor5-classic-image-resize';

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

# How it works

### Upcasting
![Toolbar Inputs](https://bucket-doc-s1.s3.eu-central-1.amazonaws.com/images/Screenshot+from+2020-06-24+14-28-27.png)
<br/>
The plugin "upcasts" (reads from the DOM) the image `<img>` *style* attribute, checks for `width:` and `height:` and adds the values to the toolbar inputs.

### Editing
![Aspect Ratio Lock](https://bucket-doc-s1.s3.eu-central-1.amazonaws.com/images/Screenshot+from+2020-06-24+15-53-01.png)
<br/>
While editing, the *aspect ratio lock* can be used for scaling the image using its native aspect ratio. (note: it will only scale on the width axis)

### Downcasting
The plugin "downcasts" (writes to the DOM) the *style* attribute for both the `<img>` tag and the `<figure>` tag. This happens because images in ckeditor5 are wrapped in `<figure>` tags.


# Issues
Feel free to submit issues and enhancement requests.




