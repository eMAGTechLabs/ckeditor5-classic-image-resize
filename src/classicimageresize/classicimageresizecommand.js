import Command from '@ckeditor/ckeditor5-core/src/command';
import { isImage } from '@ckeditor/ckeditor5-image/src/image/utils';

/**
 * The image resize command. Currently, it supports both the width and the height attributes.
 *
 * @extends module:core/command~Command
 */
export default class ClassicImageResizeCommand extends Command {

    constructor( editor ) {
        super( editor );

        this.set('isLockedAspectRatio', undefined);

        this.value = null;
        this.isLockedAspectRatio = false;
    }

    init() {
        this.refresh();
    }

    /**
     * @inheritDoc
     */
    refresh() {
        const element = this.editor.model.document.selection.getSelectedElement();
        this.isEnabled = isImage( element );

        let height = this.getHeight( element );
        let width = this.getWidth( element );

        if (width || height) {
            this.value = {
                'width': width,
                'height': height
            };
        } else {
            this.value = null;
        }

        this.isLockedAspectRatio = this.getIsLockedAspectRatio(element);
    }

    getHeight(element) {
        let height = null;
        if ( element && element.hasAttribute( 'height' ) ) {
            height = element.getAttribute( 'height' );
        }

        return height;
    }

    getWidth(element) {
        let width = null;
        if ( element && element.hasAttribute( 'width' ) ) {
            width = element.getAttribute( 'width' );
        }

        return width;
    }

    getIsLockedAspectRatio(element) {
        let isLockedAspectRatio = null;
        if ( element && element.hasAttribute( 'isLockedAspectRatio' ) ) {
            isLockedAspectRatio = element.getAttribute( 'isLockedAspectRatio' );
        }

        return isLockedAspectRatio;
    }

    /**
     * Executes the command.
     * @param {Object} options
     * @param {String|null} options.width The new width of the image.
     * @param {String|null} options.height The new height of the image.
     * @fires execute
     */
    execute( options ) {
        const model = this.editor.model;
        const imageElement = model.document.selection.getSelectedElement();
        if (options.lockAspectRatio !== undefined) {
            this.isLockedAspectRatio = options.lockAspectRatio;
        }

        model.change( writer => {
            if (options.width) {
                writer.setAttribute(
                    'width',
                    options.width,
                    imageElement
                )
            }

            writer.setAttribute('isLockedAspectRatio', this.isLockedAspectRatio, imageElement);

            if (this.isLockedAspectRatio) {
                writer.setAttribute('height', null, imageElement);
            }

            if (!this.isLockedAspectRatio && options.height) {
                writer.setAttribute(
                    'height',
                    options.height,
                    imageElement
                )
            }

        });

        this.refresh();
    }
}