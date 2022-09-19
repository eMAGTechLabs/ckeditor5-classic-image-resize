import Plugin from "@ckeditor/ckeditor5-core/src/plugin";
import ClassicImageResizeCommand from "./classicimageresizecommand";
import ImageUtils from "@ckeditor/ckeditor5-image/src/imageutils";

export default class ClassicImageResizeEditing extends Plugin {
    /**
     * @inheritDoc
     */
    static get requires() {
        return [ ImageUtils ];
    }
    /**
     * @inheritDoc
     */
    static get pluginName() {
        return 'ImageSizeEditing';
    }

    /**
     * @inheritDoc
     */
    init() {
        const editor = this.editor;
        const schema = editor.model.schema;

        // Register imageSize command.
        editor.commands.add( 'imageMaxWidth', new ClassicImageResizeCommand( editor ) );
        /*schema.register( 'imageInline', {
          allowWhere: '$text',
          isInline: true,
          isObject: true,
          allowAttributes: [
            'equation', 'type', 'display', 'fontBackgroundColor', 'fontColor' //allow fontBackgroundColor and fontcolor
          ]
        } );
        schema.register( 'imageBlock', {
            allowWhere: '$text',
            isInline: true,
            isObject: true,
            allowAttributes: [
                'equation', 'type', 'display', 'fontBackgroundColor', 'fontColor' //allow fontBackgroundColor and fontcolor
            ]
        } );*/

        schema.extend( 'imageInline', {
            allowAttributes: [
                'max-width'
            ]
        } );
        schema.extend( 'imageBlock', {
          allowAttributes: [
            'max-width'
          ]
        } );
        this._registerConverters( editor, 'imageBlock' );
        this._registerConverters( editor, 'imageInline' );
    }

    _registerConverters( editor , imageType ) {
        editor.conversion.for( 'downcast' ).add( dispatcher =>
            dispatcher.on( `attribute:max-width:${ imageType }`, ( evt, data, conversionApi ) => {
                console.log('downcast');
                console.log(evt.name);
                console.log(data);

                if ( !conversionApi.consumable.consume( data.item, evt.name ) ) {
                    return;
                }

                const viewWriter = conversionApi.writer;
                const figure = conversionApi.mapper.toViewElement( data.item );

                if ( data.attributeNewValue !== null ) {
                    viewWriter.setStyle( 'max-width', data.attributeNewValue + 'px', figure );
                    viewWriter.addClass( 'image_resized', figure );
                } else {
                    viewWriter.removeStyle( 'max-width', figure );
                    viewWriter.removeClass( 'image_resized', figure );
                }
            } ));

        // upcast
        // View -> Model
        // _viewToModelConverter
        editor.conversion.for( 'upcast' ).attributeToAttribute( {
            view: {
                name: imageType === 'imageBlock' ? 'figure' : 'img',
                styles: {
                    'max-width': /.+/
                }
            },
            model: {
                key: 'max-width',
                value: viewElement => {
                    console.log('viewElement attributeToAttribute');
                    console.log(viewElement);
                    console.log(viewElement.getStyle('max-width').match(/\d+/g));
                    return viewElement.getStyle('max-width').match(/\d+/g);
                }
            },
            converterPriority: 'low'
        } );
    }
}
