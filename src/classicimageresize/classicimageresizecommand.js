import Command from '@ckeditor/ckeditor5-core/src/command';
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
        const imageUtils = this.editor.plugins.get( 'ImageUtils' );
        const element = this.editor.model.document.selection.getSelectedElement();
        this.isEnabled = imageUtils.isImage( element );

        let width = this.getMaxWidth( element );

        if (width) {
            this.value = {
                'max-width': width
            };
        } else {
            this.value = null;
        }

        this.isLockedAspectRatio = this.getIsLockedAspectRatio(element);
    }

    getMaxWidth(element) {
        let width = null;
        if ( element && element.hasAttribute( 'max-width' ) ) {
            width = element.getAttribute( 'max-width' );
        }
        return Number(width);
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
        console.log('exeCute');
        console.log(options);


        model.change( writer => {
            if (options['max-width']) {
                writer.setAttribute(
                    'max-width',
                    options['max-width'],
                    imageElement
                )
            }

            writer.setAttribute('isLockedAspectRatio', this.isLockedAspectRatio, imageElement);

/*            if (this.isLockedAspectRatio) {
                writer.setAttribute('height', null, imageElement);
            }

            if (!this.isLockedAspectRatio && options.height) {
                writer.setAttribute(
                    'height',
                    options.height,
                    imageElement
                )
            }*/

        });

        this.refresh();
    }
}
