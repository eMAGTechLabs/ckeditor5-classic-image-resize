import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ClassicImageResizeEditing from "./classicimageresize/classicimageresizeediting";
import ClassicImageResizeUi from "./classicimageresize/classicimageresizeui";

export default class ClassicImageResize extends Plugin {

    static get requires() {
        return [ ClassicImageResizeEditing, ClassicImageResizeUi ];
    }

    /**
     * @inheritDoc
     */
    static get pluginName() {
        return 'ClassicImageResize';
    }
}
